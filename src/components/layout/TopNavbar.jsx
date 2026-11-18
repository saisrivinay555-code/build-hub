import React, { useState } from 'react';
import buildHubBrandHeaderImg from '../../assets/buildhub-brand-hires-trans.png';
import { 
  Building2, 
  Search, 
  Bell, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Menu, 
  X,
  Shield,
  HardHat,
  Home,
  User,
  LogOut,
  Settings,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TopNavbar({ onToggleMobileSidebar, isMobileSidebarOpen }) {
  const { 
    currentUser, 
    setIsSearchOpen, 
    setIsNotificationsOpen, 
    setIsCalendarOpen,
    unreadNotifCount,
    setCurrentTab,
    logout,
    loginAsRole
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const userRole = (currentUser?.role || '').toLowerCase();
  const isCustomer = userRole === 'customer';
  const isBuilder = userRole === 'builder';
  const isAdmin = userRole === 'admin' || userRole === 'administrator';

  const searchPlaceholder = isCustomer
    ? 'Search builders, projects, materials...'
    : isBuilder
    ? 'Search customers, projects...'
    : 'Search builders, customers, projects...';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-6 bg-[#071739] border-b border-[#142646] text-white shadow-md">
      {/* Left Branding & Mobile Toggle */}
      <div className="flex items-center gap-3 md:gap-4 min-w-[220px]">
        <button 
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#162a4d] transition"
          aria-label="Toggle Navigation"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center cursor-pointer select-none group"
        >
          <img
            src={buildHubBrandHeaderImg}
            alt="Build Hub - Smart Construction"
            className="h-9 w-auto object-contain transition group-hover:scale-102"
          />
        </div>
      </div>

      {/* Center Search Bar matching active role */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="relative w-full flex items-center bg-[#102244] hover:bg-[#152a54] border border-[#1b345e] focus-within:border-blue-500 rounded-xl px-3.5 py-2 cursor-pointer transition text-gray-300"
        >
          <Search size={17} className="text-gray-400 mr-2.5 shrink-0" />
          <input 
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none cursor-pointer"
            readOnly
            onClick={() => setIsSearchOpen(true)}
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-[#091734] border border-gray-700 rounded-md">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right User & Tools Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Button */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#142646] transition"
          title="Search"
        >
          <Search size={20} />
        </button>

        {/* Messages Shortcut (especially prominent for customer) */}
        {isCustomer && (
          <button
            onClick={() => setCurrentTab('messages')}
            className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-[#142646] transition focus:outline-none cursor-pointer relative"
            title="Chat with Builder"
          >
            <MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>
        )}

        {/* Notifications Icon Button */}
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-[#142646] transition focus:outline-none cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm">
            {isCustomer ? '2' : '3'}
          </span>
        </button>

        {/* Calendar Picker Icon Button */}
        <button 
          onClick={() => setIsCalendarOpen(true)}
          className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-[#142646] transition focus:outline-none cursor-pointer"
          title="Project Schedule Calendar"
        >
          <CalendarIcon size={20} />
        </button>

        {/* Divider */}
        <div className="h-7 w-[1px] bg-[#1d355c] mx-0.5 hidden sm:block" />

        {/* User Profile Badge */}
        <div className="relative">
          <button 
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-[#142646] transition border border-transparent hover:border-[#223d68] cursor-pointer"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className={`w-9 h-9 rounded-full object-cover ring-2 ${
                isCustomer ? 'ring-purple-400' : isBuilder ? 'ring-amber-400' : 'ring-blue-400'
              }`}
            />
            <div className="hidden lg:block text-left">
              <div className="text-sm font-semibold text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] font-medium text-blue-300 flex items-center gap-1">
                <span>{currentUser.role}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </div>
            </div>
          </button>

          {/* Profile & Switcher Dropdown */}
          {isRoleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-[#0a1831] border border-[#1f375f] rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setIsRoleDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#162a4d] mb-1.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed In Profile</p>
                <p className="text-xs text-white font-bold mt-0.5">{currentUser.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  isCustomer 
                    ? 'text-purple-300 bg-purple-900/40 border border-purple-500/30'
                    : isBuilder 
                    ? 'text-amber-300 bg-amber-900/40 border border-amber-500/30'
                    : 'text-blue-300 bg-blue-900/40 border border-blue-500/30'
                }`}>
                  {isCustomer ? '🏡 Customer' : isBuilder ? '🏗️ Builder' : '🛡️ Administrator'}
                </span>
              </div>

              {/* Instant Role Testing Switcher */}
              <div className="space-y-1">
                <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Switch Dashboard View:
                </p>

                <button
                  onClick={() => {
                    loginAsRole('Customer');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer ${
                    isCustomer ? 'bg-[#8B5CF6] text-white font-bold' : 'text-gray-300 hover:bg-[#142646] hover:text-white'
                  }`}
                >
                  <Home size={15} />
                  <span>Customer Dashboard (Ramesh)</span>
                </button>

                <button
                  onClick={() => {
                    loginAsRole('Builder');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer ${
                    isBuilder ? 'bg-amber-600 text-white font-bold' : 'text-gray-300 hover:bg-[#142646] hover:text-white'
                  }`}
                >
                  <HardHat size={15} />
                  <span>Builder Dashboard (Vinay)</span>
                </button>

                <button
                  onClick={() => {
                    loginAsRole('Administrator');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer ${
                    isAdmin ? 'bg-blue-600 text-white font-bold' : 'text-gray-300 hover:bg-[#142646] hover:text-white'
                  }`}
                >
                  <Shield size={15} />
                  <span>Admin Master Dashboard</span>
                </button>
              </div>

              <div className="pt-2 mt-2 border-t border-[#162a4d] px-1 space-y-1">
                <button
                  onClick={() => {
                    setCurrentTab(isCustomer ? 'profile' : isBuilder ? 'profile' : 'settings');
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-[#142646] transition cursor-pointer"
                >
                  <Settings size={14} />
                  <span>My Profile & Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/30 transition cursor-pointer font-bold"
                >
                  <LogOut size={14} />
                  <span>Sign Out to Role Selection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
