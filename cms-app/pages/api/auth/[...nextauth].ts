import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../lib/prisma";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                });

                if (user && credentials?.password && user.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (isValid) {
                        return user;
                    }
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'database',
    },
    callbacks: {
        session: async ({ session, user }) => {
            if (session.user) {
                session.user.name = user.id;
            }
            return session;
        },
    },
});
