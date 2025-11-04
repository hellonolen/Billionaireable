/**
 * Calendar Integration Service
 * 
 * Syncs calendar events from Google Calendar/Outlook
 * Tracks meetings, time allocation, and attendees
 * 
 * NOTE: This requires OAuth setup for Google Calendar/Outlook APIs
 * For now, this provides the structure. Full OAuth implementation
 * will be added when user provides API credentials.
 */

import { getDb } from "./db";
import { 
  calendarEvents,
  communicationEvents,
  keyRelationships,
  InsertCalendarEvent,
  InsertCommunicationEvent 
} from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * Sync events from Google Calendar
 * (Requires Google Calendar API OAuth token)
 */
export async function syncGoogleCalendar(
  userId: number,
  accessToken: string
): Promise<{ synced: number; error?: string }> {
  try {
    // TODO: Implement Google Calendar API sync
    // 1. Fetch upcoming/recent events using Google Calendar API
    // 2. Parse event data
    // 3. Save to database
    // 4. Create communication events for meetings
    // 5. Update relationship data

    return { synced: 0, error: "Google Calendar sync not yet implemented - requires OAuth setup" };
  } catch (error) {
    console.error("Google Calendar sync error:", error);
    return { synced: 0, error: String(error) };
  }
}

/**
 * Sync events from Outlook Calendar
 * (Requires Microsoft Graph API OAuth token)
 */
export async function syncOutlookCalendar(
  userId: number,
  accessToken: string
): Promise<{ synced: number; error?: string }> {
  try {
    // TODO: Implement Outlook Calendar/Microsoft Graph sync
    // 1. Fetch upcoming/recent events using Microsoft Graph API
    // 2. Parse event data
    // 3. Save to database
    // 4. Create communication events for meetings
    // 5. Update relationship data

    return { synced: 0, error: "Outlook Calendar sync not yet implemented - requires OAuth setup" };
  } catch (error) {
    console.error("Outlook Calendar sync error:", error);
    return { synced: 0, error: String(error) };
  }
}

/**
 * Save calendar event to database
 */
export async function saveCalendarEvent(event: InsertCalendarEvent): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(calendarEvents).values(event);
  } catch (error) {
    console.error("Error saving calendar event:", error);
  }
}

/**
 * Create communication events from calendar meeting
 */
export async function createCommunicationEventsFromMeeting(
  userId: number,
  meeting: {
    title: string;
    startTime: Date;
    endTime: Date;
    attendees: string[]; // email addresses
  }
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const duration = Math.floor((meeting.endTime.getTime() - meeting.startTime.getTime()) / (1000 * 60));

    for (const attendeeEmail of meeting.attendees) {
      // Find or create relationship
      let relationship = await db
        .select()
        .from(keyRelationships)
        .where(
          and(
            eq(keyRelationships.userId, userId),
            eq(keyRelationships.contactEmail, attendeeEmail)
          )
        )
        .limit(1);

      let relationshipId: number | undefined;

      if (relationship.length === 0) {
        // Auto-create relationship
        const result = await db.insert(keyRelationships).values({
          userId,
          contactName: attendeeEmail.split("@")[0],
          contactEmail: attendeeEmail,
          importanceLevel: 6, // Meetings suggest higher importance
          minContactFrequency: 14,
          lastContactDate: meeting.startTime,
          totalInteractions: 1,
        });
        relationshipId = result[0].insertId as number;
      } else {
        relationshipId = relationship[0].id;
        
        // Update last contact date
        await db
          .update(keyRelationships)
          .set({
            lastContactDate: meeting.startTime,
            totalInteractions: (relationship[0].totalInteractions || 0) + 1,
          })
          .where(eq(keyRelationships.id, relationshipId));
      }

      // Create communication event
      await db.insert(communicationEvents).values({
        userId,
        relationshipId,
        eventType: "meeting",
        contactEmail: attendeeEmail,
        contactName: relationship.length > 0 ? relationship[0].contactName : attendeeEmail.split("@")[0],
        subject: meeting.title,
        eventDate: meeting.startTime,
        duration,
      });
    }
  } catch (error) {
    console.error("Error creating communication events from meeting:", error);
  }
}

/**
 * Get time allocation statistics from calendar
 */
export async function getTimeAllocationStats(
  userId: number,
  startDate: Date,
  endDate: Date
): Promise<{
  totalMeetingHours: number;
  meetingCount: number;
  focusTimeHours: number;
  topMeetingPartners: Array<{ name: string; hours: number }>;
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalMeetingHours: 0,
      meetingCount: 0,
      focusTimeHours: 0,
      topMeetingPartners: [],
    };
  }

  const events = await db
    .select()
    .from(calendarEvents)
    .where(
      and(
        eq(calendarEvents.userId, userId),
        sql`${calendarEvents.startTime} >= ${startDate}`,
        sql`${calendarEvents.endTime} <= ${endDate}`
      )
    );

  const meetings = events.filter(e => e.eventType === "meeting" || e.eventType === "call");
  const focusTime = events.filter(e => e.eventType === "focus_time");

  const totalMeetingMinutes = meetings.reduce((sum, meeting) => {
    const duration = (meeting.endTime.getTime() - meeting.startTime.getTime()) / (1000 * 60);
    return sum + duration;
  }, 0);

  const focusTimeMinutes = focusTime.reduce((sum, block) => {
    const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
    return sum + duration;
  }, 0);

  // Calculate top meeting partners
  const partnerMinutes: Record<string, number> = {};
  for (const meeting of meetings) {
    if (meeting.attendees) {
      try {
        const attendees = JSON.parse(meeting.attendees);
        const duration = (meeting.endTime.getTime() - meeting.startTime.getTime()) / (1000 * 60);
        
        for (const attendee of attendees) {
          const email = typeof attendee === "string" ? attendee : attendee.email;
          partnerMinutes[email] = (partnerMinutes[email] || 0) + duration;
        }
      } catch (e) {
        // Skip if attendees is not valid JSON
      }
    }
  }

  const topMeetingPartners = Object.entries(partnerMinutes)
    .map(([email, minutes]) => ({
      name: email.split("@")[0],
      hours: Math.round((minutes / 60) * 10) / 10,
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  return {
    totalMeetingHours: Math.round((totalMeetingMinutes / 60) * 10) / 10,
    meetingCount: meetings.length,
    focusTimeHours: Math.round((focusTimeMinutes / 60) * 10) / 10,
    topMeetingPartners,
  };
}

/**
 * Manual meeting logging (for when OAuth isn't set up)
 */
export async function logManualMeeting(
  userId: number,
  data: {
    title: string;
    attendees: string[]; // email addresses or names
    startTime: Date;
    duration: number; // minutes
  }
): Promise<void> {
  const endTime = new Date(data.startTime.getTime() + data.duration * 60 * 1000);

  await createCommunicationEventsFromMeeting(userId, {
    title: data.title,
    startTime: data.startTime,
    endTime,
    attendees: data.attendees,
  });
}
