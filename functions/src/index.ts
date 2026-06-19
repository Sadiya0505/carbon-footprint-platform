import { onRequest } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

export const generateInsights = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      response.status(500).send({ error: 'Missing Gemini API Key' });
      return;
    }

    const currentData = request.body;
    if (!currentData || !currentData.total) {
      response.status(400).send({ error: 'Missing carbon footprint data' });
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are CarbonSaathi, an AI carbon footprint advisor for Indian users.

A user has an annual carbon footprint of ${Math.round(currentData.total)} kg CO2e.
- Transport: ${Math.round(currentData.transport)} kg
- Home Energy: ${Math.round(currentData.energy)} kg  
- Diet: ${Math.round(currentData.diet)} kg
- Waste: ${Math.round(currentData.waste)} kg
- Shopping: ${Math.round(currentData.shopping)} kg

India average is 1,900 kg/year. Paris Agreement target is 2,000 kg/year.

Give exactly 3 personalized, actionable tips. Format your response EXACTLY like this:

Your footprint is [X] kg CO2e — [one sentence comparing to India average, encouraging tone].

**Tip 1: [Title]**
[One specific action they can take based on their highest emission category, with estimated savings]

**Tip 2: [Title]**
[One specific action, with estimated savings]

**Tip 3: [Title]**
[One specific action, with estimated savings]

Keep it concise, specific to their numbers, and encouraging.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      response.status(200).send({ text: aiResponse.text });
    } catch (error) {
      console.error("Error calling Gemini API", error);
      response.status(500).send({ error: 'Failed to generate insights' });
    }
  });
});

export const generateRoadmap = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      response.status(500).send({ error: 'Missing Gemini API Key' });
      return;
    }

    const currentData = request.body;
    if (!currentData || !currentData.total) {
      response.status(400).send({ error: 'Missing carbon footprint data' });
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are CarbonSaathi, an AI sustainability advisor for Indian users.

A user has these annual carbon emissions:
- Transport: ${Math.round(currentData.transport)} kg CO₂e
- Home Energy: ${Math.round(currentData.energy)} kg CO₂e
- Diet: ${Math.round(currentData.diet)} kg CO₂e
- Waste: ${Math.round(currentData.waste)} kg CO₂e
- Shopping: ${Math.round(currentData.shopping)} kg CO₂e
- TOTAL: ${Math.round(currentData.total)} kg CO₂e (India average: 1900 kg)

Generate a personalized 90-day carbon reduction roadmap. Focus most tips on their TOP 2 highest emission categories.

Respond ONLY with valid JSON in this exact format, no markdown, no explanation:
{
  "summary": "One encouraging sentence about their journey ahead mentioning their total footprint",
  "phase30": [
    {"text": "Specific easy action", "saving": "Save ~X kg CO₂/year"},
    {"text": "Specific easy action", "saving": "Save ~X kg CO₂/year"},
    {"text": "Specific easy action", "saving": "Save ~X kg CO₂/year"}
  ],
  "phase60": [
    {"text": "Specific medium-effort action", "saving": "Save ~X kg CO₂/year"},
    {"text": "Specific medium-effort action", "saving": "Save ~X kg CO₂/year"},
    {"text": "Specific medium-effort action", "saving": "Save ~X kg CO₂/year"}
  ],
  "phase90": [
    {"text": "Specific big-impact action", "saving": "Save ~X kg CO₂/year"},
    {"text": "Specific big-impact action", "saving": "Save ~X kg CO₂/year"},
    {"text": "Specific big-impact action", "saving": "Save ~X kg CO₂/year"}
  ]
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const text = aiResponse.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      
      response.status(200).send(parsed);
    } catch (error) {
      console.error("Error calling Gemini API", error);
      response.status(500).send({ error: 'Failed to generate roadmap' });
    }
  });
});
