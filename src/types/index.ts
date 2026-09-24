export type StudentStatus = 'Active' | 'Inactive' | 'Deactivated';

export interface Student {
  id: string;
  studentId: string; // e.g. STU-2026-001
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  className: string;
  section: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  admissionDate: string;
  rollNumber: string;
  status: StudentStatus;
  bloodGroup?: string;
  avatarUrl?: string;
}

export interface Parent {
  id: string;
  parentId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  occupation?: string;
  studentIds: string[]; // Linked student IDs
}

export interface SchoolClass {
  id: string;
  className: string; // e.g. Nursery, Junior KG, Senior KG, Grade 1
  section: string; // A, B
  academicYear: string; // 2026–27
  classTeacherName: string;
  capacity: number;
  status: 'Active' | 'Inactive';
}

export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  section: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedAt: string;
}

export interface FeeStructure {
  id: string;
  classId: string;
  className: string;
  academicYear: string;
  annualFee: number;
  termFee?: number;
  status: 'Active' | 'Inactive';
  description?: string;
}

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. REC-2026-0891
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  classId: string;
  className: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  notes?: string;
  status: 'Paid' | 'Processing';
}

export interface SchoolSettings {
  schoolName: string;
  schoolCode: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  currency: string;
  principalName: string;
  affiliationNumber: string;
}

export type ScreenId =
  | 'dashboard'
  | 'students'
  | 'student-details'
  | 'add-student'
  | 'edit-student'
  | 'parents'
  | 'classes'
  | 'attendance'
  | 'attendance-history'
  | 'fees'
  | 'fee-collection'
  | 'pending-fees'
  | 'payments'
  | 'reports'
  | 'report-detail'
  | 'settings';
