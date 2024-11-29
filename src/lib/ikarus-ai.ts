export async function chatWithIkarus(userInput: string): Promise<string> {
    try {
        console.log("Sending request to Ikarus...");
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            console.error("Error from API:", data.error);
            return "The solar winds are turbulent. I cannot hear you clearly at this moment.";
        }

        return data.message || "I am in deep meditation at the moment. Please try again.";
    } catch (error) {
        console.error("Error communicating with Ikarus:", error);
        return "The solar winds are turbulent. I cannot hear you clearly at this moment.";
    }
}