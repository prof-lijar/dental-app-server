
export interface Users{
    id?: string;
    username: string;
    email: string;
    password: string;
    access_token?: string;
    refresh_token?: string;
    session_id?: string;
    is_deleted?: boolean;
    last_login?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface UserInfo{
    id: BigInteger;
    user_id: string;
    name: string;
    age: number;
    gender: string;
    nationality: string;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

}