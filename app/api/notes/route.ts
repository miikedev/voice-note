
import { getNotesByUserId } from '@/lib/notes';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    console.log('hit the route', user_id);
    const data = await getNotesByUserId(user_id!)
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
    try {
        const body = await request.json();

        // Validate required fields
        const { burmese, english, context, editedText, category } = body as TranscribedData;
        if (!burmese || !editedText || !category) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields.' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('voice-note'); // your DB name
        const notesCollection = db.collection('notes'); // your collection

        // Insert the note
        const result = await notesCollection.insertOne({
            burmese,
            english,
            context,
            editedText,
            category,
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: 'Note saved successfully.',
            id: result.insertedId,
        });
    } catch (error) {
        console.error('Failed to save note:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}