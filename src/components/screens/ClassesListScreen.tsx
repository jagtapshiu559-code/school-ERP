import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Users,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolClass } from '../../types';

export const ClassesListScreen: React.FC = () => {
  const { classes, students, addClass, updateClass, deactivateClass, setCurrentScreen } =
    useSchool();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  // Form states
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('A');
  const [academicYear, setAcademicYear] = useState('2026–27');
  const [classTeacherName, setClassTeacherName] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingClass(null);
    setClassName('');
    setSection('A');
    setAcademicYear('2026–27');
    setClassTeacherName('');
    setCapacity(30);
    setStatus('Active');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (cls: SchoolClass) => {
    setEditingClass(cls);
    setClassName(cls.className);
    setSection(cls.section);
    setAcademicYear(cls.academicYear);
    setClassTeacherName(cls.classTeacherName);
    setCapacity(cls.capacity);
    setStatus(cls.status);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!className.trim()) errs.className = 'Class name is required';
    if (!section.trim()) errs.section = 'Section is required';
    if (!classTeacherName.trim()) errs.classTeacherName = 'Class teacher name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        className,
        section,
        academicYear,
        classTeacherName,
        capacity: Number(capacity),
        status
      });
    } else {
      addClass({
        className,
        section,
        academicYear,
        classTeacherName,
        capacity: Number(capacity),
        status
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Classes & Sections
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure school standards, teacher assignments, and student seat limits
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Class</span>
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Class Teacher</th>
                <th className="py-3 px-4 text-center">Enrolled / Capacity</th>
                <th className="py-3 px-4 text-center">Occupancy</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cls) => {
                const enrolled = students.filter(
                  (s) => s.classId === cls.id && s.status === 'Active'
                ).length;
                const percent = Math.min(100, Math.round((enrolled / (cls.capacity || 1)) * 100));
                const isActive = cls.status === 'Active';

                return (
                  <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-display font-bold text-sm flex items-center justify-center shrink-0">
                          {cls.className.charAt(0)}
                          {cls.section}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {cls.className} - {cls.section}
                          </span>
                          <span className="text-[11px] text-slate-400">Class ID: {cls.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {cls.academicYear}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {cls.classTeacherName}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-medium">
                      <span className="font-bold text-slate-900">{enrolled}</span>
                      <span className="text-slate-400"> / {cls.capacity}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="max-w-[120px] mx-auto">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>{percent}%</span>
                          <span>{cls.capacity - enrolled} left</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percent > 85 ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
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
                        {cls.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cls)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Class"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isActive && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark class ${cls.className} ${cls.section} as Inactive?`)) {
                                deactivateClass(cls.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Deactivate Class"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                {editingClass ? 'Edit Class Details' : 'Add New Class Standard'}
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
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Grade 6, Senior KG, Nursery"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.className && <p className="text-xs text-rose-500 mt-1">{errors.className}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. A, B"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  {errors.section && <p className="text-xs text-rose-500 mt-1">{errors.section}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={5}
                    max={60}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026–27"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Teacher Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={classTeacherName}
                  onChange={(e) => setClassTeacherName(e.target.value)}
                  placeholder="e.g. Mrs. Sunita Kulkarni"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.classTeacherName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.classTeacherName}</p>
                )}
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
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
