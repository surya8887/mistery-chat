import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { DBConnect } from "@/lib/db";
import User from "@/model/user.model";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const identifier = credentials?.email as string;
        const password = credentials?.password as string;

        // console.log( identifier, password );
        
        if (!identifier || !password) {
          throw new Error("Email/Username and password are required.");
        }

        await DBConnect();

        try {
          const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          }).select("+password");

          if (!user) {
            throw new Error("Invalid email/username or password.");
          }

          // Optional: Require email verification
          // if (!user.isVerified) {
          //   throw new Error("Please verify your account before logging in.");
          // }

          const isPasswordValid = await compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid email/username or password.");
          }

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error: any) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
