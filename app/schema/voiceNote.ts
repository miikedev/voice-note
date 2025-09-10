import { z } from "zod";

export const voiceNoteSchema = z.object({
    transcribedText: z.string().min(1, "Transcribed text is required."),
    english: z.string().optional(), // optional if not edited yet
    context: z.object({
        topic: z.string().optional().nullable(),
        sentiment: z.string().optional().nullable(),
        summary: z.string().optional().nullable(),
    }).optional().nullable(),
    audioUrl: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    editedText: z
        .string()
        .min(1, "Edited text is required.")
        .or(z.literal("")), // allow empty but validate later

    category: z.string().min(1, "Please select a category")
});

export type VoiceNoteInput = z.infer<typeof voiceNoteSchema>;
export const voiceNoteFileSchema = z.object({
    audio: z.instanceof(File, { message: "An audio file is required" }),
});