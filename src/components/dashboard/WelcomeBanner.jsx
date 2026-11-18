import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, HardHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WelcomeBanner() {
  const { currentUser, setIsCalendarOpen } = useApp();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentDateTime(`${datePart}\n${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100/90 shadow-xs">
      <div className="flex items-center gap-3.5">
        {/* Yellow/Orange Hard Hat Avatar Icon matching screenshot */}
        <div className="w-12 h-12 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0 shadow-2xs">
          <HardHat size={26} className="stroke-[2.2]" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
            Welcome Back, <span className="text-[#1E60FF]">{currentUser.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Manage Your Customers and Projects Efficiently
          </p>
        </div>
      </div>

      {/* Date Card on Right matching screenshot */}
      <button 
        onClick={() => setIsCalendarOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 bg-[#F4F7FE] hover:bg-blue-50 border border-gray-200/80 hover:border-blue-200 rounded-xl text-gray-700 transition group self-start sm:self-auto cursor-pointer"
        title="Open Construction Calendar"
      >
        <div className="p-1.5 bg-white rounded-lg shadow-2xs text-[#1E60FF] group-hover:scale-110 transition">
          <CalendarIcon size={18} />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-[#0B1A30]">
            Mon, Aug 18, 2025
          </div>
          <div className="text-[11px] font-semibold text-gray-500">
            11:00 AM
          </div>
        </div>
      </button>
    </div>
  );
}
