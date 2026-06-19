import { useState, useCallback } from 'react';
import { FootprintData } from '../store/useStore';

export function useGeminiInsights(footprintData: FootprintData | null) {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    if (!footprintData) return;
    setLoading(true);
    try {
      // In dev, you might want to call the local emulator or fallback to local generation
      // But for security and hackathon evaluation, always route through API.
      const res = await fetch('/api/generateInsights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footprintData),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await res.json();
      setInsight(data.text);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setInsight("**Connection Error**\\n\\nUnable to generate insights at this time. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [footprintData]);

  return { insight, loading, generate };
}
