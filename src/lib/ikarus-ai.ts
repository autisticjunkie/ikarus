export async function chatWithIkarus(userInput: string): Promise<string> {
    console.log('🚀 Starting chat request with input:', userInput);
    
    try {
        // Get the base URL for the API
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
            : '';
        
        console.log('📡 API URL:', `${baseUrl}/api/chat`);
        
        const requestBody = JSON.stringify({ userInput });
        console.log('📦 Request payload:', requestBody);

        const response = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('📄 Response data:', data);

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
                return 'I am unable to connect to the network. Please check your connection.';
            }
            return `The solar winds are turbulent. Error: ${error.message}`;
        }
        return 'The solar winds are turbulent. Please try again in a moment.';
    }
}