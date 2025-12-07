import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

interface ChatSession {
  messages: BaseMessage[];
  lastAccessed: Date;
}

export class ChatBotService {
  private static model: ChatGoogleGenerativeAI;
  private static chatSessions: Map<string, ChatSession> = new Map();
  private static readonly SESSION_TTL = 1000 * 60 * 60; // 1 hour in milliseconds
  private static readonly CLEANUP_INTERVAL = 1000 * 60 * 30; // Clean up every 30 minutes

  /**
   * Initialize the Gemini model
   */
  private static initializeModel(): ChatGoogleGenerativeAI {
    if (!this.model) {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
      }

      // Use model from env or default to gemini-pro
      // Common model names: gemini-pro, gemini-1.5-pro, gemini-1.5-flash-latest
      const modelName = process.env.GEMINI_MODEL_NAME || "gemini-pro";

      this.model = new ChatGoogleGenerativeAI({
        model: modelName,
        temperature: 0.7,
        maxOutputTokens: 2048,
        apiKey: apiKey,
      });
    }
    return this.model;
  }

  /**
   * Get or create a chat session for a user
   */
  private static getOrCreateSession(sessionId: string): ChatSession {
    const existingSession = this.chatSessions.get(sessionId);
    
    if (existingSession) {
      // Check if session is still valid
      const now = new Date();
      const timeSinceLastAccess = now.getTime() - existingSession.lastAccessed.getTime();
      
      if (timeSinceLastAccess < this.SESSION_TTL) {
        existingSession.lastAccessed = now;
        return existingSession;
      } else {
        // Session expired, remove it
        this.chatSessions.delete(sessionId);
      }
    }

    // Create new session with empty message history
    const newSession: ChatSession = {
      messages: [],
      lastAccessed: new Date(),
    };
    
    this.chatSessions.set(sessionId, newSession);
    return newSession;
  }

  /**
   * Clean up expired sessions
   */
  private static cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    this.chatSessions.forEach((session, sessionId) => {
      const timeSinceLastAccess = now.getTime() - session.lastAccessed.getTime();
      if (timeSinceLastAccess >= this.SESSION_TTL) {
        expiredSessions.push(sessionId);
      }
    });

    expiredSessions.forEach((sessionId) => {
      this.chatSessions.delete(sessionId);
    });
  }

  /**
   * Start periodic cleanup of expired sessions
   */
  private static startCleanupTimer(): void {
    if (typeof setInterval !== "undefined") {
      setInterval(() => {
        this.cleanupExpiredSessions();
      }, this.CLEANUP_INTERVAL);
    }
  }

  /**
   * Send a message to the chatbot and get a response
   */
  static async chat(
    sessionId: string,
    message: string
  ): Promise<{ success: boolean; response: string; error?: string }> {
    try {
      // Initialize model if not already done
      const model = this.initializeModel();

      // Get or create session
      const session = this.getOrCreateSession(sessionId);

      // Start cleanup timer on first use
      if (this.chatSessions.size === 1) {
        this.startCleanupTimer();
      }

      // Get chat history
      const previousMessages = session.messages;

      // Create prompt template with memory
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "You are a helpful dental assistant chatbot. You provide friendly, professional, and accurate information about dental care, oral health, and related topics. Always be concise and helpful.",
        ],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
      ]);

      // Create the chain with prompt, model, and output parser
      const chain = RunnableSequence.from([
        prompt,
        model,
        new StringOutputParser(),
      ]);

      // Invoke the chain with history and current input
      const responseText = await chain.invoke({
        input: message,
        history: previousMessages,
      });

      // Save messages to history
      session.messages.push(new HumanMessage(message));
      session.messages.push(new AIMessage(responseText));

      return {
        success: true,
        response: responseText,
      };
    } catch (error: any) {
      console.error("ChatBot error:", error);
      return {
        success: false,
        response: "",
        error: error.message || "An error occurred while processing your message",
      };
    }
  }

  /**
   * Clear chat history for a session
   */
  static clearHistory(sessionId: string): { success: boolean; message: string } {
    if (this.chatSessions.has(sessionId)) {
      this.chatSessions.delete(sessionId);
      return { success: true, message: "Chat history cleared" };
    }
    return { success: false, message: "Session not found" };
  }

  /**
   * Get chat history for a session (for debugging/admin purposes)
   */
  static async getHistory(sessionId: string): Promise<{
    success: boolean;
    messages: Array<{ role: string; content: string }>;
  }> {
    const session = this.chatSessions.get(sessionId);
    if (!session) {
      return { success: false, messages: [] };
    }

    const messages = session.messages;
    const formattedMessages = messages.map((msg: BaseMessage) => ({
      role: msg instanceof HumanMessage ? "human" : "ai",
      content: msg.content as string,
    }));

    return {
      success: true,
      messages: formattedMessages,
    };
  }
}

