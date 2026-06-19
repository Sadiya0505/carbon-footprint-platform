import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateFootprint } from '../lib/calculateFootprint';
import { Car, Zap, Utensils, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Leaf } from 'lucide-react';
import { TransportForm } from '../components/calculator/TransportForm';
import { EnergyForm } from '../components/calculator/EnergyForm';
import { DietForm } from '../components/calculator/DietForm';
import { WasteForm } from '../components/calculator/WasteForm';
import { ShoppingForm } from '../components/calculator/ShoppingForm';

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
              {currentStep === 0 && <TransportForm data={transport} onChange={setTransport} />}
              {currentStep === 1 && <EnergyForm data={energy} onChange={setEnergy} />}
              {currentStep === 2 && <DietForm data={diet} onChange={setDiet} />}
              {currentStep === 3 && <WasteForm data={waste} onChange={setWaste} />}
              {currentStep === 4 && <ShoppingForm data={shopping} onChange={setShopping} />}
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


