import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/service/QuizService";

// GET /api/quiz/all-quizzes
export async function GET(request: NextRequest) {
    try {
        const quizzes = await QuizService.getAllQuizzes();
        return NextResponse.json(quizzes);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

