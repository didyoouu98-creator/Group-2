import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Header } from './components/Header';
import { EmployeeTerminal } from './components/EmployeeTerminal';
import { ManagerDashboard } from './components/ManagerDashboard';
import { RulesModal } from './components/RulesModal';
import {
  authenticateEmployeeAccount,
  authorizeManagerAccount,
  getEmployeePortalData,
  getAuthorizedManagerData,
  quickClockIn,
  quickClockOut,
  submitManualClockOut,
  recordSkippedQuiz,
  saveMissedQuizFeedback,
  redeemBenefit,
  updateRedemptionStatus,
  toggleEmployeeQuizEligibility,
  logManagerFollowUp,
  confirmManagerCheckInCompleted,
  recordCompletedQuizSession,
  resetDemoData,
} from './services/attendanceStorage';
import {
  AuthSession,
  EmployeePortalScope,
  AuthorizedManagerScope,
  ViewMode,
  QuizSessionRecord,
  MissedQuizFeedback,
} from './types';

export default function App() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [employeeScope, setEmployeeScope] = useState<EmployeePortalScope | null>(null);
  const [managerScope, setManagerScope] = useState<AuthorizedManagerScope | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('terminal');
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Manager Authorization Gate Form State
  const [managerCodeInput, setManagerCodeInput] = useState<string>('');
  const [showManagerCode, setShowManagerCode] = useState<boolean>(false);
  const [managerAuthError, setManagerAuthError] = useState<string | null>(null);

  // Refresh only the currently authorized scope from underlying storage
  const refreshData = (overrideSession?: AuthSession | null) => {
    const activeSession = overrideSession !== undefined ? overrideSession : authSession;

    if (!activeSession) {
      setEmployeeScope(null);
      setManagerScope(null);
      return;
    }

    if (activeSession.role === 'employee') {
      try {
        setEmployeeScope(getEmployeePortalData(activeSession));
        setManagerScope(null);
      } catch {
        setEmployeeScope(null);
      }
    } else if (activeSession.role === 'manager') {
      try {
        setManagerScope(getAuthorizedManagerData(activeSession));
        setEmployeeScope(null);
      } catch {
        setManagerScope(null);
      }
    }
  };

  const handleNavigate = (view: ViewMode) => {
    setManagerAuthError(null);
    setShowManagerCode(false);
    if (view === 'terminal' && authSession?.role === 'manager') {
      setAuthSession(null);
      setManagerScope(null);
      setEmployeeScope(null);
    } else if (view === 'manager' && authSession?.role === 'employee') {
      setAuthSession(null);
      setEmployeeScope(null);
      setManagerScope(null);
    }
    setCurrentView(view);
  };

  // Employee Authentication & Scoped Actions
  const handleSignInEmployee = (employeeId: string) => {
    const { session } = authenticateEmployeeAccount(employeeId);
    setAuthSession(session);
    refreshData(session);
  };

  const handleSignOutEmployee = () => {
    setAuthSession(null);
    setEmployeeScope(null);
  };

  const handleDirectClockIn = (employeeId: string) => {
    const { record } = quickClockIn(employeeId, authSession || undefined);
    refreshData();
    return record;
  };

  const handleDirectClockOut = (employeeId: string) => {
    const { record } = quickClockOut(employeeId, authSession || undefined);
    refreshData();
    return record;
  };

  const handleManualClockOut = (
    employeeId: string,
    recordId: string,
    selectedDate: string,
    selectedTime: string,
    reasonNote?: string
  ) => {
    const { record } = submitManualClockOut(
      employeeId,
      recordId,
      selectedDate,
      selectedTime,
      authSession || undefined,
      reasonNote
    );
    refreshData();
    return record;
  };

  const handleSkipQuiz = (employeeId: string, recordId?: string) => {
    const result = recordSkippedQuiz(employeeId, recordId, authSession || undefined);
    refreshData();
    return result;
  };

  const handleSubmitMissedSurvey = (feedback: MissedQuizFeedback) => {
    saveMissedQuizFeedback(feedback, authSession || undefined);
    refreshData();
  };

  const handleRedeemBenefit = (employeeId: string, benefitId: string) => {
    redeemBenefit(employeeId, benefitId, authSession || undefined);
    refreshData();
  };

  const handleQuizCompleted = (session: QuizSessionRecord) => {
    recordCompletedQuizSession(session, authSession || undefined);
    refreshData();
  };

  // Manager Authorization & Scoped Actions
  const handleAuthorizeManager = (e: React.FormEvent) => {
    e.preventDefault();
    setManagerAuthError(null);
    try {
      const session = authorizeManagerAccount(managerCodeInput);
      setAuthSession(session);
      setManagerCodeInput('');
      setShowManagerCode(false);
      refreshData(session);
    } catch {
      setManagerAuthError('Invalid Manager Access Code. Use demo code "MGR-001".');
    }
  };

  const handleUpdateRedemptionStatus = (
    redemptionId: string,
    status: 'Approved' | 'Pending Manager Fulfillment'
  ) => {
    updateRedemptionStatus(redemptionId, status, authSession || undefined);
    refreshData();
  };

  const handleToggleEligibility = (employeeId: string) => {
    toggleEmployeeQuizEligibility(employeeId, authSession || undefined);
    refreshData();
  };

  const handleLogFollowUp = (employeeId: string, note: string) => {
    logManagerFollowUp(employeeId, note, authSession || undefined);
    refreshData();
  };

  const handleConfirmCheckInCompleted = (employeeId: string) => {
    confirmManagerCheckInCompleted(employeeId, authSession || undefined);
    refreshData();
  };

  const handleResetDemo = () => {
    resetDemoData();
    refreshData();
  };

  const isAuthorizedManagerView =
    currentView === 'manager' && authSession?.role === 'manager' && Boolean(managerScope);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${
        isAuthorizedManagerView ? 'bg-slate-50 text-slate-900' : 'bg-[#0B1F3A] text-white'
      }`}
    >
      {/* Show Management Header only on Authorized Manager Portal */}
      {isAuthorizedManagerView && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenRules={() => setShowRulesModal(true)}
          onResetDemo={handleResetDemo}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'terminal' ? (
          <EmployeeTerminal
            employeeScope={employeeScope}
            onSignInEmployee={handleSignInEmployee}
            onSignOutEmployee={handleSignOutEmployee}
            onOpenManagerLogin={() => handleNavigate('manager')}
            onDirectClockIn={handleDirectClockIn}
            onDirectClockOut={handleDirectClockOut}
            onManualClockOut={handleManualClockOut}
            onSkipQuiz={handleSkipQuiz}
            onSubmitMissedSurvey={handleSubmitMissedSurvey}
            onRedeemBenefit={handleRedeemBenefit}
            onQuizCompleted={handleQuizCompleted}
            onRefreshData={() => refreshData()}
          />
        ) : isAuthorizedManagerView && managerScope ? (
          <div className="pb-16">
            <ManagerDashboard
              employees={managerScope.employees}
              records={managerScope.records}
              quizSessions={managerScope.quizSessions}
              missedFeedbacks={managerScope.missedFeedbacks}
              redemptions={managerScope.redemptions}
              onToggleEligibility={handleToggleEligibility}
              onLogFollowUp={handleLogFollowUp}
              onConfirmCheckInCompleted={handleConfirmCheckInCompleted}
              onUpdateRedemptionStatus={handleUpdateRedemptionStatus}
              onRefreshData={() => refreshData()}
              onResetDemoData={handleResetDemo}
            />
          </div>
        ) : (
          <div className="min-h-screen bg-[#0B1F3A] text-white flex flex-col justify-between px-4 py-10 sm:py-14">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md bg-[#112A4D] border border-sky-300/25 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-sky-400/15 border-2 border-sky-300/40 text-white flex items-center justify-center font-extrabold text-xl tracking-tight mx-auto">
                    L&amp;D
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sky-300 text-sm font-semibold pt-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorized Access Only</span>
                  </div>
                  <h1 className="text-[28px] font-extrabold text-white tracking-tight">
                    Manager Portal Sign-In
                  </h1>
                  <p className="text-base text-sky-200 leading-relaxed">
                    Full staff records, analytics, training recommendations, and private check-in notes require manager authorization.
                  </p>
                </div>

                <form onSubmit={handleAuthorizeManager} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="manager-access-code"
                      className="block text-base font-semibold text-sky-200"
                    >
                      Manager Access Code
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-5 h-5 text-sky-300/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="manager-access-code"
                        type={showManagerCode ? 'text' : 'password'}
                        value={managerCodeInput}
                        onChange={e => {
                          setManagerCodeInput(e.target.value);
                          setManagerAuthError(null);
                        }}
                        placeholder="Enter access code"
                        autoComplete="off"
                        className="w-full h-14 pl-12 pr-14 text-lg font-mono text-white placeholder:text-slate-400 bg-white/10 focus:bg-white/15 border-2 border-sky-300/40 focus:border-sky-300 rounded-2xl focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowManagerCode(prev => !prev)}
                        aria-label={
                          showManagerCode
                            ? 'Hide Manager Access Code'
                            : 'Show Manager Access Code'
                        }
                        aria-pressed={showManagerCode}
                        title={
                          showManagerCode
                            ? 'Hide Manager Access Code'
                            : 'Show Manager Access Code'
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-sky-200/85 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300/60 transition-colors cursor-pointer"
                      >
                        {showManagerCode ? (
                          <EyeOff className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <Eye className="w-5 h-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {managerAuthError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-red-950/75 border border-red-400/50 flex items-start gap-2.5 text-sm text-red-100 font-medium"
                    >
                      <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                      <span>{managerAuthError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full min-h-[60px] px-5 text-lg font-extrabold text-[#0B1F3A] bg-sky-400 hover:bg-sky-300 rounded-2xl transition-colors shadow-lg cursor-pointer"
                  >
                    Authorize Manager Portal
                  </button>
                </form>
              </div>
            </div>

            <footer className="pt-8 text-center">
              <button
                type="button"
                onClick={() => handleNavigate('terminal')}
                className="text-sm font-medium text-sky-300/80 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                Back to Employee Login
              </button>
            </footer>
          </div>
        )}
      </main>

      {/* L&D System Governance & Protocol Information Modal */}
      {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}

      {/* Corporate / Institutional System Footer on Authorized Manager Portal */}
      {isAuthorizedManagerView && (
        <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900">
                Enterprise L&amp;D Management System
              </span>
              <span aria-hidden="true">·</span>
              <span>Continuous Workplace Skill Building &amp; Decision Support</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Fictional Demo Environment</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="hover:text-slate-700 transition-colors cursor-pointer"
              >
                L&amp;D Governance Protocol
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={handleResetDemo}
                className="hover:text-slate-700 transition-colors cursor-pointer"
              >
                Reset Demo Records
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
