import clientPromise from '@/lib/mongodb';
import { google } from '@ai-sdk/google';
import { put, PutBlobResult } from '@vercel/blob';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    if (!audioFile) return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 });

    try {
        const audioBytes = await audioFile.arrayBuffer();
        const audioBuffer = Buffer.from(audioBytes);
        const audioBase64 = audioBuffer.toString('base64');
        const filename = `capture-${Date.now()}.ogg`;

        const blob: PutBlobResult = await put(`voices/${filename}`, audioFile, {
            access: 'public',
            addRandomSuffix: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
            contentType: "audio/ogg"
        });

        const prompt = `
Transcribe the following Burmese audio. Return **strictly valid JSON** with the following keys:
- "burmese": full Burmese transcription
- "english": English translation
- "context": overall meaning or notes (optional)
Audio: (base64 of audio)
`;

        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    burmese: { type: "string", description: "Full Burmese transcription" },
                    romanization: { type: "string", description: "Romanized Burmese text" },
                    english: { type: "string", description: "English translation" },
                    wordMeanings: {
                        type: "array",
                        description: "Word-by-word explanations",
                        items: {
                            type: "object",
                            properties: {
                                word: { type: "string" },
                                romanization: { type: "string" },
                                meaning: { type: "string" }
                            },
                            required: ["word", "romanization", "meaning"]
                        }
                    },
                    context: { type: "string", description: "Overall meaning or notes" }
                },
                required: ["burmese", "english"]
            }
        };


        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            messages: [
                {
                    role: 'user', content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        { type: 'file', mediaType: 'audio/mpeg', data: audioBase64 },
                    ]
                },
            ],
        });

        console.log('Raw AI response:', text);

        // Clean the response if needed
        const cleanedText = text.replace(/```json\s*|\s*```/g, '');

        // Parsing the cleaned text
        let parsedData;
        try {
            parsedData = JSON.parse(cleanedText);

            // Optionally validate the parsed data structure
            if (!parsedData.burmese || !parsedData.english) {
                console.error('Missing required fields in parsed data:', parsedData);
                return NextResponse.json({ error: 'Incomplete AI response.' }, { status: 500 });
            }
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            console.error('Raw response:', text); // Log the raw response for further inspection
            return NextResponse.json({ error: 'Invalid AI response format.', details: text }, { status: 500 });
        }



        const client = await clientPromise;
        const db = client.db('voice-note');

        const result = await db.collection('audio_texts').insertOne({
            audioUrl: blob.url,
            ...parsedData,
            email: formData.get('email'),
            createdAt: new Date(),
        });

        return NextResponse.json({ result: parsedData });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to transcribe or store audio.' }, { status: 500 });
    }
}