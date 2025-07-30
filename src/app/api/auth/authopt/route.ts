import { DBConnect } from "@/lib/db";
import User from "@/model/user.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await DBConnect();
    const { email, password } = await request.json();
    const user = await User.findOne({ email, isVerified : false });
    if (!user) {
        return new Response("User not found", { status: 404 });
    }

   const verify =  user.verifyCodeExpiry > Date.now() ? user.verifyCode : null;

}