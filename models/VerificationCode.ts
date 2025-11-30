export interface VerificationCode{
    id?: number;
    email: string;
    code: string;
    type: string;
    is_used: boolean;
    created_at: Date;
    expires_at: Date;
}