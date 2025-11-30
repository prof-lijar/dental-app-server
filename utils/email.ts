// Email Templates

export const emailTemplates = {
  verificationCode: (code: string, appName: string = 'Daily Dental') => ({
    subject: `${appName} - 이메일 인증`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>이메일 인증</title>
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
                      이메일 주소 인증
                    </h2>
                    <p style="margin: 0 0 30px; color: #64748b; font-size: 16px; line-height: 1.6; text-align: center;">
                      회원가입해 주셔서 감사합니다! 아래 인증 코드를 입력하여 가입을 완료해 주세요.
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
                      이 코드는 <strong>10분</strong> 후에 만료됩니다.
                    </p>
                    <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                      본인이 요청하지 않은 경우, 이 이메일을 무시해 주세요.
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
${appName} - 이메일 인증

인증 코드: ${code}

이 코드는 10분 후에 만료됩니다.

본인이 요청하지 않은 경우, 이 이메일을 무시해 주세요.

© ${new Date().getFullYear()} ${appName}. All rights reserved.
    `,
  }),

  resetPassword: (code: string, appName: string = 'Daily Dental') => ({
    subject: `${appName} - 비밀번호 재설정`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>비밀번호 재설정</title>
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
                      비밀번호 재설정
                    </h2>
                    <p style="margin: 0 0 30px; color: #64748b; font-size: 16px; line-height: 1.6; text-align: center;">
                      비밀번호 재설정 요청을 받았습니다. 아래 코드를 입력하여 비밀번호를 재설정해 주세요.
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
                      이 코드는 <strong>10분</strong> 후에 만료됩니다.
                    </p>
                    <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                      본인이 비밀번호 재설정을 요청하지 않은 경우, 이 이메일을 무시하시거나 문의 사항이 있으시면 고객센터로 연락해 주세요.
                    </p>
                    
                    <!-- Security Notice -->
                    <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                      <p style="margin: 0; color: #92400e; font-size: 14px;">
                        <strong>보안 안내:</strong> 이 코드를 다른 사람과 공유하지 마세요. 저희 팀은 절대로 이 코드를 요청하지 않습니다.
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
${appName} - 비밀번호 재설정

비밀번호 재설정 코드: ${code}

이 코드는 10분 후에 만료됩니다.

본인이 비밀번호 재설정을 요청하지 않은 경우, 이 이메일을 무시하시거나 문의 사항이 있으시면 고객센터로 연락해 주세요.

보안 안내: 이 코드를 다른 사람과 공유하지 마세요. 저희 팀은 절대로 이 코드를 요청하지 않습니다.

© ${new Date().getFullYear()} ${appName}. All rights reserved.
    `,
  }),
};
