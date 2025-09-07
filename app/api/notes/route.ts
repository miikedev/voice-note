
import saveTranscription from '@/lib/db';
import { getNotesByEmail } from '@/lib/notes';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const category = searchParams.get('category')
    console.log('hit the route', email, category);
    const data = await getNotesByEmail(email!, category == null ? '<empty string>' : category)
    console.log('data', data)
    try {
        // Return a success response
        return NextResponse.json({ success: true, message: 'notes data retrieved.', data });
    } catch (error) {
        console.error("Failed to create invoice:", error);
        // Return an error response if something goes wrong
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    console.log('Received a POST request'); // Log when a request hits this endpoint
    try {
        const body = await request.json();
        console.log('body of note post', body); // Log the request body

        // Simulating some processing or saving action
        console.log('Processing data...');
        await saveTranscription({ data: body })
        return NextResponse.json({
            success: true,
            message: 'Note saved successfully.',
        });
    } catch (error) {
        console.error('Failed to save note:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
