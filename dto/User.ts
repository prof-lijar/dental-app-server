export type CreateUserDto = {
    email: string;
    password: string;
    username: string;
    age?: number;
    gender?: string;
    nationality?: string;
}

export type UpdateUserDto = {
    email?: string;
    password?: string;
    username?: string;
    age?: number;
    gender?: string;
    nationality?: string;
}

export type LoggedInUser = {
    userId: string;
    email: string;
    username: string;
    accessToken: string;
    sessionId: string;
    refreshToken: string;
}