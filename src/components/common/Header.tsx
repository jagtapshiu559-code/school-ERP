import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  UserPlus,
  CreditCard,
  CalendarCheck,
  BookOpen,
  Users,
  LogOut,
  Settings as SettingsIcon,
  ChevronDown,
  X,
  GraduationCap
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ScreenId } from '../../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentScreen,
    setCurrentScreen,
    navigateToAddStudent,
    navigateToCollectFee,
    students,
    parents,
    classes,
    viewStudentDetails,
    adminUser,
    logout,
    settings
  } = useSchool();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const actionRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const searchResults = React.useMemo(() => {
    if (!localSearch.trim()) return { students: [], parents: [], classes: [] };
    const q = localSearch.toLowerCase();
    const matchedStudents = students
      .filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedParents = parents
      .filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedClasses = classes
      .filter(
        (c) =>
          c.className.toLowerCase().includes(q) ||
          c.section.toLowerCase().includes(q) ||
          c.classTeacherName.toLowerCase().includes(q)
      )
      .slice(0, 3);

    return { students: matchedStudents, parents: matchedParents, classes: matchedClasses };
  }, [localSearch, students, parents, classes]);

  const hasResults =
    searchResults.students.length > 0 ||
    searchResults.parents.length > 0 ||
    searchResults.classes.length > 0;

  // Title and Breadcrumbs derivation
  const getScreenDetails = (): { title: string; breadcrumb: string } => {
    switch (currentScreen) {
      case 'dashboard':
        return { title: 'Dashboard', breadcrumb: 'Overview' };
      case 'students':
        return { title: 'Students', breadcrumb: 'Admissions & Directory' };
      case 'student-details':
        return { title: 'Student Profile', breadcrumb: 'Students / Profile & Ledger' };
      case 'add-student':
        return { title: 'Add New Student', breadcrumb: 'Students / Admission' };
      case 'edit-student':
        return { title: 'Edit Student', breadcrumb: 'Students / Edit Record' };
      case 'parents':
        return { title: 'Parents & Guardians', breadcrumb: 'Directory' };
      case 'classes':
        return { title: 'Classes & Sections', breadcrumb: 'Academics' };
      case 'attendance':
        return { title: 'Attendance', breadcrumb: 'Daily Roll Call' };
      case 'attendance-history':
        return { title: 'Attendance History', breadcrumb: 'Attendance / Historical Records' };
      case 'fees':
        return { title: 'Fee Management', breadcrumb: 'Fee Structures & Schedules' };
      case 'fee-collection':
        return { title: 'Collect Fee', breadcrumb: 'Fees / Record Payment' };
      case 'pending-fees':
        return { title: 'Pending Fees', breadcrumb: 'Fees / Outstanding Dues' };
      case 'payments':
        return { title: 'Payment History', breadcrumb: 'Financial Ledgers & Receipts' };
      case 'reports':
        return { title: 'Reports', breadcrumb: 'Operational Analytics' };
      case 'report-detail':
        return { title: 'Report Details', breadcrumb: 'Reports / Comprehensive Breakdown' };
      case 'settings':
        return { title: 'Settings', breadcrumb: 'School & Account Configuration' };
      default:
        return { title: 'SchoolERP', breadcrumb: 'Admin Console' };
    }
  };

  const { title, breadcrumb } = getScreenDetails();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>SchoolERP</span>
            <span>/</span>
            <span className="font-medium text-slate-700">{breadcrumb}</span>
          </div>
          <h1 className="font-display font-bold text-lg text-slate-900 leading-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students, parents, roll numbers..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Popover */}
        {searchFocused && localSearch.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()} // prevent input blur
          >
            {hasResults ? (
              <div className="space-y-3 px-1">
                {searchResults.students.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Students
                    </div>
                    {searchResults.students.map((stu) => (
                      <button
                        key={stu.id}
                        onClick={() => {
                          viewStudentDetails(stu.id);
                          setSearchFocused(false);
                          setLocalSearch('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
                            {stu.firstName[0]}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 block leading-tight">
                              {stu.firstName} {stu.lastName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {stu.rollNumber} • {stu.className} {stu.section}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600">
                          View profile &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.parents.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Parents
                    </div>
                    {searchResults.parents.map((par) => (
                      <button
                        key={par.id}
                        onClick={() => {
                          setCurrentScreen('parents');
                          setSearchFocused(false);
                          setLocalSearch('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-sm font-semibold text-slate-900 block leading-tight">
                            {par.fullName}
                          </span>
                          <span className="text-xs text-slate-500">{par.phone}</span>
                        </div>
                        <span className="text-xs text-slate-400">View in list</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 px-4 text-center text-sm text-slate-500">
                No matching records found for "{localSearch}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* + New Action Primary Dropdown */}
        <div className="relative" ref={actionRef}>
          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Action</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${actionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {actionsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Quick Shortcuts
              </div>
              <button
                onClick={() => {
                  navigateToAddStudent();
                  setActionsOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Admit New Student</span>
              </button>
              <button
                onClick={() => {
                  navigateToCollectFee();
                  setActionsOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Collect Fee Payment</span>
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('attendance');
                  setActionsOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <span>Mark Attendance</span>
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('classes');
                  setActionsOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Manage Classes</span>
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('parents');
                  setActionsOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>Add / Manage Parents</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="font-semibold text-sm text-slate-900">Notifications</span>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="p-3 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900">Overdue Fees Reminder</span>
                    <span className="text-[10px] text-slate-400">10m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    46 students have outstanding tuition installments due for Q2.
                  </p>
                </div>
                <div className="p-3 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900">Attendance Logged</span>
                    <span className="text-[10px] text-slate-400">1h ago</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Morning roll-call verified for all 8 classes. Overall attendance 94.2%.
                  </p>
                </div>
                <div className="p-3 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900">Term 2 Admissions</span>
                    <span className="text-[10px] text-slate-400">Yesterday</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Admission seats for Nursery A and Junior KG A are at 92% capacity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Admin Avatar & Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-100">
              AD
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {adminUser?.name || 'Admin Owner'}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">
                Principal / Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{adminUser?.name || 'School Owner'}</p>
                <p className="text-[11px] text-slate-500 truncate">{adminUser?.email}</p>
              </div>
              <button
                onClick={() => {
                  setCurrentScreen('settings');
                  setUserMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                <span>School Settings</span>
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('reports');
                  setUserMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>View Reports</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
