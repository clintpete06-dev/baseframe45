/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, User, Heart, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  cart: CartItem[];
  wishlist: string[];
  onOpenCart: () => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  userEmail: string | null;
  onSearchSelect: (product: Product) => void;
}

export default function Header({
  currentPath,
  onNavigate,
  cart,
  wishlist,
  onOpenCart,
  onOpenAuth,
  isAuthenticated,
  userEmail,
  onSearchSelect
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Compute total cart quantity
  const totalCartQty = cart.reduce((sums, item) => sums + item.quantity, 0);

  // Live query auto suggestions
  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const cleanQuery = val.toLowerCase().trim();
    const matches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.brand.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery)
    ).slice(0, 5);
    setSuggestions(matches);
    setSearchOpen(true);
  };

  const selectSuggestion = (p: Product) => {
    onSearchSelect(p);
    setSearchVal('');
    setSuggestions([]);
    setSearchOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '' },
    { label: 'Sneakers', path: 'sneakers' },
    { label: 'Luxury', path: 'luxury' },
    { label: 'New Arrivals', path: 'new-arrivals' },
    { label: 'Sale', path: 'sale' },
    { label: 'Contact', path: 'contact' }
  ];

  return (
    <header id="app-luxury-header" className="sticky top-0 z-50 w-full border-b border-luxury-gray-200/40 bg-white/95 backdrop-blur-md transition-all">
      {/* Top Banner Accent Announcement */}
      <div className="bg-black py-2.5 px-4 text-center text-[10px] font-bold tracking-widest text-white uppercase flex items-center justify-center gap-2">
        <Sparkles className="h-3 w-3 animate-spin text-silver-accent-300" />
        <span>Inaugural Collection Drop: Platinum Sterling Chrome series has materialized</span>
        <ArrowRight className="h-3 w-3" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Brand Signature Wordmark Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('')}>
            <span className="font-serif-luxury text-xl font-bold tracking-widest text-black uppercase">
              BASEFRAME
            </span>
            <span className="block text-[8px] font-bold tracking-[0.25em] text-luxury-gray-400 font-sans -mt-1 uppercase">
              SHOES & MORE
            </span>
          </div>

          {/* Desktop Navigation Linkages */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.path)}
                className={`text-xs font-semibold tracking-widest uppercase transition-all duration-300 relative py-1 hover:text-black ${
                  currentPath === item.path
                    ? 'text-black'
                    : 'text-luxury-gray-450'
                }`}
              >
                {item.label}
                {currentPath === item.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-silver-accent-500 animate-[fadeIn_0.3s_ease]" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions panel (Search, Wishlist, Profile, Cart) */}
          <div className="flex items-center gap-3 lg:gap-5 flex-1 md:flex-initial justify-end">
            
            {/* Live Interactive Search Box */}
            <div ref={searchRef} className="relative hidden sm:block w-48 lg:w-64">
              <div className="flex h-10 items-center rounded-full border border-luxury-gray-200 bg-luxury-gray-50/50 px-3.5 transition-all hover:border-silver-accent-500 focus-within:border-black focus-within:bg-white focus-within:shadow-sm">
                <Search className="h-4 w-4 text-luxury-gray-400 mr-2" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Nike, Adidas, Gucci..."
                  value={searchVal}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchVal.trim() && setSearchOpen(true)}
                  className="w-full bg-transparent text-xs text-black outline-none placeholder-luxury-gray-400"
                />
              </div>

              {/* Suggestions auto-box dropdown */}
              {searchOpen && suggestions.length > 0 && (
                <div className="glassmorphism absolute left-0 right-0 mt-2.5 rounded-2xl border border-luxury-gray-200 p-3 shadow-xl z-50">
                  <div className="text-[9px] font-bold tracking-wider font-mono text-luxury-gray-400 uppercase pb-2 mb-2 border-b border-luxury-gray-100">
                    Live Collection Suggestions
                  </div>
                  <div className="space-y-1.5">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        id={`btn-search-suggestion-${p.id}`}
                        onClick={() => selectSuggestion(p)}
                        className="flex w-full items-center gap-3.5 rounded-xl p-2 text-left transition-all hover:bg-luxury-gray-100/80 active:scale-[0.98]"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-9 w-9 rounded-lg object-cover bg-luxury-gray-100"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-serif-luxury font-medium text-black truncate leading-tight">
                            {p.name}
                          </p>
                          <p className="text-[9px] text-luxury-gray-400 font-mono">
                            {p.brand} • <span className="text-black font-semibold">${p.price}</span>
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Indicator Badge icon */}
            <button
              id="header-wishlist-trigger"
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-luxury-gray-700 hover:text-black transition-colors"
              title="View Wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500 hover:scale-105' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Profile Sign-in Callback Icon */}
            <button
              id="header-auth-trigger"
              onClick={onOpenAuth}
              className={`p-2 hover:text-black transition-colors flex items-center gap-1.5 ${
                isAuthenticated ? 'text-black' : 'text-luxury-gray-750'
              }`}
              title={isAuthenticated && userEmail ? `Logged in as ${userEmail}` : 'Sign In'}
            >
              <User className="h-5 w-5" />
              {isAuthenticated && (
                <span className="hidden lg:inline text-[10px] font-mono tracking-wider font-semibold uppercase max-w-[80px] truncate">
                  {userEmail?.split('@')[0]}
                </span>
              )}
            </button>

            {/* Sticky Shopping Cart Trigger Button */}
            <button
              id="header-cart-trigger"
              onClick={onOpenCart}
              className="relative rounded-full bg-black h-10 w-10 flex items-center justify-center text-white transition-all hover:bg-silver-accent-500 hover:text-black hover:scale-105 active:scale-95"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-1 ring-white font-mono">
                  {totalCartQty}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-black md:hidden"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide Navigation Area */}
      {isMobileMenuOpen && (
        <div className="md:hidden glassmorphism border-t border-luxury-gray-200 p-5 space-y-5 animate-[slideIn_0.3s_ease]">
          
          {/* Mobile Search bar */}
          <div className="relative">
            <div className="flex h-10 items-center rounded-full border border-luxury-gray-200 bg-white px-3.5">
              <Search className="h-4 w-4 text-luxury-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchVal}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs text-black outline-none"
              />
            </div>
            {searchOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 rounded-xl bg-white border border-luxury-gray-200 p-2.5 shadow-lg z-50 space-y-1">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      selectSuggestion(p);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 p-1.5 hover:bg-luxury-gray-100"
                  >
                    <img src={p.images[0]} className="h-8 w-8 rounded object-cover" />
                    <div className="text-left">
                      <p className="text-xs font-medium text-black truncate">{p.name}</p>
                      <p className="text-[9px] text-luxury-gray-400 font-mono">${p.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-sm font-semibold tracking-widest uppercase text-left py-2 border-b border-luxury-gray-100 last:border-0 ${
                  currentPath === item.path ? 'text-black' : 'text-luxury-gray-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
