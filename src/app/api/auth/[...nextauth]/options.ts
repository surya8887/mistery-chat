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

        if (!identifier || !password) {
          throw new Error("Email/Username and password are required.");
        }

        await DBConnect();

        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        }).select("+password");

        if (!user) {
          throw new Error("Invalid email/username or password.");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your account before logging in.");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email/username or password.");
        }

        // Return minimal user info for token
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day in seconds
    updateAge: 60 * 60,   // rotate token every hour
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
