import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmployeeTerminal } from './components/EmployeeTerminal';
import { ManagerDashboard } from './components/ManagerDashboard';
import { RulesModal } from './components/RulesModal';
import { 
  loadEmployees, 
  loadRecords, 
  registerAttendance, 
  resetDemoData 
} from './services/attendanceStorage';
import { Employee, AttendanceRecord, ViewMode, GameStats } from './types';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('terminal');
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize and load persistent data
  const refreshData = () => {
    const emps = loadEmployees();
    const recs = loadRecords();
    setEmployees(emps);
    setRecords(recs);
  };

  useEffect(() => {
    refreshData();
    setIsInitialized(true);
  }, []);

  const handleAttendanceRegistered = (employeeId: string, gameStats: GameStats) => {
    const { record } = registerAttendance(employeeId, gameStats);
    refreshData();
    return record;
  };

  const handleResetDemo = () => {
    const { employees: newEmps, records: newRecs } = resetDemoData();
    setEmployees(newEmps);
    setRecords(newRecs);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xs font-semibold text-slate-500 animate-pulse font-mono">
          Loading VerbaShift Terminal...
        </div>
      </div>
    );
  }

  const pendingCount = employees.filter(e => !e.isRegisteredToday).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Strict Top Bar Contract Navigation */}
      <Header
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
        onOpenRules={() => setShowRulesModal(true)}
        pendingCheckInsCount={pendingCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentView === 'terminal' ? (
          <EmployeeTerminal
            employees={employees}
            records={records}
            onAttendanceRegistered={handleAttendanceRegistered}
            onRefreshData={refreshData}
            onSwitchToManager={() => setCurrentView('manager')}
          />
        ) : (
          <ManagerDashboard
            employees={employees}
            records={records}
            onRefreshData={refreshData}
            onResetDemoData={handleResetDemo}
          />
        )}
      </main>

      {/* Rules & Protocol Information Modal */}
      {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}

      {/* Quiet Corporate Footer adhering to §1.B */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">VerbaShift Attendance Hub</span>
            <span aria-hidden="true">·</span>
            <span>2-Minute Cognitive Word Protocol v1.4</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Punctuality & Readiness</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowRulesModal(true)}
              className="hover:text-slate-700 transition-colors"
            >
              System Guidelines
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleResetDemo}
              className="hover:text-slate-700 transition-colors"
            >
              Reset Demo Records
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
