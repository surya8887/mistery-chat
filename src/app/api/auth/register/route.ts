import { DBConnect } from "@/lib/db";
import User from "@/model/user.model";
import response from "@/utils/ApiResponse";
import { sendOtpEmail } from "@/utils/resend";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await DBConnect();

  try {
    const { email, username, password } = await request.json();

    // Check if a verified user exists with the same username
    const existingUsername = await User.findOne({ username, isVerified: true });
    if (existingUsername) {
      return response(false, "Username already taken");
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return response(false, "Email is already verified");
      }

      // Optional: prevent spamming if OTP is already active
      if (existingUserByEmail.verifyCodeExpiry > new Date()) {
        return response(false, "OTP already sent. Please wait before requesting again.");
      }

      // Update unverified user
      existingUserByEmail.username = username;
      existingUserByEmail.password = password;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
      await existingUserByEmail.save();
    } else {
      // Create new unverified user
      await User.create({
        email,
        username,
        password,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry,
        isAcceptingMessage: true,
        messages: [],
      });
    }

    // Send OTP email
    await sendOtpEmail(email, username, verifyCode);

    return response(true, "OTP sent to your email");
  } catch (error) {
    console.error("Registration failed:", error);
    return response(false, "Registration failed", null, 500);
  }
}
