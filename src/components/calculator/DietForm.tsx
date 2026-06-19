interface DietProps {
  data: 'meatHeavy' | 'moderate' | 'vegetarian' | 'vegan';
  onChange: (data: 'meatHeavy' | 'moderate' | 'vegetarian' | 'vegan') => void;
}

export function DietForm({ data, onChange }: DietProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4" id="diet-description">How would you describe your typical diet?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-labelledby="diet-description">
        {(['meatHeavy', 'moderate', 'vegetarian', 'vegan'] as const).map((type) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={data === type}
            onClick={() => onChange(type)}
            className={`p-4 rounded-xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${data === type ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
          >
            <p className="font-semibold capitalize text-gray-800">{type.replace('Heavy', ' Heavy')}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
