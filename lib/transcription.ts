import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function transcribeAudio(audioBase64: string, lang: string | null, duration: string | null) {
    const prompt = `
You are an AI audio processing service. Your task is to transcribe the provided ${lang} audio, translate it to English, and provide a contextual analysis.

You MUST respond ONLY with a single, strictly valid JSON object. Do not include any explanatory text before or after the JSON.

The JSON object must conform to the following schema:
{
  "transcribedText": "The full transcription of the audio in ${lang}.",
  "english": "The full English translation of the transcription.",
  "context": {
    "topic": "A brief 2-5 word description of the main subject.",
    "sentiment": "A single word describing the overall tone (e.g., 'Neutral', 'Positive', 'Urgent', 'Frustrated').",
    "summary": "A 1-2 sentence summary of the key points."
  }
}

Audio Details:
- Language: ${lang}
- Duration: ${duration} min
- Audio Data: (base64 of audio)
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