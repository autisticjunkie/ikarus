import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
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

export async function chatWithIkarus(userInput: string): Promise<string> {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        console.error("OpenAI API key is not set. Check your .env configuration.");
        return "I am unable to connect to the solar network at this moment.";
    }

    try {
        console.log("Sending request to OpenAI...");
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: IKARUS_PROMPT },
                { role: "user", content: userInput },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        console.log("Received response from OpenAI:", response);

        const message = response.choices?.[0]?.message?.content;
        if (!message) {
            console.error("No message content returned from OpenAI.");
            return "The solar winds are turbulent. I cannot hear you clearly at this moment.";
        }

        return message;
    } catch (error: any) {
        console.error("Error communicating with Ikarus:", error.response?.data || error.message);
        return "The solar winds are turbulent. I cannot hear you clearly at this moment.";
    }
}