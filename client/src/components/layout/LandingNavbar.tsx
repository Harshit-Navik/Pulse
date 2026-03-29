import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/', active: false },
  { label: 'Features', href: '/#features', active: false },
  { label: 'Products', href: '/products', active: false },
  { label: 'Pricing', href: '/#pricing', active: false },
  { label: 'FAQs', href: '/#faqs', active: false },
  { label: 'Contact', href: '/#contact', active: false },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-8 md:px-12">
        <Link to="/" className="text-3xl font-black text-primary italic font-headline uppercase tracking-tighter">
          PULSE
        </Link>

        <div className="hidden md:flex items-center gap-x-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "font-headline uppercase tracking-tight text-xs text-primary font-bold"
                  : "font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200"
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link
          to="/login"
          className="hidden md:block bg-primary text-on-primary px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 active:scale-95"
        >
          Join Now
        </Link>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline/30 bg-background/95 backdrop-blur-md">
          <div className="px-8 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  link.active
                    ? "block font-headline uppercase tracking-tight text-xs text-primary font-bold py-2"
                    : "block font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200 py-2"
                }
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-primary text-on-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 active:scale-95 mt-4"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
