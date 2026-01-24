import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserRepository } from '@/repository/UserRepository';
import { AuthUser } from '@/dto/User';
import { UserRole } from '@/dto/Enum';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

export interface TokenPayload {
    userId: string;
    email: string;
    userName: string;
    role: string;
}

export function generateVerificationCode(): string {
    //generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return verificationCode;
}

export function generateAccessToken(userId: string, email: string, userName: string, role: string): string {
    const payload: TokenPayload = { userId, email, userName, role };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function generateRefreshToken(userId: string, email: string, userName: string, role: string): string {
    const payload: TokenPayload = { userId, email, userName, role };
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

export async function validateJWTToken(accessToken: string): Promise<AuthUser | null> {
    // Verify the JWT token
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
        return null;
    }

    // Get user from database to retrieve sessionId and validate token
    const userRepository = new UserRepository();
    const user = await userRepository.findById(payload.userId);
    
    if (!user) {
        return null;
    }

    // Validate that the access token matches what's stored in the database
    if (user.access_token !== accessToken) {
        return null;
    }

    // Check if user is deleted
    if (user.is_deleted) {
        return null;
    }

    // Return AuthUser if all validations pass
    return {
        userId: payload.userId,
        email: payload.email,
        userName: payload.userName,
        role: payload.role as UserRole,
        sessionId: user.session_id || '',
    };
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

export function isPasswordStrong(password: string): boolean {
    //check if password is strong (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}