
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { GoogleGenAI, Type } from "@google/genai";
import { TRPCError } from "@trpc/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface VoicemailAnalysis {
  summary: string;
  priority: "Low" | "Medium" | "High" | "Emergency";
  patient_name?: string;
  medical_tags: string[];
  transcription: string;
}



// No auth implemented so all routes are public
export const voicemailRouter = createTRPCRouter({
//   // 1. Add new voicemail
  create: publicProcedure
    .input(z.object({ audioUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const voicemail = await ctx.db.voicemail.create({
        data: { audioUrl: input.audioUrl, status: "PENDING" },
      });
      
      // TRIGGER BACKGROUND AI TASK HERE
      // await inngest.send({ name: "voicemail.process", data: { id: voicemail.id } });
      
      return voicemail;
  }),

  transcribe: publicProcedure
    .input(z.object({ voicemailUrl: z.string().url(), mimeType: z.string().default("audio/webm") }))
    .mutation(async ({ input }) => {
      const prompt = `
        You are transcribing a real audio voicemail recording.
  
        IMPORTANT: Only transcribe what is actually spoken in the audio.
        If you cannot hear or process the audio, respond with transcription: "Unable to process audio"
        Do NOT generate or assume any content that isn't in the recording.
        
        Requirements:
        1. Transcribe the text accurately.
        2. Provide a brief medical summary of the audio file
        3. Assign a priority based on the level of clinical urgency: Emergency, High, Medium, or Low.
        4. Detect the name of the patient or unknown if unstated
        3. Suggest 2-3 medical tags.
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
          priority: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High", "Emergency"],
            description: "Triage priority level based on clinical urgency.",
          },
          patient_name: {
            type: Type.STRING,
            description: "Identified patient name or 'Unknown'.",
          },
          medical_tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Relevant departments or topics (e.g., Cardiology, Refill).",
          },
        },
        required: ["summary", "priority", "medical_tags", "transcription"],
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

  // Get triage list
  getTriageList: publicProcedure.query(({ ctx }) => {
    return ctx.db.voicemail.findMany({
      where: { resolvedAt: null },
      orderBy: [
        { urgency: 'desc' }, // Emergency first
        { createdAt: 'desc' }
      ],
    });
  }),

  // Get inbox of all overnight voicemails
  getInbox: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.voicemail.findMany({
      where: {
        resolvedAt: null, // Don't show completed work
      },
      orderBy: [
        // This is the "Intelligent Sort" logic
        { urgency: 'desc' }, // High/Emergency first
        { createdAt: 'asc' },  // Then oldest to newest within that urgency level
      ],
    });
  }),
});