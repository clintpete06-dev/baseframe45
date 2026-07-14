/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div
      id="newsletter-section"
      className="rounded-3xl border border-luxury-gray-200/50 bg-black text-white p-8 md:p-12 relative overflow-hidden shadow-2xl"
    >
      {/* Background radial soft light gradient */}
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-slate-50/5 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-silver-accent-300 uppercase font-mono">
            Atelier Dispatch
          </span>
          <h3 className="font-serif-luxury text-3xl md:text-4xl font-light mt-1 text-white leading-tight">
            Accredit the Inner Circle
          </h3>
          <p className="text-xs text-luxury-gray-400 mt-2 max-w-md">
            Receive exclusive updates on ultra-rare drops, vintage reissues, and members-only pricing multipliers.
          </p>
        </div>

        <div>
          {submitted ? (
            /* Successful newsletter subscription banner */
            <div className="rounded-2xl border border-zinc-750 bg-zinc-900/40 p-5 space-y-2 animate-[fadeIn_0.5s_ease-out]">
              <p className="text-sm font-semibold text-white uppercase tracking-wider font-serif-luxury">✓ Membership Recorded</p>
              <p className="text-xs text-luxury-gray-400">
                You will receive private telegram notifications and exclusive codes in your inbox shortly.
              </p>
            </div>
          ) : (
            /* Interactive email submission input */
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex h-12 items-center rounded-xl bg-zinc-900 border border-zinc-800 px-4 transition-all focus-within:border-white focus-within:bg-zinc-950">
                  <Mail className="h-4.5 w-4.5 text-luxury-gray-500 mr-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-white outline-none placeholder-luxury-gray-550"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-white text-xs font-semibold tracking-wider text-black uppercase px-6 hover:bg-silver-accent-400 hover:text-black transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-luxury-gray-500 font-mono uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>We respect your data. Zero promotional junk, always curated quality.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
