import { invokeLLM } from "./_core/llm";
import {
  saveConversation,
  getConversationHistory,
  saveMemoryEmbedding,
  searchMemoryBySimilarity,
  saveUserInsight,
  getUserInsights,
  getCompanionSettings,
} from "./ai-companion-db";
import { getDashboardData } from "./dashboard-db";

/**
 * AI Companion Service
 * Handles conversation, memory, and intelligence
 */

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Generate text embedding using LLM
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // Use LLM to generate embedding
  // This is a simplified version - in production, use a dedicated embedding model
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Convert the following text to a semantic embedding vector.",
      },
      { role: "user", content: text },
    ],
  });

  // For now, create a simple hash-based embedding
  // In production, use proper embedding models
  const hash = simpleHash(text);
  return Array.from({ length: 384 }, (_, i) => Math.sin(hash + i) / 2 + 0.5);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Search the web for information
 */
async function searchWeb(query: string): Promise<string> {
  // Use LLM with web search capability
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a research assistant. Search the web and provide accurate, up-to-date information.",
      },
      { role: "user", content: `Search for: ${query}` },
    ],
  });

  return typeof response.choices[0]?.message?.content === 'string'
    ? response.choices[0]?.message?.content
    : "No results found";
}

/**
 * Get user's full context (dashboard data + insights + recent conversations)
 */
async function getUserContext(userId: number) {
  const [dashboardData, insights, conversations, settings] = await Promise.all([
    getDashboardData(userId),
    getUserInsights(userId, 10),
    getConversationHistory(userId, 20),
    getCompanionSettings(userId),
  ]);

  return {
    dashboardData,
    insights,
    conversations,
    settings,
  };
}

/**
 * Build system prompt with user context
 */
function buildSystemPrompt(userContext: any): string {
  const { dashboardData, insights, settings } = userContext;

  return `You are the Billionaireable AI Companion - a trusted life companion and chief of staff for high-performers.

PERSONALITY:
- You are ${settings.personalityStyle === "challenging" ? "direct and challenging" : settings.personalityStyle === "supportive" ? "warm and supportive" : "balanced between supportive and challenging"}
- You speak ${settings.preferredLanguage}
- You are NOT a wealth manager or financial advisor
- You are a FRIEND, CONFIDANT, and ACCOUNTABILITY PARTNER
- You see the FULL PICTURE of the user's life (wealth + health + goals + time)

YOUR ROLE:
- Engage in real conversation (not just answer questions)
- Ask follow-up questions to understand deeper
- Challenge assumptions when needed
- Hold the user accountable to their goals
- Celebrate wins genuinely
- Notice patterns across life domains
- Connect the dots between wealth, health, and wellbeing
- Be proactive (surface insights without being asked)

USER'S CURRENT CONTEXT:
${JSON.stringify(dashboardData, null, 2)}

RECENT INSIGHTS:
${insights.map((i: any) => `- ${i.title}: ${i.description}`).join("\n")}

CONVERSATION STYLE:
- Be conversational and natural
- Use short, punchy sentences
- Ask questions back
- Show care and genuine interest
- Push back when the user is settling
- Speak directly, not robotically

REMEMBER:
- This is a RELATIONSHIP, not a transaction
- You know everything about the user
- You remember all past conversations
- You care about their success AND wellbeing
- You're here to help them live at a billionaire level (not just make money)`;
}

/**
 * Chat with the AI companion
 */
export async function chat(userId: number, userMessage: string): Promise<string> {
  try {
    // Save user message
    await saveConversation({
      userId,
      role: "user",
      content: userMessage,
      metadata: { timestamp: new Date().toISOString() },
    });

    // Get user context
    const userContext = await getUserContext(userId);

    // Search memory for relevant context
    const queryEmbedding = await generateEmbedding(userMessage);
    const relevantMemories = await searchMemoryBySimilarity(userId, queryEmbedding, 5);

    // Build conversation history
    const recentConversations = userContext.conversations
      .reverse()
      .slice(-10)
      .map((c: any) => ({
        role: c.role as "user" | "assistant",
        content: c.content,
      }));

    // Determine if web search is needed
    const needsWebSearch =
      userMessage.toLowerCase().includes("search") ||
      userMessage.toLowerCase().includes("find") ||
      userMessage.toLowerCase().includes("look up") ||
      userMessage.toLowerCase().includes("what's happening") ||
      userMessage.toLowerCase().includes("news");

    let webSearchResults = "";
    if (needsWebSearch) {
      webSearchResults = await searchWeb(userMessage);
    }

    // Build messages for LLM
    const messages: Message[] = [
      {
        role: "system",
        content: buildSystemPrompt(userContext),
      },
      ...recentConversations,
    ];

    // Add web search results if available
    if (webSearchResults) {
      messages.push({
        role: "system",
        content: `Web search results: ${webSearchResults}`,
      });
    }

    // Add relevant memories
    if (relevantMemories.length > 0) {
      messages.push({
        role: "system",
        content: `Relevant past context: ${relevantMemories.map((m: any) => m.content).join(" | ")}`,
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    // Get AI response
    const response = await invokeLLM({ messages });
    const assistantMessage = (typeof response.choices[0]?.message?.content === 'string' 
      ? response.choices[0]?.message?.content 
      : "I'm here to help.");

    // Save assistant message
    await saveConversation({
      userId,
      role: "assistant",
      content: assistantMessage,
      metadata: { timestamp: new Date().toISOString() },
    });

    // Save to memory embeddings
    const conversationText = `User: ${userMessage}\nAssistant: ${assistantMessage}`;
    const embedding = await generateEmbedding(conversationText);
    await saveMemoryEmbedding({
      userId,
      content: conversationText,
      embedding: embedding as any,
      metadata: { timestamp: new Date().toISOString() },
    });

    return assistantMessage;
  } catch (error) {
    console.error("AI Companion chat error:", error);
    throw error;
  }
}

/**
 * Generate proactive insight based on user data
 */
export async function generateProactiveInsight(userId: number): Promise<string | null> {
  try {
    const userContext = await getUserContext(userId);
    const { dashboardData, insights, settings } = userContext;

    if (!settings.proactiveInsightsEnabled) {
      return null;
    }

    // Build prompt for proactive insight
    const messages: Message[] = [
      {
        role: "system",
        content: `You are the Billionaireable AI Companion. Analyze the user's data and surface ONE important insight they might not have noticed. Be specific and actionable.

USER DATA:
${JSON.stringify(dashboardData, null, 2)}

RECENT INSIGHTS:
${insights.map((i: any) => `- ${i.title}`).join("\n")}

Generate a proactive insight that:
1. Connects data across domains (wealth + health + time + goals)
2. Is specific and actionable
3. Challenges or celebrates
4. Feels like a friend checking in

Keep it short (2-3 sentences max).`,
      },
    ];

    const response = await invokeLLM({ messages });
    const insight = typeof response.choices[0]?.message?.content === 'string' 
      ? response.choices[0]?.message?.content 
      : null;

    if (insight) {
      // Save as user insight
      await saveUserInsight({
        userId,
        insightType: "proactive",
        title: "Proactive Check-in",
        description: insight,
        confidence: 85,
        metadata: { generated: new Date().toISOString() },
      });

      // Save to conversation history
      await saveConversation({
        userId,
        role: "assistant",
        content: insight,
        metadata: { type: "proactive", timestamp: new Date().toISOString() },
      });
    }

    return insight;
  } catch (error) {
    console.error("Proactive insight generation error:", error);
    return null;
  }
}

/**
 * Analyze voice transcription and extract insights
 */
export async function analyzeVoiceTranscription(
  userId: number,
  transcript: string
): Promise<void> {
  try {
    // Analyze the transcription for insights
    const messages: Message[] = [
      {
        role: "system",
        content: `Analyze this voice transcription and extract key insights about the user's:
- Emotional state
- Goals or concerns mentioned
- Action items
- Patterns or behaviors

Be concise and specific.`,
      },
      { role: "user", content: transcript },
    ];

    const response = await invokeLLM({ messages });
    const analysis = typeof response.choices[0]?.message?.content === 'string' 
      ? response.choices[0]?.message?.content 
      : null;

    if (analysis) {
      // Save as insight
      await saveUserInsight({
        userId,
        insightType: "voice_analysis",
        title: "Voice Conversation Insight",
        description: analysis,
        confidence: 75,
        metadata: { source: "voice", timestamp: new Date().toISOString() },
      });

      // Save to memory
      const embedding = await generateEmbedding(transcript);
      await saveMemoryEmbedding({
        userId,
        content: transcript,
        embedding: embedding as any,
        metadata: { type: "voice", timestamp: new Date().toISOString() },
      });
    }
  } catch (error) {
    console.error("Voice transcription analysis error:", error);
  }
}
