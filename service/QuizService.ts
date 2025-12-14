import { Quiz } from "@/models/Quiz";
import { QuizRepository } from "@/repository/QuizRepository";
import { QuizQuestion, UserSubmitQuizAnswer, UserSubmitQuizAnswerResponse,GameQuizSubmitAnswer,GameQuizSubmitAnswerResponse, UserSubmitResultOxQuestion, UserSubmitResultMultiChoiceQuestion } from "@/dto/Quiz";


export class QuizService{
    private static repository = new QuizRepository();

    static async getQuiz(id: string): Promise<Quiz | null> {
        return await this.repository.findById(id);
    }

    //get all quizzes
    static async getAllQuizzes(): Promise<Quiz[]> {
        return await this.repository.findAllASC();
    }

    //get all quiz questions by quiz id
    static async getQuizQuestionsByQuizId(quizId: string): Promise<QuizQuestion> {

        //get all ox questions by quiz id
        const oxQuestions = await this.repository.getOxQuestionsByQuizId(quizId);

        //get all multi choice questions by quiz id
        const multiChoiceQuestions = await this.repository.getMultiChoiceQuestionsByQuizId(quizId);

    
        //get multi choice question with choice options
        const multiChoiceQuestionsWithChoiceOptions = await Promise.all(multiChoiceQuestions.map(async (multiChoiceQuestion) => {
            const choiceOptions = await this.repository.getChoiceOptionsByMultiChoiceQuestionId(multiChoiceQuestion.id ?? 0);
            return {
                ...multiChoiceQuestion,
                choiceOptions: choiceOptions,
            }
        }));

        return {
            oxQuestions: oxQuestions.map(oxQuestion => ({
                id: oxQuestion.id ?? 0,
                question: oxQuestion.question ?? "",
            })),
            multiChoiceQuestions: multiChoiceQuestionsWithChoiceOptions.map(multiChoiceQuestion => ({
                id: multiChoiceQuestion.id ?? 0,
                question: multiChoiceQuestion.question ?? "",
                choiceOptions: multiChoiceQuestion.choiceOptions.map(choiceOption => ({
                    id: choiceOption.id ?? 0,
                    title: choiceOption.title ?? "",
                    multi_choice_question_id: multiChoiceQuestion.id ?? 0,
                })),
            })),
        };
    }

    //check user submit quiz
    static async checkUserSubmitQuiz(userSubmitQuizAnswer: UserSubmitQuizAnswer): Promise<UserSubmitQuizAnswerResponse> {
        
        //get all ox questions by quiz id
        const oxQuestionsWithCorrectAnswer = await this.repository.getOxQuestionsByQuizId(userSubmitQuizAnswer.quizId);

        //check user submit ox questions
        const userSubmitResultOxQuestions = userSubmitQuizAnswer.oxQuestions.map(oxQuestion => {
            const correctAnswer = oxQuestionsWithCorrectAnswer.find(
                oxQuestionWithCorrectAnswer => String(oxQuestionWithCorrectAnswer.id) === String(oxQuestion.ox_question_id)
            );
            
            return {
                ox_question_id: oxQuestion.ox_question_id,
                is_correct: correctAnswer ? oxQuestion.selected_answer_ox === correctAnswer.is_correct : false,
                selected_answer_ox: oxQuestion.selected_answer_ox,
                correct_answer_ox: correctAnswer?.is_correct ?? false,
                explanation: correctAnswer?.explanation ?? "",
            };
        });


        let userSubmitResultMultiChoiceQuestions: UserSubmitQuizAnswerResponse['multiChoiceQuestions'] = [];

        if(userSubmitQuizAnswer.multiChoiceQuestions.length > 0){
            //get multi choice question with choice options
            const multiChoiceQuestionsWithCorrectChoiceOptions = await Promise.all(userSubmitQuizAnswer.multiChoiceQuestions.map(async (multiChoiceQuestion) => {
                const multiChoiceQuestionWithCorrectAnswer = await this.repository.getMultiChoiceQuestionById(multiChoiceQuestion.multi_choice_question_id);
                const choiceOptions = await this.repository.getChoiceOptionsByMultiChoiceQuestionId(multiChoiceQuestion.multi_choice_question_id);
                return {
                    ...multiChoiceQuestion,
                    choiceOptions: choiceOptions,
                    explanation: multiChoiceQuestionWithCorrectAnswer?.explanation ?? "",
                }
            }));

            //check user submit multi choice questions
            userSubmitResultMultiChoiceQuestions = userSubmitQuizAnswer.multiChoiceQuestions.map(multiChoiceQuestion => {
            const questionWithOptions = multiChoiceQuestionsWithCorrectChoiceOptions.find(
                multiChoiceQuestionWithCorrectAnswer => multiChoiceQuestionWithCorrectAnswer.multi_choice_question_id === multiChoiceQuestion.multi_choice_question_id
            );
            
            const selectedOption = questionWithOptions?.choiceOptions.find(
                choiceOption => String(choiceOption.id) === String(multiChoiceQuestion.selected_choice_option_id)
            );
            
            const correctOption = questionWithOptions?.choiceOptions.find(
                choiceOption => choiceOption.is_answer === true
            );
            
            return {
                multi_choice_question_id: multiChoiceQuestion.multi_choice_question_id,
                selected_choice_option_id: multiChoiceQuestion.selected_choice_option_id,
                is_correct: selectedOption?.is_answer ?? false,
                correct_choice_option_id: correctOption?.id ?? 0,
                explanation: questionWithOptions?.explanation ?? "",
            };
        });
            
        }

        

        

        return {
            oxQuestions: userSubmitResultOxQuestions,
            multiChoiceQuestions: userSubmitResultMultiChoiceQuestions,
        };
    }

    //check game quiz
    static async checkGameQuiz(gameQuizSubmitAnswer: GameQuizSubmitAnswer): Promise<GameQuizSubmitAnswerResponse> {

        if(gameQuizSubmitAnswer.quizType === "OX"){

            //get all ox questions by quiz id
        const oxQuestionWithCorrectAnswer = await this.repository.getOxQuestionById(gameQuizSubmitAnswer.oxQuestion.ox_question_id);

        //check user submit ox questions
        const correctAnswer = oxQuestionWithCorrectAnswer?.is_correct ?? false;
        const userAnswer = gameQuizSubmitAnswer.oxQuestion.selected_answer_ox;
        const isCorrect = correctAnswer === userAnswer;
        
        const userSubmitResultOxQuestion: UserSubmitResultOxQuestion = {
            ox_question_id: gameQuizSubmitAnswer.oxQuestion.ox_question_id,
            is_correct: isCorrect,
            selected_answer_ox: userAnswer,
            correct_answer_ox: correctAnswer,
            explanation: oxQuestionWithCorrectAnswer?.explanation ?? "",
        };

        return {
            oxQuestion: userSubmitResultOxQuestion,
            multiChoiceQuestion: null,
        };
        }

        if(gameQuizSubmitAnswer.quizType === "MULTI_CHOICE"){

            //get multi choice question with choice options
            const multiChoiceQuestionsWithCorrectChoiceOptions = await this.repository.getChoiceOptionsByMultiChoiceQuestionId(gameQuizSubmitAnswer.multiChoiceQuestion.multi_choice_question_id);

            const multiChoiceQuestion = await this.repository.getMultiChoiceQuestionById(gameQuizSubmitAnswer.multiChoiceQuestion.multi_choice_question_id);


            //check user submit multi choice questions
            const correctChoiceOption = multiChoiceQuestionsWithCorrectChoiceOptions.find(choiceOption => choiceOption.is_answer === true);
            const correctChoiceOptionId = correctChoiceOption?.id ?? 0;
            const selectedChoiceOptionId = gameQuizSubmitAnswer.multiChoiceQuestion.selected_choice_option_id;
            const isCorrect = correctChoiceOptionId == selectedChoiceOptionId;

            
            const userSubmitResultMultiChoiceQuestion: UserSubmitResultMultiChoiceQuestion = {
                multi_choice_question_id: gameQuizSubmitAnswer.multiChoiceQuestion.multi_choice_question_id,
                is_correct: isCorrect,
                selected_choice_option_id: selectedChoiceOptionId,
                correct_choice_option_id: correctChoiceOptionId,
                explanation: multiChoiceQuestion?.explanation ?? "",
            };
            return {
                multiChoiceQuestion: userSubmitResultMultiChoiceQuestion,
                oxQuestion: null,
            };
        }

        return {
            oxQuestion: null,
            multiChoiceQuestion: null,
        }
    }
}
