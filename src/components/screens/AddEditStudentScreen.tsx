import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Users,
  MapPin,
  Check,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';

export const AddEditStudentScreen: React.FC = () => {
  const {
    students,
    classes,
    parents,
    selectedStudentId,
    setCurrentScreen,
    addStudent,
    updateStudent,
    addParent
  } = useSchool();

  const isEdit = Boolean(selectedStudentId);
  const editingStudent = students.find((s) => s.id === selectedStudentId);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');

  const [studentId, setStudentId] = useState('');
  const [admissionDate, setAdmissionDate] = useState('2026-06-15');
  const [classId, setClassId] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // Parent linkage
  const [parentId, setParentId] = useState('');
  const [isCreatingNewParent, setIsCreatingNewParent] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');

  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate next Student ID if new
  useEffect(() => {
    if (isEdit && editingStudent) {
      setFirstName(editingStudent.firstName);
      setLastName(editingStudent.lastName);
      setDob(editingStudent.dateOfBirth);
      setGender(editingStudent.gender);
      setBloodGroup(editingStudent.bloodGroup || 'B+');
      setStudentId(editingStudent.studentId);
      setAdmissionDate(editingStudent.admissionDate);
      setClassId(editingStudent.classId);
      setRollNumber(editingStudent.rollNumber);
      setParentId(editingStudent.parentId);
      setAddress(editingStudent.address);
    } else {
      // Generate ID
      const nextNum = String(students.length + 1).padStart(3, '0');
      setStudentId(`STU-2026-${nextNum}`);
      if (classes.length > 0) {
        setClassId(classes[0].id);
      }
      if (parents.length > 0) {
        setParentId(parents[0].id);
      }
    }
  }, [isEdit, editingStudent, students.length, classes, parents]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!dob) errs.dob = 'Date of birth is required';
    if (!studentId.trim()) errs.studentId = 'Student ID is required';
    if (!classId) errs.classId = 'Class is required';
    if (!rollNumber.trim()) errs.rollNumber = 'Roll number is required';

    if (isCreatingNewParent) {
      if (!newParentName.trim()) errs.newParentName = 'Parent name is required';
      if (!newParentPhone.trim()) errs.newParentPhone = 'Parent phone is required';
    } else {
      if (!parentId) errs.parentId = 'Please select a parent or add a new one';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedClass = classes.find((c) => c.id === classId);
    const className = selectedClass ? selectedClass.className : 'Primary';
    const section = selectedClass ? selectedClass.section : 'A';

    let resolvedParentId = parentId;
    let resolvedParentName = '';
    let resolvedParentPhone = '';
    let resolvedParentEmail = '';

    if (isCreatingNewParent) {
      const createdParent = addParent({
        fullName: newParentName,
        phone: newParentPhone,
        email: newParentEmail || `${newParentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        address: address || 'Pune, MH'
      });
      resolvedParentId = createdParent.id;
      resolvedParentName = createdParent.fullName;
      resolvedParentPhone = createdParent.phone;
      resolvedParentEmail = createdParent.email;
    } else {
      const existingParent = parents.find((p) => p.id === parentId);
      if (existingParent) {
        resolvedParentName = existingParent.fullName;
        resolvedParentPhone = existingParent.phone;
        resolvedParentEmail = existingParent.email;
      }
    }

    if (isEdit && selectedStudentId) {
      const success = updateStudent(selectedStudentId, {
        firstName,
        lastName,
        dateOfBirth: dob,
        gender,
        bloodGroup,
        studentId,
        admissionDate,
        classId,
        className,
        section,
        rollNumber,
        parentId: resolvedParentId,
        parentName: resolvedParentName,
        parentPhone: resolvedParentPhone,
        parentEmail: resolvedParentEmail,
        address
      });
      if (success) {
        setCurrentScreen('student-details');
      }
    } else {
      const success = addStudent({
        studentId,
        firstName,
        lastName,
        dateOfBirth: dob,
        gender,
        bloodGroup,
        classId,
        className,
        section,
        rollNumber,
        parentId: resolvedParentId,
        parentName: resolvedParentName,
        parentPhone: resolvedParentPhone,
        parentEmail: resolvedParentEmail,
        address,
        admissionDate,
        status: 'Active'
      });
      if (success) {
        setCurrentScreen('students');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen(isEdit ? 'student-details' : 'students')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isEdit ? 'Student Profile' : 'Students List'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <h1 className="font-display font-bold text-xl text-slate-900">
            {isEdit ? `Edit Student: ${editingStudent?.firstName} ${editingStudent?.lastName}` : 'Admit New Student'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the student details, academic assignment, and guardian contact info.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Aarav"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.firstName && <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.lastName && <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.dob && <p className="text-xs text-rose-500 mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group (Optional)
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Academic Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2026-015"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.studentId && <p className="text-xs text-rose-500 mt-1">{errors.studentId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class & Section <span className="text-rose-500">*</span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className} {cls.section} (Cap: {cls.capacity})
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-xs text-rose-500 mt-1">{errors.classId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Roll Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. JKG-12"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.rollNumber && <p className="text-xs text-rose-500 mt-1">{errors.rollNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admission Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Parent & Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Parent / Guardian Contact
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingNewParent(!isCreatingNewParent)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingNewParent ? 'Select Existing Parent' : 'Add New Parent'}</span>
              </button>
            </div>

            {isCreatingNewParent ? (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                <p className="text-xs font-semibold text-blue-900">
                  Register New Parent Profile
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Parent Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newParentName}
                      onChange={(e) => setNewParentName(e.target.value)}
                      placeholder="e.g. Anand Deshpande"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.newParentName && (
                      <p className="text-xs text-rose-500 mt-1">{errors.newParentName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Mobile Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newParentPhone}
                      onChange={(e) => setNewParentPhone(e.target.value)}
                      placeholder="+91 98220 00000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.newParentPhone && (
                      <p className="text-xs text-rose-500 mt-1">{errors.newParentPhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newParentEmail}
                      onChange={(e) => setNewParentEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Registered Parent <span className="text-rose-500">*</span>
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Choose a parent from directory --</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone})
                    </option>
                  ))}
                </select>
                {errors.parentId && <p className="text-xs text-rose-500 mt-1">{errors.parentId}</p>}
              </div>
            )}
          </div>

          {/* Section 4: Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                4. Residential Address
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Flat / House No, Building, Street, City, Pincode"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentScreen(isEdit ? 'student-details' : 'students')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Update Student Record' : 'Save Student Admission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
