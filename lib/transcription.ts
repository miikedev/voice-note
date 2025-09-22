import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { generateText } from 'ai';

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

export async function transcribeAudio(lang: string | null, fileUri: string, apiKey: string) {

    console.info('hit the transcribe audio func')
    const prompt = `
You are an AI audio processing service.
Your task is to transcribe the provided ${lang} audio and translate it to English. 

You MUST output one and only one JSON object. 
- No explanations
- No markdown code fences
- No comments
- No trailing commas
- No text before or after the JSON

The JSON object must strictly follow this schema:
{
  "transcribedText": "string (full transcription of the audio in ${lang})",
  "english": "string (full English translation of the transcription)"
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
    const google = createGoogleGenerativeAI({ apiKey })

    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        maxRetries: 15,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'file', mediaType: 'audio/mpeg', data: fileUri },
                ],
            },
        ],
    });

    const cleanedText = text.trim();

    console.log('cleaned text', cleanedText)
    const parsedData = safeJsonParse(cleanedText);
    try {
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
function sanitizeAIJson(jsonString: string) {
    // Use a regex to find a double quote that is NOT preceded by a backslash
    // and replace it with an escaped double quote.
    // The negative lookbehind `(?<!\\\\)` ensures we don't double-escape.
    return jsonString.replace(/(?<!\\\\)"/g, '\\"');
}

function repairJson(jsonStr: string) {
    return jsonStr
        .replace(/```json|```/g, '')                 // strip fences
        .replace(/,\s*([}\]])/g, '$1')               // remove trailing commas
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":'); // quote keys
}

function safeJsonParse(str: string) {
    try {
        return JSON.parse(str);
    } catch (err) {
        console.warn("Normal parse failed:", err);
        return JSON.parse(repairJson(str));
    }
}

