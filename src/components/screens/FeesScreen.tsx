import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  AlertCircle,
  Receipt,
  CheckCircle2,
  X,
  Wallet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { FeeStructure } from '../../types';

export const FeesScreen: React.FC = () => {
  const {
    feeStructures,
    classes,
    addFeeStructure,
    updateFeeStructure,
    setCurrentScreen,
    settings
  } = useSchool();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);

  // Form states
  const [classId, setClassId] = useState('');
  const [academicYear, setAcademicYear] = useState('2026–27');
  const [annualFee, setAnnualFee] = useState<number>(30000);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingFee(null);
    setClassId(classes[0]?.id || '');
    setAcademicYear('2026–27');
    setAnnualFee(30000);
    setDescription('Comprehensive Academic Tuition & Facility Fee');
    setStatus('Active');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (fee: FeeStructure) => {
    setEditingFee(fee);
    setClassId(fee.classId);
    setAcademicYear(fee.academicYear);
    setAnnualFee(fee.annualFee);
    setDescription(fee.description || '');
    setStatus(fee.status);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!classId) errs.classId = 'Please select a class';
    if (!annualFee || annualFee <= 0) errs.annualFee = 'Annual fee must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedCls = classes.find((c) => c.id === classId);
    const className = selectedCls ? `${selectedCls.className} ${selectedCls.section}` : 'Standard';

    if (editingFee) {
      updateFeeStructure(editingFee.id, {
        classId,
        className,
        academicYear,
        annualFee: Number(annualFee),
        description,
        status
      });
    } else {
      addFeeStructure({
        classId,
        className,
        academicYear,
        annualFee: Number(annualFee),
        description,
        status
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Fee Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure annual class fee structures, tuition slabs, and collection rules
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setCurrentScreen('pending-fees')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-amber-700 rounded-xl text-xs font-semibold border border-amber-200 shadow-2xs transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>View Pending Dues</span>
          </button>
          <button
            onClick={() => setCurrentScreen('fee-collection')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>+ Collect Fee</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fee Schedule</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Quick Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setCurrentScreen('fees')}
          className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs"
        >
          Fee Structures ({feeStructures.length})
        </button>
        <button
          onClick={() => setCurrentScreen('pending-fees')}
          className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg text-xs transition-colors"
        >
          Pending Fees
        </button>
        <button
          onClick={() => setCurrentScreen('payments')}
          className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg text-xs transition-colors"
        >
          Payment History & Receipts
        </button>
      </div>

      {/* Fee Structures Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Class Standard</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Curriculum / Description</th>
                <th className="py-3 px-4 text-right">Annual Fee Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeStructures.map((fee) => {
                const isActive = fee.status === 'Active';
                return (
                  <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          {fee.className}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {fee.academicYear}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                      {fee.description || 'Standard school academic and laboratory tuition'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {settings.currency}
                      {fee.annualFee.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
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
                        {fee.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(fee)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Structure"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Fee Structure Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                {editingFee ? 'Edit Class Fee Structure' : 'Create Class Fee Schedule'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Class <span className="text-rose-500">*</span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className} {cls.section}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-xs text-rose-500 mt-1">{errors.classId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Annual Fee ({settings.currency}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(Number(e.target.value))}
                  placeholder="30000"
                  step="500"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.annualFee && <p className="text-xs text-rose-500 mt-1">{errors.annualFee}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Inclusions
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Includes tuition, lab supplies, library and annual sports"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingFee ? 'Update Schedule' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
