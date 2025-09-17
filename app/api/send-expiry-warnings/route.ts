import { NextRequest, NextResponse } from 'next/server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

import clientPromise from '@/lib/mongodb'; // your MongoDB client

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('voice-note');
        const usersCollection = db.collection('users');

        const now = new Date();
        const fiveDaysLater = new Date();
        fiveDaysLater.setDate(now.getDate() + 5);

        // Find users whose expiresAt is in the next 5 days
        const usersExpiring = await usersCollection
            .find({
                expiresAt: { $gte: now, $lte: fiveDaysLater }
            })
            .toArray();

        console.log('expiring users', usersExpiring)

        if (!usersExpiring.length) {
            return NextResponse.json({ error: 'No expiring users in next 5 days.' }, { status: 500 });
        }

        // Prepare batch messages
        const subject = "⚠️ Your account is about to expire";
        const html = `
      <h1>Account Expiry Warning</h1>
      <p>Your account will expire soon. Please renew to continue using our services.</p>
    `;

        const messages = usersExpiring.map(user => ({
            from: 'Voice Note App <maungdevv@gmail.com>',
            to: [user.email],
            subject,
            html,
        }));

        // Send batch emails
        const response = await resend.batch.send(messages);

        console.log('response', response);

        return NextResponse.json({ sent: messages.length, response });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Fail to send emails.' }, { status: 500 });

    }
}
