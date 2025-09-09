// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '../../../../lib/mongodb';

const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: {
                timeout: 15000,
            },
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email) {
                console.error('❌ No email found in profile');
                return false; // deny login if no email
            }

            try {
                const client = await clientPromise;
                const db = client.db('voice-note');

                // Try to update the user
                const result = await db.collection('users').updateOne(
                    { email: profile.email },
                    {
                        $set: {
                            name: profile.name,
                            email: profile.email,
                        },
                    }
                    // ❌ no upsert
                );

                if (result.matchedCount > 0) {
                    console.log('✅ Existing user logged in and updated');
                    return true; // allow login
                } else {
                    console.log('⛔ User not found, denying login');
                    return false; // deny if not in system
                }
            } catch (err) {
                console.error('❌ MongoDB error during signIn:', err);
                return false;
            }
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };