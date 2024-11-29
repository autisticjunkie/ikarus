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
            console.error("API Error:", data.error, data.details);
            throw new Error(data.details || data.error || `HTTP error! status: ${response.status}`);
        }
        
        if (data.error) {
            console.error("Error from API:", data.error, data.details);
            return `Error: ${data.details || data.error}`;
        }

        return data.message || "I am in deep meditation at the moment. Please try again.";
    } catch (error) {
        console.error("Error communicating with Ikarus:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "The solar winds are turbulent. I cannot hear you clearly at this moment.";
    }
}