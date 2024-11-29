export async function chatWithIkarus(userInput: string): Promise<string> {
    try {
        console.log("Sending request to Ikarus API...");
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
            const errorMessage = data.details || data.error || `HTTP error! status: ${response.status}`;
            console.error("API Error:", errorMessage);
            return `The solar winds are turbulent. Error: ${errorMessage}`;
        }
        
        if (data.error) {
            console.error("Error from API:", data.error, data.details);
            return `The solar winds are turbulent. ${data.details || data.error}`;
        }

        if (!data.message) {
            console.error("No message in response:", data);
            return "I am in deep meditation at the moment. Please try again.";
        }

        console.log("Successfully received message:", data.message);
        return data.message;
    } catch (error) {
        console.error("Error communicating with Ikarus:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return `The solar winds are turbulent. ${errorMessage}`;
    }
}