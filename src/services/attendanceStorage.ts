import { Employee, AttendanceRecord, GameStats, AttendanceStatus, CognitiveRating, Department } from '../types';

const STORAGE_KEY_EMPLOYEES = 'verbashift_employees_v2';
const STORAGE_KEY_RECORDS = 'verbashift_attendance_records_v2';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    name: 'Elena Rostova, CPA',
    email: 'elena.rostova@accounting.firm',
    role: 'Senior Financial Accountant',
    department: 'General Accounting',
    hireDate: '2022-03-15',
    attendanceStreak: 18,
    totalCheckIns: 142,
    averageScore: 920,
    averageWpm: 58,
    isRegisteredToday: true,
  },
  {
    id: 'emp-102',
    name: 'Marcus Vance',
    email: 'marcus.vance@accounting.firm',
    role: 'Internal Audit Manager',
    department: 'Audit & Assurance',
    hireDate: '2023-01-10',
    attendanceStreak: 12,
    totalCheckIns: 110,
    averageScore: 840,
    averageWpm: 52,
    isRegisteredToday: true,
  },
  {
    id: 'emp-103',
    name: 'Priya Sharma, CPA',
    email: 'priya.sharma@accounting.firm',
    role: 'Corporate Controller',
    department: 'General Accounting',
    hireDate: '2021-08-01',
    attendanceStreak: 31,
    totalCheckIns: 230,
    averageScore: 1040,
    averageWpm: 66,
    isRegisteredToday: false,
  },
  {
    id: 'emp-104',
    name: 'David Kim',
    email: 'david.kim@accounting.firm',
    role: 'Senior Tax Specialist',
    department: 'Tax & Compliance',
    hireDate: '2023-06-20',
    attendanceStreak: 9,
    totalCheckIns: 85,
    averageScore: 780,
    averageWpm: 48,
    isRegisteredToday: false,
  },
  {
    id: 'emp-105',
    name: 'Sarah Chen',
    email: 'sarah.chen@accounting.firm',
    role: 'Accounts Receivable & Billing Lead',
    department: 'Accounts Payable & Receivable',
    hireDate: '2022-11-04',
    attendanceStreak: 15,
    totalCheckIns: 160,
    averageScore: 890,
    averageWpm: 55,
    isRegisteredToday: false,
  },
  {
    id: 'emp-106',
    name: 'Jamal Washington, CIA',
    email: 'jamal.w@accounting.firm',
    role: 'Compliance & Ethics Officer',
    department: 'Audit & Assurance',
    hireDate: '2023-02-18',
    attendanceStreak: 22,
    totalCheckIns: 98,
    averageScore: 990,
    averageWpm: 62,
    isRegisteredToday: false,
  },
  {
    id: 'emp-107',
    name: 'Aaliyah Morales',
    email: 'aaliyah.m@accounting.firm',
    role: 'FP&A Senior Analyst',
    department: 'Financial Planning & Analysis',
    hireDate: '2023-08-14',
    attendanceStreak: 6,
    totalCheckIns: 72,
    averageScore: 760,
    averageWpm: 46,
    isRegisteredToday: false,
  },
  {
    id: 'emp-108',
    name: 'Lucas Meyer',
    email: 'lucas.m@accounting.firm',
    role: 'Staff Accountant & Bookkeeper',
    department: 'General Accounting',
    hireDate: '2024-01-08',
    attendanceStreak: 14,
    totalCheckIns: 60,
    averageScore: 880,
    averageWpm: 54,
    isRegisteredToday: false,
  },
];

// Helper to generate dates relative to today
function getDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function generateInitialRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const todayStr = getDateOffset(0);

  // Today's early check-ins for demo
  records.push({
    id: 'rec-today-1',
    employeeId: 'emp-101',
    employeeName: 'Elena Rostova, CPA',
    department: 'General Accounting',
    date: todayStr,
    checkInTime: '08:48:22 AM',
    rawTimestamp: Date.now() - 3600000 * 2,
    attendanceStatus: 'ON_TIME',
    gameStats: {
      durationSeconds: 120,
      score: 960,
      wordsSolved: 6,
      wordsAttempted: 6,
      accuracyPct: 100,
      wpm: 61,
      streak: 6,
      cognitiveRating: 'Peak Agility',
    },
    managerNotes: 'Mastery of fundamental debit/credit entries and code of conduct standards.',
    verified: true,
  });

  records.push({
    id: 'rec-today-2',
    employeeId: 'emp-102',
    employeeName: 'Marcus Vance',
    department: 'Audit & Assurance',
    date: todayStr,
    checkInTime: '09:04:15 AM',
    rawTimestamp: Date.now() - 3600000 * 1.5,
    attendanceStatus: 'ON_TIME',
    gameStats: {
      durationSeconds: 120,
      score: 820,
      wordsSolved: 5,
      wordsAttempted: 6,
      accuracyPct: 83,
      wpm: 51,
      streak: 4,
      cognitiveRating: 'High Focus',
    },
    managerNotes: 'Strong recall of audit evidence and independence guidelines.',
    verified: true,
  });

  // Past 10 business days for all employees
  const sampleTimes = ['08:52:10 AM', '08:58:33 AM', '09:02:11 AM', '09:08:45 AM', '09:16:02 AM'];
  const ratings: CognitiveRating[] = ['Peak Agility', 'High Focus', 'Steady Readiness', 'High Focus'];

  for (let d = 1; d <= 12; d++) {
    // Skip weekend days
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - d);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = dateObj.toISOString().split('T')[0];

    INITIAL_EMPLOYEES.forEach((emp, empIdx) => {
      // Simulate occasional late or skipped attendance
      const isAbsent = (d + empIdx) % 19 === 0;
      if (isAbsent) return;

      const isLate = (d * 3 + empIdx) % 11 === 0;
      const timeStr = isLate ? '09:22:40 AM' : sampleTimes[(empIdx + d) % sampleTimes.length];
      const solved = 4 + ((empIdx + d) % 5);
      const score = solved * 160 + ((empIdx * 20) % 80);
      const wpm = 44 + ((empIdx * 3 + d * 2) % 25);
      const accuracy = 90 + ((empIdx + d) % 11);
      const rating = ratings[(empIdx + d) % ratings.length];

      records.push({
        id: `rec-hist-${d}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        date: dateStr,
        checkInTime: timeStr,
        rawTimestamp: dateObj.getTime() + 32400000, // around 9 AM
        attendanceStatus: isLate ? 'LATE' : 'ON_TIME',
        gameStats: {
          durationSeconds: 120,
          score,
          wordsSolved: solved,
          wordsAttempted: solved + 1,
          accuracyPct: accuracy,
          wpm,
          streak: solved,
          cognitiveRating: rating,
        },
        verified: true,
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
    return JSON.parse(saved);
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
    const initial = generateInitialRecords();
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch {
    const initial = generateInitialRecords();
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(initial));
    return initial;
  }
}

export function saveRecords(records: AttendanceRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
}

export function registerAttendance(employeeId: string, gameStats: GameStats): { record: AttendanceRecord; employees: Employee[] } {
  const employees = loadEmployees();
  const records = loadRecords();

  const empIndex = employees.findIndex(e => e.id === employeeId);
  if (empIndex === -1) {
    throw new Error('Employee not found');
  }

  const emp = employees[empIndex];
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const checkInTime = `${displayHours}:${minutes}:${seconds} ${ampm}`;

  // Consider arrival after 9:15 AM as late for office shift
  const isLate = hours > 9 || (hours === 9 && now.getMinutes() > 15);
  const attendanceStatus: AttendanceStatus = isLate ? 'LATE' : 'ON_TIME';

  const newRecord: AttendanceRecord = {
    id: `rec-${Date.now()}-${employeeId}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    date: dateStr,
    checkInTime,
    rawTimestamp: now.getTime(),
    attendanceStatus,
    gameStats,
    verified: true,
  };

  // Update employee stats
  const newTotal = emp.totalCheckIns + 1;
  const newAvgScore = Math.round((emp.averageScore * emp.totalCheckIns + gameStats.score) / newTotal);
  const newAvgWpm = Math.round((emp.averageWpm * emp.totalCheckIns + gameStats.wpm) / newTotal);

  employees[empIndex] = {
    ...emp,
    attendanceStreak: emp.attendanceStreak + 1,
    totalCheckIns: newTotal,
    averageScore: newAvgScore,
    averageWpm: newAvgWpm,
    isRegisteredToday: true,
  };

  // Prepend record so newest comes first
  const updatedRecords = [newRecord, ...records];

  saveEmployees(employees);
  saveRecords(updatedRecords);

  return { record: newRecord, employees };
}

export function updateRecordNote(recordId: string, note: string): AttendanceRecord[] {
  const records = loadRecords();
  const idx = records.findIndex(r => r.id === recordId);
  if (idx !== -1) {
    records[idx].managerNotes = note;
    saveRecords(records);
  }
  return records;
}

export function addNewEmployee(name: string, email: string, role: string, department: Department): Employee[] {
  const employees = loadEmployees();
  const newEmp: Employee = {
    id: `emp-${Date.now().toString().slice(-4)}`,
    name,
    email,
    role,
    department,
    hireDate: new Date().toISOString().split('T')[0],
    attendanceStreak: 0,
    totalCheckIns: 0,
    averageScore: 0,
    averageWpm: 0,
    isRegisteredToday: false,
  };
  const updated = [...employees, newEmp];
  saveEmployees(updated);
  return updated;
}

export function resetDemoData(): { employees: Employee[]; records: AttendanceRecord[] } {
  localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
  localStorage.removeItem(STORAGE_KEY_RECORDS);
  const employees = INITIAL_EMPLOYEES;
  const records = generateInitialRecords();
  saveEmployees(employees);
  saveRecords(records);
  return { employees, records };
}

export function exportAttendanceToCsv(records: AttendanceRecord[]): void {
  const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Department', 'Date', 'Check-In Time', 'Status', 'Game Score', 'Words Solved', 'Accuracy %', 'WPM', 'Cognitive Rating', 'Manager Notes'];
  const rows = records.map(r => [
    r.id,
    r.employeeId,
    `"${r.employeeName}"`,
    `"${r.department}"`,
    r.date,
    `"${r.checkInTime}"`,
    r.attendanceStatus,
    r.gameStats.score,
    r.gameStats.wordsSolved,
    `${r.gameStats.accuracyPct}%`,
    r.gameStats.wpm,
    `"${r.gameStats.cognitiveRating}"`,
    `"${(r.managerNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `VerbaShift_Accounting_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
