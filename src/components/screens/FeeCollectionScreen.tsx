import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ArrowLeft,
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentMode } from '../../types';

export const FeeCollectionScreen: React.FC = () => {
  const {
    students,
    payments,
    selectedStudentId,
    setSelectedStudentId,
    getStudentFeeSummary,
    recordPayment,
    setCurrentScreen,
    settings
  } = useSchool();

  const [studentId, setStudentId] = useState(selectedStudentId || '');
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState('2026-09-23');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Find selected student
  const activeStudents = students.filter((s) => s.status === 'Active');
  const selectedStudent = students.find((s) => s.id === studentId);
  const feeSummary = selectedStudent ? getStudentFeeSummary(selectedStudent.id) : null;

  // Auto-generate receipt number
  useEffect(() => {
    const nextReceiptNum = `REC-2026-${String(payments.length + 892).padStart(4, '0')}`;
    setReceiptNumber(nextReceiptNum);
  }, [payments.length]);

  // When student selection changes, set default amount to pending due
  useEffect(() => {
    if (feeSummary) {
      setAmount(feeSummary.pendingAmount);
    }
  }, [studentId]);

  // Synchronize with selectedStudentId from context
  useEffect(() => {
    if (selectedStudentId) {
      setStudentId(selectedStudentId);
    } else if (activeStudents.length > 0 && !studentId) {
      setStudentId(activeStudents[0].id);
    }
  }, [selectedStudentId, activeStudents]);

  const handleStudentChange = (id: string) => {
    setStudentId(id);
    setSelectedStudentId(id);
    setErrorMessage('');
  };

  const handleAmountChange = (val: number) => {
    setAmount(val);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!studentId) {
      setErrorMessage('Please select a student to collect fee for.');
      return;
    }

    if (amount <= 0) {
      setErrorMessage('Payment amount must be greater than ₹0.');
      return;
    }

    if (feeSummary && amount > feeSummary.pendingAmount) {
      setErrorMessage(
        `Overpayment blocked! Entered amount of ${settings.currency}${amount.toLocaleString()} exceeds pending due of ${settings.currency}${feeSummary.pendingAmount.toLocaleString()}.`
      );
      return;
    }

    const result = recordPayment({
      studentId,
      amount: Number(amount),
      paymentMode,
      date: paymentDate,
      receiptNumber,
      notes
    });

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      // Navigates to payments ledger or stays with active receipt modal
      setCurrentScreen('payments');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('pending-fees')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pending Fees</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-slate-900">
              Collect Tuition Fee
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Record fee installment payments and issue an official receipt
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="m-6 mb-0 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Select Student */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Select Student
            </label>
            <select
              value={studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Choose student from active directory --</option>
              {activeStudents.map((stu) => {
                const summary = getStudentFeeSummary(stu.id);
                return (
                  <option key={stu.id} value={stu.id}>
                    {stu.firstName} {stu.lastName} ({stu.className} {stu.section} • Roll: {stu.rollNumber}) - Due: {settings.currency}{summary.pendingAmount.toLocaleString()}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Student Account Summary Card */}
          {selectedStudent && feeSummary && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Parent: {selectedStudent.parentName} ({selectedStudent.parentPhone})
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedStudent.className} {selectedStudent.section}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Total Annual Fee
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {settings.currency}
                    {feeSummary.totalFee.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Total Paid So Far
                  </span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {settings.currency}
                    {feeSummary.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Current Pending Due
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      feeSummary.pendingAmount > 0 ? 'text-amber-600' : 'text-slate-800'
                    }`}
                  >
                    {settings.currency}
                    {feeSummary.pendingAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {feeSummary.pendingAmount === 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>This student has no outstanding fees for this academic year.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Details */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Transaction & Payment Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount to Collect ({settings.currency}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  placeholder="Enter amount"
                  min={1}
                  max={feeSummary?.pendingAmount || 100000}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {feeSummary && amount > feeSummary.pendingAmount && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold">
                    Cannot exceed pending balance of {settings.currency}
                    {feeSummary.pendingAmount.toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode <span className="text-rose-500">*</span>
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Cash">Cash (Counter Receipt)</option>
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction Notes / Reference ID
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. UPI Ref #UPI984201, Cheque clearance note, or counter memo"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentScreen('pending-fees')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={feeSummary?.pendingAmount === 0 || amount <= 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>Record Payment & Issue Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
