import nodemailer from 'nodemailer';

// Email transporter configuration for Google SMTP
export const emailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // App Password from Google
  },
});

export const EMAIL_CONFIG = {
  defaultAppName: 'Dental App',
  from: (appName?: string) => `"${appName || 'Dental App'}" <${process.env.SMTP_USER}>`,
};

