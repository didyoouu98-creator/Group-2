import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenRules: () => void;
  onResetDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenRules,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs">
            L&amp;D
          </div>
          <button
            type="button"
            onClick={() => onNavigate('terminal')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors text-left cursor-pointer"
          >
            Enterprise L&amp;D Management
          </button>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('terminal')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'terminal'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Employee Portal</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('manager')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              currentView === 'manager'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Manager Portal
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 text-slate-600 py-1 cursor-pointer"
          >
            L&amp;D Protocol
          </button>

          {onResetDemo && (
            <button
              type="button"
              onClick={onResetDemo}
              className="transition-colors whitespace-nowrap shrink-0 text-slate-400 hover:text-slate-700 py-1 cursor-pointer flex items-center gap-1"
              title="Reset fictional demo data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary switch button */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'terminal' ? (
            <button
              type="button"
              onClick={() => onNavigate('manager')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
            >
              Manager Portal
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('terminal')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
            >
              Employee Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
