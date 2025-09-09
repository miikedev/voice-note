// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Profile } from 'next-auth';
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
                timeout: 15000, // 15 seconds timeout
            },
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email) {
                console.error("❌ No email found in profile");
                return false; // Deny sign-in
            }
            console.log('profile', profile);
            try {
                const client = await clientPromise;
                const db = client.db("voice-note");

                // Update the user only if the email exists, do nothing if not found
                const result = await db.collection<Profile>("users").updateOne(
                    { email: profile.email },
                    {
                        $set: {
                            name: profile.name,
                            email: profile.email,
                        },
                    }
                    // No upsert option, so it won't insert a new document if not found
                );

                // Check if a document was modified
                if (result.modifiedCount > 0) {
                    console.log("✅ User updated successfully");
                } else {
                    console.log("🔍 No user found with that email, no update performed");
                    return false;
                }

                return true; // ✅ Allow sign-in
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
