import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { 
  keyRelationships, 
  communicationEvents, 
  relationshipInsights,
  behavioralPatterns,
  InsertRelationshipInsight,
  InsertBehavioralPattern 
} from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * Proactive Monitoring & Relationship Intelligence
 * 
 * This service monitors user behavior and relationships to surface proactive insights
 */

/**
 * Analyze communication patterns and detect cold relationships
 */
export async function detectColdRelationships(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Get all key relationships
  const relationships = await db
    .select()
    .from(keyRelationships)
    .where(eq(keyRelationships.userId, userId));

  for (const relationship of relationships) {
    const daysSinceContact = relationship.lastContactDate
      ? Math.floor((Date.now() - relationship.lastContactDate.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const minFrequency = relationship.minContactFrequency || 7;

    // If contact is overdue
    if (daysSinceContact > minFrequency) {
      // Check if we already have this insight
      const existing = await db
        .select()
        .from(relationshipInsights)
        .where(
          and(
            eq(relationshipInsights.userId, userId),
            eq(relationshipInsights.relationshipId, relationship.id),
            eq(relationshipInsights.insightType, "cold_connection")
          )
        )
        .limit(1);

      if (existing.length === 0) {
        // Create new insight
        await db.insert(relationshipInsights).values({
          userId,
          relationshipId: relationship.id,
          insightType: "cold_connection",
          title: `Haven't connected with ${relationship.contactName} in ${daysSinceContact} days`,
          description: `You usually connect with ${relationship.contactName} every ${minFrequency} days, but it's been ${daysSinceContact} days since your last interaction. Consider reaching out.`,
          priority: (relationship.importanceLevel || 5) >= 8 ? "high" : "medium",
          actionSuggested: `Send an email or schedule a call with ${relationship.contactName}`,
        });
      }
    }
  }
}

/**
 * Analyze communication events for patterns
 */
export async function analyzeCommunicationPatterns(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Get recent communication events (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const recentEvents = await db
    .select()
    .from(communicationEvents)
    .where(
      and(
        eq(communicationEvents.userId, userId),
        sql`${communicationEvents.eventDate} >= ${sevenDaysAgo}`
      )
    )
    .orderBy(desc(communicationEvents.eventDate));

  // Detect communication spikes (more than 10 emails to same person in a day)
  const emailCounts: Record<string, number> = {};
  const today = new Date().toDateString();

  for (const event of recentEvents) {
    if (event.eventType === "email_sent" && event.contactEmail) {
      const eventDate = new Date(event.eventDate).toDateString();
      if (eventDate === today) {
        const key = event.contactEmail;
        emailCounts[key] = (emailCounts[key] || 0) + 1;
      }
    }
  }

  // Check for spikes
  for (const [email, count] of Object.entries(emailCounts)) {
    if (count >= 3) {
      const contact = recentEvents.find(e => e.contactEmail === email);
      if (contact) {
        // Check if pattern already exists
        const existing = await db
          .select()
          .from(behavioralPatterns)
          .where(
            and(
              eq(behavioralPatterns.userId, userId),
              eq(behavioralPatterns.patternType, "communication_spike"),
              sql`JSON_EXTRACT(${behavioralPatterns.metadata}, '$.email') = ${email}`
            )
          )
          .limit(1);

        if (existing.length === 0) {
          await db.insert(behavioralPatterns).values({
            userId,
            patternType: "communication_spike",
            patternName: `High email volume with ${contact.contactName || email}`,
            description: `You've sent ${count} emails to ${contact.contactName || email} today. This is unusual. Everything okay?`,
            confidence: 90,
            firstDetected: new Date(),
            lastDetected: new Date(),
            metadata: { email, count } as any,
          });
        }
      }
    }
  }
}

/**
 * Generate proactive insight after a conversation
 */
export async function generateConversationInsight(
  userId: number,
  transcript: string,
  contactName?: string
): Promise<string | null> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are the Billionaireable AI Companion. The user just had a conversation${contactName ? ` with ${contactName}` : ""}. Analyze the transcript and provide ONE key insight or suggestion.

Be specific and actionable. Focus on:
- Opportunities mentioned
- Concerns or challenges
- Action items
- Relationship dynamics
- Strategic implications

Keep it short (2-3 sentences max). Start with "I heard your conversation${contactName ? ` with ${contactName}` : ""}..."`,
      },
      {
        role: "user" as const,
        content: transcript,
      },
    ];

    const response = await invokeLLM({ messages });
    const insight = typeof response.choices[0]?.message?.content === 'string'
      ? response.choices[0]?.message?.content
      : null;

    return insight;
  } catch (error) {
    console.error("Error generating conversation insight:", error);
    return null;
  }
}

/**
 * Analyze email patterns for a specific contact
 */
export async function analyzeEmailPatterns(
  userId: number,
  contactEmail: string
): Promise<{
  totalEmails: number;
  lastEmailDate: Date | null;
  averageResponseTime: number | null;
  sentiment: string;
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalEmails: 0,
      lastEmailDate: null,
      averageResponseTime: null,
      sentiment: "neutral",
    };
  }

  const events = await db
    .select()
    .from(communicationEvents)
    .where(
      and(
        eq(communicationEvents.userId, userId),
        eq(communicationEvents.contactEmail, contactEmail)
      )
    )
    .orderBy(desc(communicationEvents.eventDate));

  const totalEmails = events.length;
  const lastEmailDate = events.length > 0 ? events[0].eventDate : null;

  // Calculate average sentiment
  const sentiments = events.filter(e => e.sentiment).map(e => e.sentiment);
  const positiveSentiments = sentiments.filter(s => s === "positive").length;
  const negativeSentiments = sentiments.filter(s => s === "negative").length;

  let sentiment = "neutral";
  if (positiveSentiments > negativeSentiments) sentiment = "positive";
  if (negativeSentiments > positiveSentiments) sentiment = "negative";

  return {
    totalEmails,
    lastEmailDate,
    averageResponseTime: null, // TODO: Calculate from email threads
    sentiment,
  };
}

/**
 * Get relationship health score
 */
export async function getRelationshipHealthScore(
  userId: number,
  relationshipId: number
): Promise<number> {
  const db = await getDb();
  if (!db) return 50;

  const relationship = await db
    .select()
    .from(keyRelationships)
    .where(eq(keyRelationships.id, relationshipId))
    .limit(1);

  if (relationship.length === 0) return 50;

  const rel = relationship[0];
  let score = 100;

  // Deduct points for cold connections
  if (rel.lastContactDate) {
    const daysSinceContact = Math.floor(
      (Date.now() - rel.lastContactDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const minFrequency = rel.minContactFrequency || 7;

    if (daysSinceContact > minFrequency) {
      const overdueDays = daysSinceContact - minFrequency;
      score -= Math.min(50, overdueDays * 5); // Max 50 points deduction
    }
  } else {
    score -= 30; // Never contacted
  }

  // Bonus for recent interactions
  const recentEvents = await db
    .select()
    .from(communicationEvents)
    .where(
      and(
        eq(communicationEvents.userId, userId),
        eq(communicationEvents.relationshipId, relationshipId),
        sql`${communicationEvents.eventDate} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
      )
    );

  score += Math.min(20, recentEvents.length * 5); // Max 20 bonus points

  return Math.max(0, Math.min(100, score));
}

/**
 * Run all proactive monitoring tasks
 */
export async function runProactiveMonitoring(userId: number): Promise<void> {
  try {
    await Promise.all([
      detectColdRelationships(userId),
      analyzeCommunicationPatterns(userId),
    ]);
  } catch (error) {
    console.error("Proactive monitoring error:", error);
  }
}
