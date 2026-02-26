// src/app/preview/RetryButton.tsx
'use client';

import { RefreshCw } from 'lucide-react';

export default function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-text font-medium text-sm sm:text-base shadow-sm active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      <span className="sm:hidden">Reload</span>
      <span className="hidden sm:inline">Reload Preview</span>
    </button>
  );
}