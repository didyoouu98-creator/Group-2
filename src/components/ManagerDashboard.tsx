import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  FileText,
  Printer,
  Edit3,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Eye,
  Info,
  Gift,
  Users,
  MessageSquare,
  ShieldCheck,
  Trophy,
  History,
} from 'lucide-react';
import {
  Employee,
  AttendanceRecord,
  Department,
  QuizSessionRecord,
  TopicTrainingInsight,
  EmployeeTrainingInsight,
  MissedQuizFeedback,
  BenefitRedemption,
} from '../types';
import {
  exportAttendanceToCsv,
  updateRecordNote,
  computeTopicTrainingInsights,
  computeEmployeeTrainingInsights,
  computeDepartmentTrainingInsights,
  getLeaderboardWinnerId,
  getManagerFollowUpStatus,
  ON_TIME_RULE_DESCRIPTION,
  formatLocalDate,
  getIsoWeekKey,
  getShiftStatusInfo,
} from '../services/attendanceStorage';
import { QuizReviewModal } from './QuizReviewModal';

interface ManagerDashboardProps {
  employees: Employee[];
  records: AttendanceRecord[];
  quizSessions: QuizSessionRecord[];
  missedFeedbacks: MissedQuizFeedback[];
  redemptions: BenefitRedemption[];
  onToggleEligibility: (employeeId: string) => void;
  onLogFollowUp: (employeeId: string, note: string) => void;
  onConfirmCheckInCompleted: (employeeId: string) => void;
  onUpdateRedemptionStatus: (
    redemptionId: string,
    status: 'Approved' | 'Pending Manager Fulfillment'
  ) => void;
  onRefreshData: () => void;
  onResetDemoData: () => void;
}

type PeriodFilter = 'today' | 'week' | 'month' | 'all';
type ActivityFilter = 'ALL' | 'TOOK_QUIZ' | 'SKIPPED';
type ClockOutFilter = 'ALL' | 'MANUAL_CORRECTED' | 'MISSING' | 'DIRECT';

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  employees,
  records,
  quizSessions,
  missedFeedbacks,
  redemptions,
  onToggleEligibility,
  onLogFollowUp,
  onConfirmCheckInCompleted,
  onUpdateRedemptionStatus,
  onRefreshData,
  onResetDemoData,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedActivity, setSelectedActivity] = useState<ActivityFilter>('ALL');
  const [selectedClockOutFilter, setSelectedClockOutFilter] = useState<ClockOutFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Note editing state
  const [editingNoteRecordId, setEditingNoteRecordId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Follow-up note editing state for 5+ missed quizzes
  const [followUpEmpId, setFollowUpEmpId] = useState<string | null>(null);
  const [followUpInput, setFollowUpInput] = useState<string>('');

  // Modals
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState<boolean>(false);
  const [inspectingSession, setInspectingSession] = useState<QuizSessionRecord | null>(null);
  const [reviewingCorrectionRecord, setReviewingCorrectionRecord] =
    useState<AttendanceRecord | null>(null);

  // Filter records by period, department, quiz status, and search
  const filteredRecords = useMemo(() => {
    const now = new Date();
    const todayStr = formatLocalDate(now);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = formatLocalDate(weekAgo);

    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = formatLocalDate(monthAgo);

    return records.filter(record => {
      if (period === 'today' && record.date !== todayStr) return false;
      if (period === 'week' && record.date < weekAgoStr) return false;
      if (period === 'month' && record.date < monthAgoStr) return false;
      if (selectedDept !== 'ALL' && record.department !== selectedDept) return false;

      const hasSession = record.quizSessionId
        ? quizSessions.some(s => s.id === record.quizSessionId)
        : quizSessions.some(
            s => s.employeeId === record.employeeId && s.date === record.date
          );

      if (selectedActivity === 'TOOK_QUIZ' && !hasSession) return false;
      if (selectedActivity === 'SKIPPED' && hasSession) return false;

      if (selectedClockOutFilter !== 'ALL') {
        const shiftInfo = getShiftStatusInfo(record);
        if (
          selectedClockOutFilter === 'MANUAL_CORRECTED' &&
          record.clockOutSource !== 'manual_correction'
        ) {
          return false;
        }
        if (
          selectedClockOutFilter === 'MISSING' &&
          shiftInfo.state !== 'missing_clock_out'
        ) {
          return false;
        }
        if (
          selectedClockOutFilter === 'DIRECT' &&
          (!record.checkOutTime || record.clockOutSource === 'manual_correction')
        ) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = record.employeeName.toLowerCase().includes(query);
        const matchesId = record.employeeId.toLowerCase().includes(query);
        const matchesDept = record.department.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesDept) return false;
      }

      return true;
    });
  }, [records, quizSessions, period, selectedDept, selectedActivity, selectedClockOutFilter, searchQuery]);

  // Date-filtered company-wide completed quiz sessions (used consistently by Company-Wide Quiz Performance cards & graph)
  const periodFilteredCompanyQuizSessions = useMemo(() => {
    const now = new Date();
    const todayStr = formatLocalDate(now);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = formatLocalDate(weekAgo);

    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = formatLocalDate(monthAgo);

    return quizSessions.filter(session => {
      if (period === 'today' && session.date !== todayStr) return false;
      if (period === 'week' && session.date < weekAgoStr) return false;
      if (period === 'month' && session.date < monthAgoStr) return false;
      return true;
    });
  }, [quizSessions, period]);

  // Filter corresponding quiz sessions for current period, department, and search query
  const filteredQuizSessions = useMemo(() => {
    return periodFilteredCompanyQuizSessions.filter(session => {
      if (selectedDept !== 'ALL' && session.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = session.employeeName.toLowerCase().includes(query);
        const matchesId = session.employeeId.toLowerCase().includes(query);
        const matchesDept = session.department.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesDept) return false;
      }
      return true;
    });
  }, [periodFilteredCompanyQuizSessions, selectedDept, searchQuery]);

  // Aggregate Attendance Metrics (calculated strictly from filteredRecords)
  const attendanceSummary = useMemo(() => {
    const totalShifts = filteredRecords.length;
    const onTimeShifts = filteredRecords.filter(r => r.attendanceStatus === 'ON_TIME').length;
    const lateShifts = filteredRecords.filter(r => r.attendanceStatus === 'LATE').length;
    const notEvaluatedShifts = filteredRecords.filter(
      r => r.attendanceStatus === 'NOT_EVALUATED'
    ).length;
    const evaluatedShifts = onTimeShifts + lateShifts;
    const punctualityRate =
      evaluatedShifts > 0 ? Math.round((onTimeShifts / evaluatedShifts) * 100) : null;

    let completedShifts = 0;
    let inProgressShifts = 0;
    let missingClockOutShifts = 0;
    let manuallyCorrectedShifts = 0;

    filteredRecords.forEach(rec => {
      const info = getShiftStatusInfo(rec);
      if (info.state === 'completed') completedShifts += 1;
      else if (info.state === 'in_progress') inProgressShifts += 1;
      else missingClockOutShifts += 1;
      if (rec.clockOutSource === 'manual_correction') manuallyCorrectedShifts += 1;
    });

    const incompleteShifts = inProgressShifts + missingClockOutShifts;

    return {
      totalShifts,
      onTimeShifts,
      lateShifts,
      notEvaluatedShifts,
      evaluatedShifts,
      punctualityRate,
      punctualityLabel: punctualityRate !== null ? `${punctualityRate}%` : 'N/A',
      completedShifts,
      inProgressShifts,
      missingClockOutShifts,
      manuallyCorrectedShifts,
      incompleteShifts,
    };
  }, [filteredRecords]);

  // Separate Participation Metrics for Eligible Employees in Current Scope
  const currentWeekKey = getIsoWeekKey();
  const employeesInScope = useMemo(() => {
    return employees.filter(e => {
      if (selectedDept !== 'ALL' && e.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !e.name.toLowerCase().includes(q) &&
          !e.id.toLowerCase().includes(q) &&
          !e.department.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [employees, selectedDept, searchQuery]);

  const eligibleEmployeesInScope = useMemo(
    () => employeesInScope.filter(e => e.isQuizEligible !== false),
    [employeesInScope]
  );

  const everParticipatingCount = useMemo(() => {
    const allSessionEmpIds = new Set(quizSessions.map(s => s.employeeId));
    return eligibleEmployeesInScope.filter(e => allSessionEmpIds.has(e.id)).length;
  }, [eligibleEmployeesInScope, quizSessions]);

  const weeklyCompletedCount = useMemo(() => {
    return eligibleEmployeesInScope.filter(
      e =>
        e.lastCompletedWeeklyQuizWeek === currentWeekKey ||
        quizSessions.some(
          s =>
            s.employeeId === e.id &&
            getIsoWeekKey(s.date) === currentWeekKey &&
            s.quizKind !== 'optional'
        )
    ).length;
  }, [eligibleEmployeesInScope, quizSessions, currentWeekKey]);

  const periodParticipantsCount = useMemo(() => {
    const eligibleIdsSet = new Set(eligibleEmployeesInScope.map(e => e.id));
    return new Set(filteredQuizSessions.map(s => s.employeeId).filter(id => eligibleIdsSet.has(id))).size;
  }, [eligibleEmployeesInScope, filteredQuizSessions]);

  const everParticipationRateLabel =
    eligibleEmployeesInScope.length === 0
      ? 'N/A'
      : `${Math.round((everParticipatingCount / eligibleEmployeesInScope.length) * 100)}%`;

  const weeklyCompletionRateLabel =
    eligibleEmployeesInScope.length === 0
      ? 'N/A'
      : `${Math.round((weeklyCompletedCount / eligibleEmployeesInScope.length) * 100)}%`;

  const avgQuizScoreLabel =
    filteredQuizSessions.length > 0
      ? `${Math.round(
          filteredQuizSessions.reduce((acc, s) => acc + s.score, 0) / filteredQuizSessions.length
        )}%`
      : 'N/A';

  // Training Insights & Topic Accuracy (strictly uses filteredQuizSessions so filters match displayed data)
  const topicInsights: TopicTrainingInsight[] = useMemo(() => {
    return computeTopicTrainingInsights(filteredQuizSessions);
  }, [filteredQuizSessions]);

  const topicsNeedingTraining = topicInsights.filter(t => t.status === 'Needs Training');

  const employeeTrainingInsights: EmployeeTrainingInsight[] = useMemo(() => {
    const allInsights = computeEmployeeTrainingInsights(employees, quizSessions);
    return allInsights.filter(item => {
      if (selectedDept !== 'ALL' && item.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !item.employeeName.toLowerCase().includes(q) &&
          !item.employeeId.toLowerCase().includes(q) &&
          !item.department.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [employees, quizSessions, selectedDept, searchQuery]);

  // Missed Quiz Escalation Alerts (3+ missed quizzes & 5+ manager follow-up flags)
  const employeesNeedingSupport = useMemo(() => {
    return employees
      .filter(e => (e.consecutiveMissedQuizzes || 0) >= 3)
      .sort((a, b) => (b.consecutiveMissedQuizzes || 0) - (a.consecutiveMissedQuizzes || 0));
  }, [employees]);

  const fivePlusMissedCount = employeesNeedingSupport.filter(
    e => (e.consecutiveMissedQuizzes || 0) >= 5
  ).length;

  // Department Breakdown separating Ever Participated vs Current Week Required Quiz Completion
  const departmentBreakdown = useMemo(() => {
    const deptTrainingList = computeDepartmentTrainingInsights(quizSessions);
    const deptTopicsAll = computeTopicTrainingInsights(quizSessions);

    return deptTrainingList.map(deptTraining => {
      const dept = deptTraining.department;
      const deptEmployees = employees.filter(e => e.department === dept);
      const eligibleDeptEmployees = deptEmployees.filter(e => e.isQuizEligible !== false);
      const eligibleIdSet = new Set(eligibleDeptEmployees.map(e => e.id));

      const deptSessions = quizSessions.filter(s => s.department === dept);
      const everParticipants = new Set(
        deptSessions.map(s => s.employeeId).filter(id => eligibleIdSet.has(id))
      ).size;

      const weeklyParticipants = eligibleDeptEmployees.filter(
        e =>
          e.lastCompletedWeeklyQuizWeek === currentWeekKey ||
          deptSessions.some(
            s =>
              s.employeeId === e.id &&
              getIsoWeekKey(s.date) === currentWeekKey &&
              s.quizKind !== 'optional'
          )
      ).length;

      const everParticipationRateDisplay =
        eligibleDeptEmployees.length === 0
          ? 'N/A'
          : `${Math.round((everParticipants / eligibleDeptEmployees.length) * 100)}%`;

      const weeklyCompletionRateDisplay =
        eligibleDeptEmployees.length === 0
          ? 'N/A'
          : `${Math.round((weeklyParticipants / eligibleDeptEmployees.length) * 100)}%`;

      const avgScoreDisplay =
        deptTraining.averageScore !== null ? `${deptTraining.averageScore}%` : 'N/A';

      const deptTopics = deptTopicsAll.filter(t => t.department === dept);
      const lowestTopic = deptTopics.length > 0 ? deptTopics[0] : null;
      const highestTopic = deptTopics.length > 0 ? deptTopics[deptTopics.length - 1] : null;

      return {
        department: dept,
        employeeCount: deptEmployees.length,
        eligibleCount: eligibleDeptEmployees.length,
        quizSessions: deptSessions.length,
        everParticipantsCount: everParticipants,
        weeklyParticipantsCount: weeklyParticipants,
        everParticipationRateDisplay,
        weeklyCompletionRateDisplay,
        avgScoreDisplay,
        status: deptTraining.status,
        recommendation: deptTraining.recommendation,
        basisLabel: deptTraining.basisLabel,
        cautionNote: deptTraining.cautionNote,
        lowestTopic: lowestTopic ? `${lowestTopic.topic} (${lowestTopic.accuracyPct}%)` : 'N/A',
        highestTopic: highestTopic ? `${highestTopic.topic} (${highestTopic.accuracyPct}%)` : 'N/A',
      };
    });
  }, [employees, quizSessions, currentWeekKey]);

  // Company-Wide Quiz Performance Progression over Time (uses the same date filter + actual completed quiz results)
  const performanceTrend = useMemo(() => {
    const datesMap: Record<
      string,
      {
        date: string;
        totalCorrect: number;
        totalQuestions: number;
        totalScore: number;
        count: number;
        sessionSummaries: string[];
      }
    > = {};

    periodFilteredCompanyQuizSessions.forEach(s => {
      if (!datesMap[s.date]) {
        datesMap[s.date] = {
          date: s.date,
          totalCorrect: 0,
          totalQuestions: 0,
          totalScore: 0,
          count: 0,
          sessionSummaries: [],
        };
      }
      datesMap[s.date].totalCorrect += s.correctCount || 0;
      datesMap[s.date].totalQuestions += s.totalCount || 0;
      datesMap[s.date].totalScore += s.score;
      datesMap[s.date].count += 1;
      datesMap[s.date].sessionSummaries.push(`${s.employeeId} (${s.score}%)`);
    });

    return Object.values(datesMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map(d => ({
        date: d.date,
        avgScore:
          d.totalQuestions > 0
            ? Math.round((d.totalCorrect / d.totalQuestions) * 100)
            : Math.round(d.totalScore / d.count),
        sessionCount: d.count,
        sessionSummary: d.sessionSummaries.join(', '),
      }));
  }, [periodFilteredCompanyQuizSessions]);

  const firstPlaceWinnerId = getLeaderboardWinnerId(employees);
  const firstPlaceWinner = employees.find(e => e.id === firstPlaceWinnerId);

  const handleSaveNote = (recordId: string) => {
    updateRecordNote(recordId, noteText);
    setEditingNoteRecordId(null);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      {/* Review Modal if manager inspects a specific quiz attempt */}
      {inspectingSession && (
        <QuizReviewModal
          session={inspectingSession}
          onClose={() => setInspectingSession(null)}
        />
      )}

      {/* Eligibility Configuration Modal (lets manager test "N/A" when 0 eligible employees) */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Manage Department Quiz Eligibility
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  When a department has zero eligible employees, participation rate displays &quot;N/A&quot; instead of an invalid percentage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEligibilityModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
              {employees.map(emp => {
                const eligible = emp.isQuizEligible !== false;
                return (
                  <div
                    key={emp.id}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {emp.name}{' '}
                        <span className="font-mono text-slate-500 font-normal">
                          · {emp.id} · {emp.department}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{emp.role}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleEligibility(emp.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                        eligible
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {eligible ? 'Eligible (Active)' : 'Exempt / Ineligible'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEligibilityModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            L&amp;D
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Enterprise Learning &amp; Development Management Dashboard
              </h1>
              <span className="text-xs text-slate-500 font-medium">· Decision Support Portal</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing attendance records, missed-quiz support alerts, non-taxable benefit claims, and departmental training needs.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowEligibilityModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Quiz Eligibility</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate L&amp;D Report</span>
          </button>

          <button
            type="button"
            onClick={() => exportAttendanceToCsv(filteredRecords, quizSessions)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onResetDemoData}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset to Fresh Demonstration Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formative L&D Diagnostic Notice */}
      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-blue-950">
            Formative Learning Diagnostic Notice &amp; Supportive Learning Protocol
          </div>
          <p className="leading-relaxed text-blue-800">
            In the current scheduled week (<strong>{currentWeekKey}</strong>),{' '}
            <strong>
              {weeklyCompletedCount} of {eligibleEmployeesInScope.length} eligible employees (
              {weeklyCompletionRateLabel})
            </strong>{' '}
            have completed their 1 required weekly quiz;{' '}
            <strong>
              {everParticipatingCount} of {eligibleEmployeesInScope.length} eligible employees (
              {everParticipationRateLabel})
            </strong>{' '}
            have completed at least one quiz historically. Additional quizzes are optional and never penalized if skipped.
          </p>
        </div>
      </div>

      {/* Section: Employee Support & Missed-Weekly-Quiz Follow-Up Queue (3+ Learning Support & 5+ Manager Check-In) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Employee Learning Support &amp; Manager Check-In Queue
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Employees missing 3 consecutive required weekly quizzes are offered an optional support survey and flagged for learning support; 5+ consecutive misses trigger a supportive manager check-in with zero automatic penalty or reward restriction.
            </p>
          </div>
          <div className="text-xs font-semibold text-red-700">
            {fivePlusMissedCount} Staff with 5+ Consecutive Missed Weekly Quizzes
          </div>
        </div>

        {employeesNeedingSupport.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            All employees are currently under the 3 consecutive missed weekly quiz threshold.
          </div>
        ) : (
          <div className="space-y-3">
            {employeesNeedingSupport.map(emp => {
              const isFivePlus = (emp.consecutiveMissedQuizzes || 0) >= 5;
              const followUpStatus = getManagerFollowUpStatus(emp);
              const latestFeedback = missedFeedbacks.find(f => f.employeeId === emp.id);
              const isEditingFollowUp = followUpEmpId === emp.id;

              const statusLabel =
                followUpStatus === 'completed'
                  ? 'Check-In Completed'
                  : followUpStatus === 'plan_recorded'
                  ? 'Support Plan Recorded'
                  : isFivePlus
                  ? 'Manager Check-In Recommended'
                  : 'Learning Support Notification';

              const cardStyle =
                followUpStatus === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : followUpStatus === 'plan_recorded'
                  ? 'border-indigo-200 bg-indigo-50/30'
                  : isFivePlus
                  ? 'border-amber-300 bg-amber-50/50'
                  : 'border-blue-200 bg-blue-50/30';

              const badgeStyle =
                followUpStatus === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : followUpStatus === 'plan_recorded'
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                  : isFivePlus
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-blue-100 text-blue-800 border-blue-200';

              return (
                <div
                  key={emp.id}
                  className={`p-4 rounded-xl border space-y-3 text-xs ${cardStyle}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{emp.name}</span>
                        <span className="font-mono text-slate-500">· {emp.id}</span>
                        <span className="text-slate-600">· {emp.department}</span>
                        <span
                          className={`font-bold ${
                            isFivePlus ? 'text-amber-800' : 'text-blue-700'
                          }`}
                        >
                          · {emp.consecutiveMissedQuizzes} Consecutive Weekly Quizzes Missed
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${badgeStyle}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-slate-700">
                        {followUpStatus === 'completed' ? (
                          <>
                            Manager confirmed the supportive check-in discussion with{' '}
                            {emp.name.split(' ')[0]} has taken place
                            {emp.managerCheckInCompletedDate
                              ? ` (${emp.managerCheckInCompletedDate})`
                              : ''}
                            . <em>No automatic penalty applied.</em>
                          </>
                        ) : followUpStatus === 'plan_recorded' ? (
                          <>
                            A learning support plan has been saved for {emp.name.split(' ')[0]}
                            {emp.managerFollowUpDate ? ` (${emp.managerFollowUpDate})` : ''}. Once
                            the 1-on-1 discussion takes place, confirm check-in completion.{' '}
                            <em>No automatic penalty or reward restriction applied.</em>
                          </>
                        ) : isFivePlus ? (
                          <>
                            Arrange a supportive 1-on-1 check-in to understand any challenges and
                            discuss possible learning support for {emp.name.split(' ')[0]}.{' '}
                            <em>
                              No automatic penalty or reward restriction applied; weekly quiz remains
                              accessible.
                            </em>
                          </>
                        ) : (
                          <>
                            Learning support may be needed for {emp.name.split(' ')[0]}. Optional
                            support survey has been provided with zero penalty or reward
                            restrictions.
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {followUpStatus === 'plan_recorded' && (
                        <button
                          type="button"
                          onClick={() => onConfirmCheckInCompleted(emp.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Check-In Completed</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setFollowUpEmpId(emp.id);
                          setFollowUpInput(emp.managerFollowUpNote || '');
                        }}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          followUpStatus === 'recommended'
                            ? 'text-white bg-slate-900 hover:bg-slate-800'
                            : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-300'
                        }`}
                      >
                        {emp.managerFollowUpNote || emp.managerFollowUpDate
                          ? 'Update Follow-Up Note'
                          : 'Record Follow-Up Note'}
                      </button>
                    </div>
                  </div>

                  {/* Employee's 3rd-Miss Survey Reason if submitted */}
                  {latestFeedback && (
                    <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2 text-slate-700">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">
                          Survey Feedback ({latestFeedback.date}):
                        </span>{' '}
                        {latestFeedback.reason}
                        {latestFeedback.additionalNotes && (
                          <span className="block text-slate-500 mt-0.5 italic">
                            &quot;{latestFeedback.additionalNotes}&quot;
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Saved Private Manager Support Plan Note (preserved across Plan Recorded & Check-In Completed) */}
                  {emp.managerFollowUpDate && emp.managerFollowUpNote && !isEditingFollowUp && (
                    <div
                      className={`p-3 rounded-lg border flex items-start gap-2 ${
                        followUpStatus === 'completed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-white border-indigo-200 text-slate-800'
                      }`}
                    >
                      {followUpStatus === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold">
                          Saved Support Plan ({emp.managerFollowUpDate}):
                        </span>{' '}
                        {emp.managerFollowUpNote}
                      </div>
                    </div>
                  )}

                  {isEditingFollowUp && (
                    <div className="p-3 rounded-lg bg-white border border-slate-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={followUpInput}
                        onChange={e => setFollowUpInput(e.target.value)}
                        placeholder="Record supportive learning plan (e.g. Adjusted workload deadlines for this week)..."
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:border-indigo-600 focus:outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onLogFollowUp(emp.id, followUpInput);
                            setFollowUpEmpId(null);
                            setFollowUpInput('');
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md cursor-pointer"
                        >
                          Save Support Plan
                        </button>
                        <button
                          type="button"
                          onClick={() => setFollowUpEmpId(null)}
                          className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Period Tabs & Secondary Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setPeriod('today')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              period === 'today'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today&apos;s Shift
          </button>
          <button
            type="button"
            onClick={() => setPeriod('week')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              period === 'week'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 7 Days
          </button>
          <button
            type="button"
            onClick={() => setPeriod('month')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              period === 'month'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 30 Days
          </button>
          <button
            type="button"
            onClick={() => setPeriod('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              period === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Historical
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search staff, ID, or role..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none w-52"
            />
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All 4 Departments</option>
            <option value="Accounting">Accounting</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR (Human Resources)</option>
          </select>

          <select
            value={selectedActivity}
            onChange={e => setSelectedActivity(e.target.value as ActivityFilter)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Quiz Statuses</option>
            <option value="TOOK_QUIZ">Completed Quiz</option>
            <option value="SKIPPED">Not Participated</option>
          </select>

          <select
            value={selectedClockOutFilter}
            onChange={e => setSelectedClockOutFilter(e.target.value as ClockOutFilter)}
            aria-label="Filter by Clock-Out Type"
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Clock-Out Types</option>
            <option value="MANUAL_CORRECTED">Manually Corrected</option>
            <option value="MISSING">Missing Clock-Out</option>
            <option value="DIRECT">Direct Clock-Out</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
          <div className="text-xs font-medium text-slate-500">Attendance Summary</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {attendanceSummary.totalShifts} Shifts
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {attendanceSummary.punctualityLabel} Punctual ({attendanceSummary.onTimeShifts} on-time ·{' '}
            {attendanceSummary.lateShifts} late
            {attendanceSummary.notEvaluatedShifts > 0
              ? ` · ${attendanceSummary.notEvaluatedShifts} not evaluated`
              : ''}
            )
          </div>
          <div className="text-[11px] text-slate-500">
            {attendanceSummary.completedShifts} Completed · {attendanceSummary.incompleteShifts}{' '}
            Incomplete ({attendanceSummary.inProgressShifts} in progress,{' '}
            {attendanceSummary.missingClockOutShifts} missing clock-out)
            {attendanceSummary.manuallyCorrectedShifts > 0
              ? ` · ${attendanceSummary.manuallyCorrectedShifts} manually corrected`
              : ''}
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
          <div className="text-xs font-medium text-slate-500">
            Weekly Required Quiz Completion ({currentWeekKey})
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 font-mono tabular-nums">
            {weeklyCompletionRateLabel}
          </div>
          <div className="text-[11px] text-slate-700 font-medium">
            {eligibleEmployeesInScope.length === 0
              ? 'No eligible employees in scope'
              : `${weeklyCompletedCount} of ${eligibleEmployeesInScope.length} eligible staff this week`}
          </div>
          <div className="text-[11px] text-slate-500">
            Ever Participated: <strong>{everParticipationRateLabel}</strong> (
            {everParticipatingCount}/{eligibleEmployeesInScope.length} eligible)
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
          <div className="text-xs font-medium text-slate-500">
            Average Knowledge Score (Session-Level)
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {avgQuizScoreLabel}
          </div>
          <div className="text-[11px] text-slate-500">
            Across {filteredQuizSessions.length} completed quiz{' '}
            {filteredQuizSessions.length === 1 ? 'session' : 'sessions'} ({periodParticipantsCount}{' '}
            unique staff in filter)
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
          <div className="text-xs font-medium text-slate-500">Identified Training Needs</div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {topicsNeedingTraining.length} Topics
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            Score 0–59% (Foundational Training)
          </div>
        </div>
      </div>

      {/* Attendance Punctuality Rule & Filter Scope Note */}
      <div className="px-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong className="text-slate-800">Scheduled Start-Time Rule:</strong>{' '}
          {ON_TIME_RULE_DESCRIPTION}
        </span>
        <span className="text-slate-500">
          Incomplete shifts ({attendanceSummary.inProgressShifts} In Progress,{' '}
          {attendanceSummary.missingClockOutShifts} Missing Clock-Out) are never counted as completed.
        </span>
      </div>

      {/* Section 1: Departmental L&D Performance Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Departmental L&amp;D Performance &amp; Participation Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Separates historical participation (Ever Participated) from Current Week ({currentWeekKey}) required quiz completion; optional quiz skips never lower weekly rates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowEligibilityModal(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer self-start sm:self-auto"
          >
            Configure Eligible Staff →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-right">Eligible / Total</th>
                <th className="py-2.5 px-3 text-right">Ever Participated</th>
                <th className="py-2.5 px-3 text-right">Weekly Required ({currentWeekKey})</th>
                <th className="py-2.5 px-3 text-right">Avg Score</th>
                <th className="py-2.5 px-3">Department Training Recommendation</th>
                <th className="py-2.5 px-3">Highest Mastery Area</th>
                <th className="py-2.5 px-3">Lowest Scoring Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentBreakdown.map(dept => {
                const statusColor =
                  dept.status === 'Needs Training'
                    ? 'text-red-700'
                    : dept.status === 'Refresher Recommended'
                    ? 'text-amber-700'
                    : dept.status === 'Proficient'
                    ? 'text-emerald-700'
                    : 'text-slate-600';

                return (
                  <tr key={dept.department} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{dept.department}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                      {dept.eligibleCount} / {dept.employeeCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 font-semibold">
                      {dept.everParticipationRateDisplay}{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        ({dept.everParticipantsCount}/{dept.eligibleCount})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-indigo-700">
                      {dept.weeklyCompletionRateDisplay}{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        ({dept.weeklyParticipantsCount}/{dept.eligibleCount})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                      {dept.avgScoreDisplay}
                    </td>
                    <td className="py-3 px-3">
                      <div className={`font-semibold ${statusColor}`}>
                        {dept.status} → {dept.recommendation}
                      </div>
                      <div className="text-[11px] text-slate-500">{dept.basisLabel}</div>
                    </td>
                    <td className="py-3 px-3 text-emerald-800 font-medium">{dept.highestTopic}</td>
                    <td className="py-3 px-3 text-amber-800 font-medium">{dept.lowestTopic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Non-Taxable Benefits & Recognition Fulfillment Queue */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Non-Taxable L&amp;D Benefits &amp; Recognition Claims
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Time off, company-paid professional development, and practical perks claimed by participating staff
            </p>
          </div>
          {firstPlaceWinner && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>
                #1 Leader (Half-Day Off Eligible): {firstPlaceWinner.name} ({firstPlaceWinner.rewardPoints} pts)
              </span>
            </div>
          )}
        </div>

        {redemptions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No benefit redemptions submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Non-Taxable Benefit</th>
                  <th className="py-2.5 px-3 text-right">Points</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {redemptions.map(red => (
                  <tr key={red.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                      {red.date}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {red.employeeName} ·{' '}
                      <span className="font-mono font-normal text-slate-500">
                        {red.department}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{red.category}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {red.benefitTitle}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {red.pointsSpent} pts
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-semibold ${
                          red.status === 'Approved' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {red.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {red.status !== 'Approved' ? (
                        <button
                          type="button"
                          onClick={() => onUpdateRedemptionStatus(red.id, 'Approved')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
                        >
                          Approve Perk
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Fulfilled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Training Insights & Identified Skill Gaps */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Actionable Training Needs &amp; Individual Recommendations
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Criteria: 0–59% Needs Training (Foundational Training) · 60–79% Refresher Recommended (Targeted Refresher) · 80–100% Proficient (Advanced Learning / Knowledge Maintenance) · 0 quizzes Not Yet Assessed (Complete Weekly Quiz).
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-800 shrink-0">
            {topicsNeedingTraining.length} Topics at 0–59% (Foundational Training)
          </span>
        </div>

        {/* Individual Employee Training Recommendations (Separated from Weekly Participation Tracking) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-800">
              Individual Employee Training Recommendations
            </h4>
            <span className="text-[11px] text-slate-500">
              Calculated from completed quiz scores only (optional quiz skips never penalize)
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Completed Quizzes</th>
                  <th className="py-2.5 px-3 text-right">Avg Quiz Score</th>
                  <th className="py-2.5 px-3">Training Status &amp; Recommendation</th>
                  <th className="py-2.5 px-3">Weekly Participation (Separate)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeTrainingInsights.map(empInsight => {
                  const statusTone =
                    empInsight.status === 'Needs Training'
                      ? 'text-red-700'
                      : empInsight.status === 'Refresher Recommended'
                      ? 'text-amber-700'
                      : empInsight.status === 'Proficient'
                      ? 'text-emerald-700'
                      : 'text-slate-600';

                  return (
                    <tr
                      key={empInsight.employeeId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {empInsight.employeeName}
                        <span className="text-[10px] text-slate-400 block font-mono font-normal">
                          {empInsight.employeeId}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{empInsight.department}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                        {empInsight.completedQuizCount}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {empInsight.averageScore !== null ? `${empInsight.averageScore}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className={`font-semibold ${statusTone}`}>
                          {empInsight.status} → {empInsight.recommendation}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {empInsight.basisLabel}
                          {empInsight.cautionNote ? ` · ${empInsight.cautionNote}` : ''}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 font-medium">
                        {empInsight.weeklyParticipationLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {topicInsights.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No completed quiz sessions match the active period, department, or search filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicInsights.map((insight, idx) => {
              const isLow = insight.status === 'Needs Training';
              const isMedium = insight.status === 'Refresher Recommended';
              const isProficient = insight.status === 'Proficient';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    isLow
                      ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                        <span className="font-semibold text-slate-600">{insight.department}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-bold ${
                            isLow
                              ? 'text-red-700'
                              : isMedium
                              ? 'text-amber-700'
                              : isProficient
                              ? 'text-emerald-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {insight.status} → {insight.recommendation}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{insight.topic}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">{insight.basisLabel}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold font-mono text-slate-900 tabular-nums">
                        {insight.accuracyPct}%
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {insight.incorrectAttempts} wrong of {insight.totalAttempts}
                      </div>
                    </div>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLow ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${insight.accuracyPct}%` }}
                    />
                  </div>

                  {/* Aligned Learning / Training Description */}
                  <div className="p-2.5 rounded-lg bg-white/90 border border-slate-200 text-[11px] text-slate-700 leading-relaxed flex items-start gap-2">
                    {isProficient ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="text-slate-900">
                        {isProficient ? 'Learning Status:' : 'Training Recommendation:'}
                      </strong>{' '}
                      {insight.trainingSuggestion}
                      {insight.cautionNote && (
                        <span className="block text-slate-500 mt-0.5">{insight.cautionNote}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 3: Company-Wide Quiz Performance Over Time */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Company-Wide Quiz Performance Over Time
            </h3>
            <p className="text-xs text-slate-500">
              Daily session-level average accuracy across completed required weekly &amp; optional quizzes (scope: {period === 'today' ? 'Today' : period === 'week' ? 'Past 7 Days' : period === 'month' ? 'Past 30 Days' : 'All Historical'}; deferred/incomplete attempts excluded)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Session-Level Daily Avg</span>
        </div>

        {performanceTrend.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No completed quiz sessions recorded for the selected date filter.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Daily Average Score Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 content-start">
                {performanceTrend.map(pt => (
                  <div
                    key={pt.date}
                    title={`${pt.date}: ${pt.sessionSummary}`}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1"
                  >
                    <div className="text-[10px] font-mono text-slate-500">{pt.date.slice(5)}</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                      {pt.avgScore}%
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${pt.avgScore}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium tabular-nums">
                      {pt.sessionCount} {pt.sessionCount === 1 ? 'session' : 'sessions'}
                    </div>
                  </div>
                ))}
              </div>

            {/* Compact Line Graph (uses the exact same performanceTrend array) */}
            <div className="lg:col-span-7 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-slate-700">
                  Daily Average Accuracy Trend (%)
                </span>
                <span className="font-mono text-slate-500 tabular-nums">
                  {performanceTrend.reduce((sum, pt) => sum + pt.sessionCount, 0)} completed{' '}
                  {performanceTrend.reduce((sum, pt) => sum + pt.sessionCount, 0) === 1
                    ? 'session'
                    : 'sessions'}{' '}
                  across {performanceTrend.length}{' '}
                  {performanceTrend.length === 1 ? 'day' : 'days'}
                </span>
              </div>

              {(() => {
                const svgW = 480;
                const svgH = 180;
                const padL = 36;
                const padR = 24;
                const padT = 22;
                const padB = 34;
                const plotW = svgW - padL - padR;
                const plotH = svgH - padT - padB;

                const points = performanceTrend.map((pt, idx) => {
                  const x =
                    performanceTrend.length === 1
                      ? padL + plotW / 2
                      : padL + (idx / (performanceTrend.length - 1)) * plotW;
                  const y = padT + plotH - (pt.avgScore / 100) * plotH;
                  return { ...pt, x, y };
                });

                const polylinePts = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                const areaPts = `${points[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} ${polylinePts} ${points[points.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)}`;

                return (
                  <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    className="w-full h-44 overflow-visible"
                    role="img"
                    aria-label="Company-wide daily quiz accuracy line graph"
                  >
                    {[0, 50, 80, 100].map(tick => {
                      const y = padT + plotH - (tick / 100) * plotH;
                      return (
                        <g key={tick}>
                          <line
                            x1={padL}
                            y1={y}
                            x2={svgW - padR}
                            y2={y}
                            stroke={tick === 80 ? '#c7d2fe' : '#e2e8f0'}
                            strokeDasharray={tick === 0 ? undefined : '3 3'}
                            strokeWidth={1}
                          />
                          <text
                            x={padL - 6}
                            y={y + 3}
                            textAnchor="end"
                            className="fill-slate-400 text-[9px] font-mono"
                          >
                            {tick}%
                          </text>
                        </g>
                      );
                    })}

                    {points.length > 1 && (
                      <>
                        <polygon points={areaPts} fill="#4f46e5" fillOpacity={0.08} />
                        <polyline
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylinePts}
                        />
                      </>
                    )}

                    {points.map(p => (
                      <g key={p.date}>
                        <title>
                          {`${p.date}: ${p.avgScore}% (${p.sessionCount} ${
                            p.sessionCount === 1 ? 'session' : 'sessions'
                          })`}
                        </title>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={4.5}
                          fill="#ffffff"
                          stroke="#4f46e5"
                          strokeWidth={2.5}
                        />
                        <text
                          x={p.x}
                          y={Math.max(12, p.y - 9)}
                          textAnchor="middle"
                          className="fill-slate-900 text-[10px] font-mono font-bold"
                        >
                          {p.avgScore}%
                        </text>
                        <text
                          x={p.x}
                          y={svgH - 14}
                          textAnchor="middle"
                          className="fill-slate-600 text-[9px] font-mono"
                        >
                          {p.date.slice(5)}
                        </text>
                        <text
                          x={p.x}
                          y={svgH - 3}
                          textAnchor="middle"
                          className="fill-slate-400 text-[8px] font-sans"
                        >
                          ({p.sessionCount})
                        </text>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Note: Daily averages reflect completed sessions on each date (including weekend or off-shift quiz completions without an attendance clock-in) and measure cohort session averages rather than individual employee improvement.
            </p>

            {/* Underlying Completed Quiz Sessions Reconciliation */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">
                  Underlying Completed Quiz Sessions ({periodFilteredCompanyQuizSessions.length})
                </span>
                <span className="text-slate-500">
                  Reconciled against Attendance &amp; Quiz Participation Log
                </span>
              </div>
              <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 text-[11px]">
                {[...periodFilteredCompanyQuizSessions]
                  .sort((a, b) => b.date.localeCompare(a.date) || b.timestamp - a.timestamp)
                  .map(sess => {
                    const hasShiftOnDate = records.some(
                      r => r.employeeId === sess.employeeId && r.date === sess.date
                    );
                    return (
                      <div
                        key={sess.id}
                        className="px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 bg-white hover:bg-slate-50/70"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-slate-500 tabular-nums">{sess.date}</span>
                          <span className="font-semibold text-slate-900">{sess.employeeName}</span>
                          <span className="font-mono text-slate-400">({sess.employeeId})</span>
                          <span className="text-slate-500">· {sess.department}</span>
                          <span className="text-slate-600">
                            · {sess.quizKind === 'optional' ? 'Optional Quiz' : 'Required Weekly'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500">
                            {hasShiftOnDate ? 'Linked to shift log' : 'Off-shift completion'}
                          </span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {sess.score}% ({sess.correctCount}/{sess.totalCount})
                          </span>
                          <button
                            type="button"
                            onClick={() => setInspectingSession(sess)}
                            className="text-indigo-700 hover:text-indigo-900 font-semibold underline underline-offset-2 cursor-pointer"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Comprehensive Attendance & Learning Log */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Comprehensive Attendance &amp; Quiz Participation Log
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredRecords.length} attendance records · {attendanceSummary.completedShifts}{' '}
              completed, {attendanceSummary.inProgressShifts} in progress,{' '}
              {attendanceSummary.missingClockOutShifts} missing clock-out
              {attendanceSummary.manuallyCorrectedShifts > 0
                ? `, ${attendanceSummary.manuallyCorrectedShifts} manually corrected`
                : ''}
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Click &quot;Review&quot; to inspect quiz answers or &quot;History&quot; on manual clock-out corrections
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No attendance records match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Clock-In</th>
                  <th className="py-3 px-3">Clock-Out</th>
                  <th className="py-3 px-3">Total Hours</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Quiz Status</th>
                  <th className="py-3 px-3 text-right">Score</th>
                  <th className="py-3 px-3">Manager Notes</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(rec => {
                  const isEditingNote = editingNoteRecordId === rec.id;
                  const shiftInfo = getShiftStatusInfo(rec);
                  const matchedSession = rec.quizSessionId
                    ? quizSessions.find(s => s.id === rec.quizSessionId)
                    : quizSessions.find(
                        s => s.employeeId === rec.employeeId && s.date === rec.date
                      );

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {rec.employeeName}
                        <span className="text-[10px] text-slate-400 block font-mono font-normal">
                          {rec.employeeId}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{rec.department}</td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                        {rec.date}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-900">
                        {rec.checkInTime}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums">
                        {rec.checkOutTime ? (
                          <div className="space-y-0.5">
                            <span className="text-slate-700">
                              {rec.checkOutTime}
                              {shiftInfo.isOvernight && (
                                <span className="text-[10px] text-indigo-600 font-semibold ml-1">
                                  (+1d)
                                </span>
                              )}
                            </span>
                            {rec.clockOutSource === 'manual_correction' && (
                              <div className="font-sans space-y-0.5">
                                <span className="block text-[10px] font-bold text-indigo-700">
                                  Manually Entered
                                </span>
                                <span className="block text-[10px] text-slate-500">
                                  Orig: {rec.originalClockOutStatus || 'Missing Clock-Out'}
                                </span>
                                {rec.manualClockOutReason && (
                                  <span
                                    className="block text-[10px] text-slate-700 italic max-w-[200px] truncate"
                                    title={rec.manualClockOutReason}
                                  >
                                    Reason: &ldquo;{rec.manualClockOutReason}&rdquo;
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setReviewingCorrectionRecord(rec)}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 underline underline-offset-2 cursor-pointer"
                                >
                                  <History className="w-3 h-3" />
                                  <span>Review History</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : shiftInfo.state === 'in_progress' ? (
                          <span className="text-[11px] font-sans font-semibold text-sky-700">
                            In Progress
                          </span>
                        ) : (
                          <span className="text-[11px] font-sans font-semibold text-amber-700">
                            Missing Clock-Out
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums">
                        {shiftInfo.state === 'completed' ? (
                          <div>
                            <span className="font-semibold text-slate-900">
                              {shiftInfo.totalHoursFormatted}
                            </span>
                            {shiftInfo.totalHoursDecimal && (
                              <span className="block text-[10px] text-slate-400">
                                {shiftInfo.totalHoursDecimal}
                                {shiftInfo.isOvernight ? ' · Overnight' : ''}
                              </span>
                            )}
                          </div>
                        ) : shiftInfo.state === 'in_progress' ? (
                          <span className="text-[11px] font-sans font-medium text-sky-700">
                            In Progress
                          </span>
                        ) : (
                          <span className="text-[11px] font-sans font-medium text-amber-700">
                            Missing Clock-Out
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-semibold ${
                            rec.attendanceStatus === 'ON_TIME'
                              ? 'text-emerald-700'
                              : rec.attendanceStatus === 'LATE'
                              ? 'text-amber-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {rec.attendanceStatus === 'ON_TIME'
                            ? 'Punctual'
                            : rec.attendanceStatus === 'LATE'
                            ? 'Late Arrival'
                            : 'Not Evaluated'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {matchedSession ? (
                          <span className="text-indigo-700 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                            <span>
                              Completed ({matchedSession.quizKind === 'optional' ? 'Optional' : 'Weekly'})
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">Not Participated</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {matchedSession ? `${matchedSession.score}%` : '—'}
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
                              type="button"
                              onClick={() => handleSaveNote(rec.id)}
                              className="p-1 text-emerald-600 hover:text-emerald-800 cursor-pointer"
                              title="Save Note"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteRecordId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                              type="button"
                              onClick={() => {
                                setEditingNoteRecordId(rec.id);
                                setNoteText(rec.managerNotes || '');
                              }}
                              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                              title="Edit note"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {matchedSession ? (
                          <button
                            type="button"
                            onClick={() => setInspectingSession(matchedSession)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Review</span>
                          </button>
                        ) : (
                          <span className="text-slate-300">—</span>
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
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-400">
                  Enterprise L&amp;D Management Report
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  Department Learning Needs, Support Alerts &amp; Attendance Summary
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Scope: {period.toUpperCase()} · Generated on{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 print:text-black">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-900">Executive Overview</div>
                <p className="leading-relaxed">
                  During this reporting period, the company recorded a punctuality rate of{' '}
                  <strong>{attendanceSummary.punctualityLabel}</strong> across{' '}
                  <strong>{attendanceSummary.totalShifts}</strong> shift check-ins ({attendanceSummary.onTimeShifts} on-time, {attendanceSummary.lateShifts} late
                  {attendanceSummary.notEvaluatedShifts > 0
                    ? `, ${attendanceSummary.notEvaluatedShifts} not evaluated`
                    : ''}
                  ;{' '}
                  {attendanceSummary.completedShifts} completed shifts,{' '}
                  {attendanceSummary.incompleteShifts} incomplete). Current weekly required quiz
                  completion ({currentWeekKey}) stands at{' '}
                  <strong>{weeklyCompletionRateLabel}</strong> (
                  <strong>
                    {weeklyCompletedCount} of {eligibleEmployeesInScope.length}
                  </strong>{' '}
                  eligible staff), while{' '}
                  <strong>
                    {everParticipatingCount} of {eligibleEmployeesInScope.length} (
                    {everParticipationRateLabel})
                  </strong>{' '}
                  have ever participated, with a session-level average quiz score of{' '}
                  <strong>{avgQuizScoreLabel}</strong>.
                </p>
              </div>

              {/* Support Flags */}
              {fivePlusMissedCount > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-xs">
                    Employee Support Follow-Ups (5+ Consecutive Missed Weekly Quizzes)
                  </div>
                  {employeesNeedingSupport
                    .filter(e => (e.consecutiveMissedQuizzes || 0) >= 5)
                    .map(e => {
                      const status = getManagerFollowUpStatus(e);
                      const statusText =
                        status === 'completed'
                          ? 'Check-In Completed'
                          : status === 'plan_recorded'
                          ? 'Support Plan Recorded'
                          : 'Manager Check-In Recommended';
                      return (
                        <div
                          key={e.id}
                          className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-start gap-3"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">
                              {e.name} ({e.id})
                            </span>
                            : {e.consecutiveMissedQuizzes} consecutive weekly quizzes missed · Follow-Up Status:{' '}
                            <strong>{statusText}</strong> (no automatic penalty).
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Training Needs Callout */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs">
                  High-Priority Training Recommendations (0–59% · Foundational Training)
                </div>
                <div className="space-y-2">
                  {topicsNeedingTraining.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">
                          {t.department} – {t.topic}
                        </span>
                        : {t.status} → <strong>{t.recommendation}</strong> ({t.accuracyPct}% ·{' '}
                        {t.basisLabel}).
                        <div className="text-slate-700 mt-0.5 italic">{t.trainingSuggestion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departmental Table */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs">Departmental Breakdown</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Department</th>
                        <th className="py-2 px-3 text-right">Eligible</th>
                        <th className="py-2 px-3 text-right">Ever Participated</th>
                        <th className="py-2 px-3 text-right">Weekly ({currentWeekKey})</th>
                        <th className="py-2 px-3 text-right">Avg Score</th>
                        <th className="py-2 px-3">Training Recommendation</th>
                        <th className="py-2 px-3">Lowest Scoring Area</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {departmentBreakdown.map(ds => (
                        <tr key={ds.department}>
                          <td className="py-2 px-3 font-medium text-slate-900">{ds.department}</td>
                          <td className="py-2 px-3 text-right font-mono">{ds.eligibleCount}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-700">
                            {ds.everParticipationRateDisplay}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-indigo-700 font-semibold">
                            {ds.weeklyCompletionRateDisplay}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            {ds.avgScoreDisplay}
                          </td>
                          <td className="py-2 px-3 text-slate-700">
                            <span className="font-semibold">
                              {ds.status} → {ds.recommendation}
                            </span>{' '}
                            <span className="text-slate-500">({ds.basisLabel})</span>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{ds.lowestTopic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => exportAttendanceToCsv(filteredRecords, quizSessions)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Report CSV</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Executive Brief</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Manual Clock-Out Correction Audit Modal */}
      {reviewingCorrectionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-300">
                  Attendance Audit Trail · Manually Entered Clock-Out
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {reviewingCorrectionRecord.employeeName} ({reviewingCorrectionRecord.employeeId})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingCorrectionRecord(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500">Original Clock-In</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {reviewingCorrectionRecord.date} · {reviewingCorrectionRecord.checkInTime}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-[11px] text-amber-800">Preserved Original Status</div>
                  <div className="font-bold text-amber-900 mt-0.5">
                    {reviewingCorrectionRecord.originalClockOutStatus || 'Missing Clock-Out'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                  <div className="text-[11px] text-indigo-700">Manually Entered Clock-Out</div>
                  <div className="font-mono font-bold text-indigo-950 mt-0.5">
                    {reviewingCorrectionRecord.checkOutDate || reviewingCorrectionRecord.date} ·{' '}
                    {reviewingCorrectionRecord.checkOutTime}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] text-emerald-800">Calculated Shift Duration</div>
                  <div className="font-mono font-bold text-emerald-950 mt-0.5">
                    {getShiftStatusInfo(reviewingCorrectionRecord).totalHoursFormatted}
                  </div>
                </div>
              </div>

              {reviewingCorrectionRecord.manualClockOutReason && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-600">
                    Employee Reason Note
                  </div>
                  <div className="text-slate-900 mt-0.5 leading-relaxed">
                    {reviewingCorrectionRecord.manualClockOutReason}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="font-bold text-slate-900">Correction History</div>
                {reviewingCorrectionRecord.manualClockOutHistory &&
                reviewingCorrectionRecord.manualClockOutHistory.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {reviewingCorrectionRecord.manualClockOutHistory.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">
                            Status Changed: {entry.originalStatus} → Shift Completed (Manually Entered)
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {entry.correctedAt}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Entered Clock-Out:{' '}
                          <span className="font-mono font-semibold text-slate-800">
                            {entry.enteredCheckOutDate} {entry.enteredCheckOutTime}
                          </span>{' '}
                          · Duration:{' '}
                          <span className="font-mono font-semibold text-slate-800">
                            {entry.calculatedDuration}
                          </span>{' '}
                          · Submitted by {entry.submittedByEmployeeId}
                        </div>
                        {entry.reasonNote && (
                          <div className="text-[11px] text-slate-700 bg-slate-50 border border-slate-100 rounded px-2.5 py-1.5 mt-1">
                            <span className="font-semibold text-slate-800">Reason:</span>{' '}
                            {entry.reasonNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
                    Clock-out time was manually entered after an incomplete previous shift.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setReviewingCorrectionRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
