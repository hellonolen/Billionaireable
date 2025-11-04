import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, dashboardSections, DashboardSection, InsertDashboardSection, healthBiomarkers, healthGoals, HealthGoal, InsertHealthGoal, sharedDashboards, SharedDashboard, InsertSharedDashboard, shareAccessLogs, notifications, Notification, InsertNotification, metricsData, MetricsData, InsertMetricsData, notificationRules, NotificationRule, InsertNotificationRule, integrations, Integration, InsertIntegration, achievements, Achievement, InsertAchievement, streaks, Streak, InsertStreak } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Dashboard section helpers
export async function getDashboardSection(userId: number, sectionKey: string): Promise<DashboardSection | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get dashboard section: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(dashboardSections)
    .where(and(eq(dashboardSections.userId, userId), eq(dashboardSections.sectionKey, sectionKey)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDashboardSections(userId: number): Promise<DashboardSection[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get dashboard sections: database not available");
    return [];
  }

  return await db.select().from(dashboardSections).where(eq(dashboardSections.userId, userId));
}

export async function upsertDashboardSection(section: InsertDashboardSection): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert dashboard section: database not available");
    return;
  }

  const existing = await getDashboardSection(section.userId, section.sectionKey);

  if (existing) {
    await db
      .update(dashboardSections)
      .set({ data: section.data, cadence: section.cadence, updatedAt: new Date() })
      .where(eq(dashboardSections.id, existing.id));
  } else {
    await db.insert(dashboardSections).values(section);
  }
}

// Health goals helpers
export async function getUserHealthGoals(userId: number): Promise<HealthGoal[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(healthGoals).where(eq(healthGoals.userId, userId));
}

export async function createHealthGoal(goal: InsertHealthGoal): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(healthGoals).values(goal);
}

export async function updateHealthGoal(goalId: number, updates: Partial<HealthGoal>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(healthGoals).set(updates).where(eq(healthGoals.id, goalId));
}

// Health biomarkers helpers
export async function getUserHealthBiomarkers(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(healthBiomarkers).where(eq(healthBiomarkers.userId, userId));
}

export async function createHealthBiomarker(biomarker: any): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(healthBiomarkers).values(biomarker);
}

export async function updateHealthBiomarker(biomarkerId: number, updates: any): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(healthBiomarkers).set(updates).where(eq(healthBiomarkers.id, biomarkerId));
}

// Shared dashboards helpers
export async function createSharedDashboard(share: InsertSharedDashboard): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(sharedDashboards).values(share);
}

export async function getSharedDashboard(shareToken: string): Promise<SharedDashboard | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sharedDashboards).where(eq(sharedDashboards.shareToken, shareToken)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSharedDashboards(userId: number): Promise<SharedDashboard[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sharedDashboards).where(eq(sharedDashboards.userId, userId));
}

export async function revokeSharedDashboard(shareId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(sharedDashboards)
    .set({ isActive: false, revokedAt: new Date() })
    .where(eq(sharedDashboards.id, shareId));
}

export async function updateSharedDashboard(shareId: number, updates: Partial<SharedDashboard>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(sharedDashboards)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(sharedDashboards.id, shareId));
}

export async function logShareAccess(log: { shareId: number; ipAddress?: string; userAgent?: string; wasPasswordRequired?: boolean; wasSuccessful?: boolean }): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(shareAccessLogs).values(log);
}

export async function getShareAccessLogs(shareId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(shareAccessLogs).where(eq(shareAccessLogs.shareId, shareId));
}

// Notifications helpers
export async function getUserNotifications(userId: number): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function createNotification(notification: InsertNotification): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(notification);
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}

// Metrics data helpers
export async function addMetricsData(metric: { userId: number; metric: string; value: string; date: Date; category?: string; metadata?: string }): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(metricsData).values({
    ...metric,
    createdAt: new Date(),
  });
}

export async function getMetricsData(userId: number, metric: string, startDate?: Date, endDate?: Date): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(metricsData).where(
    and(
      eq(metricsData.userId, userId),
      eq(metricsData.metric, metric)
    )
  );
  
  return await query;
}

export async function getLatestMetricValue(userId: number, metric: string): Promise<any | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(metricsData)
    .where(and(eq(metricsData.userId, userId), eq(metricsData.metric, metric)))
    .orderBy(metricsData.date)
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// Notification rules helpers
export async function getUserNotificationRules(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notificationRules).where(eq(notificationRules.userId, userId));
}

export async function createNotificationRule(rule: { userId: number; ruleName: string; metric: string; condition: string; threshold: string; isActive?: boolean }): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(notificationRules).values({
    ...rule,
    isActive: rule.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateNotificationRule(ruleId: number, updates: any): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(notificationRules).set({ ...updates, updatedAt: new Date() }).where(eq(notificationRules.id, ruleId));
}

export async function deleteNotificationRule(ruleId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(notificationRules).where(eq(notificationRules.id, ruleId));
}

// Integrations helpers
export async function getUserIntegrations(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(integrations).where(eq(integrations.userId, userId));
}

export async function getIntegration(userId: number, service: string): Promise<any | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(integrations)
    .where(and(eq(integrations.userId, userId), eq(integrations.service, service)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertIntegration(integration: { userId: number; service: string; accessToken?: string; refreshToken?: string; expiresAt?: Date; isConnected?: boolean; lastSyncAt?: Date; metadata?: string }): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const existing = await getIntegration(integration.userId, integration.service);
  
  if (existing) {
    await db
      .update(integrations)
      .set({ ...integration, updatedAt: new Date() })
      .where(eq(integrations.id, existing.id));
  } else {
    await db.insert(integrations).values({
      ...integration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// Achievements helpers
export async function getUserAchievements(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(achievements).where(eq(achievements.userId, userId));
}

export async function unlockAchievement(achievement: { userId: number; achievementType: string; title: string; description?: string; metadata?: string }): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(achievements).values({
    ...achievement,
    unlockedAt: new Date(),
  });
}

// Streaks helpers
export async function getUserStreaks(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(streaks).where(eq(streaks.userId, userId));
}

export async function updateStreak(userId: number, streakType: string, activityDate: Date): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const result = await db
    .select()
    .from(streaks)
    .where(and(eq(streaks.userId, userId), eq(streaks.streakType, streakType)))
    .limit(1);
  
  if (result.length > 0) {
    const streak = result[0];
    const lastDate = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
    const today = new Date(activityDate);
    
    let newCurrent = streak.currentStreak;
    
    if (lastDate) {
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        newCurrent = streak.currentStreak + 1;
      } else if (diffDays > 1) {
        // Streak broken
        newCurrent = 1;
      }
      // Same day, no change
    } else {
      newCurrent = 1;
    }
    
    const newLongest = Math.max(streak.longestStreak, newCurrent);
    
    await db
      .update(streaks)
      .set({
        currentStreak: newCurrent,
        longestStreak: newLongest,
        lastActivityDate: today,
        updatedAt: new Date(),
      })
      .where(eq(streaks.id, streak.id));
  } else {
    // Create new streak
    await db.insert(streaks).values({
      userId,
      streakType,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: activityDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}


// ============================================================================
// Metrics Data Functions
// ============================================================================

export async function addMetricData(data: InsertMetricsData): Promise<MetricsData | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const [result] = await db.insert(metricsData).values(data);
    const [inserted] = await db.select().from(metricsData).where(eq(metricsData.id, result.insertId));
    return inserted || null;
  } catch (error) {
    console.error("[Database] Failed to add metric data:", error);
    return null;
  }
}

export async function getMetricsByUser(userId: number, metric?: string, limit = 100): Promise<MetricsData[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const conditions = metric 
      ? and(eq(metricsData.userId, userId), eq(metricsData.metric, metric))
      : eq(metricsData.userId, userId);
    
    const results = await db.select().from(metricsData)
      .where(conditions)
      .orderBy(desc(metricsData.date))
      .limit(limit);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get metrics:", error);
    return [];
  }
}

export async function getLatestMetric(userId: number, metric: string): Promise<MetricsData | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const [result] = await db.select().from(metricsData)
      .where(and(eq(metricsData.userId, userId), eq(metricsData.metric, metric)))
      .orderBy(desc(metricsData.date))
      .limit(1);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to get latest metric:", error);
    return null;
  }
}

// ============================================
// SUBSCRIPTION HELPERS
// ============================================

import { subscriptions, Subscription, InsertSubscription, pricingPlans, PricingPlan, InsertPricingPlan } from "../drizzle/schema";

export async function createSubscription(subscription: InsertSubscription): Promise<Subscription | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(subscriptions).values(subscription) as any;
    const inserted = await db.select().from(subscriptions).where(eq(subscriptions.id, Number(result.insertId))).limit(1);
    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create subscription:", error);
    return null;
  }
}

export async function getSubscriptionByUserId(userId: number): Promise<Subscription | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] || null;
}

export async function updateSubscription(userId: number, updates: Partial<Subscription>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(subscriptions).set(updates).where(eq(subscriptions.userId, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update subscription:", error);
    return false;
  }
}

export async function getAllPricingPlans(): Promise<PricingPlan[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(pricingPlans).where(eq(pricingPlans.isActive, true));
  return result;
}

export async function getPricingPlanById(planId: number): Promise<PricingPlan | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(pricingPlans).where(eq(pricingPlans.id, planId)).limit(1);
  return result[0] || null;
}

// ============================================
// TEAM HELPERS
// ============================================

import { teams, Team, InsertTeam, teamMembers, TeamMember, InsertTeamMember, teamInvitations, TeamInvitation, InsertTeamInvitation } from "../drizzle/schema";

export async function createTeam(team: InsertTeam): Promise<Team | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(teams).values(team) as any;
    const inserted = await db.select().from(teams).where(eq(teams.id, Number(result.insertId))).limit(1);
    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create team:", error);
    return null;
  }
}

export async function getTeamsByUserId(userId: number): Promise<Team[]> {
  const db = await getDb();
  if (!db) return [];

  // Get all teams where user is a member
  const memberTeams = await db
    .select({ team: teams })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.userId, userId));

  return memberTeams.map(m => m.team);
}

export async function getTeamMembers(teamId: number): Promise<(TeamMember & { user: typeof users.$inferSelect })[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      member: teamMembers,
      user: users,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));

  return result.map(r => ({ ...r.member, user: r.user }));
}

export async function addTeamMember(member: InsertTeamMember): Promise<TeamMember | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(teamMembers).values(member) as any;
    const inserted = await db.select().from(teamMembers).where(eq(teamMembers.id, Number(result.insertId))).limit(1);
    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Failed to add team member:", error);
    return null;
  }
}

export async function removeTeamMember(teamId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(teamMembers).where(
      and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      )
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to remove team member:", error);
    return false;
  }
}

export async function createTeamInvitation(invitation: InsertTeamInvitation): Promise<TeamInvitation | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(teamInvitations).values(invitation) as any;
    const inserted = await db.select().from(teamInvitations).where(eq(teamInvitations.id, Number(result.insertId))).limit(1);
    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create team invitation:", error);
    return null;
  }
}

export async function getTeamInvitationByToken(token: string): Promise<TeamInvitation | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(teamInvitations).where(eq(teamInvitations.token, token)).limit(1);
  return result[0] || null;
}

export async function updateTeamInvitation(id: number, updates: Partial<TeamInvitation>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(teamInvitations).set(updates).where(eq(teamInvitations.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update team invitation:", error);
    return false;
  }
}

export async function getTeamInvitations(teamId: number): Promise<TeamInvitation[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(teamInvitations).where(eq(teamInvitations.teamId, teamId));
  return result;
}
