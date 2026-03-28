import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone + OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text", placeholder: "+260971234567" },
        otp: { label: "OTP", type: "text", placeholder: "1234" },
      },
      async authorize(credentials) {
        // Demo mode: accept OTP "1234" for any seeded user
        if (credentials?.otp !== "1234") return null;

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
