import { useState, useCallback } from 'react';
import type { FootprintData } from '../store/useStore';

export interface RoadmapItem {
  text: string;
  saving: string;
  done: boolean;
}

export interface RoadmapPlan {
  phase30: RoadmapItem[];
  phase60: RoadmapItem[];
  phase90: RoadmapItem[];
  summary: string;
}

export const DEFAULT_PLAN: RoadmapPlan = {
  summary: "Follow this 90-day journey to build sustainable habits and reduce your carbon footprint step by step.",
  phase30: [
    { text: "Switch off standby appliances and unplug chargers daily", saving: "Save ~50 kg CO₂/year", done: false },
    { text: "Replace all incandescent bulbs with LED alternatives", saving: "Save ~40 kg CO₂/year", done: false },
    { text: "Buy local and seasonal produce for at least 30% of groceries", saving: "Save ~30 kg CO₂/year", done: false },
  ],
  phase60: [
    { text: "Carpool or use public transport at least twice a week", saving: "Save ~200 kg CO₂/year", done: false },
    { text: "Start a home composting bin for kitchen waste", saving: "Save ~60 kg CO₂/year", done: false },
    { text: "Reduce meat consumption by having 2 meat-free days per week", saving: "Save ~150 kg CO₂/year", done: false },
  ],
  phase90: [
    { text: "Switch to a green energy provider or install a solar water heater", saving: "Save ~300 kg CO₂/year", done: false },
    { text: "Reduce new clothing purchases by 50% — opt for second-hand", saving: "Save ~100 kg CO₂/year", done: false },
    { text: "Plant 5 trees or donate to a local reforestation project", saving: "Offset ~100 kg CO₂/year", done: false },
  ],
};

export function useGeminiRoadmap(footprintData: FootprintData | null) {
  const [plan, setPlan] = useState<RoadmapPlan>(DEFAULT_PLAN);
  const [loading, setLoading] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  const generate = useCallback(async () => {
    if (!footprintData) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generateRoadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footprintData),
      });

      if (!res.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const parsed = await res.json();
      
      setPlan({
        summary: parsed.summary,
        phase30: parsed.phase30.map((i: Omit<RoadmapItem, 'done'>) => ({ ...i, done: false })),
        phase60: parsed.phase60.map((i: Omit<RoadmapItem, 'done'>) => ({ ...i, done: false })),
        phase90: parsed.phase90.map((i: Omit<RoadmapItem, 'done'>) => ({ ...i, done: false })),
      });
      setIsAIGenerated(true);
    } catch (error) {
      console.error('Error fetching AI roadmap:', error);
      setPlan(DEFAULT_PLAN);
      setIsAIGenerated(false);
    } finally {
      setLoading(false);
    }
  }, [footprintData]);

  return { plan, loading, generate, isAIGenerated };
}
