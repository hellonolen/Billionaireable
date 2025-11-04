import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  chat,
  generateProactiveInsight,
  analyzeVoiceTranscription,
} from "../ai-companion";
import {
  getConversationHistory,
  getCompanionSettings,
  updateCompanionSettings,
  saveVoiceTranscription,
  getUserInsights,
} from "../ai-companion-db";

export const aiCompanionRouter = router({
  /**
   * Send a message to the AI companion
   */
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await chat(ctx.user.id, input.message);
      return { response };
    }),

  /**
   * Get conversation history
   */
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const history = await getConversationHistory(ctx.user.id, input.limit);
      return history;
    }),

  /**
   * Get proactive insight
   */
  getProactiveInsight: protectedProcedure.query(async ({ ctx }) => {
    const insight = await generateProactiveInsight(ctx.user.id);
    return { insight };
  }),

  /**
   * Get companion settings
   */
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const settings = await getCompanionSettings(ctx.user.id);
    return settings;
  }),

  /**
   * Update companion settings
   */
  updateSettings: protectedProcedure
    .input(
      z.object({
        voiceListeningEnabled: z.boolean().optional(),
        proactiveInsightsEnabled: z.boolean().optional(),
        preferredLanguage: z.string().optional(),
        personalityStyle: z.enum(["supportive", "challenging", "balanced"]).optional(),
        notificationFrequency: z.enum(["realtime", "daily", "weekly"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const settings = await updateCompanionSettings(ctx.user.id, input);
      return settings;
    }),

  /**
   * Save voice transcription
   */
  saveVoiceTranscription: protectedProcedure
    .input(
      z.object({
        transcript: z.string().min(1),
        duration: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Save transcription
      await saveVoiceTranscription({
        userId: ctx.user.id,
        transcript: input.transcript,
        duration: input.duration,
        metadata: { timestamp: new Date().toISOString() },
      });

      // Analyze transcription
      await analyzeVoiceTranscription(ctx.user.id, input.transcript);

      return { success: true };
    }),

  /**
   * Get user insights
   */
  getInsights: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const insights = await getUserInsights(ctx.user.id, input.limit);
      return insights;
    }),
});
