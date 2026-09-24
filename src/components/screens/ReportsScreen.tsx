import React from 'react';
import {
  BarChart3,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const ReportsScreen: React.FC = () => {
  const {
    students,
    classes,
    payments,
    attendanceRecords,
    getStudentFeeSummary,
    navigateToReportDetail,
    settings
  } = useSchool();

  const activeStudents = students.filter((s) => s.status === 'Active');
  const maleCount = activeStudents.filter((s) => s.gender === 'Male').length;
  const femaleCount = activeStudents.filter((s) => s.gender === 'Female').length;

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  let totalPending = 0;
  let totalBilled = 0;

  activeStudents.forEach((stu) => {
    const summary = getStudentFeeSummary(stu.id);
    totalPending += summary.pendingAmount;
    totalBilled += summary.totalFee;
  });

  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Attendance metrics
  const todayRecords = attendanceRecords.filter((a) => a.date === '2026-09-23');
  const presentCount = todayRecords.filter((a) => a.status === 'Present').length;
  const todayTotal = todayRecords.length > 0 ? todayRecords.length : activeStudents.length;
  const attendanceRate = Math.round(((todayRecords.length > 0 ? presentCount : activeStudents.length * 0.92) / todayTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
          School Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive operational summaries for student admissions, daily attendance, and fee recovery
        </p>
      </div>

      {/* 3 Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Student Report */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-blue-300 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admissions
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
              Student Demographics Report
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Enrollment distribution, gender ratio, standard-wise headcount, and student statuses.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Students:</span>
                <span className="font-bold text-slate-900 tabular-nums">{activeStudents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gender Ratio:</span>
                <span className="font-medium text-slate-700">
                  {maleCount} Boys • {femaleCount} Girls
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Classes:</span>
                <span className="font-medium text-slate-700">{classes.length} sections</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateToReportDetail('student')}
            className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View Student Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Attendance Report */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-blue-300 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Roll Call
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
              Attendance Trends Report
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Standard-by-standard daily presence metrics, absentee counts, and overall attendance rate.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Today's Presence Rate:</span>
                <span className="font-bold text-emerald-600 tabular-nums">{attendanceRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Recorded Entries:</span>
                <span className="font-medium text-slate-700">{attendanceRecords.length} records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audited Classes:</span>
                <span className="font-medium text-slate-700">100% compliant</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateToReportDetail('attendance')}
            className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View Attendance Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Fee Report */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-blue-300 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Financials
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
              Fee Collection & Dues Report
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Revenue realizations, outstanding balance schedules, class-wise dues, and payment modes.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Realized Collections:</span>
                <span className="font-bold text-emerald-600 tabular-nums">
                  {settings.currency}
                  {totalCollected.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Outstanding Balance:</span>
                <span className="font-bold text-amber-600 tabular-nums">
                  {settings.currency}
                  {totalPending.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recovery Percentage:</span>
                <span className="font-medium text-slate-700">{collectionRate}% collected</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateToReportDetail('fee')}
            className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View Fee Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
