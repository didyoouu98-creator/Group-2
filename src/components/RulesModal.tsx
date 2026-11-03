import React from 'react';
import { X, CheckCircle2, ShieldCheck, Timer, Award, TrendingUp } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Attendance & Game System Protocol</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-600" />
              <span>1. Mandatory 2-Minute Accounting Check-In</span>
            </div>
            <p className="leading-relaxed">
              Every accounting team member logs their daily attendance by completing a 120-second (2 minute) terminology session. This activates technical focus and captures a verified attendance timestamp.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>2. Practical Accounting & Code of Conduct</span>
            </div>
            <p className="leading-relaxed">
              Questions focus on fundamental bookkeeping rules (debits, credits, assets, liabilities, accruals) and the professional Accountant's Code of Conduct (integrity, objectivity, confidentiality, independence). Answers are not given away below, ensuring genuine recall practice.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>3. Periodic Manager Reviews & Performance Reports</span>
            </div>
            <p className="leading-relaxed">
              Accounting managers access weekly and monthly analytics summarizing turnout punctuality, average solve score, and professional agility (WPM) to generate periodic performance audits and training reports.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
