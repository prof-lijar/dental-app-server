import {UserRepository} from "@/repository/UserRepository";
import { generateVerificationCode } from "@/utils/common";
import { EmailService } from "@/service/EmailService";

export class AuthService{
    private static repository = new UserRepository();

    static async sendVerificationEmail(email: string): Promise<void>{
        //generate verification code
        const verificationCode = generateVerificationCode();

        //send verification code to email
        const result = await EmailService.sendVerificationCode(email, verificationCode);
        if (!result.success) {
            throw new Error("Failed to send verification code");
        }

    }

    
}