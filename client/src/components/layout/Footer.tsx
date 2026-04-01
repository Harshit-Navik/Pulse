import React from 'react';
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  /** Smaller padding and gaps — for dense layouts (e.g. chat page). */
  variant?: 'default' | 'compact';
  className?: string;
}

export function Footer({ variant = 'default', className }: FooterProps) {
  const compact = variant === 'compact';

  return (
    <footer
      className={cn(
        'w-full bg-surface-low border-t border-outline',
        compact ? 'py-6 px-4 md:px-8' : 'py-16 px-12',
        className
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto flex flex-col items-center',
          compact ? 'gap-4' : 'gap-10'
        )}
      >
        <div>
          <img
            src="/images/logo.svg"
            alt="App Logo"
            className={cn(
              'w-auto opacity-30 grayscale object-contain filter',
              compact ? 'h-6' : 'h-10'
            )}
          />
        </div>

        <div
          className={cn(
            'flex flex-wrap justify-center',
            compact ? 'gap-x-6 gap-y-2' : 'gap-x-12 gap-y-4'
          )}
        >
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Privacy</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Terms</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Support</a>
          <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant hover:text-primary transition-colors font-bold">Careers</a>
        </div>

        <div className={cn('flex items-center', compact ? 'gap-5 mt-0' : 'gap-8 mt-2')}>
          <a href="https://www.instagram.com/pulse.co.in/" aria-label="Instagram" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Instagram className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </a>
          <a href="#" aria-label="Twitter" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Twitter className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </a>
          <a href="#" aria-label="YouTube" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Youtube className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </a>
          <a href=" pulse.trackit@gmail.com" aria-label="Email" className="text-on-surface-variant hover:text-primary transition-colors hover:-translate-y-1 transform duration-300">
            <Mail className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </a>
        </div>

        <div
          className={cn(
            'text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/50 text-center font-medium',
            compact ? 'mt-1' : 'mt-4'
          )}
        >
          © 2026 PULSE PERFORMANCE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
