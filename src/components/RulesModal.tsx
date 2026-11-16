import React from 'react';
import { X, ShieldCheck, Timer, BookOpen, Gift, Users } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Employee Learning Protocol &amp; Benefits Policy</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-600" />
              <span>1. Attendance Independence</span>
            </div>
            <p className="leading-relaxed">
              Staff clock in and out using their Employee ID. Quiz participation does not affect attendance records. Deferring a weekly quiz (&quot;Complete Later&quot;) records quiz status as &quot;Not Participated&quot; without altering or invalidating attendance.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>2. Weekly Required &amp; Optional Quizzes</span>
            </div>
            <p className="leading-relaxed">
              Each employee has <strong>one required quiz per week</strong>, and additional quizzes are optional. Only missed required weekly quizzes count toward follow-up thresholds. Completing a required weekly quiz resets the consecutive-miss counter to zero.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>3. Supportive Missed-Quiz Follow-Up Thresholds</span>
            </div>
            <p className="leading-relaxed">
              · <strong>1 missed week:</strong> Triggers a friendly reminder.<br />
              · <strong>3 consecutive missed weeks:</strong> Triggers an optional support survey and notifies the manager that learning support may be needed.<br />
              · <strong>5 consecutive missed weeks:</strong> Triggers a supportive manager check-in to understand challenges and discuss possible learning support.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
            <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-900">
              <Gift className="w-4 h-4 text-emerald-700" />
              <span>4. Zero Automatic Penalties &amp; Non-Taxable Benefits</span>
            </div>
            <p className="leading-relaxed text-emerald-900">
              Missed quizzes do not automatically reduce performance ratings or restrict previously earned rewards. Employees earn points from quizzes toward non-taxable Time Off, Professional Development, and Practical/Fun Rewards. Departments with zero eligible staff display &quot;N/A&quot; for participation rate.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
