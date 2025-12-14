import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/service/QuizService";
import { UserSubmitQuizAnswer } from "@/dto/Quiz";

// POST /api/quiz/submit-quiz
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

        if (!body.oxQuestions || !Array.isArray(body.oxQuestions)) {
            return NextResponse.json(
                { error: "oxQuestions must be an array" },
                { status: 400 }
            );
        }

        

        // Validate oxQuestions structure
        for (const oxQuestion of body.oxQuestions) {
            if (typeof oxQuestion.ox_question_id !== 'number' || 
                typeof oxQuestion.selected_answer_ox !== 'boolean') {
                return NextResponse.json(
                    { error: "Invalid oxQuestions structure. Each oxQuestion must have ox_question_id (number) and selected_answer_ox (boolean)" },
                    { status: 400 }
                );
            }
        }

        // Validate multiChoiceQuestions structure (optional)
        if (body.multiChoiceQuestions !== undefined) {
            if (!Array.isArray(body.multiChoiceQuestions)) {
                return NextResponse.json(
                    { error: "multiChoiceQuestions must be an array" },
                    { status: 400 }
                );
            }
            
            for (const multiChoiceQuestion of body.multiChoiceQuestions) {
                if (typeof multiChoiceQuestion.multi_choice_question_id !== 'number' || 
                    typeof multiChoiceQuestion.selected_choice_option_id !== 'number') {
                    return NextResponse.json(
                        { error: "Invalid multiChoiceQuestions structure. Each multiChoiceQuestion must have multi_choice_question_id (number) and selected_choice_option_id (number)" },
                        { status: 400 }
                    );
                }
            }
        }

        const userSubmitQuizAnswer: UserSubmitQuizAnswer = {
            quizId: body.quizId,
            oxQuestions: body.oxQuestions,
            multiChoiceQuestions: body.multiChoiceQuestions || [],
        };

        const result = await QuizService.checkUserSubmitQuiz(userSubmitQuizAnswer);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

