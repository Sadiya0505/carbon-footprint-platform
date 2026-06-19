import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <Leaf className="w-5 h-5" aria-hidden="true" />
          <span className="font-semibold text-gray-700">CarbonSaathi</span>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          Powered by Google Gemini &middot; Google Cloud
        </p>
      </div>
    </footer>
  );
}
