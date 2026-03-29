import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Target, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight,
  Camera,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Profile Header */}
          <section className="bg-surface-container p-8 md:p-12 border border-outline relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-sm overflow-hidden border-2 border-primary/20 p-1">
                  <img 
                    src="https://picsum.photos/seed/athlete/400/400" 
                    alt="Profile" 
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-primary text-on-primary rounded-sm shadow-xl hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h2 className="font-headline text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-on-surface">{user?.name || 'Julian Pierce'}</h2>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.3em] border border-primary/20">{user?.tier || 'Elite'} Tier</span>
                </div>
                <p className="text-on-surface-variant max-w-md font-light leading-relaxed mb-8">
                  High-performance athlete focused on metabolic efficiency and structural integration. Member since 2022.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8">
                  <ProfileStat label="Consistency" value="94%" />
                  <ProfileStat label="Workouts" value="142" />
                  <ProfileStat label="Level" value="42" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all">
                  Edit Profile
                </button>
                <button className="px-8 py-4 border border-outline text-on-surface font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all">
                  Share Stats
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          </section>

          <div className="grid grid-cols-12 gap-10">
            {/* Account Settings */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-headline text-2xl font-black uppercase italic tracking-tight">Account Security</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileInput id="profile-name" label="Full Name" value={user?.name || 'Julian Pierce'} />
                  <ProfileInput id="profile-email" label="Email Address" value={user?.email || 'j.pierce@monolith.com'} />
                  <ProfileInput id="profile-password" label="Password" value="••••••••••••" type="password" />
                  <ProfileInput id="profile-phone" label="Phone Number" value="+1 (555) 0123-4567" />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="font-headline text-2xl font-black uppercase italic tracking-tight">Active Goals</h3>
                </div>
                <div className="space-y-4">
                  <GoalItem title="Primary Goal" value="Hypertrophy & Power" status="In Progress" />
                  <GoalItem title="Weekly Rhythm" value="5 Sessions / Week" status="On Track" />
                  <GoalItem title="Metabolic Target" value="12% Body Fat" status="84% Complete" />
                </div>
              </section>
            </div>

            {/* Sidebar Settings */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <section className="bg-surface-container p-8 border border-outline">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="font-headline text-xl font-black uppercase italic tracking-tight">Subscription</h3>
                  </div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">Active</span>
                </div>
                <div className="p-6 bg-surface-low border border-primary/20 rounded-sm mb-6">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Current Plan</p>
                  <p className="text-2xl font-headline font-black text-on-surface uppercase italic mb-4">Pulse Black</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> Personalized Protocols
                    </li>
                    <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> Biometric Sync
                    </li>
                    <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> Priority Support
                    </li>
                  </ul>
                </div>
                <button className="w-full py-4 border border-outline text-on-surface font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all">
                  Manage Billing
                </button>
              </section>

              <section className="bg-surface-container p-8 border border-outline">
                <h3 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8">Global Preferences</h3>
                <div className="space-y-6">
                  <ToggleItem label="Biometric Sync" active />
                  <ToggleItem label="Dark Mode" active />
                  <ToggleItem label="Push Notifications" />
                  <ToggleItem label="Public Profile" />
                </div>
                <div className="mt-12 pt-8 border-t border-outline space-y-4">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sign Out</span>
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full flex items-center justify-between text-on-surface-variant hover:text-primary transition-colors group">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Delete Account</span>
                    <Trash2 className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

interface ProfileStatProps {
  label: string;
  value: string;
}

function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">{label}</span>
      <span className="text-2xl font-headline font-black text-on-surface italic">{value}</span>
    </div>
  );
}

interface ProfileInputProps {
  id: string;
  label: string;
  value: string;
  type?: string;
}

function ProfileInput({ id, label, value, type = "text" }: ProfileInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">{label}</label>
      <input 
        id={id}
        type={type} 
        defaultValue={value} 
        className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all"
      />
    </div>
  );
}

interface GoalItemProps {
  title: string;
  value: string;
  status: string;
}

function GoalItem({ title, value, status }: GoalItemProps) {
  return (
    <div className="bg-surface-container p-6 flex items-center justify-between border border-outline hover:border-primary/20 transition-all cursor-pointer group">
      <div>
        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">{title}</p>
        <p className="text-lg font-headline font-black text-on-surface uppercase italic">{value}</p>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[9px] font-black text-primary uppercase tracking-widest">{status}</span>
        <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
      </div>
    </div>
  );
}

interface ToggleItemProps {
  label: string;
  active?: boolean;
}

function ToggleItem({ label, active }: ToggleItemProps) {
  const [isActive, setIsActive] = useState(active || false);
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">{label}</span>
      <button 
        onClick={() => setIsActive(!isActive)}
        className={cn(
          "w-10 h-5 rounded-full relative transition-all duration-300",
          isActive ? "bg-primary" : "bg-surface-highest"
        )}
      >
        <div className={cn(
          "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
          isActive ? "right-1" : "left-1"
        )}></div>
      </button>
    </div>
  );
}
