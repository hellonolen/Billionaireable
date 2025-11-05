import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  hasPaid: mysqlEnum("hasPaid", ["yes", "no"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Calendar tables
export { calendarConnections, calendarEvents } from './calendar-schema';
export type { CalendarConnection, InsertCalendarConnection, CalendarEvent, InsertCalendarEvent } from './calendar-schema';

/**
 * Dashboard sections - stores all the data for each of the 14 sections
 */
export const dashboardSections = mysqlTable("dashboard_sections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sectionKey: varchar("sectionKey", { length: 100 }).notNull(),
  data: text("data").notNull(), // JSON string containing all section data
  cadence: varchar("cadence", { length: 20 }).default("Monthly").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DashboardSection = typeof dashboardSections.$inferSelect;
export type InsertDashboardSection = typeof dashboardSections.$inferInsert;

/**
 * Health biomarkers - individual biomarker readings
 */
export const healthBiomarkers = mysqlTable("health_biomarkers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  biomarkerType: varchar("biomarkerType", { length: 100 }).notNull(), // 'hrv', 'vo2_max', 'hba1c', 'hscrp', etc.
  value: varchar("value", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  optimalMin: varchar("optimalMin", { length: 50 }),
  optimalMax: varchar("optimalMax", { length: 50 }),
  status: varchar("status", { length: 20 }).notNull(), // 'optimal', 'warning', 'critical'
  trend: varchar("trend", { length: 20 }), // 'improving', 'stable', 'declining'
  measuredAt: timestamp("measuredAt").notNull(),
  source: varchar("source", { length: 100 }), // 'manual', 'lab_upload', 'apple_health', etc.
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthBiomarker = typeof healthBiomarkers.$inferSelect;
export type InsertHealthBiomarker = typeof healthBiomarkers.$inferInsert;

/**
 * Health goals - personalized health targets and tracking
 */
export const healthGoals = mysqlTable("health_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  goalType: varchar("goalType", { length: 50 }).notNull(), // 'hrv', 'sleep', 'workout', 'weight', etc.
  targetValue: int("targetValue").notNull(),
  currentValue: int("currentValue"),
  unit: varchar("unit", { length: 20 }).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  targetDate: timestamp("targetDate"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthGoal = typeof healthGoals.$inferSelect;
export type InsertHealthGoal = typeof healthGoals.$inferInsert;

/**
 * Shared dashboards - for sharing with doctors, advisors, friends
 * Enhanced with password protection, revocation, and access tracking
 */
export const sharedDashboards = mysqlTable("shared_dashboards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  shareToken: varchar("shareToken", { length: 64 }).notNull().unique(),
  shareType: varchar("shareType", { length: 50 }).notNull(), // 'doctor', 'team', 'spouse', 'family', 'health_results', 'financial_advisor'
  recipientEmail: varchar("recipientEmail", { length: 320 }),
  recipientName: varchar("recipientName", { length: 255 }),
  sections: text("sections").notNull(), // JSON array of section keys to share
  password: varchar("password", { length: 255 }), // Hashed password for protected links
  expiresAt: timestamp("expiresAt"),
  isActive: boolean("isActive").default(true).notNull(),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SharedDashboard = typeof sharedDashboards.$inferSelect;
export type InsertSharedDashboard = typeof sharedDashboards.$inferInsert;

/**
 * Share access logs - track who accessed shared links and when
 */
export const shareAccessLogs = mysqlTable("share_access_logs", {
  id: int("id").autoincrement().primaryKey(),
  shareId: int("shareId").notNull(),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  wasPasswordRequired: boolean("wasPasswordRequired").default(false).notNull(),
  wasSuccessful: boolean("wasSuccessful").default(true).notNull(),
});

export type ShareAccessLog = typeof shareAccessLogs.$inferSelect;
export type InsertShareAccessLog = typeof shareAccessLogs.$inferInsert;

/**
 * Notifications - alerts for health trends and milestones
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'milestone', 'trend', 'alert', 'goal_achieved'
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Metrics data - time-series data for all metrics (net worth, cash, HRV, sleep, etc.)
 */
export const metricsData = mysqlTable("metrics_data", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  metric: varchar("metric", { length: 100 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  category: varchar("category", { length: 50 }), // 'health', 'finance', 'business', etc.
  metadata: text("metadata"), // JSON for additional context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MetricsData = typeof metricsData.$inferSelect;
export type InsertMetricsData = typeof metricsData.$inferInsert;

/**
 * Notification rules - custom user-defined notification triggers
 */
export const notificationRules = mysqlTable("notification_rules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  ruleName: varchar("ruleName", { length: 255 }).notNull(),
  metric: varchar("metric", { length: 100 }).notNull(),
  condition: varchar("condition", { length: 50 }).notNull(), // 'increases_by', 'decreases_by', 'above', 'below'
  threshold: varchar("threshold", { length: 50 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationRule = typeof notificationRules.$inferSelect;
export type InsertNotificationRule = typeof notificationRules.$inferInsert;

/**
 * Integrations - external service connections (Apple Health, Google Fit, Plaid, etc.)
 */
export const integrations = mysqlTable("integrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  service: varchar("service", { length: 100 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  isConnected: boolean("isConnected").default(true).notNull(),
  lastSyncAt: timestamp("lastSyncAt"),
  metadata: text("metadata"), // JSON for service-specific data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = typeof integrations.$inferInsert;

/**
 * Achievements - unlockable badges and milestones
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementType: varchar("achievementType", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  metadata: text("metadata"),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * Streaks - tracking consecutive days of activities
 */
export const streaks = mysqlTable("streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  streakType: varchar("streakType", { length: 100 }).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = typeof streaks.$inferInsert;

/**
 * Pricing plans - subscription tiers
 */
export const pricingPlans = mysqlTable("pricing_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: int("price").notNull(),
  interval: mysqlEnum("interval", ["month", "year"]).notNull(),
  features: text("features").notNull(), // JSON array of feature strings
  stripeProductId: varchar("stripeProductId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertPricingPlan = typeof pricingPlans.$inferInsert;

/**
 * Subscriptions - user subscription status
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  planId: int("planId").notNull(),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "trialing", "incomplete"]).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Teams - for delegation (billionaire + assistant)
 */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Team members - users who belong to teams
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member", "viewer"]).notNull(),
  invitedBy: int("invitedBy"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Team invitations - pending invites to join teams
 */
export const teamInvitations = mysqlTable("team_invitations", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["admin", "member", "viewer"]).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending").notNull(),
  invitedBy: int("invitedBy").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertTeamInvitation = typeof teamInvitations.$inferInsert;

/**
 * Contacts - personal and professional contacts with relationship tracking
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  title: varchar("title", { length: 255 }),
  category: varchar("category", { length: 100 }).notNull(), // 'financial', 'legal', 'health', 'business', 'personal'
  relationship: varchar("relationship", { length: 100 }), // 'accountant', 'lawyer', 'doctor', 'cfo', 'friend'
  lastContactedAt: timestamp("lastContactedAt"),
  nextFollowUpAt: timestamp("nextFollowUpAt"),
  notes: text("notes"),
  linkedCardKey: varchar("linkedCardKey", { length: 100 }), // Which dashboard card this contact relates to
  importance: int("importance").default(3), // 1-5 scale
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * AI Agent logs - track Billionaireable AI agent activities and insights
 */
export const agentLogs = mysqlTable("agent_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentType: varchar("agentType", { length: 100 }).notNull(), // 'monitor', 'analyzer', 'predictor', 'executor'
  action: varchar("action", { length: 255 }).notNull(),
  context: text("context"), // JSON with details
  result: text("result"), // JSON with outcomes
  severity: varchar("severity", { length: 20 }).default("info").notNull(), // 'info', 'warning', 'critical'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentLog = typeof agentLogs.$inferSelect;
export type InsertAgentLog = typeof agentLogs.$inferInsert;

/**
 * Documents - file storage for contracts, reports, etc.
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key
  fileUrl: varchar("fileUrl", { length: 1000 }).notNull(), // S3 URL
  fileSize: int("fileSize").notNull(), // bytes
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }), // 'contract', 'report', 'legal', 'financial'
  linkedCardKey: varchar("linkedCardKey", { length: 100 }), // Which dashboard card this relates to
  linkedContactId: int("linkedContactId"), // Which contact this relates to
  tags: text("tags"), // JSON array of tags
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
