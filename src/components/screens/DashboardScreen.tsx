import React from 'react';
import {
  Users,
  BookOpen,
  Wallet,
  AlertCircle,
  CalendarCheck,
  ArrowRight,
  Plus,
  CreditCard,
  UserPlus,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const DashboardScreen: React.FC = () => {
  const {
    students,
    classes,
    payments,
    attendanceRecords,
    getStudentFeeSummary,
    setCurrentScreen,
    viewStudentDetails,
    navigateToCollectFee,
    navigateToAddStudent,
    setActiveReceipt,
    settings
  } = useSchool();

  // Dynamic calculations
  const activeStudents = students.filter((s) => s.status === 'Active');
  const activeClasses = classes.filter((c) => c.status === 'Active');

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  // Total pending calculated across all active students
  let totalPending = 0;
  const studentsWithDues = activeStudents
    .map((stu) => {
      const summary = getStudentFeeSummary(stu.id);
      return {
        student: stu,
        ...summary
      };
    })
    .filter((s) => s.pendingAmount > 0);

  studentsWithDues.forEach((s) => {
    totalPending += s.pendingAmount;
  });

  // Today's attendance calculation (for default today: 2026-09-23)
  const todayStr = '2026-09-23';
  const todayAttendance = attendanceRecords.filter((a) => a.date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'Present').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'Absent').length;
  const attendanceTotal = todayAttendance.length > 0 ? todayAttendance.length : activeStudents.length;
  const calculatedPresent = todayAttendance.length > 0 ? presentCount : Math.round(activeStudents.length * 0.92);
  const calculatedAbsent = todayAttendance.length > 0 ? absentCount : activeStudents.length - calculatedPresent;
  const attendancePercent = Math.round((calculatedPresent / (attendanceTotal || 1)) * 100);

  // Recent payments (latest 5)
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Top pending dues (latest 5)
  const topPending = [...studentsWithDues]
    .sort((a, b) => b.pendingAmount - a.pendingAmount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Good Morning, Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening at {settings.schoolName} today.
          </p>
        </div>

        {/* Quick Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setCurrentScreen('attendance')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Mark Today's Attendance</span>
          </button>
          <button
            onClick={() => navigateToCollectFee()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>+ Collect Fee</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Students
              </p>
              <h3 className="font-display font-bold text-2xl text-slate-900 mt-1.5 tabular-nums">
                {activeStudents.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +6 this month
            </span>
            <button
              onClick={() => setCurrentScreen('students')}
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              View directory &rarr;
            </button>
          </div>
        </div>

        {/* KPI 2: Total Classes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Classes
              </p>
              <h3 className="font-display font-bold text-2xl text-slate-900 mt-1.5 tabular-nums">
                {activeClasses.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">All active for AY {settings.academicYear}</span>
            <button
              onClick={() => setCurrentScreen('classes')}
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        {/* KPI 3: Fees Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Fees Collected
              </p>
              <h3 className="font-display font-bold text-2xl text-slate-900 mt-1.5 tabular-nums">
                {settings.currency}
                {totalCollected.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">{payments.length} verified receipts</span>
            <button
              onClick={() => setCurrentScreen('payments')}
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              Ledger &rarr;
            </button>
          </div>
        </div>

        {/* KPI 4: Pending Fees */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Pending Fees
              </p>
              <h3 className="font-display font-bold text-2xl text-amber-600 mt-1.5 tabular-nums">
                {settings.currency}
                {totalPending.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-medium">
              {studentsWithDues.length} students with dues
            </span>
            <button
              onClick={() => setCurrentScreen('pending-fees')}
              className="text-amber-700 font-semibold hover:underline"
            >
              Collect &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Today's Attendance Overview Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-slate-900">
                Today's Attendance
              </h2>
              <span className="text-xs font-medium text-slate-400">({todayStr})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Morning student roll call status across all sections
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Present:</span>
              <span className="font-bold text-slate-900 tabular-nums">{calculatedPresent}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 font-medium">Absent:</span>
              <span className="font-bold text-slate-900 tabular-nums">{calculatedAbsent}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Total:</span>
              <span className="font-semibold text-slate-700 tabular-nums">{attendanceTotal}</span>
            </div>
            <button
              onClick={() => setCurrentScreen('attendance')}
              className="ml-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Take Attendance
            </button>
          </div>
        </div>

        {/* Compact visual progress indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">
              {attendancePercent}% Attendance Rate
            </span>
            <span className="text-slate-400">
              {calculatedPresent} of {attendanceTotal} enrolled students present today
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
              style={{ width: `${attendancePercent}%` }}
              title={`Present: ${attendancePercent}%`}
            />
            <div
              className="bg-rose-400 h-full rounded-r-full transition-all duration-500"
              style={{ width: `${100 - attendancePercent}%` }}
              title={`Absent: ${100 - attendancePercent}%`}
            />
          </div>
        </div>
      </div>

      {/* Main Split: Recent Payments (Left 60%) & Pending Fees (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Payments Table (Col span 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Recent Payments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest verified fee receipts collected at counter and online
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('payments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{payment.studentName}</span>
                        <span className="text-[11px] text-slate-400">
                          {payment.className} • {payment.studentRollNumber}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {settings.currency}
                      {payment.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {payment.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {payment.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Paid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveReceipt(payment)}
                        className="text-blue-600 hover:text-blue-800 font-semibold p-1 hover:bg-blue-50 rounded"
                        title="Print / View Receipt"
                      >
                        <Receipt className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Fees Overview (Col span 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h2 className="font-display font-bold text-base text-slate-900">
                  Pending Fees
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Students with unpaid tuition balances
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('pending-fees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Pending Fees</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Pending</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPending.length > 0 ? (
                  topPending.map(({ student, totalFee, paidAmount, pendingAmount }) => (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => viewStudentDetails(student.id)}
                          className="font-semibold text-slate-900 hover:text-blue-600 text-left block"
                        >
                          {student.firstName} {student.lastName}
                        </button>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {student.rollNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {student.className} {student.section}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {settings.currency}
                        {paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        {settings.currency}
                        {pendingAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigateToCollectFee(student.id)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-[11px] transition-colors"
                        >
                          Collect
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No pending fee dues. All student accounts cleared!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Outstanding: {settings.currency}{totalPending.toLocaleString()}</span>
            <button
              onClick={() => setCurrentScreen('fee-collection')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              + Collect Fee Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
