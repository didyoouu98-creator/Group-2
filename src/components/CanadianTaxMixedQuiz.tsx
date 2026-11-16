import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  Trophy, 
  RefreshCw, 
  X, 
  BookOpen, 
  Puzzle, 
  Zap, 
  Lightbulb,
  Check
} from 'lucide-react';
import { MixedQuizItem, Employee, GameStats, CognitiveRating } from '../types';
import { generateMixedQuizSession } from '../data/mixedQuizGenerator';
import { soundEffects } from '../services/soundEffects';

interface CanadianTaxMixedQuizProps {
  employee: Employee;
  onActivityCompleted: (stats: GameStats) => void;
  onExit: () => void;
}

interface AnswerHistoryItem {
  questionId: string;
  type: 'mcq' | 'word_puzzle';
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  topic: string;
}

export const CanadianTaxMixedQuiz: React.FC<CanadianTaxMixedQuizProps> = ({
  employee,
  onActivityCompleted,
  onExit,
}) => {
  // Session draws 4 questions (alternating: MCQ, Word Puzzle, MCQ, Word Puzzle)
  const [questions, setQuestions] = useState<MixedQuizItem[]>(() => generateMixedQuizSession(4));
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Interaction State for Current Question
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [wordInput, setWordInput] = useState<string>('');
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [currentIsCorrect, setCurrentIsCorrect] = useState<boolean>(false);

  // History & Completion State
  const [answersHistory, setAnswersHistory] = useState<AnswerHistoryItem[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const wordInputRef = useRef<HTMLInputElement>(null);
  const currentQ = questions[currentIndex];

  useEffect(() => {
    // Focus word input whenever a word puzzle starts
    if (currentQ?.type === 'word_puzzle' && !hasSubmittedAnswer) {
      setTimeout(() => {
        wordInputRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, currentQ?.type, hasSubmittedAnswer]);

  // Handle MCQ Choice Click
  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
    soundEffects.playKeyPress();
  };

  // Handle Word Puzzle Letter Hint
  const handleUseHint = () => {
    if (!currentQ.targetWord) return;
    const target = currentQ.targetWord.toUpperCase();
    const unrevealed = target
      .split('')
      .map((_, idx) => idx)
      .filter(idx => !revealedIndices.includes(idx));

    if (unrevealed.length === 0) return;

    const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedIndices(prev => [...prev, pick]);
    soundEffects.playHint();
    wordInputRef.current?.focus();
  };

  // Submit Answer for either MCQ or Word Puzzle
  const handleSubmitAnswer = () => {
    if (hasSubmittedAnswer) return;

    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';

    if (currentQ.type === 'mcq') {
      if (selectedOption === null) return;
      isCorrect = selectedOption === currentQ.correctIndex;
      userAnsText = currentQ.options ? currentQ.options[selectedOption] : '';
      correctAnsText = currentQ.options && currentQ.correctIndex !== undefined ? currentQ.options[currentQ.correctIndex] : '';
    } else {
      // Word puzzle
      const cleanInput = wordInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const target = (currentQ.targetWord || '').toUpperCase();
      isCorrect = cleanInput === target;
      userAnsText = cleanInput || '(Skipped / Blank)';
      correctAnsText = target;
    }

    setHasSubmittedAnswer(true);
    setCurrentIsCorrect(isCorrect);

    if (isCorrect) {
      soundEffects.playCorrectWord(1);
    } else {
      soundEffects.playCountdownTick(true);
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        type: currentQ.type,
        prompt: currentQ.prompt,
        userAnswer: userAnsText,
        correctAnswer: correctAnsText,
        isCorrect,
        explanation: currentQ.explanation,
        topic: currentQ.topic,
      }
    ]);
  };

  // Proceed to Next Question or Final Results
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setWordInput('');
      setRevealedIndices([]);
      setHasSubmittedAnswer(false);
      setCurrentIsCorrect(false);
    } else {
      // Finish Session
      setIsCompleted(true);
      const totalCorrect = answersHistory.filter(a => a.isCorrect).length;
      const percentage = Math.round((totalCorrect / questions.length) * 100);

      soundEffects.playAttendanceRegistered();

      const rating: CognitiveRating = 
        totalCorrect === 4 ? 'Peak Agility' :
        totalCorrect >= 3 ? 'High Focus' :
        totalCorrect >= 2 ? 'Steady Readiness' : 'Warmup Needed';

      const finalStats: GameStats = {
        durationSeconds: 120,
        score: totalCorrect * 100,
        wordsSolved: answersHistory.filter(a => a.type === 'word_puzzle' && a.isCorrect).length,
        wordsAttempted: answersHistory.filter(a => a.type === 'word_puzzle').length,
        accuracyPct: percentage,
        wpm: 50,
        streak: totalCorrect,
        cognitiveRating: rating,
        activityType: 'mixed_quiz',
        quizScore: {
          correct: totalCorrect,
          total: questions.length,
          percentage,
        }
      };

      onActivityCompleted(finalStats);
    }
  };

  // Reset & Try Another Mixed Session
  const handleRetryNewSession = () => {
    setQuestions(generateMixedQuizSession(4));
    setCurrentIndex(0);
    setSelectedOption(null);
    setWordInput('');
    setRevealedIndices([]);
    setHasSubmittedAnswer(false);
    setCurrentIsCorrect(false);
    setAnswersHistory([]);
    setIsCompleted(false);
  };

  // Screen: Final Results Summary
  if (isCompleted) {
    const totalCorrect = answersHistory.filter(a => a.isCorrect).length;
    const percentage = Math.round((totalCorrect / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-in fade-in duration-200">
        <div className="p-8 text-center bg-slate-950 text-white relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8 text-indigo-300" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            Mixed Quiz Session Complete · Maple & Bay CPA
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Final Score: {totalCorrect} / {questions.length} Correct ({percentage}%)
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
            Well done, <strong className="text-white">{employee.name}</strong>! Your attendance was recorded upon clock-in and is completely preserved.
          </p>
        </div>

        {/* Detailed Question Review */}
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Session Performance Breakdown
            </span>
            <span className="text-xs text-slate-500 font-mono">
              2 Multiple-Choice + 2 Word Puzzles
            </span>
          </div>

          <div className="space-y-4">
            {answersHistory.map((item, idx) => (
              <div 
                key={item.questionId} 
                className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                  item.isCorrect 
                    ? 'border-emerald-200 bg-emerald-50/40' 
                    : 'border-red-200 bg-red-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        Q{idx + 1} · {item.type === 'mcq' ? 'Multiple Choice' : 'Word Puzzle'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{item.topic}</span>
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
                  <strong className="text-slate-800">CRA / Technical Explanation:</strong> {item.explanation}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-slate-200 gap-3">
            <button
              onClick={handleRetryNewSession}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Try Another Mixed Quiz</span>
            </button>

            <button
              onClick={onExit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
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
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top HUD */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            {currentQ.type === 'mcq' ? <BookOpen className="w-4 h-4" /> : <Puzzle className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-slate-300">·</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                currentQ.type === 'mcq' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {currentQ.type === 'mcq' ? 'Multiple-Choice' : 'Word Puzzle'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {currentQ.topic} · Maple & Bay CPA LLP
            </div>
          </div>
        </div>

        <button
          onClick={onExit}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          title="Exit Quiz (Does not alter attendance)"
        >
          <span>Exit</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-1.5 relative overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIndex + (hasSubmittedAnswer ? 1 : 0.5)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Body */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Section 1: MCQ Display */}
        {currentQ.type === 'mcq' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100">
                <BookOpen className="w-3 h-3" />
                <span>Canadian Accounting & Tax Practice</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {currentQ.prompt}
              </h3>
            </div>

            {/* 4 Choices */}
            <div className="space-y-2.5">
              {currentQ.options?.map((opt, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedOption === idx;
                const isCorrectChoice = idx === currentQ.correctIndex;

                let btnClass = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                if (hasSubmittedAnswer) {
                  if (isCorrectChoice) {
                    btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs';
                  } else if (isSelected && !isCorrectChoice) {
                    btnClass = 'border-red-400 bg-red-50 text-red-950';
                  } else {
                    btnClass = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnClass = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-600';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasSubmittedAnswer}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs md:text-sm cursor-pointer ${btnClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        hasSubmittedAnswer && isCorrectChoice
                          ? 'bg-emerald-600 text-white'
                          : hasSubmittedAnswer && isSelected && !isCorrectChoice
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
                        {isCorrectChoice && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {isSelected && !isCorrectChoice && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Word Puzzle Display */}
        {currentQ.type === 'word_puzzle' && (
          <div className="space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-100">
                <Puzzle className="w-3 h-3" />
                <span>Canadian Terminology Word Puzzle</span>
                <span className="text-emerald-400">·</span>
                <span>{currentQ.targetWord?.length} Letters</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                "{currentQ.prompt}"
              </h3>
            </div>

            {/* Letter Slots */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
              {currentQ.targetWord?.split('').map((letter, idx) => {
                const isRevealed = revealedIndices.includes(idx);
                const userChar = wordInput[idx]?.toUpperCase() || '';
                const isFilled = Boolean(userChar || isRevealed);

                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 md:w-14 md:h-16 flex flex-col items-center justify-center font-mono text-xl md:text-2xl font-bold rounded-xl border-2 transition-all select-none ${
                      hasSubmittedAnswer
                        ? currentIsCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-red-400 bg-red-50 text-red-700'
                        : isRevealed
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : isFilled
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-300'
                    }`}
                  >
                    <span>
                      {hasSubmittedAnswer
                        ? letter
                        : isRevealed
                        ? letter
                        : userChar || '·'}
                    </span>
                    {isRevealed && !hasSubmittedAnswer && (
                      <span className="text-[9px] font-sans font-normal text-amber-600 -mt-1">hint</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input Box for Word Puzzle */}
            {!hasSubmittedAnswer && (
              <div className="max-w-md mx-auto space-y-3">
                <input
                  ref={wordInputRef}
                  type="text"
                  value={wordInput}
                  onChange={e => {
                    const clean = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    setWordInput(clean.slice(0, currentQ.targetWord?.length || 10));
                    soundEffects.playKeyPress();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && wordInput.trim()) {
                      handleSubmitAnswer();
                    }
                  }}
                  placeholder="Type your guess here..."
                  maxLength={currentQ.targetWord?.length || 10}
                  className="w-full px-4 py-3 text-center text-lg md:text-xl font-mono uppercase tracking-widest font-bold bg-white border-2 border-slate-300 focus:border-indigo-600 focus:outline-none rounded-xl shadow-xs"
                />

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <button
                    type="button"
                    onClick={handleUseHint}
                    disabled={revealedIndices.length >= 2}
                    className="flex items-center gap-1.5 hover:text-slate-900 font-medium transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reveal 1 Letter Hint</span>
                  </button>

                  <span className="text-slate-400">Press Enter or click Submit</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Immediate Feedback Banner with Technical Explanation */}
        {hasSubmittedAnswer && (
          <div className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
            currentIsCorrect 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-red-50 border-red-200 text-red-950'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold">
              {currentIsCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800 uppercase tracking-wider">Correct Answer!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 uppercase tracking-wider">
                    {currentQ.type === 'word_puzzle' 
                      ? `Incorrect · Target Word: ${currentQ.targetWord}` 
                      : 'Incorrect Answer'}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-200/60">
              <strong className="text-slate-900">CRA / Accounting Guidance:</strong> {currentQ.explanation}
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
          Exit Quiz (No Attendance Penalty)
        </button>

        <div>
          {!hasSubmittedAnswer ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={currentQ.type === 'mcq' ? selectedOption === null : !wordInput.trim()}
              className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              Confirm Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Score'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
