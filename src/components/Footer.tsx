/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Award, Globe, ShieldCheck, Instagram, Twitter, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-luxury-footer" className="mt-24 border-t border-luxury-gray-200/50 bg-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Logo Brand Statement Column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif-luxury text-xl font-bold tracking-widest text-black uppercase">
                BASEFRAME
              </span>
              <span className="block text-[8px] font-bold tracking-[0.25em] text-luxury-gray-400 font-sans -mt-1 uppercase">
                SHOES & MORE
              </span>
            </div>
            <p className="text-xs text-luxury-gray-500 max-w-sm leading-relaxed">
              Curating elite footwear for modern gentlemen. From track speed innovations to Parisian haute couture, and durable sub-zero sterling boots.
            </p>
            {/* Social handles */}
            <div className="flex gap-4.5 pt-2">
              <a href="#instagram" className="text-luxury-gray-400 hover:text-black transition-colors" aria-label="Instagram">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="#twitter" className="text-luxury-gray-400 hover:text-black transition-colors" aria-label="Twitter">
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a href="#telegram" className="text-luxury-gray-400 hover:text-black transition-colors" aria-label="Telegram">
                <MessageCircle className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick linkages columns */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-4">Catelog</h4>
            <ul className="space-y-2.5 text-xs text-luxury-gray-600">
              <li>
                <button onClick={() => onNavigate('')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Homepage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sneakers')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Premium Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('luxury')} className="hover:text-black transition-colors cursor-pointer text-left">
                  High-End Luxury
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-black transition-colors cursor-pointer text-left">
                  New Collection Drops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sale')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Curated Sales Room
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-4">Brand Ateliers</h4>
            <ul className="space-y-2.5 text-xs text-luxury-gray-600">
              <li>
                <button onClick={() => onNavigate('brand/nike')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Nike Room
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brand/adidas')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Adidas Vault
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brand/gucci')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Gucci Masterpiece
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brand/balenciaga')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Balenciaga Structural
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brand/louis%20vuitton')} className="hover:text-black transition-colors cursor-pointer text-left">
                  Louis Vuitton Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support policies */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-4">Assistance</h4>
            <ul className="space-y-2.5 text-xs text-luxury-gray-600">
              <li>
                <span className="hover:text-black transition-colors">Digital Sizing Blueprints</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Authentic Tag Registry</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Express Inbound Returns</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Payment Protection Shield</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Atelier Direct • clintpete06@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Details */}
        <div className="mt-16 border-t border-luxury-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-luxury-gray-400">
          <div className="flex flex-wrap items-center gap-2">
            <Globe className="h-4 w-4" />
            <p>© {currentYear} Baseframe Shoes & More. Full-Scale Luxury Distribution. All Rights Reserved.</p>
          </div>

          {/* Checkout Secure Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-semibold font-mono uppercase tracking-wider">Payments Protected via SECURE TLS</span>
            <div className="flex h-5 items-center gap-1 opacity-65 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <span className="rounded bg-black px-1.5 py-0.5 text-[8px] font-bold text-white tracking-widest">VISA</span>
              <span className="rounded bg-black px-1.5 py-0.5 text-[8px] font-bold text-white tracking-widest">MC</span>
              <span className="rounded bg-black px-1.5 py-0.5 text-[8px] font-bold text-white tracking-widest">AMEX</span>
              <span className="rounded bg-black px-1.5 py-0.5 text-[8px] font-bold text-white tracking-widest">APPLEPAY</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
