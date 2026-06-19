interface ShoppingProps {
  data: 'low' | 'medium' | 'high';
  onChange: (data: 'low' | 'medium' | 'high') => void;
}

export function ShoppingForm({ data, onChange }: ShoppingProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4" id="shopping-description">How would you describe your shopping habits (clothing, electronics, etc)?</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-labelledby="shopping-description">
        {(['low', 'medium', 'high'] as const).map((type) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={data === type}
            onClick={() => onChange(type)}
            className={`p-4 rounded-xl border-2 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${data === type ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
          >
            <p className="font-semibold capitalize text-gray-800">{type}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
