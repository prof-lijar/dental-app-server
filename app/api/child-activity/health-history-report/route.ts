import { NextRequest, NextResponse } from "next/server";
import { DentalHealthCheckService } from "@/service/HealthCheckService";
import { validateJWTToken } from "@/utils/common";

// GET /api/child-activity/health-history-report?childId=xxx
export async function GET(request: NextRequest) {
    try {
        // Validate JWT token
        const authUser = await validateJWTToken(request.headers.get("Authorization")?.split(" ")[1] || "");
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get childId from query parameters
        const searchParams = request.nextUrl.searchParams;
        const childId = searchParams.get("childId");

        if (!childId) {
            return NextResponse.json(
                { error: "childId query parameter is required" },
                { status: 400 }
            );
        }

        // Get child health check result (latest)
        const result = await DentalHealthCheckService.getChildHealthCheckResult(
            authUser.userId,
            childId
        );

        if (!result) {
            return NextResponse.json(
                { error: "No health check result found for this child" },
                { status: 404 }
            );
        }

        // Return the result
        return NextResponse.json(
            {
                success: true,
                ...result
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Child health history report error:", error);
        
        // Handle unauthorized access
        if (error.message && error.message.includes("Parent-child relationship not found")) {
            return NextResponse.json(
                { error: "Unauthorized: Parent-child relationship not found" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
