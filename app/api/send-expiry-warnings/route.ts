import { NextRequest, NextResponse } from 'next/server';

import { sendMails } from '@/lib/mail';

export async function GET(req: NextRequest, res: NextResponse) {
    console.log('hit send expiry warning');

    try {
        await sendMails();

        return NextResponse.json({ success: true, msg: 'expired mails successfully send out' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Fail to send emails.' }, { status: 500 });

    }
}
