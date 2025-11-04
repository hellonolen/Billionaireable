import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { dashboardSections, healthBiomarkers, healthGoals, metricsData } from "../drizzle/schema";

/**
 * Get all dashboard data for a user
 */
export async function getDashboardData(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [sections, biomarkers, goals, metrics] = await Promise.all([
    db.select().from(dashboardSections).where(eq(dashboardSections.userId, userId)),
    db.select().from(healthBiomarkers).where(eq(healthBiomarkers.userId, userId)),
    db.select().from(healthGoals).where(eq(healthGoals.userId, userId)),
    db.select().from(metricsData).where(eq(metricsData.userId, userId)),
  ]);

  return {
    sections,
    biomarkers,
    goals,
    metrics,
  };
}
