import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Student,
  Parent,
  SchoolClass,
  FeeStructure,
  Payment,
  AttendanceRecord,
  SchoolSettings,
  ScreenId,
  AttendanceStatus
} from '../types';
import {
  initialSchoolSettings,
  initialClasses,
  initialFeeStructures,
  initialParents,
  initialStudents,
  initialPayments,
  initialAttendanceRecords
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface SchoolContextType {
  // Navigation & Screen Management
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  selectedParentId: string | null;
  setSelectedParentId: (id: string | null) => void;
  selectedReportType: 'student' | 'attendance' | 'fee';
  setSelectedReportType: (type: 'student' | 'attendance' | 'fee') => void;
  viewStudentDetails: (id: string) => void;
  navigateToEditStudent: (id: string) => void;
  navigateToAddStudent: () => void;
  navigateToCollectFee: (studentId?: string) => void;
  navigateToReportDetail: (type: 'student' | 'attendance' | 'fee') => void;

  // Auth State
  isAuthenticated: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  login: (email: string, password: string, rememberMe?: boolean) => boolean;
  logout: () => void;

  // Data
  students: Student[];
  parents: Parent[];
  classes: SchoolClass[];
  feeStructures: FeeStructure[];
  payments: Payment[];
  attendanceRecords: AttendanceRecord[];
  settings: SchoolSettings;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => boolean;
  updateStudent: (id: string, updates: Partial<Student>) => boolean;
  deactivateStudent: (id: string) => void;

  // Parent Actions
  addParent: (parent: Omit<Parent, 'id' | 'parentId' | 'studentIds'>) => Parent;
  updateParent: (id: string, updates: Partial<Parent>) => boolean;

  // Class Actions
  addClass: (cls: Omit<SchoolClass, 'id'>) => boolean;
  updateClass: (id: string, updates: Partial<SchoolClass>) => boolean;
  deactivateClass: (id: string) => void;

  // Fee & Payment Actions
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => boolean;
  updateFeeStructure: (id: string, updates: Partial<FeeStructure>) => boolean;
  recordPayment: (paymentData: {
    studentId: string;
    amount: number;
    paymentMode: 'Cash' | 'UPI' | 'Bank Transfer';
    date: string;
    receiptNumber?: string;
    notes?: string;
  }) => { success: boolean; message: string; receipt?: Payment };
  getStudentFeeSummary: (studentId: string) => {
    totalFee: number;
    paidAmount: number;
    pendingAmount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
  };

  // Attendance Actions
  saveAttendanceForDate: (
    date: string,
    records: { studentId: string; status: AttendanceStatus }[]
  ) => void;
  getAttendanceForDate: (date: string, classId?: string) => AttendanceRecord[];

  // Settings Actions
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  resetAllDataToDemo: () => void;

  // Toast / Feedback
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Active Receipt Modal
  activeReceipt: Payment | null;
  setActiveReceipt: (payment: Payment | null) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('schoolerp_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    return {
      name: 'Admin Owner',
      email: 'admin@oakridgevidyalaya.edu.in',
      role: 'School Principal & Administrator'
    };
  });

  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<'student' | 'attendance' | 'fee'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<Payment | null>(null);

  // Entities stored with local persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('schoolerp_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [parents, setParents] = useState<Parent[]>(() => {
    const saved = localStorage.getItem('schoolerp_parents');
    return saved ? JSON.parse(saved) : initialParents;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('schoolerp_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => {
    const saved = localStorage.getItem('schoolerp_fees');
    return saved ? JSON.parse(saved) : initialFeeStructures;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('schoolerp_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('schoolerp_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('schoolerp_settings');
    return saved ? JSON.parse(saved) : initialSchoolSettings;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('schoolerp_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('schoolerp_parents', JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem('schoolerp_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('schoolerp_fees', JSON.stringify(feeStructures));
  }, [feeStructures]);

  useEffect(() => {
    localStorage.setItem('schoolerp_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('schoolerp_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('schoolerp_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string, password: string, rememberMe = true) => {
    // Basic verification - handles any standard password or admin123
    if (email && password) {
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem('schoolerp_auth', 'true');
      }
      setAdminUser({
        name: 'Admin Owner',
        email: email,
        role: 'School Administrator'
      });
      showToast('success', 'Welcome Back', 'Logged in to SchoolERP dashboard successfully.');
      return true;
    }
    showToast('error', 'Login Failed', 'Please provide a valid email and password.');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('schoolerp_auth');
    showToast('info', 'Logged Out', 'Your session has been terminated safely.');
  };

  // Student Fee Summary helper
  const getStudentFeeSummary = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return { totalFee: 0, paidAmount: 0, pendingAmount: 0, status: 'Paid' as const };
    }

    // Find class fee structure
    const feeStructure = feeStructures.find((f) => f.classId === student.classId && f.status === 'Active');
    const totalFee = feeStructure ? feeStructure.annualFee : 30000;

    // Sum paid amounts
    const studentPayments = payments.filter((p) => p.studentId === studentId);
    const paidAmount = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = Math.max(0, totalFee - paidAmount);

    let status: 'Paid' | 'Pending' | 'Overdue' = 'Paid';
    if (pendingAmount > 0) {
      status = pendingAmount > totalFee * 0.5 ? 'Overdue' : 'Pending';
    }

    return { totalFee, paidAmount, pendingAmount, status };
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    // Validate unique student ID
    const exists = students.some(
      (s) => s.studentId.trim().toLowerCase() === studentData.studentId.trim().toLowerCase()
    );
    if (exists) {
      showToast('error', 'Duplicate ID', `Student ID ${studentData.studentId} already exists in the system.`);
      return false;
    }

    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update parent's linked student list
    if (studentData.parentId) {
      setParents((prev) =>
        prev.map((p) =>
          p.id === studentData.parentId
            ? { ...p, studentIds: [...p.studentIds, newStudent.id] }
            : p
        )
      );
    }

    showToast(
      'success',
      'Student Admitted',
      `${newStudent.firstName} ${newStudent.lastName} has been successfully registered in ${newStudent.className}.`
    );
    return true;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    if (updates.studentId) {
      const duplicate = students.some(
        (s) => s.id !== id && s.studentId.trim().toLowerCase() === updates.studentId?.trim().toLowerCase()
      );
      if (duplicate) {
        showToast('error', 'Duplicate ID', `Student ID ${updates.studentId} is already in use.`);
        return false;
      }
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    showToast('success', 'Profile Updated', 'Student details have been updated successfully.');
    return true;
  };

  const deactivateStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Deactivated' } : s))
    );
    showToast('info', 'Student Deactivated', 'The student record has been deactivated from active rosters.');
  };

  // Parent CRUD
  const addParent = (parentData: Omit<Parent, 'id' | 'parentId' | 'studentIds'>): Parent => {
    const count = parents.length + 1;
    const parentId = `PAR-2026-${String(count).padStart(3, '0')}`;
    const newParent: Parent = {
      ...parentData,
      id: `par-${Date.now()}`,
      parentId,
      studentIds: []
    };

    setParents((prev) => [...prev, newParent]);
    showToast('success', 'Parent Registered', `${newParent.fullName} added successfully.`);
    return newParent;
  };

  const updateParent = (id: string, updates: Partial<Parent>) => {
    setParents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('success', 'Parent Updated', 'Parent contact information updated successfully.');
    return true;
  };

  // Class CRUD
  const addClass = (clsData: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`
    };
    setClasses((prev) => [...prev, newClass]);

    // Also auto-create a standard fee structure template for this class
    const newFee: FeeStructure = {
      id: `fee-${Date.now()}`,
      classId: newClass.id,
      className: `${newClass.className} ${newClass.section}`,
      academicYear: newClass.academicYear,
      annualFee: 30000,
      termFee: 10000,
      status: 'Active',
      description: 'Standard Annual Class Curriculum Fee'
    };
    setFeeStructures((prev) => [...prev, newFee]);

    showToast('success', 'Class Created', `Class ${newClass.className} ${newClass.section} is now active.`);
    return true;
  };

  const updateClass = (id: string, updates: Partial<SchoolClass>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('success', 'Class Updated', 'Class details updated successfully.');
    return true;
  };

  const deactivateClass = (id: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Inactive' } : c))
    );
    showToast('info', 'Class Deactivated', 'Class marked as Inactive. No new student admissions allowed.');
  };

  // Fee Structure
  const addFeeStructure = (feeData: Omit<FeeStructure, 'id'>) => {
    const newFee: FeeStructure = {
      ...feeData,
      id: `fee-${Date.now()}`
    };
    setFeeStructures((prev) => [...prev, newFee]);
    showToast('success', 'Fee Structure Created', `Annual fee of ₹${newFee.annualFee.toLocaleString()} defined for ${newFee.className}.`);
    return true;
  };

  const updateFeeStructure = (id: string, updates: Partial<FeeStructure>) => {
    setFeeStructures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    showToast('success', 'Fee Structure Updated', 'Fee schedule updated.');
    return true;
  };

  // Payments
  const recordPayment = ({
    studentId,
    amount,
    paymentMode,
    date,
    receiptNumber,
    notes
  }: {
    studentId: string;
    amount: number;
    paymentMode: 'Cash' | 'UPI' | 'Bank Transfer';
    date: string;
    receiptNumber?: string;
    notes?: string;
  }) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Student record could not be found.' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Payment amount must be greater than ₹0.' };
    }

    // Strict Anti-Overpayment check
    const { pendingAmount } = getStudentFeeSummary(studentId);
    if (amount > pendingAmount) {
      return {
        success: false,
        message: `Overpayment prevented! Entered amount ₹${amount.toLocaleString()} exceeds pending due balance of ₹${pendingAmount.toLocaleString()}.`
      };
    }

    const generatedReceipt = receiptNumber || `REC-2026-${String(payments.length + 892).padStart(4, '0')}`;
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: generatedReceipt,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentRollNumber: student.rollNumber,
      classId: student.classId,
      className: `${student.className} ${student.section}`,
      amount,
      date,
      paymentMode,
      notes: notes || `Tuition fee installment received via ${paymentMode}`,
      status: 'Paid'
    };

    setPayments((prev) => [newPayment, ...prev]);
    setActiveReceipt(newPayment);

    showToast(
      'success',
      'Payment Recorded',
      `Payment of ₹${amount.toLocaleString()} recorded for ${student.firstName} ${student.lastName}. Receipt #${generatedReceipt} generated.`
    );

    return {
      success: true,
      message: 'Payment recorded successfully',
      receipt: newPayment
    };
  };

  // Attendance
  const saveAttendanceForDate = (
    date: string,
    records: { studentId: string; status: AttendanceStatus }[]
  ) => {
    const newRecords: AttendanceRecord[] = records.map((rec) => {
      const student = students.find((s) => s.id === rec.studentId);
      return {
        id: `att-${Date.now()}-${rec.studentId}`,
        studentId: rec.studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        classId: student?.classId || '',
        className: student?.className || '',
        section: student?.section || '',
        date,
        status: rec.status,
        markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });

    // Replace any existing records for this date and students, avoiding duplicates
    setAttendanceRecords((prev) => {
      const studentIdsMarked = new Set(records.map((r) => r.studentId));
      const filtered = prev.filter(
        (item) => !(item.date === date && studentIdsMarked.has(item.studentId))
      );
      return [...filtered, ...newRecords];
    });

    const presentCount = records.filter((r) => r.status === 'Present').length;
    showToast(
      'success',
      'Attendance Saved',
      `Attendance for ${records.length} students on ${date} saved. (${presentCount} Present, ${records.length - presentCount} Absent).`
    );
  };

  const getAttendanceForDate = (date: string, classId?: string) => {
    return attendanceRecords.filter((rec) => {
      const dateMatch = rec.date === date;
      const classMatch = !classId || classId === 'all' || rec.classId === classId;
      return dateMatch && classMatch;
    });
  };

  // Settings
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('success', 'Settings Saved', 'School details and academic configuration updated.');
  };

  const resetAllDataToDemo = () => {
    setStudents(initialStudents);
    setParents(initialParents);
    setClasses(initialClasses);
    setFeeStructures(initialFeeStructures);
    setPayments(initialPayments);
    setAttendanceRecords(initialAttendanceRecords);
    setSettings(initialSchoolSettings);
    localStorage.clear();
    showToast('info', 'Demo Data Reset', 'All records have been restored to sample school state.');
  };

  // Navigation helpers
  const viewStudentDetails = (id: string) => {
    setSelectedStudentId(id);
    setCurrentScreen('student-details');
  };

  const navigateToEditStudent = (id: string) => {
    setSelectedStudentId(id);
    setCurrentScreen('edit-student');
  };

  const navigateToAddStudent = () => {
    setSelectedStudentId(null);
    setCurrentScreen('add-student');
  };

  const navigateToCollectFee = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setCurrentScreen('fee-collection');
  };

  const navigateToReportDetail = (type: 'student' | 'attendance' | 'fee') => {
    setSelectedReportType(type);
    setCurrentScreen('report-detail');
  };

  return (
    <SchoolContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedStudentId,
        setSelectedStudentId,
        selectedParentId,
        setSelectedParentId,
        selectedReportType,
        setSelectedReportType,
        viewStudentDetails,
        navigateToEditStudent,
        navigateToAddStudent,
        navigateToCollectFee,
        navigateToReportDetail,
        isAuthenticated,
        adminUser,
        login,
        logout,
        students,
        parents,
        classes,
        feeStructures,
        payments,
        attendanceRecords,
        settings,
        addStudent,
        updateStudent,
        deactivateStudent,
        addParent,
        updateParent,
        addClass,
        updateClass,
        deactivateClass,
        addFeeStructure,
        updateFeeStructure,
        recordPayment,
        getStudentFeeSummary,
        saveAttendanceForDate,
        getAttendanceForDate,
        updateSettings,
        resetAllDataToDemo,
        toasts,
        showToast,
        removeToast,
        activeReceipt,
        setActiveReceipt,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
