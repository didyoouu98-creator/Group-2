import { 
  Employee, 
  AttendanceRecord, 
  GameStats, 
  AttendanceStatus, 
  CognitiveRating, 
  Department, 
  QuizSessionRecord,
  TopicTrainingInsight,
  MissedQuizFeedback,
  BenefitRedemption,
  ManagerFollowUpStatus,
  AuthSession,
  EmployeePortalScope,
  AuthorizedManagerScope,
  TrainingAssessmentStatus,
  TrainingRecommendationAction,
  TrainingRecommendationSummary,
  EmployeeTrainingInsight,
  DepartmentTrainingInsight,
  ManualClockOutCorrection,
} from '../types';
import { NON_TAXABLE_BENEFITS_CATALOG } from '../data/benefitsCatalog';

const STORAGE_KEY_EMPLOYEES = 'ld_employees_v4';
const STORAGE_KEY_RECORDS = 'ld_attendance_records_v4';
const STORAGE_KEY_QUIZ_SESSIONS = 'ld_quiz_sessions_v4';
const STORAGE_KEY_MISSED_FEEDBACKS = 'ld_missed_feedbacks_v4';
const STORAGE_KEY_BENEFIT_REDEMPTIONS = 'ld_benefit_redemptions_v4';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'ACC-101',
    name: 'Elena Rostova, CPA',
    email: 'elena.rostova@enterprise-ld.com',
    role: 'Senior Financial Accountant',
    department: 'Accounting',
    hireDate: '2022-03-15',
    scheduledStart: '09:00',
    attendanceStreak: 19,
    totalCheckIns: 145,
    totalQuizzesCompleted: 12,
    averageScore: 92,
    isRegisteredToday: true,
    consecutiveMissedQuizzes: 0,
    isQuizEligible: true,
    rewardPoints: 320,
    lastCompletedWeeklyQuizWeek: getIsoWeekKey(getDateOffset(0)),
  },
  {
    id: 'ACC-102',
    name: 'Marcus Vance',
    email: 'marcus.vance@enterprise-ld.com',
    role: 'Ledger & Audit Specialist',
    department: 'Accounting',
    hireDate: '2023-01-10',
    scheduledStart: '09:00',
    attendanceStreak: 14,
    totalCheckIns: 112,
    totalQuizzesCompleted: 9,
    averageScore: 78,
    isRegisteredToday: false,
    consecutiveMissedQuizzes: 1,
    isQuizEligible: true,
    rewardPoints: 185,
  },
  {
    id: 'MKT-201',
    name: 'Maya Lin',
    email: 'maya.lin@enterprise-ld.com',
    role: 'Growth & Digital Marketing Lead',
    department: 'Marketing',
    hireDate: '2021-08-01',
    scheduledStart: '09:00',
    attendanceStreak: 32,
    totalCheckIns: 234,
    totalQuizzesCompleted: 15,
    averageScore: 88,
    isRegisteredToday: true,
    consecutiveMissedQuizzes: 0,
    isQuizEligible: true,
    rewardPoints: 280,
    lastCompletedWeeklyQuizWeek: getIsoWeekKey(getDateOffset(0)),
  },
  {
    id: 'MKT-202',
    name: 'Liam Bennett',
    email: 'liam.bennett@enterprise-ld.com',
    role: 'Brand & Content Strategist',
    department: 'Marketing',
    hireDate: '2023-06-20',
    scheduledStart: '09:00',
    attendanceStreak: 9,
    totalCheckIns: 88,
    totalQuizzesCompleted: 7,
    averageScore: 71,
    isRegisteredToday: false,
    consecutiveMissedQuizzes: 3,
    isQuizEligible: true,
    rewardPoints: 135,
  },
  {
    id: 'ENG-301',
    name: 'Alex Rivera',
    email: 'alex.rivera@enterprise-ld.com',
    role: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    hireDate: '2022-11-04',
    scheduledStart: '09:00',
    attendanceStreak: 16,
    totalCheckIns: 164,
    totalQuizzesCompleted: 14,
    averageScore: 85,
    isRegisteredToday: true,
    consecutiveMissedQuizzes: 0,
    isQuizEligible: true,
    rewardPoints: 245,
    lastCompletedWeeklyQuizWeek: getIsoWeekKey(getDateOffset(0)),
  },
  {
    id: 'ENG-302',
    name: 'Chloe Chen',
    email: 'chloe.chen@enterprise-ld.com',
    role: 'DevOps & Systems Engineer',
    department: 'Engineering',
    hireDate: '2023-02-18',
    scheduledStart: '09:00',
    attendanceStreak: 23,
    totalCheckIns: 102,
    totalQuizzesCompleted: 8,
    averageScore: 75,
    isRegisteredToday: false,
    consecutiveMissedQuizzes: 0,
    isQuizEligible: true,
    rewardPoints: 160,
  },
  {
    id: 'HR-401',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@enterprise-ld.com',
    role: 'People Operations & Talent Lead',
    department: 'HR',
    hireDate: '2023-08-14',
    scheduledStart: '09:00',
    attendanceStreak: 7,
    totalCheckIns: 75,
    totalQuizzesCompleted: 10,
    averageScore: 90,
    isRegisteredToday: true,
    consecutiveMissedQuizzes: 0,
    isQuizEligible: true,
    rewardPoints: 230,
    lastCompletedWeeklyQuizWeek: getIsoWeekKey(getDateOffset(0)),
  },
  {
    id: 'HR-402',
    name: 'David O\'Connor',
    email: 'david.oconnor@enterprise-ld.com',
    role: 'Compensation & Labor Compliance',
    department: 'HR',
    hireDate: '2024-01-08',
    scheduledStart: '09:00',
    attendanceStreak: 15,
    totalCheckIns: 64,
    totalQuizzesCompleted: 6,
    averageScore: 68,
    isRegisteredToday: false,
    consecutiveMissedQuizzes: 5,
    isQuizEligible: true,
    rewardPoints: 90,
    lastMissedSurveyDate: getDateOffset(3),
    managerFollowUpStatus: 'completed',
    managerFollowUpDate: getDateOffset(2),
    managerCheckInCompletedDate: getDateOffset(1),
    managerFollowUpNote:
      'Flexible Friday catch-up schedule agreed during Q4 compensation cycle; no penalty applied.',
    evaluatedMissedWeeks: [
      getIsoWeekKey(getDateOffset(35)),
      getIsoWeekKey(getDateOffset(28)),
      getIsoWeekKey(getDateOffset(21)),
      getIsoWeekKey(getDateOffset(14)),
      getIsoWeekKey(getDateOffset(7)),
    ],
    notifiedThresholds: [3, 5],
  },
];

export const ON_TIME_RULE_DESCRIPTION =
  'Punctual (On-Time): within 2 hrs before through 15 min after scheduled Mon–Fri start (e.g., 7:00 AM–9:15 AM for 9:00 AM start); Late Arrival: after grace window; Not Evaluated: outside shift window, weekends, or when no shift schedule applies.';

export function evaluateAttendanceStatus(
  clockInDate: Date,
  employee?: Employee
): AttendanceStatus {
  if (!employee?.scheduledStart) {
    return 'NOT_EVALUATED';
  }
  const day = clockInDate.getDay();
  if (day === 0 || day === 6) {
    return 'NOT_EVALUATED';
  }
  const match = employee.scheduledStart.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return 'NOT_EVALUATED';
  }
  const schedHour = parseInt(match[1], 10);
  const schedMin = parseInt(match[2], 10);
  if (schedHour < 0 || schedHour > 23 || schedMin < 0 || schedMin > 59) {
    return 'NOT_EVALUATED';
  }

  const schedTotalMins = schedHour * 60 + schedMin;
  const clockInMins = clockInDate.getHours() * 60 + clockInDate.getMinutes();

  // Reject early/unusual off-hours clock-ins (>2 hours early or >8 hours after start)
  if (clockInMins < schedTotalMins - 120 || clockInMins > schedTotalMins + 480) {
    return 'NOT_EVALUATED';
  }

  return clockInMins <= schedTotalMins + 15 ? 'ON_TIME' : 'LATE';
}

export function countRecordedAttendanceDays(
  records: AttendanceRecord[],
  employeeId: string
): number {
  const cleanId = employeeId.trim().toUpperCase();
  const distinctDates = new Set(
    records.filter(r => r.employeeId.toUpperCase() === cleanId).map(r => r.date)
  );
  return distinctDates.size;
}

export function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime12h(d: Date): string {
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  return `${displayHours}:${minutes}:${seconds} ${ampm}`;
}

export function formatLocalIsoWithOffset(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  const offsetMins = -d.getTimezoneOffset();
  const sign = offsetMins >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMins);
  const offH = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offM = String(absOffset % 60).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}${sign}${offH}:${offM}`;
}

function parse12hTo24hParts(
  timeStr?: string
): { hour: number; minute: number; second: number } | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const second = match[3] ? parseInt(match[3], 10) : 0;
  const period = match[4].toUpperCase();

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    return null;
  }
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return { hour, minute, second };
}

export function parseRecordDateTimeMs(
  dateStr: string,
  timeStr?: string,
  utcOffsetMinutes?: number
): number | null {
  if (!dateStr || !timeStr) return null;
  const dateParts = dateStr.split('-').map(Number);
  if (dateParts.length !== 3 || dateParts.some(Number.isNaN)) return null;
  const [year, month, day] = dateParts;

  const parsedTime = parse12hTo24hParts(timeStr);
  if (!parsedTime) return null;
  const { hour, minute, second } = parsedTime;

  if (utcOffsetMinutes !== undefined && Number.isFinite(utcOffsetMinutes)) {
    const utcMs =
      Date.UTC(year, month - 1, day, hour, minute, second, 0) - utcOffsetMinutes * 60000;
    return utcMs;
  }

  return new Date(year, month - 1, day, hour, minute, second, 0).getTime();
}

function parseIsoMatchingWallClock(
  isoStr: string | undefined,
  expectedDate: string,
  expectedTime12h: string
): number | null {
  if (!isoStr || !expectedDate || !expectedTime12h) return null;
  const match = isoStr
    .trim()
    .match(
      /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})$/i
    );
  if (!match) return null;

  const isoDate = match[1];
  const isoHour = parseInt(match[2], 10);
  const isoMin = parseInt(match[3], 10);
  const isoSec = parseInt(match[4], 10);
  const expectedParts = parse12hTo24hParts(expectedTime12h);
  if (!expectedParts) return null;

  if (
    isoDate !== expectedDate.trim() ||
    isoHour !== expectedParts.hour ||
    isoMin !== expectedParts.minute ||
    isoSec !== expectedParts.second
  ) {
    return null;
  }

  const parsedMs = Date.parse(isoStr);
  return Number.isFinite(parsedMs) ? parsedMs : null;
}

function addOneCalendarDay(dateStr: string): string | null {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [year, month, day] = parts;
  const next = new Date(year, month - 1, day + 1, 12, 0, 0, 0);
  return formatLocalDate(next);
}

export function resolveRecordTimestamps(record: AttendanceRecord): {
  startMs: number | null;
  endMs: number | null;
  isOvernight: boolean;
} {
  const parsedInLocalMs = parseRecordDateTimeMs(record.date, record.checkInTime);
  const isoInMs = parseIsoMatchingWallClock(record.clockInIso, record.date, record.checkInTime);
  const offsetInMs =
    record.clockInUtcOffsetMinutes !== undefined
      ? parseRecordDateTimeMs(record.date, record.checkInTime, record.clockInUtcOffsetMinutes)
      : null;

  let startMs: number | null = null;
  if (isoInMs !== null) {
    startMs = isoInMs;
  } else if (offsetInMs !== null) {
    startMs =
      record.rawTimestamp && Math.abs(record.rawTimestamp - offsetInMs) <= 1000
        ? record.rawTimestamp
        : offsetInMs;
  } else if (parsedInLocalMs !== null) {
    // Only preserve sub-second rawTimestamp if it agrees with the recorded date + checkInTime.
    // Prevents stale/timezone-mismatched rawTimestamp values from corrupting shift durations.
    startMs =
      record.rawTimestamp && Math.abs(record.rawTimestamp - parsedInLocalMs) <= 1000
        ? record.rawTimestamp
        : parsedInLocalMs;
  } else if (Number.isFinite(record.rawTimestamp)) {
    startMs = record.rawTimestamp;
  }

  if (!record.checkOutTime) {
    return { startMs, endMs: null, isOvernight: false };
  }

  const baseOutDate = record.checkOutDate || record.date;
  const isoOutMs = parseIsoMatchingWallClock(
    record.checkOutIso,
    baseOutDate,
    record.checkOutTime
  );
  const offsetOutMs =
    record.checkOutUtcOffsetMinutes !== undefined
      ? parseRecordDateTimeMs(baseOutDate, record.checkOutTime, record.checkOutUtcOffsetMinutes)
      : null;
  const parsedSameOutLocalMs = parseRecordDateTimeMs(baseOutDate, record.checkOutTime);

  const sameDayEndCandidate = isoOutMs ?? offsetOutMs ?? parsedSameOutLocalMs;
  let isOvernight = Boolean(record.checkOutDate && record.checkOutDate > record.date);
  let endMs: number | null = sameDayEndCandidate;

  // Legacy records without explicit checkOutDate whose clock-out time wraps past midnight
  if (
    !record.checkOutDate &&
    startMs !== null &&
    sameDayEndCandidate !== null &&
    sameDayEndCandidate < startMs
  ) {
    isOvernight = true;
    const nextDateStr = addOneCalendarDay(record.date);
    if (nextDateStr) {
      const nextDayOutMs =
        record.checkOutUtcOffsetMinutes !== undefined
          ? parseRecordDateTimeMs(
              nextDateStr,
              record.checkOutTime,
              record.checkOutUtcOffsetMinutes
            )
          : parseRecordDateTimeMs(nextDateStr, record.checkOutTime);
      endMs = nextDayOutMs ?? sameDayEndCandidate + 24 * 60 * 60 * 1000;
    } else {
      endMs = sameDayEndCandidate + 24 * 60 * 60 * 1000;
    }
  }

  if (
    endMs !== null &&
    isoOutMs === null &&
    record.checkOutTimestamp !== undefined &&
    Math.abs(record.checkOutTimestamp - endMs) <= 1000
  ) {
    endMs = record.checkOutTimestamp;
  } else if (endMs === null && record.checkOutTimestamp !== undefined) {
    endMs = record.checkOutTimestamp;
  }

  return { startMs, endMs, isOvernight };
}

export interface ShiftStatusInfo {
  state: 'completed' | 'in_progress' | 'missing_clock_out';
  totalMinutes: number | null;
  totalHoursFormatted: string;
  totalHoursDecimal: string | null;
  isOvernight: boolean;
}

export function getShiftStatusInfo(
  record: AttendanceRecord,
  now: Date = new Date()
): ShiftStatusInfo {
  const todayStr = formatLocalDate(now);
  const yesterdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterdayDate);

  const { startMs, endMs, isOvernight } = resolveRecordTimestamps(record);

  if (record.checkOutTime) {
    if (startMs !== null && endMs !== null) {
      const diffMs = Math.max(0, endMs - startMs);
      const isUnderOneMinute = diffMs < 60000;
      const totalMinutes = isUnderOneMinute ? 0 : Math.floor(diffMs / 60000);
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const totalHoursFormatted = isUnderOneMinute
        ? 'Less than 1 minute'
        : `${hrs}h ${String(mins).padStart(2, '0')}m`;
      const totalHoursDecimal = isUnderOneMinute
        ? null
        : `${(diffMs / 3600000).toFixed(2)} hrs`;

      return {
        state: 'completed',
        totalMinutes,
        totalHoursFormatted,
        totalHoursDecimal,
        isOvernight,
      };
    }

    return {
      state: 'completed',
      totalMinutes: null,
      totalHoursFormatted: 'Recorded',
      totalHoursDecimal: null,
      isOvernight,
    };
  }

  // No clock-out recorded: determine active ("In Progress") vs past ("Missing Clock-Out")
  if (record.date >= todayStr) {
    return {
      state: 'in_progress',
      totalMinutes: null,
      totalHoursFormatted: 'In Progress',
      totalHoursDecimal: null,
      isOvernight: false,
    };
  }

  const parsedInMs = startMs ?? parseRecordDateTimeMs(record.date, record.checkInTime);
  if (record.date === yesterdayStr && parsedInMs !== null) {
    const checkInHour = new Date(parsedInMs).getHours();
    const elapsedMs = now.getTime() - parsedInMs;
    if (checkInHour >= 16 && elapsedMs >= 0 && elapsedMs <= 18 * 3600 * 1000) {
      return {
        state: 'in_progress',
        totalMinutes: null,
        totalHoursFormatted: 'In Progress',
        totalHoursDecimal: null,
        isOvernight: true,
      };
    }
  }

  return {
    state: 'missing_clock_out',
    totalMinutes: null,
    totalHoursFormatted: 'Missing Clock-Out',
    totalHoursDecimal: null,
    isOvernight: false,
  };
}

export function reconcileSavedAttendanceRecords(records: AttendanceRecord[]): {
  records: AttendanceRecord[];
  changed: boolean;
} {
  let changed = false;
  const reconciled = records.map(rec => {
    // Do NOT auto-complete or alter records without a recorded clock-out ("Missing Clock-Out" or "In Progress")
    if (!rec.checkOutTime) {
      return rec;
    }

    const shiftInfo = getShiftStatusInfo(rec);
    let nextHistory = rec.manualClockOutHistory;
    let historyChanged = false;

    if (rec.manualClockOutHistory && rec.manualClockOutHistory.length > 0) {
      nextHistory = rec.manualClockOutHistory.map(entry => {
        const entryPreview: AttendanceRecord = {
          ...rec,
          checkOutDate: entry.enteredCheckOutDate,
          checkOutTime: entry.enteredCheckOutTime,
          checkOutIso: undefined,
          checkOutUtcOffsetMinutes: undefined,
          checkOutTimestamp: undefined,
        };
        const entryInfo = getShiftStatusInfo(entryPreview);
        if (
          entryInfo.state === 'completed' &&
          entry.calculatedDuration !== entryInfo.totalHoursFormatted
        ) {
          historyChanged = true;
          return {
            ...entry,
            calculatedDuration: entryInfo.totalHoursFormatted,
          };
        }
        return entry;
      });
    }

    const durationChanged =
      shiftInfo.state === 'completed' &&
      shiftInfo.totalMinutes !== null &&
      (rec.durationMinutes !== shiftInfo.totalMinutes ||
        rec.durationFormatted !== shiftInfo.totalHoursFormatted);

    if (!durationChanged && !historyChanged) {
      return rec;
    }

    changed = true;
    return {
      ...rec,
      ...(shiftInfo.state === 'completed' && shiftInfo.totalMinutes !== null
        ? {
            durationMinutes: shiftInfo.totalMinutes,
            durationFormatted: shiftInfo.totalHoursFormatted,
          }
        : {}),
      ...(historyChanged && nextHistory ? { manualClockOutHistory: nextHistory } : {}),
    };
  });

  return { records: reconciled, changed };
}

export function findActiveOpenShift(
  records: AttendanceRecord[],
  employeeId: string,
  now: Date = new Date()
): AttendanceRecord | undefined {
  const cleanId = employeeId.trim().toUpperCase();
  const todayStr = formatLocalDate(now);

  const todayOpen = records.find(
    r => r.employeeId.toUpperCase() === cleanId && r.date === todayStr && !r.checkOutTime
  );
  if (todayOpen) return todayOpen;

  return records.find(r => {
    if (r.employeeId.toUpperCase() !== cleanId || r.checkOutTime) return false;
    return getShiftStatusInfo(r, now).state === 'in_progress';
  });
}

export function findMissingClockOutRecords(
  records: AttendanceRecord[],
  employeeId: string,
  now: Date = new Date()
): AttendanceRecord[] {
  const cleanId = employeeId.trim().toUpperCase();
  return records
    .filter(
      r =>
        r.employeeId.toUpperCase() === cleanId &&
        getShiftStatusInfo(r, now).state === 'missing_clock_out'
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.rawTimestamp - a.rawTimestamp);
}

export function parseManualDateTimeInput(
  dateStr: string,
  timeInput: string
): { dateObj: Date; timestamp: number; formattedTime12h: string } | null {
  const cleanDate = dateStr.trim();
  const cleanTime = timeInput.trim();
  if (!cleanDate || !cleanTime) return null;

  const dateParts = cleanDate.split('-').map(Number);
  if (dateParts.length !== 3 || dateParts.some(Number.isNaN)) return null;
  const [year, month, day] = dateParts;

  let hour: number;
  let minute: number;
  let second = 0;

  const match12 = cleanTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  const match24 = cleanTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (match12) {
    hour = parseInt(match12[1], 10);
    minute = parseInt(match12[2], 10);
    second = match12[3] ? parseInt(match12[3], 10) : 0;
    const period = match12[4].toUpperCase();
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59 || second < 0 || second > 59) {
      return null;
    }
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
  } else if (match24) {
    hour = parseInt(match24[1], 10);
    minute = parseInt(match24[2], 10);
    second = match24[3] ? parseInt(match24[3], 10) : 0;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
      return null;
    }
  } else {
    return null;
  }

  const dateObj = new Date(year, month - 1, day, hour, minute, second, 0);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  return {
    dateObj,
    timestamp: dateObj.getTime(),
    formattedTime12h: formatTime12h(dateObj),
  };
}

export type ManualClockOutValidationResult =
  | {
      valid: true;
      selectedOutTimestamp: number;
      selectedOutDate: string;
      selectedOutTime12h: string;
      calculatedDuration: string;
      isOvernight: boolean;
    }
  | {
      valid: false;
      errorCode:
        | 'MISSING_INPUT'
        | 'INVALID_FORMAT'
        | 'ALREADY_CLOCKED_OUT'
        | 'BEFORE_CLOCK_IN'
        | 'IN_FUTURE'
        | 'OVERLAPPING_SHIFT';
      errorMessage: string;
    };

export function validateManualClockOutSelection(
  records: AttendanceRecord[],
  targetRecord: AttendanceRecord,
  selectedDate: string,
  selectedTime: string,
  now: Date = new Date()
): ManualClockOutValidationResult {
  if (targetRecord.checkOutTime) {
    return {
      valid: false,
      errorCode: 'ALREADY_CLOCKED_OUT',
      errorMessage: `This shift already has a recorded clock-out (${targetRecord.checkOutTime}).`,
    };
  }

  if (!selectedDate.trim() || !selectedTime.trim()) {
    return {
      valid: false,
      errorCode: 'MISSING_INPUT',
      errorMessage: 'Please select both the clock-out date and clock-out time.',
    };
  }

  const parsedOut = parseManualDateTimeInput(selectedDate, selectedTime);
  if (!parsedOut) {
    return {
      valid: false,
      errorCode: 'INVALID_FORMAT',
      errorMessage: 'Please enter a valid clock-out date and time.',
    };
  }

  const resolvedTarget = resolveRecordTimestamps(targetRecord);
  const originalInMs = resolvedTarget.startMs ?? targetRecord.rawTimestamp;

  if (parsedOut.timestamp <= originalInMs) {
    return {
      valid: false,
      errorCode: 'BEFORE_CLOCK_IN',
      errorMessage: `Clock-out time must be after the original clock-in (${targetRecord.date} at ${targetRecord.checkInTime}).`,
    };
  }

  if (parsedOut.timestamp > now.getTime()) {
    return {
      valid: false,
      errorCode: 'IN_FUTURE',
      errorMessage: 'Clock-out time cannot be in the future.',
    };
  }

  for (const other of records) {
    if (other.id === targetRecord.id) continue;
    if (other.employeeId.toUpperCase() !== targetRecord.employeeId.toUpperCase()) continue;

    const resolvedOther = resolveRecordTimestamps(other);
    const otherInMs = resolvedOther.startMs ?? other.rawTimestamp;

    if (other.checkOutTime) {
      const otherOutMs = resolvedOther.endMs;
      if (otherOutMs !== null && originalInMs < otherOutMs && parsedOut.timestamp > otherInMs) {
        return {
          valid: false,
          errorCode: 'OVERLAPPING_SHIFT',
          errorMessage: `Selected clock-out overlaps with another attendance record on ${other.date} (${other.checkInTime} – ${other.checkOutTime}).`,
        };
      }
    } else if (otherInMs > originalInMs && parsedOut.timestamp >= otherInMs) {
      return {
        valid: false,
        errorCode: 'OVERLAPPING_SHIFT',
        errorMessage: `Selected clock-out overlaps with a subsequent attendance record on ${other.date} (clocked in at ${other.checkInTime}).`,
      };
    }
  }

  const previewRecord: AttendanceRecord = {
    ...targetRecord,
    checkOutDate: selectedDate.trim(),
    checkOutTime: parsedOut.formattedTime12h,
    checkOutTimestamp: parsedOut.timestamp,
    clockOutSource: 'manual_correction',
  };
  const previewShift = getShiftStatusInfo(previewRecord, now);

  return {
    valid: true,
    selectedOutTimestamp: parsedOut.timestamp,
    selectedOutDate: selectedDate.trim(),
    selectedOutTime12h: parsedOut.formattedTime12h,
    calculatedDuration: previewShift.totalHoursFormatted,
    isOvernight: previewShift.isOvernight,
  };
}

function getDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatLocalDate(d);
}

export function getIsoWeekKey(dateInput?: string | Date): string {
  const d = dateInput
    ? typeof dateInput === 'string'
      ? new Date(`${dateInput}T12:00:00Z`)
      : new Date(dateInput.getTime())
    : new Date();
  const utcDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getWeeklyQuizStatus(
  employee: Employee,
  weekKey: string = getIsoWeekKey()
): 'completed' | 'deferred' | 'pending' {
  if (employee.lastCompletedWeeklyQuizWeek === weekKey) {
    return 'completed';
  }
  if (employee.lastDeferredWeeklyQuizWeek === weekKey) {
    return 'deferred';
  }
  return 'pending';
}

export function generateInitialQuizSessions(): QuizSessionRecord[] {
  const sessions: QuizSessionRecord[] = [];
  const todayStr = getDateOffset(0);

  // Accounting sessions
  sessions.push({
    id: 'qs-seed-1',
    employeeId: 'ACC-101',
    employeeName: 'Elena Rostova, CPA',
    department: 'Accounting',
    date: todayStr,
    timestamp: Date.now() - 3600000 * 2,
    score: 100,
    correctCount: 4,
    totalCount: 4,
    topics: ['Accrual & Revenue Recognition', 'Bookkeeping & Double-Entry Ledgers'],
    items: [
      {
        questionId: 'seed-q1',
        type: 'mcq',
        topic: 'Accrual & Revenue Recognition',
        prompt: 'Under accrual accounting, when should revenue from client services be recognized on the income statement?',
        userAnswer: 'When the performance obligation is satisfied and services are rendered, regardless of cash receipt',
        correctAnswer: 'When the performance obligation is satisfied and services are rendered, regardless of cash receipt',
        isCorrect: true,
        explanation: 'Accrual accounting recognizes revenue when earned and expenses when incurred.',
      },
      {
        questionId: 'seed-q2',
        type: 'word_puzzle',
        topic: 'Accrual & Revenue Recognition',
        prompt: 'Accounting method recognizing revenues and expenses in the period incurred rather than when cash flows.',
        userAnswer: 'ACCRUAL',
        correctAnswer: 'ACCRUAL',
        isCorrect: true,
        explanation: 'Accrual accounting aligns financial activity with economic events.',
      },
      {
        questionId: 'seed-q3',
        type: 'mcq',
        topic: 'Bookkeeping & Double-Entry Ledgers',
        prompt: 'In double-entry bookkeeping, what is the effect of recording a DEBIT entry?',
        userAnswer: 'It increases assets or expenses, and decreases liabilities or equity',
        correctAnswer: 'It increases assets or expenses, and decreases liabilities or equity',
        isCorrect: true,
        explanation: 'Debits (left side) increase asset and expense accounts.',
      },
      {
        questionId: 'seed-q4',
        type: 'word_puzzle',
        topic: 'Bookkeeping & Double-Entry Ledgers',
        prompt: 'The master book or electronic record containing summarized debit and credit transactions across all accounts.',
        userAnswer: 'LEDGER',
        correctAnswer: 'LEDGER',
        isCorrect: true,
        explanation: 'The general ledger is the central repository for double-entry bookkeeping.',
      }
    ]
  });

  // More historical sessions across departments with varying accuracy
  sessions.push({
    id: 'qs-seed-2',
    employeeId: 'ACC-102',
    employeeName: 'Marcus Vance',
    department: 'Accounting',
    date: getDateOffset(1),
    timestamp: Date.now() - 86400000 * 1,
    score: 50,
    correctCount: 2,
    totalCount: 4,
    topics: ['Tax Withholding & Compliance', 'Auditing & Internal Controls'],
    items: [
      {
        questionId: 'seed-q5',
        type: 'mcq',
        topic: 'Tax Withholding & Compliance',
        prompt: 'When remitting employee payroll deductions to tax authorities, what components are typically withheld from gross pay?',
        userAnswer: 'Corporate dividend taxes and capital gains tax',
        correctAnswer: 'Employee income tax withholdings, pension contributions, and social insurance premiums',
        isCorrect: false,
        explanation: 'Payroll deductions withheld consist of statutory income tax, pension, and insurance.',
      },
      {
        questionId: 'seed-q6',
        type: 'word_puzzle',
        topic: 'Auditing & Internal Controls',
        prompt: 'An independent examination of financial statements and internal controls to express professional assurance.',
        userAnswer: 'AUDIT',
        correctAnswer: 'AUDIT',
        isCorrect: true,
        explanation: 'An audit provides reasonable assurance on financial statements.',
      },
      {
        questionId: 'seed-q7',
        type: 'mcq',
        topic: 'Tax Withholding & Compliance',
        prompt: 'What happens when statutory tax remittances are delayed beyond the remittance deadline?',
        userAnswer: 'A reminder letter is sent after 6 months with zero penalty',
        correctAnswer: 'Immediate late-filing statutory penalties and compound daily interest apply',
        isCorrect: false,
        explanation: 'Tax authorities impose steep immediate penalties for late statutory payroll remittances.',
      },
      {
        questionId: 'seed-q8',
        type: 'word_puzzle',
        topic: 'Financial Statement Presentation',
        prompt: 'The residual interest in corporate assets remaining after deducting all obligations and liabilities.',
        userAnswer: 'EQUITY',
        correctAnswer: 'EQUITY',
        isCorrect: true,
        explanation: 'Equity represents net residual interest (Assets - Liabilities).',
      }
    ]
  });

  // Marketing sessions
  sessions.push({
    id: 'qs-seed-3',
    employeeId: 'MKT-201',
    employeeName: 'Maya Lin',
    department: 'Marketing',
    date: todayStr,
    timestamp: Date.now() - 3600000 * 3,
    score: 100,
    correctCount: 4,
    totalCount: 4,
    topics: ['A/B Testing & Optimization', 'SEO & Organic Growth'],
    items: [
      {
        questionId: 'seed-q9',
        type: 'mcq',
        topic: 'A/B Testing & Optimization',
        prompt: 'When conducting an A/B test on a landing page, what is required before declaring a variant the definitive winner?',
        userAnswer: 'Statistical significance with sufficient sample size to rule out random variance',
        correctAnswer: 'Statistical significance with sufficient sample size to rule out random variance',
        isCorrect: true,
        explanation: 'A/B test winners must be verified with statistical confidence (p < 0.05).',
      },
      {
        questionId: 'seed-q10',
        type: 'word_puzzle',
        topic: 'A/B Testing & Optimization',
        prompt: 'The desired action a user takes on a site or ad, such as completing a form or purchasing a product.',
        userAnswer: 'CONVERSION',
        correctAnswer: 'CONVERSION',
        isCorrect: true,
        explanation: 'Conversion rate optimization maximizes visitors completing target objectives.',
      },
      {
        questionId: 'seed-q11',
        type: 'mcq',
        topic: 'SEO & Organic Growth',
        prompt: 'Which represents a high-impact technical SEO best practice for modern search engine ranking?',
        userAnswer: 'Optimizing page load speed, mobile responsiveness, and clean XML sitemap crawlability',
        correctAnswer: 'Optimizing page load speed, mobile responsiveness, and clean XML sitemap crawlability',
        isCorrect: true,
        explanation: 'Search engines prioritize fast core web vitals and mobile responsiveness.',
      },
      {
        questionId: 'seed-q12',
        type: 'word_puzzle',
        topic: 'Analytics & Customer Satisfaction',
        prompt: 'The rate at which existing customers cancel subscriptions or cease purchasing over a specific period.',
        userAnswer: 'CHURN',
        correctAnswer: 'CHURN',
        isCorrect: true,
        explanation: 'Customer churn rate directly impacts customer lifetime value.',
      }
    ]
  });

  sessions.push({
    id: 'qs-seed-4',
    employeeId: 'MKT-202',
    employeeName: 'Liam Bennett',
    department: 'Marketing',
    date: getDateOffset(2),
    timestamp: Date.now() - 86400000 * 2,
    score: 50,
    correctCount: 2,
    totalCount: 4,
    topics: ['Unit Economics (CAC & LTV)', 'Brand Strategy & Positioning'],
    items: [
      {
        questionId: 'seed-q13',
        type: 'mcq',
        topic: 'Unit Economics (CAC & LTV)',
        prompt: 'What is generally considered a healthy benchmark ratio between Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC)?',
        userAnswer: '1:1 (LTV equals CAC)',
        correctAnswer: '3:1 (LTV is approximately three times CAC)',
        isCorrect: false,
        explanation: 'A 3:1 LTV:CAC ratio ensures sustainable margins while scaling acquisition.',
      },
      {
        questionId: 'seed-q14',
        type: 'word_puzzle',
        topic: 'Unit Economics (CAC & LTV)',
        prompt: 'Visual model tracking buyer progression from initial awareness through consideration to final purchase.',
        userAnswer: 'FUNNEL',
        correctAnswer: 'FUNNEL',
        isCorrect: true,
        explanation: 'The marketing funnel charts conversion rates across awareness, interest, decision, action.',
      },
      {
        questionId: 'seed-q15',
        type: 'mcq',
        topic: 'Unit Economics (CAC & LTV)',
        prompt: 'If CAC is $200 and average customer lifespan is 2 years with $50/mo gross margin, what is the LTV:CAC ratio?',
        userAnswer: '2:1',
        correctAnswer: '6:1 ($1,200 LTV divided by $200 CAC)',
        isCorrect: false,
        explanation: 'LTV is 24 months * $50 = $1,200. $1,200 / $200 = 6:1 ratio.',
      },
      {
        questionId: 'seed-q16',
        type: 'word_puzzle',
        topic: 'Brand Strategy & Positioning',
        prompt: 'A semi-fictional profile depicting the ideal target customer based on market research and real data.',
        userAnswer: 'PERSONA',
        correctAnswer: 'PERSONA',
        isCorrect: true,
        explanation: 'Buyer personas humanize target customer segments.',
      }
    ]
  });

  // Engineering sessions
  sessions.push({
    id: 'qs-seed-5',
    employeeId: 'ENG-301',
    employeeName: 'Alex Rivera',
    department: 'Engineering',
    date: todayStr,
    timestamp: Date.now() - 3600000 * 2.5,
    score: 75,
    correctCount: 3,
    totalCount: 4,
    topics: ['Algorithms & Complexity', 'Database Design & Indexing'],
    items: [
      {
        questionId: 'seed-q17',
        type: 'mcq',
        topic: 'Algorithms & Complexity',
        prompt: 'What is the worst-case time complexity of finding an element using Binary Search on a sorted array of size n?',
        userAnswer: 'O(log n) logarithmic time',
        correctAnswer: 'O(log n) logarithmic time',
        isCorrect: true,
        explanation: 'Binary search halves search space on every iteration.',
      },
      {
        questionId: 'seed-q18',
        type: 'word_puzzle',
        topic: 'Algorithms & Complexity',
        prompt: 'Restructuring existing computer code to improve internal design without altering external behavior.',
        userAnswer: 'REFACTOR',
        correctAnswer: 'REFACTOR',
        isCorrect: true,
        explanation: 'Refactoring reduces technical debt and improves code maintainability.',
      },
      {
        questionId: 'seed-q19',
        type: 'mcq',
        topic: 'Database Design & Indexing',
        prompt: 'In relational database normalization, what defines Third Normal Form (3NF)?',
        userAnswer: 'Tables with no foreign keys or indexes',
        correctAnswer: 'The table is in 2NF and contains no transitive functional dependencies between non-key attributes',
        isCorrect: false,
        explanation: '3NF eliminates transitive dependencies between non-key attributes.',
      },
      {
        questionId: 'seed-q20',
        type: 'word_puzzle',
        topic: 'Database Design & Indexing',
        prompt: 'The formal structural blueprint defining tables, columns, data types, and relationships in a database.',
        userAnswer: 'SCHEMA',
        correctAnswer: 'SCHEMA',
        isCorrect: true,
        explanation: 'A database schema enforces structural integrity and relational constraints.',
      }
    ]
  });

  sessions.push({
    id: 'qs-seed-6',
    employeeId: 'ENG-302',
    employeeName: 'Chloe Chen',
    department: 'Engineering',
    date: getDateOffset(3),
    timestamp: Date.now() - 86400000 * 3,
    score: 50,
    correctCount: 2,
    totalCount: 4,
    topics: ['Database Design & Indexing', 'CI/CD & DevOps Practices'],
    items: [
      {
        questionId: 'seed-q21',
        type: 'mcq',
        topic: 'Database Design & Indexing',
        prompt: 'What index structure is most suitable for range queries (e.g. BETWEEN 10 AND 50) in relational databases?',
        userAnswer: 'Hash Index',
        correctAnswer: 'B-Tree Index',
        isCorrect: false,
        explanation: 'B-Tree indexes maintain sorted order, making range queries efficient. Hash indexes only support equality.',
      },
      {
        questionId: 'seed-q22',
        type: 'word_puzzle',
        topic: 'CI/CD & DevOps Practices',
        word: 'DOCKER',
        prompt: 'Popular container platform standardizing application code, libraries, and dependencies into portable images.',
        userAnswer: 'DOCKER',
        correctAnswer: 'DOCKER',
        isCorrect: true,
        explanation: 'Containers package runtime code with dependencies.',
      },
      {
        questionId: 'seed-q23',
        type: 'mcq',
        topic: 'CI/CD & DevOps Practices',
        prompt: 'What is the primary benefit of deploying software updates using a Canary Deployment strategy?',
        userAnswer: 'Routing a small percentage of live production traffic to the new version to monitor errors before full rollout',
        correctAnswer: 'Routing a small percentage of live production traffic to the new version to monitor errors before full rollout',
        isCorrect: true,
        explanation: 'Canary deployments safely validate release health with real traffic fractions.',
      },
      {
        questionId: 'seed-q24',
        type: 'word_puzzle',
        topic: 'System Design & Scalability',
        word: 'LATENCY',
        prompt: 'The duration of time it takes for a data packet to travel from sender to receiver across a network.',
        userAnswer: 'DELAY',
        correctAnswer: 'LATENCY',
        isCorrect: false,
        explanation: 'Latency measures communication delay across distributed endpoints.',
      }
    ]
  });

  // HR sessions
  sessions.push({
    id: 'qs-seed-7',
    employeeId: 'HR-401',
    employeeName: 'Jordan Taylor',
    department: 'HR',
    date: todayStr,
    timestamp: Date.now() - 3600000 * 1,
    score: 100,
    correctCount: 4,
    totalCount: 4,
    topics: ['Talent Acquisition & Interviewing', 'Performance Management'],
    items: [
      {
        questionId: 'seed-q25',
        type: 'mcq',
        topic: 'Talent Acquisition & Interviewing',
        prompt: 'What does the acronym "STAR" represent in structured behavioral candidate interviewing?',
        userAnswer: 'Situation, Task, Action, Result',
        correctAnswer: 'Situation, Task, Action, Result',
        isCorrect: true,
        explanation: 'The STAR framework guides objective behavioral evaluation.',
      },
      {
        questionId: 'seed-q26',
        type: 'word_puzzle',
        topic: 'Talent Acquisition & Interviewing',
        prompt: 'The structured integration process familiarizing newly hired employees with company culture and role responsibilities.',
        userAnswer: 'ONBOARD',
        correctAnswer: 'ONBOARD',
        isCorrect: true,
        explanation: 'Onboarding accelerates new hire productivity and retention.',
      },
      {
        questionId: 'seed-q27',
        type: 'mcq',
        topic: 'Performance Management',
        prompt: 'What distinguishes formative performance feedback from summative performance evaluation?',
        userAnswer: 'Formative feedback provides continuous guidance for ongoing learning; summative evaluates overall outcomes at period end',
        correctAnswer: 'Formative feedback provides continuous guidance for ongoing learning; summative evaluates overall outcomes at period end',
        isCorrect: true,
        explanation: 'Formative feedback guides continuous development.',
      },
      {
        questionId: 'seed-q28',
        type: 'word_puzzle',
        topic: 'Performance Management',
        prompt: 'A periodic formal evaluation reviewing an employee’s job performance, achievements, and development goals.',
        userAnswer: 'APPRAISAL',
        correctAnswer: 'APPRAISAL',
        isCorrect: true,
        explanation: 'Appraisals align individual progress with business priorities.',
      }
    ]
  });

  sessions.push({
    id: 'qs-seed-8',
    employeeId: 'HR-402',
    employeeName: 'David O\'Connor',
    department: 'HR',
    date: getDateOffset(1),
    timestamp: Date.now() - 86400000 * 1,
    score: 50,
    correctCount: 2,
    totalCount: 4,
    topics: ['Workplace Compliance & Investigation', 'Compensation & Benefits Strategy'],
    items: [
      {
        questionId: 'seed-q29',
        type: 'mcq',
        topic: 'Workplace Compliance & Investigation',
        prompt: 'When an employee formally reports a workplace harassment complaint, what is HR’s immediate legal and ethical obligation?',
        userAnswer: 'Instruct the employee to informally resolve the dispute directly with the accused person',
        correctAnswer: 'Initiate an impartial, prompt, and documented investigation while ensuring protection from retaliation',
        isCorrect: false,
        explanation: 'HR must promptly investigate harassment allegations with non-retaliation safeguards.',
      },
      {
        questionId: 'seed-q30',
        type: 'word_puzzle',
        topic: 'Workplace Compliance & Investigation',
        prompt: 'Adherence to statutory employment laws, safety regulations, anti-discrimination policies, and labor standards.',
        userAnswer: 'COMPLIANCE',
        correctAnswer: 'COMPLIANCE',
        isCorrect: true,
        explanation: 'Compliance ensures safety and statutory adherence in workplace operations.',
      },
      {
        questionId: 'seed-q31',
        type: 'mcq',
        topic: 'Compensation & Benefits Strategy',
        prompt: 'In compensation management, what does internal equity refer to?',
        userAnswer: 'Paying identical salaries across completely different technical departments regardless of market demand',
        correctAnswer: 'Ensuring that employees performing similar roles with comparable responsibilities receive fair, consistent pay relative to peers',
        isCorrect: false,
        explanation: 'Internal equity ensures non-discriminatory, equitable pay comparisons.',
      },
      {
        questionId: 'seed-q32',
        type: 'word_puzzle',
        topic: 'Compensation & Benefits Strategy',
        prompt: 'Non-wage compensation provided to employees such as health insurance, retirement plans, and paid leave.',
        userAnswer: 'BENEFITS',
        correctAnswer: 'BENEFITS',
        isCorrect: true,
        explanation: 'Benefits packages protect wellbeing and enhance retention.',
      }
    ]
  });

  return sessions;
}

export function generateInitialAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const todayStr = getDateOffset(0);
  const seedOffsetMinutes = -new Date().getTimezoneOffset();

  const buildSeedCheckInMeta = (dateStr: string, timeStr: string, fallbackMs: number) => {
    const ts = parseRecordDateTimeMs(dateStr, timeStr) ?? fallbackMs;
    const dObj = new Date(ts);
    return {
      rawTimestamp: ts,
      clockInIso: formatLocalIsoWithOffset(dObj),
      clockInUtcOffsetMinutes: -dObj.getTimezoneOffset(),
    };
  };

  // Today's clocked-in employees (4 out of 8 currently in progress)
  records.push({
    id: 'att-today-1',
    employeeId: 'ACC-101',
    employeeName: 'Elena Rostova, CPA',
    department: 'Accounting',
    date: todayStr,
    checkInTime: '08:46:12 AM',
    ...buildSeedCheckInMeta(todayStr, '08:46:12 AM', Date.now() - 3600000 * 2),
    attendanceStatus: 'ON_TIME',
    clockInType: 'direct_clock_in',
    optionalActivityCompleted: 'mixed_quiz',
    quizSessionId: 'qs-seed-1',
    gameStats: {
      durationSeconds: 110,
      score: 100,
      wordsSolved: 2,
      wordsAttempted: 2,
      accuracyPct: 100,
      wpm: 55,
      streak: 4,
      cognitiveRating: 'Peak Agility',
      activityType: 'mixed_quiz',
      quizScore: { correct: 4, total: 4, percentage: 100 }
    },
    verified: true,
  });

  records.push({
    id: 'att-today-2',
    employeeId: 'MKT-201',
    employeeName: 'Maya Lin',
    department: 'Marketing',
    date: todayStr,
    checkInTime: '08:52:30 AM',
    ...buildSeedCheckInMeta(todayStr, '08:52:30 AM', Date.now() - 3600000 * 3),
    attendanceStatus: 'ON_TIME',
    clockInType: 'direct_clock_in',
    optionalActivityCompleted: 'mixed_quiz',
    quizSessionId: 'qs-seed-3',
    gameStats: {
      durationSeconds: 125,
      score: 100,
      wordsSolved: 2,
      wordsAttempted: 2,
      accuracyPct: 100,
      wpm: 58,
      streak: 4,
      cognitiveRating: 'Peak Agility',
      activityType: 'mixed_quiz',
      quizScore: { correct: 4, total: 4, percentage: 100 }
    },
    verified: true,
  });

  records.push({
    id: 'att-today-3',
    employeeId: 'ENG-301',
    employeeName: 'Alex Rivera',
    department: 'Engineering',
    date: todayStr,
    checkInTime: '09:05:14 AM',
    ...buildSeedCheckInMeta(todayStr, '09:05:14 AM', Date.now() - 3600000 * 2.5),
    attendanceStatus: 'ON_TIME',
    clockInType: 'direct_clock_in',
    optionalActivityCompleted: 'mixed_quiz',
    quizSessionId: 'qs-seed-5',
    gameStats: {
      durationSeconds: 140,
      score: 75,
      wordsSolved: 1,
      wordsAttempted: 2,
      accuracyPct: 75,
      wpm: 52,
      streak: 2,
      cognitiveRating: 'High Focus',
      activityType: 'mixed_quiz',
      quizScore: { correct: 3, total: 4, percentage: 75 }
    },
    verified: true,
  });

  records.push({
    id: 'att-today-4',
    employeeId: 'HR-401',
    employeeName: 'Jordan Taylor',
    department: 'HR',
    date: todayStr,
    checkInTime: '08:40:05 AM',
    ...buildSeedCheckInMeta(todayStr, '08:40:05 AM', Date.now() - 3600000 * 1),
    attendanceStatus: 'ON_TIME',
    clockInType: 'direct_clock_in',
    optionalActivityCompleted: 'mixed_quiz',
    quizSessionId: 'qs-seed-7',
    gameStats: {
      durationSeconds: 95,
      score: 100,
      wordsSolved: 2,
      wordsAttempted: 2,
      accuracyPct: 100,
      wpm: 60,
      streak: 4,
      cognitiveRating: 'Peak Agility',
      activityType: 'mixed_quiz',
      quizScore: { correct: 4, total: 4, percentage: 100 }
    },
    verified: true,
  });

  // Historical records for past 10 business days (linked strictly to actual QuizSessionRecords)
  const seededQuizSessions = generateInitialQuizSessions();
  const sampleTimes = ['08:48:15 AM', '08:54:20 AM', '09:01:10 AM', '09:08:45 AM', '09:12:02 AM'];
  const lateTimes = ['09:22:15 AM', '09:35:10 AM', '09:28:40 AM'];
  const sampleOutTimes = ['05:02:10 PM', '05:14:35 PM', '05:08:20 PM', '05:22:45 PM', '05:18:05 PM'];

  for (let d = 1; d <= 10; d++) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - d);
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) continue;

    const dateStr = formatLocalDate(dateObj);

    INITIAL_EMPLOYEES.forEach((emp, empIdx) => {
      const isAbsent = (d + empIdx) % 13 === 0;
      if (isAbsent) return;

      const isLate = (d * 2 + empIdx) % 7 === 0;
      const timeStr = isLate
        ? lateTimes[(empIdx + d) % lateTimes.length]
        : sampleTimes[(empIdx + d) % sampleTimes.length];
      const inTimestamp = parseRecordDateTimeMs(dateStr, timeStr) ?? dateObj.getTime();
      const matchedSession = seededQuizSessions.find(
        s => s.employeeId === emp.id && s.date === dateStr
      );
      const isMissingClockOutSample = d === 3 && emp.id === 'ACC-102';
      const outTimeStr = isMissingClockOutSample
        ? undefined
        : sampleOutTimes[(empIdx + d) % sampleOutTimes.length];
      const outTimestamp = outTimeStr
        ? parseRecordDateTimeMs(dateStr, outTimeStr) ?? undefined
        : undefined;

      const baseHistRecord: AttendanceRecord = {
        id: `att-hist-${d}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        date: dateStr,
        checkInTime: timeStr,
        checkOutTime: outTimeStr,
        checkOutDate: outTimeStr ? dateStr : undefined,
        rawTimestamp: inTimestamp,
        checkOutTimestamp: outTimestamp,
        clockInIso: formatLocalIsoWithOffset(new Date(inTimestamp)),
        clockInUtcOffsetMinutes: seedOffsetMinutes,
        ...(outTimestamp !== undefined
          ? {
              checkOutIso: formatLocalIsoWithOffset(new Date(outTimestamp)),
              checkOutUtcOffsetMinutes: -new Date(outTimestamp).getTimezoneOffset(),
            }
          : {}),
        attendanceStatus: isLate ? 'LATE' : 'ON_TIME',
        clockInType: 'direct_clock_in',
        optionalActivityCompleted: matchedSession ? 'mixed_quiz' : 'skipped',
        quizSessionId: matchedSession?.id,
        gameStats: matchedSession
          ? {
              durationSeconds: 120,
              score: matchedSession.score,
              wordsSolved: matchedSession.items.filter(i => i.type === 'word_puzzle' && i.isCorrect).length,
              wordsAttempted: matchedSession.items.filter(i => i.type === 'word_puzzle').length,
              accuracyPct: matchedSession.score,
              wpm: 50,
              streak: matchedSession.correctCount,
              cognitiveRating: matchedSession.score >= 85 ? 'Peak Agility' : 'High Focus',
              activityType: 'mixed_quiz',
              quizScore: {
                correct: matchedSession.correctCount,
                total: matchedSession.totalCount,
                percentage: matchedSession.score,
              },
            }
          : undefined,
        verified: true,
      };

      const histInfo = getShiftStatusInfo(baseHistRecord);
      records.push({
        ...baseHistRecord,
        ...(histInfo.state === 'completed' && histInfo.totalMinutes !== null
          ? {
              durationMinutes: histInfo.totalMinutes,
              durationFormatted: histInfo.totalHoursFormatted,
            }
          : {}),
      });
    });
  }

  return records;
}

export function loadEmployees(): Employee[] {
  if (typeof window === 'undefined') return INITIAL_EMPLOYEES;
  const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  }
  try {
    const parsed: Employee[] = JSON.parse(saved);
    let migrated = false;
    const updated = parsed.map(emp => {
      let nextEmp = emp;
      if (!('scheduledStart' in emp) && INITIAL_EMPLOYEES.some(ie => ie.id === emp.id)) {
        migrated = true;
        nextEmp = { ...nextEmp, scheduledStart: '09:00' };
      }
      // Backfill David O'Connor's seeded check-in & support plan only if no follow-up status/plan exists yet
      if (
        nextEmp.id === 'HR-402' &&
        nextEmp.consecutiveMissedQuizzes === 5 &&
        !nextEmp.managerFollowUpStatus &&
        !nextEmp.managerFollowUpDate &&
        !nextEmp.managerFollowUpNote &&
        !nextEmp.managerCheckInCompletedDate
      ) {
        migrated = true;
        return {
          ...nextEmp,
          managerFollowUpStatus: 'completed' as ManagerFollowUpStatus,
          managerFollowUpDate: getDateOffset(2),
          managerCheckInCompletedDate: getDateOffset(1),
          managerFollowUpNote:
            'Flexible Friday catch-up schedule agreed during Q4 compensation cycle; no penalty applied.',
          notifiedThresholds: nextEmp.notifiedThresholds ?? [3, 5],
        };
      }
      return nextEmp;
    });
    if (migrated) {
      saveEmployees(updated);
    }
    return updated;
  } catch {
    return INITIAL_EMPLOYEES;
  }
}

export function saveEmployees(employees: Employee[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
}

export function loadRecords(): AttendanceRecord[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
  if (!saved) {
    const initial = generateInitialAttendanceRecords();
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed: AttendanceRecord[] = JSON.parse(saved);
    const { records: reconciled, changed } = reconcileSavedAttendanceRecords(parsed);
    if (changed) {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(reconciled));
    }
    return reconciled;
  } catch {
    const initial = generateInitialAttendanceRecords();
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(initial));
    return initial;
  }
}

export function saveRecords(records: AttendanceRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
}

export function loadQuizSessions(): QuizSessionRecord[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_QUIZ_SESSIONS);
  if (!saved) {
    const initial = generateInitialQuizSessions();
    localStorage.setItem(STORAGE_KEY_QUIZ_SESSIONS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch {
    const initial = generateInitialQuizSessions();
    localStorage.setItem(STORAGE_KEY_QUIZ_SESSIONS, JSON.stringify(initial));
    return initial;
  }
}

export function saveQuizSessions(sessions: QuizSessionRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_QUIZ_SESSIONS, JSON.stringify(sessions));
}

export function generateInitialMissedFeedbacks(): MissedQuizFeedback[] {
  return [
    {
      id: 'fb-seed-1',
      employeeId: 'HR-402',
      employeeName: "David O'Connor",
      department: 'HR',
      date: getDateOffset(3),
      missedStreak: 3,
      reason: 'Heavy workload or urgent client/project deadlines',
      additionalNotes: 'Q4 compensation benchmarking cycle overlapped with weekly quiz windows.',
    },
  ];
}

export function generateInitialBenefitRedemptions(): BenefitRedemption[] {
  return [
    {
      id: 'red-seed-1',
      employeeId: 'ACC-101',
      employeeName: 'Elena Rostova, CPA',
      department: 'Accounting',
      benefitId: 'ben-to-remote-day',
      benefitTitle: 'Additional Day of Remote Work',
      category: 'Time Off',
      pointsSpent: 140,
      date: getDateOffset(2),
      status: 'Approved',
    },
    {
      id: 'red-seed-2',
      employeeId: 'MKT-201',
      employeeName: 'Maya Lin',
      department: 'Marketing',
      benefitId: 'ben-pd-course-book',
      benefitTitle: 'Company-Paid Course, Certification, or Book',
      category: 'Professional Development',
      pointsSpent: 200,
      date: getDateOffset(1),
      status: 'Pending Manager Fulfillment',
    },
  ];
}

export function loadMissedQuizFeedbacks(): MissedQuizFeedback[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_MISSED_FEEDBACKS);
  if (!saved) {
    const initial = generateInitialMissedFeedbacks();
    localStorage.setItem(STORAGE_KEY_MISSED_FEEDBACKS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return generateInitialMissedFeedbacks();
  }
}

export function saveMissedQuizFeedback(
  feedback: MissedQuizFeedback,
  authSession?: AuthSession
): MissedQuizFeedback[] {
  assertEmployeeScope(authSession, feedback.employeeId);
  const existing = loadMissedQuizFeedbacks();
  const updated = [feedback, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_MISSED_FEEDBACKS, JSON.stringify(updated));
  }
  const employees = loadEmployees();
  const idx = employees.findIndex(e => e.id === feedback.employeeId);
  if (idx !== -1) {
    employees[idx] = {
      ...employees[idx],
      lastMissedSurveyDate: feedback.date,
    };
    saveEmployees(employees);
  }
  return updated;
}

export function loadBenefitRedemptions(): BenefitRedemption[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_BENEFIT_REDEMPTIONS);
  if (!saved) {
    const initial = generateInitialBenefitRedemptions();
    localStorage.setItem(STORAGE_KEY_BENEFIT_REDEMPTIONS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return generateInitialBenefitRedemptions();
  }
}

export function saveBenefitRedemptions(redemptions: BenefitRedemption[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_BENEFIT_REDEMPTIONS, JSON.stringify(redemptions));
}

export function getLeaderboardWinnerId(employees: Employee[]): string | null {
  if (employees.length === 0) return null;
  const sorted = [...employees]
    .filter(e => e.isQuizEligible !== false)
    .sort((a, b) => (b.rewardPoints - a.rewardPoints) || (b.averageScore - a.averageScore));
  return sorted[0]?.id ?? null;
}

export function redeemBenefit(
  employeeId: string,
  benefitId: string,
  authSession?: AuthSession
): {
  redemption: BenefitRedemption;
  employees: Employee[];
  redemptions: BenefitRedemption[];
} {
  assertEmployeeScope(authSession, employeeId);
  const employees = loadEmployees();
  const empIdx = employees.findIndex(e => e.id === employeeId);
  if (empIdx === -1) throw new Error('Employee not found.');

  const emp = employees[empIdx];

  const benefit = NON_TAXABLE_BENEFITS_CATALOG.find(b => b.id === benefitId);
  if (!benefit) throw new Error('Selected benefit not found.');

  if (benefit.firstPlaceOnly) {
    const winnerId = getLeaderboardWinnerId(employees);
    if (winnerId !== emp.id) {
      throw new Error('Half a day off is reserved exclusively for the #1 ranked participant on the L&D leaderboard.');
    }
  }

  if ((emp.rewardPoints || 0) < benefit.pointsCost) {
    throw new Error(`Insufficient points (${emp.rewardPoints || 0} pts available, ${benefit.pointsCost} pts required).`);
  }

  employees[empIdx] = {
    ...emp,
    rewardPoints: (emp.rewardPoints || 0) - benefit.pointsCost,
  };
  saveEmployees(employees);

  const redemption: BenefitRedemption = {
    id: `red-${Date.now()}-${emp.id}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    benefitId: benefit.id,
    benefitTitle: benefit.title,
    category: benefit.category,
    pointsSpent: benefit.pointsCost,
    date: formatLocalDate(new Date()),
    status: 'Pending Manager Fulfillment',
  };

  const redemptions = [redemption, ...loadBenefitRedemptions()];
  saveBenefitRedemptions(redemptions);

  return { redemption, employees, redemptions };
}

export function updateRedemptionStatus(
  redemptionId: string,
  status: 'Approved' | 'Pending Manager Fulfillment',
  authSession?: AuthSession
): BenefitRedemption[] {
  assertManagerScope(authSession);
  const redemptions = loadBenefitRedemptions();
  const idx = redemptions.findIndex(r => r.id === redemptionId);
  if (idx !== -1) {
    redemptions[idx] = { ...redemptions[idx], status };
    saveBenefitRedemptions(redemptions);
  }
  return redemptions;
}

/**
 * Direct Clock-in: Registers attendance immediately by Employee ID.
 * Completing a quiz is NOT required for attendance.
 * Duplicate clock-ins on the same calendar day are prevented.
 */
export function quickClockIn(
  employeeId: string,
  authSession?: AuthSession
): { record: AttendanceRecord; employees: Employee[] } {
  const cleanId = employeeId.trim().toUpperCase();
  if (!cleanId) {
    throw new Error('MISSING_EMPLOYEE_ID');
  }
  assertEmployeeScope(authSession, cleanId);
  const employees = loadEmployees();
  const records = loadRecords();

  const empIndex = employees.findIndex(e => e.id.toUpperCase() === cleanId);
  if (empIndex === -1) {
    throw new Error(`EMPLOYEE_NOT_FOUND:${employeeId}`);
  }

  const emp = employees[empIndex];
  const now = new Date();
  const dateStr = formatLocalDate(now);

  // Require resolving any previous missing clock-out shift before starting a new shift
  const missingClockOuts = findMissingClockOutRecords(records, emp.id, now);
  if (missingClockOuts.length > 0) {
    const incomplete = missingClockOuts[0];
    throw new Error(
      `INCOMPLETE_PREVIOUS_SHIFT:${incomplete.id}:${incomplete.date}:${incomplete.checkInTime}`
    );
  }

  // Prevent duplicate clock-in on the same calendar day
  const existingToday = records.find(r => r.employeeId === emp.id && r.date === dateStr);
  if (existingToday) {
    throw new Error(`DUPLICATE_CHECK_IN:${emp.name}:${existingToday.checkInTime}`);
  }

  // Prevent starting a new shift if an overnight shift is still in progress
  const openShift = findActiveOpenShift(records, emp.id, now);
  if (openShift) {
    throw new Error(`DUPLICATE_CHECK_IN:${emp.name}:${openShift.checkInTime}`);
  }

  const checkInTime = formatTime12h(now);
  const attendanceStatus: AttendanceStatus = evaluateAttendanceStatus(now, emp);

  const newRecord: AttendanceRecord = {
    id: `att-${Date.now()}-${emp.id}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    date: dateStr,
    checkInTime,
    rawTimestamp: now.getTime(),
    clockInIso: formatLocalIsoWithOffset(now),
    clockInUtcOffsetMinutes: -now.getTimezoneOffset(),
    attendanceStatus,
    clockInType: 'direct_clock_in',
    verified: true,
  };

  // Update employee check-in status and streak
  const newTotal = emp.totalCheckIns + 1;
  employees[empIndex] = {
    ...emp,
    attendanceStreak: emp.attendanceStreak + 1,
    totalCheckIns: newTotal,
    isRegisteredToday: true,
  };

  const updatedRecords = [newRecord, ...records];
  saveEmployees(employees);
  saveRecords(updatedRecords);

  return { record: newRecord, employees };
}

/**
 * Direct Clock-Out: Records clock-out time for an employee who has already clocked in today
 * or has an active unclosed overnight shift.
 * Rejects with NOT_CLOCKED_IN or ALREADY_CLOCKED_OUT.
 */
export function quickClockOut(
  employeeId: string,
  authSession?: AuthSession
): { record: AttendanceRecord; employees: Employee[] } {
  const cleanId = employeeId.trim().toUpperCase();
  if (!cleanId) {
    throw new Error('MISSING_EMPLOYEE_ID');
  }
  assertEmployeeScope(authSession, cleanId);
  const employees = loadEmployees();
  const records = loadRecords();

  const empIndex = employees.findIndex(e => e.id.toUpperCase() === cleanId);
  if (empIndex === -1) {
    throw new Error(`EMPLOYEE_NOT_FOUND:${employeeId}`);
  }

  const emp = employees[empIndex];
  const now = new Date();
  const dateStr = formatLocalDate(now);

  const todayRecIdx = records.findIndex(r => r.employeeId === emp.id && r.date === dateStr);
  let targetIdx = todayRecIdx;

  if (targetIdx !== -1) {
    if (records[targetIdx].checkOutTime) {
      throw new Error(`ALREADY_CLOCKED_OUT:${records[targetIdx].checkOutTime}`);
    }
  } else {
    const openOvernight = findActiveOpenShift(records, emp.id, now);
    if (!openOvernight) {
      throw new Error('NOT_CLOCKED_IN');
    }
    targetIdx = records.findIndex(r => r.id === openOvernight.id);
  }

  const checkOutTime = formatTime12h(now);

  const completedCandidate: AttendanceRecord = {
    ...records[targetIdx],
    checkOutTime,
    checkOutDate: dateStr,
    checkOutTimestamp: now.getTime(),
    checkOutIso: formatLocalIsoWithOffset(now),
    checkOutUtcOffsetMinutes: -now.getTimezoneOffset(),
    clockOutSource: 'direct',
  };
  const shiftInfo = getShiftStatusInfo(completedCandidate, now);

  records[targetIdx] = {
    ...completedCandidate,
    ...(shiftInfo.state === 'completed' && shiftInfo.totalMinutes !== null
      ? {
          durationMinutes: shiftInfo.totalMinutes,
          durationFormatted: shiftInfo.totalHoursFormatted,
        }
      : {}),
  };

  saveRecords(records);
  return { record: records[targetIdx], employees };
}

/**
 * Manual Clock-Out Completion: Completes a previous incomplete attendance record
 * using an employee-selected clock-out date and time after validation.
 * Preserves the original Missing Clock-Out status and correction history for manager transparency.
 */
export function submitManualClockOut(
  employeeId: string,
  recordId: string,
  selectedDate: string,
  selectedTime: string,
  authSession?: AuthSession,
  reasonNote?: string,
  now: Date = new Date()
): { record: AttendanceRecord; records: AttendanceRecord[]; employees: Employee[] } {
  const cleanId = employeeId.trim().toUpperCase();
  if (!cleanId) {
    throw new Error('MISSING_EMPLOYEE_ID');
  }
  assertEmployeeScope(authSession, cleanId);

  const employees = loadEmployees();
  const records = loadRecords();

  const emp = employees.find(e => e.id.toUpperCase() === cleanId);
  if (!emp) {
    throw new Error(`EMPLOYEE_NOT_FOUND:${employeeId}`);
  }

  const targetIdx = records.findIndex(
    r => r.id === recordId && r.employeeId.toUpperCase() === cleanId
  );
  if (targetIdx === -1) {
    throw new Error('ATTENDANCE_RECORD_NOT_FOUND');
  }

  const targetRec = records[targetIdx];
  const validation = validateManualClockOutSelection(
    records,
    targetRec,
    selectedDate,
    selectedTime,
    now
  );

  if (!validation.valid) {
    throw new Error(validation.errorMessage);
  }

  const cleanReason = reasonNote?.trim() || undefined;
  const parsedManualOut = parseManualDateTimeInput(
    validation.selectedOutDate,
    validation.selectedOutTime12h
  );
  const manualCandidate: AttendanceRecord = {
    ...targetRec,
    checkOutTime: validation.selectedOutTime12h,
    checkOutDate: validation.selectedOutDate,
    checkOutTimestamp: validation.selectedOutTimestamp,
    ...(parsedManualOut
      ? {
          checkOutIso: formatLocalIsoWithOffset(parsedManualOut.dateObj),
          checkOutUtcOffsetMinutes: -parsedManualOut.dateObj.getTimezoneOffset(),
        }
      : {}),
    clockOutSource: 'manual_correction',
    originalClockOutStatus: targetRec.originalClockOutStatus ?? 'Missing Clock-Out',
    ...(cleanReason ? { manualClockOutReason: cleanReason } : {}),
  };
  const finalShiftInfo = getShiftStatusInfo(manualCandidate, now);
  const computedDurationLabel =
    finalShiftInfo.state === 'completed'
      ? finalShiftInfo.totalHoursFormatted
      : validation.calculatedDuration;

  const correctionEntry: ManualClockOutCorrection = {
    originalStatus: 'Missing Clock-Out',
    enteredCheckOutDate: validation.selectedOutDate,
    enteredCheckOutTime: validation.selectedOutTime12h,
    correctedAt: `${formatLocalDate(now)} ${formatTime12h(now)}`,
    correctedTimestamp: now.getTime(),
    submittedByEmployeeId: emp.id,
    calculatedDuration: computedDurationLabel,
    ...(cleanReason ? { reasonNote: cleanReason } : {}),
  };

  const updatedRecord: AttendanceRecord = {
    ...manualCandidate,
    ...(finalShiftInfo.state === 'completed' && finalShiftInfo.totalMinutes !== null
      ? {
          durationMinutes: finalShiftInfo.totalMinutes,
          durationFormatted: finalShiftInfo.totalHoursFormatted,
        }
      : {}),
    manualClockOutHistory: [...(targetRec.manualClockOutHistory || []), correctionEntry],
  };

  records[targetIdx] = updatedRecord;
  saveRecords(records);

  return { record: updatedRecord, records, employees };
}

/**
 * Record when an employee defers a required weekly quiz ("Complete Later").
 * Marks attendance quiz status as 'skipped' (Not Participated) and stores weekly deferral,
 * WITHOUT immediately incrementing consecutiveMissedQuizzes.
 * A required weekly quiz is counted as missed ONLY after its scheduled week ends without completion.
 */
export function recordSkippedQuiz(
  employeeId: string,
  recordId?: string,
  authSession?: AuthSession
): {
  employee: Employee;
  missedCount: number;
  shouldShowSurvey: boolean;
  shouldNotifyManager: boolean;
} {
  assertEmployeeScope(authSession, employeeId);
  const employees = loadEmployees();
  const records = loadRecords();
  const todayStr = formatLocalDate(new Date());
  const currentWeekKey = getIsoWeekKey(todayStr);

  const empIdx = employees.findIndex(e => e.id.toUpperCase() === employeeId.trim().toUpperCase());
  if (empIdx === -1) throw new Error('Employee not found.');

  const currentMissed = employees[empIdx].consecutiveMissedQuizzes || 0;

  employees[empIdx] = {
    ...employees[empIdx],
    lastDeferredWeeklyQuizWeek: currentWeekKey,
  };
  saveEmployees(employees);

  // Mark attendance record as 'skipped' (Not Participated) without changing attendanceStatus or checkInTime
  const targetIdx = recordId
    ? records.findIndex(r => r.id === recordId)
    : records.findIndex(r => r.employeeId === employees[empIdx].id && r.date === todayStr);

  if (targetIdx !== -1 && records[targetIdx].optionalActivityCompleted !== 'mixed_quiz') {
    records[targetIdx] = {
      ...records[targetIdx],
      optionalActivityCompleted: 'skipped',
    };
    saveRecords(records);
  }

  return {
    employee: employees[empIdx],
    missedCount: currentMissed,
    shouldShowSurvey: false,
    shouldNotifyManager: false,
  };
}

/**
 * Evaluates a scheduled ISO week that has ended.
 * Only increments consecutiveMissedQuizzes if:
 * 1) endedWeekKey is strictly before the current week (week has ended)
 * 2) employee did NOT complete the weekly quiz for endedWeekKey
 * 3) endedWeekKey has not already been evaluated in evaluatedMissedWeeks
 * Deduplicates manager threshold notifications at 3 and 5 consecutive missed quizzes.
 */
export function finalizeEndedWeekIfMissed(
  employeeId: string,
  endedWeekKey: string,
  authSession?: AuthSession
): {
  employee: Employee;
  incremented: boolean;
  newlyNotifiedThreshold: 3 | 5 | null;
} {
  if (authSession?.role === 'employee') {
    assertEmployeeScope(authSession, employeeId);
  }
  const employees = loadEmployees();
  const empIdx = employees.findIndex(e => e.id.toUpperCase() === employeeId.trim().toUpperCase());
  if (empIdx === -1) throw new Error('Employee not found.');

  const emp = employees[empIdx];
  const currentWeekKey = getIsoWeekKey();
  const evaluated = emp.evaluatedMissedWeeks || [];

  // Only count as missed AFTER the scheduled week has ended without completion
  if (
    endedWeekKey >= currentWeekKey ||
    emp.lastCompletedWeeklyQuizWeek === endedWeekKey ||
    evaluated.includes(endedWeekKey)
  ) {
    return { employee: emp, incremented: false, newlyNotifiedThreshold: null };
  }

  const nextMissed = (emp.consecutiveMissedQuizzes || 0) + 1;
  const notified = emp.notifiedThresholds || [];
  let newlyNotifiedThreshold: 3 | 5 | null = null;
  const updatedNotified = [...notified];

  if (nextMissed >= 5 && !updatedNotified.includes(5)) {
    newlyNotifiedThreshold = 5;
    if (!updatedNotified.includes(3)) updatedNotified.push(3);
    updatedNotified.push(5);
  } else if (nextMissed >= 3 && !updatedNotified.includes(3)) {
    newlyNotifiedThreshold = 3;
    updatedNotified.push(3);
  }

  employees[empIdx] = {
    ...emp,
    consecutiveMissedQuizzes: nextMissed,
    evaluatedMissedWeeks: [...evaluated, endedWeekKey],
    notifiedThresholds: updatedNotified,
  };
  saveEmployees(employees);

  return {
    employee: employees[empIdx],
    incremented: true,
    newlyNotifiedThreshold,
  };
}

/**
 * Record a completed Department L&D Quiz session.
 * Stores full session questions, user answers, correct answers, and topics for review.
 * Awards non-taxable benefit points. Completing a required weekly quiz resets consecutiveMissedQuizzes
 * and prevents duplicate weekly completion records for the same ISO week.
 * Does NOT alter or invalidate the employee's existing attendance timestamp.
 */
export function recordCompletedQuizSession(
  session: QuizSessionRecord,
  authSession?: AuthSession
): {
  sessions: QuizSessionRecord[];
  employees: Employee[];
  records: AttendanceRecord[];
  pointsEarned: number;
  duplicateWeeklyBlocked?: boolean;
} {
  assertEmployeeScope(authSession, session.employeeId);
  const sessions = loadQuizSessions();
  const employees = loadEmployees();
  const records = loadRecords();

  // Prevent duplicate submission of the same session ID
  if (sessions.some(s => s.id === session.id)) {
    return { sessions, employees, records, pointsEarned: 0, duplicateWeeklyBlocked: true };
  }

  const empIdx = employees.findIndex(e => e.id === session.employeeId);
  const isWeeklyQuiz = session.quizKind !== 'optional';
  const weekKey = getIsoWeekKey(session.date);

  // Prevent duplicate weekly quiz completion records for the same week
  if (
    isWeeklyQuiz &&
    empIdx !== -1 &&
    employees[empIdx].lastCompletedWeeklyQuizWeek === weekKey
  ) {
    return { sessions, employees, records, pointsEarned: 0, duplicateWeeklyBlocked: true };
  }

  const pointsEarned =
    session.pointsEarned ?? 40 + session.correctCount * 15 + (session.score === 100 ? 20 : 0);
  const enrichedSession: QuizSessionRecord = {
    ...session,
    pointsEarned,
  };

  const updatedSessions = [enrichedSession, ...sessions];
  saveQuizSessions(updatedSessions);

  // Update employee averages, completed count, points; reset consecutive misses when completing a weekly quiz
  if (empIdx !== -1) {
    const emp = employees[empIdx];
    const newTotalQuizzes = (emp.totalQuizzesCompleted || 0) + 1;
    const newAvg = Math.round(
      ((emp.averageScore || 0) * (newTotalQuizzes - 1) + session.score) / newTotalQuizzes
    );

    employees[empIdx] = {
      ...emp,
      totalQuizzesCompleted: newTotalQuizzes,
      averageScore: newAvg,
      consecutiveMissedQuizzes: isWeeklyQuiz ? 0 : emp.consecutiveMissedQuizzes,
      rewardPoints: (emp.rewardPoints || 0) + pointsEarned,
      lastCompletedWeeklyQuizWeek: isWeeklyQuiz ? weekKey : emp.lastCompletedWeeklyQuizWeek,
      lastDeferredWeeklyQuizWeek:
        isWeeklyQuiz && emp.lastDeferredWeeklyQuizWeek === weekKey
          ? undefined
          : emp.lastDeferredWeeklyQuizWeek,
      lastMissedSurveyDate: isWeeklyQuiz ? undefined : emp.lastMissedSurveyDate,
      managerFollowUpStatus: isWeeklyQuiz ? undefined : emp.managerFollowUpStatus,
      managerCheckInCompletedDate: isWeeklyQuiz ? undefined : emp.managerCheckInCompletedDate,
      notifiedThresholds: isWeeklyQuiz ? [] : emp.notifiedThresholds,
    };
    saveEmployees(employees);
  }

  // Link quiz to today's attendance record if present
  const todayStr = session.date;
  const todayRecIdx = records.findIndex(
    r => r.employeeId === session.employeeId && r.date === todayStr
  );
  if (todayRecIdx !== -1) {
    records[todayRecIdx] = {
      ...records[todayRecIdx],
      optionalActivityCompleted: 'mixed_quiz',
      quizSessionId: session.id,
      gameStats: {
        durationSeconds: 120,
        score: session.score,
        wordsSolved: session.items.filter(i => i.type === 'word_puzzle' && i.isCorrect).length,
        wordsAttempted: session.items.filter(i => i.type === 'word_puzzle').length,
        accuracyPct: session.score,
        wpm: 50,
        streak: session.correctCount,
        cognitiveRating:
          session.score >= 85
            ? 'Peak Agility'
            : session.score >= 70
            ? 'High Focus'
            : 'Steady Readiness',
        activityType: 'mixed_quiz',
        quizScore: {
          correct: session.correctCount,
          total: session.totalCount,
          percentage: session.score,
        },
      },
    };
    saveRecords(records);
  }

  return { sessions: updatedSessions, employees, records, pointsEarned };
}

/**
 * Legacy compatibility helper for attachActivityScore
 */
export function attachActivityScore(
  recordId: string,
  activityType: 'mixed_quiz' | 'mcq_quiz' | 'word_puzzle',
  stats: GameStats
): { records: AttendanceRecord[]; employees: Employee[] } {
  const records = loadRecords();
  const employees = loadEmployees();

  const recIdx = records.findIndex(r => r.id === recordId);
  if (recIdx !== -1) {
    const existing = records[recIdx];
    records[recIdx] = {
      ...existing,
      optionalActivityCompleted: activityType,
      gameStats: {
        ...stats,
        activityType,
      }
    };
    saveRecords(records);
  }

  return { records, employees };
}

export function updateRecordNote(
  recordId: string,
  note: string,
  authSession?: AuthSession
): AttendanceRecord[] {
  assertManagerScope(authSession);
  const records = loadRecords();
  const idx = records.findIndex(r => r.id === recordId);
  if (idx !== -1) {
    records[idx].managerNotes = note;
    saveRecords(records);
  }
  return records;
}

export function toggleEmployeeQuizEligibility(
  employeeId: string,
  authSession?: AuthSession
): Employee[] {
  assertManagerScope(authSession);
  const employees = loadEmployees();
  const idx = employees.findIndex(e => e.id === employeeId);
  if (idx !== -1) {
    employees[idx] = {
      ...employees[idx],
      isQuizEligible: employees[idx].isQuizEligible === false ? true : false,
    };
    saveEmployees(employees);
  }
  return employees;
}

export function getManagerFollowUpStatus(employee: Employee): ManagerFollowUpStatus {
  if (employee.managerFollowUpStatus) {
    return employee.managerFollowUpStatus;
  }
  if (employee.managerCheckInCompletedDate) {
    return 'completed';
  }
  if (employee.managerFollowUpDate || employee.managerFollowUpNote) {
    return 'plan_recorded';
  }
  return 'recommended';
}

export function logManagerFollowUp(
  employeeId: string,
  note: string,
  authSession?: AuthSession
): Employee[] {
  assertManagerScope(authSession);
  const employees = loadEmployees();
  const idx = employees.findIndex(e => e.id === employeeId);
  if (idx !== -1) {
    const existingStatus = getManagerFollowUpStatus(employees[idx]);
    employees[idx] = {
      ...employees[idx],
      managerFollowUpStatus: existingStatus === 'completed' ? 'completed' : 'plan_recorded',
      managerFollowUpNote:
        note.trim() || 'Learning support plan recorded with flexible scheduling options (no penalty).',
      managerFollowUpDate: formatLocalDate(new Date()),
    };
    saveEmployees(employees);
  }
  return employees;
}

export function confirmManagerCheckInCompleted(
  employeeId: string,
  authSession?: AuthSession
): Employee[] {
  assertManagerScope(authSession);
  const employees = loadEmployees();
  const idx = employees.findIndex(e => e.id === employeeId);
  if (idx !== -1) {
    const todayStr = formatLocalDate(new Date());
    employees[idx] = {
      ...employees[idx],
      managerFollowUpStatus: 'completed',
      managerCheckInCompletedDate: todayStr,
      managerFollowUpDate: employees[idx].managerFollowUpDate || todayStr,
    };
    saveEmployees(employees);
  }
  return employees;
}

export function addNewEmployee(
  name: string,
  email: string,
  role: string,
  department: Department,
  authSession?: AuthSession
): Employee[] {
  assertManagerScope(authSession);
  const employees = loadEmployees();
  const deptPrefix = department === 'Accounting' ? 'ACC' : department === 'Marketing' ? 'MKT' : department === 'Engineering' ? 'ENG' : 'HR';
  const newEmp: Employee = {
    id: `${deptPrefix}-${Math.floor(100 + Math.random() * 899)}`,
    name,
    email,
    role,
    department,
    hireDate: formatLocalDate(new Date()),
    attendanceStreak: 0,
    totalCheckIns: 0,
    totalQuizzesCompleted: 0,
    averageScore: 0,
    isRegisteredToday: false,
    consecutiveMissedQuizzes: 0,
    isQuizEligible: true,
    rewardPoints: 50,
  };
  const updated = [...employees, newEmp];
  saveEmployees(updated);
  return updated;
}

export function resetDemoData(): {
  employees: Employee[];
  records: AttendanceRecord[];
  sessions: QuizSessionRecord[];
  feedbacks: MissedQuizFeedback[];
  redemptions: BenefitRedemption[];
} {
  localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
  localStorage.removeItem(STORAGE_KEY_RECORDS);
  localStorage.removeItem(STORAGE_KEY_QUIZ_SESSIONS);
  localStorage.removeItem(STORAGE_KEY_MISSED_FEEDBACKS);
  localStorage.removeItem(STORAGE_KEY_BENEFIT_REDEMPTIONS);

  const employees = INITIAL_EMPLOYEES;
  const records = generateInitialAttendanceRecords();
  const sessions = generateInitialQuizSessions();
  const feedbacks = generateInitialMissedFeedbacks();
  const redemptions = generateInitialBenefitRedemptions();

  saveEmployees(employees);
  saveRecords(records);
  saveQuizSessions(sessions);
  localStorage.setItem(STORAGE_KEY_MISSED_FEEDBACKS, JSON.stringify(feedbacks));
  saveBenefitRedemptions(redemptions);

  return { employees, records, sessions, feedbacks, redemptions };
}

/**
 * Unified Training Recommendation Classifier aligned with Weekly Quiz Participation Policy:
 * - 0–59%: Needs Training -> Foundational Training
 * - 60–79%: Refresher Recommended -> Targeted Refresher
 * - 80–100%: Proficient -> Advanced Learning / Knowledge Maintenance
 * - No completed quiz results: Not Yet Assessed -> Complete Weekly Quiz
 * Never labels 1 completed quiz as "Insufficient Data" and treats a single high score
 * as an initial snapshot rather than proof of long-term improvement.
 */
export function classifyTrainingRecommendation(
  accuracyPct: number | null,
  completedQuizCount: number
): TrainingRecommendationSummary {
  const quizLabel = completedQuizCount === 1 ? 'quiz' : 'quizzes';
  const basisLabel = `Based on ${completedQuizCount} ${quizLabel}`;

  if (completedQuizCount <= 0 || accuracyPct === null) {
    return {
      status: 'Not Yet Assessed',
      recommendation: 'Complete Weekly Quiz',
      completedQuizCount: 0,
      accuracyPct: null,
      basisLabel: 'Based on 0 quizzes',
    };
  }

  let status: TrainingAssessmentStatus;
  let recommendation: TrainingRecommendationAction;

  if (accuracyPct <= 59) {
    status = 'Needs Training';
    recommendation = 'Foundational Training';
  } else if (accuracyPct <= 79) {
    status = 'Refresher Recommended';
    recommendation = 'Targeted Refresher';
  } else {
    status = 'Proficient';
    recommendation = 'Advanced Learning / Knowledge Maintenance';
  }

  const cautionNote =
    completedQuizCount === 1 && accuracyPct >= 80
      ? 'Initial assessment from 1 completed quiz; continue weekly participation to verify long-term retention.'
      : undefined;

  return {
    status,
    recommendation,
    completedQuizCount,
    accuracyPct,
    basisLabel,
    cautionNote,
  };
}

/**
 * Analytics: Computes topic-level training insights using actual completed quiz results.
 */
export function computeTopicTrainingInsights(sessions: QuizSessionRecord[]): TopicTrainingInsight[] {
  const topicMap: Record<
    string,
    {
      topic: string;
      department: Department;
      total: number;
      incorrect: number;
      sessionIds: Set<string>;
    }
  > = {};

  const topicFocusMap: Record<string, string> = {
    'Tax Withholding & Compliance':
      'statutory payroll deduction calculations and remittance deadlines',
    'Database Design & Indexing':
      'relational normalization (3NF), B-Tree index optimization, and query execution plans',
    'Unit Economics (CAC & LTV)':
      'cohort retention curves and blended CAC:LTV calculations',
    'Workplace Compliance & Investigation':
      'impartial fact-finding, documentation, and non-retaliation standards',
    'Compensation & Benefits Strategy':
      'internal salary band equity and benefits benchmarking',
    'Accrual & Revenue Recognition':
      'multi-element contract milestones and revenue deferral schedules',
    'A/B Testing & Optimization':
      'statistical significance, power calculations, and sample size standards',
    'CI/CD & DevOps Practices':
      'automated rollback triggers, container packaging, and canary deployments',
    'Bookkeeping & Double-Entry Ledgers':
      'double-entry debits/credits and general ledger reconciliation',
    'SEO & Organic Growth':
      'technical crawlability, mobile performance, and organic search standards',
    'Analytics & Customer Satisfaction':
      'retention cohort diagnostics and churn reduction metrics',
    'Brand Strategy & Positioning':
      'ideal customer personas and differentiated messaging',
    'Algorithms & Complexity':
      'algorithmic time complexity and safe refactoring techniques',
    'System Design & Scalability':
      'distributed latency budgeting and resilient architecture',
    'Talent Acquisition & Interviewing':
      'structured STAR behavioral interviewing and onboarding effectiveness',
    'Performance Management':
      'continuous formative feedback and objective annual appraisals',
    'Auditing & Internal Controls':
      'assurance sampling and internal control verification',
    'Financial Statement Presentation':
      'balance sheet equity classification and disclosure accuracy',
  };

  const buildAlignedSuggestion = (
    topic: string,
    department: Department,
    status: TrainingAssessmentStatus
  ): string => {
    const focus = topicFocusMap[topic] || `${department} ${topic} core concepts`;
    if (status === 'Needs Training') {
      return `Foundational training recommended: complete a guided walkthrough and structured fundamentals practice covering ${focus}.`;
    }
    if (status === 'Refresher Recommended') {
      return `Targeted refresher recommended: review missed scenarios and reinforce applied workflows on ${focus}.`;
    }
    return `Knowledge maintenance: team demonstrates strong mastery on ${focus}; maintain proficiency through periodic weekly check-ins and peer knowledge sharing.`;
  };

  sessions.forEach(sess => {
    sess.items.forEach(item => {
      const key = `${sess.department}__${item.topic}`;
      if (!topicMap[key]) {
        topicMap[key] = {
          topic: item.topic,
          department: sess.department,
          total: 0,
          incorrect: 0,
          sessionIds: new Set<string>(),
        };
      }
      topicMap[key].total += 1;
      topicMap[key].sessionIds.add(sess.id);
      if (!item.isCorrect) {
        topicMap[key].incorrect += 1;
      }
    });
  });

  return Object.values(topicMap)
    .map(data => {
      const correctCount = data.total - data.incorrect;
      const accuracyPct = data.total > 0 ? Math.round((correctCount / data.total) * 100) : 0;
      const completedQuizCount = data.sessionIds.size;
      const classification = classifyTrainingRecommendation(accuracyPct, completedQuizCount);

      const suggestion = buildAlignedSuggestion(data.topic, data.department, classification.status);

      return {
        topic: data.topic,
        department: data.department,
        totalAttempts: data.total,
        incorrectAttempts: data.incorrect,
        completedQuizCount,
        accuracyPct,
        status: classification.status,
        recommendation: classification.recommendation,
        basisLabel: classification.basisLabel,
        cautionNote: classification.cautionNote,
        trainingSuggestion: suggestion,
      };
    })
    .sort((a, b) => a.accuracyPct - b.accuracyPct);
}

/**
 * Computes individual employee training recommendations solely from actual completed quiz results.
 * Skipped optional quizzes and weekly missed-quiz tracking never penalize training recommendations.
 */
export function computeEmployeeTrainingInsights(
  employees: Employee[],
  sessions: QuizSessionRecord[]
): EmployeeTrainingInsight[] {
  const currentWeekKey = getIsoWeekKey();

  return employees.map(emp => {
    const empSessions = sessions.filter(s => s.employeeId === emp.id);
    const completedQuizCount = empSessions.length;
    const averageScore =
      completedQuizCount > 0
        ? Math.round(empSessions.reduce((acc, s) => acc + s.score, 0) / completedQuizCount)
        : null;

    const classification = classifyTrainingRecommendation(averageScore, completedQuizCount);

    // Separate weekly participation tracking (does not alter accuracy or recommendation)
    const weeklyStatus = getWeeklyQuizStatus(emp, currentWeekKey);
    const hasWeeklySessionThisWeek = empSessions.some(
      s => getIsoWeekKey(s.date) === currentWeekKey && s.quizKind !== 'optional'
    );
    const missed = emp.consecutiveMissedQuizzes || 0;
    const weeklyParticipationLabel =
      weeklyStatus === 'completed' || hasWeeklySessionThisWeek
        ? 'Weekly Quiz Completed'
        : missed > 0
        ? `${missed} Consecutive Weekly ${missed === 1 ? 'Miss' : 'Misses'}`
        : weeklyStatus === 'deferred'
        ? 'Weekly Quiz Deferred (Complete Later)'
        : 'Weekly Quiz Pending';

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      completedQuizCount,
      averageScore,
      status: classification.status,
      recommendation: classification.recommendation,
      basisLabel: classification.basisLabel,
      cautionNote: classification.cautionNote,
      weeklyParticipationLabel,
    };
  });
}

/**
 * Computes department-level training recommendations using the unified criteria
 * based strictly on actual completed quiz results for each department.
 */
export function computeDepartmentTrainingInsights(
  sessions: QuizSessionRecord[]
): DepartmentTrainingInsight[] {
  const departments: Department[] = ['Accounting', 'Marketing', 'Engineering', 'HR'];

  return departments.map(department => {
    const deptSessions = sessions.filter(s => s.department === department);
    const completedQuizCount = deptSessions.length;
    const averageScore =
      completedQuizCount > 0
        ? Math.round(deptSessions.reduce((acc, s) => acc + s.score, 0) / completedQuizCount)
        : null;

    const classification = classifyTrainingRecommendation(averageScore, completedQuizCount);

    return {
      department,
      completedQuizCount,
      averageScore,
      status: classification.status,
      recommendation: classification.recommendation,
      basisLabel: classification.basisLabel,
      cautionNote: classification.cautionNote,
    };
  });
}

export function exportAttendanceToCsv(records: AttendanceRecord[], sessions: QuizSessionRecord[]): void {
  const headers = [
    'Record ID',
    'Employee ID',
    'Employee Name',
    'Department',
    'Date',
    'Clock-In Time',
    'Clock-Out Time',
    'Total Hours',
    'Clock-Out Source',
    'Original Status / Correction History',
    'Employee Manual Clock-Out Reason',
    'Attendance Status',
    'Quiz Status',
    'Quiz Score (%)',
    'Topics Covered',
    'Manager Review Note'
  ];

  const rows = records.map(r => {
    const matchedSession = r.quizSessionId
      ? sessions.find(s => s.id === r.quizSessionId)
      : sessions.find(s => s.employeeId === r.employeeId && s.date === r.date);
    const shiftInfo = getShiftStatusInfo(r);
    const clockOutLabel =
      r.checkOutTime ||
      (shiftInfo.state === 'in_progress' ? 'In Progress' : 'Missing Clock-Out');
    const clockOutSourceLabel =
      r.clockOutSource === 'manual_correction'
        ? 'Manually Entered'
        : r.checkOutTime
        ? 'Direct Clock-Out'
        : shiftInfo.state === 'in_progress'
        ? 'In Progress'
        : 'Missing Clock-Out';
    const historyNote =
      r.clockOutSource === 'manual_correction'
        ? `Orig: ${r.originalClockOutStatus || 'Missing Clock-Out'} (${r.manualClockOutHistory?.map(h => `${h.enteredCheckOutDate} ${h.enteredCheckOutTime} logged ${h.correctedAt}${h.reasonNote ? ` - Reason: ${h.reasonNote}` : ''}`).join('; ') || 'Manual entry'})`
        : shiftInfo.state === 'missing_clock_out'
        ? 'Missing Clock-Out'
        : 'Standard';
    const manualReason = r.manualClockOutReason || '';
    const topicsStr = matchedSession ? matchedSession.topics.join('; ') : 'None';
    const scoreVal = matchedSession ? `${matchedSession.score}%` : 'N/A';
    const quizStatusLabel = matchedSession ? 'Completed' : 'Not Participated';

    return [
      r.id,
      r.employeeId,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      `"${r.checkInTime}"`,
      `"${clockOutLabel}"`,
      `"${shiftInfo.totalHoursFormatted}"`,
      `"${clockOutSourceLabel}"`,
      `"${historyNote.replace(/"/g, '""')}"`,
      `"${manualReason.replace(/"/g, '""')}"`,
      r.attendanceStatus,
      `"${quizStatusLabel}"`,
      `"${scoreVal}"`,
      `"${topicsStr}"`,
      `"${(r.managerNotes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Enterprise_LD_Attendance_Quiz_Report_${formatLocalDate(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Role & Data Access Control Layer
 * Enforces self-only access for employees and full-organization access only for authorized managers.
 */
function sanitizeEmployeeForSelfView(emp: Employee): Employee {
  const { managerFollowUpNote: _privateNote, ...safeEmployee } = emp;
  return safeEmployee;
}

function sanitizeRecordForSelfView(rec: AttendanceRecord): AttendanceRecord {
  const { managerNotes: _privateManagerNotes, ...safeRecord } = rec;
  return safeRecord;
}

export function assertEmployeeScope(authSession: AuthSession | undefined, targetEmployeeId: string): void {
  if (!authSession) return;
  if (
    authSession.role !== 'employee' ||
    !authSession.employeeId ||
    authSession.employeeId.trim().toUpperCase() !== targetEmployeeId.trim().toUpperCase()
  ) {
    throw new Error('UNAUTHORIZED_CROSS_EMPLOYEE_ACCESS');
  }
}

export function assertManagerScope(authSession: AuthSession | undefined): void {
  if (!authSession) return;
  if (authSession.role !== 'manager') {
    throw new Error('UNAUTHORIZED_MANAGER_ACCESS');
  }
}

export function authenticateEmployeeAccount(employeeId: string): {
  employee: Employee;
  session: AuthSession;
} {
  const cleanId = employeeId.trim().toUpperCase();
  if (!cleanId) {
    throw new Error('MISSING_EMPLOYEE_ID');
  }
  const employees = loadEmployees();
  const emp = employees.find(e => e.id.toUpperCase() === cleanId);
  if (!emp) {
    throw new Error(`EMPLOYEE_NOT_FOUND:${employeeId}`);
  }
  return {
    employee: sanitizeEmployeeForSelfView(emp),
    session: { role: 'employee', employeeId: emp.id },
  };
}

export function authorizeManagerAccount(accessCode: string): AuthSession {
  const cleanCode = accessCode.trim().toUpperCase();
  if (!cleanCode || (cleanCode !== 'MGR-001' && cleanCode !== 'MANAGER' && cleanCode !== 'ADMIN')) {
    throw new Error('INVALID_MANAGER_ACCESS_CODE');
  }
  return { role: 'manager' };
}

export function getEmployeePortalData(authSession: AuthSession): EmployeePortalScope {
  if (authSession.role !== 'employee' || !authSession.employeeId) {
    throw new Error('UNAUTHORIZED_EMPLOYEE_ACCESS');
  }
  const employees = loadEmployees();
  const target = employees.find(
    e => e.id.toUpperCase() === authSession.employeeId!.trim().toUpperCase()
  );
  if (!target) {
    throw new Error('EMPLOYEE_NOT_FOUND');
  }

  const records = loadRecords()
    .filter(r => r.employeeId === target.id)
    .map(sanitizeRecordForSelfView);
  const quizSessions = loadQuizSessions().filter(s => s.employeeId === target.id);
  const redemptions = loadBenefitRedemptions().filter(r => r.employeeId === target.id);
  const isFirstPlaceWinner = getLeaderboardWinnerId(employees) === target.id;

  return {
    employee: sanitizeEmployeeForSelfView(target),
    records,
    quizSessions,
    redemptions,
    isFirstPlaceWinner,
  };
}

export function getAuthorizedManagerData(authSession: AuthSession): AuthorizedManagerScope {
  if (authSession.role !== 'manager') {
    throw new Error('UNAUTHORIZED_MANAGER_ACCESS');
  }
  return {
    employees: loadEmployees(),
    records: loadRecords(),
    quizSessions: loadQuizSessions(),
    missedFeedbacks: loadMissedQuizFeedbacks(),
    redemptions: loadBenefitRedemptions(),
  };
}

