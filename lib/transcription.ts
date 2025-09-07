import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function transcribeAudio(audioBase64: string) {
    const prompt = `
Transcribe the following Burmese audio. Return **strictly valid JSON** with the following keys:
- "burmese": full Burmese transcription
- "english": English translation
- "context": overall meaning or notes (optional)
Audio: (base64 of audio)
`;

    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'file', mediaType: 'audio/mpeg', data: audioBase64 },
                ],
            },
        ],
    });

    const cleanedText = text.replace(/```json\s*|\s*```/g, '');
    let parsedData;

    try {
        parsedData = JSON.parse(cleanedText);
        if (!parsedData.burmese || !parsedData.english) {
            throw new Error('Incomplete transcription response.');
        }
    } catch (err) {
        console.error('Failed to parse transcription response:', err);
        throw new Error('Invalid AI response format.');
    }

    return parsedData;
}