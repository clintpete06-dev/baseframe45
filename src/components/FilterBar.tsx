/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { ProductFilter, SortOption } from '../types';

interface FilterBarProps {
  filters: ProductFilter;
  onFilterChange: (filters: ProductFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  availableBrands: string[];
}

export default function FilterBar({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  availableBrands
}: FilterBarProps) {
  // Available filter values
  const sizesList = [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];
  const stylesList = ['Sneakers', 'Luxury', 'Boots', 'Casual'];
  const colorsList = ['Silver', 'Black', 'White', 'Red', 'Blue', 'Brown', 'Tan'];
  const ageList = ['Classic', 'Modern', 'Futuristic'];

  const resetFilters = () => {
    onFilterChange({
      brands: [],
      sizes: [],
      style: [],
      colors: [],
      minPrice: 0,
      maxPrice: 1500,
      age: []
    });
  };

  const handleSizeToggle = (size: number) => {
    const isSelected = filters.sizes.includes(size);
    const newSizes = isSelected
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleBrandToggle = (brand: string) => {
    const isSelected = filters.brands.includes(brand);
    const newBrands = isSelected
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleStyleToggle = (style: string) => {
    const isSelected = filters.style.includes(style);
    const newStyle = isSelected
      ? filters.style.filter((s) => s !== style)
      : [...filters.style, style];
    onFilterChange({ ...filters, style: newStyle });
  };

  const handleColorToggle = (color: string) => {
    const isSelected = filters.colors.includes(color);
    const newColors = isSelected
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handleAgeToggle = (age: string) => {
    const isSelected = filters.age.includes(age);
    const newAge = isSelected
      ? filters.age.filter((a) => a !== age)
      : [...filters.age, age];
    onFilterChange({ ...filters, age: newAge });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) || 1500 });
  };

  // Determine active count
  const activeCount =
    filters.brands.length +
    filters.sizes.length +
    filters.style.length +
    filters.colors.length +
    (filters.maxPrice < 1500 ? 1 : 0) +
    filters.age.length;

  return (
    <div
      id="filter-and-feature-bar"
      className="rounded-3xl border border-luxury-gray-200/50 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-luxury-gray-100 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-luxury-gray-100 text-black">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-black uppercase">Refine Curated Stock</h4>
            <p className="text-[11px] text-luxury-gray-400 font-mono">
              {activeCount ? `${activeCount} active filters` : 'Showing all products'}
            </p>
          </div>
        </div>

        {/* Clear Trigger */}
        {activeCount > 0 && (
          <button
            id="btn-filters-reset"
            onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-full border border-luxury-gray-200 px-3 py-1.5 text-xs font-medium text-luxury-gray-600 transition-all hover:border-black hover:text-black hover:bg-luxury-gray-100"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filters</span>
          </button>
        )}

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by-select" className="text-xs text-luxury-gray-500 font-mono flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" />
            <span>Sort By</span>
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-full border border-luxury-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-black outline-none transition-all hover:border-silver-accent-500 focus:border-black"
          >
            <option value="Recommended">Recommended</option>
            <option value="Newest">Newest</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Best Selling">Best Selling</option>
          </select>
        </div>
      </div>

      {/* Grid Filter Options */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* Style selection */}
        <div>
          <h5 className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-3">Style</h5>
          <div className="flex flex-col gap-1.5">
            {stylesList.map((style) => {
              const checked = filters.style.includes(style);
              return (
                <button
                  key={style}
                  onClick={() => handleStyleToggle(style)}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs transition-all ${
                    checked
                      ? 'bg-black text-white font-medium'
                      : 'text-luxury-gray-600 hover:bg-luxury-gray-105 hover:text-black'
                  }`}
                >
                  <span>{style}</span>
                  {checked && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sizes Selection */}
        <div>
          <h5 className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-3">US Size</h5>
          <div className="grid grid-cols-4 gap-1.5">
            {sizesList.map((size) => {
              const checked = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`flex h-9 items-center justify-center rounded-lg text-xs font-mono transition-all ${
                    checked
                      ? 'bg-black text-white font-semibold shadow-inner'
                      : 'border border-luxury-gray-200 text-luxury-gray-700 hover:border-black hover:text-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Price Range Slider */}
        <div>
          <h5 className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-3">Max Price</h5>
          <div className="px-1">
            <input
              id="input-price-slider"
              type="range"
              min="80"
              max="1500"
              step="20"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="w-full accent-black cursor-pointer"
            />
            <div className="mt-2.5 flex items-center justify-between text-xs font-mono text-luxury-gray-500">
              <span>$80</span>
              <span className="font-semibold text-black">${filters.maxPrice}</span>
            </div>
          </div>
        </div>

        {/* Color Switchers */}
        <div>
          <h5 className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-3">Color Accent</h5>
          <div className="flex flex-wrap gap-1.5">
            {colorsList.map((color) => {
              const checked = filters.colors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all ${
                    checked
                      ? 'bg-black text-white'
                      : 'border border-luxury-gray-200 text-luxury-gray-600 hover:border-black hover:text-black'
                  }`}
                >
                  {/* Subtle color bubble indicators */}
                  <span
                    className={`h-2.5 w-2.5 rounded-full border border-black/15 ${
                      color === 'Silver' ? 'bg-slate-300' :
                      color === 'Black' ? 'bg-zinc-950' :
                      color === 'White' ? 'bg-zinc-50' :
                      color === 'Red' ? 'bg-red-500' :
                      color === 'Blue' ? 'bg-blue-600' :
                      color === 'Brown' ? 'bg-amber-800' :
                      'bg-orange-200'
                    }`}
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age/Era Filters */}
        <div>
          <h5 className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono mb-3">Design Era</h5>
          <div className="flex flex-col gap-1.5">
            {ageList.map((age) => {
              const checked = filters.age.includes(age);
              return (
                <button
                  key={age}
                  onClick={() => handleAgeToggle(age)}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs transition-all ${
                    checked
                      ? 'bg-black text-white font-medium'
                      : 'text-luxury-gray-600 hover:bg-luxury-gray-105 hover:text-black'
                  }`}
                >
                  <span>{age}</span>
                  {checked && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
