/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRANDS } from '../data/products';

interface BrandShowcaseProps {
  onBrandSelect: (brand: string) => void;
}

export default function BrandShowcase({ onBrandSelect }: BrandShowcaseProps) {
  return (
    <div id="brand-showcase-section" className="py-12 bg-luxury-gray-100/50 rounded-3xl p-8 border border-luxury-gray-200/30">
      <div className="text-center mb-10 max-w-xl mx-auto">
        <span className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono">
          The Vault
        </span>
        <h2 className="text-3xl font-medium tracking-tight mt-1 text-black">
          World-Class Footwear Brands
        </h2>
        <p className="text-xs text-luxury-gray-500 mt-2">
          Explore curated masterpieces from athletic speed pioneers to luxury historical ateliers.
        </p>
      </div>

      {/* Grid of Brand Logos / Badges */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
        {BRANDS.map((brand) => (
          <button
            key={brand.name}
            id={`btn-brand-tab-${brand.name.toLowerCase()}`}
            onClick={() => onBrandSelect(brand.name)}
            className="group flex flex-col items-center justify-center rounded-2xl border border-luxury-gray-200/50 bg-white p-5 cursor-pointer shadow-sm transition-all duration-300 hover:border-black hover:shadow-md hover:-translate-y-1 active:scale-95"
          >
            {/* Visual Wordmark Logo Placeholder with Luxury Typeface */}
            <span className="font-serif-luxury text-base font-bold tracking-widest text-luxury-gray-800 transition-colors group-hover:text-black uppercase">
              {brand.name}
            </span>
            <span className="text-[8px] tracking-tight font-mono text-luxury-gray-400 mt-1 uppercase group-hover:text-silver-accent-500">
              Explore
            </span>
          </button>
        ))}
      </div>

      {/* Luxury horizontal visual slider banner overlay */}
      <div className="mt-12 relative overflow-hidden rounded-2xl bg-black py-4.5 px-6">
        <div className="flex animate-[pulse_3s_infinite] items-center justify-center gap-10 whitespace-nowrap text-xs tracking-widest text-white/70 font-mono uppercase">
          <span>• NIKE •</span>
          <span>• ADIDAS •</span>
          <span>• GUCCI •</span>
          <span>• NEW BALANCE •</span>
          <span>• BALENCIAGA •</span>
          <span>• LOUIS VUITTON •</span>
          <span>• TIMBERLAND •</span>
          <span>• PUMA •</span>
          <span>• VANS •</span>
        </div>
      </div>
    </div>
  );
}
