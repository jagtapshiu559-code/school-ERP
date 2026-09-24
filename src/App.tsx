import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { ReceiptModal } from './components/common/ReceiptModal';

import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { StudentsListScreen } from './components/screens/StudentsListScreen';
import { StudentDetailsScreen } from './components/screens/StudentDetailsScreen';
import { AddEditStudentScreen } from './components/screens/AddEditStudentScreen';
import { ParentsListScreen } from './components/screens/ParentsListScreen';
import { ClassesListScreen } from './components/screens/ClassesListScreen';
import { AttendanceScreen } from './components/screens/AttendanceScreen';
import { AttendanceHistoryScreen } from './components/screens/AttendanceHistoryScreen';
import { FeesScreen } from './components/screens/FeesScreen';
import { FeeCollectionScreen } from './components/screens/FeeCollectionScreen';
import { PendingFeesScreen } from './components/screens/PendingFeesScreen';
import { PaymentHistoryScreen } from './components/screens/PaymentHistoryScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { ReportDetailScreen } from './components/screens/ReportDetailScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentScreen } = useSchool();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'students':
        return <StudentsListScreen />;
      case 'student-details':
        return <StudentDetailsScreen />;
      case 'add-student':
      case 'edit-student':
        return <AddEditStudentScreen />;
      case 'parents':
        return <ParentsListScreen />;
      case 'classes':
        return <ClassesListScreen />;
      case 'attendance':
        return <AttendanceScreen />;
      case 'attendance-history':
        return <AttendanceHistoryScreen />;
      case 'fees':
        return <FeesScreen />;
      case 'fee-collection':
        return <FeeCollectionScreen />;
      case 'pending-fees':
        return <PendingFeesScreen />;
      case 'payments':
        return <PaymentHistoryScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'report-detail':
        return <ReportDetailScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col antialiased font-sans text-slate-800">
      {/* Fixed Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderScreen()}
        </main>
      </div>

      {/* Modals & Overlays */}
      <ReceiptModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}

export default App;
