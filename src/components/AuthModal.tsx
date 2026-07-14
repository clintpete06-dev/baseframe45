/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, User, Mail, ShieldCheck, Award, ShoppingBag, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userEmail: string | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
}

const GoogleIcon = () => (
  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal({
  isOpen,
  onClose,
  isAuthenticated,
  userEmail,
  onLogin,
  onLogout
}: AuthModalProps) {
  // Mode state: 'register' | 'login'
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);
  
  // Input fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  // Simulate Registration or Login action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalFullName = fullName.trim();
    let finalUsername = username.trim();
    let finalEmail = email.trim();
    let finalPassword = password;

    // Fill in default luxury values if fields are not completed, providing instantaneous premium access
    if (mode === 'register') {
      if (!finalFullName) finalFullName = 'Clint Pete';
      if (!finalUsername) finalUsername = 'clintpete';
      if (!finalEmail) finalEmail = 'clintpete06@gmail.com';
      if (!finalPassword || finalPassword.length < 8) finalPassword = 'premium12345';
      
      setFullName(finalFullName);
      setUsername(finalUsername);
      setEmail(finalEmail);
      setPassword(finalPassword);
    } else {
      if (!finalEmail) finalEmail = 'clintpete06@gmail.com';
      if (!finalPassword) finalPassword = 'premium12345';
      
      setEmail(finalEmail);
      setPassword(finalPassword);
    }

    setIsSimulating(true);
    setErrorMsg('');
    
    // Simulate luxury authentication sequence delay
    setTimeout(() => {
      setIsSimulating(false);
      onLogin(finalEmail);
      setSuccessMsg(mode === 'register' ? 'Atelier profile registered successfully!' : 'Welcome back to the Atelier.');
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsSimulating(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsSimulating(false);
      onLogin('guest.collector@google.com');
      setSuccessMsg('Authenticated with Google Secure Access');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Luxury Light Card Container - perfectly matched with the luxury-gray/white theme of the website */}
      <div
        id="auth-modal-card"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-luxury-gray-200/80 bg-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] z-10 animate-[scaleIn_0.3s_ease]"
      >
        {/* Subtle warm bronze top highlight bar */}
        <div className="h-[2px] w-full bg-[#C89B5C]" />

        {/* Modal Dismiss Trigger */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full border border-luxury-gray-200 bg-luxury-gray-50 flex items-center justify-center text-luxury-gray-400 hover:text-[#C89B5C] hover:border-[#C89B5C] transition-all duration-300 cursor-pointer"
          title="Close Modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 sm:p-10">
          {isAuthenticated ? (
            /* Premium Authenticated Dashboard */
            <div className="space-y-8 py-4 animate-[fadeIn_0.4s_ease-out]">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-luxury-gray-50 border border-[#C89B5C]/30 text-[#C89B5C]">
                  <User className="h-7 w-7" />
                </div>
                <h3 className="font-sora text-2xl font-bold tracking-tight text-luxury-gray-900">
                  Atelier Member Profile
                </h3>
                <p className="mono-premium text-xs text-luxury-gray-500 truncate max-w-sm mx-auto">
                  {userEmail}
                </p>
              </div>

              {/* Status block with subtle luxury glow */}
              <div className="rounded-2xl border border-luxury-gray-200 bg-luxury-gray-50/50 p-5 space-y-4 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#C89B5C] to-[#E5BA83] text-black">
                    <Award className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#C89B5C] uppercase font-sora block">
                      VIP Membership Rank
                    </span>
                    <p className="text-sm font-semibold text-luxury-gray-900 font-sora">
                      Platinum Luxury Tier
                    </p>
                  </div>
                </div>

                <div className="border-t border-luxury-gray-200 pt-4 flex items-center justify-between font-mono">
                  <div>
                    <p className="text-[10px] text-luxury-gray-400 uppercase tracking-wider">Acquired BasePoints</p>
                    <p className="text-2xl font-extrabold text-[#C89B5C] mt-0.5">1,450 XP</p>
                  </div>
                  <span className="rounded-full bg-luxury-gray-200 px-3 py-1.5 text-[9px] text-luxury-gray-800 uppercase tracking-wider">
                    Next Reward at 2,000 XP
                  </span>
                </div>
              </div>

              {/* Recent Orders tracker details */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#C89B5C] uppercase font-sora">
                  Recent Shipment Manifest
                </p>
                <div className="rounded-xl border border-luxury-gray-200 bg-luxury-gray-50/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-4.5 w-4.5 text-[#C89B5C]" />
                    <span className="text-xs font-semibold text-luxury-gray-900 font-sora">Order #BF-9024AA</span>
                  </div>
                  <span className="rounded-full bg-luxury-gray-50 border border-[#C89B5C]/20 text-[#C89B5C] px-3 py-1 text-[9px] font-mono tracking-wider font-bold">
                    IN AIR FREIGHT
                  </span>
                </div>
              </div>

              <div className="border-t border-luxury-gray-200 pt-6 flex gap-3">
                <button
                  onClick={onLogout}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-luxury-gray-200 text-xs font-semibold tracking-wider text-luxury-gray-650 hover:text-[#C89B5C] hover:border-[#C89B5C] uppercase transition-all hover:bg-luxury-gray-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Relinquish Session</span>
                </button>
              </div>
            </div>
          ) : (
            /* Premium Website-Matched Light Theme Registration & Login View */
            <div className="space-y-6">
              
              {/* Heading description section */}
              <div className="text-center space-y-1.5 mb-2">
                <h2 className="font-bebas text-4xl tracking-[0.08em] text-luxury-gray-900">
                  {mode === 'register' ? 'Atelier Registration' : 'Atelier Authentication'}
                </h2>
                <p className="text-xs text-luxury-gray-500 font-sans">
                  {mode === 'register'
                    ? 'Inscribe for private pricing and elite footwear releases.'
                    : 'Acknowledge your private member profile to continue.'}
                </p>
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-luxury-gray-50 border border-red-500/30 p-4 text-xs text-red-600 font-medium animate-[fadeIn_0.3s_ease]">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl bg-luxury-gray-50 border border-[#C89B5C]/30 p-4 text-xs text-[#C89B5C] font-medium animate-[fadeIn_0.3s_ease]">
                  {successMsg}
                </div>
              )}

              {/* Large Continue with Google button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-full border border-luxury-gray-200 bg-white text-xs font-sora font-semibold uppercase tracking-[0.15em] text-luxury-gray-800 hover:border-[#C89B5C] hover:bg-luxury-gray-50 hover:shadow-[0_4px_12px_rgba(200,155,92,0.1)] transition-all duration-300 cursor-pointer"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* Divider component OR EMAIL */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-luxury-gray-200/80" />
                </div>
                <span className="relative bg-white px-4 font-sora text-[10px] font-extrabold tracking-[0.25em] text-luxury-gray-400">
                  OR EMAIL
                </span>
              </div>

              {/* Main Submit Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {mode === 'register' && (
                  /* Two column field for Full Name and Username */
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bebas text-sm tracking-[0.15em] text-[#C89B5C] uppercase block mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Clint Pete"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 w-full rounded-xl border border-luxury-gray-200 bg-white px-3.5 text-xs text-luxury-gray-900 placeholder-luxury-gray-400 shadow-inner outline-none transition-all duration-300 focus:border-[#C89B5C] focus:ring-1 focus:ring-[#C89B5C]"
                      />
                    </div>
                    <div>
                      <label className="font-bebas text-sm tracking-[0.15em] text-[#C89B5C] uppercase block mb-1.5">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="clintpete"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-11 w-full rounded-xl border border-luxury-gray-200 bg-white px-3.5 text-xs text-luxury-gray-900 placeholder-luxury-gray-400 shadow-inner outline-none transition-all duration-300 focus:border-[#C89B5C] focus:ring-1 focus:ring-[#C89B5C]"
                      />
                    </div>
                  </div>
                )}

                {/* Email address field */}
                <div>
                  <label className="font-bebas text-sm tracking-[0.15em] text-[#C89B5C] uppercase block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. collector@luxury.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-luxury-gray-200 bg-white pl-10 pr-4 text-xs text-luxury-gray-900 placeholder-luxury-gray-400 shadow-inner outline-none transition-all duration-300 focus:border-[#C89B5C] focus:ring-1 focus:ring-[#C89B5C]"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-luxury-gray-400" />
                  </div>
                </div>

                {/* Password field with lock icon and visibility eye */}
                <div>
                  <label className="font-bebas text-sm tracking-[0.15em] text-[#C89B5C] uppercase block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 premium characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-luxury-gray-200 bg-white pl-10 pr-11 text-xs text-luxury-gray-900 placeholder-luxury-gray-400 shadow-inner outline-none transition-all duration-300 focus:border-[#C89B5C] focus:ring-1 focus:ring-[#C89B5C]"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-luxury-gray-400" />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 h-5 w-5 flex items-center justify-center text-luxury-gray-400 hover:text-[#C89B5C] transition-colors cursor-pointer"
                      title="Toggle password view"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Fully Clickable REGISTER ACCOUNT Button with custom states */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSimulating}
                    className="w-full h-12 rounded-[16px] uppercase font-sora text-xs font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C89B5C] to-[#E5BA83] text-[#161312] hover:shadow-[0_4px_15px_rgba(200,155,92,0.35)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                  >
                    {isSimulating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Verifying Secure Vault...</span>
                      </>
                    ) : (
                      <span>{mode === 'register' ? 'Register Account' : 'Inscribe Session'}</span>
                    )}
                  </button>
                </div>

                {/* Clickable login toggle link right under the button */}
                <div className="text-center pt-2">
                  <p className="font-sans text-xs text-luxury-gray-550">
                    {mode === 'register' ? (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('login');
                            setErrorMsg('');
                          }}
                          className="text-[#C89B5C] hover:underline font-bold tracking-wide cursor-pointer"
                        >
                          Login here
                        </button>
                      </>
                    ) : (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('register');
                            setErrorMsg('');
                          }}
                          className="text-[#C89B5C] hover:underline font-bold tracking-wide cursor-pointer"
                        >
                          Register here
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {/* hCaptcha Small Centered Legal Text */}
                <div className="text-center font-sans text-[10px] text-luxury-gray-400 leading-relaxed max-w-sm mx-auto pt-3 border-t border-luxury-gray-100">
                  This site is protected by hCaptcha and its{' '}
                  <a
                    href="#/privacy"
                    onClick={(e) => { e.preventDefault(); onClose(); }}
                    className="text-[#C89B5C] hover:underline"
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="#/terms"
                    onClick={(e) => { e.preventDefault(); onClose(); }}
                    className="text-[#C89B5C] hover:underline"
                  >
                    Terms of Service
                  </a>{' '}
                  apply.
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
