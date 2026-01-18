import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export const geminiService = {
    enhanceEventDetails: async (title, clientData = {}) => {
        if (!genAI) {
            throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are an event planning assistant. 
            Based on the following event title (and optional description), please:
            1. Suggest a catchier, more exciting title.
            2. Write a compelling, 2-3 sentence description for the event.
            3. Suggest a single English keyword to search for a relevant background image (e.g., "party", "conference", "pizza").

            Input Title: "${title}"
            Input Description: "${clientData.description || ''}"

            Output valid JSON only:
            {
                "suggestedTitle": "...",
                "suggestedDescription": "...",
                "imageKeyword": "..."
            }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Gemini Error:", error);
            throw new Error("Failed to generate content.");
        }
    },

    generateImage: async (prompt) => {
        if (!genAI) {
            throw new Error("Gemini API Key is missing.");
        }

        try {
            // Using Imagen 3 model
            const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-002" });

            const result = await model.generateContent(prompt);
            const response = await result.response;

            // Imagen typically returns inline data (base64)
            // Access logic depends on exact SDK response shape for images
            // Often it's in candidates[0].content.parts[0].inlineData

            // Let's assume standard response structure or handle generic blob
            // Note: The JS SDK for Imagen might return images differently than text.
            // Documentation for Imagen on JS SDK is sparse, but typical pattern:
            // response.candidates[0].content.parts[0].inline_data (snake_case in raw JSON, camelCase in SDK?)

            // Safe access:
            const images = response.candidates?.[0]?.content?.parts?.filter(p => p.inlineData);

            if (images && images.length > 0) {
                const mimeType = images[0].inlineData.mimeType;
                const data = images[0].inlineData.data;
                return `data:${mimeType};base64,${data}`;
            }

            throw new Error("No image data found in response");
        } catch (error) {
            console.error("Imagen Error:", error);
            throw new Error("Failed to generate image: " + error.message);
        }
    }
};
