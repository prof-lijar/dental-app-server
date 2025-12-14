export type QuizQuestion ={
    oxQuestions: OxQuestion[];
    multiChoiceQuestions: MultiChoiceQuestion[];
}

export type OxQuestion ={
    id: number;
    question: string;
    is_correct?: boolean;
    explanation?: string;
}

export type MultiChoiceQuestion ={
    id: number;
    question: string;
    explanation?: string;
    choiceOptions: ChoiceOption[];
}

export type ChoiceOption ={
    id: number;
    title: string;
    is_answer?: boolean;
    multi_choice_question_id: number;
}

//user submit quiz answer
export type UserSubmitQuizAnswer ={
    quizId: string;
    oxQuestions: UserSubmitOxQuestion[];
    multiChoiceQuestions: UserSubmitMultiChoiceQuestion[];
}

export type UserSubmitOxQuestion ={
    ox_question_id: number;
    selected_answer_ox: boolean; //true O, false X
}

export type UserSubmitMultiChoiceQuestion ={
    multi_choice_question_id: number;
    selected_choice_option_id: number;
}

//user submit quiz answer response
export type UserSubmitQuizAnswerResponse ={
    oxQuestions: UserSubmitResultOxQuestion[];
    multiChoiceQuestions: UserSubmitResultMultiChoiceQuestion[];
}

export type UserSubmitResultOxQuestion ={
    ox_question_id: number;
    is_correct: boolean; //true if selected answer is correct, false if selected answer is incorrect
    selected_answer_ox: boolean; //true O, false X
    correct_answer_ox: boolean; //true O, false X
}

export type UserSubmitResultMultiChoiceQuestion ={
    multi_choice_question_id: number;
    is_correct: boolean; //true if selected answer is correct, false if selected answer is incorrect
    correct_choice_option_id: number;
    selected_choice_option_id: number;
}