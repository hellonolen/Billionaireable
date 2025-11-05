import { int, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Calendar connections table
 * Stores OAuth tokens for Google and Microsoft calendars
 */
export const calendarConnections = mysqlTable("calendar_connections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  provider: varchar("provider", { length: 50 }).notNull(), // 'google' or 'microsoft'
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  scope: text("scope"),
  calendarType: varchar("calendar_type", { length: 50 }).notNull(), // 'work' or 'personal'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Cached calendar events
 * Stores synced events from external calendars
 */
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  connectionId: int("connection_id").notNull(),
  externalId: varchar("external_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location", { length: 500 }),
  attendees: text("attendees"), // JSON array
  isAllDay: boolean("is_all_day").default(false).notNull(),
  status: varchar("status", { length: 50 }), // 'confirmed', 'tentative', 'cancelled'
  calendarType: varchar("calendar_type", { length: 50 }).notNull(), // 'work' or 'personal'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CalendarConnection = typeof calendarConnections.$inferSelect;
export type InsertCalendarConnection = typeof calendarConnections.$inferInsert;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;
