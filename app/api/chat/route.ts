import { google } from '@ai-sdk/google';
import {
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    streamText,
    tool,
} from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    const { messages } = await req.json();
    try {
        const stream = createUIMessageStream({
            execute: async ({ writer }) => {
                // step 1 example: forced tool call
                const result1 = streamText({
                    model: google('gemini-2.5-flash'),
                    system: 'Extract the user goal from the conversation.',
                    messages,
                    toolChoice: 'required', // force the model to call a tool
                    tools: {
                        extractGoal: tool({
                            inputSchema: z.object({ goal: z.string() }),
                            execute: async ({ goal }) => goal, // no-op extract tool
                        }),
                    },
                });

                // forward the initial result to the client without the finish event:
                writer.merge(result1.toUIMessageStream({ sendFinish: false }));

                // note: you can use any programming construct here, e.g. if-else, loops, etc.
                // example: continue stream with forced tool call from previous step
                const result2 = streamText({
                    // different system prompt, different model, no tools:
                    model: google('gemini-2.5-flash'),
                    system:
                        'You are a helpful assistant with a different system prompt. Repeat the extract user goal in your answer.',
                    // continue the workflow stream with the messages from the previous step:
                    messages: [
                        ...convertToModelMessages(messages),
                        ...(await result1.response).messages,
                    ],
                });

                // forward the 2nd result to the client (incl. the finish event):
                writer.merge(result2.toUIMessageStream({ sendStart: false }));
            },
        });

        return createUIMessageStreamResponse({ stream });
    } catch (error) {
        throw new Error(error);
    }

}