import { NextRequest, NextResponse } from "next/server";
import { ChatBotService } from "@/service/ChatBotService";

/**
 * POST /api/chatbot
 * Send a message to the chatbot
 * Body: { sessionId: string, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "sessionId and message are required" },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "message must be a non-empty string" },
        { status: 400 }
      );
    }

    const result = await ChatBotService.chat(sessionId, message.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to process message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: result.response,
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chatbot?sessionId=xxx
 * Get chat history for a session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const result = await ChatBotService.getHistory(sessionId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: result.messages,
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chatbot?sessionId=xxx
 * Clear chat history for a session
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const result = ChatBotService.clearHistory(sessionId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

