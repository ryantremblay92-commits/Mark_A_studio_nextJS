
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { 
  LogoPlacement, 
  LogoSize, 
  BrandContext, 
  BrandInsight, 
  BrandSource, 
  PosterStyle, 
  AspectRatio, 
  Client, 
  StrategySection, 
  Campaign, 
  CampaignContent, 
  CrmDeal,
  Strategy,
  ServiceItem,
  OptimizedRateSheet
} from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

function extractJsonFromText<T>(text: string, defaultValue: T): T {
  if (!text) return defaultValue;
  try {
    // Attempt 1: Direct parse after cleaning markdown blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    // Attempt 2: Find the first [ and last ] or { and last }
    const startChar = text.indexOf('[');
    const endChar = text.lastIndexOf(']');
    if (startChar !== -1 && endChar !== -1) {
      try {
        return JSON.parse(text.substring(startChar, endChar + 1));
      } catch (inner) {}
    }

    const startObj = text.indexOf('{');
    const endObj = text.lastIndexOf('}');
    if (startObj !== -1 && endObj !== -1) {
       try {
        return JSON.parse(text.substring(startObj, endObj + 1));
      } catch (inner) {
        console.error("JSON Parse Error", inner);
      }
    }

    return defaultValue;
  }
}

export const generateProposal = async (client: Client, deal: CrmDeal): Promise<string> => {
  const ai = getAI();
  const prompt = `Write a bespoke Marketing Proposal to ${client.name} for "${deal.title}". Use their industry context: ${client.industry}. Structure: Exec Summary, Challenge, Solution, Investment.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
  });
  return response.text || "Failed to generate proposal.";
};

export const generateMarketingStrategy = async (client: Client): Promise<{sections: StrategySection[], sources: BrandSource[]}> => {
  const ai = getAI();
  const websiteInfo = client.website ? `(Website: ${client.website})` : "";
  const prompt = `Act as a World-Class Strategy Director. Perform deep market research on ${client.name} ${websiteInfo}.
  
  REQUIRED SECTIONS (Comprehensive and Actionable):
  1. Executive Summary: High-level vision and market positioning.
  2. ICP (Ideal Customer Profile): Detailed firmographics, demographics, and psychographics.
  3. Buyer Personas: Create 2 specific named archetypes.
  4. Pain Point Analysis: Emotional and logical struggles.
  5. Channel Strategy: Prioritized marketing channels with rationale.
  6. Competitive Advantage: Unique selling proposition.

  FORMAT: Return a JSON array of objects: [{"title": "Section Name", "content": "Markdown content"}].
  Ensure the content is thorough and formatted with markdown bold text and bullets.
  Return ONLY the JSON array.
  `;

  // Switching to gemini-3-flash-preview for better reliability with search grounding in this context
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const sources: BrandSource[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({ title: chunk.web.title || "Web Resource", uri: chunk.web.uri });
      }
    });
  }

  const sections = extractJsonFromText<any[]>(response.text || "[]", []);
  return { 
    sections: sections.map((s, i) => ({ 
      id: `s-${i}-${Date.now()}`, 
      title: s.title || "Strategic Insight", 
      content: s.content || "Details pending research synthesis."
    })), 
    sources 
  };
};

export const enhancePrompt = async (prompt: string, context: BrandContext, strategy?: Strategy): Promise<string> => {
  const ai = getAI();
  const stratContext = strategy ? strategy.sections.map(s => `${s.title}:\n${s.content}`).join('\n\n') : '';
  const system = `You are a High-End Creative Director. Your job is to take a simple user prompt and enhance it into a highly detailed visual directive.
  
  STRATEGIC CONTEXT:
  ${stratContext}

  Incorporate elements of the target persona and pain points into the visual atmosphere.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `Original Prompt: ${prompt}` }] }],
    config: { systemInstruction: system }
  });

  return response.text || prompt;
};

export const generateCampaignSuggestions = async (client: Client, strategyContext: string): Promise<Campaign[]> => {
  const ai = getAI();
  const prompt = `Based on this strategy dossier: ${strategyContext}\nSuggest 3 highly effective campaigns for ${client.name}. Return JSON: [{id, name, platform, budget}].`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
  });
  return extractJsonFromText<Campaign[]>(response.text || "[]", []).map(c => ({...c, id: `camp-${Math.random()}`, clientId: client.id}));
};

export const generateCampaignSchedule = async (client: Client, campaign: Campaign): Promise<CampaignContent[]> => {
  const ai = getAI();
  const prompt = `Create a 30-day performance schedule for the campaign "${campaign.name}". Return JSON array of: {id, date, type, topic, visualBrief, status}.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
  });
  return extractJsonFromText<CampaignContent[]>(response.text || "[]", []).map(i => ({...i, id: `it-${Math.random()}`}));
};

export const generatePosterImage = async (
  prompt: string,
  logoPlacement: LogoPlacement,
  logoSize: LogoSize,
  fontSize: number,
  brandContext: BrandContext,
  ratio: AspectRatio,
  style?: PosterStyle
): Promise<string> => {
  // Import and use the mock poster service
  const { generateMockPosterImage } = await import('./mockPosterService');
  return generateMockPosterImage(prompt, logoPlacement, logoSize, fontSize, brandContext, ratio, style);
};

export const extractBrandInsights = async (url: string): Promise<{insights: BrandInsight[], sources: BrandSource[]}> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `Extract brand identity insights from ${url}. Return JSON array of {id, category, value}.` }] }],
    config: { tools: [{ googleSearch: {} }] }
  });
  return { insights: extractJsonFromText<any[]>(response.text || "[]", []).map(i => ({...i, selected: true})), sources: [] };
};

export const generateOptimizedRateSheet = async (services: ServiceItem[]): Promise<OptimizedRateSheet | null> => {
  const ai = getAI();

  const systemInstruction = `You are an internal pricing assistant inside a marketing SaaS platform.
  Return ONLY a valid JSON object. Do not include markdown preamble.`;

  const prompt = `Optimize this rate sheet: ${JSON.stringify(services, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    return extractJsonFromText<OptimizedRateSheet | null>(response.text || "null", null);
  } catch (e) {
    console.error("Pricing Optimization Failed", e);
    return null;
  }
};
