import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Cpu, Activity, Fingerprint } from 'lucide-react';

const upcomingProducts = [
  {
    id: 1,
    name: "Pulse One (Wearable)",
    description: "Our proprietary biometric smart band designed for elite physiological tracking. Real-time HRV, sleep architecture, and neurological strain analysis.",
    tag: "Prototype",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&fit=crop",
  },
  {
    id: 2,
    name: "Monolith Recovery Pod",
    description: "Sensory deprivation chamber integrated with our biometric API. Automatically adjusts water temperature and salinity based on your metabolic recovery needs.",
    tag: "In Development",
    icon: Fingerprint,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&fit=crop",
  },
  {
    id: 3,
    name: "Neuro-Stim System V2",
    description: "Targeted transcranial direct current stimulation device mapped to your daily protocols, optimizing motor unit recruitment prior to heavy sets.",
    tag: "Coming Soon",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&fit=crop",
  }
];

export default function Products() {
  // Ensure page loads at the top, since links might carry over scroll state
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-on-primary flex flex-col min-w-0 overflow-x-clip">
      <LandingNavbar />
      
      <main className="flex-grow pt-28 sm:pt-32 md:pt-48 pb-20 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
          <div className="text-center mb-24 relative z-10">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary tracking-[0.5em] uppercase text-[10px] font-black"
            >
              Hardware & Innovation
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-headline text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter text-on-background leading-[0.9] mt-6 uppercase italic px-1"
            >
              Upcoming<br/>Products.
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-16 h-1.5 bg-primary mx-auto mt-10 origin-center"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-surface border border-outline/30 flex flex-col group relative overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-surface-bright"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-black">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale contrast-125 brightness-75 mix-blend-luminosity group-hover:scale-105 group-hover:grayscale-[0.5] transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90"></div>
                    
                    {/* Tag */}
                    <div className="absolute top-6 right-6">
                      <span className="inline-block bg-background/80 backdrop-blur-sm border border-outline/50 text-primary px-3 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase">
                        {product.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-10 flex flex-col flex-grow relative z-10">
                    <div className="w-12 h-12 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                      <Icon className="text-primary w-5 h-5" />
                    </div>
                    
                    <h3 className="font-headline text-2xl font-bold tracking-tight mb-4 text-on-surface uppercase italic">
                      {product.name}
                    </h3>
                    
                    <p className="text-on-surface-variant font-light leading-relaxed text-sm mb-10 flex-grow">
                      {product.description}
                    </p>
                    
                    <button className="flex items-center gap-4 text-on-surface font-black uppercase tracking-[0.3em] text-[10px] group-hover:text-primary transition-colors mt-auto">
                      View Specs <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  
                  {/* Subtle top border highlight on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 sm:mt-32 p-6 sm:p-12 text-center border border-outline bg-surface-container relative overflow-hidden"
          >
            <div className="absolute inset-0 kinetic-grid pointer-events-none opacity-20"></div>
            <div className="relative z-10">
              <span className="text-primary tracking-[0.4em] uppercase text-[10px] font-black block mb-4">Beta Testing</span>
              <h3 className="font-headline text-3xl font-bold tracking-tight mb-6 text-on-surface uppercase italic">
                Join the Hardware Cohort
              </h3>
              <p className="text-on-surface-variant max-w-lg mx-auto text-sm leading-relaxed mb-8 font-light">
                Eligible Obsidian tier athletes can apply for early access prototype testing. Connect your current data logs to see if your physiognomy qualifies.
              </p>
              <button className="bg-primary text-on-primary px-10 py-4 font-black tracking-[0.3em] uppercase text-[10px] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
                Apply for Access
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
