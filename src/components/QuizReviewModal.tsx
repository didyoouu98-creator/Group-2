import React from 'react';
import { X, CheckCircle2, XCircle, BookOpen, Puzzle, Calendar, Award } from 'lucide-react';
import { QuizSessionRecord } from '../types';

interface QuizReviewModalProps {
  session: QuizSessionRecord;
  onClose: () => void;
}

export const QuizReviewModal: React.FC<QuizReviewModalProps> = ({ session, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                {session.department} Learning Session
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {session.date}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Quiz Results Review: {session.employeeName}
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">
              Score: <strong className="text-emerald-400 font-mono">{session.score}%</strong> ({session.correctCount} / {session.totalCount} Correct)
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Review Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Review of Questions & Explanations ({session.items.length} items)
          </div>

          <div className="space-y-3.5">
            {session.items.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                  item.isCorrect 
                    ? 'border-emerald-200 bg-emerald-50/40' 
                    : 'border-red-200 bg-red-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 flex items-center gap-1">
                        {item.type === 'mcq' ? <BookOpen className="w-3 h-3 text-indigo-600" /> : <Puzzle className="w-3 h-3 text-emerald-600" />}
                        <span>Question {idx + 1}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {item.topic}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.prompt}
                    </h4>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    item.isCorrect 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Response:</span>
                    <span className={`font-semibold ${item.isCorrect ? 'text-emerald-700' : 'text-red-700 font-mono'}`}>
                      {item.userAnswer}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Correct Solution:</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {item.correctAnswer}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Learning Explanation:</strong> {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-400 text-xs">
            Voluntary L&D session record
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
