/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandShowcase from './components/BrandShowcase';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import FilterBar from './components/FilterBar';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import HistoryNav from './components/HistoryNav';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

import { Product, CartItem, ProductFilter, SortOption } from './types';
import { PRODUCTS, BRANDS } from './data/products';
import { Sparkles, ArrowRight, Compass, Shield, MapPin, Send } from 'lucide-react';

export default function App() {
  // Routing State
  const [currentPath, setCurrentPath] = useState('');
  
  // Shopping bag and wishlist local state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const data = localStorage.getItem('baseframe_cart');
    return data ? JSON.parse(data) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const data = localStorage.getItem('baseframe_wishlist');
    return data ? JSON.parse(data) : [];
  });

  // Client Session States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('baseframe_auth') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('baseframe_user_email');
  });

  // Filters State
  const [filters, setFilters] = useState<ProductFilter>({
    brands: [],
    sizes: [],
    style: [],
    colors: [],
    minPrice: 0,
    maxPrice: 1500,
    age: []
  });

  const [sortBy, setSortBy] = useState<SortOption>('Recommended');

  // Modal Open States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // URL Hash parser effect
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const cleanPath = hash.replace(/^#\//, '');
      
      // Auto-scroll on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Support shorthand brand paths (e.g. #/nike, #/gucci) or full ones (#/brand/nike)
      const lowercasePath = cleanPath.toLowerCase();

      // Check if path is a matching shoe brand name directly
      const knownBrand = BRANDS.find(b => b.name.toLowerCase() === lowercasePath);
      if (knownBrand) {
        setCurrentPath(`brand/${knownBrand.name.toLowerCase()}`);
        // Preset brand filter automatically
        setFilters(prev => ({ ...prev, brands: [knownBrand.name] }));
      } else {
        setCurrentPath(cleanPath);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Synchronise Cart Storage
  useEffect(() => {
    localStorage.setItem('baseframe_cart', JSON.stringify(cart));
  }, [cart]);

  // Synchronise Wishlist Storage
  useEffect(() => {
    localStorage.setItem('baseframe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle route navigation triggers
  const handleNavigate = (path: string) => {
    window.location.hash = `#/${path}`;
  };

  // Add items inside the Cart Drawer
  const handleAddToCart = (product: Product, size: number, color: string) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === itemId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: itemId, product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Immediate "Buy Now" flow callback
  const handleBuyNow = (product: Product, size: number, color: string) => {
    handleAddToCart(product, size, color);
    setIsCartOpen(true);
  };

  // Adjust cart item quantities
  const handleUpdateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  // Remove single cart row
  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle wishlist collection
  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Sign In authentic handler
  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('baseframe_auth', 'true');
    localStorage.setItem('baseframe_user_email', email);
    setIsAuthOpen(false);
  };

  // Relinquish logged sessions
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('baseframe_auth');
    localStorage.removeItem('baseframe_user_email');
    setIsAuthOpen(false);
  };

  // Dynamic filter query calculations
  const filteredProducts = PRODUCTS.filter((p) => {
    // 1. Direct Brand Path Filter
    if (currentPath.startsWith('brand/')) {
      const pathBrand = currentPath.split('/')[1]?.toLowerCase();
      if (p.brand.toLowerCase() !== pathBrand) {
        return false;
      }
    } else if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
      return false;
    }

    // 2. Sneakers Category path
    if (currentPath === 'sneakers' && p.category !== 'Sneakers') {
      return false;
    }

    // 3. Luxury Category path
    if (currentPath === 'luxury' && p.category !== 'Luxury') {
      return false;
    }

    // 4. New Arrivals Category path
    if (currentPath === 'new-arrivals' && !p.isNewArrival) {
      return false;
    }

    // 5. Discount sale path
    if (currentPath === 'sale' && !p.isSale) {
      return false;
    }

    // 6. User Wishlist panel
    if (currentPath === 'wishlist' && !wishlist.includes(p.id)) {
      return false;
    }

    // 7. Core filter inputs (Sidebar)
    if (filters.sizes.length > 0) {
      const matchSize = p.sizes.some((s) => filters.sizes.includes(s));
      if (!matchSize) return false;
    }

    if (filters.style.length > 0 && !filters.style.includes(p.category)) {
      return false;
    }

    if (filters.colors.length > 0) {
      const matchColor = p.colors.some((col) =>
        filters.colors.some((fcol) => col.toLowerCase().includes(fcol.toLowerCase()))
      );
      if (!matchColor) return false;
    }

    if (p.price > filters.maxPrice) {
      return false;
    }

    if (filters.age.length > 0) {
      const ageCategory =
        p.id.includes('classic') || p.id.includes('retro') || p.id.includes('vintage') || p.id.includes('1953')
          ? 'Classic'
          : p.id.includes('metallic') || p.id.includes('silver') || p.id.includes('trainer')
          ? 'Futuristic'
          : 'Modern';
      if (!filters.age.includes(ageCategory)) return false;
    }

    return true;
  });

  // Sorting metrics calculation
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') {
      return a.price - b.price;
    }
    if (sortBy === 'Price: High to Low') {
      return b.price - a.price;
    }
    if (sortBy === 'Newest') {
      return a.isNewArrival ? -1 : 1;
    }
    if (sortBy === 'Best Selling') {
      return a.isBestSeller ? -1 : 1;
    }
    return a.isFeatured ? -1 : 1; // Recommended fallback
  });

  // Handle support message send
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Determine active brand page metadata properties
  const isBrandPage = currentPath.startsWith('brand/');
  const brandParam = isBrandPage ? currentPath.split('/')[1] : null;
  const activeBrandMeta = brandParam ? BRANDS.find(b => b.name.toLowerCase() === brandParam) : null;

  // Single Product Detail Selection Parsing
  const isProductDetail = currentPath.startsWith('product/');
  const activeProductId = isProductDetail ? currentPath.split('/')[1] : null;
  const activeProduct = activeProductId ? PRODUCTS.find((p) => p.id === activeProductId) : null;

  return (
    <div id="baseframe-atelier-app" className="min-h-screen flex flex-col bg-luxury-gray-50 text-luxury-gray-900 font-sans">
      
      {/* Sticky Top Header Navigation */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        cart={cart}
        wishlist={wishlist}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onSearchSelect={(p) => handleNavigate(`product/${p.id}`)}
      />

      {/* Primary Dynamic Main Body */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        
        {isProductDetail && activeProduct ? (
          /* Render Product individual pages */
          <ProductDetail
            product={activeProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBack={() => handleNavigate('')}
            isWishlisted={wishlist.includes(activeProduct.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentPath === 'contact' ? (
          /* Render Contact & Physical Atelier hubs */
          <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono">Support Hub</span>
              <h2 className="font-serif-luxury text-4.5xl font-medium tracking-tight text-black">Private Client Services</h2>
              <p className="text-xs text-luxury-gray-500">Inquire regarding custom dimensions, parcel tracking, or bulk shipments.</p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Interaction contact form */}
              <form onSubmit={handleContactSubmit} className="rounded-3xl border border-luxury-gray-200/50 p-8 bg-white space-y-5 shadow-sm">
                <h3 className="font-serif-luxury text-xl font-medium text-black">Inscribe Query Message</h3>
                
                {contactSuccess && (
                  <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-xs font-semibold text-green-700">
                    ✓ Your query has been routed toclintpete06@gmail.com. Standard response time is 2-4 business hours.
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Inquirer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clint Pete"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="mt-1 h-11 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Atelier Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. clint@peter.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-1 h-11 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Message / Specification</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide your model SKU number and shipping details so we can quickly assist..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-luxury-gray-200 bg-white p-3.5 text-xs outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-black text-xs font-semibold tracking-wider text-white uppercase hover:bg-silver-accent-500 hover:text-black transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmit Query</span>
                </button>
              </form>

              {/* Physical Showroom Map representations */}
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-xl font-medium text-black">Global Footwear Showrooms</h3>
                
                <div className="space-y-4">
                  <div className="rounded-2xl border border-luxury-gray-200/50 p-5 bg-white flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-quantum shrink-0 shadow-sm">
                      <MapPin className="h-4.5 w-4.5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury font-semibold text-sm text-black">Geneva Atelier Hub</h4>
                      <p className="text-xs text-luxury-gray-500 mt-1">Rue de la Corraterie 12, Geneva, Switzerland</p>
                      <span className="inline-block rounded-xl bg-luxury-gray-100 text-[10px] text-zinc-650 px-2 py-0.5 mt-2 font-mono">Hours: 10:00 - 19:00</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-luxury-gray-200/50 p-5 bg-white flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-quantum shrink-0 shadow-sm">
                      <MapPin className="h-4.5 w-4.5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury font-semibold text-sm text-black">Parisian Atelier Showroom</h4>
                      <p className="text-xs text-luxury-gray-500 mt-1">Rue Saint-Honoré 250, Paris, France</p>
                      <span className="inline-block rounded-xl bg-luxury-gray-100 text-[10px] text-zinc-650 px-2 py-0.5 mt-2 font-mono">Hours: 09:30 - 20:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* General product catalogs (Home, Brand corridors, Category feeds, Wishlists) */
          <div className="space-y-16 animate-[fadeIn_0.5s_ease-out]">
            
            {/* Visual Headings and banners dependent on current path */}
            {currentPath === '' || currentPath === '/' ? (
              <>
                {/* Home Page elements */}
                <Hero onNavigate={handleNavigate} />
                <BrandShowcase onBrandSelect={(name) => handleNavigate(`brand/${name.toLowerCase()}`)} />
                
                {/* Special Promotional Side grids (Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative aspect-[16/7] rounded-3xl overflow-hidden border border-luxury-gray-200/40 bg-zinc-900 shadow">
                    <img
                      src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80"
                      alt="Waterproof leather"
                      className="absolute inset-0 h-full w-full object-cover filter brightness-[0.6] hover:scale-103 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <span className="text-[10px] font-bold tracking-widest text-silver-accent-300 font-mono uppercase">Heritage Releases</span>
                      <h3 className="font-serif-luxury text-2xl font-semibold mt-1">The Chuck Vintage Collection</h3>
                      <p className="text-xs text-luxury-gray-300 mt-2 max-w-sm">Crafted with heavier canvassing and OrthoLite memory soles.</p>
                      <button
                        onClick={() => handleNavigate('brand/converse')}
                        className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase hover:underline text-white w-fit"
                      >
                        <span>Examine Converse</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative aspect-[16/7] rounded-3xl overflow-hidden border border-luxury-gray-200/40 bg-zinc-900 shadow">
                    <img
                      src="https://images.unsplash.com/photo-1549298916-f52d724204b4?w=1010&auto=format&fit=crop&q=80"
                      alt="Tuscan Leather"
                      className="absolute inset-0 h-full w-full object-cover filter brightness-[0.65] hover:scale-103 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <span className="text-[10px] font-bold tracking-widest text-silver-accent-300 font-mono uppercase">Luxury Haute Couture</span>
                      <h3 className="font-serif-luxury text-2xl font-semibold mt-1">The Parisian Riviera Trainer</h3>
                      <p className="text-xs text-luxury-gray-300 mt-2 max-w-sm">Premium monogram embossed full calfskin with sterling fittings.</p>
                      <button
                        onClick={() => handleNavigate('brand/louis%20vuitton')}
                        className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase hover:underline text-white w-fit"
                      >
                        <span>Examine Louis Vuitton</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : isBrandPage && activeBrandMeta ? (
              /* Brand specific header banner */
              <div className="relative aspect-[21/6] min-h-[220px] w-full rounded-3xl overflow-hidden border border-luxury-gray-200/50 bg-neutral-900 shadow">
                <img
                  src={activeBrandMeta.bannerUrl}
                  alt={activeBrandMeta.name}
                  className="absolute inset-0 h-full w-full object-cover filter brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
                  <span className="text-[10px] font-bold tracking-widest text-silver-accent-300 font-mono uppercase">Brand Room</span>
                  <h1 className="font-serif-luxury text-4.5xl md:text-5.5xl font-medium tracking-tight uppercase leading-none mt-1">
                    {activeBrandMeta.name}
                  </h1>
                  <p className="text-xs text-luxury-gray-300 mt-2 max-w-md italic">{activeBrandMeta.slogan}</p>
                </div>
              </div>
            ) : (
              /* Category/Wishlist banner list style */
              <div className="space-y-2 border-b border-luxury-gray-200/50 pb-5">
                <span className="text-[10px] font-bold tracking-[0.2em] text-luxury-gray-400 uppercase font-mono block">
                  {currentPath === 'sneakers' ? 'Sneakers Category' :
                   currentPath === 'luxury' ? 'Luxury Masterpieces' :
                   currentPath === 'new-arrivals' ? 'Recent Release Drops' :
                   currentPath === 'sale' ? 'Private Curator Discounts' :
                   'Saved Collection'}
                </span>
                <h1 className="font-serif-luxury text-4.5xl font-light text-black uppercase tracking-tight -mt-0.5">
                  {currentPath === 'sneakers' ? 'Premium Sneakers' :
                   currentPath === 'luxury' ? 'High-End Luxury' :
                   currentPath === 'new-arrivals' ? 'New Arrivals' :
                   currentPath === 'sale' ? 'Curated Sale Room' :
                   'Your Wishlist'}
                </h1>
                <p className="text-xs text-luxury-gray-400">
                  {currentPath === 'sale' ? 'Exquisite pricing with up to 25% lower thresholds accrued directly.' :
                   currentPath === 'wishlist' ? 'Review your curated elements and direct packages to shipping channels.' :
                   'Fulfill structural gentleman silhouettes.'}
                </p>
              </div>
            )}

            {/* General Filter Block */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              availableBrands={BRANDS.map(b => b.name)}
            />

            {/* Core Product Grid Display */}
            <div>
              <div className="flex items-baseline justify-between mb-8">
                <h3 className="font-serif-luxury text-2.5xl font-medium text-black tracking-tight">
                  {sortedProducts.length} curated masterwork{sortedProducts.length !== 1 ? 's' : ''} available
                </h3>
              </div>

              {sortedProducts.length === 0 ? (
                /* No matching queries result */
                <div className="rounded-3xl border border-luxury-gray-200/50 p-16 text-center space-y-4 bg-white shadow-sm min-h-[300px] flex flex-col items-center justify-center">
                  <div className="rounded-full bg-luxury-gray-100 p-4 border border-luxury-gray-200 text-luxury-gray-400">
                    <Compass className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-xl font-semibold text-black">Zero Stock Matches</h4>
                    <p className="text-xs text-luxury-gray-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                      Sizing metrics, colorways, or era configurations do not currently intersect. Reset filters to review full catalog.
                    </p>
                  </div>
                  <button
                    onClick={() => setFilters({
                      brands: [],
                      sizes: [],
                      style: [],
                      colors: [],
                      minPrice: 0,
                      maxPrice: 1500,
                      age: []
                    })}
                    className="rounded-full bg-black px-6 py-2 text-xs font-semibold tracking-wider text-white uppercase hover:bg-silver-accent-500 hover:text-black transition-all"
                  >
                    Expose Full Stock
                  </button>
                </div>
              ) : (
                /* Active shoe lists */
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sortedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={(product) => handleNavigate(`product/${product.id}`)}
                      onAddToCart={handleAddToCart}
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Include custom homepage visual elements */}
            {(currentPath === '' || currentPath === '/') && (
              <>
                {/* Visual Section: Featured spotlight row */}
                <div className="space-y-6 pt-12 border-t border-luxury-gray-200/40">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-luxury-gray-400 uppercase font-mono">Curator Specials</span>
                    <h3 className="font-serif-luxury text-3xl font-medium text-black mt-0.5">Spotlight Collection</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {PRODUCTS.filter(p => p.isFeatured).slice(0, 4).map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleNavigate(`product/${p.id}`)}
                        className="group cursor-pointer rounded-2xl border border-luxury-gray-200/40 bg-white p-4 space-y-3.5 transition-all hover:shadow-lg hover:border-silver-accent-500"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-luxury-gray-100">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-silver-accent-500 uppercase font-bold">{p.brand}</span>
                          <h4 className="text-xs font-serif-luxury font-medium text-black line-clamp-1">{p.name}</h4>
                          <p className="mono-premium text-xs text-luxury-gray-750 font-bold mt-1">${p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Submittal Block */}
                <Newsletter />
              </>
            )}

          </div>
        )}

      </main>

      {/* Floating Dynamic Navigation Back and Home Toolbar */}
      <HistoryNav currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Slide Drawer: Cart System */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Centered Modal: Sign In authenticator */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Corporate Footnotes Area */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
