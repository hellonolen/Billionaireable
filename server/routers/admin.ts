import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { dashboardSections } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// In-memory settings store (replace with database later)
let settings: Record<string, any> = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  plaidClientId: process.env.PLAID_CLIENT_ID || "",
  plaidSecret: process.env.PLAID_SECRET || "",
  whoopApiKey: process.env.WHOOP_API_KEY || "",
  ouraApiKey: process.env.OURA_API_KEY || "",
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || "",
  maintenanceMode: false,
  allowNewSignups: true,
  maxFreeUsers: 1000,
};

export const adminRouter = router({
  getSettings: adminProcedure.query(() => {
    // Don't return actual secret values, just indicate if they're set
    return {
      ...settings,
      stripeSecretKey: settings.stripeSecretKey ? "••••••••" : "",
      stripePublishableKey: settings.stripePublishableKey ? "••••••••" : "",
      stripeWebhookSecret: settings.stripeWebhookSecret ? "••••••••" : "",
      openaiApiKey: settings.openaiApiKey ? "••••••••" : "",
      plaidSecret: settings.plaidSecret ? "••••••••" : "",
      whoopApiKey: settings.whoopApiKey ? "••••••••" : "",
      ouraApiKey: settings.ouraApiKey ? "••••••••" : "",
      sendgridApiKey: settings.sendgridApiKey ? "••••••••" : "",
    };
  }),

  saveSettings: adminProcedure
    .input(z.object({
      stripeSecretKey: z.string().optional(),
      stripePublishableKey: z.string().optional(),
      stripeWebhookSecret: z.string().optional(),
      openaiApiKey: z.string().optional(),
      plaidClientId: z.string().optional(),
      plaidSecret: z.string().optional(),
      whoopApiKey: z.string().optional(),
      ouraApiKey: z.string().optional(),
      sendgridApiKey: z.string().optional(),
      discordWebhookUrl: z.string().optional(),
      maintenanceMode: z.boolean().optional(),
      allowNewSignups: z.boolean().optional(),
      maxFreeUsers: z.number().optional(),
    }))
    .mutation(({ input }) => {
      // Update settings (only update non-empty values)
      Object.keys(input).forEach((key) => {
        const value = input[key as keyof typeof input];
        if (value !== undefined && value !== "") {
          settings[key] = value;
        }
      });
      
      return { success: true };
    }),

  getStats: adminProcedure.query(async () => {
    // TODO: Get real stats from database
    return {
      totalUsers: 0,
      activeUsers: 0,
      paidUsers: 0,
      totalRevenue: 0,
      signupsToday: 0,
    };
  }),

  getAllUsers: adminProcedure.query(async () => {
    // TODO: Get real users from database
    return [];
  }),

  getRecentActivity: adminProcedure.query(async () => {
    // TODO: Get real activity from database
    return [];  
  }),

  // User preferences (non-admin)
  savePreferences: protectedProcedure
    .input(z.object({
      hiddenSections: z.array(z.string()).optional(),
      cardSizes: z.record(z.string(), z.string()).optional(),
      sectionOrder: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
      
      // Check if preferences exist
      const existing = await db.select().from(dashboardSections)
        .where(and(
          eq(dashboardSections.userId, ctx.user.id),
          eq(dashboardSections.sectionKey, '_preferences')
        ))
        .limit(1);
      
      if (existing.length > 0) {
        // Update existing
        await db.update(dashboardSections)
          .set({ data: JSON.stringify(input) })
          .where(eq(dashboardSections.id, existing[0].id));
      } else {
        // Insert new
        await db.insert(dashboardSections).values({
          userId: ctx.user.id,
          sectionKey: '_preferences',
          data: JSON.stringify(input),
        });
      }
      
      return { success: true };
    }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    
    const result = await db.select().from(dashboardSections)
      .where(and(
        eq(dashboardSections.userId, ctx.user.id),
        eq(dashboardSections.sectionKey, '_preferences')
      ))
      .limit(1);
    
    if (result.length === 0) return null;
    return JSON.parse(result[0].data);
  }),

  getDeployments: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const result: any = await db.execute(
      'SELECT * FROM deployments ORDER BY started_at DESC LIMIT 20'
    );

    return (result[0] || []) as any[];
  }),
});
