import React, { useState } from 'react';
import ChatBot from './components/customer/ChatBot';
import BuilderChatBot from './components/builder/BuilderChatBot';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import TopNavbar from './components/layout/TopNavbar';
import Sidebar from './components/layout/Sidebar';

// 1. Customer Views
import CustomerDashboardView from './components/dashboard/CustomerDashboardView';
import CustomerMyProjectView from './components/customer/CustomerMyProjectView';
import CustomerProgressView from './components/customer/CustomerProgressView';
import CustomerTimelineView from './components/customer/CustomerTimelineView';
import CustomerPaymentsView from './components/customer/CustomerPaymentsView';
import CustomerDocumentsView from './components/customer/CustomerDocumentsView';
import CustomerMessagesView from './components/customer/CustomerMessagesView';
import CustomerSupportView from './components/customer/CustomerSupportView';
import CustomerProfileView from './components/customer/CustomerProfileView';
import CustomerFindBuildersView from './components/customer/CustomerFindBuildersView';

// 2. Builder Views
import DashboardView from './components/dashboard/DashboardView'; // Builder Dashboard
import MyCustomersView from './components/customers/MyCustomersView';
import MyProjectsView from './components/projects/MyProjectsView';
import ProjectProgressView from './components/projects/ProjectProgressView';
import CompletedProjectsView from './components/projects/CompletedProjectsView';
import CustomerRequestsView from './components/customers/CustomerRequestsView';
import BuilderReportsView from './components/reports/BuilderReportsView';
import BuilderProfileView from './components/profile/BuilderProfileView';

// 3. Administrator Views
import AdminDashboardView from './components/dashboard/AdminDashboardView';
import BuildersView from './components/builders/BuildersView';
import CustomersView from './components/customers/CustomersView';
import WorkersView from './components/workers/WorkersView';
import ProjectsView from './components/projects/ProjectsView';
import ReportsView from './components/reports/ReportsView';
import MessagesView from './components/messages/MessagesView';
import SettingsView from './components/settings/SettingsView';

// Universal Modals
import EntityModal from './components/common/EntityModal';
import SearchModal from './components/common/SearchModal';
import NotificationDrawer from './components/common/NotificationDrawer';
import CalendarModal from './components/common/CalendarModal';
import ProjectDetailModal from './components/projects/ProjectDetailModal';

function MainLayout() {
  const { currentTab, currentUser, isAuthenticated, authStep } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isCustomerLogin = authStep === 'login-customer' || authStep === 'register-customer';
  const isBuilderLogin = authStep === 'login-builder' || authStep === 'register-builder';
  const isRoleSelection = authStep === 'role-selection';

  // If user is not authenticated, display Role Selection & Login Pages with respective ChatBots
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <LoginPage />
        {/* Customer ChatBot on Customer Login, Registration & Welcome screen */}
        {(isCustomerLogin || isRoleSelection) && <ChatBot />}
        {/* Builder ChatBot on Builder Login & Registration */}
        {isBuilderLogin && <BuilderChatBot />}
      </div>
    );
  }

  const userRole = (currentUser?.role || '').toLowerCase();
  const isCustomer = userRole === 'customer';
  const isBuilder = userRole === 'builder';

  const renderActiveView = () => {
    // 1. CUSTOMER ROLE VIEWS
    if (isCustomer) {
      switch (currentTab) {
        case 'dashboard':
          return <CustomerDashboardView />;
        case 'my-project':
          return <CustomerMyProjectView />;
        case 'find-builders':
          return <CustomerFindBuildersView />;
        case 'project-progress':
          return <CustomerProgressView />;
        case 'project-timeline':
          return <CustomerTimelineView />;
        case 'payments':
          return <CustomerPaymentsView />;
        case 'documents':
          return <CustomerDocumentsView />;
        case 'messages':
          return <CustomerMessagesView />;
        case 'support':
          return <CustomerSupportView />;
        case 'profile':
          return <CustomerProfileView />;
        default:
          return <CustomerDashboardView />;
      }
    } 
    // 2. BUILDER ROLE VIEWS
    else if (isBuilder) {
      switch (currentTab) {
        case 'dashboard':
          return <DashboardView />;
        case 'customers':
          return <MyCustomersView />;
        case 'my-projects':
          return <MyProjectsView />;
        case 'project-progress':
          return <ProjectProgressView />;
        case 'completed-projects':
          return <CompletedProjectsView />;
        case 'customer-requests':
          return <CustomerRequestsView />;
        case 'reports':
          return <BuilderReportsView />;
        case 'profile':
          return <BuilderProfileView />;
        default:
          return <DashboardView />;
      }
    } 
    // 3. ADMINISTRATOR ROLE VIEWS
    else {
      switch (currentTab) {
        case 'dashboard':
          return <AdminDashboardView />;
        case 'builders':
          return <BuildersView />;
        case 'customers':
          return <CustomersView />;
        case 'workers':
          return <WorkersView />;
        case 'projects':
          return <ProjectsView />;
        case 'reports':
          return <ReportsView />;
        case 'messages':
          return <MessagesView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <AdminDashboardView />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FF] text-[#101D3A] flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Left Sidebar — Full Height Left Panel matching reference */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar for Builder & Admin, or Mobile Topbar for Customer */}
        {!isCustomer ? (
          <TopNavbar
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            isMobileSidebarOpen={isMobileSidebarOpen}
          />
        ) : (
          /* Mobile only header bar with toggle for Customer view */
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#071535] text-white shrink-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Open Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Build Hub</span>
            </div>
            <div className="w-8" />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-7 w-full max-w-[1550px] mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* 3. Global Universal Modals */}
      <EntityModal />
      <SearchModal />
      <NotificationDrawer />
      <CalendarModal />
      <ProjectDetailModal />

      {/* 4. AI Chatbots — Customer and Builder Portals */}
      {isCustomer && <ChatBot />}
      {isBuilder && <BuilderChatBot />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
