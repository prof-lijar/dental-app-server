export type HealthCheckSubmitDto = {
    sectionA:CheckQuestion[];
    sectionB:CheckQuestion[];
    sectionC:CheckQuestion[];
    sectionD:CheckQuestion[];
    sectionE:CheckQuestion[];
    sectionF:CheckQuestion[];
}

type CheckQuestion = {
    question: string;
    answer: AnswerOption[];
}

type AnswerOption = {
    option: string;
}