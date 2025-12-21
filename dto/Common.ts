export type PaginationRequestDto = {
    page?: number;
    size?: number;
}

export type PaginationResponseDto<T> = {
    items: T[];
    totalItems: number;
    page?: number;
    size?: number;
}