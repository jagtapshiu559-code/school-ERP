import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const AttendanceHistoryScreen: React.FC = () => {
  const { attendanceRecords, classes, setCurrentScreen } = useSchool();

  const [dateFilter, setDateFilter] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((rec) => {
      const matchesDate = !dateFilter || rec.date === dateFilter;
      const matchesClass = classFilter === 'all' || rec.classId === classFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.studentName.toLowerCase().includes(q) ||
        rec.className.toLowerCase().includes(q);

      return matchesDate && matchesClass && matchesSearch;
    });
  }, [attendanceRecords, dateFilter, classFilter, search]);

  const presentCount = filteredRecords.filter((r) => r.status === 'Present').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'Absent').length;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentScreen('attendance')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Daily Attendance</span>
          </button>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Attendance Log & History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all recorded student roll calls across dates
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200">
            {presentCount} Present
          </span>
          <span className="px-3 py-1.5 bg-rose-50 text-rose-700 font-semibold rounded-lg border border-rose-200">
            {absentCount} Absent
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700">Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-blue-600 hover:underline ml-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} {cls.section}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student in records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const isPresent = rec.status === 'Present';
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {rec.studentName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {rec.className} {rec.section}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isPresent
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isPresent ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500 text-[11px]">
                        {rec.markedAt}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No historical attendance records match this criteria.
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
