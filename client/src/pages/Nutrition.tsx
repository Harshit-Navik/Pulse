import React from 'react';
import { motion } from 'motion/react';
import { 
  Utensils, 
  Flame, 
  Zap, 
  Plus, 
  Search,
  ChevronRight,
  Info,
  Coffee,
  Beef,
  Leaf,
  Scan
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function Nutrition() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 pt-20">
        <div className="p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Summary Header */}
          <section className="grid grid-cols-12 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-7 bg-surface-container p-10 border-l-4 border-primary relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mb-4 block">Remaining Balance</span>
                <div className="flex items-baseline gap-4">
                  <h2 className="font-headline text-7xl font-black text-on-surface tracking-tighter italic">1,240</h2>
                  <span className="text-xl font-headline font-bold text-on-surface-variant uppercase italic">kcal</span>
                </div>
                <div className="mt-10 flex gap-12">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-1">Consumed</p>
                    <p className="text-xl font-headline font-bold text-on-surface">1,160 <span className="text-xs font-normal italic">kcal</span></p>
                  </div>
                  <div className="w-px h-10 bg-outline"></div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-1">Burned</p>
                    <p className="text-xl font-headline font-bold text-on-surface">420 <span className="text-xs font-normal italic">kcal</span></p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-5 bg-surface-container p-10 flex flex-col justify-between"
            >
              <h4 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8">Macro Distribution</h4>
              <div className="space-y-6">
                <MacroBar label="Protein" current={124} target={180} color="bg-primary" />
                <MacroBar label="Carbs" current={85} target={220} color="bg-blue-500" />
                <MacroBar label="Fats" current={42} target={65} color="bg-emerald-500" />
              </div>
            </motion.div>
          </section>

          {/* Meal Log */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter">Meal Log</h3>
              <div className="flex gap-4">
                <button className="p-3 bg-surface-container border border-outline hover:bg-surface-bright transition-all">
                  <Search className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all">
                  Add Entry
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <MealCard 
                time="08:30 AM"
                type="Breakfast"
                items={[
                  { name: "Avocado Toast with Poached Egg", cals: 340 },
                  { name: "Black Coffee", cals: 2 }
                ]}
                totalCals={342}
                icon={Coffee}
              />
              <MealCard 
                time="01:15 PM"
                type="Lunch"
                items={[
                  { name: "Grilled Chicken Quinoa Bowl", cals: 520 },
                  { name: "Roasted Broccoli", cals: 85 }
                ]}
                totalCals={605}
                icon={Beef}
                active
              />
              <div className="p-10 border-2 border-dashed border-outline flex flex-col items-center justify-center group cursor-pointer hover:bg-surface-container/30 transition-all">
                <Plus className="w-8 h-8 text-on-surface-variant mb-4 group-hover:text-primary transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant">Log Dinner</p>
              </div>
            </div>
          </section>

          {/* Pulse Insight */}
          <section className="bg-surface-bright p-10 border border-primary/20 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h5 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-3">Pulse Insight</h5>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl font-light">
                  Your current protein intake is 32% below target for optimal recovery after yesterday's high-volume session. We recommend a 40g casein shake before sleep to prevent muscle catabolism.
                </p>
              </div>
              <button className="ml-auto px-8 py-4 border border-primary text-primary font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap">
                Adjust Plan
              </button>
            </div>
          </section>
        </div>

        <Footer />
      </main>

      {/* FAB */}
      <button className="fixed bottom-12 right-12 w-16 h-16 bg-primary text-on-primary flex items-center justify-center shadow-2xl transition-transform active:scale-90 group z-50 hover:brightness-110">
        <Scan className="w-8 h-8" />
      </button>
    </div>
  );
}

function MacroBar({ label, current, target, color }: any) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-on-surface">{label}</span>
        <span className="text-on-surface-variant">{current}g <span className="text-on-surface-variant/40">/ {target}g</span></span>
      </div>
      <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

function MealCard({ time, type, items, totalCals, icon: Icon, active }: any) {
  return (
    <div className={cn(
      "bg-surface-container p-8 border-l-2 transition-all duration-300 group",
      active ? "border-primary" : "border-transparent hover:border-outline"
    )}>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex gap-8">
          <div className="w-14 h-14 bg-surface-low rounded-sm flex items-center justify-center border border-outline group-hover:bg-primary group-hover:text-white transition-all">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{time}</span>
              <span className="w-1 h-1 bg-outline rounded-full"></span>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">{type}</span>
            </div>
            <h6 className="font-headline text-xl font-black uppercase italic tracking-tight mb-4">{type} Optimization</h6>
            <div className="space-y-2">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 text-sm text-on-surface-variant font-light">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  <span>{item.name}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/40">{item.cals} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col justify-center">
          <p className="text-3xl font-headline font-black text-on-surface italic">{totalCals}</p>
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Total kcal</p>
        </div>
      </div>
    </div>
  );
}
