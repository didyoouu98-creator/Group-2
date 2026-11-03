import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Volume2, VolumeX, ShieldCheck, ArrowRight, Zap, Trophy, RefreshCw } from 'lucide-react';
import { Employee, GameStats, WordPuzzle, CognitiveRating } from '../types';
import { WORD_PUZZLES, shufflePuzzles } from '../data/wordPuzzles';
import { soundEffects } from '../services/soundEffects';

interface WordGuessGameProps {
  employee: Employee;
  onAttendanceCompleted: (stats: GameStats) => void;
  onCancel: () => void;
}

export const WordGuessGame: React.FC<WordGuessGameProps> = ({
  employee,
  onAttendanceCompleted,
  onCancel,
}) => {
  // Game Configuration: 120 seconds (2 minutes)
  const TOTAL_TIME = 120;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundEffects.getMuted());

  // Puzzle State
  const [puzzles, setPuzzles] = useState<WordPuzzle[]>(() => shufflePuzzles(WORD_PUZZLES));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Stats Tracker
  const [score, setScore] = useState<number>(0);
  const [wordsSolved, setWordsSolved] = useState<number>(0);
  const [wordsAttempted, setWordsAttempted] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFinishingRef = useRef<boolean>(false);

  const statsRef = useRef({
    timeLeft,
    correctKeystrokes,
    totalKeystrokes,
    wordsSolved,
    wordsAttempted,
    score,
    maxCombo,
  });

  statsRef.current = {
    timeLeft,
    correctKeystrokes,
    totalKeystrokes,
    wordsSolved,
    wordsAttempted,
    score,
    maxCombo,
  };

  const currentPuzzle = puzzles[currentIndex % puzzles.length];

  // Toggle Mute
  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    soundEffects.setMuted(next);
  };

  // Start the 2-minute session
  const startGame = () => {
    isFinishingRef.current = false;
    setIsStarted(true);
    setIsGameOver(false);
    setTimeLeft(TOTAL_TIME);
    setScore(0);
    setWordsSolved(0);
    setWordsAttempted(0);
    setCorrectKeystrokes(0);
    setTotalKeystrokes(0);
    setComboStreak(0);
    setMaxCombo(0);
    setUserInput('');
    setRevealedIndices([]);
    setPuzzles(shufflePuzzles(WORD_PUZZLES));
    setCurrentIndex(0);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Evaluate Cognitive Readiness based on performance
  const calculateCognitiveRating = (solved: number, acc: number, wpm: number): CognitiveRating => {
    if (solved >= 6 && acc >= 90 && wpm >= 55) return 'Peak Agility';
    if (solved >= 4 && acc >= 80) return 'High Focus';
    if (solved >= 2) return 'Steady Readiness';
    return 'Warmup Needed';
  };

  // Finish round and register attendance
  const finishSession = useCallback(() => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsGameOver(true);

    const {
      timeLeft: currentRemaining,
      correctKeystrokes: cKeys,
      totalKeystrokes: tKeys,
      wordsSolved: wSolved,
      wordsAttempted: wAttempted,
      score: currentScore,
      maxCombo: mCombo,
    } = statsRef.current;

    const elapsedSeconds = TOTAL_TIME - currentRemaining;
    const minutesElapsed = Math.max(elapsedSeconds / 60, 0.5);
    const calculatedWpm = Math.round((cKeys / 5) / minutesElapsed) || 35;
    const accuracy = tKeys > 0 ? Math.round((cKeys / tKeys) * 100) : 90;
    const rating = calculateCognitiveRating(wSolved, accuracy, calculatedWpm);

    soundEffects.playAttendanceRegistered();

    const finalStats: GameStats = {
      durationSeconds: elapsedSeconds || TOTAL_TIME,
      score: Math.max(currentScore, 100), // Minimum attendance base score
      wordsSolved: wSolved,
      wordsAttempted: Math.max(wAttempted, wSolved),
      accuracyPct: Math.min(Math.max(accuracy, 60), 100),
      wpm: calculatedWpm,
      streak: mCombo,
      cognitiveRating: rating,
    };

    // Trigger parent attendance registration
    onAttendanceCompleted(finalStats);
  }, [onAttendanceCompleted]);

  // Main countdown loop - purely computes time without side-effect setState on parent
  useEffect(() => {
    if (!isStarted || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }

        // Sound audio ticks in final 10 seconds
        if (prev <= 10) {
          soundEffects.playCountdownTick(prev <= 5);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isStarted, isGameOver]);

  // Safe effect to trigger finishSession when time expires
  useEffect(() => {
    if (isStarted && !isGameOver && timeLeft <= 0) {
      finishSession();
    }
  }, [isStarted, isGameOver, timeLeft, finishSession]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    const cleanVal = rawVal.replace(/[^A-Z]/g, '').slice(0, currentPuzzle.word.length);
    setUserInput(cleanVal);
    soundEffects.playKeyPress();

    setTotalKeystrokes(prev => prev + 1);

    // Check if the current typed letter matches the target word letter at this index
    const lastCharIdx = cleanVal.length - 1;
    if (lastCharIdx >= 0 && cleanVal[lastCharIdx] === currentPuzzle.word[lastCharIdx]) {
      setCorrectKeystrokes(prev => prev + 1);
    }

    // Instant word match check
    if (cleanVal === currentPuzzle.word) {
      handleWordSolved();
    }
  };

  const handleWordSolved = () => {
    const newStreak = comboStreak + 1;
    setComboStreak(newStreak);
    if (newStreak > maxCombo) setMaxCombo(newStreak);

    // Calculate score points with combo bonus
    const basePts = currentPuzzle.bonusPoints;
    const comboBonus = Math.min(newStreak * 25, 150);
    const earned = basePts + comboBonus;

    setScore(prev => prev + earned);
    setWordsSolved(prev => prev + 1);
    setWordsAttempted(prev => prev + 1);
    setFeedbackState('correct');
    soundEffects.playCorrectWord(newStreak);

    setTimeout(() => {
      setFeedbackState('idle');
      setUserInput('');
      setRevealedIndices([]);
      setCurrentIndex(prev => prev + 1);
      inputRef.current?.focus();
    }, 400);
  };

  // Hint: reveal one missing letter
  const handleUseHint = () => {
    const word = currentPuzzle.word;
    const unrevealed = word
      .split('')
      .map((_, idx) => idx)
      .filter(idx => !revealedIndices.includes(idx));

    if (unrevealed.length === 0) return;

    // Pick random unrevealed index
    const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedIndices(prev => [...prev, pick]);
    setScore(prev => Math.max(0, prev - 15)); // Small hint deduction
    soundEffects.playHint();
    inputRef.current?.focus();
  };

  // Skip current word
  const handleSkipWord = () => {
    setWordsAttempted(prev => prev + 1);
    setComboStreak(0);
    setUserInput('');
    setRevealedIndices([]);
    setCurrentIndex(prev => prev + 1);
    inputRef.current?.focus();
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Time progress percentage
  const progressPct = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
  const isTimeUrgent = timeLeft <= 30;

  // Initial Instructions Screen
  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Shift Attendance Verification Terminal</span>
            </div>
            <button
              onClick={toggleSound}
              className="text-slate-400 hover:text-slate-600 p-1.5 transition-colors"
              title={isSoundMuted ? "Unmute audio" : "Mute audio"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            2-Minute Beginner Accounting & Business Check-In
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Welcome, <strong className="text-slate-900">{employee.name}</strong> ({employee.department}). Complete this quick 2-minute beginner session covering everyday accounting terms (cash, cost, debt, tax, asset, profit) and fundamental business rules & ethics (fair, trust, honest) to officially register your attendance for today.
          </p>
        </div>

        <div className="p-8 bg-slate-50/60 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 font-medium mb-1">Time Limit</div>
              <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">2:00 Min</div>
              <div className="text-xs text-slate-500 mt-1">Automatic clock-in upon completion</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 font-medium mb-1">Active Streak</div>
              <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                {employee.attendanceStreak} Days
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Reliable Turnout</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 font-medium mb-1">Average Agility</div>
              <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                {employee.averageWpm || 52} WPM
              </div>
              <div className="text-xs text-slate-500 mt-1">Historical focus pace</div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider">How Attendance Registration Works</div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Read the simple clue carefully. Questions test basic business rules, money fundamentals, and accounting principles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Type the basic word using your keyboard. Most words are short (3 to 6 letters).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Once the 2-minute timer ends, your attendance timestamp is permanently logged for management review.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel & Return
            </button>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <span>Begin 2-Minute Attendance Game</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Game Play View
  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* HUD Header Bar */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">{employee.name}</div>
            <div className="text-[11px] text-slate-500">Beginner Accounting Check-In</div>
          </div>
        </div>

        {/* Live HUD Counters */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Score</div>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">{score}</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Solved</div>
            <div className="text-base font-bold text-emerald-600 font-mono tabular-nums">{wordsSolved}</div>
          </div>

          {comboStreak > 1 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded-md font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>{comboStreak}x Streak</span>
            </div>
          )}

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono tabular-nums font-bold text-sm ${
            isTimeUrgent
              ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <Timer className={`w-4 h-4 ${isTimeUrgent ? 'text-red-600' : 'text-slate-500'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={toggleSound}
            className="text-slate-400 hover:text-slate-700 p-1"
            title={isSoundMuted ? "Unmute" : "Mute"}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar for the 2-minute timer */}
      <div className="w-full bg-slate-100 h-1.5 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isTimeUrgent ? 'bg-red-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Game Arena */}
      <div className="p-8 space-y-8">
        {/* Category & Clue Card */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
            <span className="text-emerald-700 font-bold">Beginner Level</span>
            <span className="text-slate-300">·</span>
            <span>{currentPuzzle.category}</span>
            <span className="text-slate-300">·</span>
            <span>{currentPuzzle.word.length} Letters</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight max-w-xl mx-auto leading-snug">
            "{currentPuzzle.clue}"
          </h3>
        </div>

        {/* Word Letter Slots Display */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {currentPuzzle.word.split('').map((letter, idx) => {
            const isRevealedByHint = revealedIndices.includes(idx);
            const userChar = userInput[idx] || '';
            const isFilled = Boolean(userChar || isRevealedByHint);
            const isMatch = userChar === letter || isRevealedByHint;

            return (
              <div
                key={idx}
                className={`w-11 h-14 md:w-13 md:h-16 flex flex-col items-center justify-center font-mono text-xl md:text-2xl font-bold rounded-lg border-2 transition-all duration-150 select-none ${
                  feedbackState === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 scale-105'
                    : isRevealedByHint
                    ? 'border-amber-400 bg-amber-50 text-amber-800'
                    : isFilled
                    ? isMatch
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-400 bg-white text-slate-900'
                    : 'border-dashed border-slate-300 bg-slate-50 text-transparent'
                }`}
              >
                <span>{isRevealedByHint ? letter : userChar || '·'}</span>
                {isRevealedByHint && (
                  <span className="text-[9px] font-sans font-normal text-amber-600 -mt-1">hint</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Typing Input */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Escape') handleSkipWord();
              }}
              placeholder="Type word here (e.g. CASH, TAX, RULE)..."
              maxLength={currentPuzzle.word.length}
              autoFocus
              className="w-full px-4 py-3.5 text-center text-lg md:text-xl font-mono uppercase tracking-widest font-bold bg-white border-2 border-slate-300 focus:border-indigo-600 focus:outline-none rounded-xl shadow-xs transition-colors"
            />
          </div>

          {/* Quick Helper Actions */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <button
              onClick={handleUseHint}
              disabled={revealedIndices.length >= 2}
              className="flex items-center gap-1.5 hover:text-slate-900 font-medium transition-colors disabled:opacity-40 disabled:hover:text-slate-500"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Reveal 1 Letter Hint (-15 pts)</span>
            </button>

            <button
              onClick={handleSkipWord}
              className="flex items-center gap-1 hover:text-slate-900 font-medium transition-colors"
            >
              <span>Skip Question</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Accounting Competence Guidance (Answers intentionally NOT displayed) */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-700">Beginner Level Quiz:</span>
            <span>Basic business rules & accounting fundamentals. Type your guess from the clue above.</span>
          </div>
          <span className="font-mono text-slate-400 tabular-nums shrink-0">Quiz {currentIndex + 1} of {puzzles.length}</span>
        </div>
      </div>

      {/* Footer Session Controls */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="text-slate-500">
          Playing registers official attendance for today
        </div>

        <div className="flex items-center gap-3">
          {wordsSolved >= 3 && (
            <button
              onClick={finishSession}
              className="px-3.5 py-1.5 font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
            >
              Submit & Clock-in Now ({wordsSolved} Solved)
            </button>
          )}

          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            Abort Session
          </button>
        </div>
      </div>
    </div>
  );
};
