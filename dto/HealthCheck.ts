import { PaginationRequestDto, PaginationResponseDto } from "./Common";

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

export type HealthCheckResponseDto = {
    evaluationResult: string;
    myStatus: string;
    score: number; // 0-100, where 100 is full score
    toDo: string[];
    recommend: string[];
    task: string[];
    created_at?: Date;
    updated_at?: Date;
}

export type HealthCheckHistoryRequestDto = PaginationRequestDto & {
    userId: string;
}

export type HealthCheckHistoryResponseDto = PaginationResponseDto<HealthCheckResponseDto> & {
}