export type Department = 'Accounting' | 'Marketing' | 'Engineering' | 'HR';

export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'NOT_EVALUATED' | 'EXCUSED' | 'ABSENT';

export type CognitiveRating = 'Peak Agility' | 'High Focus' | 'Steady Readiness' | 'Warmup Needed';

export type BenefitCategory = 'Time Off' | 'Professional Development' | 'Practical or Fun Rewards';

export interface NonTaxableBenefit {
  id: string;
  title: string;
  description: string;
  category: BenefitCategory;
  pointsCost: number;
  taxTreatment: string;
  firstPlaceOnly?: boolean;
}

export interface BenefitRedemption {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  benefitId: string;
  benefitTitle: string;
  category: BenefitCategory;
  pointsSpent: number;
  date: string;
  status: 'Approved' | 'Pending Manager Fulfillment';
}

export interface MissedQuizFeedback {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string;
  missedStreak: number;
  reason: string;
  additionalNotes?: string;
}

export type ManagerFollowUpStatus = 'recommended' | 'plan_recorded' | 'completed';

export interface Employee {
  id: string; // e.g. ACC-101, MKT-201, ENG-301, HR-401
  name: string;
  email: string;
  role: string;
  department: Department;
  avatarUrl?: string;
  hireDate: string;
  attendanceStreak: number;
  totalCheckIns: number;
  totalQuizzesCompleted: number;
  averageScore: number;
  isRegisteredToday: boolean;
  scheduledStart?: string | null; // Optional HH:MM (24h) Mon-Fri shift start; null = no scheduled shift
  // Learning Engagement & Benefits Fields
  consecutiveMissedQuizzes: number;
  isQuizEligible: boolean;
  rewardPoints: number;
  lastMissedSurveyDate?: string;
  managerFollowUpStatus?: ManagerFollowUpStatus;
  managerFollowUpNote?: string;
  managerFollowUpDate?: string;
  managerCheckInCompletedDate?: string;
  lastCompletedWeeklyQuizWeek?: string;
  lastDeferredWeeklyQuizWeek?: string;
  evaluatedMissedWeeks?: string[];
  notifiedThresholds?: number[];
}

export type QuizItemType = 'mcq' | 'word_puzzle';

export interface QuizAttemptItem {
  questionId: string;
  type: QuizItemType;
  topic: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  word?: string; // Optional compatibility alias
}

export interface QuizSessionRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  timestamp: number;
  score: number; // 0 to 100 percentage
  correctCount: number;
  totalCount: number;
  topics: string[];
  items: QuizAttemptItem[];
  quizKind?: 'weekly' | 'optional';
  pointsEarned?: number;
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
  activityType?: 'mixed_quiz' | 'word_puzzle' | 'mcq_quiz' | 'none';
  quizScore?: {
    correct: number;
    total: number;
    percentage: number;
  };
}

export interface ManualClockOutCorrection {
  originalStatus: 'Missing Clock-Out';
  enteredCheckOutDate: string;
  enteredCheckOutTime: string;
  correctedAt: string;
  correctedTimestamp: number;
  submittedByEmployeeId: string;
  calculatedDuration: string;
  reasonNote?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM:SS AM/PM
  checkOutTime?: string; // HH:MM:SS AM/PM
  checkOutDate?: string; // YYYY-MM-DD (supports overnight shifts)
  rawTimestamp: number;
  checkOutTimestamp?: number;
  clockInIso?: string; // YYYY-MM-DDTHH:mm:ss.sss±HH:MM
  checkOutIso?: string; // YYYY-MM-DDTHH:mm:ss.sss±HH:MM
  clockInUtcOffsetMinutes?: number;
  checkOutUtcOffsetMinutes?: number;
  durationMinutes?: number;
  durationFormatted?: string;
  attendanceStatus: AttendanceStatus;
  gameStats?: GameStats;
  quizSessionId?: string;
  managerNotes?: string;
  verified: boolean;
  clockInType?: 'direct_clock_in' | 'with_activity';
  optionalActivityCompleted?: 'mixed_quiz' | 'mcq_quiz' | 'word_puzzle' | 'skipped';
  clockOutSource?: 'direct' | 'manual_correction';
  originalClockOutStatus?: 'Missing Clock-Out';
  manualClockOutReason?: string;
  manualClockOutHistory?: ManualClockOutCorrection[];
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

export type QuizTopic = 
  | 'Personal Tax (T1)' 
  | 'Corporate & Business' 
  | 'Bookkeeping & AR/AP' 
  | 'Payroll & Deductions' 
  | 'GST/HST & Compliance' 
  | 'Financial Statements'
  | string;

export interface CanadianTaxQuizQuestion {
  id: string;
  topic: QuizTopic;
  question: string;
  options: string[]; // 4 choices
  correctIndex: number;
  explanation: string;
}

export interface DepartmentMCQQuestion {
  id: string;
  department: Department;
  topic: string;
  question: string;
  options: string[]; // Exactly 4 choices
  correctIndex: number; // 0 to 3
  explanation: string;
}

export interface DepartmentWordPuzzle {
  id: string;
  department: Department;
  topic: string;
  word: string;
  clue: string;
  explanation: string;
}

export interface MixedQuizItem {
  id: string;
  type: QuizItemType;
  department?: Department;
  topic: string;
  prompt: string; // Question text or Clue
  explanation: string;
  // If MCQ
  options?: string[];
  correctIndex?: number;
  // If Word Puzzle
  targetWord?: string;
  category?: string;
}

export type TrainingAssessmentStatus =
  | 'Needs Training'
  | 'Refresher Recommended'
  | 'Proficient'
  | 'Not Yet Assessed';

export type TrainingRecommendationAction =
  | 'Foundational Training'
  | 'Targeted Refresher'
  | 'Advanced Learning / Knowledge Maintenance'
  | 'Complete Weekly Quiz';

export interface TrainingRecommendationSummary {
  status: TrainingAssessmentStatus;
  recommendation: TrainingRecommendationAction;
  completedQuizCount: number;
  accuracyPct: number | null;
  basisLabel: string;
  cautionNote?: string;
}

export interface TopicTrainingInsight {
  topic: string;
  department: Department;
  totalAttempts: number;
  incorrectAttempts: number;
  completedQuizCount: number;
  accuracyPct: number;
  status: TrainingAssessmentStatus;
  recommendation: TrainingRecommendationAction;
  basisLabel: string;
  cautionNote?: string;
  trainingSuggestion: string;
}

export interface EmployeeTrainingInsight {
  employeeId: string;
  employeeName: string;
  department: Department;
  completedQuizCount: number;
  averageScore: number | null;
  status: TrainingAssessmentStatus;
  recommendation: TrainingRecommendationAction;
  basisLabel: string;
  cautionNote?: string;
  weeklyParticipationLabel: string;
}

export interface DepartmentTrainingInsight {
  department: Department;
  completedQuizCount: number;
  averageScore: number | null;
  status: TrainingAssessmentStatus;
  recommendation: TrainingRecommendationAction;
  basisLabel: string;
  cautionNote?: string;
}

export type AccessRole = 'employee' | 'manager';

export interface AuthSession {
  role: AccessRole;
  employeeId?: string;
}

export interface EmployeePortalScope {
  employee: Employee;
  records: AttendanceRecord[];
  quizSessions: QuizSessionRecord[];
  redemptions: BenefitRedemption[];
  isFirstPlaceWinner: boolean;
}

export interface AuthorizedManagerScope {
  employees: Employee[];
  records: AttendanceRecord[];
  quizSessions: QuizSessionRecord[];
  missedFeedbacks: MissedQuizFeedback[];
  redemptions: BenefitRedemption[];
}

export type ViewMode = 'terminal' | 'manager' | 'reports';
export type TerminalActivity = 'IDLE' | 'MIXED_QUIZ' | 'REVIEW_MODAL';
