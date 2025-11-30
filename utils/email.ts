// Email Templates

export const emailTemplates = {
  verificationCode: (code: string, appName: string = 'Dental App') => ({
    subject: `${appName} - Verify Your Email`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                      ${appName}
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: 600; text-align: center;">
                      Verify Your Email Address
                    </h2>
                    <p style="margin: 0 0 30px; color: #64748b; font-size: 16px; line-height: 1.6; text-align: center;">
                      Thank you for registering! Please use the verification code below to complete your registration.
                    </p>
                    
                    <!-- Verification Code Box -->
                    <div style="text-align: center; margin: 30px 0;">
                      <div style="display: inline-block; padding: 20px 40px; background-color: #f1f5f9; border-radius: 8px; border: 2px dashed #0ea5e9;">
                        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0284c7;">
                          ${code}
                        </span>
                      </div>
                    </div>
                    
                    <p style="margin: 30px 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                      If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                      © ${new Date().getFullYear()} ${appName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
${appName} - Email Verification

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} ${appName}. All rights reserved.
    `,
  }),

  resetPassword: (code: string, appName: string = 'Dental App') => ({
    subject: `${appName} - Reset Your Password`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                      ${appName}
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: 600; text-align: center;">
                      Reset Your Password
                    </h2>
                    <p style="margin: 0 0 30px; color: #64748b; font-size: 16px; line-height: 1.6; text-align: center;">
                      We received a request to reset your password. Use the code below to proceed with resetting your password.
                    </p>
                    
                    <!-- Reset Code Box -->
                    <div style="text-align: center; margin: 30px 0;">
                      <div style="display: inline-block; padding: 20px 40px; background-color: #fff7ed; border-radius: 8px; border: 2px dashed #f97316;">
                        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ea580c;">
                          ${code}
                        </span>
                      </div>
                    </div>
                    
                    <p style="margin: 30px 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                    </p>
                    
                    <!-- Security Notice -->
                    <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                      <p style="margin: 0; color: #92400e; font-size: 14px;">
                        <strong>Security Tip:</strong> Never share this code with anyone. Our team will never ask you for this code.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                      © ${new Date().getFullYear()} ${appName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
${appName} - Password Reset

Your password reset code is: ${code}

This code will expire in 10 minutes.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

Security Tip: Never share this code with anyone. Our team will never ask you for this code.

© ${new Date().getFullYear()} ${appName}. All rights reserved.
    `,
  }),
};

