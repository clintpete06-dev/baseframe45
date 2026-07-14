/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

const HERO_SLIDES = [
  {
    title: 'The Platinum Sterling series has materialized',
    subtitle: 'PRECISION ERGONOMICS',
    description: 'Explore the newly engineered Baseframe Silver-Chrome footwear, balancing high athletic feedback with luxurious structural calfskin.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop&q=80',
    ctaPath: 'sneakers',
    badge: 'Limited Drop Edition'
  },
  {
    title: 'Modern Italian Architectural Ateliers',
    subtitle: 'HISTORICAL HERITAGE',
    description: 'Masterfully stitched in Tuscany. Horsebit leather loafers and debossed metal monogram trainers from Gucci and Louis Vuitton.',
    image: 'https://images.unsplash.com/photo-1614252329309-4d3f5f377e8e?w=1600&auto=format&fit=crop&q=80',
    ctaPath: 'luxury',
    badge: 'Gucci & Louis Vuitton'
  },
  {
    title: 'Engineered Weather Guard Protection',
    subtitle: 'SUB-ZERO WATERPROOF',
    description: 'Rustproof solid copper eyelets and sterling waterproof nubuck. Premium Timberland and Clarks Desert Boots.',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1600&auto=format&fit=crop&q=80',
    ctaPath: 'new-arrivals',
    badge: 'Boots & Casuals'
  }
];

export default function Hero({ onNavigate }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div id="luxury-hero-banner" className="relative aspect-[16/9] w-full min-h-[480px] rounded-3xl overflow-hidden border border-luxury-gray-200/50 bg-neutral-900 group shadow-lg">
      
      {/* Dynamic Slide Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-all duration-1000 scale-102 filter brightness-[0.7] group-hover:scale-105"
        />
        {/* Deep luxury black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      {/* Slide Content Area wrapper */}
      <div className="absolute inset-0 flex items-center p-8 md:p-16 lg:p-24">
        <div className="max-w-xl space-y-6 text-white animate-[fadeIn_0.5s_ease-out]">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-silver-accent-300" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-white font-mono">{slide.badge}</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold tracking-widest text-silver-accent-450 uppercase font-mono">{slide.subtitle}</p>
            <h1 className="font-serif-luxury text-4xl md:text-5xl lg:text-5xl font-light tracking-tight leading-tight text-white font-serif-luxury text-luxury-stroke">
              {slide.title}
            </h1>
          </div>

          <p className="text-xs leading-relaxed text-luxury-gray-300 max-w-md font-sans font-light">
            {slide.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate(slide.ctaPath)}
              className="flex h-12 items-center gap-2 rounded-xl bg-white text-xs font-semibold tracking-widest uppercase text-black px-7 hover:bg-silver-accent-400 focus:outline-none transition-all duration-300 active:scale-95"
            >
              <span>Accredit Collection</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('new-arrivals')}
              className="flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-black/40 text-xs font-semibold tracking-widest uppercase text-white px-7 hover:border-white hover:bg-black/60 focus:outline-none transition-all duration-300 active:scale-95"
            >
              <span>Explore Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sliding Arrow Navigation triggers */}
      <div className="absolute right-6 bottom-6 flex items-center gap-2 z-20">
        <button
          onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:border-white active:scale-90"
          title="Previous Banner"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:border-white active:scale-90"
          title="Next Banner"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Progress Dots indicators */}
      <div className="absolute left-6 bottom-6 flex gap-2 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
