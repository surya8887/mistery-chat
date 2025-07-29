// File: app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./options"; // Ensure this file exports valid AuthOptions

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
