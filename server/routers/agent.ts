import { router, protectedProcedure } from "../_core/trpc";
import { BillionaireableAgent } from "../agent/billionaireable";

export const agentRouter = router({
  /**
   * Get daily briefing from Billionaireable AI
   */
  getDailyBriefing: protectedProcedure.query(async ({ ctx }) => {
    const agent = new BillionaireableAgent(ctx.user.id);
    const briefing = await agent.generateDailyBriefing();
    return { briefing };
  }),

  /**
   * Analyze dashboard and get insights
   */
  analyze: protectedProcedure.query(async ({ ctx }) => {
    const agent = new BillionaireableAgent(ctx.user.id);
    const analysis = await agent.analyze();
    return analysis;
  }),

  /**
   * Detect anomalies in metrics
   */
  detectAnomalies: protectedProcedure.query(async ({ ctx }) => {
    const agent = new BillionaireableAgent(ctx.user.id);
    const anomalies = await agent.detectAnomalies();
    return { anomalies };
  }),

  /**
   * Generate forecasts
   */
  generateForecasts: protectedProcedure.query(async ({ ctx }) => {
    const agent = new BillionaireableAgent(ctx.user.id);
    const forecasts = await agent.generateForecasts();
    return forecasts;
  }),

  /**
   * Check relationships needing follow-up
   */
  checkRelationships: protectedProcedure.query(async ({ ctx }) => {
    const agent = new BillionaireableAgent(ctx.user.id);
    const relationships = await agent.checkRelationships();
    return { relationships };
  }),
});
