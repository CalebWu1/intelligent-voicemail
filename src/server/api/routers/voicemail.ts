
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { GoogleGenAI, Type } from "@google/genai";
import { TRPCError } from "@trpc/server";
import type { UrgencyLevel, Department, Prisma } from "generated/prisma";
import { env } from "~/env";


interface VoicemailAnalysis {
  transcription: string;
  summary: string;
  department: "General" | "Cardiovascular" | "Skeletal" | "Muscular" | "Nervous" | "Respiratory" | "Digestive" | "Urinary" | "Immune" | "Endocrine" | "Integumentary" | "Reproductive"
  priority: "Low" | "Medium" | "High" | "Emergency";
  patient_name?: string;
  doctor_name?: string;
  medical_tags: string[];
}


// No auth implemented so all routes are public
export const voicemailRouter = createTRPCRouter({
  // 1. Add new voicemail
  addVoicemail: publicProcedure
  .input(z.object({ 
    audioUrl: z.string(),
    processedData: z.object({
      transcription: z.string(),
      summary: z.string(),
      department: z.enum(["General", "Cardiovascular", "Skeletal", "Muscular", "Nervous", "Respiratory", "Digestive", "Urinary", "Immune", "Endocrine", "Integumentary", "Reproductive"]),
      priority: z.enum(["Low", "Medium", "High", "Emergency"]),
      patient_name: z.string().optional(),
      doctor_name: z.string().optional(),
      medical_tags: z.array(z.string()),
    })
  }))
  .mutation(async ({ ctx, input }) => {
    const voicemail = await ctx.db.voicemail.create({
      data: {
        audioUrl: input.audioUrl,
        transcript: input.processedData.transcription,
        summary: input.processedData.summary,
        department: input.processedData.department.toUpperCase() as Department,
        priority: input.processedData.priority.toUpperCase() as UrgencyLevel,
        patientName: input.processedData.patient_name ?? 'unknown',
        doctorName: input.processedData.doctor_name ?? 'unknown',
        medicalTags: input.processedData.medical_tags,
        status: "PENDING",
      }
    });

    return voicemail;
  }),

  transcribe: publicProcedure
    .input(z.object({ voicemailUrl: z.string().url(), mimeType: z.string().default("audio/webm") }))
    .mutation(async ({ input }) => {
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
      const prompt = `
        You are transcribing a real audio voicemail recording.
  
        IMPORTANT: Only transcribe what is actually spoken in the audio.
        If you cannot hear or process the audio, respond with transcription: "Unable to process audio"
        Do NOT generate or assume any content that isn't in the recording.
        
        Requirements:
        1. Transcribe the text accurately.
        2. Provide a brief medical summary of the audio file
        3. Assign a department based on the patients injury: General, Cardiovascular, Skeletal, Muscular, Nervous, Respiratory, Digestive, Urinary, Immune, Endocrine, Integumentary, Reproductive.
        4. Assign a priority based on the level of clinical urgency: Emergency, High, Medium, or Low.
        5. Detect the name of the patient or unknown if unstated
        6. Detect the name of the doctor or unknown if unstated
        7. Suggest 2-3 medical tags.
        Return as JSON.
      `;

      const schema = {
        type: Type.OBJECT,
        properties: {
          transcription: {
            type: Type.STRING,
            description: "The full text of the recording.",
          },
          summary: {
            type: Type.STRING,
            description: "Brief medical summary of the voicemail.",
          },
          department: {
            type: Type.STRING,
            enum: ["General", "Cardiovascular", "Skeletal", "Muscular", "Nervous", "Respiratory", "Digestive", "Urinary", "Immune", "Endocrine", "Integumentary", "Reproductive"],
            description: "Triage based on the most relevant department",
          },
          priority: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High", "Emergency"],
            description: "Triage priority level based on clinical urgency.",
          },
          patient_name: {
            type: Type.STRING,
            description: "Identified patient name or 'Unknown'.",
          },
          doctor_name: {
            type: Type.STRING,
            description: "Identified doctor name or 'Unknown'.",
          },
          medical_tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Relevant topics (e.g., Cardiology, Refill).",
          },
        },
        required: ["transcription", "summary", "department", "priority", "patient_name", "doctor_name", "medical_tags"],
      }

      const audioResponse = await fetch(input.voicemailUrl);
      const audioBuffer = await audioResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: input.mimeType,
                data: audioBase64,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const text = response.text;
      if (!text) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No response from Gemini" });

      return JSON.parse(text) as VoicemailAnalysis;
    }),

  // Get inbox of all overnight voicemails
  getInbox: publicProcedure
  .input(z.object({
    sortBy: z.enum(['newest', 'oldest', 'urgency_asc', 'urgency_desc']).default('urgency_desc'),
    urgency: z.enum(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']).default('ALL'),
  }))
  .query(async ({ ctx, input }) => {
    // Sorting priority will be urgency_desc, oldest
    const orderBy: Prisma.VoicemailOrderByWithRelationInput[] =
      input.sortBy === 'newest' ? [{ createdAt: 'desc'}, {priority: 'desc' }]
      : input.sortBy === 'oldest' ? [{ createdAt: 'asc'}, {priority: 'desc' }]
      : input.sortBy === 'urgency_desc' ? [{ priority: 'desc' }, { createdAt: 'desc' }]
      : [{ priority: 'asc' }, { createdAt: 'desc' }];

    return ctx.db.voicemail.findMany({
      // Only fetch uncompleted work
      where: {
        resolvedAt: null,
        ...(input.urgency !== 'ALL' && { priority: input.urgency as UrgencyLevel }),
      },
      orderBy,
    });
  }),

  markComplete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.voicemail.update({
        where: { id: input.id },
        data: { resolvedAt: new Date(), status: "COMPLETED" },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.voicemail.findUnique({ where: { id: input.id } });
    }),

  getNumPending: publicProcedure.query(async ({ ctx }) => {
      return await ctx.db.voicemail.count({ where: { status: "PENDING" } });
    }),
  getFailed: publicProcedure.query(async ({ ctx }) => {
      return await ctx.db.voicemail.count({ where: { status: "FAILED" } });
    }),
  getCompletedTranslations: publicProcedure.query(async ({ ctx }) => {
      return await ctx.db.voicemail.count({ where: { status: {not: "FAILED"} } });
    }),
  countUrgency: publicProcedure.query(async ({ ctx }) => {
    const counts = await ctx.db.voicemail.groupBy({
      by: ['priority'],
      _count: {
        priority: true,
      },
      where: {
        priority: {
          in: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']
        }
      }
    });
    const result = [0, 0, 0, 0]; // [LOW, MEDIUM, HIGH, EMERGENCY]
  
    // Fill in the actual counts
    counts.forEach((item: { priority: string; _count: { priority: number } }) => {
      switch (item.priority) {
        case 'LOW':
          result[0] = item._count.priority;
          break;
        case 'MEDIUM':
          result[1] = item._count.priority;
          break;
        case 'HIGH':
          result[2] = item._count.priority;
          break;
        case 'EMERGENCY':
          result[3] = item._count.priority;
          break;
      }
    });

    return result;
  }),

  updateVoicemail: publicProcedure
  .input(z.object({
    id: z.string(),
    patientName: z.string().nullable(),
    doctorName: z.string().nullable(),
    summary: z.string().nullable(),
    transcript: z.string().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']),
    department: z.enum(['GENERAL','CARDIOVASCULAR','SKELETAL','MUSCULAR','NERVOUS','RESPIRATORY','DIGESTIVE','URINARY','IMMUNE','ENDOCRINE','INTEGUMENTARY','REPRODUCTIVE']),
    medicalTags: z.array(z.string()),
  }))
  .mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.voicemail.update({
      where: { id },
      data,
    });
  }),

});