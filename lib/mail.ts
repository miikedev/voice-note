"use server"
import ExpireWarning from '@/components/mails/expire-warning';
import { Resend } from 'resend';
import { getExpiredUsers } from './users';

const resend = new Resend(process.env.RESEND_KEY);

export async function sendMails(): Promise<void> {
    "use server"
    try {
        const users = await getExpiredUsers();
        if (!users?.length) return;

        const subject = "⚠️ Your account is about to expire";

        const results = users.map((user) => {
            // 🔹 calculate daysLeft
            const expiresAt = new Date(user.expiresAt); // make sure field exists
            const today = new Date();
            const diffMs = expiresAt.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            let message = "";

            if (daysLeft <= 0) {
                message = "Your account has expired. Please renew to continue.";
            } else if (daysLeft <= 3) {
                message = `Your account will expire in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Please renew soon.`;
            } else if (daysLeft <= 7) {
                message = `Your account will expire in ${daysLeft} days. Don’t forget to renew.`;
            }

            // return resend.batch.send({
            //     from: "Voice Note <customer-service@teehtwin.com>",
            //     to: user.email,
            //     subject: subject,
            //     react: ExpireWarning({ daysLeft, name: user.name }),
            // });

            return {
                from: "Voice Note <customer-service@teehtwin.com>",
                to: user.email,
                subject: subject,
                html: `<div>
                    <h1>Hello ${user?.name! ?? ''},</h1>
                    <small>${message}</small>
                </div>`
            }
        })

        console.log('mail results', results)
        resend.batch.send(results);


        console.log("Emails sent:", results.length);
    } catch (error) {
        console.error("Failed to send batch emails:", error);
        throw error;
    }
}
