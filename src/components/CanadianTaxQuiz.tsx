import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Trophy, RefreshCw, X, ShieldCheck, BookOpen } from 'lucide-react';
import { CanadianTaxQuizQuestion, Employee, GameStats } from '../types';
import { getRandomQuizSessionQuestions } from '../data/canadianTaxQuiz';
import { soundEffects } from '../services/soundEffects';

interface CanadianTaxQuizProps {
  employee: Employee;
  onActivityCompleted: (stats: GameStats) => void;
  onExit: () => void;
}

export const CanadianTaxQuiz: React.FC<CanadianTaxQuizProps> = ({
  employee,
  onActivityCompleted,
  onExit,
}) => {
  // Session draws exactly 3 random questions
  const [questions, setQuestions] = useState<CanadianTaxQuizQuestion[]>(() => getRandomQuizSessionQuestions(3));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
    soundEffects.playKeyPress();
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmittedAnswer) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    setHasSubmittedAnswer(true);

    if (isCorrect) {
      soundEffects.playCorrectWord(1);
    } else {
      soundEffects.playCountdownTick(true);
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: selectedOption,
        correct: isCorrect,
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      // Completed all 3 questions
      setIsCompleted(true);
      const totalCorrect = answersHistory.filter(a => a.correct).length + (selectedOption === currentQ.correctIndex ? 1 : 0);
      const percentage = Math.round((totalCorrect / questions.length) * 100);

      soundEffects.playAttendanceRegistered();

      const finalStats: GameStats = {
        durationSeconds: 90,
        score: totalCorrect * 100,
        wordsSolved: 0,
        wordsAttempted: 0,
        accuracyPct: percentage,
        wpm: 0,
        streak: totalCorrect,
        cognitiveRating: totalCorrect === 3 ? 'Peak Agility' : totalCorrect >= 2 ? 'High Focus' : 'Steady Readiness',
        activityType: 'mcq_quiz',
        quizScore: {
          correct: totalCorrect,
          total: questions.length,
          percentage,
        }
      };

      onActivityCompleted(finalStats);
    }
  };

  const handleRetryNewQuestions = () => {
    setQuestions(getRandomQuizSessionQuestions(3));
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setAnswersHistory([]);
    setIsCompleted(false);
  };

  // Completed Summary Screen
  if (isCompleted) {
    const totalCorrect = answersHistory.filter(a => a.correct).length;
    const percentage = Math.round((totalCorrect / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-7 h-7 text-indigo-300" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            Canadian Accounting & Tax Quiz Complete
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Session Score: {totalCorrect} / {questions.length} Correct ({percentage}%)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Great practice, {employee.name}! Optional activity completed. Your attendance was already registered upon clock-in.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Session Answer Review
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const ans = answersHistory.find(a => a.questionId === q.id);
              const isCorrect = ans ? ans.correct : false;

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-red-600" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-800">Correct Answer:</strong> {q.options[q.correctIndex]}
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                    <span className="font-semibold text-slate-700">CRA / Accounting Note:</span> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-3">
            <button
              onClick={handleRetryNewQuestions}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Try Another 3 Questions</span>
            </button>

            <button
              onClick={onExit}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>Return to Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Quiz Top Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Canadian Accounting & Tax Practice</div>
            <div className="text-[11px] text-slate-500">Optional 3-Question Session · Maple & Bay CPA</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <button
            onClick={onExit}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Exit Quiz (Does not affect attendance)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-1 relative overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIndex + (hasSubmittedAnswer ? 1 : 0.5)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100">
            <span>{currentQ.topic}</span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Answer Choices */}
        <div className="space-y-3">
          {currentQ.options.map((opt: string, idx: number) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQ.correctIndex;

            let buttonStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';

            if (hasSubmittedAnswer) {
              if (isCorrectAnswer) {
                buttonStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold shadow-xs';
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle = 'border-red-400 bg-red-50/80 text-red-900';
              } else {
                buttonStyle = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              buttonStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-semibold ring-1 ring-indigo-600';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmittedAnswer}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs md:text-sm cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    hasSubmittedAnswer && isCorrectAnswer
                      ? 'bg-emerald-600 text-white'
                      : hasSubmittedAnswer && isSelected && !isCorrectAnswer
                      ? 'bg-red-600 text-white'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {letter}
                  </span>
                  <span>{opt}</span>
                </div>

                {hasSubmittedAnswer && (
                  <div className="shrink-0">
                    {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner (shown immediately after submitting answer) */}
        {hasSubmittedAnswer && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Explanation & CRA Technical Guidance</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
        <button
          onClick={onExit}
          className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          Exit Practice (No Attendance Penalty)
        </button>

        <div>
          {!hasSubmittedAnswer ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              Confirm Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Session Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
