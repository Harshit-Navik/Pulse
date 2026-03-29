import React from 'react';
import { Link } from 'react-router-dom';

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-8 md:px-12">
        <Link to="/" className="text-3xl font-black text-primary italic font-headline uppercase tracking-tighter">
          PULSE
        </Link>
        
        <div className="hidden md:flex items-center gap-x-10">
          <a href="#features" className="font-headline uppercase tracking-tight text-xs text-primary font-bold">Features</a>
          <a href="#training" className="font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200">Training</a>
          <a href="#pricing" className="font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200">Pricing</a>
          <a href="#community" className="font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200">Community</a>
        </div>

        <Link 
          to="/login"
          className="bg-primary text-on-primary px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 active:scale-95"
        >
          Join Now
        </Link>
      </div>
    </nav>
  );
}
