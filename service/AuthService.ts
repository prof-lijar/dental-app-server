import {UserRepository} from "@/repository/UserRepository";
import { generateAccessToken, generatePasswordHash, generateRefreshToken, generateSessionId, generateVerificationCode, isPasswordStrong, verifyPassword } from "@/utils/common";
import { EmailService } from "@/service/EmailService";
import { VerificationRepository } from "@/repository/VerificationRepository";
import { UserRole, VerificationCodeType } from "@/dto/Enum";
import { LoggedInUser } from "@/dto/User";

export class AuthService{
    private static userRepository = new UserRepository();
    private static verificationRepository = new VerificationRepository();

    static async sendVerificationEmail(email: string): Promise<{ success: boolean; message: string }>{

        //check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (user) {
            return { success: false, message: "User already exists" };
        }

        //generate verification code
        const verificationCode = generateVerificationCode();

        //send verification code to email
        const result = await EmailService.sendVerificationCode(email, verificationCode);
        if (!result.success) {
            return { success: false, message: "Failed to send verification code" };
        }

        //save verification code
        await this.saveVerificationCode(email, verificationCode, "REGISTER");

        return { success: true, message: "Verification code sent" };
    }

    static async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }>{
        
        //check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return { success: false, message: "User not found" };
        }
        //generate password reset code
        const verificationCode = generateVerificationCode();
        //send password reset code to email
        const result = await EmailService.sendPasswordResetCode(email, verificationCode);
        if (!result.success) {
            return { success: false, message: "Failed to send password reset code" };
        }

        //save verification code
        await this.saveVerificationCode(email, verificationCode, "RESET_PWD");

        return { success: true, message: "Password reset code sent" };
    }

    static async verifyVerificationCode(email: string, code: string, type: VerificationCodeType): Promise<{ success: boolean; message: string }>{
        //check if verification code exists
        const verificationCode = await this.verificationRepository.findByEmailAndCode(email, code);
        if (!verificationCode) {
            return { success: false, message: "Verification code not found" };
        }
        //check if verification code is expired
        if (verificationCode.expires_at < new Date()) {
        return { success: false, message: "Verification code expired" };
        }

        if (type === "REGISTER"){
            //check if verification code is used
            if (verificationCode.is_used) {
                return { success: false, message: "Verification code already used" };
            }
            
        }

        if (type === "REGISTER"){
            //delete verification code
            await this.verificationRepository.delete(verificationCode.id!);

        }else{
            //update verification code to used
            await this.verificationRepository.update(verificationCode.id!, { is_used: true });

        }
        
        
        return { success: true, message: "Verification code verified" };
    }

    private static async saveVerificationCode(email: string, code: string, type: VerificationCodeType): Promise<void>{
        //expires in 5 minutes
        await this.verificationRepository.create({
            email: email,
            code: code,
            type: type,
            is_used: false,
            created_at: new Date(),
            expires_at: new Date(Date.now() + 1000 * 60 * 5),
        });
        
    }

    static async login(email: string, password: string): Promise<{ success: boolean; message: string; user: LoggedInUser | null }>{
        //check if user exists
        let user = await this.userRepository.findByEmail(email);
        
        //also look for username
        if (!user) {
            user = await this.userRepository.findByUsername(email);
        }
        if (!user) {
            return { success: false, message: "User not found", user: null };
        }
        //check if password is correct
        if (!verifyPassword(password, user.password)) {
            return { success: false, message: "Invalid password", user: null };
        }
        //generate access token and refresh token
        const accessToken = generateAccessToken(user.id!, user.email || "", user.username, user.role || "");
        const refreshToken = generateRefreshToken(user.id!, user.email || "", user.username, user.role || "");
        const sessionId = generateSessionId();

        //update user with access token and refresh token
        await this.userRepository.update(user.id!, { 
            access_token: accessToken,
            refresh_token: refreshToken,
            session_id: sessionId,
            last_login: new Date() });

        return { success: true, message: "Login successful", user: {
            userId: user.id!,
            email: user.email || "",
            username: user.username,
            accessToken: accessToken,
            sessionId: sessionId,
            refreshToken: refreshToken,
            role: user.role as UserRole,
        } };
    }

    //TODO: implement logout with access token not userId
    static async logout(userId: string): Promise<{ success: boolean; message: string }>{
        //update user with access token and refresh token
        await this.userRepository.update(userId, { access_token: undefined, refresh_token: undefined, session_id: undefined });
        return { success: true, message: "Logout successful" };
    }

    //TODO: implement refresh token with access token not userId

    //reset password with email
    static async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }>{
        //check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return { success: false, message: "User not found" };
        }
        

        //TODO: check if email is verified

        if (!isPasswordStrong(newPassword)) {
            return { success: false, message: "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character" };
        }

        //hash new password
        const hashedPassword = generatePasswordHash(newPassword);
        //update user with new password
        await this.userRepository.update(user.id!, { password: hashedPassword });
        return { success: true, message: "Password reset successful" };

    }

}