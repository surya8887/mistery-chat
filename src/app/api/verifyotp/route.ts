import { DBConnect } from "@/lib/db";
import User from "@/model/user.model";

export async function GET(request: Request) {
    await DBConnect();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const otp = searchParams.get("otp");

    if (!username || !otp) {
        return new Response("Missing email or OTP", { status: 400 });
    }

    const user = await User.findOne({username, isVerified: false });
    if (!user) return new Response("User not found or already verified", { status: 404 });

    if (user.verifyCodeExpiry < Date.now()) return new Response("OTP expired", { status: 400 });
    if (user.verifyCode !== otp) return new Response("Invalid OTP", { status: 400 });

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;
    await user.save();

    return new Response("Email verified successfully", { status: 200 });
}
