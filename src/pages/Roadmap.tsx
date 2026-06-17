import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { CheckCircle2, Circle, Bot, Leaf, RefreshCw, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

interface RoadmapItem {
  text: string;
  saving: string;
  done: boolean;
}

interface RoadmapPlan {
  phase30: RoadmapItem[];
  phase60: RoadmapItem[];
  phase90: RoadmapItem[];
  summary: string;
}

const DEFAULT_PLAN: RoadmapPlan = {
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

export default function Roadmap() {
  const currentData = useStore((state) => state.currentData);
  const [plan, setPlan] = useState<RoadmapPlan>(DEFAULT_PLAN);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  useEffect(() => {
    if (currentData) {
      generateAIPlan();
    }
  }, [currentData]);

  const generateAIPlan = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || !currentData) return;

    setLoading(true);
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

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      setPlan({
        summary: parsed.summary,
        phase30: parsed.phase30.map((i: any) => ({ ...i, done: false })),
        phase60: parsed.phase60.map((i: any) => ({ ...i, done: false })),
        phase90: parsed.phase90.map((i: any) => ({ ...i, done: false })),
      });
      setIsAIGenerated(true);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setPlan(DEFAULT_PLAN);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = 9;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const phases = [
    {
      key: 'phase30',
      title: '🌱 First 30 Days',
      subtitle: 'Easy Wins',
      items: plan.phase30,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
    },
    {
      key: 'phase60',
      title: '⚡ Days 31–60',
      subtitle: 'Habit Shifts',
      items: plan.phase60,
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      key: 'phase90',
      title: '🚀 Days 61–90',
      subtitle: 'Big Impacts',
      items: plan.phase90,
      gradient: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
    },
  ];

  if (!currentData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Calculate first to get your personalized roadmap!</h2>
        <p className="text-gray-600 mb-8">Your roadmap will be generated by Gemini AI based on your actual emission data.</p>
        <Link to="/calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">
          Go to Calculator <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          {isAIGenerated ? (
            <><Bot className="w-4 h-4" /> Personalized by Google Gemini AI</>
          ) : (
            <><Leaf className="w-4 h-4" /> Your Action Plan</>
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your 90-Day Carbon Roadmap</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {loading ? 'Gemini AI is crafting your personalized plan...' : plan.summary}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-700">Overall Progress</span>
          <span className="font-bold text-green-600">{completedItems}/{totalItems} actions</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Start</span>
          <span className="text-green-600 font-semibold">{progressPercent}% complete</span>
          <span>90 days</span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-16 bg-gray-200" />
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-12 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {phases.map((phase) => (
            <div key={phase.key} className={`bg-white rounded-3xl shadow-sm border ${phase.border} overflow-hidden`}>

              {/* Phase Header */}
              <div className={`bg-gradient-to-r ${phase.gradient} px-6 py-5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{phase.subtitle}</p>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {phase.items.filter((_, idx) => checkedItems[`${phase.key}-${idx}`]).length}/{phase.items.length} done
                  </span>
                </div>
              </div>

              {/* Phase Items */}
              <div className="p-4 space-y-3">
                {phase.items.map((item, idx) => {
                  const key = `${phase.key}-${idx}`;
                  const isDone = checkedItems[key];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleItem(key)}
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border ${isDone
                        ? 'bg-green-50 border-green-200'
                        : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
                        }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {item.text}
                        </p>
                        <span className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${phase.badge}`}>
                          {item.saving}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regenerate Button */}
      <div className="text-center mt-8">
        <button
          onClick={generateAIPlan}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Regenerate with Gemini AI
        </button>
        <p className="text-xs text-gray-400 mt-2">Powered by Google Gemini · Google Cloud</p>
      </div>
    </div>
  );
}