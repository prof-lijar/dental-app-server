export type CreateUserDto = {
    email: string;
    password: string;
    username: string;
    age?: number;
    gender?: string;
    nationality?: string;
}

export type UpdateUserInfoDto = {
    id?: BigInteger;
    user_id: string;
    name?: string;
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

export type AuthUser = {
    userId: string;
    email: string;
    userName: string;
    sessionId: string;
}