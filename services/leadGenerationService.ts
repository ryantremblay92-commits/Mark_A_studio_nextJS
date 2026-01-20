/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { Client, Lead, BrandSource } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Core search function that builds the grounded prompt and parses results.
 */
async function searchLeadsInternal(category: string, location: string, userLatLng?: LatLng): Promise<Lead[]> {
  const ai = getAI();
  const prompt = `
    Using Google Maps and Google Search, discover 10 active and real business leads.
    Focus on high-quality data. 

    Business Category: "${category}"
    Location: "${location}"

    Return a JSON array of objects with exactly these keys:
    - name: Business name.
    - address: Full street address.
    - phone: Contact number.
    - website: Official URL.
    - summary: A persuasive summary of their business model and why they are a good lead.
    - confidence: A numeric score 0-1 based on data completeness.

    IMPORTANT: Return ONLY the JSON array. Do not include any markdown code blocks or preamble.
  `;

  const toolConfig: any = {
    retrievalConfig: {},
  };
  if (userLatLng) {
    toolConfig.retrievalConfig.latLng = userLatLng;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        toolConfig,
      }
    });

    let rawText = response.text || "";
    let parsedLeads: Lead[] = [];

    // Robust JSON extraction
    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonContent = rawText.substring(jsonStart, jsonEnd + 1);
      parsedLeads = JSON.parse(jsonContent);
    } else {
      throw new Error("Could not locate lead data in response.");
    }

    // Extract grounding sources
    const allSources: BrandSource[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          allSources.push({ title: chunk.web.title || "Web Source", uri: chunk.web.uri });
        }
        if (chunk.maps?.uri) {
          allSources.push({ title: chunk.maps.title || "Maps Location", uri: chunk.maps.uri });
        }
      });
    }

    return parsedLeads.map(lead => ({
      ...lead,
      sources: lead.sources || allSources.slice(0, 3) // Limit to top 3 generic sources if specific ones missing
    }));

  } catch (error: any) {
    console.error("Discovery Error:", error);
    throw new Error(error.message || "Lead discovery failed.");
  }
}

export async function discoverLeads(
  client: Client,
  category: string,
  location: string,
  userLatLng?: LatLng
): Promise<Lead[]> {
  return await searchLeadsInternal(category, location, userLatLng);
}