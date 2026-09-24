import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  History,
  Save,
  CheckCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';

export const AttendanceScreen: React.FC = () => {
  const {
    students,
    classes,
    attendanceRecords,
    saveAttendanceForDate,
    setCurrentScreen
  } = useSchool();

  const [selectedDate, setSelectedDate] = useState('2026-09-23');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Active students to mark attendance for
  const activeStudents = useMemo(() => {
    return students.filter((s) => s.status === 'Active');
  }, [students]);

  // Map of studentId -> AttendanceStatus
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  // Initialize or fetch saved attendance for this date
  useEffect(() => {
    const existing = attendanceRecords.filter((rec) => rec.date === selectedDate);
    const map: Record<string, AttendanceStatus> = {};

    activeStudents.forEach((stu) => {
      const match = existing.find((r) => r.studentId === stu.id);
      if (match) {
        map[stu.id] = match.status;
      } else {
        // Default to present
        map[stu.id] = 'Present';
      }
    });

    setAttendanceMap(map);
  }, [selectedDate, activeStudents, attendanceRecords]);

  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = { ...attendanceMap };
    activeStudents.forEach((stu) => {
      if (selectedClass === 'all' || stu.classId === selectedClass) {
        updated[stu.id] = status;
      }
    });
    setAttendanceMap(updated);
  };

  const handleSave = () => {
    const recordsToSave = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      status
    }));

    saveAttendanceForDate(selectedDate, recordsToSave);
  };

  // Filter students display
  const displayedStudents = useMemo(() => {
    return activeStudents.filter((stu) => {
      const classMatch = selectedClass === 'all' || stu.classId === selectedClass;
      const q = search.toLowerCase().trim();
      const searchMatch =
        !q ||
        stu.firstName.toLowerCase().includes(q) ||
        stu.lastName.toLowerCase().includes(q) ||
        stu.rollNumber.toLowerCase().includes(q);

      return classMatch && searchMatch;
    });
  }, [activeStudents, selectedClass, search]);

  // Statistics for selected filters
  const presentCount = displayedStudents.filter(
    (s) => attendanceMap[s.id] === 'Present'
  ).length;
  const absentCount = displayedStudents.filter(
    (s) => attendanceMap[s.id] === 'Absent'
  ).length;
  const totalCount = displayedStudents.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Daily Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark daily morning student presence and track absentee records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('attendance-history')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Attendance History</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Present Today
            </span>
            <span className="font-display font-bold text-2xl text-emerald-600 tabular-nums">
              {presentCount}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Absent Today
            </span>
            <span className="font-display font-bold text-2xl text-rose-600 tabular-nums">
              {absentCount}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Enrolled
            </span>
            <span className="font-display font-bold text-2xl text-slate-800 tabular-nums">
              {totalCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-700 block">
              {attendanceRate}% Present
            </span>
            <span className="text-[11px] text-slate-400">
              {selectedDate}
            </span>
          </div>
          <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${attendanceRate}%` }} />
            <div className="bg-rose-400 h-full" style={{ width: `${100 - attendanceRate}%` }} />
          </div>
        </div>
      </div>

      {/* Control Bar: Date Selector, Class Selector, Search & Quick Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-700">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
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
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => markAll('Present')}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <span>Mark All Absent</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Parent Contact</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedStudents.length > 0 ? (
                displayedStudents.map((student) => {
                  const currentStatus = attendanceMap[student.id] || 'Present';
                  const isPresent = currentStatus === 'Present';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {student.firstName[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block leading-tight">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Roll: {student.rollNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {student.studentId}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {student.className} {student.section}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium block">
                          {student.parentName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {student.parentPhone}
                        </span>
                      </td>

                      {/* Present / Absent Segmented Toggle */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => toggleStatus(student.id, 'Present')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(student.id, 'Absent')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                              !isPresent
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No active students found in this class view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Unsaved changes will be lost if you leave without clicking Save.
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance ({selectedDate})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
