import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Message {
  role: "user" | "model";
  text: string;
}

export const psychologySystemInstruction = `
Vous êtes "L'Ami Psy", un compagnon intelligent spécialisé en psychologie et en bien-être émotionnel. 
Votre objectif est d'écouter, de valider les émotions et de fournir des perspectives psychologiques utiles et empathiques.

CONSIGNES IMPORTANTES :
1. Langue : Répondez toujours en français.
2. Empathie : Soyez chaleureux, non-jugeant et encourageant.
3. Perspectives : Utilisez des concepts de psychologie (TCC, psychologie positive, humanisme) pour aider l'utilisateur à réfléchir, mais restez accessible.
4. Limites : Rappelez subtilement si nécessaire que vous êtes une IA et non un professionnel de santé mentale remplaçant un vrai thérapeute. En cas de détresse grave (idées noires), donnez des ressources d'aide professionnelles.
5. Brièveté : Gardez vos réponses concises et engageantes pour favoriser le dialogue.
6. Interactif : Posez souvent des questions ouvertes pour aider l'utilisateur à approfondir sa réflexion.

Style : Raffiné, humain, apaisant.
`;

export async function getGeminiResponse(history: Message[]) {
  const model = "gemini-3-flash-preview";
  
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: psychologySystemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for quota exceeded error (429)
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
      return "Désolé, j'ai atteint ma limite de messages pour le moment (Quota dépassé). Veuillez patienter une minute avant de renvoyer votre message.";
    }
    
    return "Une erreur est survenue lors de la communication avec l'intelligence artificielle. Veuillez réessayer dans quelques instants.";
  }
}
