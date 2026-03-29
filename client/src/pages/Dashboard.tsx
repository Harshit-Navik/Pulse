import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Heart, 
  Moon, 
  Utensils, 
  ChevronRight, 
  Plus, 
  Info,
  Clock,
  Dumbbell
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 pt-20">
        <div className="p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Hero Header */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl"
            >
              <h3 className="font-headline text-6xl font-extrabold tracking-tighter text-on-surface leading-[0.9] uppercase italic">
                Precision <br/>
                <span className="text-primary">Performance.</span>
              </h3>
              <p className="mt-6 text-on-surface-variant max-w-sm font-body leading-relaxed text-sm border-l border-primary/40 pl-4">
                Today's regimen is optimized for hypertrophy and metabolic endurance. You are 84% through your weekly volume target.
              </p>
            </motion.div>
            
            <div className="flex gap-4">
              <button className="bg-primary text-on-primary px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
                Start Workout
              </button>
              <button className="bg-surface border border-outline text-on-surface px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all active:scale-95">
                View Plan
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main Chart Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-8 bg-surface-container p-8 flex flex-col justify-between border-t border-primary/30 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-2 block">Weekly Volume Target</span>
                  <h4 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">42,850 <span className="text-sm font-normal text-on-surface-variant italic">kg</span></h4>
                </div>
                <TrendingUp className="text-primary w-8 h-8" />
              </div>
              
              <div className="mt-12 h-48 flex items-end justify-between gap-3">
                {[40, 65, 82, 55, 75, 30, 45].map((height, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 relative group/bar transition-all duration-500",
                      i === 2 ? "bg-primary" : "bg-surface-highest"
                    )}
                    style={{ height: `${height}%` }}
                  >
                    {i === 2 && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-primary font-black uppercase">Wed</span>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Goal Progress Ring */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 lg:col-span-4 bg-surface-container p-8 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-surface-highest" cx="96" cy="96" fill="none" r="88" stroke="currentColor" strokeWidth="2" />
                  <circle 
                    className="text-primary" 
                    cx="96" cy="96" fill="none" r="88" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeDasharray="552.92" 
                    strokeDashoffset={552.92 * (1 - 0.75)}
                    strokeLinecap="square"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-headline font-black text-on-surface italic">75%</span>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-primary font-black">Daily Goal</span>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Calories Burned</p>
                <p className="text-2xl font-headline font-bold text-on-surface">1,842 <span className="text-sm font-normal text-on-surface-variant italic">/ 2,400</span></p>
              </div>
            </motion.div>

            {/* Small Metric Cards */}
            <MetricCard label="Resting Heart Rate" value="54" unit="BPM" icon={Heart} color="text-primary" />
            <MetricCard label="Deep Recovery" value="7h 42m" icon={Moon} color="text-blue-400" />
            <MetricCard label="Protein Intake" value="168" unit="g" icon={Utensils} color="text-emerald-400" />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-12 gap-10">
            {/* Active Regimen */}
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <h5 className="font-headline text-2xl font-black tracking-tight uppercase italic">Active Regimen</h5>
                <button className="text-[10px] font-black text-primary hover:text-on-surface transition-colors uppercase tracking-[0.4em]">Archive</button>
              </div>
              
              <div className="space-y-4">
                <RegimenItem 
                  session="Session A"
                  title="Hypertrophy: Posterior Chain"
                  duration="75 min"
                  volume="12.4k vol"
                  image="https://picsum.photos/seed/lift/200/200?grayscale"
                />
                <RegimenItem 
                  session="Session B"
                  title="Structural Integration & Mobility"
                  duration="45 min"
                  impact="Low Impact"
                  image="https://picsum.photos/seed/yoga/200/200?grayscale"
                />
              </div>
            </div>

            {/* Meal Optimization Sidebar */}
            <div className="col-span-12 lg:col-span-5 bg-surface-container p-8 rounded-sm border border-outline relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <h5 className="font-headline text-2xl font-black tracking-tight mb-8 uppercase italic">Meal Optimization</h5>
              
              <div className="space-y-8 relative z-10">
                <MealStep 
                  number="01" 
                  label="Pre-Workout" 
                  description="Complex carb loading with 30g whey isolate. Optimal intake at 14:30."
                  active
                />
                <div className="w-full h-px bg-outline/50"></div>
                <MealStep 
                  number="02" 
                  label="Post-Workout" 
                  description="High protein density (45g) with anti-inflammatory greens and micronutrient complex."
                />
                
                <div className="mt-12 p-5 border border-primary/20 bg-primary/5 rounded-sm">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Metabolic Tip</span>
                  </div>
                  <p className="text-xs text-on-surface-variant italic leading-relaxed">
                    Hydration levels are currently sub-optimal. Aim for 800ml before the evening session to maintain cell volumization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary flex items-center justify-center rounded-sm shadow-2xl hover:brightness-125 hover:scale-105 transition-all active:scale-95 group z-50">
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
  );
}

function MetricCard({ label, value, unit, icon: Icon, color }: any) {
  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container p-6 group hover:border-l-4 hover:border-primary transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 bg-surface-highest rounded-sm group-hover:bg-primary group-hover:text-white transition-all", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.3em]">{label}</span>
          <p className="text-3xl font-headline font-extrabold text-on-surface leading-none mt-1">
            {value} {unit && <span className="text-xs font-normal text-on-surface-variant">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

function RegimenItem({ session, title, duration, volume, impact, image }: any) {
  return (
    <div className="bg-surface-container p-6 flex items-center justify-between group cursor-pointer border-l-2 border-transparent hover:border-primary transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-surface-low rounded-sm overflow-hidden border border-outline">
          <img src={image} alt={title} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-500" />
        </div>
        <div>
          <p className="text-[10px] text-primary font-black tracking-[0.3em] uppercase mb-1">{session}</p>
          <h6 className="font-headline text-lg font-extrabold tracking-tight uppercase italic">{title}</h6>
          <div className="flex gap-4 mt-2">
            <span className="text-[9px] text-on-surface-variant uppercase font-black flex items-center gap-1">
              <Clock className="w-3 h-3" /> {duration}
            </span>
            {volume && (
              <span className="text-[9px] text-on-surface-variant uppercase font-black flex items-center gap-1">
                <Dumbbell className="w-3 h-3" /> {volume}
              </span>
            )}
            {impact && (
              <span className="text-[9px] text-on-surface-variant uppercase font-black flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {impact}
              </span>
            )}
          </div>
        </div>
      </div>
      <ChevronRight className="text-outline group-hover:text-primary transition-colors" />
    </div>
  );
}

function MealStep({ number, label, description, active }: any) {
  return (
    <div className="flex gap-4">
      <div className={cn("font-black text-2xl font-headline italic", active ? "text-primary" : "text-surface-highest")}>
        {number}
      </div>
      <div>
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">{label}</p>
        <p className="text-sm font-medium leading-relaxed text-on-surface">{description}</p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
