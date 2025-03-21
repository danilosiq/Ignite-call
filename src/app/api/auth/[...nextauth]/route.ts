import { PrismaAdapter } from "@/lib/nextAuth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";

const handler = NextAuth({
  adapter: PrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (
        !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
      ) {
        return "/register/connect-calendar/?error=permissions";
      }
      return true;
    },
    async session({ session, user }) {
      return {
        ...session,
        user,
      };
    },
  },
});

export const GET = (req: NextRequest) => handler(req);
export const POST = (req: NextRequest) => handler(req);