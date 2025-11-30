import {UserRepository} from "@/repository/UserRepository";
import { generateVerificationCode } from "@/utils/common";
import { EmailService } from "@/service/EmailService";

export class AuthService{
    private static userRepository = new UserRepository();

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
        return { success: true, message: "Password reset code sent" };
    }

    
}