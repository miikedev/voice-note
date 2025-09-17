import type { NextApiRequest, NextApiResponse } from 'next';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

import clientPromise from '@/lib/mongodb'; // your MongoDB client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

        if (!usersExpiring.length) {
            return res.status(200).json({ message: 'No expiring users in next 5 days.' });
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

        res.status(200).json({ sent: messages.length, response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send emails.' });
    }
}
