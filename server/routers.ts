import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { subscriptionsRouter } from "./routers/subscriptions";
import { adminRouter } from "./routers/admin";
import { teamsRouter } from "./routers/teams";
import { getDashboardSection, getAllDashboardSections, upsertDashboardSection, getUserHealthBiomarkers, createHealthBiomarker, updateHealthBiomarker, getUserHealthGoals, createHealthGoal, updateHealthGoal, createSharedDashboard, getUserSharedDashboards, getSharedDashboard, getUserNotifications, createNotification, markNotificationRead, addMetricData, getMetricsByUser, getLatestMetric, getUserNotificationRules, createNotificationRule, updateNotificationRule, deleteNotificationRule, getUserIntegrations, getIntegration, upsertIntegration, getUserAchievements, unlockAchievement, getUserStreaks, updateStreak } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  metrics: router({
    add: protectedProcedure
      .input(z.object({
        metric: z.string(),
        value: z.number(),
        date: z.string(),
        category: z.string().optional(),
        metadata: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await addMetricData({
          userId: ctx.user.id,
          metric: input.metric,
          value: input.value.toString(),
          date: new Date(input.date),
          category: input.category,
          metadata: input.metadata,
        });
      }),

    getByMetric: protectedProcedure
      .input(z.object({
        metric: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return await getMetricsByUser(ctx.user.id, input.metric, input.limit);
      }),

    getLatest: protectedProcedure
      .input(z.object({ metric: z.string() }))
      .query(async ({ ctx, input }) => {
        return await getLatestMetric(ctx.user.id, input.metric);
      }),
  }),

  dashboard: router({
    getSection: protectedProcedure
      .input(z.object({ sectionKey: z.string() }))
      .query(async ({ ctx, input }) => {
        return await getDashboardSection(ctx.user.id, input.sectionKey);
      }),

    getAllSections: protectedProcedure.query(async ({ ctx }) => {
      return await getAllDashboardSections(ctx.user.id);
    }),

    updateSection: protectedProcedure
      .input(
        z.object({
          sectionKey: z.string(),
          data: z.string(), // JSON string
          cadence: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertDashboardSection({
          userId: ctx.user.id,
          sectionKey: input.sectionKey,
          data: input.data,
          cadence: input.cadence || "Monthly",
        });
        return { success: true };
      }),
  }),

  healthGoals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserHealthGoals(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          goalType: z.string(),
          targetValue: z.number(),
          unit: z.string(),
          targetDate: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createHealthGoal({
          userId: ctx.user.id,
          goalType: input.goalType,
          targetValue: input.targetValue,
          unit: input.unit,
          targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          goalId: z.number(),
          currentValue: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await updateHealthGoal(input.goalId, {
          currentValue: input.currentValue,
          isActive: input.isActive,
        });
        return { success: true };
      }),
  }),

  sharing: router({
    create: protectedProcedure
      .input(
        z.object({
          recipientEmail: z.string().optional(),
          recipientName: z.string().optional(),
          sections: z.array(z.string()),
          expiresInDays: z.number().optional(),
          password: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const shareToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const expiresAt = input.expiresInDays
          ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
          : undefined;

        await createSharedDashboard({
          userId: ctx.user.id,
          shareToken,
          shareType: 'general',
          recipientEmail: input.recipientEmail,
          recipientName: input.recipientName,
          sections: JSON.stringify(input.sections),
          expiresAt,
        });

        return { shareToken, shareUrl: `${process.env.VITE_APP_URL || ''}/shared/${shareToken}` };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSharedDashboards(ctx.user.id);
    }),

    get: publicProcedure
      .input(z.object({ shareToken: z.string() }))
      .query(async ({ input }) => {
        return await getSharedDashboard(input.shareToken);
      }),
  }),

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotifications(ctx.user.id);
    }),

    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationRead(input.notificationId);
        return { success: true };
      }),
  }),

  notificationRules: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotificationRules(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          ruleName: z.string(),
          metric: z.string(),
          condition: z.string(),
          threshold: z.string(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createNotificationRule({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          ruleId: z.number(),
          ruleName: z.string().optional(),
          threshold: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateNotificationRule(input.ruleId, {
          ruleName: input.ruleName,
          threshold: input.threshold,
          isActive: input.isActive,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ ruleId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteNotificationRule(input.ruleId);
        return { success: true };
      }),
  }),

  integrations: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserIntegrations(ctx.user.id);
    }),

    connect: protectedProcedure
      .input(
        z.object({
          service: z.string(),
          accessToken: z.string().optional(),
          refreshToken: z.string().optional(),
          expiresAt: z.string().optional(),
          metadata: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertIntegration({
          userId: ctx.user.id,
          service: input.service,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
          isConnected: true,
          metadata: input.metadata,
        });
        return { success: true };
      }),

    disconnect: protectedProcedure
      .input(z.object({ service: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await upsertIntegration({
          userId: ctx.user.id,
          service: input.service,
          isConnected: false,
        });
        return { success: true };
      }),
  }),

  achievements: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAchievements(ctx.user.id);
    }),

    unlock: protectedProcedure
      .input(
        z.object({
          achievementType: z.string(),
          title: z.string(),
          description: z.string().optional(),
          metadata: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await unlockAchievement({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  streaks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserStreaks(ctx.user.id);
    }),
  }),

  healthBiomarkers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserHealthBiomarkers(ctx.user.id);
    }),

    add: protectedProcedure
      .input(
        z.object({
          biomarkerType: z.string(),
          value: z.string(),
          unit: z.string(),
          optimalMin: z.string().optional(),
          optimalMax: z.string().optional(),
          status: z.string(),
          trend: z.string().optional(),
          measuredAt: z.string(),
          source: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createHealthBiomarker({
          userId: ctx.user.id,
          biomarkerType: input.biomarkerType,
          value: input.value,
          unit: input.unit,
          optimalMin: input.optimalMin,
          optimalMax: input.optimalMax,
          status: input.status,
          trend: input.trend,
          measuredAt: new Date(input.measuredAt),
          source: input.source,
          notes: input.notes,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          value: z.string(),
          status: z.string().optional(),
          trend: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await updateHealthBiomarker(input.id, {
          value: input.value,
          status: input.status,
          trend: input.trend,
          notes: input.notes,
        });
        return { success: true };
      }),

    uploadLabResults: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(), // base64 encoded
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Decode base64 file data
        const fileBuffer = Buffer.from(input.fileData, 'base64');
        
        // Import parsing function
        const { parseLabResultsPDF } = await import('./upload-handler');
        
        // Parse PDF and extract biomarkers
        const { biomarkers } = await parseLabResultsPDF(fileBuffer, input.fileName);
        
        // Add extracted biomarkers to database
        for (const biomarker of biomarkers) {
          await createHealthBiomarker({
            userId: ctx.user.id,
            ...biomarker,
          });
        }
        
        return { 
          success: true,
          biomarkersAdded: biomarkers.length,
          biomarkers,
        };
      }),
  }),

  subscriptions: subscriptionsRouter,
  admin: adminRouter,
  teams: teamsRouter,
});

export type AppRouter = typeof appRouter;
