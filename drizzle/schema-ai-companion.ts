import { int, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
import { users } from "./schema";

/**
 * AI Companion conversation history
 * Stores every message for context and learning
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  metadata: json("metadata"), // Store additional context (emotion, intent, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * AI Companion memory embeddings for RAG
 * Vector embeddings of conversations for semantic search
 */
export const memoryEmbeddings = mysqlTable("memory_embeddings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  conversationId: int("conversationId").references(() => conversations.id),
  content: text("content").notNull(), // The text that was embedded
  embedding: json("embedding").notNull(), // Vector embedding (array of floats)
  metadata: json("metadata"), // Additional context (timestamp, topic, sentiment)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * User insights and patterns discovered by AI
 * Stores high-level insights about user behavior
 */
export const userInsights = mysqlTable("user_insights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  insightType: varchar("insightType", { length: 50 }).notNull(), // 'pattern', 'goal', 'concern', etc.
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  confidence: int("confidence").notNull(), // 0-100
  metadata: json("metadata"), // Additional data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Voice transcriptions from always-on listening
 * Stores transcribed audio for analysis
 */
export const voiceTranscriptions = mysqlTable("voice_transcriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  transcript: text("transcript").notNull(),
  duration: int("duration"), // Duration in seconds
  metadata: json("metadata"), // Speaker identification, emotion, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * AI companion settings per user
 */
export const companionSettings = mysqlTable("companion_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  voiceListeningEnabled: boolean("voiceListeningEnabled").default(true).notNull(),
  proactiveInsightsEnabled: boolean("proactiveInsightsEnabled").default(true).notNull(),
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("en").notNull(),
  personalityStyle: varchar("personalityStyle", { length: 50 }).default("balanced").notNull(), // 'supportive', 'challenging', 'balanced'
  notificationFrequency: varchar("notificationFrequency", { length: 20 }).default("daily").notNull(),
  metadata: json("metadata"), // Additional preferences
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type MemoryEmbedding = typeof memoryEmbeddings.$inferSelect;
export type InsertMemoryEmbedding = typeof memoryEmbeddings.$inferInsert;
export type UserInsight = typeof userInsights.$inferSelect;
export type InsertUserInsight = typeof userInsights.$inferInsert;
export type VoiceTranscription = typeof voiceTranscriptions.$inferSelect;
export type InsertVoiceTranscription = typeof voiceTranscriptions.$inferInsert;
export type CompanionSettings = typeof companionSettings.$inferSelect;
export type InsertCompanionSettings = typeof companionSettings.$inferInsert;
