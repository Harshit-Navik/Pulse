import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-16 px-12 bg-surface-low border-t border-outline">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <div className="text-2xl font-black text-on-surface/10 font-headline italic uppercase tracking-[0.4em]">PULSE</div>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Privacy</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Terms</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Support</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Careers</a>
        </div>

        <div className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/50 text-center font-medium">
          © 2024 PULSE PERFORMANCE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
