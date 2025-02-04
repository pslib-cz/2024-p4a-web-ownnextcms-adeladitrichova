// src/libs/auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import prisma from "./prisma"

if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET is not defined');
}

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
    throw new Error('GitHub auth credentials are not defined');
}

export const {
    handlers,
    signIn,
    signOut,
    auth
} = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;

            try {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                        name: user.name,
                        image: user.image,
                    },
                    create: {
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    },
                });
                return true;
            } catch (error) {
                console.error("Error during sign in:", error);
                return false;
            }
        },
        async session({ session, token }) {
            if (session?.user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });
                if (dbUser) {
                    session.user.id = dbUser.id;
                }
            }
            return session;
        },
    },
});