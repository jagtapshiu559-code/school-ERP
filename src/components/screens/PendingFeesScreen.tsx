import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  CreditCard,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  GraduationCap
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const PendingFeesScreen: React.FC = () => {
  const {
    students,
    classes,
    getStudentFeeSummary,
    navigateToCollectFee,
    viewStudentDetails,
    setCurrentScreen,
    settings
  } = useSchool();

  const [classFilter, setClassFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Active students with fee calculations
  const studentsWithSummary = useMemo(() => {
    return students
      .filter((s) => s.status === 'Active')
      .map((student) => {
        const summary = getStudentFeeSummary(student.id);
        return {
          student,
          ...summary
        };
      });
  }, [students, getStudentFeeSummary]);

  // Filter students who actually have pending fees
  const pendingStudents = useMemo(() => {
    return studentsWithSummary.filter((item) => {
      const hasDues = item.pendingAmount > 0;
      const classMatch = classFilter === 'all' || item.student.classId === classFilter;
      const q = search.toLowerCase().trim();
      const searchMatch =
        !q ||
        item.student.firstName.toLowerCase().includes(q) ||
        item.student.lastName.toLowerCase().includes(q) ||
        item.student.rollNumber.toLowerCase().includes(q) ||
        item.student.parentName.toLowerCase().includes(q);

      return hasDues && classMatch && searchMatch;
    });
  }, [studentsWithSummary, classFilter, search]);

  // Overall statistics
  const totalPendingAmount = pendingStudents.reduce((sum, s) => sum + s.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Pending Fees
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify outstanding tuition payments and initiate collection
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('fee-collection')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          <span>+ Collect Fee</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setCurrentScreen('fees')}
          className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg text-xs transition-colors"
        >
          Fee Structures
        </button>
        <button
          onClick={() => setCurrentScreen('pending-fees')}
          className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs"
        >
          Pending Fees ({pendingStudents.length})
        </button>
        <button
          onClick={() => setCurrentScreen('payments')}
          className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg text-xs transition-colors"
        >
          Payment History & Receipts
        </button>
      </div>

      {/* 2 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Students with Pending Dues
            </p>
            <h3 className="font-display font-bold text-3xl text-slate-900 mt-1 tabular-nums">
              {pendingStudents.length}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Across selected classes</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Outstanding Balance
            </p>
            <h3 className="font-display font-bold text-3xl text-amber-600 mt-1 tabular-nums">
              {settings.currency}
              {totalPendingAmount.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Pending collection for AY {settings.academicYear}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, roll no, parent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Class:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full md:w-auto py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} {cls.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pending Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Parent Phone</th>
                <th className="py-3 px-4 text-right">Total Annual Fee</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Pending Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingStudents.length > 0 ? (
                pendingStudents.map(({ student, totalFee, paidAmount, pendingAmount, status }) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => viewStudentDetails(student.id)}
                        className="font-bold text-slate-900 hover:text-blue-600 text-left block"
                      >
                        {student.firstName} {student.lastName}
                      </button>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {student.rollNumber} • ID: {student.studentId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {student.className} {student.section}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {student.parentPhone}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {settings.currency}
                      {totalFee.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 font-medium">
                      {settings.currency}
                      {paidAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600 text-sm">
                      {settings.currency}
                      {pendingAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigateToCollectFee(student.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        Collect Fee
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No pending dues found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      All fees for matching students have been collected in full!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
