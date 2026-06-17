import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, History as HistoryIcon } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function History() {
  const history = useStore((state) => state.history);
  const streak = useStore((state) => state.streak);

  const chartData = history.map((entry, i) => ({
    name: `Entry ${i + 1}`,
    date: new Date(entry.date).toLocaleDateString(),
    total: Math.round(entry.total),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <HistoryIcon className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-gray-900">Your Progress</h2>
      </div>

      {/* Streak Tracker */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-3xl mb-8 border border-orange-100 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-orange-900 mb-1">Current Streak</h3>
          <p className="text-orange-700">Keep calculating to build your habit!</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-6 py-4 rounded-2xl shadow-sm border border-orange-100">
          <Flame className={`w-8 h-8 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
          <span className="text-3xl font-black text-gray-900">{streak}</span>
          <span className="text-gray-500 font-medium">Days</span>
        </div>
      </div>

      {/* History Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Emissions Over Time</h3>
        
        {history.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value} kg CO2e`, 'Emissions']}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#16a34a" 
                  strokeWidth={4}
                  dot={{ fill: '#16a34a', strokeWidth: 2, r: 6, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No history yet. Calculate your footprint to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
