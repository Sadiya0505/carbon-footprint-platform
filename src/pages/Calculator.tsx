import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateFootprint } from '../lib/calculateFootprint';
import { Car, Zap, Utensils, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Leaf } from 'lucide-react';

const FUN_FACTS = [
  "Did you know? Switching off standby appliances can save up to 10% of your energy bill.",
  "Public transport in India saves millions of tonnes of CO2 every year!",
  "A vegetarian diet has half the carbon footprint of a meat-heavy diet.",
  "Recycling one aluminum can saves enough energy to listen to a full album on your phone.",
  "Buying locally produced items significantly reduces transport emissions."
];

const STEPS = [
  { id: 'transport', title: 'Transport', icon: Car },
  { id: 'energy', title: 'Home Energy', icon: Zap },
  { id: 'diet', title: 'Diet', icon: Utensils },
  { id: 'waste', title: 'Waste', icon: Trash2 },
  { id: 'shopping', title: 'Shopping', icon: ShoppingBag },
];

export default function Calculator() {
  const navigate = useNavigate();
  const setFootprintData = useStore((state) => state.setFootprintData);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showFact, setShowFact] = useState(false);
  
  // Form State
  const [transport, setTransport] = useState({ petrolKm: 0, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 });
  const [energy, setEnergy] = useState({ electricityKwh: 0, lpgCylinders: 0, householdSize: 1 });
  const [diet, setDiet] = useState<'meatHeavy' | 'moderate' | 'vegetarian' | 'vegan'>('moderate');
  const [waste, setWaste] = useState({ kgPerWeek: 5, recyclingRate: 0.2 }); // 20% recycled default
  const [shopping, setShopping] = useState<'low' | 'medium' | 'high'>('medium');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setShowFact(true);
      setTimeout(() => {
        setShowFact(false);
        setCurrentStep((prev) => prev + 1);
      }, 3000); // Show fact for 3 seconds
    } else {
      calculateAndSave();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const calculateAndSave = () => {
    const breakdown = calculateFootprint({ transport, energy, diet, waste, shopping });
    setFootprintData(breakdown);
    navigate('/results');
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Carbon Calculator</h1>
          <span className="text-sm font-medium text-gray-600" aria-live="polite">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
        <div
          className="w-full bg-gray-200 rounded-full h-2.5"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Calculator progress: step ${currentStep + 1} of ${STEPS.length}`}
        >
          <motion.div
            className="bg-primary h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showFact ? (
          <motion.div
            key="fact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-green-50 p-12 rounded-3xl text-center shadow-inner border border-green-100 min-h-[400px] flex flex-col items-center justify-center"
            role="status"
            aria-live="polite"
            aria-label="Carbon fact"
          >
            <Leaf className="w-16 h-16 text-primary mb-6 animate-bounce" aria-hidden="true" />
            <p className="text-2xl font-medium text-green-900">{FUN_FACTS[currentStep]}</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 min-h-[400px] flex flex-col"
            aria-labelledby="step-heading"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              {(() => { const Icon = STEPS[currentStep].icon; return <Icon className="w-8 h-8 text-primary" aria-hidden="true" />; })()}
              <h2 id="step-heading" className="text-2xl font-semibold text-gray-800">{STEPS[currentStep].title}</h2>
            </div>

            <div className="flex-grow space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Estimate your weekly travel distance in kilometers.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Petrol Car (km/week)" value={transport.petrolKm} onChange={(v) => setTransport({...transport, petrolKm: v})} />
                    <Input label="Diesel Car (km/week)" value={transport.dieselKm} onChange={(v) => setTransport({...transport, dieselKm: v})} />
                    <Input label="EV (km/week)" value={transport.evKm} onChange={(v) => setTransport({...transport, evKm: v})} />
                    <Input label="Bus (km/week)" value={transport.busKm} onChange={(v) => setTransport({...transport, busKm: v})} />
                    <Input label="Train (km/week)" value={transport.trainKm} onChange={(v) => setTransport({...transport, trainKm: v})} />
                    <Input label="Flights (km/year)" value={transport.flightKm} onChange={(v) => setTransport({...transport, flightKm: v})} />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Enter your monthly household energy usage.</p>
                  <Input label="Electricity (kWh/month)" value={energy.electricityKwh} onChange={(v) => setEnergy({...energy, electricityKwh: v})} />
                  <Input label="LPG Cylinders (per month)" value={energy.lpgCylinders} onChange={(v) => setEnergy({...energy, lpgCylinders: v})} />
                  <Input label="Household Size (people)" value={energy.householdSize} onChange={(v) => setEnergy({...energy, householdSize: v})} />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4" id="diet-description">How would you describe your typical diet?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-labelledby="diet-description">
                    {(['meatHeavy', 'moderate', 'vegetarian', 'vegan'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={diet === type}
                        onClick={() => setDiet(type)}
                        className={`p-4 rounded-xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${diet === type ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
                      >
                        <p className="font-semibold capitalize text-gray-800">{type.replace('Heavy', ' Heavy')}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Estimate your household waste.</p>
                  <Input label="Total Waste (kg/week)" value={waste.kgPerWeek} onChange={(v) => setWaste({...waste, kgPerWeek: v})} />
                  <div>
                    <label htmlFor="recycling-rate" className="block text-sm font-medium text-gray-700 mb-2">
                      Recycling Rate (0% to 100%)
                    </label>
                    <input
                      id="recycling-rate"
                      type="range"
                      min="0"
                      max="100"
                      value={waste.recyclingRate * 100}
                      onChange={(e) => setWaste({ ...waste, recyclingRate: parseInt(e.target.value) / 100 })}
                      aria-valuenow={Math.round(waste.recyclingRate * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuetext={`${Math.round(waste.recyclingRate * 100)} percent`}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-right text-sm text-primary font-bold mt-1" aria-hidden="true">{Math.round(waste.recyclingRate * 100)}%</p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4" id="shopping-description">How would you describe your shopping habits (clothing, electronics, etc)?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-labelledby="shopping-description">
                    {(['low', 'medium', 'high'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={shopping === type}
                        onClick={() => setShopping(type)}
                        className={`p-4 rounded-xl border-2 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${shopping === type ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
                      >
                        <p className="font-semibold capitalize text-gray-800">{type}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                aria-disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${currentStep === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {currentStep === STEPS.length - 1 ? 'Calculate' : 'Next'}
                {currentStep !== STEPS.length - 1 && <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
