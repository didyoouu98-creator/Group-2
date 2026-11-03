export type Department = 
  | 'General Accounting' 
  | 'Audit & Assurance' 
  | 'Tax & Compliance' 
  | 'Financial Planning & Analysis' 
  | 'Accounts Payable & Receivable';

export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'EXCUSED' | 'ABSENT';

export type CognitiveRating = 'Peak Agility' | 'High Focus' | 'Steady Readiness' | 'Warmup Needed';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  avatarUrl?: string;
  hireDate: string;
  attendanceStreak: number;
  totalCheckIns: number;
  averageScore: number;
  averageWpm: number;
  isRegisteredToday: boolean;
}

export interface GameStats {
  durationSeconds: number;
  score: number;
  wordsSolved: number;
  wordsAttempted: number;
  accuracyPct: number;
  wpm: number;
  streak: number;
  cognitiveRating: CognitiveRating;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM:SS AM/PM
  rawTimestamp: number;
  attendanceStatus: AttendanceStatus;
  gameStats: GameStats;
  managerNotes?: string;
  verified: boolean;
}

export interface WordPuzzle {
  id: string;
  word: string;
  clue: string;
  category: string;
  hintLetters?: string[];
  difficulty: 'Basic' | 'Standard';
  bonusPoints: number;
}

export type ViewMode = 'terminal' | 'manager' | 'reports';
