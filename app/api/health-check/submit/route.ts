import { NextRequest, NextResponse } from "next/server";
import { DentalHealthCheckService } from "@/service/HealthCheckService";
import { HealthCheckSubmitDto } from "@/dto/HealthCheck";
import { validateJWTToken } from "@/utils/common";

// POST /api/health-check/submit
export async function POST(request: NextRequest) {
    try {

        // Validate JWT token
        const authUser = await validateJWTToken(request.headers.get("Authorization")?.split(" ")[1] || "");
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Validate required sections
        if (!body.sectionA || !Array.isArray(body.sectionA)) {
            return NextResponse.json(
                { error: "sectionA is required and must be an array" },
                { status: 400 }
            );
        }

        if (!body.sectionB || !Array.isArray(body.sectionB)) {
            return NextResponse.json(
                { error: "sectionB is required and must be an array" },
                { status: 400 }
            );
        }

        if (!body.sectionC || !Array.isArray(body.sectionC)) {
            return NextResponse.json(
                { error: "sectionC is required and must be an array" },
                { status: 400 }
            );
        }

        if (!body.sectionD || !Array.isArray(body.sectionD)) {
            return NextResponse.json(
                { error: "sectionD is required and must be an array" },
                { status: 400 }
            );
        }

        if (!body.sectionE || !Array.isArray(body.sectionE)) {
            return NextResponse.json(
                { error: "sectionE is required and must be an array" },
                { status: 400 }
            );
        }

        if (!body.sectionF || !Array.isArray(body.sectionF)) {
            return NextResponse.json(
                { error: "sectionF is required and must be an array" },
                { status: 400 }
            );
        }

        // Validate structure of each section
        const validateSection = (section: any[], sectionName: string) => {
            for (const question of section) {
                if (!question.question || typeof question.question !== 'string') {
                    return `Invalid ${sectionName} structure. Each question must have a 'question' (string) field`;
                }
                if (!question.answer || !Array.isArray(question.answer)) {
                    return `Invalid ${sectionName} structure. Each question must have an 'answer' (array) field`;
                }
                for (const answer of question.answer) {
                    if (!answer.option || typeof answer.option !== 'string') {
                        return `Invalid ${sectionName} structure. Each answer must have an 'option' (string) field`;
                    }
                }
            }
            return null;
        };

        const sectionAError = validateSection(body.sectionA, "sectionA");
        if (sectionAError) {
            return NextResponse.json({ error: sectionAError }, { status: 400 });
        }

        const sectionBError = validateSection(body.sectionB, "sectionB");
        if (sectionBError) {
            return NextResponse.json({ error: sectionBError }, { status: 400 });
        }

        const sectionCError = validateSection(body.sectionC, "sectionC");
        if (sectionCError) {
            return NextResponse.json({ error: sectionCError }, { status: 400 });
        }

        const sectionDError = validateSection(body.sectionD, "sectionD");
        if (sectionDError) {
            return NextResponse.json({ error: sectionDError }, { status: 400 });
        }

        const sectionEError = validateSection(body.sectionE, "sectionE");
        if (sectionEError) {
            return NextResponse.json({ error: sectionEError }, { status: 400 });
        }

        const sectionFError = validateSection(body.sectionF, "sectionF");
        if (sectionFError) {
            return NextResponse.json({ error: sectionFError }, { status: 400 });
        }

        // Create DTO
        const healthCheckData: HealthCheckSubmitDto = {
            sectionA: body.sectionA,
            sectionB: body.sectionB,
            sectionC: body.sectionC,
            sectionD: body.sectionD,
            sectionE: body.sectionE,
            sectionF: body.sectionF,
        };

        // Evaluate health check
        const result = await DentalHealthCheckService.evaluateHealthCheck(authUser.userId, healthCheckData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to evaluate health check" },
                { status: 500 }
            );
        }

        // Return structured response
        return NextResponse.json(
            { 
                success: true, 
                ...result.result
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Health check submit error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

