/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, ShieldCheck, Ticket, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { Product } from '../types';
import { openPaystackCheckout, PaystackTransaction } from '../lib/paystack';

type CartEntry = {
  _id: string;
  productId: string;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
  product: Product | null;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartEntry[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderComplete?: (orderId: string) => void;
  userEmail?: string | null;
  userId?: string | null;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderComplete,
  userEmail,
  userId
}: CartDrawerProps) {
  // Navigation tabs inside drawer: 'cart' | 'checkout' | 'success'
  const [activeStep, setActiveStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Checkout Form fields
  const [fullName, setFullName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [cityField, setCityField] = useState('');
  const [zipField, setZipField] = useState('');
  const [isSimulatingOrder, setIsSimulatingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [lastOrderRef, setLastOrderRef] = useState('');

  if (!isOpen) return null;

  // Calculative Values
  const subtotalSum = cart.reduce((acc, item) => acc + (item.product?.price ?? 0) * item.quantity, 0);
  const discountSum = Math.round(subtotalSum * (discountPercent / 100));
  const shippingCost = subtotalSum > 500 ? 0 : 25; // Free premium air transport over $500
  const finalTotalSum = subtotalSum - discountSum + shippingCost;

  // Handle promo code verification
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = promoCode.toUpperCase().trim();
    if (normalized === 'PLATINUM') {
      setDiscountPercent(15);
      setPromoSuccess('✓ 15% PLATINUM coupon accredited!');
      setPromoError('');
    } else if (normalized === 'LUXURY') {
      setDiscountPercent(20);
      setPromoSuccess('✓ 20% ELITE coupon accredited!');
      setPromoError('');
    } else {
      setPromoError('Coupon invalid or has expired.');
      setPromoSuccess('');
    }
  };

  // Perform checkout action with Paystack
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !shippingAddress) {
      alert('Kindly fulfill all shipping attributes.');
      return;
    }
    if (!userEmail || !userId) {
      alert('Authentication required for payment.');
      return;
    }
    if (finalTotalSum <= 0) {
      alert('Cart is empty or invalid total.');
      return;
    }

    setIsSimulatingOrder(true);
    setPaymentError('');

    openPaystackCheckout({
      email: userEmail,
      amount: finalTotalSum,
      currency: 'NGN',
      userId,
      cartItems: cart.map((item) => ({
        name: `${item.product?.brand ?? ''} ${item.product?.name ?? ''}`,
        quantity: item.quantity,
        price: item.product?.price ?? 0,
      })),
      onSuccess(_transaction: PaystackTransaction) {
        setLastOrderRef(_transaction.reference);
        setIsSimulatingOrder(false);
        setActiveStep('success');
        onOrderComplete?.(_transaction.reference);
        onClearCart();
      },
      onClose() {
        setIsSimulatingOrder(false);
        setPaymentError('Payment was cancelled. Your cart is still intact.');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Slide Drawer Content container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col animate-[slideLeft_0.4s_ease-out]">
        
        {/* Visual Silver Accent Edge Top */}
        <div className="metallic-silver-shine h-1.5 w-full" />

        {/* Header Ribbon bar */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-luxury-gray-200/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-quantum shadow-sm">
              <ShoppingBag className="h-4.5 w-4.5 text-black" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold tracking-tight text-black">
                {activeStep === 'cart' ? 'Shopping Bag' : activeStep === 'checkout' ? 'Sterling Checkout' : 'Order Documented'}
              </h3>
              <p className="text-[10px] text-luxury-gray-400 font-mono uppercase tracking-wider">
                {activeStep === 'cart' ? `${cart.length} unique shoe categories` : activeStep === 'checkout' ? 'TLS Encrypted' : 'Success'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-luxury-gray-100 text-luxury-gray-400 hover:text-black hover:border-luxury-gray-300 transition-colors"
            title="Close Drawer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Core dynamic body based on active step */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
          {activeStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                /* Empty Cart block */
                <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-luxury-gray-100 text-luxury-gray-450 border border-luxury-gray-200">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-xl font-medium text-black">Empty Shopping Bag</h4>
                    <p className="text-xs text-luxury-gray-500 mt-1.5 max-w-xs">
                      Navigate back to our brand rooms or luxury drop gallery to curate your collection.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-black px-6 py-2.5 text-xs font-semibold tracking-wider text-white uppercase hover:bg-silver-accent-500 hover:text-black transition-all"
                  >
                    Examine Catalog
                  </button>
                </div>
              ) : (
                /* Filled Cart Items panel */
                <div className="space-y-5">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-3.5 rounded-2xl border border-luxury-gray-150 bg-luxury-gray-50/20"
                      >
                        <img
                          src={item.product?.images?.[0] ?? ''}
                          alt={item.product?.name ?? ''}
                          className="h-16 w-16 rounded-xl object-cover border border-luxury-gray-200 bg-white"
                        />
                        
                        <div className="flex-1 overflow-hidden">
                          <span className="text-[9px] font-bold text-luxury-gray-400 uppercase font-mono tracking-wider">
                            {item.product?.brand}
                          </span>
                          <h4 className="text-xs font-serif-luxury font-semibold text-black leading-tight truncate">
                            {item.product?.name}
                          </h4>
                          <p className="text-[10px] text-luxury-gray-500 font-mono mt-0.5">
                            US {item.selectedSize} • {item.selectedColor}
                          </p>
                        </div>

                        {/* Adjusters and price sum column */}
                        <div className="flex flex-col items-end gap-2.5">
                          <span className="mono-premium text-xs font-bold text-black">${(item.product?.price ?? 0) * item.quantity}</span>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 items-center rounded-lg border border-luxury-gray-200 bg-white overflow-hidden">
                              <button
                                onClick={() => onUpdateQty(item._id, item.quantity - 1)}
                                className="px-2 h-full text-luxury-gray-500 hover:bg-luxury-gray-100 hover:text-black"
                                title="Subtract"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2.5 text-xs font-mono font-bold text-black">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQty(item._id, item.quantity + 1)}
                                className="px-2 h-full text-luxury-gray-500 hover:bg-luxury-gray-100 hover:text-black"
                                title="Add"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item._id)}
                              className="text-luxury-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50"
                              title="Discard"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo coupon wrapper interactive */}
                  <form onSubmit={handleApplyPromo} className="border-t border-luxury-gray-200/50 pt-5 space-y-2">
                    <label className="text-[9px] font-bold tracking-widest text-luxury-gray-405 uppercase font-mono block">Promo Blueprint Coupon</label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex h-9.5 items-center rounded-lg border border-luxury-gray-200 bg-white px-3 focus-within:border-black">
                        <Ticket className="h-3.5 w-3.5 text-luxury-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Try PLATINUM (-15%) or LUXURY (-20%)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full bg-transparent text-xs text-black outline-none font-mono placeholder-luxury-gray-350"
                        />
                      </div>
                      <button
                        type="submit"
                        className="h-9.5 rounded-lg bg-black text-[10px] font-bold tracking-widest text-white uppercase px-4 hover:bg-silver-accent-500 hover:text-black transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] text-red-600 font-semibold">{promoError}</p>}
                    {promoSuccess && <p className="text-[10px] text-green-600 font-semibold">{promoSuccess}</p>}
                  </form>
                </div>
              )}
            </>
          )}

          {activeStep === 'checkout' && (
            /* Secure TLS Checkout form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="rounded-xl bg-luxury-gray-100 p-4 border border-luxury-gray-200/40 space-y-3.5">
                <h4 className="text-[11px] font-bold tracking-widest text-black uppercase font-mono">Consolidated Sum Breakdown</h4>
                
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-luxury-gray-500">Cart Subtotal</span>
                  <span className="font-semibold text-black">${subtotalSum}</span>
                </div>

                {discountSum > 0 && (
                  <div className="flex justify-between text-xs font-mono text-green-600">
                    <span>Discount Coupon ({discountPercent}%)</span>
                    <span>-${discountSum}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs font-mono">
                  <span className="text-luxury-gray-500">Express Air Transport</span>
                  <span className="font-semibold text-black">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>

                <div className="border-t border-luxury-gray-200 pt-2 flex justify-between text-sm font-semibold uppercase">
                  <span>Grand Total</span>
                  <span className="mono-premium text-base font-bold text-black">${finalTotalSum}</span>
                </div>
              </div>

              {/* Shipping section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono border-b border-luxury-gray-100 pb-1.5">
                  1. Transit Specifications
                </h4>

                <div>
                  <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Inscriber Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clint Pete"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs text-black outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Luxury Road, Penthouse suite 4"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs text-black outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">City / State</label>
                    <input
                      type="text"
                      required
                      placeholder="Geneva"
                      value={cityField}
                      onChange={(e) => setCityField(e.target.value)}
                      className="mt-1 h-10 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs text-black outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-luxury-gray-400 uppercase font-mono">Transit Zipcode</label>
                    <input
                      type="text"
                      required
                      placeholder="1201"
                      value={zipField}
                      onChange={(e) => setZipField(e.target.value)}
                      className="mt-1 h-10 w-full rounded-lg border border-luxury-gray-200 bg-white px-3 text-xs text-black outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Secure Payment section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono border-b border-luxury-gray-100 pb-1.5">
                  2. Secure Payment via Paystack
                </h4>

                <div className="rounded-xl border border-luxury-gray-200 bg-luxury-gray-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-[10px] font-bold tracking-wider text-luxury-gray-600 uppercase font-mono">
                      256-bit TLS Encrypted Checkout
                    </span>
                  </div>
                  <p className="text-[10px] text-luxury-gray-500 leading-relaxed">
                    You will be redirected to Paystack's secure payment page to complete your purchase. 
                    Card, bank transfer, and USSD options are available.
                  </p>
                </div>

                {paymentError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-600 font-semibold">{paymentError}</p>
                  </div>
                )}
              </div>

              {/* TLS Status Disclaimer */}
              <div className="flex items-center gap-2 rounded-xl border border-luxury-gray-200 bg-luxury-gray-100/50 p-3.5 text-[9px] text-luxury-gray-500 font-mono uppercase tracking-wide">
                <ShieldCheck className="h-4.5 w-4.5 text-black" />
                <span>Payments powered by Paystack - PCI DSS compliant</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStep('cart')}
                  className="w-1/3 h-12 rounded-xl border border-luxury-gray-300 text-xs font-semibold tracking-wider text-luxury-gray-700 uppercase hover:bg-luxury-gray-100"
                >
                  Subtotals
                </button>
                <button
                  type="submit"
                  disabled={isSimulatingOrder}
                  className="w-2/3 h-12 rounded-xl bg-black text-xs font-semibold tracking-wider text-white uppercase hover:bg-silver-accent-500 hover:text-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSimulatingOrder ? (
                    <>
                      {/* Animated Spinner scale */}
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Initiating Paystack...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Pay with Paystack</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeStep === 'success' && (
            /* Successful Transaction Page layout output */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-[scaleIn_0.4s_ease-out]">
              <div className="relative">
                {/* Visual ripple pulse rings */}
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-60" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black text-white border border-silver-accent-300 shadow-lg">
                  <ShieldCheck className="h-8 w-8 text-silver-accent-300" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.25em] text-silver-accent-505 uppercase font-mono block">
                  TRANSACTION ACCREDITED
                </span>
                <h3 className="font-serif-luxury text-3xl font-semibold text-black leading-tight">
                  Package Directed for Dispatch
                </h3>
                <p className="text-xs text-luxury-gray-500 max-w-sm mx-auto leading-relaxed">
                  Your luxury footwear order has passed validation. A copy of the transport manifest has been routed toclintpete06@gmail.com.
                </p>
              </div>

              {/* Simulated shipment properties */}
              <div className="rounded-2xl border border-luxury-gray-200/50 bg-luxury-gray-100 p-5 w-full max-w-sm space-y-3.5 text-left text-xs font-mono">
                <div>
                  <p className="text-[10px] text-luxury-gray-400 uppercase font-semibold">Consignee Inscriber</p>
                  <p className="font-bold text-black">{fullName || 'Clint Pete'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-luxury-gray-400 uppercase font-semibold">Air Freight Address</p>
                  <p className="font-medium text-luxury-gray-800">{shippingAddress || 'Penthouse 4, Geneva'}</p>
                </div>
                <div className="flex justify-between border-t border-luxury-gray-200/40 pt-3">
                  <div>
                    <p className="text-[10px] text-luxury-gray-400 uppercase font-semibold">Payment Reference</p>
                    <p className="font-semibold text-black">{lastOrderRef || 'BF-SHP-MANIFEST_8902AA'}</p>
                  </div>
                  <span className="rounded-full bg-green-600 text-white text-[8px] font-bold px-2 py-0.5 h-fit select-none">
                    PAID
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveStep('cart');
                  onClose();
                }}
                className="w-full max-w-sm h-12 rounded-xl bg-black text-xs font-semibold tracking-wider text-white uppercase hover:bg-silver-accent-400 hover:text-black transition-all"
              >
                Conclude Session and Continue
              </button>
            </div>
          )}
        </div>

        {/* Footer Area with Subtotals overview if on cart stage */}
        {activeStep === 'cart' && cart.length > 0 && (
          <div className="p-6 bg-luxury-gray-100 border-t border-luxury-gray-200/50 space-y-4">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-luxury-gray-500">Cart Subtotal</span>
                <span className="font-semibold text-black">${subtotalSum}</span>
              </div>
              {discountSum > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Deduction ({discountPercent}%)</span>
                  <span>-${discountSum}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-luxury-gray-500">Transit Duty</span>
                <span className="font-semibold text-black">Calculated next</span>
              </div>
              <div className="border-t border-luxury-gray-200 pt-2 flex justify-between text-sm font-semibold uppercase font-sans">
                <span className="text-black">Pre-delivery Subtotal</span>
                <span className="mono-premium text-base font-bold text-black">${subtotalSum - discountSum}</span>
              </div>
            </div>

            <button
              id="btn-cart-checkout-proceed"
              onClick={() => setActiveStep('checkout')}
              className="w-full h-12 rounded-xl bg-black text-xs font-semibold tracking-wider text-white uppercase hover:bg-silver-accent-500 hover:text-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
