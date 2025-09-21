import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    const db = clientPromise.db("voice-note");
    const collection = db.collection("users");

    const now = new Date();
    const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    // Find users whose expiresAt is within the next 5 days
    const users = await collection.find({
        expiresAt: { $lte: fiveDaysLater, $gt: now },
    }).toArray();

    if (!users.length) {
        return NextResponse.json({ message: "No users to notify" });
    }

    // Configure mailer
    // const transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     },
    // });

    // for (const user of users) {
    //     await transporter.sendMail({
    //         from: process.env.EMAIL_USER,
    //         to: user.email,
    //         subject: "Your account will expire soon",
    //         text: `Hi ${user.email}, your account will expire on ${user.expiresAt}. Please renew before it expires.`,
    //     });
    // }

    return NextResponse.json({ message: `Notified ${users.length} users` });
}