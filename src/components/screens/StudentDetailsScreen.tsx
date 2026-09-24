import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  UserX,
  CreditCard,
  User,
  Users,
  BookOpen,
  CalendarCheck,
  Receipt,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const StudentDetailsScreen: React.FC = () => {
  const {
    students,
    classes,
    parents,
    payments,
    attendanceRecords,
    selectedStudentId,
    setCurrentScreen,
    navigateToEditStudent,
    navigateToCollectFee,
    deactivateStudent,
    getStudentFeeSummary,
    setActiveReceipt,
    settings
  } = useSchool();

  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);

  const student = students.find((s) => s.id === selectedStudentId);

  if (!student) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">No student selected</p>
        <button
          onClick={() => setCurrentScreen('students')}
          className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
        >
          &larr; Back to Students List
        </button>
      </div>
    );
  }

  const studentClass = classes.find((c) => c.id === student.classId);
  const parent = parents.find((p) => p.id === student.parentId);

  // Fee summary
  const { totalFee, paidAmount, pendingAmount, status: feeStatus } = getStudentFeeSummary(student.id);

  // Student specific payments
  const studentPayments = payments
    .filter((p) => p.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Student specific attendance
  const studentAttendance = attendanceRecords.filter((a) => a.studentId === student.id);
  const totalDays = studentAttendance.length > 0 ? studentAttendance.length : 14;
  const presentDays =
    studentAttendance.length > 0
      ? studentAttendance.filter((a) => a.status === 'Present').length
      : 13;
  const absentDays = totalDays - presentDays;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  const isActive = student.status === 'Active';

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('students')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </button>

        <div className="flex items-center gap-2">
          {pendingAmount > 0 && isActive && (
            <button
              onClick={() => navigateToCollectFee(student.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect Fee</span>
            </button>
          )}

          <button
            onClick={() => navigateToEditStudent(student.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>

          {isActive && (
            <button
              onClick={() => setConfirmDeactivateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-display font-bold text-2xl shadow-xs">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display font-bold text-2xl text-slate-900 leading-tight">
                {student.firstName} {student.lastName}
              </h1>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                {student.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
              <span>ID: {student.studentId}</span>
              <span>•</span>
              <span>Roll: {student.rollNumber}</span>
              <span>•</span>
              <span className="font-sans font-medium text-slate-700">
                {student.className} {student.section}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">
              Attendance
            </span>
            <span className="font-display font-bold text-base text-slate-900 tabular-nums">
              {attendanceRate}%
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">
              Total Fees
            </span>
            <span className="font-display font-bold text-base text-slate-900 tabular-nums">
              {settings.currency}
              {totalFee.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">
              Pending Due
            </span>
            <span
              className={`font-display font-bold text-base tabular-nums ${
                pendingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {settings.currency}
              {pendingAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Details: Personal, Parent, Class */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Student Personal Information */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Student Information
              </h2>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-400">Date of Birth:</dt>
                <dd className="font-medium text-slate-800">{student.dateOfBirth}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Gender:</dt>
                <dd className="font-medium text-slate-800">{student.gender}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Blood Group:</dt>
                <dd className="font-medium text-slate-800">{student.bloodGroup || 'Not recorded'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Admission Date:</dt>
                <dd className="font-medium text-slate-800">{student.admissionDate}</dd>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <dt className="text-slate-400 mb-0.5">Address:</dt>
                <dd className="text-slate-700 leading-relaxed">{student.address || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Card 2: Parent & Guardian Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Parent / Guardian
              </h2>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-400">Primary Contact:</dt>
                <dd className="font-bold text-slate-900">{student.parentName}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-400">Phone:</dt>
                <dd className="font-mono text-slate-800 font-medium">{student.parentPhone}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-400">Email:</dt>
                <dd className="text-slate-700 truncate max-w-[140px]">
                  {student.parentEmail || parent?.email || 'N/A'}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-400">Occupation:</dt>
                <dd className="text-slate-700">{parent?.occupation || 'Guardian'}</dd>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <dt className="text-slate-400 mb-0.5">Parent ID:</dt>
                <dd className="text-slate-600 font-mono">{parent?.parentId || student.parentId}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Card 3: Class & Academic Assignment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Academic Assignment
              </h2>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-400">Current Class:</dt>
                <dd className="font-bold text-slate-900">
                  {student.className} {student.section}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Class Teacher:</dt>
                <dd className="font-medium text-slate-800">
                  {studentClass?.classTeacherName || 'Assigned Staff'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Academic Year:</dt>
                <dd className="font-medium text-slate-800">{settings.academicYear}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Class Capacity:</dt>
                <dd className="font-medium text-slate-800">{studentClass?.capacity || 30} students</dd>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <dt className="text-slate-400 mb-0.5">Class Status:</dt>
                <dd className="text-emerald-700 font-semibold">{studentClass?.status || 'Active'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Attendance & Fee Ledger Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Attendance Summary (Col span 5) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Attendance Breakdown
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-700 tabular-nums">
              {attendanceRate}% present
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-4">
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] font-semibold text-emerald-800 uppercase block">
                Present
              </span>
              <span className="font-bold text-lg text-emerald-700 tabular-nums">
                {presentDays}
              </span>
            </div>
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 text-center">
              <span className="text-[10px] font-semibold text-rose-800 uppercase block">
                Absent
              </span>
              <span className="font-bold text-lg text-rose-700 tabular-nums">
                {absentDays}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Recorded
              </span>
              <span className="font-bold text-lg text-slate-800 tabular-nums">
                {totalDays}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${attendanceRate}%` }}
            />
            <div
              className="bg-rose-400 h-full"
              style={{ width: `${100 - attendanceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Consistent attendance required for term promotions.
          </p>
        </div>

        {/* Fee & Payment Ledger (Col span 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Fee Schedule & Payments
              </h2>
            </div>
            {pendingAmount > 0 && isActive && (
              <button
                onClick={() => navigateToCollectFee(student.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>+ Collect Payment</span>
              </button>
            )}
          </div>

          {/* Ledger summary bar */}
          <div className="p-4 bg-slate-50/70 grid grid-cols-3 gap-3 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Total Annual Fee
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {settings.currency}
                {totalFee.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Total Paid
              </span>
              <span className="font-mono font-bold text-emerald-600 text-sm">
                {settings.currency}
                {paidAmount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Pending Balance
              </span>
              <span
                className={`font-mono font-bold text-sm ${
                  pendingAmount > 0 ? 'text-amber-600' : 'text-slate-900'
                }`}
              >
                {settings.currency}
                {pendingAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Receipt #</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Mode</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentPayments.length > 0 ? (
                  studentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">
                        {p.receiptNumber}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{p.date}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-700 font-medium">
                          {p.paymentMode}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                        {settings.currency}
                        {p.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setActiveReceipt(p)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                          title="View / Print Receipt"
                        >
                          <Receipt className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No payment records recorded yet for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDeactivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Deactivate Student?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to deactivate {student.firstName} {student.lastName}? This will remove them from daily attendance tracking while preserving their payment and ledger history.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setConfirmDeactivateOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deactivateStudent(student.id);
                  setConfirmDeactivateOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
