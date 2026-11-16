import React, { useState } from 'react';
import { X, Info, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Employee, MissedQuizFeedback } from '../types';
import { MISSED_QUIZ_SURVEY_REASONS } from '../data/benefitsCatalog';
import { formatLocalDate } from '../services/attendanceStorage';

interface MissedQuizSurveyModalProps {
  employee: Employee;
  missedStreak: number;
  onSubmitSurvey: (feedback: MissedQuizFeedback, startWeeklyQuizNow: boolean) => void;
  onClose: () => void;
}

export const MissedQuizSurveyModal: React.FC<MissedQuizSurveyModalProps> = ({
  employee,
  missedStreak,
  onSubmitSurvey,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleConfirm = (startWeeklyQuizNow: boolean) => {
    if (!selectedReason) {
      setValidationError('Please select a reason before submitting the support survey.');
      return;
    }

    const feedback: MissedQuizFeedback = {
      id: `fb-${Date.now()}-${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      date: formatLocalDate(new Date()),
      missedStreak,
      reason: selectedReason,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    onSubmitSurvey(feedback, startWeeklyQuizNow);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
              <Info className="w-4 h-4" />
              <span>Optional Learning Support Survey · {missedStreak} Consecutive Missed Weekly Quizzes</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              How can we support your learning, {employee.name.split(' ')[0]}?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We noticed that you have missed {missedStreak} consecutive weekly quizzes. If something is making participation difficult, you can complete this short optional survey to help us understand how we can support your learning.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close survey"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          <div className="space-y-2.5">
            <label className="block font-bold text-slate-900">
              What made it difficult to participate in recent weekly quizzes?
            </label>

            <div className="space-y-2">
              {MISSED_QUIZ_SURVEY_REASONS.map(reason => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason);
                      setValidationError(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </span>
                    <span>{reason}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">
              Additional Context or Support Request (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              placeholder="Let us know if you need workload adjustment, schedule flexibility, or learning resources..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none text-xs"
            />
          </div>

          {/* Supportive Learning Policy Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-900">Support-First Policy:</strong> This survey is optional and notifies your manager that learning support may be needed. Missed weekly quizzes do not affect attendance records, never reduce performance ratings, and never restrict previously earned rewards.
            </div>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium">
              {validationError}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleConfirm(false)}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Submit Support Survey
            </button>

            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Submit &amp; Take Weekly Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
