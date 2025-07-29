import nodemailer from 'nodemailer';
import { ApiResponse } from './ApiResponse';

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST, 
  port: Number(process.env.NODEMAILER_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export async function sendOtpEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
   const htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 8px; background-color: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #333333;">Hello <span style="color: #1d4ed8;">${username}</span>,</h2>
    
    <p style="color: #444444; font-size: 16px; line-height: 1.5;">
      Thank you for registering with us. Please use the following One-Time Password (OTP) to verify your email address:
    </p>
    
    <div style="margin: 30px 0; text-align: center;">
      <span style="font-size: 36px; color: #1d4ed8; letter-spacing: 8px; font-weight: bold;">
        ${verifyCode}
      </span>
    </div>

    <p style="color: #555555; font-size: 14px; line-height: 1.6;">
      This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone for security reasons.
    </p>

    <p style="color: #999999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
      If you did not request this verification, you can safely ignore this email. No action will be taken without verification.
    </p>

    <p style="color: #bbbbbb; font-size: 11px; text-align: center; margin-top: 40px;">
      &copy; ${new Date().getFullYear()} Acme Inc. All rights reserved.
    </p>
  </div>
`;


    await transporter.sendMail({
      from: `"Vijay Kumar" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: 'Your Verification Code',
      html: htmlContent,
    });
    return {
      success: true,
      message: 'OTP sent via email successfully',
    };
  } catch (error: any) {
    console.error('Nodemailer error:', error.message || error);
    return {
      success: false,
      message: 'Failed to send OTP email',
    };
  }
}
