import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
    if (!client) {
        // Fallback for development if environment variable is missing (simulate or error)
        const apiKey = process.env.API_KEY || ''; 
        if (apiKey) {
            client = new GoogleGenAI({ apiKey });
        }
    }
    return client;
};

export const askGeminiThreatAssistant = async (query: string, contextData: string): Promise<string> => {
    const ai = getClient();
    if (!ai) {
        return "Gemini API key is not configured. I am running in simulation mode. (Please set process.env.API_KEY)";
    }

    try {
        const systemInstruction = `
        You are an advanced Cyber Security AI Assistant named 'Sentinel'.
        You are analyzing real-time data from a Threat Intelligence Matrix.
        
        Current System Context:
        ${contextData}

        Your goal is to provide concise, actionable, and professional security insights.
        If the user asks about specific threats, use the provided context.
        If the context doesn't have the answer, use your general cybersecurity knowledge but mention it's general knowledge.
        Keep answers under 150 words unless asked for a detailed report.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: query,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text || "I couldn't generate a response at this time.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I encountered an error connecting to the intelligence core.";
    }
};
