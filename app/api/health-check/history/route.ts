import { NextRequest, NextResponse } from "next/server";
import { DentalHealthCheckService } from "@/service/HealthCheckService";
import { HealthCheckHistoryRequestDto } from "@/dto/HealthCheck";
import { validateJWTToken } from "@/utils/common";

// GET /api/health-check/history
export async function GET(request: NextRequest) {
    try {
        // Validate JWT token
        const authUser = await validateJWTToken(request.headers.get("Authorization")?.split(" ")[1] || "");
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const pageParam = searchParams.get("page");
        const sizeParam = searchParams.get("size");

        // Parse pagination parameters with defaults
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const size = sizeParam ? parseInt(sizeParam, 10) : 10;

        // Validate pagination parameters
        if (isNaN(page) || page < 1) {
            return NextResponse.json(
                { error: "Invalid page parameter. Must be a positive integer." },
                { status: 400 }
            );
        }

        if (isNaN(size) || size < 1 || size > 100) {
            return NextResponse.json(
                { error: "Invalid size parameter. Must be between 1 and 100." },
                { status: 400 }
            );
        }

        // Create request DTO
        const historyRequest: HealthCheckHistoryRequestDto = {
            userId: authUser.userId,
            page: page,
            size: size,
        };

        // Get health check history
        const result = await DentalHealthCheckService.getHealthCheckHistory(historyRequest);

        // Return the result
        return NextResponse.json(
            {
                success: true,
                ...result
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Health check history error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}


