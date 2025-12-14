import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/service/QuizService";

// GET /api/quiz/quiz-questions?quizId=xxx
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const quizId = searchParams.get("quizId");

        if (!quizId) {
            return NextResponse.json(
                { error: "quizId is required" },
                { status: 400 }
            );
        }

        const quizQuestions = await QuizService.getQuizQuestionsByQuizId(quizId);
        return NextResponse.json(quizQuestions);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

