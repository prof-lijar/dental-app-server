export interface Quiz{
    id?: number;
    title: string;
    is_deleted: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
}

export interface OxQuestion{
    id?: number;
    question: string;
    is_correct: boolean;
    explanation: string;
    is_deleted: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
}

export interface MultiChoiceQuestion{
    id?: number;
    question: string;
    explanation: string;
    is_deleted: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
}

export interface ChoiceOption{ 
    id?: number;
    multi_choice_question_id: number;
    title: string;
    is_answer: boolean;
}

export interface QuizOxQuestionMap{
    quiz_id: number;
    ox_question_id: number;
}

export interface QuizMultiChoiceQuestionMap{
    quiz_id: number;
    multi_choice_question_id: number;
}