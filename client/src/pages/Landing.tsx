import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Dumbbell, Zap, ArrowRight, ChevronDown, Shield, Activity, Heart, Send, Bot, Utensils } from 'lucide-react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: 'What makes Pulse different from other fitness platforms?',
    answer: 'Pulse is built for the high-performance athlete. Unlike generic fitness apps, we integrate biometric data with periodized protocols designed by world-class coaches. Every recommendation is tailored to your unique physiology and training history.',
  },
  {
    question: 'Do I need specific equipment to follow the protocols?',
    answer: 'Our programs range from bodyweight-only mobility flows to fully-equipped gym sessions. Each workout clearly lists required equipment, and you can filter by what you have access to. We adapt to your environment.',
  },
  {
    question: 'How does the biometric sync feature work?',
    answer: 'Pulse connects with major wearable devices to pull real-time heart rate, HRV, sleep quality, and recovery data. This information feeds directly into your personalized protocols, adjusting intensity and volume recommendations daily.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Absolutely. There are no long-term contracts. You can cancel your Pulse Black subscription at any time from your profile settings. Your data remains accessible for 30 days after cancellation.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes. Every new member gets a 14-day full-access trial to Pulse Black. No credit card required during the trial period. Experience the complete protocol library, biometric sync, and AI-driven insights before committing.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-on-primary min-w-0 overflow-x-clip">
      <LandingNavbar />

      <main>
        {/* Hero Section */}
        <section className="relative isolate min-h-[100dvh] min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-20">
          <div className="absolute inset-0 kinetic-grid pointer-events-none opacity-50"></div>

          <div className="container mx-auto px-4 sm:px-8 md:px-24 z-10 flex flex-col items-center text-center max-w-full">
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
              className="font-headline text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter text-on-background leading-[0.9] mb-8 max-w-5xl uppercase px-1"
            >
              Performance is a <span className="italic">ritual.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-on-surface-variant max-w-xl text-base sm:text-lg md:text-xl font-light leading-relaxed mb-12 px-1"
            >
              Access elite data-driven wellness tailored for the high-performance lifestyle. Precision tracking meets disciplined execution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center items-stretch sm:items-center"
            >
              <Link to="/login" className="bg-primary text-on-primary px-8 sm:px-12 py-5 font-black tracking-[0.2em] uppercase text-xs hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20 text-center">
                JOIN THE MONOLITH
              </Link>
              <a href="#pricing" className="border border-outline text-on-surface px-8 sm:px-12 py-5 font-black tracking-[0.2em] uppercase text-xs hover:bg-surface-container transition-all active:scale-95 text-center">
                VIEW PROTOCOLS
              </a>
            </motion.div>
          </div>

          {/* Hero Background Image */}
          <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10 pointer-events-none"></div>
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop"
              alt="Gym Performance Training"
              className="w-full h-full object-cover object-center opacity-50"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 sm:py-32 md:py-48 bg-background relative border-y border-outline/30 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-outline/30 border border-outline/30">
              <FeatureCard
                index="01"
                category="Intelligence"
                title="AI Fitness Assistant"
                description="Smart AI chatbot that provides personalized workout and diet guidance."
                icon={Bot}
              />
              <FeatureCard
                index="02"
                category="Architecture"
                title="Custom Workout Builder"
                description="Users can create, manage, and track their own workout routines with detailed exercises."
                icon={Dumbbell}
              />
              <FeatureCard
                index="03"
                category="Fuel"
                title="Nutrition Tracker"
                description="Add meals, track macros (protein, carbs, fats), and manage personalized diet plans."
                icon={Utensils}
              />
              <FeatureCard
                index="04"
                category="Synthesis"
                title="Personalized Plans"
                description="Automatically generates tailored workout and diet plans based on user input and goals."
                icon={Zap}
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="pricing" className="py-20 sm:py-32 md:py-48 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
            <div className="text-center mb-24">
              <span className="text-primary tracking-[0.5em] uppercase text-[10px] font-black">Our Pricing</span>
              <h2 className="font-headline text-4xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] uppercase italic mt-6">
                Built for the <br />elite.
              </h2>
              <div className="w-16 h-1.5 bg-primary mx-auto mt-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductCard
                tier="Starter"
                price="Free"
                description="Begin your journey with foundational protocols and basic tracking."
                features={['5 Core Protocols', 'Basic Progress Tracking', 'Community Access', 'Weekly Insights']}
                highlighted={false}
              />
              <ProductCard
                tier="Black"
                price="$29/mo"
                description="Full access to the Monolith. Personalized protocols powered by biometric data."
                features={['Unlimited Protocols', 'Biometric Sync', 'AI-Driven Insights', 'Priority Support', 'Custom Meal Plans']}
                highlighted={true}
              />
              <ProductCard
                tier="Obsidian"
                price="$79/mo"
                description="For professional athletes. Private coaching integration and team analytics."
                features={['Everything in Black', '1-on-1 Coach Access', 'Team Dashboard', 'Advanced Analytics', 'Competition Prep']}
                highlighted={false}
              />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="training" className="py-20 sm:py-32 md:py-48">
          <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&h=1000&fit=crop"
                    alt="Gym Discipline"
                    className="w-full max-w-full h-auto grayscale border border-outline shadow-2xl transition-all duration-700 group-hover:grayscale-0"
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
                  Discipline is the <br />ritual.
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
        <section className="py-20 sm:py-32 bg-surface-container border-y border-outline">
          <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
              <StatItem value="10K" suffix="+" label="Elite Members" />
              <StatItem value="98" suffix="%" label="Performance Inc." />
              <StatItem value="24" suffix="/7" label="Biometric Hub" />
              <StatItem value="500" suffix="+" label="Custom Protocols" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 kinetic-grid pointer-events-none opacity-30"></div>
          <div className="container mx-auto px-4 sm:px-8 md:px-24 relative z-10 max-w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 space-y-10">
                <span className="text-primary tracking-[0.5em] uppercase text-[10px] font-black">Start Today</span>
                <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.9] uppercase italic">
                  Your next level <br />awaits.
                </h2>
                <div className="w-16 h-1.5 bg-primary"></div>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-md">
                  Join thousands of athletes who have transformed their performance with data-driven protocols. Start your 14-day free trial — no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="bg-primary text-on-primary px-12 py-5 font-black tracking-[0.2em] uppercase text-xs hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20 text-center">
                    Get Started Free
                  </Link>
                  <a href="#pricing" className="border border-outline text-on-surface px-8 sm:px-12 py-5 font-black tracking-[0.2em] uppercase text-xs hover:bg-surface-container transition-all active:scale-95 text-center">
                    Explore Products
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-surface-container p-5 sm:p-8 border border-outline min-w-0">
                    <div className="w-12 h-12 rounded-sm bg-primary/5 flex items-center justify-center mb-6">
                      <Shield className="text-primary w-6 h-6" />
                    </div>
                    <h4 className="font-headline text-lg font-bold tracking-tight uppercase italic text-on-surface mb-3">Secure Data</h4>
                    <p className="text-on-surface-variant font-light text-sm leading-relaxed">End-to-end encryption on all biometric and personal data.</p>
                  </div>
                  <div className="bg-surface-container p-5 sm:p-8 border border-outline min-w-0">
                    <div className="w-12 h-12 rounded-sm bg-primary/5 flex items-center justify-center mb-6">
                      <Activity className="text-primary w-6 h-6" />
                    </div>
                    <h4 className="font-headline text-lg font-bold tracking-tight uppercase italic text-on-surface mb-3">Live Sync</h4>
                    <p className="text-on-surface-variant font-light text-sm leading-relaxed">Real-time integration with all major wearable devices.</p>
                  </div>
                  <div className="bg-surface-container p-5 sm:p-8 border border-outline min-w-0">
                    <div className="w-12 h-12 rounded-sm bg-primary/5 flex items-center justify-center mb-6">
                      <Heart className="text-primary w-6 h-6" />
                    </div>
                    <h4 className="font-headline text-lg font-bold tracking-tight uppercase italic text-on-surface mb-3">Recovery AI</h4>
                    <p className="text-on-surface-variant font-light text-sm leading-relaxed">Intelligent recovery scheduling based on your HRV data.</p>
                  </div>
                  <div className="bg-surface-container p-5 sm:p-8 border border-outline min-w-0">
                    <div className="w-12 h-12 rounded-sm bg-primary/5 flex items-center justify-center mb-6">
                      <Dumbbell className="text-primary w-6 h-6" />
                    </div>
                    <h4 className="font-headline text-lg font-bold tracking-tight uppercase italic text-on-surface mb-3">500+ Plans</h4>
                    <p className="text-on-surface-variant font-light text-sm leading-relaxed">Periodized programs for every discipline and level.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" className="py-20 sm:py-32 md:py-48 bg-background border-y border-outline/30 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
            <div className="text-center mb-24">
              <span className="text-primary tracking-[0.5em] uppercase text-[10px] font-black">Knowledge Base</span>
              <h2 className="font-headline text-4xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] uppercase italic mt-6">
                Frequently <br />asked.
              </h2>
              <div className="w-16 h-1.5 bg-primary mx-auto mt-8"></div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqData.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-20 sm:py-32 md:py-48 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-8 md:px-24 max-w-full">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 space-y-10">
                <span className="text-primary tracking-[0.5em] uppercase text-[10px] font-black">Get In Touch</span>
                <h2 className="font-headline text-4xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] uppercase italic">
                  Contact <br />us.
                </h2>
                <div className="w-16 h-1.5 bg-primary"></div>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-md">
                  Have questions about our protocols, pricing, or partnership opportunities? Our performance team is here to help.
                </p>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2">Email</p>
                    <p className="text-on-surface font-headline font-bold text-lg uppercase italic"> pulse.trackit@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2">Response Time</p>
                    <p className="text-on-surface font-headline font-bold text-lg uppercase italic">Under 24 Hours</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="bg-surface-container p-6 sm:p-10 md:p-12 border border-outline space-y-8 min-w-0"
                >
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Alexander Thorne"
                      className="w-full bg-surface-low border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="athlete@monolith.com"
                      className="w-full bg-surface-low border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Tell us about your goals..."
                      className="w-full bg-surface-low border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 sm:py-32 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 kinetic-grain pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-8 md:px-24 text-center relative z-10 max-w-full">
            <h2 className="font-headline text-4xl sm:text-5xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.8] uppercase italic px-1">
              The journey <br />begins here.
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg mb-16 font-light">
              Acceptance into the Monolith is selective. Secure your spot in the next cohort of high-performance athletes.
            </p>

            <div className="max-w-xl mx-auto w-full px-1">
              <form className="flex flex-col sm:flex-row gap-0 shadow-2xl">
                <input
                  type="email"
                  placeholder="ENTER EMAIL"
                  className="w-full min-w-0 bg-surface-container border border-outline sm:border-y sm:border-l sm:border-r-0 px-4 sm:px-8 py-5 text-xs tracking-[0.3em] font-bold focus:ring-1 focus:ring-primary focus:outline-none text-on-surface placeholder:text-on-surface-variant/30"
                />
                <button type="button" className="bg-primary text-on-primary px-8 sm:px-12 py-5 font-black tracking-[0.3em] uppercase text-xs hover:brightness-110 transition-all sm:whitespace-nowrap active:scale-95 min-h-11 touch-manipulation">
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
    <div className="bg-surface p-8 sm:p-12 flex flex-col justify-between min-h-[350px] lg:min-h-[420px] group hover:bg-surface-bright transition-all duration-500 cursor-default">
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
    <div className="space-y-3 min-w-0 px-1">
      <div className="font-headline text-3xl sm:text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter uppercase italic break-words">
        {value}<span className="text-primary not-italic">{suffix}</span>
      </div>
      <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.4em] font-black">{label}</div>
    </div>
  );
}

interface ProductCardProps {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

function ProductCard({ tier, price, description, features, highlighted }: ProductCardProps) {
  return (
    <div className={`bg-surface p-8 sm:p-12 flex flex-col justify-between border transition-all duration-500 group hover:bg-surface-bright min-w-0 ${highlighted ? 'border-primary/40 relative' : 'border-outline/30'}`}>
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
      )}
      <div>
        {highlighted && (
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 text-[9px] font-black tracking-[0.3em] uppercase mb-8 border border-primary/20">Most Popular</span>
        )}
        <span className="text-primary tracking-[0.4em] uppercase text-[10px] font-black block mb-4">{tier}</span>
        <div className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter uppercase italic mb-4">
          {price}
        </div>
        <p className="text-on-surface-variant font-light leading-relaxed text-sm mb-10">{description}</p>

        <ul className="space-y-4 mb-12">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-on-surface-variant font-light">
              <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/register"
        className={`w-full py-5 font-black text-[10px] uppercase tracking-[0.3em] text-center transition-all active:scale-95 block ${highlighted
          ? 'bg-primary text-on-primary hover:brightness-110 shadow-lg shadow-primary/20'
          : 'border border-outline text-on-surface hover:bg-surface-bright'
          }`}
      >
        {highlighted ? 'Start Free Trial' : 'Get Started'}
      </Link>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline/30 bg-surface transition-all duration-300 hover:bg-surface-bright">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start sm:items-center justify-between gap-3 p-5 sm:p-8 text-left touch-manipulation min-h-11"
      >
        <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
          <span className="text-primary font-headline text-xl font-black italic flex-shrink-0 pt-0.5 sm:pt-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-headline text-sm md:text-base font-bold text-on-surface uppercase tracking-tight text-left break-words">{question}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-on-surface-variant flex-shrink-0 ml-1 sm:ml-4 mt-0.5 sm:mt-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pl-14 sm:pl-20">
          <p className="text-on-surface-variant font-light leading-relaxed text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}
