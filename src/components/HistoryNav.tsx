/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface HistoryNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function HistoryNav({ currentPath, onNavigate }: HistoryNavProps) {
  // If we are on the home page, we can hide or show simple versions,
  // but let's make them elegant and consistently accessible.
  const isHome = currentPath === '' || currentPath === '/';

  const handleBack = () => {
    // Standard back behavior: if there's history, use browser history.
    // Otherwise, default back to home page.
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate('');
    }
  };

  return (
    <div id="history-nav-toolbar" className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Back Button */}
      {!isHome && (
        <button
          id="btn-nav-back"
          onClick={handleBack}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-luxury-gray-200/60 bg-white/90 text-luxury-gray-800 shadow-md backdrop-blur-md transition-all duration-300 hover:border-silver-accent-500 hover:bg-luxury-gray-100 hover:text-black hover:shadow-lg active:scale-95 focus:outline-none focus:ring-1 focus:ring-silver-accent-500"
          title="Go Back"
          aria-label="Back to previous page"
        >
          <ArrowLeft className="h-4 w-4 stroke-[1.5]" />
        </button>
      )}

      {/* Home Button */}
      <button
        id="btn-nav-home"
        onClick={() => onNavigate('')}
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-luxury-gray-200/60 bg-white/90 text-luxury-gray-800 shadow-md backdrop-blur-md transition-all duration-300 hover:border-silver-accent-500 hover:bg-luxury-gray-100 hover:text-black hover:shadow-lg active:scale-95 focus:outline-none focus:ring-1 focus:ring-silver-accent-500 ${
          isHome ? 'opacity-50 hover:opacity-100' : ''
        }`}
        title="Return to Home"
        aria-label="Return to homepage"
      >
        <Home className="h-4 w-4 stroke-[1.5]" />
      </button>
    </div>
  );
}
