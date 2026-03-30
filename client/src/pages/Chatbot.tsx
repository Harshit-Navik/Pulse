import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  User,
  Loader2,
  Zap,
  Dumbbell,
  Utensils,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Clock,
  Target,
  Flame,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { dietAPI, workoutAPI } from '@/lib/api';

const API_BASE = 'http://localhost:5000/api/chat';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  options?: string[];
  plan?: Plan | null;
}

interface Plan {
  summary: string;
  dailyCalories: number;
  macros: { protein: string; carbs: string; fats: string };
  diet: { meal: string; time: string; items: string[]; calories: number; protein?: number; carbs?: number; fats?: number }[];
  workoutTag?: string;
  workoutDifficulty?: string;
  workoutDuration?: string;
  workout: { exercise: string; sets: number; reps: string; rest: string }[];
  tips: string[];
}

type Step = 'age' | 'gender' | 'height' | 'weight' | 'goal' | 'activity' | 'diet' | 'done';

const STEPS: { key: Step; question: string; options?: string[] }[] = [
  { key: 'age', question: "Let's build your personalized fitness plan! First, how old are you?" },
  { key: 'gender', question: 'What is your gender?', options: ['Male', 'Female', 'Other'] },
  { key: 'height', question: 'What is your height in centimeters (cm)?' },
  { key: 'weight', question: 'What is your weight in kilograms (kg)?' },
  {
    key: 'goal',
    question: 'What is your primary fitness goal?',
    options: ['Fat Loss', 'Muscle Gain', 'Maintenance', 'General Fitness'],
  },
  {
    key: 'activity',
    question: 'How would you describe your activity level?',
    options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'],
  },
  {
    key: 'diet',
    question: 'Any dietary preference?',
    options: ['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'],
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function Chatbot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState<Record<string, string>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const addBotMessage = (text: string, options?: string[], plan?: Plan | null) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'bot',
          text,
          timestamp: new Date(),
          options,
          plan,
        },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleStart = () => {
    setIsStarted(true);
    const step = STEPS[0];
    addBotMessage(
      `Hey there! 👋 I'm your Pulse AI Coach. ${step.question}`,
      step.options
    );
  };

  const validateInput = (step: Step, value: string): string | null => {
    const num = parseFloat(value);
    switch (step) {
      case 'age':
        if (isNaN(num) || num < 10 || num > 100) return 'Please enter a valid age (10–100)';
        break;
      case 'height':
        if (isNaN(num) || num < 100 || num > 250) return 'Please enter a valid height (100–250 cm)';
        break;
      case 'weight':
        if (isNaN(num) || num < 20 || num > 300) return 'Please enter a valid weight (20–300 kg)';
        break;
    }
    return null;
  };

  const processUserInput = async (value: string) => {
    const step = STEPS[currentStep];
    if (!step) return;

    // Validate
    const error = validateInput(step.key, value);
    if (error) {
      addBotMessage(`⚠️ ${error}`, step.options);
      return;
    }

    // Store answer
    const newUserData = { ...userData, [step.key]: value };
    setUserData(newUserData);

    const nextStepIndex = currentStep + 1;

    if (nextStepIndex < STEPS.length) {
      // Ask next question
      const nextStep = STEPS[nextStepIndex];
      setCurrentStep(nextStepIndex);
      addBotMessage(
        `Got it! ${nextStep.question}`,
        nextStep.options
      );
    } else {
      // All data collected — generate plan
      setCurrentStep(nextStepIndex);
      addBotMessage(
        " Awesome! I have everything I need. Let me generate your personalized plan..."
      );

      // Call the server
      setTimeout(() => generatePlan(newUserData), 1500);
    }
  };

  const generatePlan = async (data: Record<string, string>) => {
    setIsTyping(true);
    try {
      const response = await fetch(`${API_BASE}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          goal: data.goal,
          activityLevel: data.activity,
          dietaryPreference: data.diet,
        }),
      });

      const result = await response.json();
      const plan = result.plan;

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'bot',
          text: plan.summary || 'Here is your personalized plan!',
          timestamp: new Date(),
          plan,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'bot',
          text: " I couldn't reach the server. Make sure the Pulse backend is running on port 5000. You can start it with `npm run dev` in the /server directory.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    const value = input.trim();
    if (!value || isTyping) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role: 'user', text: value, timestamp: new Date() },
    ]);
    setInput('');
    processUserInput(value);
  };

  const handleOptionClick = (option: string) => {
    if (isTyping) return;
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role: 'user', text: option, timestamp: new Date() },
    ]);
    processUserInput(option);
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentStep(0);
    setUserData({});
    setIsStarted(false);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDone = currentStep >= STEPS.length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-5xl mx-auto">
          {/* Chat Container */}
          <div className="bg-surface-container border border-outline flex flex-col" style={{ height: 'calc(100vh - 8rem)', minHeight: '400px' }}>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-outline flex items-center justify-between bg-surface-low/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface-low"></span>
                </div>
                <div>
                  <h2 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-on-surface">
                    Pulse AI Coach
                  </h2>
                  <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">
                    Diet & Workout Generator
                  </p>
                </div>
              </div>
              {isStarted && (
                <button
                  onClick={handleReset}
                  className="p-2.5 border border-outline text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all"
                  title="Start Over"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255, 59, 59, 0.02) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            >
              {!isStarted ? (
                /* Welcome Screen */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                    <Bot className="w-12 h-12 text-primary" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-primary/20 rounded-full"
                    />
                  </div>
                  <h3 className="font-headline text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-on-surface mb-4">
                    AI Coach
                  </h3>
                  <p className="text-sm text-on-surface-variant font-light leading-relaxed max-w-md mb-10">
                    Get a personalized diet and workout plan tailored to your body, goals, and lifestyle.
                    I'll ask you a few quick questions—then generate your plan instantly.
                  </p>

                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 w-full max-w-md">
                    {[
                      { icon: Utensils, label: 'Diet Plan' },
                      { icon: Dumbbell, label: 'Workouts' },
                      { icon: Target, label: 'Goal Tracking' },
                    ].map((item) => (
                      <div key={item.label} className="bg-surface-low border border-outline p-4 text-center">
                        <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    id="chatbot-start-btn"
                    onClick={handleStart}
                    className="px-12 py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] flex items-center gap-3"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start My Plan
                  </button>
                </motion.div>
              ) : (
                /* Chat Messages */
                <>
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'bot' && (
                          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}

                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                          <div
                            className={`px-5 py-4 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary text-on-primary font-medium'
                                : 'bg-surface-low border border-outline text-on-surface font-light'
                              }`}
                          >
                            {msg.text}
                          </div>

                          {/* Quick Reply Options */}
                          {msg.role === 'bot' && msg.options && !isDone && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {msg.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => handleOptionClick(opt)}
                                  disabled={isTyping}
                                  className="px-4 py-2 bg-surface-bright border border-outline text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all disabled:opacity-50"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Generated Plan Card */}
                          {msg.plan && <PlanCard plan={msg.plan} />}

                          <span className="text-[8px] text-on-surface-variant/40 font-medium uppercase tracking-widest mt-2 block">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {msg.role === 'user' && (
                          <div className="w-8 h-8 bg-surface-bright flex items-center justify-center flex-shrink-0 mt-1 order-2">
                            <User className="w-4 h-4 text-on-surface-variant" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-surface-low border border-outline px-5 py-4 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-2 h-2 bg-primary/60 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </>
              )}

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollBtn && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToBottom}
                    className="sticky bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-surface-bright border border-outline rounded-full flex items-center justify-center shadow-lg z-10"
                  >
                    <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input Bar */}
            {isStarted && !isDone && (
              <div className="px-6 py-4 border-t border-outline bg-surface-low/50">
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    id="chatbot-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      STEPS[currentStep]?.options
                        ? 'Choose an option above or type your answer...'
                        : 'Type your answer...'
                    }
                    disabled={isTyping}
                    className="flex-1 bg-surface-container border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/30 disabled:opacity-50"
                  />
                  <button
                    id="chatbot-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-4 bg-primary text-on-primary hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Done State Input */}
            {isDone && (
              <div className="px-6 py-4 border-t border-outline bg-surface-low/50">
                <button
                  onClick={handleReset}
                  className="w-full py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <RotateCcw className="w-4 h-4" />
                  Generate New Plan
                </button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

/* ─── Plan Card Component ─── */
function PlanCard({ plan }: { plan: Plan }) {
  const [savingDiet, setSavingDiet] = useState(false);
  const [dietSaved, setDietSaved] = useState(false);
  const [dietError, setDietError] = useState('');

  const [savingWorkout, setSavingWorkout] = useState(false);
  const [workoutSaved, setWorkoutSaved] = useState(false);
  const [workoutError, setWorkoutError] = useState('');

  const handleSaveDiet = async () => {
    setSavingDiet(true);
    setDietError('');
    try {
      await dietAPI.create({
        title: "AI Custom Diet Plan",
        description: plan.summary,
        meals: plan.diet.map(m => ({
          name: m.meal,
          calories: m.calories || 0,
          protein: m.protein || 0,
          carbs: m.carbs || 0,
          fats: m.fats || 0,
          time: m.time || "",
          notes: m.items.join(", ")
        }))
      });
      setDietSaved(true);
    } catch (err: any) {
      setDietError(err.message || 'Failed to save diet plan');
    } finally {
      setSavingDiet(false);
    }
  };

  const handleSaveWorkout = async () => {
    setSavingWorkout(true);
    setWorkoutError('');
    try {
      const tag = plan.workoutTag || "HYBRID";
      const imageMap: Record<string, string> = {
        STRENGTH: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
        CARDIO: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1000&auto=format&fit=crop",
        MOBILITY: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
        HYBRID: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
        RECOVERY: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
      };

      await workoutAPI.create({
        title: "AI Custom Workout Plan",
        tag: tag,
        difficulty: plan.workoutDifficulty || "BEGINNER",
        duration: plan.workoutDuration || "45 MINS",
        image: imageMap[tag] || imageMap["HYBRID"],
        description: plan.summary,
        exercises: plan.workout.map(ex => ({
          name: ex.exercise,
          sets: ex.sets,
          reps: String(ex.reps),
          rest: ex.rest || "-"
        }))
      });
      setWorkoutSaved(true);
    } catch (err: any) {
      setWorkoutError(err.message || 'Failed to save workout plan');
    } finally {
      setSavingWorkout(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 space-y-4"
    >
      {/* Macros Overview */}
      <div className="bg-surface-container border border-outline p-6">
        <div className="flex items-center gap-2 mb-5">
          <Flame className="w-4 h-4 text-primary" />
          <h4 className="font-headline text-sm font-black uppercase tracking-[0.2em]">
            Daily Target: {plan.dailyCalories} kcal
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Protein', value: plan.macros.protein, color: 'text-primary' },
            { label: 'Carbs', value: plan.macros.carbs, color: 'text-blue-400' },
            { label: 'Fats', value: plan.macros.fats, color: 'text-emerald-400' },
          ].map((m) => (
            <div key={m.label} className="bg-surface-low p-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                {m.label}
              </p>
              <p className={`font-headline text-lg font-black ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Diet Plan */}
      <div className="bg-surface-container border border-outline p-6">
        <div className="flex items-center gap-2 mb-5">
          <Utensils className="w-4 h-4 text-primary" />
          <h4 className="font-headline text-sm font-black uppercase tracking-[0.2em]">
            Diet Plan
          </h4>
        </div>
        <div className="space-y-3">
          {plan.diet.map((meal, i) => (
            <div key={i} className="bg-surface-low p-4 border-l-2 border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-on-surface uppercase tracking-tight">
                  {meal.meal}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-on-surface-variant font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {meal.time}
                  </span>
                  <span className="text-[9px] text-primary font-black">{meal.calories} kcal</span>
                </div>
              </div>
              <ul className="space-y-1">
                {meal.items.map((item, j) => (
                  <li key={j} className="text-xs text-on-surface-variant font-light flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary/50 rounded-full flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-outline flex items-center justify-between">
          <div className="text-[10px] text-on-surface-variant max-w-[60%] leading-relaxed">
            {dietError && <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {dietError}</span>}
            {dietSaved && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Saved to My Diet Plans!</span>}
          </div>
          <button
            onClick={handleSaveDiet}
            disabled={savingDiet || dietSaved}
            className={`px-4 py-2 border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              dietSaved
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 opacity-100 cursor-not-allowed'
                : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/40 active:scale-95 disabled:opacity-50'
            }`}
          >
            {savingDiet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : dietSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {savingDiet ? 'Saving...' : dietSaved ? 'Saved' : 'Save Diet Plan'}
          </button>
        </div>
      </div>

      {/* Workout Plan */}
      <div className="bg-surface-container border border-outline p-6">
        <div className="flex items-center gap-2 mb-5">
          <Dumbbell className="w-4 h-4 text-primary" />
          <h4 className="font-headline text-sm font-black uppercase tracking-[0.2em]">
            Workout Plan
          </h4>
        </div>
        <div className="space-y-2">
          {plan.workout.map((ex, i) => (
            <div key={i} className="flex items-center justify-between bg-surface-low p-3 gap-4">
              <span className="text-xs font-bold text-on-surface uppercase tracking-tight flex-1 min-w-0 truncate">
                {ex.exercise}
              </span>
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <span className="text-[9px] text-on-surface-variant font-medium whitespace-nowrap">
                  {ex.sets} × {ex.reps}
                </span>
                <span className="text-[9px] text-on-surface-variant/60 font-medium w-12 text-right whitespace-nowrap">
                  Rest {ex.rest}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-outline flex items-center justify-between">
          <div className="text-[10px] text-on-surface-variant max-w-[60%] leading-relaxed">
            {workoutError && <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {workoutError}</span>}
            {workoutSaved && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Saved to My Workout Plans!</span>}
          </div>
          <button
            onClick={handleSaveWorkout}
            disabled={savingWorkout || workoutSaved}
            className={`px-4 py-2 border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              workoutSaved
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 opacity-100 cursor-not-allowed'
                : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/40 active:scale-95 disabled:opacity-50'
            }`}
          >
            {savingWorkout ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : workoutSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {savingWorkout ? 'Saving...' : workoutSaved ? 'Saved' : 'Save Workout'}
          </button>
        </div>
      </div>

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <div className="bg-surface-bright border border-primary/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <h4 className="font-headline text-sm font-black uppercase tracking-[0.2em]">
              Pro Tips
            </h4>
          </div>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-xs text-on-surface-variant font-light flex items-center gap-3">
                <span className="w-5 h-5 bg-primary/10 flex items-center justify-center flex-shrink-0 text-[8px] font-black text-primary">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
