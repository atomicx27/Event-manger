
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // Hack directly to REST API to see raw list
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name}`);
                console.log(`  Supported generation methods: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.log("No models found or error structure:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
