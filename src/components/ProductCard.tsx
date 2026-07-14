/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Eye, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  const { id, brand, name, price, originalPrice, rating, images, category, isNewArrival, isSale } = product;

  return (
    <div
      id={`product-card-${id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-luxury-gray-200/40 bg-white transition-all duration-500 hover:border-silver-accent-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
    >
      {/* Visual Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {isNewArrival && (
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-medium tracking-wider text-white uppercase">
            New
          </span>
        )}
        {isSale && (
          <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-medium tracking-wider text-white uppercase">
            Sale
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`btn-wishlist-${id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(id);
        }}
        className="absolute top-4 right-4 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full border border-luxury-gray-100 bg-white/90 text-luxury-gray-500 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-red-500"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-luxury-gray-600'}`} />
      </button>

      {/* Hero Shoe Image Area */}
      <div
        id={`product-card-image-wrap-${id}`}
        onClick={() => onSelect(product)}
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-luxury-gray-100/10"
      >
        <img
          src={images[0]}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Dynamic Dark Metallic Shine Action Overlays */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Premium Action Drawer */}
        <div className="absolute right-0 bottom-4 left-0 flex translate-y-8 justify-center gap-2.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 rounded-full bg-black px-4.5 py-2 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:bg-silver-accent-400 hover:text-black"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Discover</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, product.sizes[2] || 9, product.colors[0]);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white"
            title="Instant Cart Add (Size US 9)"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-widest text-luxury-gray-400 uppercase">
            {brand}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
            <span className="mono-premium text-[11px] font-medium text-luxury-gray-700">{rating}</span>
          </div>
        </div>

        <h3
          onClick={() => onSelect(product)}
          className="font-serif-luxury cursor-pointer text-[17px] font-medium leading-tight text-luxury-gray-900 transition-colors hover:text-silver-accent-500 line-clamp-1"
        >
          {name}
        </h3>

        {/* Pricing & Quick Attributes */}
        <div className="mt-auto pt-4 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="mono-premium text-base font-semibold text-black">
              ${price}
            </span>
            {originalPrice && (
              <span className="mono-premium text-sm text-luxury-gray-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-luxury-gray-400 uppercase tracking-wider font-mono">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}
