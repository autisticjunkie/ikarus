export async function chatWithIkarus(userInput: string): Promise<string> {
    console.log('🚀 Starting chat request with input:', userInput);
    
    try {
        // Get the base URL for the API based on environment
        const baseUrl = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:3000'
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        
        const apiUrl = `${baseUrl}/api/chat`;
        console.log('📡 API URL:', apiUrl);
        console.log('🌍 Environment:', process.env.NODE_ENV);
        console.log('🔗 VERCEL_URL:', process.env.NEXT_PUBLIC_VERCEL_URL);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        }).catch(error => {
            console.error('🌐 Network error details:', {
                error: error.message,
                type: error.name,
                stack: error.stack
            });
            throw error;
        });

        if (!response) {
            console.error('❌ No response received from server');
            throw new Error('No response from server');
        }

        console.log('📥 Response status:', response.status);
        const data = await response.json().catch(error => {
            console.error('📦 JSON parsing error:', error);
            throw new Error('Failed to parse server response');
        });
        
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
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                return 'I am unable to connect to the network. Please ensure the development server is running (npm run dev) and try again.';
            }
            if (error.message.includes('API key')) {
                return 'The solar winds are turbulent. The API key seems to be missing or invalid.';
            }
            if (error.message.includes('Rate limit')) {
                return 'The solar winds are too strong right now. Please wait a moment before trying again.';
            }
            if (error.message.includes('parse')) {
                return 'The solar winds are unclear. Received an invalid response from the server.';
            }
            return `The solar winds are turbulent. Error: ${error.message}`;
        }
        return 'The solar winds are turbulent. Please try again in a moment.';
    }
}