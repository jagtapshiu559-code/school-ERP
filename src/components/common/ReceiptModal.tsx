import React from 'react';
import { X, Printer, CheckCircle, School, Download } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, settings, students } = useSchool();

  if (!activeReceipt) return null;

  const student = students.find((s) => s.id === activeReceipt.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm text-slate-800">Fee Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setActiveReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-8 text-slate-900">
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-5 mb-5">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <School className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-xl text-slate-900 leading-tight">
              {settings.schoolName}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {settings.address}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
              <span>Ph: {settings.phone}</span>
              <span>•</span>
              <span>Reg: {settings.affiliationNumber}</span>
            </div>
            <div className="mt-3 inline-block px-3 py-0.5 bg-slate-100 rounded-md text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Official Tuition Fee Receipt
            </div>
          </div>

          {/* Receipt Meta Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Receipt Number
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {activeReceipt.receiptNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Date & Time
              </span>
              <span className="font-medium text-slate-900">
                {activeReceipt.date}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Student Name & Roll
              </span>
              <span className="font-bold text-slate-900">
                {activeReceipt.studentName}
              </span>
              <span className="text-slate-500 block text-[11px]">
                Roll No: {activeReceipt.studentRollNumber || 'N/A'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Class & Section
              </span>
              <span className="font-semibold text-slate-900">
                {activeReceipt.className}
              </span>
              <span className="text-slate-500 block text-[11px]">
                AY {settings.academicYear}
              </span>
            </div>
          </div>

          {/* Payment Particulars Table */}
          <table className="w-full text-left text-xs mb-6 border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Payment Mode</th>
                <th className="py-2.5 px-3 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3">
                  <span className="font-medium text-slate-900 block">
                    Tuition & School Academic Fee
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {activeReceipt.notes || 'Official installment receipt'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-medium text-slate-700">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                    {activeReceipt.paymentMode}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                  {settings.currency}
                  {activeReceipt.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={2} className="py-2.5 px-3 font-semibold text-slate-700">
                  Total Amount Received
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700 text-base">
                  {settings.currency}
                  {activeReceipt.amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer & Signatures */}
          <div className="pt-6 border-t border-dashed border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="text-[11px] text-slate-400">Computer generated receipt.</p>
              <p className="text-[11px] text-slate-400">Signature not required for verification.</p>
            </div>
            <div className="text-center">
              <div className="h-8 border-b border-slate-300 w-32 mx-auto mb-1"></div>
              <span className="text-[11px] font-semibold text-slate-700">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
