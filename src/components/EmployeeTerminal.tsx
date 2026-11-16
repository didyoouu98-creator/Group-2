import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Plus,
  History,
  Eye,
  EyeOff,
  Gift,
  LogOut,
  SkipForward,
  Info,
  Building2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import {
  Employee,
  EmployeePortalScope,
  AttendanceRecord,
  QuizSessionRecord,
  MissedQuizFeedback,
} from '../types';
import { DepartmentMixedQuiz } from './DepartmentMixedQuiz';
import { AttendanceSuccessModal } from './AttendanceSuccessModal';
import { QuizReviewModal } from './QuizReviewModal';
import { MissedQuizSurveyModal } from './MissedQuizSurveyModal';
import { BenefitsRewardsModal } from './BenefitsRewardsModal';
import {
  countRecordedAttendanceDays,
  formatLocalDate,
  findActiveOpenShift,
  findMissingClockOutRecords,
  getManagerFollowUpStatus,
  getShiftStatusInfo,
  getWeeklyQuizStatus,
  validateManualClockOutSelection,
} from '../services/attendanceStorage';

interface EmployeeTerminalProps {
  employeeScope: EmployeePortalScope | null;
  onSignInEmployee: (employeeId: string) => void;
  onSignOutEmployee: () => void;
  onOpenManagerLogin: () => void;
  onDirectClockIn: (employeeId: string) => AttendanceRecord;
  onDirectClockOut: (employeeId: string) => AttendanceRecord;
  onManualClockOut: (
    employeeId: string,
    recordId: string,
    selectedDate: string,
    selectedTime: string,
    reasonNote?: string
  ) => AttendanceRecord;
  onSkipQuiz: (
    employeeId: string,
    recordId?: string
  ) => {
    employee: Employee;
    missedCount: number;
    shouldShowSurvey: boolean;
    shouldNotifyManager: boolean;
  };
  onSubmitMissedSurvey: (feedback: MissedQuizFeedback) => void;
  onRedeemBenefit: (employeeId: string, benefitId: string) => void;
  onQuizCompleted: (session: QuizSessionRecord) => void;
  onRefreshData: () => void;
}

export const EmployeeTerminal: React.FC<EmployeeTerminalProps> = ({
  employeeScope,
  onSignInEmployee,
  onSignOutEmployee,
  onOpenManagerLogin,
  onDirectClockIn,
  onDirectClockOut,
  onManualClockOut,
  onSkipQuiz,
  onSubmitMissedSurvey,
  onRedeemBenefit,
  onQuizCompleted,
  onRefreshData,
}) => {
  const [loginIdInput, setLoginIdInput] = useState<string>('');
  const [showEmployeeId, setShowEmployeeId] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'warning' | 'success' | 'info';
    title: string;
    detail: string;
  } | null>(null);

  const [activeActivity, setActiveActivity] = useState<'IDLE' | 'MIXED_QUIZ'>('IDLE');
  const [activeQuizKind, setActiveQuizKind] = useState<'weekly' | 'optional'>('weekly');
  const [latestRegisteredRecord, setLatestRegisteredRecord] = useState<AttendanceRecord | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [reviewingSession, setReviewingSession] = useState<QuizSessionRecord | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState<{
    employee: Employee;
    missedStreak: number;
  } | null>(null);
  const [showRewardsModal, setShowRewardsModal] = useState<boolean>(false);
  const [manualClockOutInputs, setManualClockOutInputs] = useState<
    Record<string, { date: string; hour: string; minute: string; period: string; reason: string }>
  >({});
  const [manualClockOutErrors, setManualClockOutErrors] = useState<Record<string, string>>({});
  const [pendingManualConfirmation, setPendingManualConfirmation] = useState<{
    recordId: string;
    selectedDate: string;
    selectedTime: string;
    formattedTime12h: string;
    calculatedDuration: string;
    isOvernight: boolean;
    reasonNote: string;
  } | null>(null);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanInput = loginIdInput.trim().toUpperCase();
    if (!cleanInput) {
      setErrorMessage('Please enter your Employee ID.');
      return;
    }

    try {
      onSignInEmployee(cleanInput);
      setLoginIdInput('');
      setShowEmployeeId(false);
    } catch (err: any) {
      if (err.message === 'MISSING_EMPLOYEE_ID') {
        setErrorMessage('Please enter your Employee ID.');
      } else {
        setErrorMessage(
          `Employee ID "${loginIdInput.trim()}" was not found. Please check your Employee ID and try again.`
        );
      }
    }
  };

  // 1. Opening Page — Full-Screen Deep Navy (#0B1F3A) Welcome & Sign-In
  if (!employeeScope) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] text-white flex flex-col justify-between px-5 py-10 sm:py-14">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-8">
            {/* Clean White Building Icon */}
            <div
              aria-hidden="true"
              className="w-20 h-20 rounded-3xl bg-white/10 border border-sky-300/30 flex items-center justify-center shadow-lg"
            >
              <Building2 className="w-10 h-10 text-white" strokeWidth={1.75} />
            </div>

            {/* Greeting, Subtitle & Supporting Label */}
            <div className="space-y-3">
              <h1 className="text-[38px] sm:text-[46px] font-extrabold text-white tracking-tight leading-tight">
                Hi, welcome back!
              </h1>
              <p className="text-[20px] sm:text-[22px] font-semibold text-sky-300">
                Enterprise L&amp;D Management
              </p>
              <p className="text-sm sm:text-base font-medium text-sky-200/80">
                Employee Attendance &amp; Learning Portal
              </p>
              <p className="text-[18px] text-slate-200 leading-relaxed max-w-md mx-auto pt-2">
                Ready for your day? Sign in to clock in or continue learning.
              </p>
            </div>

            {/* Centered Employee ID Authentication Form */}
            <form onSubmit={handleSignInSubmit} className="w-full max-w-md space-y-5 pt-1">
              <div className="space-y-2.5">
                <label
                  htmlFor="opening-employee-id"
                  className="block text-[18px] font-semibold text-sky-200 text-center"
                >
                  Employee ID
                </label>
                <div className="relative flex items-center">
                  <input
                    id="opening-employee-id"
                    type={showEmployeeId ? 'text' : 'password'}
                    value={loginIdInput}
                    onChange={e => {
                      setLoginIdInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Enter your Employee ID"
                    autoComplete="off"
                    className="w-full h-16 pl-12 pr-14 text-center text-[20px] font-mono font-bold uppercase tracking-wider text-white placeholder:text-slate-400 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal bg-white/10 focus:bg-white/15 border-2 border-sky-300/35 focus:border-sky-300 rounded-3xl focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmployeeId(prev => !prev)}
                    aria-label={showEmployeeId ? 'Hide Employee ID' : 'Show Employee ID'}
                    aria-pressed={showEmployeeId}
                    title={showEmployeeId ? 'Hide Employee ID' : 'Show Employee ID'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl text-sky-200/85 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300/60 transition-colors cursor-pointer"
                  >
                    {showEmployeeId ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-950/70 border border-red-400/50 flex items-start gap-3 text-left text-base text-red-100 font-medium"
                >
                  <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[64px] px-6 rounded-3xl bg-sky-400 hover:bg-sky-300 text-[#0B1F3A] font-extrabold text-[19px] transition-colors shadow-lg cursor-pointer"
              >
                Let&apos;s Get Started
              </button>
            </form>
          </div>
        </div>

        {/* Small Manager Login Link at Bottom */}
        <footer className="pt-10 text-center">
          <button
            type="button"
            onClick={onOpenManagerLogin}
            className="text-sm font-medium text-sky-300/80 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            Manager Login
          </button>
        </footer>
      </div>
    );
  }

  // Scoped authenticated employee state
  const {
    employee: currentEmployee,
    records: myAttendanceRecords,
    quizSessions: myQuizHistory,
    redemptions: myRedemptions,
    isFirstPlaceWinner,
  } = employeeScope;

  const todayDateStr = formatLocalDate(new Date());
  const todayRecord = myAttendanceRecords.find(r => r.date === todayDateStr);
  const activeOpenShift = findActiveOpenShift(myAttendanceRecords, currentEmployee.id);
  const missingClockOutRecords = findMissingClockOutRecords(
    myAttendanceRecords,
    currentEmployee.id
  );
  const hasIncompletePreviousShift = missingClockOutRecords.length > 0;
  const displayShiftRecord = activeOpenShift || todayRecord;
  const isCurrentlyClockedIn = Boolean(
    activeOpenShift || (todayRecord && !todayRecord.checkOutTime)
  );
  const isRegisteredToday = Boolean(todayRecord) || Boolean(activeOpenShift);
  const hasClockedOutToday = Boolean(todayRecord?.checkOutTime) && !activeOpenShift;
  const canClockIn = !todayRecord && !activeOpenShift && !hasIncompletePreviousShift;
  const canClockOut = isCurrentlyClockedIn;
  const recordedAttendanceDays = countRecordedAttendanceDays(
    myAttendanceRecords,
    currentEmployee.id
  );
  const recentAttendance = myAttendanceRecords.slice(0, 6);
  const weeklyStatus = getWeeklyQuizStatus(currentEmployee);
  const isWeeklyCompleted = weeklyStatus === 'completed';
  const missedStreak = currentEmployee.consecutiveMissedQuizzes || 0;
  const followUpStatus = getManagerFollowUpStatus(currentEmployee);

  const getAttendanceStatusDisplay = (status: AttendanceRecord['attendanceStatus']) => {
    if (status === 'ON_TIME') {
      return { label: 'Punctual', colorClass: 'text-emerald-300' };
    }
    if (status === 'LATE') {
      return { label: 'Late Arrival', colorClass: 'text-amber-300' };
    }
    return { label: 'Not Evaluated', colorClass: 'text-slate-300' };
  };

  const handleClockIn = () => {
    setErrorMessage(null);
    setStatusMessage(null);

    if (hasIncompletePreviousShift) {
      setErrorMessage(
        'You have an incomplete attendance record from a previous shift. Please complete your missing clock-out before starting a new shift.'
      );
      return;
    }

    if (displayShiftRecord && !displayShiftRecord.checkOutTime) {
      setStatusMessage({
        type: 'warning',
        title: 'You are already clocked in.',
        detail: `Active shift started on ${displayShiftRecord.date} at ${displayShiftRecord.checkInTime}.`,
      });
      return;
    }

    if (todayRecord) {
      setStatusMessage({
        type: 'warning',
        title: 'You have already clocked in today.',
        detail: `Attendance was recorded earlier today at ${todayRecord.checkInTime}.`,
      });
      return;
    }

    try {
      const createdRecord = onDirectClockIn(currentEmployee.id);
      setLatestRegisteredRecord(createdRecord);
      setShowConfirmationModal(true);
    } catch (err: any) {
      if (err.message?.startsWith('INCOMPLETE_PREVIOUS_SHIFT:')) {
        setErrorMessage(
          'You have an incomplete attendance record from a previous shift. Please complete your missing clock-out before starting a new shift.'
        );
      } else if (err.message?.startsWith('DUPLICATE_CHECK_IN:')) {
        const parts = err.message.split(':');
        setStatusMessage({
          type: 'warning',
          title: 'You have already clocked in today.',
          detail: `Clocked in earlier at ${parts[2] || 'today'}.`,
        });
      } else {
        setErrorMessage(err.message || 'Unable to register attendance.');
      }
    }
  };

  const handleReviewManualClockOut = (rec: AttendanceRecord) => {
    setErrorMessage(null);
    setStatusMessage(null);
    const input = manualClockOutInputs[rec.id] || {
      date: '',
      hour: '',
      minute: '',
      period: '',
      reason: '',
    };
    const composedTime =
      input.hour && input.minute && input.period
        ? `${input.hour}:${input.minute} ${input.period}`
        : '';

    if (!input.date && !composedTime) {
      setManualClockOutErrors(prev => ({
        ...prev,
        [rec.id]: 'Please select both the clock-out date and clock-out time.',
      }));
      return;
    }

    if (input.date && (!input.hour || !input.minute || !input.period)) {
      setManualClockOutErrors(prev => ({
        ...prev,
        [rec.id]: 'Please select the clock-out hour, minute, and AM/PM.',
      }));
      return;
    }

    const validation = validateManualClockOutSelection(
      myAttendanceRecords,
      rec,
      input.date,
      composedTime
    );

    if (!validation.valid) {
      setManualClockOutErrors(prev => ({
        ...prev,
        [rec.id]: validation.errorMessage,
      }));
      return;
    }

    setManualClockOutErrors(prev => {
      const next = { ...prev };
      delete next[rec.id];
      return next;
    });

    setPendingManualConfirmation({
      recordId: rec.id,
      selectedDate: validation.selectedOutDate,
      selectedTime: composedTime,
      formattedTime12h: validation.selectedOutTime12h,
      calculatedDuration: validation.calculatedDuration,
      isOvernight: validation.isOvernight,
      reasonNote: input.reason.trim(),
    });
  };

  const handleConfirmManualClockOut = (rec: AttendanceRecord) => {
    if (!pendingManualConfirmation || pendingManualConfirmation.recordId !== rec.id) return;
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const updated = onManualClockOut(
        currentEmployee.id,
        rec.id,
        pendingManualConfirmation.selectedDate,
        pendingManualConfirmation.selectedTime,
        pendingManualConfirmation.reasonNote || undefined
      );
      const shiftInfo = getShiftStatusInfo(updated);
      const savedReason = updated.manualClockOutReason;
      setPendingManualConfirmation(null);
      setManualClockOutInputs(prev => {
        const next = { ...prev };
        delete next[rec.id];
        return next;
      });
      setManualClockOutErrors(prev => {
        const next = { ...prev };
        delete next[rec.id];
        return next;
      });
      setStatusMessage({
        type: 'success',
        title: 'Previous Shift Clock-Out Completed',
        detail: `Updated ${updated.date} shift status from Missing Clock-Out to Shift Completed (Clock-Out: ${updated.checkOutTime}, Total Duration: ${shiftInfo.totalHoursFormatted}${savedReason ? `, Reason: "${savedReason}"` : ''}).`,
      });
    } catch (err: any) {
      setPendingManualConfirmation(null);
      setManualClockOutErrors(prev => ({
        ...prev,
        [rec.id]: err.message || 'Unable to save manual clock-out time.',
      }));
    }
  };

  const handleClockOut = () => {
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const updatedRecord = onDirectClockOut(currentEmployee.id);
      const shiftInfo = getShiftStatusInfo(updatedRecord);
      setStatusMessage({
        type: 'success',
        title: 'Clock-Out Recorded',
        detail: `Clocked out at ${updatedRecord.checkOutTime} (Total Hours: ${shiftInfo.totalHoursFormatted}). Have a great rest of your day!`,
      });
    } catch (err: any) {
      if (err.message === 'NOT_CLOCKED_IN') {
        setErrorMessage('Please clock in first.');
      } else if (err.message?.startsWith('ALREADY_CLOCKED_OUT:')) {
        const outTime = err.message.split(':')[1] || 'earlier today';
        setStatusMessage({
          type: 'warning',
          title: 'You have already clocked out today.',
          detail: `You already clocked out earlier today at ${outTime}.`,
        });
      } else {
        setErrorMessage(err.message || 'Unable to record clock-out.');
      }
    }
  };

  const handleCompleteLater = (recordId?: string) => {
    setShowConfirmationModal(false);
    setActiveActivity('IDLE');
    setErrorMessage(null);

    onSkipQuiz(currentEmployee.id, recordId);

    setStatusMessage({
      type: 'info',
      title: 'Weekly Quiz Deferred (Complete Later)',
      detail:
        'Your attendance record is unaffected. Completing later does not count as missed before the week ends.',
    });
  };

  const handleQuizCompleted = (session: QuizSessionRecord) => {
    onQuizCompleted(session);
    onRefreshData();
  };

  // Personalized Employee Dashboard (Navy #0B1F3A Theme)
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white flex flex-col">
      {/* Top Personalized Navy Header */}
      <header className="border-b border-sky-300/15 bg-[#08172D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-400/20 border border-sky-300/40 text-white flex items-center justify-center font-extrabold text-sm tracking-tight shrink-0">
              L&amp;D
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Enterprise L&amp;D Management
              </div>
              <div className="text-sm sm:text-base text-sky-200 flex flex-wrap items-center gap-x-2">
                <span className="font-semibold text-white">{currentEmployee.name}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{currentEmployee.id}</span>
                <span aria-hidden="true">·</span>
                <span>{currentEmployee.department}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setStatusMessage(null);
              setActiveActivity('IDLE');
              setShowEmployeeId(false);
              setManualClockOutInputs({});
              setManualClockOutErrors({});
              setPendingManualConfirmation(null);
              onSignOutEmployee();
            }}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-sky-300/30 rounded-xl transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 text-sky-300" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1">
        {activeActivity === 'MIXED_QUIZ' ? (
          <DepartmentMixedQuiz
            employee={currentEmployee}
            quizKind={activeQuizKind}
            onQuizSessionFinished={handleQuizCompleted}
            onCompleteLater={() => handleCompleteLater(todayRecord?.id)}
            onExit={() => setActiveActivity('IDLE')}
          />
        ) : (
          <>
            {/* Immediate Attendance Confirmation Modal */}
            {showConfirmationModal && latestRegisteredRecord && (
              <AttendanceSuccessModal
                record={latestRegisteredRecord}
                employee={currentEmployee}
                onPlayQuiz={() => {
                  setShowConfirmationModal(false);
                  if (!isWeeklyCompleted) {
                    setActiveQuizKind('weekly');
                    setActiveActivity('MIXED_QUIZ');
                  }
                }}
                onSkip={() => handleCompleteLater(latestRegisteredRecord.id)}
              />
            )}

            {/* Optional Learning Support Survey Modal */}
            {showSurveyModal && (
              <MissedQuizSurveyModal
                employee={showSurveyModal.employee}
                missedStreak={showSurveyModal.missedStreak}
                onSubmitSurvey={(feedback, startWeeklyQuizNow) => {
                  onSubmitMissedSurvey(feedback);
                  setShowSurveyModal(null);
                  if (startWeeklyQuizNow && !isWeeklyCompleted) {
                    setActiveQuizKind('weekly');
                    setActiveActivity('MIXED_QUIZ');
                  } else {
                    setStatusMessage({
                      type: 'info',
                      title: 'Support Survey Submitted',
                      detail:
                        'Thank you for sharing your feedback. Your weekly quiz remains available anytime with zero penalty.',
                    });
                  }
                }}
                onClose={() => setShowSurveyModal(null)}
              />
            )}

            {/* Personal Rewards Modal */}
            {showRewardsModal && (
              <BenefitsRewardsModal
                employee={currentEmployee}
                isFirstPlaceWinner={isFirstPlaceWinner}
                redemptions={myRedemptions}
                onRedeemBenefit={onRedeemBenefit}
                onClose={() => setShowRewardsModal(false)}
              />
            )}

            {/* Review Own Past Quiz Modal */}
            {reviewingSession && (
              <QuizReviewModal
                session={reviewingSession}
                onClose={() => setReviewingSession(null)}
              />
            )}

            {/* Global Inline Alerts */}
            {errorMessage && (
              <div
                role="alert"
                className="p-5 rounded-2xl bg-red-950/75 border border-red-400/50 flex items-start gap-3 text-[18px] text-red-100 font-medium"
              >
                <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-1" />
                <span>{errorMessage}</span>
              </div>
            )}

            {statusMessage && (
              <div
                role="status"
                className={`p-5 rounded-2xl border flex items-start gap-3.5 text-[18px] ${
                  statusMessage.type === 'warning'
                    ? 'bg-amber-950/60 border-amber-300/40 text-amber-100'
                    : statusMessage.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-300/40 text-emerald-100'
                    : 'bg-[#112A4D] border-sky-300/35 text-sky-100'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-1" />
                ) : (
                  <Info className="w-5 h-5 text-sky-300 shrink-0 mt-1" />
                )}
                <div>
                  <div className="font-bold text-white">{statusMessage.title}</div>
                  <div className="mt-1 leading-relaxed opacity-90">{statusMessage.detail}</div>
                </div>
              </div>
            )}

            {/* Compact Personalized Support Notice (Only when missedStreak > 0; zero private notes; zero duplicate notices) */}
            {missedStreak > 0 && (
              <section
                aria-label="Personalized Learning Support"
                className="p-5 sm:p-6 rounded-2xl bg-[#112A4D] border border-sky-300/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-sky-300 shrink-0 mt-1" />
                  <div className="space-y-1 text-[18px] leading-relaxed text-sky-100">
                    {missedStreak >= 5 ? (
                      <>
                        <div className="font-bold text-white">
                          {followUpStatus === 'completed'
                            ? 'Check-In Completed'
                            : followUpStatus === 'plan_recorded'
                            ? 'Support Plan Recorded'
                            : 'Manager Check-In Recommended'}
                        </div>
                        <p>
                          {followUpStatus === 'completed'
                            ? 'Your supportive check-in has been completed. Your weekly quiz remains available anytime with zero penalty.'
                            : followUpStatus === 'plan_recorded'
                            ? 'Your manager has recorded a learning support plan. Your weekly quiz remains available anytime with zero penalty.'
                            : 'A supportive manager check-in is recommended to discuss any learning obstacles. Your weekly quiz remains available anytime with zero penalty.'}
                        </p>
                      </>
                    ) : missedStreak >= 3 ? (
                      <>
                        <div className="font-bold text-white">Learning Support Available</div>
                        <p>
                          We noticed you have missed {missedStreak} consecutive weekly quizzes. You can complete a short optional survey so we can support your learning.
                        </p>
                      </>
                    ) : (
                      <p>
                        Friendly reminder: One required weekly quiz is scheduled per week. Complete it anytime—your attendance is unaffected.
                      </p>
                    )}
                  </div>
                </div>

                {missedStreak >= 3 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowSurveyModal({
                        employee: currentEmployee,
                        missedStreak,
                      })
                    }
                    className="shrink-0 min-h-[48px] px-5 rounded-xl bg-sky-400/20 hover:bg-sky-400/30 border border-sky-300/40 text-sky-200 hover:text-white font-semibold text-base transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Complete Support Survey
                  </button>
                )}
              </section>
            )}

            {/* Main Function A: Quiz Participation (Highlighted First Section) */}
            <section
              aria-label="Quiz Participation"
              className="bg-[#FBF3D5] border-2 border-[#E4C97A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg text-[#0B1F3A]"
            >
              <div className="flex flex-col gap-5 pb-5 border-b border-[#D8BE72]">
                <div className="space-y-2">
                  <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0B1F3A] tracking-tight flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-[#112A4D] shrink-0" />
                    <span>Quiz Participation · {currentEmployee.department}</span>
                  </h2>
                  <p className="text-[18px] text-[#1E3A5F] font-medium leading-relaxed">
                    {isWeeklyCompleted
                      ? 'Weekly Quiz Status: Completed for This Week. You can take additional optional quizzes anytime.'
                      : weeklyStatus === 'deferred'
                      ? 'Weekly Quiz Status: Deferred (Complete Later). Complete your required weekly quiz whenever ready.'
                      : 'Weekly Quiz Status: Available for This Week (1 required weekly quiz per week; additional quizzes are optional).'}
                  </p>
                </div>

                {/* Large, High-Contrast Quiz Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isWeeklyCompleted}
                    onClick={() => {
                      if (isWeeklyCompleted) return;
                      setActiveQuizKind('weekly');
                      setActiveActivity('MIXED_QUIZ');
                    }}
                    className={`inline-flex items-center justify-center gap-2.5 min-h-[64px] px-7 text-[19px] font-extrabold rounded-2xl transition-colors shadow-md whitespace-nowrap ${
                      isWeeklyCompleted
                        ? 'bg-emerald-100 border border-emerald-700/35 text-emerald-900 cursor-default'
                        : 'bg-[#0B1F3A] hover:bg-[#163663] text-white cursor-pointer'
                    }`}
                  >
                    {isWeeklyCompleted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span>Weekly Quiz Completed</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        <span>Take Weekly Quiz</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuizKind('optional');
                      setActiveActivity('MIXED_QUIZ');
                    }}
                    className="inline-flex items-center justify-center gap-2 min-h-[64px] px-7 text-[19px] font-bold text-[#0B1F3A] bg-white/85 hover:bg-white border border-[#B89B4C] rounded-2xl transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5 text-[#112A4D]" />
                    <span>Take Optional Quiz</span>
                  </button>

                  {!isWeeklyCompleted && (
                    <button
                      type="button"
                      onClick={() => handleCompleteLater(todayRecord?.id)}
                      className="inline-flex items-center justify-center gap-2 min-h-[64px] px-6 text-[18px] font-semibold text-[#1E3A5F] hover:text-[#0B1F3A] bg-[#F3E5B5]/70 hover:bg-[#ECD896] border border-[#C7AA5A] rounded-2xl transition-colors cursor-pointer whitespace-nowrap"
                      title="Defer the required weekly quiz without affecting attendance"
                    >
                      <SkipForward className="w-5 h-5 text-[#1E3A5F]" />
                      <span>Complete Later</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Summary & Rewards Access */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#F5E8BE] border border-[#DFC374] text-[18px]">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                  <div>
                    <span className="text-[#243B5A] font-medium">Completed Quizzes:</span>{' '}
                    <strong className="font-mono tabular-nums text-[#0B1F3A] font-extrabold">
                      {myQuizHistory.length}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#243B5A] font-medium">Personal Average:</span>{' '}
                    <strong className="font-mono tabular-nums text-emerald-800 font-extrabold">
                      {myQuizHistory.length > 0
                        ? `${Math.round(
                            myQuizHistory.reduce((acc, s) => acc + s.score, 0) /
                              myQuizHistory.length
                          )}%`
                        : 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#243B5A] font-medium">Reward Balance:</span>{' '}
                    <strong className="font-mono tabular-nums text-emerald-800 font-extrabold">
                      {currentEmployee.rewardPoints || 0} pts
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRewardsModal(true)}
                  className="inline-flex items-center gap-2 min-h-[48px] px-5 text-base font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Gift className="w-4 h-4" />
                  <span>View Rewards</span>
                </button>
              </div>

              {/* Own Quiz Results Table */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[18px] font-bold text-[#0B1F3A] flex items-center gap-2">
                    <History className="w-4 h-4 text-[#1E3A5F]" />
                    <span>Your Quiz Results</span>
                  </h3>
                  <span className="text-sm text-[#314A6B] font-medium">
                    Select &quot;Review Answers&quot; to inspect your results and explanations
                  </span>
                </div>

                {myQuizHistory.length === 0 ? (
                  <div className="p-6 text-center text-[18px] text-[#243B5A] bg-[#F7ECC8] rounded-2xl border border-dashed border-[#CBB063]">
                    No quiz results recorded yet. Select &quot;Take Weekly Quiz&quot; or &quot;Take Optional Quiz&quot; above to begin.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#DFC374] rounded-2xl bg-[#FFFDF4]">
                    <table className="w-full text-left text-base">
                      <thead className="border-b border-[#E7D394] bg-[#F7ECC8]/80 text-[#0B1F3A] font-bold text-sm">
                        <tr>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Topics Tested</th>
                          <th className="py-3 px-4 text-right">Correct</th>
                          <th className="py-3 px-4 text-right">Score</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDE0B5]">
                        {myQuizHistory.map(session => (
                          <tr key={session.id} className="hover:bg-[#FBF3D5]/60 transition-colors">
                            <td className="py-3 px-4 font-mono tabular-nums text-[#1E3A5F]">
                              {session.date}
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#0B1F3A]">
                              {session.quizKind === 'optional' ? 'Optional Quiz' : 'Weekly Quiz'}
                            </td>
                            <td className="py-3 px-4 text-[#2C4466]">
                              {session.topics.join(' · ')}
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums text-[#0B1F3A]">
                              {session.correctCount} / {session.totalCount}
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                              <span
                                className={
                                  session.score >= 80
                                    ? 'text-emerald-700'
                                    : session.score >= 60
                                    ? 'text-amber-700'
                                    : 'text-red-700'
                                }
                              >
                                {session.score}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setReviewingSession(session)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[#0B1F3A] hover:text-white bg-[#F5E8BE] hover:bg-[#0B1F3A] border border-[#C7AA5A] rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Review Answers</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Main Function B: Attendance Tracking & Recent Attendance History */}
            <section
              aria-label="Attendance Tracking"
              className="bg-[#112A4D] border border-sky-300/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-sky-300/15">
                <div className="space-y-2">
                  <h2 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight flex items-center gap-3">
                    <Clock className="w-7 h-7 text-sky-300 shrink-0" />
                    <span>Attendance Tracking</span>
                  </h2>
                  <p className="text-[18px] text-sky-200 leading-relaxed">
                    Clock in and out with your authenticated account ({currentEmployee.id}). Attendance is completely independent of quiz participation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {hasClockedOutToday ? (
                    <div
                      role="status"
                      className="inline-flex items-center justify-center gap-2.5 min-h-[64px] px-8 text-[19px] font-extrabold text-emerald-200 bg-emerald-400/20 border border-emerald-300/40 rounded-2xl whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      <span>Shift Completed</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={!canClockIn}
                        aria-disabled={!canClockIn}
                        onClick={handleClockIn}
                        className={`inline-flex items-center justify-center gap-2.5 min-h-[64px] px-8 text-[19px] font-extrabold rounded-2xl transition-colors shadow-md whitespace-nowrap ${
                          canClockIn
                            ? 'text-[#0B1F3A] bg-emerald-400 hover:bg-emerald-300 cursor-pointer'
                            : 'text-slate-300 bg-white/10 border border-sky-300/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Clock In</span>
                      </button>

                      <button
                        type="button"
                        disabled={!canClockOut}
                        aria-disabled={!canClockOut}
                        onClick={handleClockOut}
                        className={`inline-flex items-center justify-center gap-2.5 min-h-[64px] px-8 text-[19px] font-bold rounded-2xl transition-colors whitespace-nowrap ${
                          canClockOut
                            ? 'text-[#0B1F3A] bg-sky-400 hover:bg-sky-300 shadow-md cursor-pointer font-extrabold'
                            : 'text-slate-300 bg-white/10 border border-sky-300/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Clock Out</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Missing Clock-Out Reminder & Manual Clock-Out Resolution */}
              {hasIncompletePreviousShift && (
                <div
                  role="region"
                  aria-label="Missing Clock-Out Reminder"
                  className="p-5 sm:p-6 rounded-2xl bg-amber-950/55 border-2 border-amber-300/50 space-y-5"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-[19px] font-bold text-amber-100">
                        Missing Clock-Out Action Required
                      </div>
                      <p className="text-[17px] text-amber-50 leading-relaxed font-medium">
                        You have an incomplete attendance record from a previous shift. Please complete your missing clock-out before starting a new shift.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {missingClockOutRecords.map(rec => {
                      const currentInput = manualClockOutInputs[rec.id] || {
                        date: '',
                        hour: '',
                        minute: '',
                        period: '',
                        reason: '',
                      };
                      const fieldError = manualClockOutErrors[rec.id];
                      const isConfirming = pendingManualConfirmation?.recordId === rec.id;

                      const englishWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      const englishMonths = [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                      ];
                      const dateOptions: { value: string; label: string }[] = [];
                      const startParts = rec.date.split('-').map(Number);
                      const endParts = todayDateStr.split('-').map(Number);
                      if (startParts.length === 3 && endParts.length === 3) {
                        const cursor = new Date(startParts[0], startParts[1] - 1, startParts[2]);
                        const endDt = new Date(endParts[0], endParts[1] - 1, endParts[2]);
                        let guard = 0;
                        while (cursor <= endDt && guard < 90) {
                          const val = formatLocalDate(cursor);
                          const wd = englishWeekdays[cursor.getDay()];
                          const mo = englishMonths[cursor.getMonth()];
                          const dy = cursor.getDate();
                          const yr = cursor.getFullYear();
                          const tag =
                            val === rec.date
                              ? ' (Shift Start Date)'
                              : val === todayDateStr
                              ? ' (Today)'
                              : '';
                          dateOptions.push({
                            value: val,
                            label: `${wd}, ${mo} ${dy}, ${yr}${tag}`,
                          });
                          cursor.setDate(cursor.getDate() + 1);
                          guard += 1;
                        }
                      }

                      return (
                        <div
                          key={rec.id}
                          className="p-4 sm:p-5 rounded-xl bg-[#0B1F3A]/90 border border-amber-300/35 space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sky-300/15">
                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold text-amber-200 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>Original Clock-In Record</span>
                              </div>
                              <div className="text-[18px] font-mono tabular-nums font-bold text-white">
                                {rec.date} at {rec.checkInTime}
                              </div>
                            </div>
                            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-400/20 text-amber-200 border border-amber-300/40">
                              Missing Clock-Out
                            </span>
                          </div>

                          {isConfirming && pendingManualConfirmation ? (
                            <div className="p-4 rounded-xl bg-[#112A4D] border border-sky-300/40 space-y-4">
                              <div className="text-base font-bold text-white">
                                Confirm Your Clock-Out Details
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div className="p-3 rounded-lg bg-[#0B1F3A]/80 border border-sky-300/20">
                                  <div className="text-sky-200">Original Clock-In</div>
                                  <div className="font-mono font-bold text-white mt-0.5">
                                    {rec.date} · {rec.checkInTime}
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-[#0B1F3A]/80 border border-sky-300/20">
                                  <div className="text-sky-200">Selected Clock-Out</div>
                                  <div className="font-mono font-bold text-emerald-300 mt-0.5">
                                    {pendingManualConfirmation.selectedDate} ·{' '}
                                    {pendingManualConfirmation.formattedTime12h}
                                    {pendingManualConfirmation.isOvernight ? ' (+1d)' : ''}
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-[#0B1F3A]/80 border border-sky-300/20">
                                  <div className="text-sky-200">Shift Duration</div>
                                  <div className="font-mono font-bold text-white mt-0.5">
                                    {pendingManualConfirmation.calculatedDuration}
                                  </div>
                                </div>
                              </div>
                              {pendingManualConfirmation.reasonNote && (
                                <div className="p-3 rounded-lg bg-[#0B1F3A]/80 border border-sky-300/20 text-sm">
                                  <div className="text-sky-200">Reason Note</div>
                                  <div className="text-white mt-0.5 leading-relaxed">
                                    {pendingManualConfirmation.reasonNote}
                                  </div>
                                </div>
                              )}
                              <p className="text-sm text-sky-200">
                                This manual clock-out entry will be marked for manager review alongside your original clock-in record.
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleConfirmManualClockOut(rec)}
                                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 text-base font-extrabold text-[#0B1F3A] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Confirm &amp; Save Clock-Out</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPendingManualConfirmation(null)}
                                  className="inline-flex items-center justify-center min-h-[48px] px-5 text-base font-semibold text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 border border-sky-300/30 rounded-xl transition-colors cursor-pointer"
                                >
                                  Edit Time
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label
                                    htmlFor={`manual-out-date-${rec.id}`}
                                    className="block text-sm font-semibold text-sky-100"
                                  >
                                    Actual Clock-Out Date
                                  </label>
                                  <select
                                    id={`manual-out-date-${rec.id}`}
                                    value={currentInput.date}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setManualClockOutInputs(prev => ({
                                        ...prev,
                                        [rec.id]: {
                                          ...(prev[rec.id] || {
                                            date: '',
                                            hour: '',
                                            minute: '',
                                            period: '',
                                            reason: '',
                                          }),
                                          date: val,
                                        },
                                      }));
                                      setManualClockOutErrors(prev => {
                                        const next = { ...prev };
                                        delete next[rec.id];
                                        return next;
                                      });
                                    }}
                                    className="w-full h-12 px-3.5 text-base text-white bg-[#112A4D] focus:bg-[#163663] border border-sky-300/35 focus:border-sky-300 rounded-xl focus:outline-none cursor-pointer"
                                  >
                                    <option value="" className="bg-[#0B1F3A] text-slate-300">
                                      Select clock-out date
                                    </option>
                                    {dateOptions.map(opt => (
                                      <option
                                        key={opt.value}
                                        value={opt.value}
                                        className="bg-[#0B1F3A] text-white"
                                      >
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="block text-sm font-semibold text-sky-100">
                                    Actual Clock-Out Time
                                  </span>
                                  <div className="grid grid-cols-3 gap-2">
                                    <select
                                      id={`manual-out-hour-${rec.id}`}
                                      aria-label="Clock-Out Hour"
                                      value={currentInput.hour}
                                      onChange={e => {
                                        const val = e.target.value;
                                        setManualClockOutInputs(prev => ({
                                          ...prev,
                                          [rec.id]: {
                                            ...(prev[rec.id] || {
                                              date: '',
                                              hour: '',
                                              minute: '',
                                              period: '',
                                              reason: '',
                                            }),
                                            hour: val,
                                          },
                                        }));
                                        setManualClockOutErrors(prev => {
                                          const next = { ...prev };
                                          delete next[rec.id];
                                          return next;
                                        });
                                      }}
                                      className="w-full h-12 px-2.5 text-base font-mono text-white bg-[#112A4D] focus:bg-[#163663] border border-sky-300/35 focus:border-sky-300 rounded-xl focus:outline-none cursor-pointer"
                                    >
                                      <option value="" className="bg-[#0B1F3A] text-slate-300">
                                        Hour
                                      </option>
                                      {Array.from({ length: 12 }, (_, idx) => {
                                        const h = String(idx + 1).padStart(2, '0');
                                        return (
                                          <option
                                            key={h}
                                            value={h}
                                            className="bg-[#0B1F3A] text-white"
                                          >
                                            {h}
                                          </option>
                                        );
                                      })}
                                    </select>

                                    <select
                                      id={`manual-out-minute-${rec.id}`}
                                      aria-label="Clock-Out Minute"
                                      value={currentInput.minute}
                                      onChange={e => {
                                        const val = e.target.value;
                                        setManualClockOutInputs(prev => ({
                                          ...prev,
                                          [rec.id]: {
                                            ...(prev[rec.id] || {
                                              date: '',
                                              hour: '',
                                              minute: '',
                                              period: '',
                                              reason: '',
                                            }),
                                            minute: val,
                                          },
                                        }));
                                        setManualClockOutErrors(prev => {
                                          const next = { ...prev };
                                          delete next[rec.id];
                                          return next;
                                        });
                                      }}
                                      className="w-full h-12 px-2.5 text-base font-mono text-white bg-[#112A4D] focus:bg-[#163663] border border-sky-300/35 focus:border-sky-300 rounded-xl focus:outline-none cursor-pointer"
                                    >
                                      <option value="" className="bg-[#0B1F3A] text-slate-300">
                                        Min
                                      </option>
                                      {Array.from({ length: 60 }, (_, idx) => {
                                        const m = String(idx).padStart(2, '0');
                                        return (
                                          <option
                                            key={m}
                                            value={m}
                                            className="bg-[#0B1F3A] text-white"
                                          >
                                            {m}
                                          </option>
                                        );
                                      })}
                                    </select>

                                    <select
                                      id={`manual-out-period-${rec.id}`}
                                      aria-label="Clock-Out AM or PM"
                                      value={currentInput.period}
                                      onChange={e => {
                                        const val = e.target.value;
                                        setManualClockOutInputs(prev => ({
                                          ...prev,
                                          [rec.id]: {
                                            ...(prev[rec.id] || {
                                              date: '',
                                              hour: '',
                                              minute: '',
                                              period: '',
                                              reason: '',
                                            }),
                                            period: val,
                                          },
                                        }));
                                        setManualClockOutErrors(prev => {
                                          const next = { ...prev };
                                          delete next[rec.id];
                                          return next;
                                        });
                                      }}
                                      className="w-full h-12 px-2.5 text-base font-semibold text-white bg-[#112A4D] focus:bg-[#163663] border border-sky-300/35 focus:border-sky-300 rounded-xl focus:outline-none cursor-pointer"
                                    >
                                      <option value="" className="bg-[#0B1F3A] text-slate-300">
                                        AM/PM
                                      </option>
                                      <option value="AM" className="bg-[#0B1F3A] text-white">
                                        AM
                                      </option>
                                      <option value="PM" className="bg-[#0B1F3A] text-white">
                                        PM
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label
                                  htmlFor={`manual-out-reason-${rec.id}`}
                                  className="block text-sm font-semibold text-sky-100"
                                >
                                  Reason Note <span className="text-sky-300/80 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                  id={`manual-out-reason-${rec.id}`}
                                  rows={2}
                                  maxLength={300}
                                  value={currentInput.reason}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setManualClockOutInputs(prev => ({
                                      ...prev,
                                      [rec.id]: {
                                        ...(prev[rec.id] || {
                                          date: '',
                                          hour: '',
                                          minute: '',
                                          period: '',
                                          reason: '',
                                        }),
                                        reason: val,
                                      },
                                    }));
                                  }}
                                  placeholder="Briefly state the reason you missed clocking out (e.g., stepped straight into a client call)."
                                  className="w-full px-3.5 py-2.5 text-sm sm:text-base text-white placeholder:text-slate-400 bg-[#112A4D] focus:bg-[#163663] border border-sky-300/35 focus:border-sky-300 rounded-xl focus:outline-none resize-y"
                                />
                              </div>

                              {fieldError && (
                                <div
                                  role="alert"
                                  className="p-3 rounded-xl bg-red-950/80 border border-red-400/50 flex items-start gap-2.5 text-sm text-red-100 font-medium"
                                >
                                  <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                                  <span>{fieldError}</span>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs text-sky-200/80">
                                  Select the exact date and time you ended that shift (not current time).
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleReviewManualClockOut(rec)}
                                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 text-base font-extrabold text-[#0B1F3A] bg-amber-300 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                                >
                                  <Clock className="w-4 h-4" />
                                  <span>Review &amp; Confirm Clock-Out</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Current Attendance Status */}
              <div className="p-5 rounded-2xl bg-[#0B1F3A]/75 border border-sky-300/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {isRegisteredToday ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-6 h-6 text-sky-300 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="text-[20px] font-bold text-white">
                      {isRegisteredToday
                        ? hasClockedOutToday
                          ? 'Shift Completed (Clocked In & Out)'
                          : activeOpenShift && activeOpenShift.date !== todayDateStr
                          ? `Overnight Shift In Progress (${activeOpenShift.date})`
                          : 'Attendance Recorded for Today (In Progress)'
                        : 'Not Clocked In Yet Today'}
                    </div>
                    <div className="text-[18px] text-sky-200 tabular-nums">
                      {displayShiftRecord
                        ? `Clock-In: ${displayShiftRecord.checkInTime}${
                            displayShiftRecord.checkOutTime
                              ? ` · Clock-Out: ${displayShiftRecord.checkOutTime} (${getShiftStatusInfo(displayShiftRecord).totalHoursFormatted})`
                              : ' · Clock-Out: In Progress'
                          } · Status: ${
                            getAttendanceStatusDisplay(displayShiftRecord.attendanceStatus).label
                          }`
                        : 'Select "Clock In" above to record your shift arrival time.'}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 space-y-0.5">
                  <div className="text-[18px] font-mono tabular-nums text-sky-200">
                    Recorded Attendance Days:{' '}
                    <strong className="text-white">
                      {recordedAttendanceDays} {recordedAttendanceDays === 1 ? 'Day' : 'Days'}
                    </strong>
                  </div>
                  <div className="text-xs text-sky-200/75">
                    Unscheduled days are not counted as missed
                  </div>
                </div>
              </div>

              {/* Own Attendance History */}
              <div className="space-y-3">
                <h3 className="text-[18px] font-bold text-sky-100">Your Recent Attendance History</h3>
                {recentAttendance.length === 0 ? (
                  <div className="py-6 text-center text-sky-200/70 text-[18px] bg-[#0B1F3A]/50 rounded-2xl border border-dashed border-sky-300/20">
                    No attendance records logged yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-sky-300/20 rounded-2xl bg-[#0B1F3A]/60">
                    <table className="w-full text-left text-base">
                      <thead className="border-b border-sky-300/15 text-sky-200 font-semibold text-sm">
                        <tr>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Clock-In</th>
                          <th className="py-3 px-4">Clock-Out</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Attendance Status</th>
                          <th className="py-3 px-4">Quiz Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-300/10">
                        {recentAttendance.map(rec => {
                          const shiftInfo = getShiftStatusInfo(rec);
                          const statusDisplay = getAttendanceStatusDisplay(rec.attendanceStatus);
                          return (
                            <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono tabular-nums text-sky-100">
                                {rec.date}
                              </td>
                              <td className="py-3 px-4 font-mono tabular-nums text-white font-semibold">
                                {rec.checkInTime}
                              </td>
                              <td className="py-3 px-4 font-mono tabular-nums text-sky-200">
                                {rec.checkOutTime ? (
                                  <>
                                    {rec.checkOutTime}
                                    {shiftInfo.isOvernight && (
                                      <span className="text-xs text-sky-300 font-semibold ml-1">
                                        (+1d)
                                      </span>
                                    )}
                                    {rec.clockOutSource === 'manual_correction' && (
                                      <>
                                        <span className="block text-xs font-sans text-emerald-300 font-medium">
                                          Shift Completed · Manually Entered
                                        </span>
                                        {rec.manualClockOutReason && (
                                          <span className="block text-xs font-sans text-sky-200/85 mt-0.5 max-w-xs whitespace-normal">
                                            Reason: {rec.manualClockOutReason}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </>
                                ) : shiftInfo.state === 'in_progress' ? (
                                  'In Progress'
                                ) : (
                                  'Missing Clock-Out'
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono tabular-nums text-sky-100">
                                {shiftInfo.totalHoursFormatted}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-semibold ${statusDisplay.colorClass}`}>
                                  {statusDisplay.label}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {rec.optionalActivityCompleted === 'mixed_quiz' ? (
                                  <span className="text-sky-300 font-semibold">Completed</span>
                                ) : (
                                  <span className="text-slate-300">Not Participated</span>
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
            </section>
          </>
        )}
      </main>
    </div>
  );
};
