import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, TrendingDown, Target, ShieldCheck, Globe, Zap, Users } from 'lucide-react';

function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

function FeatureCard({ icon, title, description, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div className={`group flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-green-100 animate-fade-in ${delay}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label, suffix, color }: { value: number; label: string; suffix?: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-4xl md:text-5xl font-black ${color} mb-2`}>
        <AnimatedCounter end={value} suffix={suffix || ''} />
      </div>
      <p className="text-gray-700 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Home() {
  const [co2Simulated, setCo2Simulated] = useState(145892);

  // Simulate live CO2 counter increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Simulated(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-white -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-green-200">
              <Zap className="w-4 h-4" />
              Powered by Google Gemini AI · Google Cloud
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Understand your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                carbon impact.
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              India's smartest carbon footprint tracker. Get AI-powered personalized insights,
              track your progress, and take meaningful action — all in minutes.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                to="/calculator"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 rounded-full transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-1"
              >
                Calculate My Footprint
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/results"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-green-700 bg-white border-2 border-green-200 rounded-full transition-all hover:bg-green-50 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                View Dashboard
              </Link>
            </div>

            {/* Live Counter Card */}
            <div className="relative mx-auto max-w-lg" aria-live="polite" aria-atomic="true">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-xl opacity-20" aria-hidden="true" />
              <div className="relative bg-white rounded-3xl shadow-2xl border border-green-100 p-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest">Live CO₂ Tracked</p>
                </div>
                <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 tracking-tighter" aria-label={`${co2Simulated.toLocaleString()} tonnes CO2 equivalent tracked`}>
                  {co2Simulated.toLocaleString()}
                </div>
                <p className="mt-2 text-gray-600 font-medium">Tonnes CO₂e tracked by CarbonSaathi users</p>
                <p className="text-xs text-gray-700 mt-1">Updates every 2 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-500" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Platform statistics</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={50000} label="Indians Tracking" suffix="+" color="text-white" />
            <StatCard value={5} label="Emission Categories" color="text-white" />
            <StatCard value={90} label="Day Action Plans" color="text-white" />
            <StatCard value={100} label="Free to Use" suffix="%" color="text-white" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl font-bold text-gray-900 mb-4">Why CarbonSaathi?</h2>
            <p className="text-gray-700 max-w-xl mx-auto">Built specifically for India, powered by the latest AI — everything you need to understand and reduce your impact.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-white" />}
              title="India-Specific Factors"
              description="Calculations use Indian electricity grid data, local transport emission factors, and dietary patterns — not generic Western averages."
              delay="delay-0"
            />
            <FeatureCard
              icon={<TrendingDown className="w-8 h-8 text-white" />}
              title="Track & Build Streaks"
              description="Monitor your footprint over time with beautiful charts. Build daily streaks and earn badges as you make progress toward your goals."
              delay="delay-100"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-white" />}
              title="Gemini AI Insights"
              description="Get a fully personalized 90-day action plan and smart recommendations generated by Google Gemini based on YOUR actual data."
              delay="delay-200"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-white" />}
              title="Global Benchmarks"
              description="See exactly how you compare to the India average (1.9t), Global average (4.7t), and the Paris Agreement target (2.0t)."
              delay="delay-0"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-white" />}
              title="5 Emission Categories"
              description="Track Transport, Home Energy, Diet, Waste, and Shopping — the most comprehensive carbon calculator for Indian lifestyles."
              delay="delay-100"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-white" />}
              title="Shareable Result Card"
              description="Download a beautiful carbon grade card to share on LinkedIn or Instagram and inspire others to track their footprint too."
              delay="delay-200"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-700">Three simple steps to understand and reduce your impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-200 to-emerald-200" />

            {[
              { step: '01', title: 'Calculate', desc: 'Enter your lifestyle data across 5 categories in our 5-step calculator', icon: '📊' },
              { step: '02', title: 'Discover', desc: 'See your carbon grade, breakdown, and how you compare to India & global averages', icon: '🔍' },
              { step: '03', title: 'Reduce', desc: 'Follow your AI-generated 90-day roadmap and track your improvement over time', icon: '🌱' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-green-200 z-10">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Step {item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Leaf className="w-96 h-96 text-white absolute -top-20 -right-20" />
          <Leaf className="w-64 h-64 text-white absolute -bottom-10 -left-10" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to know your carbon footprint?
          </h2>
          <p className="text-green-100 text-xl mb-10">
            It takes less than 3 minutes. No signup required. 100% free.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-green-700 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-1"
          >
            Start Calculating Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
