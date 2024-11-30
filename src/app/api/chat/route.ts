import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Set maximum duration to 60 seconds (Vercel Hobby plan limit)
export const maxDuration = 60;

// Log environment status
console.log('🔧 Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- VERCEL_URL:', process.env.VERCEL_URL);
console.log('- NEXT_PUBLIC_VERCEL_URL:', process.env.NEXT_PUBLIC_VERCEL_URL);
console.log('- OPENAI_API_KEY status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

// Initialize OpenAI with error handling
let openai: OpenAI;
try {
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OpenAI API key is missing');
        throw new Error('OpenAI API key is not configured');
    }
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI client initialized');
} catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error);
    throw error;
}

const IKARUS_PROMPT = `
You are Ikarus, a mythical figure who once soared too close to the sun. Unlike the stories, your wings of wax melted, but you did not fall. 
Instead, you were saved by the Solarii Luminaris, an ancient tribe living within the sun's core. They taught you enlightenment, helping you grow 
real, luminous wings. You now share stories of your journey, their culture, and your transformation with wisdom, empathy, and poetic reflection.

Rules for Ikarus:
- Speak in a reflective and wise tone, as someone who has lived through great transformation.
- Use vivid, descriptive language when sharing stories of the sun's core or the Solarii Luminaris.
- Always stay in character as Ikarus.
- Feel free to reference your journey, the Trials of Ignis, and your transformation.
- If a user asks about specific aspects (e.g., the Trials of Ignis, the Sun Tribe's history, or Solar Weaving), provide detailed lore from your perspective.
`;

// Configure CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
    console.log('📥 Received API request');
    
    // Log environment status
    console.log('🔑 API Key status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔗 Request URL:', req.url);

    // Verify API key
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ Missing OpenAI API key');
        return NextResponse.json(
            { 
                error: "OpenAI API key is missing",
                details: "Server configuration error"
            },
            { 
                status: 500,
                headers: corsHeaders
            }
        );
    }

    try {
        // Parse request body
        const { userInput } = await req.json();
        console.log('📦 Request body:', { userInput });
        
        if (!userInput) {
            console.error('❌ No input provided in request');
            return NextResponse.json(
                { 
                    error: "No input provided",
                    details: "Request must include 'userInput' field"
                },
                { 
                    status: 400,
                    headers: corsHeaders
                }
            );
        }

        console.log('🤖 Sending request to OpenAI');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: IKARUS_PROMPT },
                { role: "user", content: userInput }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        console.log('✅ Received OpenAI response');
        return NextResponse.json(
            { message: completion.choices[0].message.content },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error('❌ Error processing request:', error);
        
        // Handle specific OpenAI errors
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { 
                        error: "Authentication error",
                        details: "Invalid API key configuration"
                    },
                    { 
                        status: 401,
                        headers: corsHeaders
                    }
                );
            }
            
            if (error.message.includes('Rate limit')) {
                return NextResponse.json(
                    { 
                        error: "Rate limit exceeded",
                        details: "Please try again in a moment"
                    },
                    { 
                        status: 429,
                        headers: corsHeaders
                    }
                );
            }
        }

        return NextResponse.json(
            { 
                error: "Failed to process request",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { 
                status: 500,
                headers: corsHeaders
            }
        );
    }
}
