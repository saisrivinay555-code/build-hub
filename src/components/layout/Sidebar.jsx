import React from 'react';
import {
  LayoutDashboard,
  Home,
  Search,
  TrendingUp,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  HelpCircle,
  User,
  Users,
  FolderKanban,
  CheckCircle2,
  FileBarChart,
  Building2,
  HardHat,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import buildHubBrandHeaderImg from '../../assets/buildhub-brand-hires-trans.png';
import sidebarCraneImg from '../../assets/sidebar-crane-bottom.png';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { currentTab, setCurrentTab, currentUser, logout } = useApp();

  const userRole = (currentUser?.role || '').toLowerCase();
  const isCustomer = userRole === 'customer';
  const isBuilder = userRole === 'builder';

  // 1. CUSTOMER NAVIGATION (10 Items matching prompt & reference image)
  const customerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-project', label: 'My Project', icon: Home },
    { id: 'find-builders', label: 'Find Builders', icon: Search },
    { id: 'project-progress', label: 'Project Progress', icon: TrendingUp },
    { id: 'project-timeline', label: 'Project Timeline', icon: Clock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 'Live' },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  // 2. BUILDER NAVIGATION
  const builderNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'My Customers', icon: Users },
    { id: 'my-projects', label: 'My Projects', icon: FolderKanban },
    { id: 'project-progress', label: 'Project Progress', icon: TrendingUp },
    { id: 'completed-projects', label: 'Completed Projects', icon: CheckCircle2 },
    { id: 'customer-requests', label: 'Customer Requests', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  // 3. ADMINISTRATOR NAVIGATION
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builders', label: 'Builders', icon: Building2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'workers', label: 'Workers', icon: HardHat },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 4 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const currentNavItems = isCustomer 
    ? customerNavItems 
    : isBuilder 
    ? builderNavItems 
    : adminNavItems;

  const handleNavClick = (id) => {
    setCurrentTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out and return to the Role Selection screen?')) {
      logout();
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#071535] border-r border-[#102244] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen overflow-y-auto select-none shrink-0`}
      >
        <div className="flex flex-col flex-1">
          {/* Top Brand Logo matching exact reference */}
          <div 
            onClick={() => setCurrentTab(isCustomer ? 'find-builders' : 'dashboard')} 
            className="flex items-center px-4 pt-5 pb-5 cursor-pointer group"
          >
            <img 
              src={buildHubBrandHeaderImg} 
              alt="Build Hub - Smart Construction" 
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-md group-hover:scale-102 transition-transform" 
            />
          </div>

          {/* Navigation Links */}
          <div className="px-3 space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? isCustomer 
                        ? 'bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] text-white font-bold shadow-lg shadow-purple-600/35' 
                        : 'bg-[#1E60FF] text-white font-bold shadow-lg shadow-blue-600/35' 
                      : 'text-gray-300 hover:bg-[#0E2046] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badge === 'Live'
                        ? 'bg-[#D946EF] text-white shadow-xs'
                        : isActive ? 'bg-white text-purple-700' : 'bg-purple-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Crane Blueprint & Logout */}
        <div className="mt-auto relative pt-4">
          {/* Subtle logout button */}
          <div className="px-4 pb-2 relative z-10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>Sign Out ({currentUser.name?.split(' ')[0] || 'User'})</span>
            </button>
          </div>

          {/* Crane Blueprint Image at bottom of sidebar matching reference */}
          <div className="relative overflow-hidden pointer-events-none select-none">
            <img
              src={sidebarCraneImg}
              alt="Architecture Blueprint Crane"
              className="w-full h-auto object-cover opacity-85 block"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
