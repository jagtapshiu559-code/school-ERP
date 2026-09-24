import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  Filter,
  CreditCard,
  Printer,
  Download,
  CheckCircle2
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentMode } from '../../types';

export const PaymentHistoryScreen: React.FC = () => {
  const { payments, setActiveReceipt, setCurrentScreen, settings } = useSchool();

  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.studentName.toLowerCase().includes(q) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.studentRollNumber.toLowerCase().includes(q) ||
        p.className.toLowerCase().includes(q);

      const matchesMode = modeFilter === 'all' || p.paymentMode === modeFilter;
      const matchesDate = !dateFilter || p.date === dateFilter;

      return matchesSearch && matchesMode && matchesDate;
    });
  }, [payments, search, modeFilter, dateFilter]);

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Payment History & Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of all verified tuition collections, modes, and printable receipts
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('fee-collection')}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          <span>+ Record New Payment</span>
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
          className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg text-xs transition-colors"
        >
          Pending Fees
        </button>
        <button
          onClick={() => setCurrentScreen('payments')}
          className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs"
        >
          Payment History & Receipts ({payments.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search receipt #, student name, roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Mode Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Date Picker */}
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

          <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
            Total: {settings.currency}{totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Notes / Reference</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {p.receiptNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block leading-tight">
                        {p.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {p.className} • Roll: {p.studentRollNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-700 text-sm">
                      {settings.currency}
                      {p.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {p.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-md font-medium text-[11px]">
                        {p.paymentMode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {p.notes || 'Tuition fee'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Settled
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveReceipt(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment records match this filter.
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
