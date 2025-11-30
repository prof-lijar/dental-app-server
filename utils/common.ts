export function generateVerificationCode(): string{
    //generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return verificationCode;
}