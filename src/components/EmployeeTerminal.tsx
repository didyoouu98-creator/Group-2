import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, Clock, Zap, Calendar, UserCheck, Plus, RefreshCw, Trophy } from 'lucide-react';
import { Employee, AttendanceRecord, Department } from '../types';
import { WordGuessGame } from './WordGuessGame';
import { AttendanceSuccessModal } from './AttendanceSuccessModal';
import { addNewEmployee } from '../services/attendanceStorage';

interface EmployeeTerminalProps {
  employees: Employee[];
  records: AttendanceRecord[];
  onAttendanceRegistered: (employeeId: string, stats: any) => AttendanceRecord | void;
  onRefreshData: () => void;
  onSwitchToManager: () => void;
}

export const EmployeeTerminal: React.FC<EmployeeTerminalProps> = ({
  employees,
  records,
  onAttendanceRegistered,
  onRefreshData,
  onSwitchToManager,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[2]?.id || employees[0]?.id);
  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);
  const [latestRegisteredRecord, setLatestRegisteredRecord] = useState<AttendanceRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Employee Form State
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [newDept, setNewDept] = useState<Department>('General Accounting');

  const currentEmployee = employees.find(e => e.id === selectedEmployeeId) || employees[0];

  // Today's record for this employee (if any)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(r => r.employeeId === currentEmployee.id && r.date === todayDateStr);
  const isRegisteredToday = Boolean(todayRecord || currentEmployee.isRegisteredToday);

  // Recent attendance history for this employee
  const employeeHistory = records
    .filter(r => r.employeeId === currentEmployee.id)
    .slice(0, 5);

  const handleGameFinished = (stats: any) => {
    setIsPlayingGame(false);
    const created = onAttendanceRegistered(currentEmployee.id, stats);
    if (created) {
      setLatestRegisteredRecord(created);
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newRole.trim()) return;

    addNewEmployee(newName.trim(), newEmail.trim(), newRole.trim(), newDept);
    onRefreshData();
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewRole('');
  };

  if (isPlayingGame) {
    return (
      <div className="py-8 px-4">
        <WordGuessGame
          employee={currentEmployee}
          onAttendanceCompleted={handleGameFinished}
          onCancel={() => setIsPlayingGame(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Success Modal Triggered after Attendance Registration */}
      {latestRegisteredRecord && (
        <AttendanceSuccessModal
          record={latestRegisteredRecord}
          employee={currentEmployee}
          onClose={() => setLatestRegisteredRecord(null)}
          onGoToManagerView={() => {
            setLatestRegisteredRecord(null);
            onSwitchToManager();
          }}
        />
      )}

      {/* Terminal Hero & Employee Active Bar */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        {/* Architectural Office Header Scrim */}
        <div className="h-44 md:h-52 relative w-full overflow-hidden bg-slate-900">
          <img
            src="/src/assets/images/office_workspace_banner_1793666752945.jpg"
            alt="Workplace Banner"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                Accounting Staff Daily Attendance Terminal
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                VerbaShift Accountant Check-In
              </h1>
            </div>

            {/* Quick Switch Employee Selector */}
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <span className="text-xs text-slate-300 font-medium pl-2">Active Employee:</span>
              <select
                value={selectedEmployeeId}
                onChange={e => setSelectedEmployeeId(e.target.value)}
                className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department}) {emp.isRegisteredToday ? '✓ Present' : '⏳ Pending'}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors"
                title="Add New Employee"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Employee Summary Card */}
        <div className="p-6 md:p-8 bg-white grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              {currentEmployee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{currentEmployee.name}</h2>
                <span className="text-xs text-slate-500 font-medium">· {currentEmployee.department}</span>
              </div>
              <p className="text-xs text-slate-500">{currentEmployee.role}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                <span>Streak: <strong className="text-slate-900 font-mono tabular-nums">{currentEmployee.attendanceStreak} days</strong></span>
                <span>·</span>
                <span>Avg Agility: <strong className="text-slate-900 font-mono tabular-nums">{currentEmployee.averageWpm || 52} WPM</strong></span>
              </div>
            </div>
          </div>

          {/* Today's Registration Status Banner */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                {isRegisteredToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Attendance Successfully Registered Today
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Daily Check-In Required
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-1">
                {isRegisteredToday
                  ? todayRecord
                    ? `Clocked in at ${todayRecord.checkInTime} · Score: ${todayRecord.gameStats.score} pts (${todayRecord.gameStats.cognitiveRating})`
                    : 'Attendance registered for today.'
                  : 'Play the 2-minute accounting skills & ethics challenge to register your attendance and clock in.'}
              </p>
            </div>

            {/* Main Action Button */}
            <div>
              {isRegisteredToday ? (
                <button
                  onClick={() => setIsPlayingGame(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Practice Warmup Again</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPlayingGame(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start 2-Min Accounting Check-In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Quick Roster Status & Personal History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Team Status Overview Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Accounting Team Status</h3>
              <p className="text-xs text-slate-500">Click any employee to switch profile</p>
            </div>
            <span className="text-xs font-bold font-mono tabular-nums text-slate-600">
              {employees.filter(e => e.isRegisteredToday).length} / {employees.length}
            </span>
          </div>

          <div className="space-y-2">
            {employees.map(emp => {
              const isSelected = emp.id === currentEmployee.id;
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployeeId(emp.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 truncate">{emp.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{emp.department}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {emp.isRegisteredToday ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Present
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Employee's Recent Attendance Log */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentEmployee.name}'s Recent Attendance & Practice History
              </h3>
              <p className="text-xs text-slate-500">Verified 2-minute accounting proficiency sessions</p>
            </div>
            <button
              onClick={onSwitchToManager}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View Full Team Analytics →
            </button>
          </div>

          {employeeHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No previous attendance records found for this employee.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Check-In Time</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Game Score</th>
                    <th className="py-2.5 px-3 text-right">Solved</th>
                    <th className="py-2.5 px-3 text-right">Agility</th>
                    <th className="py-2.5 px-3">Cognitive Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employeeHistory.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{rec.date}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-900">{rec.checkInTime}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          rec.attendanceStatus === 'ON_TIME'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {rec.attendanceStatus === 'ON_TIME' ? 'On-Time' : 'Late'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {rec.gameStats.score}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        {rec.gameStats.wordsSolved}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        {rec.gameStats.wpm} WPM
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        {rec.gameStats.cognitiveRating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Accounting Team Member</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Rivera, CPA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="e.g. jordan.r@accounting.firm"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="e.g. Senior Tax Accountant"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={e => setNewDept(e.target.value as Department)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-indigo-600 focus:outline-none"
                >
                  <option value="General Accounting">General Accounting</option>
                  <option value="Audit & Assurance">Audit & Assurance</option>
                  <option value="Tax & Compliance">Tax & Compliance</option>
                  <option value="Financial Planning & Analysis">Financial Planning & Analysis</option>
                  <option value="Accounts Payable & Receivable">Accounts Payable & Receivable</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-colors"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
