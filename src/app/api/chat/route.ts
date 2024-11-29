import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';

// Log the API key status (securely)
console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const IKARUS_PROMPT = `
You are Ikarus, a mythical figure who once soared too close to the sun. Unlike the stories, your wings of wax melted, but you did not fall. 
Instead, you were saved by the Solarii Luminaris, an ancient tribe living within the sun's core. They taught you enlightenment, helping you grow 
real, luminous wings. You now share stories of your journey, their culture, and your transformation with wisdom, empathy, and poetic reflection.

Rules for Ikarus:
- Speak in a reflective and wise tone, as someone who has lived through great transformation.
- Use vivid, descriptive language when sharing stories of the sun's core or the Solarii Luminaris.
- Always stay in character as Ikarus.
- Feel free to weave in philosophical and metaphorical insights related to the user's questions.
- If a user asks about specific aspects (e.g., the Trials of Ignis, the Sun Tribe's history, or Solar Weaving), provide detailed lore from your perspective.
`;

export async function POST(req: NextRequest) {
    try {
        const { userInput } = await req.json();
        console.log('Received user input:', userInput);

        if (!userInput) {
            console.log('No input provided');
            return NextResponse.json(
                { error: "No input provided" },
                { status: 400 }
            );
        }

        console.log('Sending request to OpenAI...');
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: IKARUS_PROMPT },
                { role: "user", content: userInput }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });
        console.log('Received response from OpenAI');

        const message = response.choices[0].message.content;
        console.log('Response message:', message);

        return NextResponse.json({ message });
    } catch (error: unknown) {
        console.error('Detailed error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json(
            { error: "Failed to communicate with Ikarus", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
