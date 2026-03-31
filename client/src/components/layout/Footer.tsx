import React from 'react';
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-16 px-12 bg-surface-low border-t border-outline">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <div>
          <img src="/images/logo.svg" alt="App Logo" className="h-10 w-auto opacity-30 grayscale object-contain filter" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Privacy</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Terms</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Support</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Careers</a>
        </div>

        <div className="flex items-center gap-8 mt-2">
          <a href="#" aria-label="Instagram" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Twitter" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" aria-label="YouTube" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="mailto:support@pulse.monolith" aria-label="Email" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        <div className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/50 text-center font-medium mt-4">
          © 2024 PULSE PERFORMANCE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
