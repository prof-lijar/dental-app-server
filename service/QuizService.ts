import { Quiz } from "@/models/Quiz";
import { QuizRepository } from "@/repository/QuizRepository";
import { QuizQuestion } from "@/dto/Quiz";

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
                is_correct: oxQuestion.is_correct ?? false,
                explanation: oxQuestion.explanation ?? "",
            })),
            multiChoiceQuestions: multiChoiceQuestionsWithChoiceOptions.map(multiChoiceQuestion => ({
                id: multiChoiceQuestion.id ?? 0,
                question: multiChoiceQuestion.question ?? "",
                explanation: multiChoiceQuestion.explanation ?? "",
                choiceOptions: multiChoiceQuestion.choiceOptions.map(choiceOption => ({
                    id: choiceOption.id ?? 0,
                    title: choiceOption.title ?? "",
                    is_answer: choiceOption.is_answer ?? false,
                    multi_choice_question_id: multiChoiceQuestion.id ?? 0,
                })),
            })),
        };
    }}