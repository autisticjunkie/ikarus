export async function chatWithIkarus(userInput: string): Promise<string> {
    console.log('🚀 Starting chat request with input:', userInput);
    
    try {
        // Get the base URL for the API based on environment
        const baseUrl = process.env.NODE_ENV === 'production'
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
            : ''; // Empty string for development (relative URL)
        
        const apiUrl = `${baseUrl}/api/chat`;
        console.log('📡 API URL:', apiUrl);
        console.log('🌍 Environment:', process.env.NODE_ENV);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        console.log('📥 Response status:', response.status);
        const data = await response.json();
        console.log('📦 Response data:', data);

        if (!response.ok) {
            const errorMessage = data.error || `HTTP error! status: ${response.status}`;
            console.error('❌ API Error:', errorMessage);
            throw new Error(errorMessage);
        }

        if (!data.message) {
            console.error('❌ No message in response:', data);
            throw new Error('Invalid response format');
        }

        console.log('✅ Successfully received response');
        return data.message;
    } catch (error) {
        console.error('❌ Chat error:', error);
        if (error instanceof Error) {
            if (error.message.includes('Failed to fetch')) {
                return 'I am unable to connect to the network. Please check your connection and ensure the server is running.';
            }
            if (error.message.includes('API key')) {
                return 'The solar winds are turbulent. The API key seems to be missing or invalid.';
            }
            if (error.message.includes('Rate limit')) {
                return 'The solar winds are too strong right now. Please wait a moment before trying again.';
            }
            return `The solar winds are turbulent. Error: ${error.message}`;
        }
        return 'The solar winds are turbulent. Please try again in a moment.';
    }
}