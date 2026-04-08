import { GoogleGenAI, Type } from "@google/genai";
import { Game, SearchFilters } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GAME_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      releaseDate: { type: Type.STRING },
      developer: { type: Type.STRING },
      publisher: { type: Type.STRING },
      genres: { type: Type.ARRAY, items: { type: Type.STRING } },
      platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
      rating: { type: Type.STRING },
      coverUrl: { type: Type.STRING },
      isSubGame: { type: Type.BOOLEAN },
      parentGame: { type: Type.STRING },
      subGames: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["id", "title", "description", "releaseDate", "genres", "platforms"],
  },
};

export async function searchGames(query: string, filters: SearchFilters): Promise<Game[]> {
  const prompt = `Search for video games matching: "${query}". 
  Filters: ${filters.upcomingOnly ? "Include upcoming/unreleased games." : "Include all games."}
  ${filters.deepSearch ? "Perform a deep search, looking for obscure titles and games within games (e.g., Blox Fruits in Roblox, Creative maps in Fortnite)." : ""}
  
  CRITICAL INSTRUCTIONS:
  1. If the query is a specific title like "Knife Battle X", "Blox Fruits", or "Pet Simulator", recognize that these are often games WITHIN platforms like Roblox. 
  2. For such games, set "isSubGame" to true and "parentGame" to "Roblox" (or the relevant platform).
  3. If the query is a platform (Roblox, Fortnite, Minecraft), return the platform itself as the first result, and include its most popular sub-games in the "subGames" array.
  4. Provide accurate descriptions, genres, and release dates even for sub-games.
  5. **REAL IMAGES**: For "coverUrl", you MUST provide a REAL, high-quality URL to the game's official cover art or a highly representative screenshot. Use reliable sources like IGDB, Steam, or official game wikis. If you cannot find a direct URL, use a high-quality Unsplash image that perfectly matches the game's theme (e.g., for a racing game, a high-end sports car).
  
  Return the results as a JSON array of game objects.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: GAME_SCHEMA,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error searching games:", error);
    return [];
  }
}

export async function getGameDetails(title: string): Promise<Game | null> {
  const prompt = `Provide comprehensive details for the video game: "${title}". 
  Include its description, release date, developer, publisher, genres, platforms, and any sub-games or modes if it's a platform (like Roblox or Fortnite).
  Return as a single JSON object matching the game schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: GAME_SCHEMA.items.properties,
          required: GAME_SCHEMA.items.required,
        },
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error getting game details:", error);
    return null;
  }
}

export async function detectGameFromImage(base64Image: string): Promise<Game | null> {
  const prompt = `Identify the video game in this image. It could be a screenshot, a cover art, or a photo of a screen. 
  Provide comprehensive details including its title, description, release date, developer, publisher, genres, platforms, and any sub-games or modes if it's a platform.
  Return as a single JSON object matching the game schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1] || base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: GAME_SCHEMA.items.properties,
          required: GAME_SCHEMA.items.required,
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error detecting game from image:", error);
    return null;
  }
}
