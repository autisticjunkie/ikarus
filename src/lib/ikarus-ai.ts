export async function chatWithIkarus(userInput: string): Promise<string> {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to communicate with Ikarus');
        }

        return data.message || 'I am in deep meditation at the moment. Please try again.';
    } catch (error) {
        console.error('Error:', error);
        return 'The solar winds are turbulent. Please try again in a moment.';
    }
}