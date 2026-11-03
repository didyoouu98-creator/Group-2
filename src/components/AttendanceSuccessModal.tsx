import React from 'react';
import { CheckCircle2, Trophy, Clock, Zap, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { AttendanceRecord, Employee } from '../types';

interface AttendanceSuccessModalProps {
  record: AttendanceRecord;
  employee: Employee;
  onClose: () => void;
  onGoToManagerView: () => void;
}

export const AttendanceSuccessModal: React.FC<AttendanceSuccessModalProps> = ({
  record,
  employee,
  onClose,
  onGoToManagerView,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Banner with Trophy Medallion */}
        <div className="relative p-6 bg-slate-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 mb-3 rounded-xl overflow-hidden border-2 border-indigo-500/40 shadow-lg bg-slate-900">
              <img
                src="/src/assets/images/hero_badge_trophy_1793666751651.jpg"
                alt="Attendance Achievement Badge"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Attendance Verified & Logged</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Good Morning, {employee.name}!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your official check-in for today has been recorded in the company portal.
            </p>
          </div>
        </div>

        {/* Attendance Verification Stamp & Stats */}
        <div className="p-6 space-y-6">
          {/* Official Timestamp Strip */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Clock-In Timestamp</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {record.checkInTime}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${
                record.attendanceStatus === 'ON_TIME'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {record.attendanceStatus === 'ON_TIME' ? 'Punctual (On-Time)' : 'Late Arrival'}
              </span>
              <div className="text-[11px] text-slate-400 mt-0.5">{record.date}</div>
            </div>
          </div>

          {/* Performance Readiness Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">Cognitive Focus Score</div>
              <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {record.gameStats.score} pts
              </div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1">
                {record.gameStats.wordsSolved} words solved
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">Mental Readiness</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {record.gameStats.cognitiveRating}
              </div>
              <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-1">
                {record.gameStats.wpm} WPM · {record.gameStats.accuracyPct}% accuracy
              </div>
            </div>
          </div>

          {/* Turnout Streak Badge */}
          <div className="flex items-center justify-between p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-950">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Consecutive Day Attendance Streak:</span>
            </div>
            <span className="font-bold font-mono text-sm text-indigo-700">
              {employee.attendanceStreak} Days 🔥
            </span>
          </div>

          {/* Modal Action Controls */}
          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              onClick={onGoToManagerView}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Open Manager Review
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <span>Back to Employee Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
