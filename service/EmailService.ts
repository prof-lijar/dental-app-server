import { emailTransporter, EMAIL_CONFIG } from '@/config/email';
import { emailTemplates } from '@/utils/email';

// Email Service
export const EmailService = {
  /**
   * Send verification code email for registration
   */
  async sendVerificationCode(
    to: string,
    code: string,
    appName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const template = emailTemplates.verificationCode(code, appName);

      const info = await emailTransporter.sendMail({
        from: EMAIL_CONFIG.from(appName),
        to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  },

  /**
   * Send password reset code email
   */
  async sendPasswordResetCode(
    to: string,
    code: string,
    appName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const template = emailTemplates.resetPassword(code, appName);

      const info = await emailTransporter.sendMail({
        from: EMAIL_CONFIG.from(appName),
        to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  },

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await emailTransporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  },
};

export default EmailService;
