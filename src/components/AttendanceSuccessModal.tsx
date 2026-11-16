import React from 'react';
import { CheckCircle2, Clock, ArrowRight, BookOpen, Info, Gift } from 'lucide-react';
import { AttendanceRecord, Employee } from '../types';
import { getManagerFollowUpStatus } from '../services/attendanceStorage';

interface AttendanceSuccessModalProps {
  record: AttendanceRecord;
  employee: Employee;
  onPlayQuiz: () => void;
  onSkip: () => void;
}

export const AttendanceSuccessModal: React.FC<AttendanceSuccessModalProps> = ({
  record,
  employee,
  onPlayQuiz,
  onSkip,
}) => {
  const missedCount = employee.consecutiveMissedQuizzes || 0;
  const followUpStatus = getManagerFollowUpStatus(employee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Banner with Medallion */}
        <div className="relative p-6 bg-slate-950 text-white text-center overflow-hidden">
          <div className="relative flex flex-col items-center">
            <div className="w-14 h-14 mb-3 rounded-xl overflow-hidden border-2 border-indigo-500/40 shadow-lg bg-slate-900">
              <img
                src="/src/assets/images/hero_badge_trophy_1793666751651.jpg"
                alt="Attendance Badge"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Attendance Confirmed</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Welcome, {employee.name}!
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Your shift check-in is officially recorded. Quiz participation does not affect attendance records.
            </p>
          </div>
        </div>

        {/* Confirmation Details Strip */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Confirmed Timestamp Strip */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500">Confirmed Clock-In Time</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {record.checkInTime}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${
                record.attendanceStatus === 'ON_TIME'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : record.attendanceStatus === 'LATE'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}>
                {record.attendanceStatus === 'ON_TIME'
                  ? 'Punctual (On-Time)'
                  : record.attendanceStatus === 'LATE'
                  ? 'Late Arrival'
                  : 'Not Evaluated'}
              </span>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">{record.date}</div>
            </div>
          </div>

          {/* Supportive Reminder if there are missed weekly quizzes */}
          {missedCount > 0 && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                missedCount >= 3 && followUpStatus === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : missedCount >= 3 && followUpStatus === 'plan_recorded'
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <Info
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  missedCount >= 3 && followUpStatus === 'completed'
                    ? 'text-emerald-600'
                    : missedCount >= 3 && followUpStatus === 'plan_recorded'
                    ? 'text-indigo-600'
                    : 'text-amber-600'
                }`}
              />
              <div className="leading-relaxed">
                {missedCount >= 3 && followUpStatus === 'completed' ? (
                  <>
                    <strong>Check-In Completed ({missedCount} Consecutive Missed Weekly Quizzes):</strong>{' '}
                    Your supportive check-in has been completed. Completing your weekly quiz resets the counter with zero penalty.
                  </>
                ) : missedCount >= 3 && followUpStatus === 'plan_recorded' ? (
                  <>
                    <strong>Support Plan Recorded ({missedCount} Consecutive Missed Weekly Quizzes):</strong>{' '}
                    Your manager has recorded a learning support plan. Your weekly quiz remains available anytime with zero penalty.
                  </>
                ) : missedCount >= 5 ? (
                  <>
                    <strong>Manager Check-In Recommended ({missedCount} Consecutive Missed Weekly Quizzes):</strong>{' '}
                    Your weekly quiz remains available anytime with zero automatic penalty or reward restrictions.
                  </>
                ) : missedCount >= 3 ? (
                  <>
                    <strong>Learning Support Available ({missedCount} Consecutive Missed Weekly Quizzes):</strong>{' '}
                    You can complete the weekly quiz below or share feedback via the optional support survey.
                  </>
                ) : (
                  <>
                    <strong>Friendly Reminder ({missedCount} Missed Weekly Quiz):</strong>{' '}
                    One quiz per week is required under our learning policy. Deferring with &quot;Complete Later&quot; does not count as missed before the week ends.
                  </>
                )}
              </div>
            </div>
          )}

          {/* Department Weekly Quiz & Non-Taxable Benefits Callout */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-950">
                Required Weekly Quiz · {employee.department}
              </span>
              <span className="text-slate-600 font-medium">
                1 per week · 4 Questions
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Refresh practical workplace knowledge for <strong>{employee.department}</strong> with alternating multiple-choice questions and terminology puzzles. Additional optional quizzes are also available anytime.
            </p>

            <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Earn points toward non-taxable Time Off, Courses, and Workplace Perks</span>
            </div>
          </div>

          {/* Two Clean Action Buttons: Complete Later vs Take Weekly Quiz */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onSkip}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Complete Later
            </button>

            <button
              type="button"
              onClick={onPlayQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Take Weekly Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
