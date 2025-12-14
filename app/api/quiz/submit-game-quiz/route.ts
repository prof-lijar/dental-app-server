import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/service/QuizService";
import { GameQuizSubmitAnswer } from "@/dto/Quiz";

// POST /api/quiz/submit-game-quiz
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.quizId) {
            return NextResponse.json(
                { error: "quizId is required" },
                { status: 400 }
            );
        }

        if (!body.quizType) {
            return NextResponse.json(
                { error: "quizType is required. Must be 'OX' or 'MULTI_CHOICE'" },
                { status: 400 }
            );
        }

        if (body.quizType !== "OX" && body.quizType !== "MULTI_CHOICE") {
            return NextResponse.json(
                { error: "quizType must be either 'OX' or 'MULTI_CHOICE'" },
                { status: 400 }
            );
        }

        // Validate based on quiz type
        if (body.quizType === "OX") {
            if (!body.oxQuestion) {
                return NextResponse.json(
                    { error: "oxQuestion is required when quizType is 'OX'" },
                    { status: 400 }
                );
            }

            if (typeof body.oxQuestion.ox_question_id !== 'number' || 
                typeof body.oxQuestion.selected_answer_ox !== 'boolean') {
                return NextResponse.json(
                    { error: "Invalid oxQuestion structure. Must have ox_question_id (number) and selected_answer_ox (boolean)" },
                    { status: 400 }
                );
            }
        }

        if (body.quizType === "MULTI_CHOICE") {
            if (!body.multiChoiceQuestion) {
                return NextResponse.json(
                    { error: "multiChoiceQuestion is required when quizType is 'MULTI_CHOICE'" },
                    { status: 400 }
                );
            }

            if (typeof body.multiChoiceQuestion.multi_choice_question_id !== 'number' || 
                typeof body.multiChoiceQuestion.selected_choice_option_id !== 'number') {
                return NextResponse.json(
                    { error: "Invalid multiChoiceQuestion structure. Must have multi_choice_question_id (number) and selected_choice_option_id (number)" },
                    { status: 400 }
                );
            }
        }

        const gameQuizSubmitAnswer: GameQuizSubmitAnswer = {
            quizId: body.quizId,
            quizType: body.quizType,
            oxQuestion: body.oxQuestion || {
                ox_question_id: 0,
                selected_answer_ox: false,
            },
            multiChoiceQuestion: body.multiChoiceQuestion || {
                multi_choice_question_id: 0,
                selected_choice_option_id: 0,
            },
        };

        const result = await QuizService.checkGameQuiz(gameQuizSubmitAnswer);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

