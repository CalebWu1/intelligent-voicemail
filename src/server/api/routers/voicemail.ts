
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { InputJsonValue, JsonObject } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";


// No auth implemented so all routes are public
export const voicemailRouter = createTRPCRouter({
//   // 1. Add new voicemail
//   create: protectedProcedure
//     .input(z.object({ audioUrl: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const voicemail = await ctx.db.voicemail.create({
//         data: { audioUrl: input.audioUrl, status: "PENDING" },
//       });
      
//       // TRIGGER BACKGROUND AI TASK HERE
//       // await inngest.send({ name: "voicemail.process", data: { id: voicemail.id } });
      
//       return voicemail;
//     }),

//   // Get triage list
//   getTriageList: protectedProcedure.query(({ ctx }) => {
//     return ctx.db.voicemail.findMany({
//       where: { resolvedAt: null },
//       orderBy: [
//         { urgency: 'desc' }, // Emergency first
//         { createdAt: 'desc' }
//       ],
//     });
//   }),

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

// function createTRPCRouter(arg0: {
//   // 1. Submit a new voicemail (from the simulation)
//   create: TRPCMutationProcedure<{ input: any; output: any; meta: object; }>;
//   // 2. High-speed Triage View (Filtered for Admin)
//   getTriageList: any;
// }) {
//   throw new Error("Function not implemented.");
// }
