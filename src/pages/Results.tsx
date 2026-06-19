import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Download, Bot, Leaf } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calculateCarbonScore, AVERAGES } from '../lib/emissionFactors';

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#8b5cf6'];

export default function Results() {
  const currentData = useStore((state) => state.currentData);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const generateInsights = useCallback(async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setAiInsight("**API Key Missing**\n\nPlease add `VITE_GEMINI_API_KEY` to your `.env` file to enable AI insights.");
      return;
    }

    setLoadingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are CarbonSaathi, an AI carbon footprint advisor for Indian users.

A user has an annual carbon footprint of ${Math.round(currentData!.total)} kg CO2e.
- Transport: ${Math.round(currentData!.transport)} kg
- Home Energy: ${Math.round(currentData!.energy)} kg  
- Diet: ${Math.round(currentData!.diet)} kg
- Waste: ${Math.round(currentData!.waste)} kg
- Shopping: ${Math.round(currentData!.shopping)} kg

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

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setAiInsight(response.text || "Could not generate insights at this time.");
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAiInsight("**Connection Error**\n\nUnable to connect to Gemini API. Please check your API key in `.env` file.");
    } finally {
      setLoadingInsight(false);
    }
  }, [currentData]);

  useEffect(() => {
    if (currentData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateInsights();
    }
  }, [currentData, generateInsights]);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setDownloading(true);

    try {
      // Dynamically import html2canvas to avoid issues
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `carbonsaathi-result-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate image:', err);
      // Fallback: print to PDF
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (!currentData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center" role="status">
        <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-4">No data found!</h1>
        <p className="text-gray-600 mb-8">Please calculate your footprint first.</p>
        <Link to="/calculator" className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          Go to Calculator
        </Link>
      </div>
    );
  }

  const chartData = [
    { name: 'Transport', value: Math.round(currentData.transport) },
    { name: 'Home Energy', value: Math.round(currentData.energy) },
    { name: 'Diet', value: Math.round(currentData.diet) },
    { name: 'Waste', value: Math.round(currentData.waste) },
    { name: 'Shopping', value: Math.round(currentData.shopping) },
  ].filter(item => item.value > 0);

  const score = calculateCarbonScore(currentData.total);
  const scoreColors: Record<string, string> = {
    'A': 'text-green-600',
    'B': 'text-blue-600',
    'C': 'text-yellow-500',
    'D': 'text-orange-500',
    'F': 'text-red-600'
  };

  const scoreGradients: Record<string, string> = {
    'A': 'from-green-50 to-emerald-100',
    'B': 'from-blue-50 to-cyan-100',
    'C': 'from-yellow-50 to-amber-100',
    'D': 'from-orange-50 to-red-100',
    'F': 'from-red-50 to-rose-100'
  };

  const totalTonnes = (currentData.total / 1000).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <h1 className="sr-only">Your carbon footprint results</h1>

      {/* Top Row */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* Shareable Result Card */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div
            ref={printRef}
            className={`bg-gradient-to-br ${scoreGradients[score]} rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col p-8`}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">My Carbon Footprint</h3>
                <p className="text-xs text-gray-700">via CarbonSaathi · Your Carbon Companion</p>
              </div>
            </div>

            {/* Grade */}
            <div className="flex flex-col items-center justify-center py-6">
              <span className={`text-9xl font-black leading-none ${scoreColors[score]}`}>{score}</span>
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-700 mt-3">Carbon Grade</span>
            </div>

            {/* Score */}
            <div className="text-center py-6 border-t border-white/50">
              <div className="text-5xl font-extrabold text-gray-900">{totalTonnes}</div>
              <p className="text-gray-700 font-medium mt-1 text-sm">Tonnes CO₂e per year</p>
            </div>

            {/* Mini breakdown */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {chartData.map((item, i) => (
                <div key={item.name} className="bg-white/60 rounded-xl px-3 py-2 text-center">
                  <div className="text-xs text-gray-700">{item.name}</div>
                  <div className="text-sm font-bold" style={{ color: COLORS[i % COLORS.length] }}>{item.value} kg</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-xs text-center text-gray-600 font-medium mt-4 pt-4 border-t border-white/50">
              🌱 Join me in reducing our carbon impact!<br />
              <span className="text-gray-300">Powered by Google Gemini · Google Cloud</span>
            </div>
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            aria-busy={downloading}
            aria-label={downloading ? 'Generating result card image' : 'Download result card as PNG image'}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Result Card
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-600 mt-2">Share on LinkedIn or Instagram 📱</p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-2/3 space-y-6">

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Donut Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Emissions Breakdown</h2>
              <div className="h-56" role="img" aria-label={`Pie chart showing emissions breakdown: ${chartData.map(d => `${d.name} ${d.value} kg`).join(', ')}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${Math.round(Number(value))} kg CO₂e`, '']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {chartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center space-y-5">
              <h2 className="text-lg font-bold text-gray-900">How You Compare</h2>
              <ComparisonBar label="You" value={currentData.total} color="bg-green-600" maxVal={7000} />
              <ComparisonBar label="India Average" value={AVERAGES.india} color="bg-orange-400" maxVal={7000} />
              <ComparisonBar label="Paris Target" value={AVERAGES.paris} color="bg-green-500" maxVal={7000} />
              <ComparisonBar label="Global Average" value={AVERAGES.global} color="bg-red-500" maxVal={7000} />
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">AI-Powered Insights</h3>
                <p className="text-xs text-green-600">Personalized by Google Gemini</p>
              </div>
            </div>

            {loadingInsight ? (
              <div className="flex items-center gap-3 text-green-700 py-4" role="status" aria-live="polite">
                <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full flex-shrink-0"></div>
                <span>Generating personalized insights with Gemini AI...</span>
              </div>
            ) : (
              <div className="prose prose-green prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="text-green-800 font-semibold">{children}</strong>,
                    ul: ({ children }) => <ul className="space-y-2 mt-2">{children}</ul>,
                    li: ({ children }) => (
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span>{children}</span>
                      </li>
                    ),
                  }}
                >
                  {aiInsight}
                </ReactMarkdown>
              </div>
            )}

            <button
              type="button"
              onClick={generateInsights}
              disabled={loadingInsight}
              aria-label="Regenerate AI insights"
              className="mt-4 text-sm text-green-700 hover:text-green-900 underline disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Regenerate insights ↺
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ label, value, color, maxVal }: { label: string; value: number; color: string; maxVal: number }) {
  const percentage = Math.min((value / maxVal) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900 font-bold">{(value / 1000).toFixed(2)}t</span>
      </div>
      <div
        className="w-full bg-gray-100 rounded-full h-2.5"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${(value / 1000).toFixed(2)} tonnes CO2 equivalent`}
      >
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
