
import saveTranscription from '@/lib/db';
import { getNotesByEmail } from '@/lib/notes';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);

        // 1. Extract and validate required parameters
        const email = searchParams.get('email');
        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Bad Request: Email is a required parameter.' },
                { status: 400 }
            );
        }

        // 2. Extract optional parameters and provide sensible defaults
        const category = searchParams.get('category'); // Can be string or null
        const order = searchParams.get('order');
        const sortBy = 'createdAt'; // This seems to be a fixed value

        // 3. Prepare parameters for the data fetching function
        //    Type assertion for 'order' after validation/defaulting
        const validatedOrder = (order === 'asc' || order === 'desc') ? order : 'asc';

        const notes = await getNotesByEmail({
            email: email,
            sortBy: sortBy,
            order: validatedOrder,
            category: category, // Pass null directly if no category is specified
        });

        // 4. Return a successful response
        return NextResponse.json({
            success: true,
            message: 'Notes data retrieved successfully.',
            data: notes
        });

    } catch (error) {
        // 5. Centralized error handling for the entire process
        console.error("Failed to retrieve notes:", error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    console.log('Received a POST request'); // Log when a request hits this endpoint
    try {
        const body = await request.json();
        console.log('body of note post', body); // Log the request body

        // Simulating some processing or saving action
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
