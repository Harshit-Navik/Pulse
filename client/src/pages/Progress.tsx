import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Activity, 
  Calendar, 
  ChevronRight, 
  Award,
  Clock,
  Flame,
  Dumbbell
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function Progress() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 pt-20">
        <div className="p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-headline text-6xl font-black italic tracking-tighter text-on-surface leading-none uppercase">Performance Metrics</h2>
              <p className="mt-6 text-on-surface-variant max-w-md font-light leading-relaxed">
                Your biological data mapped over time. Analyzing trends in strength, endurance, and systemic recovery.
              </p>
            </motion.div>
            
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-surface border border-outline text-on-surface font-black text-[10px] tracking-[0.3em] uppercase hover:bg-surface-bright transition-all">
                Export Data
              </button>
              <button className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] tracking-[0.3em] uppercase hover:brightness-110 transition-all">
                Generate Report
              </button>
            </div>
          </section>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickStat label="Total Workouts" value="142" icon={Dumbbell} trend="+12%" />
            <QuickStat label="Avg. Duration" value="68m" icon={Clock} trend="-2m" />
            <QuickStat label="Total Calories" value="42.8k" icon={Flame} trend="+5.4k" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-12 gap-8">
            {/* Weight/Body Comp Chart */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container p-10 border border-outline relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">Weight Progress</h4>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">Last 30 Days</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Body Fat %</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between relative">
                {/* Mock Line Chart */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0,150 L100,140 L200,145 L300,130 L400,135 L500,120 L600,125 L700,110 L800,115" 
                    fill="none" 
                    stroke="#FF3B3B" 
                    strokeWidth="3"
                    className="w-full"
                  />
                </svg>
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-on-surface"></div>)}
                </div>
              </div>
              <div className="flex justify-between mt-6 px-2">
                {['Sep 23', 'Sep 30', 'Oct 07', 'Oct 14', 'Oct 21', 'Oct 28'].map(date => (
                  <span key={date} className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{date}</span>
                ))}
              </div>
            </div>

            {/* Consistency Card */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container p-10 border border-outline flex flex-col justify-between">
              <div>
                <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">Consistency</h4>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">Workout Frequency</p>
              </div>
              
              <div className="flex flex-col gap-4 mt-10">
                <div className="flex items-end gap-2 h-32">
                  {[30, 50, 80, 40, 90, 60, 70].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1 }}
                      className={cn("flex-1 rounded-sm", i === 4 ? "bg-primary" : "bg-surface-highest")}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-surface-low border border-outline/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Milestone</p>
                    <p className="text-sm font-bold text-on-surface">12 Week Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <section>
            <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter mb-8">Recent Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SessionCard title="Upper Body Hypertrophy" date="Yesterday" duration="72m" volume="14.2k" />
              <SessionCard title="Zone 2 Conditioning" date="2 Days Ago" duration="45m" volume="N/A" />
              <SessionCard title="Lower Body Power" date="4 Days Ago" duration="65m" volume="18.5k" />
              <SessionCard title="Active Recovery" date="5 Days Ago" duration="30m" volume="N/A" />
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-surface-container p-8 border border-outline group hover:border-primary/40 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-surface-low border border-outline group-hover:bg-primary group-hover:text-white transition-all">
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm",
          trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
        )}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">{label}</p>
      <p className="text-4xl font-headline font-black text-on-surface italic">{value}</p>
    </div>
  );
}

function SessionCard({ title, date, duration, volume }: any) {
  return (
    <div className="bg-surface-container p-6 border border-outline hover:bg-surface-bright transition-all cursor-pointer group">
      <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mb-2">{date}</p>
      <h5 className="font-headline text-lg font-black uppercase italic tracking-tight mb-6 leading-tight group-hover:text-primary transition-colors">{title}</h5>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{duration}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{volume}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
      </div>
    </div>
  );
}
