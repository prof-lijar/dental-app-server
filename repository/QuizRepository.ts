import { BaseRepository } from "./base.repository";
import { ChoiceOption, MultiChoiceQuestion, OxQuestion, Quiz } from "@/models/Quiz";

export class QuizRepository extends BaseRepository<Quiz>{
    protected tableName = "quiz";
    protected primaryKey = "id";


    //get all ox questions by quiz id
    async getOxQuestionsByQuizId(quizId: string): Promise<OxQuestion[]> {
        const query = `SELECT oxq.* FROM ox_question oxq
                        INNER JOIN quiz_ox_question_map qoxqm ON qoxqm.ox_question_id = oxq.id

                        WHERE qoxqm.quiz_id = $1`;
        const result = await this.executeQuery<OxQuestion>(query, [quizId]);
        return result.rows;
    }

    //get all multi choice questions by quiz id
    async getMultiChoiceQuestionsByQuizId(quizId: string): Promise<MultiChoiceQuestion[]> {
        const query = `SELECT mcq.* FROM multi_choice_question mcq
                        INNER JOIN quiz_multi_choice_question_map qmcqm ON qmcqm.multi_choice_question_id = mcq.id
                        WHERE qmcqm.quiz_id = $1
                        ORDER BY mcq.id ASC`;
        const result = await this.executeQuery<MultiChoiceQuestion>(query, [quizId]);
        return result.rows;
    }

    //get choice options by multi choice question id
    async getChoiceOptionsByMultiChoiceQuestionId(multiChoiceQuestionId: number): Promise<ChoiceOption[]> {
        const query = `SELECT co.* FROM choice_option co
                        WHERE co.multi_choice_question_id = $1
                        ORDER BY co.id ASC`;
        const result = await this.executeQuery<ChoiceOption>(query, [multiChoiceQuestionId]);
        return result.rows;
    }
}