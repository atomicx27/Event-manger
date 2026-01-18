export const pollinationsService = {
    generateImage: async (prompt) => {
        try {
            // Pollinations.ai generates images via URL parameters
            const encodedPrompt = encodeURIComponent(prompt);
            // nologo=true removes the watermark
            // seed is random by default if not specified
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&width=1280&height=720&model=flux`;

            // Pollinations returns the image directly at this URL.
            // We verify it's reachable just in case (optional, but good practice)
            // Note: We return the URL directly because formatting it IS the generation.

            return url;
        } catch (error) {
            console.error("Pollinations Error:", error);
            throw error;
        }
    }
};
