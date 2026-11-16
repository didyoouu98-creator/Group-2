import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RefreshCw,
  X,
  BookOpen,
  Puzzle,
  Lightbulb,
  AlertCircle,
  Gift,
} from 'lucide-react';
import { MixedQuizItem, Employee, QuizSessionRecord, QuizAttemptItem } from '../types';
import { generateDepartmentQuizSession } from '../data/departmentQuestions';
import { soundEffects } from '../services/soundEffects';
import { formatLocalDate } from '../services/attendanceStorage';

interface DepartmentMixedQuizProps {
  employee: Employee;
  quizKind?: 'weekly' | 'optional';
  onQuizSessionFinished: (session: QuizSessionRecord) => void;
  onCompleteLater?: () => void;
  onExit: () => void;
}

export const DepartmentMixedQuiz: React.FC<DepartmentMixedQuizProps> = ({
  employee,
  quizKind = 'weekly',
  onQuizSessionFinished,
  onCompleteLater,
  onExit,
}) => {
  const [currentQuizKind, setCurrentQuizKind] = useState<'weekly' | 'optional'>(quizKind);
  // Generate 4 alternating questions (MCQ, Word Puzzle, MCQ, Word Puzzle) for this employee's department
  const [questions, setQuestions] = useState<MixedQuizItem[]>(() =>
    generateDepartmentQuizSession(employee.department, 4)
  );

  // Answers mapped by question ID
  const [selectedMcq, setSelectedMcq] = useState<Record<string, number>>({});
  const [wordInputs, setWordInputs] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});

  // Validation & Submission State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [unansweredIds, setUnansweredIds] = useState<string[]>([]);
  const [answersHistory, setAnswersHistory] = useState<QuizAttemptItem[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  const handleSelectMcq = (questionId: string, optionIdx: number) => {
    setSelectedMcq(prev => ({ ...prev, [questionId]: optionIdx }));
    setUnansweredIds(prev => prev.filter(id => id !== questionId));
    setValidationError(null);
    soundEffects.playKeyPress();
  };

  const handleWordChange = (questionId: string, value: string, maxLen: number) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxLen);
    setWordInputs(prev => ({ ...prev, [questionId]: clean }));
    if (clean.trim().length > 0) {
      setUnansweredIds(prev => prev.filter(id => id !== questionId));
      setValidationError(null);
    }
    soundEffects.playKeyPress();
  };

  const handleUseHint = (questionId: string, targetWord: string) => {
    const existing = revealedHints[questionId] || [];
    if (existing.length >= 2) return;

    const target = targetWord.toUpperCase();
    const unrevealed = target
      .split('')
      .map((_, idx) => idx)
      .filter(idx => !existing.includes(idx));

    if (unrevealed.length === 0) return;

    const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedHints(prev => ({
      ...prev,
      [questionId]: [...existing, pick],
    }));
    soundEffects.playHint();
  };

  const answeredCount = questions.filter(q => {
    if (q.type === 'mcq') return selectedMcq[q.id] !== undefined;
    return Boolean((wordInputs[q.id] || '').trim());
  }).length;

  const handleSubmitQuiz = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isCompleted) return;

    // Check that ALL questions have been answered before submission
    const missing = questions
      .filter(q => {
        if (q.type === 'mcq') return selectedMcq[q.id] === undefined;
        return !(wordInputs[q.id] || '').trim();
      })
      .map(q => q.id);

    if (missing.length > 0) {
      setUnansweredIds(missing);
      setValidationError('Please answer all questions before submission.');
      soundEffects.playCountdownTick(true);
      return;
    }

    // Grade all questions
    const graded: QuizAttemptItem[] = questions.map(q => {
      if (q.type === 'mcq') {
        const chosenIdx = selectedMcq[q.id];
        const isCorrect = chosenIdx === q.correctIndex;
        const userAnsText = q.options ? q.options[chosenIdx] : '';
        const correctAnsText =
          q.options && q.correctIndex !== undefined ? q.options[q.correctIndex] : '';

        return {
          questionId: q.id,
          type: q.type,
          topic: q.topic,
          prompt: q.prompt,
          userAnswer: userAnsText,
          correctAnswer: correctAnsText,
          isCorrect,
          explanation: q.explanation,
        };
      } else {
        const cleanInput = (wordInputs[q.id] || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const target = (q.targetWord || '').toUpperCase();
        const isCorrect = cleanInput === target;

        return {
          questionId: q.id,
          type: q.type,
          topic: q.topic,
          prompt: q.prompt,
          userAnswer: cleanInput,
          correctAnswer: target,
          isCorrect,
          explanation: q.explanation,
        };
      }
    });

    const totalCorrect = graded.filter(a => a.isCorrect).length;
    const scorePct = Math.round((totalCorrect / questions.length) * 100);
    const earned = 40 + totalCorrect * 15 + (scorePct === 100 ? 20 : 0);

    setAnswersHistory(graded);
    setPointsEarned(earned);
    setIsCompleted(true);

    soundEffects.playAttendanceRegistered();

    const uniqueTopics = Array.from(new Set(graded.map(a => a.topic)));
    const sessionRecord: QuizSessionRecord = {
      id: `qs-${Date.now()}-${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      date: formatLocalDate(new Date()),
      timestamp: Date.now(),
      score: scorePct,
      correctCount: totalCorrect,
      totalCount: questions.length,
      topics: uniqueTopics,
      items: graded,
      quizKind: currentQuizKind,
      pointsEarned: earned,
    };

    onQuizSessionFinished(sessionRecord);
  };

  const handleRetryNewSession = () => {
    setCurrentQuizKind('optional');
    setQuestions(generateDepartmentQuizSession(employee.department, 4));
    setSelectedMcq({});
    setWordInputs({});
    setRevealedHints({});
    setValidationError(null);
    setUnansweredIds([]);
    setAnswersHistory([]);
    setIsCompleted(false);
    setPointsEarned(0);
  };

  // Screen: Final Graded Results & Explanations
  if (isCompleted) {
    const totalCorrect = answersHistory.filter(a => a.isCorrect).length;
    const percentage = Math.round((totalCorrect / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-in fade-in duration-200">
        <div className="p-8 text-center bg-slate-950 text-white relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8 text-indigo-300" />
          </div>
          <div className="text-xs font-semibold text-indigo-300 mb-1">
            {currentQuizKind === 'weekly'
              ? `Weekly Quiz Complete · ${employee.department}`
              : `Optional Practice Quiz Complete · ${employee.department}`}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white tabular-nums">
            Score: {totalCorrect} / {questions.length} Correct ({percentage}%)
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Gift className="w-4 h-4" />
            <span>+{pointsEarned} Non-Taxable Benefit Points Earned</span>
          </div>
          <p className="text-xs text-slate-300 mt-3 max-w-md mx-auto">
            {currentQuizKind === 'weekly'
              ? `Your weekly quiz is recorded and any consecutive-miss counter has been reset, ${employee.name}. Attendance remains unaffected.`
              : `Optional practice session saved to your learning history, ${employee.name}. Attendance remains unaffected.`}
          </p>
        </div>

        {/* Detailed Question Review */}
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-700">
              Question Breakdown &amp; Practical Feedback
            </span>
            <span className="text-slate-500 font-mono">
              {employee.department} Knowledge Curriculum
            </span>
          </div>

          <div className="space-y-4">
            {answersHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                  item.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-red-200 bg-red-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-800">Question {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.type === 'mcq' ? 'Multiple-Choice' : 'Word Puzzle'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.topic}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.prompt}
                    </h4>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 ${
                    item.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[11px] font-semibold">Your Response</span>
                    <span className={`font-semibold ${item.isCorrect ? 'text-emerald-700' : 'text-red-700 font-mono'}`}>
                      {item.userAnswer}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[11px] font-semibold">Correct Solution</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {item.correctAnswer}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Workplace Skill Note:</strong> {item.explanation}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-slate-200 gap-3">
            <button
              type="button"
              onClick={handleRetryNewSession}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Take Additional Optional Quiz</span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>Return to Terminal &amp; Rewards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Assessment Sheet (All 4 Questions with Required Validation)
  return (
    <form
      onSubmit={handleSubmitQuiz}
      className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden"
    >
      {/* Top HUD */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {currentQuizKind === 'weekly'
                  ? `Weekly Quiz · ${employee.department}`
                  : `Optional Practice Quiz · ${employee.department}`}
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-indigo-700 font-semibold">
                {answeredCount} of {questions.length} Answered
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {currentQuizKind === 'weekly'
                ? 'One required weekly quiz per week (resets consecutive-miss counter and earns non-taxable benefit points).'
                : 'Additional optional learning session (earns benefit points without affecting attendance).'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={currentQuizKind === 'weekly' && onCompleteLater ? onCompleteLater : onExit}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
          title={
            currentQuizKind === 'optional'
              ? 'Skip Quiz (Does not affect attendance or missed count)'
              : 'Complete Later (Does not affect attendance)'
          }
        >
          <span>{currentQuizKind === 'optional' ? 'Skip Quiz' : 'Complete Later'}</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 relative overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* All 4 Questions */}
      <div className="p-6 md:p-8 space-y-6">
        {questions.map((q, qIdx) => {
          const isUnansweredError = unansweredIds.includes(q.id);
          const hints = revealedHints[q.id] || [];
          const wordVal = wordInputs[q.id] || '';

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border space-y-4 transition-colors ${
                isUnansweredError
                  ? 'border-red-400 bg-red-50/30 ring-1 ring-red-300'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-900">Question {qIdx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-medium text-indigo-700">
                      {q.type === 'mcq' ? (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Multiple-Choice</span>
                        </>
                      ) : (
                        <>
                          <Puzzle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Word Puzzle ({q.targetWord?.length} Letters)</span>
                        </>
                      )}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{q.topic}</span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                    {q.type === 'word_puzzle' ? `"${q.prompt}"` : q.prompt}
                  </h3>
                </div>

                {isUnansweredError && (
                  <span className="text-[11px] font-semibold text-red-700 shrink-0">
                    Answer Required
                  </span>
                )}
              </div>

              {/* MCQ Choices */}
              {q.type === 'mcq' && (
                <div className="space-y-2">
                  {q.options?.map((opt, oIdx) => {
                    const letter = ['A', 'B', 'C', 'D'][oIdx];
                    const isSelected = selectedMcq[q.id] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectMcq(q.id, oIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 text-xs md:text-sm cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {letter}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Word Puzzle Slots & Input */}
              {q.type === 'word_puzzle' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {q.targetWord?.split('').map((letter, lIdx) => {
                      const isRevealed = hints.includes(lIdx);
                      const userChar = wordVal[lIdx]?.toUpperCase() || '';
                      const isFilled = Boolean(userChar || isRevealed);

                      return (
                        <div
                          key={lIdx}
                          className={`w-10 h-12 flex flex-col items-center justify-center font-mono text-lg font-bold rounded-lg border-2 select-none ${
                            isRevealed
                              ? 'border-amber-400 bg-amber-50 text-amber-800'
                              : isFilled
                              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                              : 'border-dashed border-slate-300 bg-slate-50 text-slate-300'
                          }`}
                        >
                          <span>{isRevealed ? letter : userChar || '·'}</span>
                          {isRevealed && (
                            <span className="text-[8px] font-sans font-normal text-amber-600 -mt-1">
                              hint
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={wordVal}
                      onChange={e =>
                        handleWordChange(q.id, e.target.value, q.targetWord?.length || 12)
                      }
                      placeholder={`Type ${q.targetWord?.length}-letter term...`}
                      maxLength={q.targetWord?.length || 12}
                      className="flex-1 px-3.5 py-2 text-sm font-mono uppercase tracking-widest font-bold bg-white border border-slate-300 focus:border-indigo-600 focus:outline-none rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleUseHint(q.id, q.targetWord || '')}
                      disabled={hints.length >= 2}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors disabled:opacity-40 shrink-0 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Reveal Hint ({2 - hints.length} left)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Required Validation Message if user submits without answering all questions */}
        {validationError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-center gap-2.5 text-xs font-semibold text-red-800"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={currentQuizKind === 'weekly' && onCompleteLater ? onCompleteLater : onExit}
          className="text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
        >
          {currentQuizKind === 'optional'
            ? 'Skip Quiz (No Impact on Attendance or Weekly Streak)'
            : 'Complete Later (Attendance Unaffected)'}
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <span>Submit Quiz Answers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
