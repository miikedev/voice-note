import { createApiKey } from "@/lib/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    console.log(key)
    try {
        const testRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${key}`,
        );
        if (testRes.ok) {
            return NextResponse.json(
                { message: "API key is valid and has access to gemini-2.5-flash." },
                { status: 200 }
            );
        } else {
            const error = await testRes.json();
            return NextResponse.json(
                { message: "Invalid API key or no access to the model.", error: error.error.message },
                { status: testRes.status }
            );
        }
    } catch (e) {
        console.error("Error testing API key:", e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const email = searchParams.get('email')
    try {
        await createApiKey(email!, key)
        return NextResponse.json({ message: "Api Key has been saved" }, { status: 201 })
    } catch (e) {
        console.error("Error testing API key:", e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}