// API endpoint to keep database alive
// Called by Vercel cron job at midnight to prevent Supabase free plan from sleeping

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/utils/db";

// GET /api/keep-alive
export async function GET(request: NextRequest) {
  try {
    // Verify this is called by Vercel cron job or has valid authorization
    const vercelCronHeader = request.headers.get("x-vercel-cron");
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow if it's a Vercel cron job (has x-vercel-cron header)
    // Or if CRON_SECRET is set, require valid Bearer token
    const isVercelCron = !!vercelCronHeader;
    const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;
    
    if (!isVercelCron && !hasValidSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Execute a simple query to keep the database connection alive
    const result = await executeQuery("SELECT 1 as keep_alive");
    
    return NextResponse.json({
      success: true,
      message: "Database keep-alive successful",
      timestamp: new Date().toISOString(),
      result: result.rows[0],
    });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to keep database alive",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

