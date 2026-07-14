/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Star, ShoppingBag, CreditCard, Check, ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';
import { Product, Review } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, size: number, color: string) => void;
  onBuyNow: (product: Product, size: number, color: string) => void;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export default function ProductDetail({
  product,
  onAddToCart,
  onBuyNow,
  onBack,
  isWishlisted,
  onToggleWishlist
}: ProductDetailProps) {
  const { id, brand, name, price, originalPrice, rating, description, sizes, colors, colorsHex, category, shoeCode, specifications } = product;

  // Image Gallery State
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(sizes[Math.floor(sizes.length / 2)] || sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // Lens Zoom State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Review Form States
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isReviewAdded, setIsReviewAdded] = useState(false);

  // Hover magnifier calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200% 200%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Submit dynamic user review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const addedReview: Review = {
      id: `custom-review-${Date.now()}`,
      user: newReviewAuthor,
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewComment,
    };

    setReviewsList([addedReview, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setIsReviewAdded(true);
    setTimeout(() => setIsReviewAdded(false), 4000);
  };

  // Related products selection: items belonging to the same category or brand, excluding active item
  const relatedProducts = PRODUCTS.filter(
    (p) => (p.category === category || p.brand === brand) && p.id !== id
  ).slice(0, 4);

  return (
    <div id={`product-detail-view-${id}`} className="space-y-16 animate-[fadeIn_0.5s_ease-out]">
      {/* Upper Navigation back strip */}
      <div className="flex items-center justify-between border-b border-luxury-gray-200/40 pb-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-xs font-semibold tracking-wider text-luxury-gray-500 uppercase transition-all hover:text-black"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Gallery
        </button>
        <span className="mono-premium text-[11px] text-luxury-gray-400">SKU: {shoeCode}</span>
      </div>

      {/* Main Container Split: Images Left, Content Right */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* Images Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Zoomable Image Wrapper */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-luxury-gray-200/40 bg-luxury-gray-100/30"
          >
            <img
              id="active-zoom-image"
              src={activeImage}
              alt={name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />

            {/* Magnifier glass overlay lens */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-150 ease-out rounded-2xl shadow-inner"
              style={zoomStyle}
            />

            <div className="absolute top-4 right-4 z-10 rounded-full bg-black/75 px-3 py-1 text-[10px] text-white backdrop-blur-sm pointer-events-none uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-silver-accent-300" />
              <span>Hover to Zoom</span>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border transition-all ${
                  activeImage === imgUrl
                    ? 'border-black ring-1 ring-black shadow-md'
                    : 'border-luxury-gray-200/50 hover:border-luxury-gray-400'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${name} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-luxury-gray-400 uppercase font-mono">
                {brand}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 stroke-yellow-400'
                        : 'stroke-luxury-gray-300 text-luxury-gray-200'
                    }`}
                  />
                ))}
                <span className="mono-premium text-xs text-luxury-gray-600 font-medium ml-1">
                  {rating} ({reviewsList.length} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif-luxury text-4xl font-medium tracking-tight text-black mt-2 leading-tight">
              {name}
            </h1>

            {/* Prices */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="mono-premium text-2xl font-bold text-black">${price}</span>
              {originalPrice && (
                <span className="mono-premium text-lg text-luxury-gray-400 line-through">
                  ${originalPrice}
                </span>
              )}
              {originalPrice && (
                <span className="rounded-full bg-red-100 text-red-600 px-2.5 py-0.5 text-xs font-semibold">
                  Save ${originalPrice - price}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm text-luxury-gray-600 leading-relaxed font-sans">
              {description}
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-luxury-gray-200/30">
            {/* Color selection */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-luxury-gray-700 uppercase tracking-widest font-mono">
                  Colorway: <span className="text-black font-semibold uppercase">{selectedColor}</span>
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                {colors.map((color, idx) => {
                  const hex = colorsHex?.[idx] || '#ccc';
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative flex h-9 items-center gap-2 rounded-full border px-3 transition-all ${
                        isSelected
                          ? 'border-black bg-luxury-gray-50'
                          : 'border-luxury-gray-200 hover:border-luxury-gray-400 bg-white'
                      }`}
                      title={color}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-xs font-medium text-luxury-gray-800">{color}</span>
                      {isSelected && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest font-mono text-luxury-gray-700">
                <span>Select Size (US Men)</span>
                <span className="text-luxury-gray-400 lowercase">Fits true to size</span>
              </div>
              <div className="mt-2.5 grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-11 items-center justify-center rounded-xl text-xs font-mono transition-all ${
                        isSelected
                          ? 'bg-black text-white font-semibold shadow-inner'
                          : 'border border-luxury-gray-200 hover:border-black text-luxury-gray-750 hover:text-black font-medium'
                      }`}
                    >
                      US {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                id="btn-detail-add-cart"
                onClick={() => selectedSize && onAddToCart(product, selectedSize, selectedColor)}
                disabled={!selectedSize}
                className="flex-1 flex h-13 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-semibold tracking-wide text-white transition-all hover:bg-silver-accent-500 hover:text-black active:scale-[0.98] disabled:opacity-50"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>Add to Cart</span>
              </button>

              <button
                id="btn-detail-buy-now"
                onClick={() => selectedSize && onBuyNow(product, selectedSize, selectedColor)}
                disabled={!selectedSize}
                className="flex-1 flex h-13 items-center justify-center gap-2 rounded-xl border border-luxury-gray-300 bg-transparent px-6 text-sm font-semibold tracking-wide text-black transition-all hover:border-black hover:bg-luxury-gray-100 active:scale-[0.98] disabled:opacity-50"
              >
                <CreditCard className="h-4.5 w-4.5" />
                <span>Buy It Now</span>
              </button>
            </div>
          </div>

          {/* Secure / Delivery Trust Badges */}
          <div className="pt-6 grid grid-cols-2 gap-4 border-t border-luxury-gray-200/30 text-[10px] tracking-wide text-luxury-gray-500 font-mono uppercase">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-luxury-gray-400" />
              <div>
                <p className="font-semibold text-black">Express Air Freight</p>
                <p className="lowercase text-[9px]">unpacked in 2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-luxury-gray-400" />
              <div>
                <p className="font-semibold text-black">100% Genuine Guard</p>
                <p className="lowercase text-[9px]">guaranteed authentic tags</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Split Specification Table and Reviews Feed */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pt-12 border-t border-luxury-gray-200/50">
        
        {/* Left Side: Technical Specs */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xl font-medium text-black tracking-tight flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-silver-accent-500" />
            <span>Mastery Specifications</span>
          </h3>
          <div className="rounded-2xl border border-luxury-gray-200/40 bg-white p-5 space-y-3.5">
            {Object.entries(specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs pb-3 border-b border-luxury-gray-100 last:pb-0 last:border-b-0">
                <span className="font-semibold tracking-wider text-luxury-gray-400 uppercase font-mono">{key}</span>
                <span className="font-medium text-luxury-gray-800 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Reviews Feed */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h3 className="text-2xl font-medium text-black">Verifiable Reviews ({reviewsList.length})</h3>
            <p className="text-xs text-luxury-gray-400">Authentic opinions left by verified collection owners.</p>
          </div>

          {/* Reviews List Feed */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-none">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-luxury-gray-100 bg-white p-4 space-y-2 animate-[fadeIn_0.3s_ease]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-black tracking-wide">{rev.user}</span>
                  <span className="text-[10px] text-luxury-gray-400 font-mono">{rev.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, st) => (
                    <Star
                      key={st}
                      className={`h-3 w-3 ${
                        st < rev.rating ? 'fill-yellow-400 stroke-yellow-400' : 'text-luxury-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-luxury-gray-600 font-sans leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* Add a Review Interactive Form */}
          <form onSubmit={handleAddReview} className="rounded-2xl border border-luxury-gray-200/50 p-6 space-y-4.5 bg-luxury-gray-100/30">
            <h4 className="text-sm font-semibold text-black uppercase tracking-wider font-mono">Contribute Sizing Experience</h4>
            
            {isReviewAdded && (
              <div className="rounded-xl bg-green-50 p-3 text-xs font-semibold text-green-700">
                ✓ Thank you! Your verified review has been published immediately.
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Inscriber Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nicholas C."
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs text-black outline-none transition-all focus:border-black"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Assigned Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                  className="mt-1 h-10 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs text-black outline-none transition-all focus:border-black"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 / 5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 / 5)</option>
                  <option value={3}>⭐⭐⭐ (3 / 5)</option>
                  <option value={2}>⭐⭐ (2 / 5)</option>
                  <option value={1}>⭐ (1 / 5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Your Opinion</label>
              <textarea
                required
                rows={3}
                placeholder="Share your experience regarding leather grade, packaging elegance, and general sizing fit..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="mt-1 w-full rounded-lg border border-luxury-gray-200 bg-white p-3 text-xs text-black outline-none transition-all focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-black text-xs font-semibold tracking-wider text-white uppercase transition-all hover:bg-silver-accent-500 hover:text-black"
            >
              Post Verification
            </button>
          </form>
        </div>

      </div>

      {/* Section: Related Masterpieces */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-luxury-gray-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono">Matching Styles</span>
              <h3 className="text-2xl font-semibold text-black -mt-0.5">Complimentary Collection</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                id={`related-card-${p.id}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Simulate route refresh
                  setActiveImage(p.images[0]);
                  setSelectedSize(p.sizes[2] || p.sizes[0]);
                  setSelectedColor(p.colors[0]);
                  setReviewsList(p.reviews);
                  // Trigger state navigate
                  window.location.hash = `#/product/${p.id}`;
                }}
                className="group cursor-pointer rounded-xl overflow-hidden border border-luxury-gray-100 bg-white p-3.5 transition-all hover:shadow-md hover:border-silver-accent-500"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-luxury-gray-100">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <span className="text-[9px] font-bold uppercase text-luxury-gray-400 font-mono tracking-wider">{p.brand}</span>
                  <h4 className="text-xs font-medium text-black line-clamp-1">{p.name}</h4>
                  <p className="mono-premium text-xs text-luxury-gray-700 font-semibold mt-1">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
