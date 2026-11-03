import React from 'react';
import { ShieldCheck, UserCheck, BarChart3, HelpCircle } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenRules: () => void;
  pendingCheckInsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenRules,
  pendingCheckInsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs">
            VS
          </div>
          <button
            onClick={() => onNavigate('terminal')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors text-left"
          >
            VerbaShift
          </button>
        </div>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('terminal')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'terminal'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Employee Terminal
          </button>

          <button
            onClick={() => onNavigate('manager')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'manager'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Manager Portal
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'reports'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Periodic Reports
          </button>

          <button
            onClick={onOpenRules}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 text-slate-500 py-1"
          >
            Game Protocol
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'terminal' ? (
            <button
              onClick={() => onNavigate('manager')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              Manager Dashboard
            </button>
          ) : (
            <button
              onClick={() => onNavigate('terminal')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              Clock-In Terminal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
