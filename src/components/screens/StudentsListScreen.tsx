import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  UserX,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';

export const StudentsListScreen: React.FC = () => {
  const {
    students,
    classes,
    viewStudentDetails,
    navigateToEditStudent,
    navigateToAddStudent,
    deactivateStudent
  } = useSchool();

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active');
  const [studentToDeactivate, setStudentToDeactivate] = useState<Student | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      // Search
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        stu.firstName.toLowerCase().includes(q) ||
        stu.lastName.toLowerCase().includes(q) ||
        stu.studentId.toLowerCase().includes(q) ||
        stu.rollNumber.toLowerCase().includes(q) ||
        stu.parentName.toLowerCase().includes(q) ||
        stu.parentPhone.includes(q);

      // Class filter
      const matchesClass = selectedClass === 'all' || stu.classId === selectedClass;

      // Status filter
      const matchesStatus =
        selectedStatus === 'all' || stu.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, search, selectedClass, selectedStatus]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleConfirmDeactivate = () => {
    if (studentToDeactivate) {
      deactivateStudent(studentToDeactivate.id);
      setStudentToDeactivate(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Students Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {students.length} students enrolled in the school ledger
          </p>
        </div>

        <button
          onClick={navigateToAddStudent}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Student</span>
        </button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll no, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 w-1/2 md:w-auto">
            <span className="text-xs text-slate-400 hidden sm:inline">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 w-1/2 md:w-auto">
            <span className="text-xs text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-auto py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Deactivated">Deactivated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => {
                  const isActive = student.status === 'Active';
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => viewStudentDetails(student.id)}
                    >
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {student.firstName[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 block leading-tight">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Roll: {student.rollNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {student.studentId}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">
                          {student.className} {student.section}
                        </span>
                      </td>

                      {/* Parent */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {student.parentName}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {student.parentPhone}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => viewStudentDetails(student.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Student Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigateToEditStudent(student.id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Student Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {isActive && (
                            <button
                              onClick={() => setStudentToDeactivate(student)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Deactivate Student"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No students found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search criteria or class filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{filteredStudents.length}</span> students
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Student Confirmation Modal */}
      {studentToDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Deactivate Student?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to deactivate{' '}
              <strong className="text-slate-900">
                {studentToDeactivate.firstName} {studentToDeactivate.lastName} ({studentToDeactivate.studentId})
              </strong>
              ? They will no longer appear on daily attendance lists. Historical records and payments will be preserved.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setStudentToDeactivate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
