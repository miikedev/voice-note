import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GENAI_API_KEY
});

const result = await generateText({
    model: google('gemini-2.5-flash'),
    messages: [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: 'transcribe this video',
                },
                {
                    type: 'file',
                    data: 'https://www.youtube.com/watch?v=aGd_MowcQ_8',
                    mediaType: 'video/mp4',
                },
            ],
        },
    ],
});