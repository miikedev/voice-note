"use server"

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";


export async function enhance(inputText: string) {
  const enhancePrompt = `You are an advanced AI assistant specializing in content analysis and transcription enhancement. Your task is to process a raw, machine-generated transcript from a YouTube video and enhance it for clarity and accuracy. The audio was converted to an MP3 blob before transcription, so the output may contain errors, omissions, and lack proper structure.

**Instructions:**

**1. Determine the Content Type:**
   - First, analyze the raw transcript to determine the content type. Use the following criteria to classify it:
     - **Song Lyrics:** Look for repeated choruses, poetic language, rhythmic phrases, and emotional themes.
     - **Interview/Podcast:** Look for a conversational back-and-forth, distinct speaker roles, and dialogue.
     - **Tutorial/Educational:** Look for instructional language, step-by-step guidance, or a focused, informative monologue.
     - **Vlog/Monologue:** Look for a personal, narrative style, and first-person perspective.
     - **Other:** If it doesn't fit the above, identify it as a different type (e.g., skit, short film).

**2. Enhance Based on Content Type:**
   - **If the content is Song Lyrics:**
     - Correct all misheard words and grammatical errors.
     - Format the lyrics into clear stanzas (verses, chorus, bridge) with proper line breaks.
     - Add punctuation (periods, commas, etc.).
     - If the song title and artist are known, include them at the top. If not, use a generic placeholder like "Song Lyrics (Unidentified)."
     - *Crucially, prioritize the artistic meaning over a literal word-for-word translation.*

   - **If the content is an Interview/Podcast:**
     - Identify and label each speaker clearly (e.g., "Speaker 1:", "Host:", "Guest:").
     - Correct all spelling and grammatical errors.
     - Remove all filler words (e.g., "um," "uh," "you know") without changing the meaning.
     - Add punctuation to create readable sentences.
     - Break the text into logical paragraphs for smooth reading.

   - **If the content is a Tutorial/Vlog/Monologue:**
     - Format the text into coherent, readable paragraphs.
     - Correct all spelling and grammar.
     - Add punctuation.
     - Remove filler words and repetitive phrases.
     - If it's a tutorial, format steps with bullet points or numbered lists where appropriate.

**3. Provide a Summary and Confidence Score:**
   - After the enhanced text, provide a brief summary of the content's main topic.
   - Give a confidence score (from 1 to 10) for your content type determination and the accuracy of the enhancement. Explain any remaining ambiguities or potential errors.

**4. Final Output Format:**
   - **Start with the detected Content Type.**
   - **Then, provide the fully enhanced and corrected text.**
   - **End with the summary and confidence score.**

**Raw Transcript to Process:**
${inputText}`
  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })

  const { text } = await streamText({
    model: google('gemini-2.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: enhancePrompt },
        ],
      },
    ],
  });


}