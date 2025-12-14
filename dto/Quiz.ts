export type QuizQuestion ={
    oxQuestions: OxQuestion[];
    multiChoiceQuestions: MultiChoiceQuestion[];
}

export type OxQuestion ={
    id: number;
    question: string;
    is_correct: boolean;
    explanation: string;
}

export type MultiChoiceQuestion ={
    id: number;
    question: string;
    explanation: string;
    choiceOptions: ChoiceOption[];
}

export type ChoiceOption ={
    id: number;
    title: string;
    is_answer: boolean;
    multi_choice_question_id: number;
}