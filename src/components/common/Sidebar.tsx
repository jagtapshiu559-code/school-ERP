import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  RotateCcw,
  Sparkles,
  School
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ScreenId } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentScreen, setCurrentScreen, students, classes, logout, resetAllDataToDemo, adminUser, settings } =
    useSchool();

  const activeStudentCount = students.filter((s) => s.status === 'Active').length;

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'students',
      label: 'Students',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: activeStudentCount
    },
    {
      id: 'parents',
      label: 'Parents',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: <BookOpen className="w-5 h-5" />,
      badge: classes.filter((c) => c.status === 'Active').length
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <CalendarCheck className="w-5 h-5" />
    },
    {
      id: 'fees',
      label: 'Fees',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <Receipt className="w-5 h-5" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const handleNavClick = (id: ScreenId) => {
    setCurrentScreen(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <School className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-lg text-slate-900 tracking-tight leading-tight">
                  SchoolERP
                </span>
                <span className="text-[11px] font-medium text-slate-500 truncate">
                  AY {settings.academicYear}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="px-3 pt-4 pb-2">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Menu
            </p>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  currentScreen === item.id ||
                  (item.id === 'students' &&
                    ['student-details', 'add-student', 'edit-student'].includes(currentScreen)) ||
                  (item.id === 'attendance' && currentScreen === 'attendance-history') ||
                  (item.id === 'fees' && ['fee-collection', 'pending-fees'].includes(currentScreen)) ||
                  (item.id === 'reports' && currentScreen === 'report-detail');

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? 'bg-blue-200/70 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Area: System Badge & User Info & Logout */}
        <div className="p-3 border-t border-slate-100 flex flex-col gap-2 bg-slate-50/50">
          {/* Quick Demo Reset Helper */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo school data to initial defaults?')) {
                resetAllDataToDemo();
              }
            }}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs text-slate-500 hover:text-blue-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Reset to default mock data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {/* Admin User Card */}
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                AD
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate leading-tight">
                  {adminUser?.name || 'School Admin'}
                </span>
                <span className="text-[11px] text-slate-500 truncate leading-tight">
                  Admin / Owner
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
