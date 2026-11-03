import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Zap, 
  FileText, 
  Printer, 
  Award, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X,
  RefreshCw
} from 'lucide-react';
import { Employee, AttendanceRecord, Department, AttendanceStatus } from '../types';
import { exportAttendanceToCsv, updateRecordNote } from '../services/attendanceStorage';

interface ManagerDashboardProps {
  employees: Employee[];
  records: AttendanceRecord[];
  onRefreshData: () => void;
  onResetDemoData: () => void;
}

type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  employees,
  records,
  onRefreshData,
  onResetDemoData,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Note editing state
  const [editingNoteRecordId, setEditingNoteRecordId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Performance Report Modal
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedDossierEmployee, setSelectedDossierEmployee] = useState<Employee | null>(null);

  // Filter records by period
  const filteredRecords = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];

    return records.filter(record => {
      // Period filter
      if (period === 'today' && record.date !== todayStr) return false;
      if (period === 'week' && record.date < weekAgoStr) return false;
      if (period === 'month' && record.date < monthAgoStr) return false;

      // Department filter
      if (selectedDept !== 'ALL' && record.department !== selectedDept) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && record.attendanceStatus !== selectedStatus) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = record.employeeName.toLowerCase().includes(query);
        const matchesDept = record.department.toLowerCase().includes(query);
        if (!matchesName && !matchesDept) return false;
      }

      return true;
    });
  }, [records, period, selectedDept, selectedStatus, searchQuery]);

  // Aggregate Metrics
  const totalCount = filteredRecords.length;
  const onTimeCount = filteredRecords.filter(r => r.attendanceStatus === 'ON_TIME').length;
  const onTimeRate = totalCount > 0 ? Math.round((onTimeCount / totalCount) * 100) : 100;
  
  const avgScore = totalCount > 0 
    ? Math.round(filteredRecords.reduce((acc, r) => acc + r.gameStats.score, 0) / totalCount)
    : 0;

  const avgWpm = totalCount > 0
    ? Math.round(filteredRecords.reduce((acc, r) => acc + r.gameStats.wpm, 0) / totalCount)
    : 0;

  const totalWordsSolved = filteredRecords.reduce((acc, r) => acc + r.gameStats.wordsSolved, 0);

  // Department Breakdown
  const deptStats = useMemo(() => {
    const map: Record<string, { count: number; totalScore: number; onTime: number; totalWpm: number }> = {};
    
    filteredRecords.forEach(r => {
      if (!map[r.department]) {
        map[r.department] = { count: 0, totalScore: 0, onTime: 0, totalWpm: 0 };
      }
      map[r.department].count += 1;
      map[r.department].totalScore += r.gameStats.score;
      map[r.department].totalWpm += r.gameStats.wpm;
      if (r.attendanceStatus === 'ON_TIME') map[r.department].onTime += 1;
    });

    return Object.entries(map).map(([dept, data]) => ({
      department: dept,
      count: data.count,
      avgScore: Math.round(data.totalScore / data.count),
      avgWpm: Math.round(data.totalWpm / data.count),
      punctualityPct: Math.round((data.onTime / data.count) * 100),
    })).sort((a, b) => b.avgScore - a.avgScore);
  }, [filteredRecords]);

  // Top Performers in Word Guessing & Turnout
  const topPerformers = useMemo(() => {
    const employeeScores: Record<string, { name: string; dept: string; totalScore: number; games: number; maxStreak: number; avgWpm: number }> = {};

    filteredRecords.forEach(r => {
      if (!employeeScores[r.employeeId]) {
        employeeScores[r.employeeId] = {
          name: r.employeeName,
          dept: r.department,
          totalScore: 0,
          games: 0,
          maxStreak: 0,
          avgWpm: 0,
        };
      }
      employeeScores[r.employeeId].totalScore += r.gameStats.score;
      employeeScores[r.employeeId].games += 1;
      employeeScores[r.employeeId].avgWpm += r.gameStats.wpm;
      if (r.gameStats.streak > employeeScores[r.employeeId].maxStreak) {
        employeeScores[r.employeeId].maxStreak = r.gameStats.streak;
      }
    });

    return Object.values(employeeScores)
      .map(e => ({
        ...e,
        avgScore: Math.round(e.totalScore / e.games),
        avgWpm: Math.round(e.avgWpm / e.games),
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);
  }, [filteredRecords]);

  // Handle Note Save
  const handleSaveNote = (recordId: string) => {
    updateRecordNote(recordId, noteText);
    setEditingNoteRecordId(null);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      {/* Header Management Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <img
              src="/src/assets/images/avatar_manager_lead_1793666752965.jpg"
              alt="Operations Director"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Manager Attendance & Performance Dashboard
              </h1>
              <span className="text-xs text-slate-500 font-medium">· Periodic Review Terminal</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing verified attendance check-ins, punctuality, and cognitive agility scores from 2-minute word sessions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Performance Report</span>
          </button>

          <button
            onClick={() => exportAttendanceToCsv(filteredRecords)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onResetDemoData}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset to Fresh Seed Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Period Filter Tabs & Secondary Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              period === 'today'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today's Shift
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              period === 'week'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 7 Days (Weekly)
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              period === 'month'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 30 Days (Monthly)
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              period === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Historical Records
          </button>
        </div>

        {/* Search & Department Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search employee or role..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none w-56"
            />
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-600 focus:outline-none"
          >
            <option value="ALL">All Accounting Departments</option>
            <option value="General Accounting">General Accounting</option>
            <option value="Audit & Assurance">Audit & Assurance</option>
            <option value="Tax & Compliance">Tax & Compliance</option>
            <option value="Financial Planning & Analysis">Financial Planning & Analysis</option>
            <option value="Accounts Payable & Receivable">Accounts Payable & Receivable</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-600 focus:outline-none"
          >
            <option value="ALL">All Punctuality</option>
            <option value="ON_TIME">Punctual Only</option>
            <option value="LATE">Late Only</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500">Attendance Logged</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {period === 'today' ? 'current shift' : `${period} period`}
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500">Punctuality Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums mt-1">
            {onTimeRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {onTimeCount} on-time arrivals logged
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500">Avg Word Game Score</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
            {avgScore} pts
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            {totalWordsSolved} total words guessed
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500">Cognitive Agility Index</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
            {avgWpm} WPM
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active team typing speed
          </div>
        </div>
      </div>

      {/* Department Breakdown & Top Word Puzzle Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Comparison Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Performance & Attendance</h3>
              <p className="text-xs text-slate-500">Punctuality and word game agility breakdown</p>
            </div>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {deptStats.length} active departments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Check-Ins</th>
                  <th className="py-2.5 px-3 text-right">Punctuality</th>
                  <th className="py-2.5 px-3 text-right">Avg Game Score</th>
                  <th className="py-2.5 px-3 text-right">Typing WPM</th>
                  <th className="py-2.5 px-3">Performance Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptStats.map(ds => (
                  <tr key={ds.department} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{ds.department}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">{ds.count}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-emerald-600">
                      {ds.punctualityPct}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                      {ds.avgScore}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      {ds.avgWpm} WPM
                    </td>
                    <td className="py-3 px-3 w-32">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${Math.min((ds.avgScore / 1200) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Word Puzzle Scorers Leaderboard */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Agility Scorers</h3>
              <p className="text-xs text-slate-500">Highest average puzzle scores</p>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topPerformers.map((tp, idx) => (
              <div
                key={tp.name}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex items-center justify-center font-bold text-xs rounded-full ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tp.name}</div>
                    <div className="text-[11px] text-slate-500">{tp.dept}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">{tp.avgScore} pts</div>
                  <div className="text-[10px] text-slate-500 font-mono">{tp.avgWpm} WPM · {tp.games} plays</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive Attendance & Game Performance Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Comprehensive Attendance Log</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredRecords.length} records matching current criteria
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Tip: Click manager notes icon to record periodic feedback
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No attendance records match the selected filters. Try adjusting your date or department filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Clock-In Time</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Game Score</th>
                  <th className="py-3 px-3 text-right">Words Solved</th>
                  <th className="py-3 px-3 text-right">Agility (WPM)</th>
                  <th className="py-3 px-3">Cognitive Rating</th>
                  <th className="py-3 px-3">Manager Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(rec => {
                  const isEditingNote = editingNoteRecordId === rec.id;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            const emp = employees.find(e => e.id === rec.employeeId);
                            if (emp) setSelectedDossierEmployee(emp);
                          }}
                          className="font-semibold text-slate-900 hover:text-indigo-600 text-left transition-colors"
                        >
                          {rec.employeeName}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{rec.department}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{rec.date}</td>
                      <td className="py-3 px-3 font-mono text-slate-900">{rec.checkInTime}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          rec.attendanceStatus === 'ON_TIME'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rec.attendanceStatus === 'ON_TIME' ? 'Punctual' : 'Late Arrival'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {rec.gameStats.score}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        {rec.gameStats.wordsSolved} / {rec.gameStats.wordsAttempted}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        {rec.gameStats.wpm}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {rec.gameStats.cognitiveRating}
                      </td>
                      <td className="py-3 px-3">
                        {isEditingNote ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={noteText}
                              onChange={e => setNoteText(e.target.value)}
                              placeholder="Add manager review note..."
                              className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-indigo-600 w-44"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveNote(rec.id)}
                              className="p-1 text-emerald-600 hover:text-emerald-800"
                              title="Save Note"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingNoteRecordId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-600 italic text-[11px] truncate max-w-xs">
                              {rec.managerNotes || '—'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingNoteRecordId(rec.id);
                                setNoteText(rec.managerNotes || '');
                              }}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Edit note"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Report Generator Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Report Header */}
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  VerbaShift Executive Brief
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  Periodic Attendance & Performance Report
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Scope: {period.toUpperCase()} · Generated on {new Date().toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Report Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 print:text-black">
              {/* Executive Summary Narrative */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Executive Summary</div>
                <p className="leading-relaxed">
                  During this reporting period, the company recorded an overall attendance punctuality rate of <strong>{onTimeRate}%</strong> across <strong>{totalCount}</strong> verified check-in sessions. Employees demonstrated strong mental agility during the mandatory 2-minute word guessing protocol, averaging <strong>{avgScore} points</strong> and <strong>{avgWpm} WPM</strong> typing cadence.
                </p>
              </div>

              {/* KPI Matrix */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 font-medium">Verified Turnout</div>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-1">{totalCount} shifts</div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">{onTimeRate}% on-time</div>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 font-medium">Cognitive Focus</div>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-1">{avgScore} pts avg</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{totalWordsSolved} total words solved</div>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 font-medium">Team Speed</div>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-1">{avgWpm} WPM</div>
                  <div className="text-[11px] text-indigo-600 mt-0.5">High alertness baseline</div>
                </div>
              </div>

              {/* Department Rankings */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Departmental Breakdown</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Department</th>
                        <th className="py-2 px-3 text-right">Shifts</th>
                        <th className="py-2 px-3 text-right">Punctuality</th>
                        <th className="py-2 px-3 text-right">Avg Score</th>
                        <th className="py-2 px-3 text-right">Speed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deptStats.map(ds => (
                        <tr key={ds.department}>
                          <td className="py-2 px-3 font-medium text-slate-900">{ds.department}</td>
                          <td className="py-2 px-3 text-right font-mono">{ds.count}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-600 font-semibold">{ds.punctualityPct}%</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{ds.avgScore}</td>
                          <td className="py-2 px-3 text-right font-mono">{ds.avgWpm} WPM</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Management Recommendations */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                <div className="font-bold text-indigo-950 text-xs uppercase tracking-wider">Manager Recommendations & Sign-Off</div>
                <p className="text-indigo-900 text-xs leading-relaxed">
                  1. The 2-minute word guessing protocol continues to serve as an effective cognitive warmup before daily standups.<br />
                  2. Operations & Customer Success demonstrated 100% on-time attendance compliance this week.<br />
                  3. Encourage employees with sub-45 WPM to utilize the optional Practice Mode during afternoon cooldowns.
                </p>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-indigo-200/60 flex items-center justify-between">
                  <span>Reviewed by Operations Director</span>
                  <span className="font-mono">Status: Formally Approved</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => exportAttendanceToCsv(filteredRecords)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Report CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Executive Brief</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Employee Dossier Modal */}
      {selectedDossierEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {selectedDossierEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedDossierEmployee.name}</h3>
                  <div className="text-xs text-slate-500">
                    {selectedDossierEmployee.role} · {selectedDossierEmployee.department}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDossierEmployee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Attendance Streak</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {selectedDossierEmployee.attendanceStreak} Days
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Average Game Score</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {selectedDossierEmployee.averageScore} pts
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Average WPM</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {selectedDossierEmployee.averageWpm || 54} WPM
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Attendance Sessions
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg text-xs">
                {records
                  .filter(r => r.employeeId === selectedDossierEmployee.id)
                  .slice(0, 7)
                  .map(rec => (
                    <div key={rec.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <span className="font-mono font-medium text-slate-800">{rec.date}</span>
                        <span className="text-slate-400 mx-2">·</span>
                        <span className="text-slate-600 font-mono">{rec.checkInTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          rec.attendanceStatus === 'ON_TIME'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {rec.attendanceStatus}
                        </span>
                        <span className="font-mono font-bold text-slate-900">{rec.gameStats.score} pts</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDossierEmployee(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
