
import { buildNextAuthOptions } from "@/lib/nextAuth/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(buildNextAuthOptions());

export { handler as GET, handler as POST };
