import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  ArrowRight, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Scale,
  Ruler,
  Info,
  RotateCcw,
  Zap,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';

type Unit = 'metric' | 'imperial';

interface BMIResult {
  value: number;
  category: string;
  color: string;
  icon: typeof CheckCircle2;
  tips: string[];
  range: string;
}

function calculateBMI(height: number, weight: number, unit: Unit): number {
  let heightM: number;
  if (unit === 'metric') {
    heightM = height / 100;
  } else {
    // Imperial: height in inches, weight in lbs
    heightM = height * 0.0254;
    weight = weight * 0.453592;
  }
  return weight / (heightM * heightM);
}

function getBMIResult(bmi: number): BMIResult {
  if (bmi < 18.5) {
    return {
      value: bmi,
      category: 'Underweight',
      color: 'text-blue-400',
      icon: TrendingDown,
      range: '< 18.5',
      tips: [
        'Focus on calorie-dense, nutrient-rich foods like nuts, avocados, and whole grains',
        'Include strength training to build lean muscle mass',
        'Eat 5-6 smaller meals throughout the day instead of 3 large ones',
        'Consider consulting a dietitian for a personalized weight gain plan',
      ],
    };
  } else if (bmi < 25) {
    return {
      value: bmi,
      category: 'Normal',
      color: 'text-emerald-500',
      icon: CheckCircle2,
      range: '18.5 – 24.9',
      tips: [
        'Maintain your current balanced diet and exercise routine',
        'Aim for 150 minutes of moderate exercise per week',
        'Stay hydrated with 2-3 liters of water daily',
        'Get 7-9 hours of quality sleep for optimal health',
      ],
    };
  } else if (bmi < 30) {
    return {
      value: bmi,
      category: 'Overweight',
      color: 'text-amber-500',
      icon: TrendingUp,
      range: '25.0 – 29.9',
      tips: [
        'Create a moderate caloric deficit of 300-500 kcal per day',
        'Increase daily activity — walk 10,000+ steps per day',
        'Prioritize whole foods and reduce processed food intake',
        'Combine cardio with resistance training for best results',
      ],
    };
  } else {
    return {
      value: bmi,
      category: 'Obese',
      color: 'text-red-500',
      icon: AlertTriangle,
      range: '≥ 30.0',
      tips: [
        'Consult a healthcare professional before starting any diet or exercise program',
        'Start with low-impact exercises like walking, swimming, or cycling',
        'Focus on gradual, sustainable changes rather than rapid weight loss',
        'Track your meals to build awareness of your eating patterns',
      ],
    };
  }
}

function getGaugePosition(bmi: number): number {
  // Map BMI to 0-100% position on gauge
  // 10 = 0%, 15 = ~15%, 18.5 = 28%, 25 = 50%, 30 = 67%, 40 = 100%
  const min = 10;
  const max = 40;
  const clamped = Math.max(min, Math.min(max, bmi));
  return ((clamped - min) / (max - min)) * 100;
}

export default function BMICalculator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unit, setUnit] = useState<Unit>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});

  const validate = (): boolean => {
    const newErrors: { height?: string; weight?: string } = {};

    if (unit === 'metric') {
      const h = parseFloat(height);
      if (!height || isNaN(h) || h <= 0 || h > 300) {
        newErrors.height = 'Enter a valid height (1–300 cm)';
      }
    } else {
      const ft = parseFloat(heightFt);
      const inches = parseFloat(heightIn || '0');
      if (!heightFt || isNaN(ft) || ft < 1 || ft > 9) {
        newErrors.height = 'Enter valid feet (1–9)';
      } else if (inches < 0 || inches > 11) {
        newErrors.height = 'Inches must be 0–11';
      }
    }

    const w = parseFloat(weight);
    if (!weight || isNaN(w) || w <= 0 || w > 500) {
      newErrors.weight = unit === 'metric' ? 'Enter valid weight (1–500 kg)' : 'Enter valid weight (1–1100 lbs)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    let h: number;
    if (unit === 'metric') {
      h = parseFloat(height);
    } else {
      h = (parseFloat(heightFt) * 12 + parseFloat(heightIn || '0'));
    }
    const w = parseFloat(weight);
    const bmi = calculateBMI(h, w, unit);
    setResult(getBMIResult(bmi));
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setHeightFt('');
    setHeightIn('');
    setResult(null);
    setErrors({});
  };

  const categories = [
    { label: 'Underweight', range: '< 18.5', color: 'bg-blue-400' },
    { label: 'Normal', range: '18.5 – 24.9', color: 'bg-emerald-500' },
    { label: 'Overweight', range: '25 – 29.9', color: 'bg-amber-500' },
    { label: 'Obese', range: '≥ 30', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">

          {/* Hero Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container p-10 border-l-4 border-primary relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-headline text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-on-surface">
                    BMI Calculator
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-on-surface-variant mt-1">
                    Body Mass Index Analysis
                  </p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed max-w-2xl mt-4">
                Calculate your Body Mass Index to understand where you stand. BMI is a screening tool — 
                not a diagnostic — that provides a general indication of body composition relative to height.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </motion.section>

          {/* Calculator Section */}
          <section className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-12 lg:col-span-5 bg-surface-container p-10"
            >
              <h3 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8">
                Enter Your Data
              </h3>

              {/* Unit Toggle */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-3">
                  Unit System
                </label>
                <div className="flex bg-surface-low border border-outline overflow-hidden">
                  <button
                    onClick={() => { setUnit('metric'); setHeight(''); setHeightFt(''); setHeightIn(''); setErrors({}); }}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      unit === 'metric'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Metric (cm/kg)
                  </button>
                  <button
                    onClick={() => { setUnit('imperial'); setHeight(''); setErrors({}); }}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      unit === 'imperial'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Imperial (ft/lbs)
                  </button>
                </div>
              </div>

              {/* Height Input */}
              <div className="mb-6">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                  <Ruler className="w-3.5 h-3.5" />
                  Height
                </label>
                {unit === 'metric' ? (
                  <div className="relative">
                    <input
                      id="bmi-height"
                      type="number"
                      value={height}
                      onChange={(e) => { setHeight(e.target.value); setErrors(prev => ({ ...prev, height: undefined })); }}
                      placeholder="175"
                      className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-bold">cm</span>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        id="bmi-height-ft"
                        type="number"
                        value={heightFt}
                        onChange={(e) => { setHeightFt(e.target.value); setErrors(prev => ({ ...prev, height: undefined })); }}
                        placeholder="5"
                        className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-bold">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        id="bmi-height-in"
                        type="number"
                        value={heightIn}
                        onChange={(e) => { setHeightIn(e.target.value); setErrors(prev => ({ ...prev, height: undefined })); }}
                        placeholder="9"
                        className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-bold">in</span>
                    </div>
                  </div>
                )}
                {errors.height && (
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.height}</p>
                )}
              </div>

              {/* Weight Input */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                  <Scale className="w-3.5 h-3.5" />
                  Weight
                </label>
                <div className="relative">
                  <input
                    id="bmi-weight"
                    type="number"
                    value={weight}
                    onChange={(e) => { setWeight(e.target.value); setErrors(prev => ({ ...prev, weight: undefined })); }}
                    placeholder={unit === 'metric' ? '70' : '154'}
                    className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-bold">
                    {unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
                {errors.weight && (
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.weight}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  id="bmi-calculate-btn"
                  onClick={handleCalculate}
                  className="flex-1 py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Calculate BMI
                  <ArrowRight className="w-4 h-4" />
                </button>
                {result && (
                  <button
                    onClick={handleReset}
                    className="px-5 py-5 border border-outline text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Result Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-7 space-y-8"
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface-container p-10 relative overflow-hidden"
                  >
                    {/* BMI Value Display */}
                    <div className="text-center mb-10">
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black text-on-surface-variant block mb-4">
                        Your Body Mass Index
                      </span>
                      <div className="flex items-baseline justify-center gap-3">
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`font-headline text-7xl md:text-8xl font-black italic tracking-tighter ${result.color}`}
                        >
                          {result.value.toFixed(1)}
                        </motion.span>
                        <span className="text-xl font-headline font-bold text-on-surface-variant uppercase italic">
                          BMI
                        </span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 flex items-center justify-center gap-2"
                      >
                        <result.icon className={`w-5 h-5 ${result.color}`} />
                        <span className={`font-headline text-lg font-black uppercase tracking-tight ${result.color}`}>
                          {result.category}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">
                          ({result.range})
                        </span>
                      </motion.div>
                    </div>

                    {/* BMI Gauge */}
                    <div className="mb-6">
                      <div className="relative h-3 bg-surface-low rounded-full overflow-hidden">
                        <div className="absolute inset-0 flex">
                          <div className="flex-1 bg-blue-400/30"></div>
                          <div className="flex-1 bg-emerald-500/30"></div>
                          <div className="flex-1 bg-amber-500/30"></div>
                          <div className="flex-1 bg-red-500/30"></div>
                        </div>
                        <motion.div
                          initial={{ left: '0%' }}
                          animate={{ left: `${getGaugePosition(result.value)}%` }}
                          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg shadow-black/30 border-2 border-surface-low z-10"
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">10</span>
                        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">18.5</span>
                        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">25</span>
                        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">30</span>
                        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">40</span>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-surface-container p-16 flex flex-col items-center justify-center text-center min-h-[320px]"
                  >
                    <div className="w-20 h-20 bg-surface-bright rounded-full flex items-center justify-center mb-6">
                      <Scale className="w-10 h-10 text-on-surface-variant/30" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant mb-2">
                      Enter Your Measurements
                    </p>
                    <p className="text-sm text-on-surface-variant/50 font-light max-w-md">
                      Fill in your height and weight to calculate your BMI and receive personalized health recommendations.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Reference */}
              <div className="bg-surface-container p-8">
                <h4 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6">
                  BMI Categories
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.label}
                      className={`p-4 bg-surface-low border border-outline transition-all ${
                        result?.category === cat.label ? 'ring-1 ring-primary border-primary/50' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 ${cat.color} rounded-full mb-3`}></div>
                      <p className="text-xs font-bold text-on-surface uppercase tracking-tight">{cat.label}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-1">{cat.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* Health Tips */}
          <AnimatePresence>
            {result && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter mb-8">
                  Health Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-surface-container p-6 border-l-2 border-primary/40 flex gap-4 items-start group hover:bg-surface-bright transition-all"
                    >
                      <div className="w-8 h-8 bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-on-surface-variant font-light leading-relaxed group-hover:text-on-surface transition-colors">
                        {tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Info Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-surface-bright p-10 border border-primary/20 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h5 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-3">
                  Important Note
                </h5>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl font-light">
                  BMI is a general screening tool and doesn't account for muscle mass, bone density, 
                  ethnicity, or body composition. Athletes may have a high BMI due to muscle mass. 
                  Always consult a healthcare professional for a comprehensive health assessment.
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
