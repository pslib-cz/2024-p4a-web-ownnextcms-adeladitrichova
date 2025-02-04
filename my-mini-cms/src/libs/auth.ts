// src/libs/auth.ts
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import { getServerSession } from "next-auth/next"
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID || "",
            clientSecret: process.env.AUTH_GITHUB_SECRET || "",
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            try {
                // Create or update user in database
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
            if (session.user?.email) {
                const user = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });

                if (user) {
                    session.user.id = user.id;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },
};

export const getAuthSession = () => getServerSession(authOptions);