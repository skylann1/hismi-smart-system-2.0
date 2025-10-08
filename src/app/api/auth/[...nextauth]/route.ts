import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { login } from "@/lib/firebase/services";
import { compare } from "bcryptjs";

declare module "next-auth" {
    interface User {
        id: string | number;
        name: string;
        email: string;
        access?: string[];
    }
}

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET_TOKEN,
    providers: [
        CredentialsProvider({
            type: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string; password: string };

                const user = await login({ email });
                if (user.success && user.data && 'password' in user.data) {
                    const replacePassword = password.replace(/-/g, "");
                    const userData = user.data as { id: string; name: string; email: string; access?: string[]; password: string };
                    const confirmPassword = await compare(replacePassword, userData.password);

                    if (confirmPassword) {
                        return {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            access: userData.access,
                        }
                    }

                    throw new Error("Password salah.");
                } else {
                    throw new Error("Email tidak terdaftar pada sistem.");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account?.provider === "credentials") {
                token.email = user?.email;
                token.name = user?.name;
                token.id = user?.id;
                token.access = user?.access;
            }
            return token;
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: any) {
            if ('email' in token) {
                session.user.email = token.email;
            }
            if ('name' in token) {
                session.user.name = token.name;
            }
            if ('id' in token) {
                session.user.id = token.id;
            }
            if ('access' in token) {
                session.user.access = token.access;
            }
            return session
        }
    },
    pages: {
        signIn: '/member/login',
    }
}

const handler = NextAuth(authOptions);

export {
    handler as GET,
    handler as POST,
}