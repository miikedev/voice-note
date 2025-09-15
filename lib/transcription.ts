import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * A browser-compatible function to convert an ArrayBuffer to a base64 string.
 * @param buffer The ArrayBuffer to convert.
 * @returns The base64 encoded string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // btoa() is a built-in browser function to create a base-64 encoded ASCII string.
    return window.btoa(binary);
}

/**
 * Fetches an MP3 from a URL and returns it as a base64 encoded string.
 * This version is compatible with web browsers.
 * @param audioUrl The URL of the audio file.
 * @returns A Promise that resolves to the base64 string or null on error.
 */
export async function getMp3AsBase64(audioUrl: string): Promise<string | null> {
    console.log("Fetching audio from URL:", audioUrl);

    try {
        const response = await fetch(audioUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const blob = await response.blob();

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob); // Directly converts to Base64 Data URL
        });
    } catch (error) {
        console.error("Error fetching or converting audio:", error);
        return null;
    }
}

export async function transcribeAudio(lang: string | null, fileUri: string) {

    console.info('hit the transcribe audio func')
    const prompt = `
You are an AI audio processing service. Your task is to transcribe the provided ${lang} audio, translate it to English, and provide a contextual analysis.

You MUST respond ONLY with a single, strictly valid JSON object. Do not include any explanatory text before or after the JSON.

The JSON object must conform to the following schema:
{
  "transcribedText": "The full transcription of the audio in ${lang}.",
  "english": "The full English translation of the transcription.",
}
Audio Details:
- Language: ${lang}
- Audio Data: (base64 of audio)
`;

    // "context": {
    //     "topic": "A brief 2-5 word description of the main subject.",
    //         "sentiment": "A single word describing the overall tone (e.g., 'Neutral', 'Positive', 'Urgent', 'Frustrated').",
    //             "summary": "A 1-2 sentence summary of the key points."
    // }
    const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })

    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'file', mediaType: 'audio/ogg', data: fileUri },
                ],
            },
        ],
    });

    const cleanedText = text.replace(/```json\s*|\s*```/g, '');

    console.log('cleaned text', cleanedText)
    let parsedData;
    try {
        parsedData = JSON.parse(cleanedText);

        console.log('parsed data in transcription', parsedData)
        if (!parsedData.transcribedText || !parsedData.english) {
            throw new Error('Incomplete transcription response.');
        }
    } catch (err) {
        console.error('Failed to parse transcription response:', err);
        throw new Error('Invalid AI response format.');
    }

    console.log('parsed data', parsedData)
    return parsedData;
}