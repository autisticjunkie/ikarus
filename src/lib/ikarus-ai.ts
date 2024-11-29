export async function chatWithIkarus(userInput: string): Promise<string> {
    try {
        console.log("Starting API request with input:", userInput);
        console.log("API endpoint:", '/api/chat');
        
        const requestBody = JSON.stringify({ userInput });
        console.log("Request body:", requestBody);

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        console.log("Response received:");
        console.log("- Status:", response.status);
        console.log("- Status Text:", response.statusText);
        console.log("- Headers:", Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log("Parsed response data:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            const errorMessage = data.details || data.error || `HTTP error! status: ${response.status}`;
            console.error("API Error Details:", {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
                data
            });
            return `The solar winds are turbulent. Error: ${errorMessage}`;
        }
        
        if (data.error) {
            console.error("API Response Error:", {
                error: data.error,
                details: data.details,
                data
            });
            return `The solar winds are turbulent. ${data.details || data.error}`;
        }

        if (!data.message) {
            console.error("No message in response data:", data);
            return "I am in deep meditation at the moment. Please try again.";
        }

        console.log("Successfully received message:", data.message.substring(0, 50) + "...");
        return data.message;
    } catch (error) {
        console.error("Error in chatWithIkarus:", {
            error,
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        });
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return `The solar winds are turbulent. ${errorMessage}`;
    }
}