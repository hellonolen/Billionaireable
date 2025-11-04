import { desc, eq, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  conversations,
  memoryEmbeddings,
  userInsights,
  voiceTranscriptions,
  companionSettings,
  InsertConversation,
  InsertMemoryEmbedding,
  InsertUserInsight,
  InsertVoiceTranscription,
  InsertCompanionSettings,
} from "../drizzle/schema";

/**
 * Save a conversation message
 */
export async function saveConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(conversations).values(data);
  return result;
}

/**
 * Get conversation history for a user
 */
export async function getConversationHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt))
    .limit(limit);
}

/**
 * Save memory embedding for RAG
 */
export async function saveMemoryEmbedding(data: InsertMemoryEmbedding) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(memoryEmbeddings).values(data);
  return result;
}

/**
 * Search memory embeddings by similarity (cosine similarity)
 * Note: This is a simplified version. For production, use a proper vector database
 */
export async function searchMemoryBySimilarity(
  userId: number,
  queryEmbedding: number[],
  limit: number = 10
) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all embeddings for user
  const userEmbeddings = await db
    .select()
    .from(memoryEmbeddings)
    .where(eq(memoryEmbeddings.userId, userId));
  
  // Calculate cosine similarity and sort
  const results = userEmbeddings
    .map(item => {
      const embedding = item.embedding as number[];
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      return { ...item, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return results;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Save user insight
 */
export async function saveUserInsight(data: InsertUserInsight) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(userInsights).values(data);
  return result;
}

/**
 * Get user insights
 */
export async function getUserInsights(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(userInsights)
    .where(eq(userInsights.userId, userId))
    .orderBy(desc(userInsights.createdAt))
    .limit(limit);
}

/**
 * Save voice transcription
 */
export async function saveVoiceTranscription(data: InsertVoiceTranscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(voiceTranscriptions).values(data);
  return result;
}

/**
 * Get voice transcriptions
 */
export async function getVoiceTranscriptions(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(voiceTranscriptions)
    .where(eq(voiceTranscriptions.userId, userId))
    .orderBy(desc(voiceTranscriptions.createdAt))
    .limit(limit);
}

/**
 * Get or create companion settings for user
 */
export async function getCompanionSettings(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(companionSettings)
    .where(eq(companionSettings.userId, userId))
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  // Create default settings
  const [result] = await db.insert(companionSettings).values({
    userId,
    voiceListeningEnabled: true,
    proactiveInsightsEnabled: true,
    preferredLanguage: "en",
    personalityStyle: "balanced",
    notificationFrequency: "daily",
  });
  
  return await db
    .select()
    .from(companionSettings)
    .where(eq(companionSettings.userId, userId))
    .limit(1)
    .then(res => res[0]);
}

/**
 * Update companion settings
 */
export async function updateCompanionSettings(
  userId: number,
  updates: Partial<InsertCompanionSettings>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(companionSettings)
    .set(updates)
    .where(eq(companionSettings.userId, userId));
  
  return await getCompanionSettings(userId);
}
