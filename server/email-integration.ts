/**
 * Email Integration Service
 * 
 * Syncs emails from Gmail/Outlook and tracks communication patterns
 * 
 * NOTE: This requires OAuth setup for Gmail/Outlook APIs
 * For now, this provides the structure. Full OAuth implementation
 * will be added when user provides API credentials.
 */

import { getDb } from "./db";
import { 
  emailMessages, 
  communicationEvents,
  keyRelationships,
  InsertEmailMessage,
  InsertCommunicationEvent 
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Sync emails from Gmail
 * (Requires Gmail API OAuth token)
 */
export async function syncGmailEmails(
  userId: number,
  accessToken: string
): Promise<{ synced: number; error?: string }> {
  try {
    // TODO: Implement Gmail API sync
    // 1. Fetch recent emails using Gmail API
    // 2. Parse email data
    // 3. Save to database
    // 4. Create communication events
    // 5. Update relationship last_contact_date

    return { synced: 0, error: "Gmail sync not yet implemented - requires OAuth setup" };
  } catch (error) {
    console.error("Gmail sync error:", error);
    return { synced: 0, error: String(error) };
  }
}

/**
 * Sync emails from Outlook
 * (Requires Microsoft Graph API OAuth token)
 */
export async function syncOutlookEmails(
  userId: number,
  accessToken: string
): Promise<{ synced: number; error?: string }> {
  try {
    // TODO: Implement Outlook/Microsoft Graph sync
    // 1. Fetch recent emails using Microsoft Graph API
    // 2. Parse email data
    // 3. Save to database
    // 4. Create communication events
    // 5. Update relationship last_contact_date

    return { synced: 0, error: "Outlook sync not yet implemented - requires OAuth setup" };
  } catch (error) {
    console.error("Outlook sync error:", error);
    return { synced: 0, error: String(error) };
  }
}

/**
 * Save email to database
 */
export async function saveEmail(email: InsertEmailMessage): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(emailMessages).values(email);
  } catch (error) {
    console.error("Error saving email:", error);
  }
}

/**
 * Create communication event from email
 */
export async function createCommunicationEventFromEmail(
  userId: number,
  email: {
    fromEmail: string;
    toEmails: string[];
    subject: string;
    sentAt: Date;
    isSent: boolean;
  }
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const contactEmail = email.isSent ? email.toEmails[0] : email.fromEmail;
    
    // Find or create relationship
    let relationship = await db
      .select()
      .from(keyRelationships)
      .where(
        and(
          eq(keyRelationships.userId, userId),
          eq(keyRelationships.contactEmail, contactEmail)
        )
      )
      .limit(1);

    let relationshipId: number | undefined;

    if (relationship.length === 0) {
      // Auto-create relationship for frequent contacts
      const result = await db.insert(keyRelationships).values({
        userId,
        contactName: contactEmail.split("@")[0], // Use email prefix as temp name
        contactEmail,
        importanceLevel: 5,
        minContactFrequency: 14,
        lastContactDate: email.sentAt,
        totalInteractions: 1,
      });
      relationshipId = result[0].insertId as number;
    } else {
      relationshipId = relationship[0].id;
      
      // Update last contact date and interaction count
      await db
        .update(keyRelationships)
        .set({
          lastContactDate: email.sentAt,
          totalInteractions: (relationship[0].totalInteractions || 0) + 1,
        })
        .where(eq(keyRelationships.id, relationshipId));
    }

    // Create communication event
    await db.insert(communicationEvents).values({
      userId,
      relationshipId,
      eventType: email.isSent ? "email_sent" : "email_received",
      contactEmail,
      contactName: relationship.length > 0 ? relationship[0].contactName : contactEmail.split("@")[0],
      subject: email.subject,
      eventDate: email.sentAt,
    });
  } catch (error) {
    console.error("Error creating communication event:", error);
  }
}

/**
 * Get email statistics for a user
 */
export async function getEmailStats(userId: number): Promise<{
  totalEmails: number;
  sentEmails: number;
  receivedEmails: number;
  topContacts: Array<{ email: string; count: number }>;
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalEmails: 0,
      sentEmails: 0,
      receivedEmails: 0,
      topContacts: [],
    };
  }

  const emails = await db
    .select()
    .from(emailMessages)
    .where(eq(emailMessages.userId, userId));

  const sentEmails = emails.filter(e => e.isSent).length;
  const receivedEmails = emails.filter(e => !e.isSent).length;

  // Count emails per contact
  const contactCounts: Record<string, number> = {};
  for (const email of emails) {
    const contact = email.isSent ? email.toEmails : email.fromEmail;
    if (contact) {
      contactCounts[contact] = (contactCounts[contact] || 0) + 1;
    }
  }

  const topContacts = Object.entries(contactCounts)
    .map(([email, count]) => ({ email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalEmails: emails.length,
    sentEmails,
    receivedEmails,
    topContacts,
  };
}

/**
 * Manual email logging (for when OAuth isn't set up)
 * User can manually log important emails
 */
export async function logManualEmail(
  userId: number,
  data: {
    contactEmail: string;
    contactName?: string;
    subject: string;
    isSent: boolean;
    sentAt?: Date;
  }
): Promise<void> {
  await createCommunicationEventFromEmail(userId, {
    fromEmail: data.isSent ? "user@example.com" : data.contactEmail,
    toEmails: data.isSent ? [data.contactEmail] : ["user@example.com"],
    subject: data.subject,
    sentAt: data.sentAt || new Date(),
    isSent: data.isSent,
  });
}
