import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Dumbbell, Zap, ArrowRight } from 'lucide-react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-on-primary">
      <LandingNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 kinetic-grid pointer-events-none opacity-50"></div>
          
          <div className="container mx-auto px-8 md:px-24 z-10 flex flex-col items-center text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-primary tracking-[0.6em] uppercase text-[10px] mb-8 font-black"
            >
              Establishing Connection
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter text-on-background leading-[0.9] mb-8 max-w-5xl uppercase"
            >
              Performance is a <span className="italic">ritual.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-on-surface-variant max-w-xl text-lg md:text-xl font-light leading-relaxed mb-12"
            >
              Access elite data-driven wellness tailored for the high-performance lifestyle. Precision tracking meets disciplined execution.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/login" className="bg-primary text-on-primary px-12 py-5 font-black tracking-[0.2em] uppercase text-xs hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
                JOIN THE MONOLITH
              </Link>
              <button className="border border-outline text-on-surface px-12 py-5 font-black tracking-[0.2em] uppercase text-xs hover:bg-surface-container transition-all active:scale-95">
                VIEW PROTOCOLS
              </button>
            </motion.div>
          </div>

          {/* Hero Background Image */}
          <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
            <img 
              src="https://picsum.photos/seed/performance/1920/1080?grayscale" 
              alt="Performance background" 
              className="w-full h-full object-cover contrast-125 brightness-50"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 md:py-48 bg-background relative border-y border-outline/30">
          <div className="container mx-auto px-8 md:px-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline/30 border border-outline/30">
              <FeatureCard 
                index="01" 
                category="Logic" 
                title="Precision Performance" 
                description="Continuous biometric integration filtering every heartbeat into actionable performance data."
                icon={Fingerprint}
              />
              <FeatureCard 
                index="02" 
                category="Power" 
                title="Elite Regimens" 
                description="Workout programs designed by world-class coaches, optimized for your specific genetic profile."
                icon={Dumbbell}
              />
              <FeatureCard 
                index="03" 
                category="Balance" 
                title="Metabolic Recovery" 
                description="Surgical precision in nutrition and restorative sleep protocols to ensure peak state daily."
                icon={Zap}
              />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-32 md:py-48">
          <div className="container mx-auto px-8 md:px-24">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <img 
                    src="https://picsum.photos/seed/discipline/800/1000?grayscale" 
                    alt="Discipline" 
                    className="w-full grayscale border border-outline shadow-2xl transition-all duration-700 group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary p-8 flex items-center justify-center border border-primary/20 hidden md:flex">
                    <span className="text-on-primary font-headline text-4xl font-black italic">EST.</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 space-y-10">
                <span className="text-primary tracking-[0.5em] uppercase text-[10px] font-black">The Philosophy</span>
                <h2 className="font-headline text-4xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] uppercase italic">
                  Discipline is the <br/>ritual.
                </h2>
                <div className="w-16 h-1.5 bg-primary"></div>
                <div className="space-y-6">
                  <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                    Pulse is not a fitness app. It is a commitment to the self. We believe that true performance stems from consistency and the elimination of the unnecessary.
                  </p>
                  <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                    By mapping your data to our protocols, we remove the guesswork, leaving only the execution. Every session contributes to the architecture of the Kinetic Monolith.
                  </p>
                </div>
                <button className="group flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-xs">
                  Read the Manifesto <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 bg-surface-container border-y border-outline">
          <div className="container mx-auto px-8 md:px-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <StatItem value="10K" suffix="+" label="Elite Members" />
              <StatItem value="98" suffix="%" label="Performance Inc." />
              <StatItem value="24" suffix="/7" label="Biometric Hub" />
              <StatItem value="500" suffix="+" label="Custom Protocols" />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-48 relative overflow-hidden">
          <div className="absolute inset-0 kinetic-grain pointer-events-none"></div>
          <div className="container mx-auto px-8 md:px-24 text-center relative z-10">
            <h2 className="font-headline text-5xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.8] uppercase italic">
              The journey <br/>begins here.
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg mb-16 font-light">
              Acceptance into the Monolith is selective. Secure your spot in the next cohort of high-performance athletes.
            </p>
            
            <div className="max-w-xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-0 shadow-2xl">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL" 
                  className="w-full bg-surface-container border-outline border-y border-l px-8 py-5 text-xs tracking-[0.3em] font-bold focus:ring-1 focus:ring-primary focus:outline-none text-on-surface placeholder:text-on-surface-variant/30"
                />
                <button className="bg-primary text-on-primary px-12 py-5 font-black tracking-[0.3em] uppercase text-xs hover:brightness-110 transition-all whitespace-nowrap active:scale-95">
                  JOIN NOW
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ index, category, title, description, icon: Icon }: any) {
  return (
    <div className="bg-surface p-12 flex flex-col justify-between aspect-square group hover:bg-surface-bright transition-all duration-500 cursor-default">
      <div>
        <div className="w-12 h-12 rounded-sm bg-primary/5 flex items-center justify-center mb-10 group-hover:bg-primary/10 transition-colors">
          <Icon className="text-primary w-6 h-6" />
        </div>
        <h3 className="font-headline text-2xl font-bold tracking-tight mb-4 text-on-surface uppercase italic">{title}</h3>
        <p className="text-on-surface-variant font-light leading-relaxed text-sm">{description}</p>
      </div>
      <div className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">
        {index} / {category}
      </div>
    </div>
  );
}

function StatItem({ value, suffix, label }: any) {
  return (
    <div className="space-y-3">
      <div className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter uppercase italic">
        {value}<span className="text-primary not-italic">{suffix}</span>
      </div>
      <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.4em] font-black">{label}</div>
    </div>
  );
}
