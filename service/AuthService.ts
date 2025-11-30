import {UserRepository} from "@/repository/UserRepository";
import { generateVerificationCode } from "@/utils/common";
import { EmailService } from "@/service/EmailService";
import { VerificationRepository } from "@/repository/VerificationRepository";
import { VerificationCodeType } from "@/dto/Enum";

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

}