import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

export interface TokenPayload {
    userId: string;
    email: string;
    userName: string;
}

export function generateVerificationCode(): string {
    //generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return verificationCode;
}

export function generateAccessToken(userId: string, email: string, userName: string): string {
    const payload: TokenPayload = { userId, email, userName };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function generateRefreshToken(userId: string, email: string, userName: string): string {
    const payload: TokenPayload = { userId, email, userName };
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}


export function generateSessionId(): string {
    // Generate session id (32 hex characters)
    return crypto.randomBytes(16).toString('hex');
}

export function generatePasswordHash(password: string): string {
    // Generate password hash using bcrypt (60 characters)
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

export function verifyPassword(password: string, hashPassword: string): boolean {
    // Verify password against hash
    return bcrypt.compareSync(password, hashPassword);
}