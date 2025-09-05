// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '../../../../lib/mongodb';

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: {
                timeout: 15000, // 10s instead of 3.5s
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                console.error("❌ No email found in profile");
                return false; // deny sign-in
            }
            console.log('profile', profile)
            try {
                const client = await clientPromise;
                const db = client.db("voice-note");

                await db.collection("users").updateOne(
                    { email: profile.email },
                    {
                        $set: {
                            name: profile.name,
                            email: profile.email,
                        },
                    },
                    { upsert: true }
                );

                return true; // ✅ allow sign-in
            } catch (err) {
                console.error("❌ MongoDB error during signIn:", err);
                // Return false = user is not signed in, but no hard crash
                return false;
                // OR: throw new Error("Database connection failed"); // if you want to show error page
            }
        },
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };