import { NextRequest, NextResponse } from "next/server";
import { DentalHealthCheckService } from "@/service/HealthCheckService";
import { validateJWTToken } from "@/utils/common";

// GET /api/health-check/latest
export async function GET(request: NextRequest) {
    try {
        // Validate JWT token
        const authUser = await validateJWTToken(request.headers.get("Authorization")?.split(" ")[1] || "");
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get latest health check result
        const result = await DentalHealthCheckService.getMyLatestHealthCheckResult(authUser.userId);

        if (!result) {
            return NextResponse.json(
                { error: "No health check result found" },
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
        console.error("Health check latest error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

