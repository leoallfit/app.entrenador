
import { GoogleGenAI, Type } from "@google/genai";
import { PageBlueprint, ThemeMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BLUEPRINT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    tagline: { type: Type.STRING },
    theme: {
      type: Type.OBJECT,
      properties: {
        mode: { type: Type.STRING, enum: ['light', 'dark', 'brutalist', 'minimal', 'modern', 'bold-typography'] },
        fontFamily: { type: Type.STRING, enum: ['sans', 'serif', 'mono'] },
        accentColor: { type: Type.STRING },
      },
      required: ['mode', 'fontFamily', 'accentColor'],
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['hero', 'features', 'cta', 'content', 'gallery', 'contact', 'prices'] },
          data: { type: Type.OBJECT },
          config: {
            type: Type.OBJECT,
            properties: {
              alignment: { type: Type.STRING, enum: ['left', 'center', 'right'] },
              padding: { type: Type.STRING, enum: ['small', 'medium', 'large'] },
              background: { type: Type.STRING },
            },
          },
        },
        required: ['id', 'type', 'data'],
      },
    },
  },
  required: ['name', 'tagline', 'theme', 'sections'],
};

export async function generateInitialBlueprint(prompt: string): Promise<PageBlueprint> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crea un blueprint de página web para: "${prompt}". 
    Sé creativo y profesional. Responde únicamente con el JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: BLUEPRINT_SCHEMA,
      systemInstruction: "Eres un diseñador web experto que crea estructuras de sitios web dinámicos. El campo 'data' para cada sección debe ser específico para el tipo. Temas soportados: light, dark, brutalist (blanco/negro con sombras), minimal, modern, y bold-typography (negro/neón con estética técnica y tipografía pesada).",
    },
  });

  return JSON.parse(result.text || '{}');
}

export async function morphBlueprint(instruction: string, current: PageBlueprint): Promise<PageBlueprint> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Instrucción de edición: "${instruction}". 
    Blueprint actual: ${JSON.stringify(current)}.
    Actualiza el blueprint siguiendo la instrucción. Puedes cambiar el tema, añadir/quitar secciones, o cambiar el contenido. 
    Responde únicamente con el nuevo JSON completo.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: BLUEPRINT_SCHEMA,
      systemInstruction: "Eres un motor de edición de sitios web. Tu tarea es recibir un blueprint actual y una instrucción de cambio, y devolver el blueprint modificado. Mantén la coherencia visual.",
    },
  });

  return JSON.parse(result.text || '{}');
}
