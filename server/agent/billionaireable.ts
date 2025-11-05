import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { agentLogs, metricsData, notifications, contacts } from "../../drizzle/schema";
import { eq, and, desc, gt } from "drizzle-orm";

/**
 * Billionaireable AI Agent
 * Monitors all dashboard metrics, detects anomalies, generates insights, and takes actions
 */

interface AgentContext {
  userId: number;
  metrics: any[];
  contacts: any[];
  recentActivity: any[];
}

export class BillionaireableAgent {
  private userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  /**
   * Main agent loop - analyzes user's dashboard and generates insights
   */
  async analyze(): Promise<{
    insights: string[];
    alerts: Array<{ severity: string; message: string }>;
    recommendations: string[];
  }> {
    const context = await this.gatherContext();
    
    // Use LLM to analyze the context
    const analysis = await this.performAnalysis(context);
    
    // Log agent activity
    await this.logActivity("analyzer", "Performed dashboard analysis", context, analysis);
    
    return analysis;
  }

  /**
   * Detect anomalies in metrics
   */
  async detectAnomalies(): Promise<Array<{ metric: string; anomaly: string; severity: string }>> {
    const db = await getDb();
    if (!db) return [];

    // Get recent metrics
    const recentMetrics = await db
      .select()
      .from(metricsData)
      .where(eq(metricsData.userId, this.userId))
      .orderBy(desc(metricsData.date))
      .limit(100);

    // Group by metric type
    const metricsByType: Record<string, any[]> = {};
    for (const m of recentMetrics) {
      if (!metricsByType[m.metric]) {
        metricsByType[m.metric] = [];
      }
      metricsByType[m.metric].push(m);
    }

    const anomalies: Array<{ metric: string; anomaly: string; severity: string }> = [];

    // Analyze each metric for anomalies
    for (const [metricName, values] of Object.entries(metricsByType)) {
      if (values.length < 3) continue;

      const numericValues = values
        .map(v => parseFloat(v.value))
        .filter(v => !isNaN(v));

      if (numericValues.length < 3) continue;

      // Calculate simple statistics
      const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      const stdDev = Math.sqrt(
        numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length
      );

      const latest = numericValues[0];
      const zScore = Math.abs((latest - mean) / stdDev);

      // Flag if latest value is more than 2 standard deviations from mean
      if (zScore > 2) {
        anomalies.push({
          metric: metricName,
          anomaly: `Unusual ${latest > mean ? 'increase' : 'decrease'} detected`,
          severity: zScore > 3 ? 'critical' : 'warning',
        });
      }
    }

    await this.logActivity("monitor", "Detected anomalies", { metricsCount: recentMetrics.length }, { anomalies });

    return anomalies;
  }

  /**
   * Generate predictive forecasts
   */
  async generateForecasts(): Promise<Record<string, any>> {
    const db = await getDb();
    if (!db) return {};

    const recentMetrics = await db
      .select()
      .from(metricsData)
      .where(and(
        eq(metricsData.userId, this.userId),
        eq(metricsData.metric, 'net_worth')
      ))
      .orderBy(desc(metricsData.date))
      .limit(12); // Last 12 data points

    if (recentMetrics.length < 3) {
      return { net_worth_forecast: null };
    }

    const values = recentMetrics.map(m => parseFloat(m.value)).filter(v => !isNaN(v)).reverse();
    
    // Simple linear regression for trend
    const n = values.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, val, idx) => sum + val * (idx + 1), 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Forecast next 3 months
    const forecasts = [];
    for (let i = 1; i <= 3; i++) {
      forecasts.push({
        month: i,
        predicted: intercept + slope * (n + i),
      });
    }

    await this.logActivity("predictor", "Generated forecasts", { dataPoints: n }, { forecasts });

    return { net_worth_forecast: forecasts };
  }

  /**
   * Check relationship health (who needs follow-up)
   */
  async checkRelationships(): Promise<Array<{ contact: any; daysSinceContact: number }>> {
    const db = await getDb();
    if (!db) return [];

    const allContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, this.userId));

    const needsFollowUp: Array<{ contact: any; daysSinceContact: number }> = [];

    const now = new Date();
    for (const contact of allContacts) {
      if (contact.lastContactedAt) {
        const daysSince = Math.floor((now.getTime() - new Date(contact.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24));
        
        // Flag if high-importance contact hasn't been contacted in 30+ days
        if (contact.importance && contact.importance >= 4 && daysSince > 30) {
          needsFollowUp.push({ contact, daysSinceContact: daysSince });
        }
      }
    }

    if (needsFollowUp.length > 0) {
      await this.logActivity("monitor", "Identified relationships needing follow-up", {}, { needsFollowUp: needsFollowUp.length });
    }

    return needsFollowUp;
  }

  /**
   * Generate daily briefing
   */
  async generateDailyBriefing(): Promise<string> {
    const anomalies = await this.detectAnomalies();
    const forecasts = await this.generateForecasts();
    const relationships = await this.checkRelationships();
    const analysis = await this.analyze();

    const briefingPrompt = `Generate a concise daily briefing for a billionaire based on this data:

Anomalies detected: ${JSON.stringify(anomalies)}
Forecasts: ${JSON.stringify(forecasts)}
Relationships needing attention: ${relationships.length} contacts
Recent insights: ${JSON.stringify(analysis.insights)}

Format the briefing as:
1. Key alerts (if any)
2. Important metrics updates
3. Action items
4. Opportunities

Keep it under 200 words, professional tone.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are Billionaireable, an AI assistant for billionaires. Be concise, actionable, and insightful." },
        { role: "user", content: briefingPrompt },
      ],
    });

    const content = response.choices[0].message.content;
    const briefing = typeof content === 'string' ? content : "No briefing available";

    await this.logActivity("analyzer", "Generated daily briefing", {}, { briefing });

    return briefing;
  }

  /**
   * Gather context about user's current state
   */
  private async gatherContext(): Promise<AgentContext> {
    const db = await getDb();
    if (!db) {
      return { userId: this.userId, metrics: [], contacts: [], recentActivity: [] };
    }

    const [metrics, userContacts, logs] = await Promise.all([
      db.select().from(metricsData).where(eq(metricsData.userId, this.userId)).orderBy(desc(metricsData.date)).limit(50),
      db.select().from(contacts).where(eq(contacts.userId, this.userId)),
      db.select().from(agentLogs).where(eq(agentLogs.userId, this.userId)).orderBy(desc(agentLogs.createdAt)).limit(10),
    ]);

    return {
      userId: this.userId,
      metrics,
      contacts: userContacts,
      recentActivity: logs,
    };
  }

  /**
   * Perform LLM-based analysis
   */
  private async performAnalysis(context: AgentContext): Promise<{
    insights: string[];
    alerts: Array<{ severity: string; message: string }>;
    recommendations: string[];
  }> {
    const prompt = `Analyze this billionaire's dashboard data and provide insights:

Recent metrics: ${JSON.stringify(context.metrics.slice(0, 10))}
Contact count: ${context.contacts.length}
Recent activity: ${JSON.stringify(context.recentActivity)}

Provide:
1. 3 key insights
2. Any critical alerts
3. 3 actionable recommendations

Format as JSON: { "insights": [], "alerts": [], "recommendations": [] }`;

    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are Billionaireable, an AI analyst. Respond only with valid JSON." },
          { role: "user", content: prompt },
        ],
      });

      const rawContent = response.choices[0].message.content;
      const content = typeof rawContent === 'string' ? rawContent : "{}";
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      console.error("Analysis error:", error);
      return {
        insights: ["Analysis in progress"],
        alerts: [],
        recommendations: ["Continue monitoring metrics"],
      };
    }
  }

  /**
   * Log agent activity
   */
  private async logActivity(agentType: string, action: string, context: any, result: any) {
    const db = await getDb();
    if (!db) return;

    await db.insert(agentLogs).values({
      userId: this.userId,
      agentType,
      action,
      context: JSON.stringify(context),
      result: JSON.stringify(result),
      severity: 'info',
    });
  }
}
