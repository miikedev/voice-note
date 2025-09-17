import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export async function sendMail(users: { email: string }[]) {
    if (!users.length) return;

    // Common email content
    const subject = "⚠️ Your account is about to expire";
    const html = `
    <h1>Account Expiry Warning</h1>
    <p>Your account will expire soon. Please renew to continue using our services.</p>
  `;

    // Map each user into a message object
    const messages = users.map(user => ({
        from: 'VoiceNote <mokite134@gmail.com>',
        to: [user.email],
        subject,
        html,
    }));

    try {
        const response = await resend.batch.send(messages);
        console.log("Batch email response:", response);
        return response;
    } catch (error) {
        console.error("Failed to send batch emails:", error);
        throw error;
    }
}