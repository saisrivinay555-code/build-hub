import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Building 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CalendarModal() {
  const { 
    isCalendarOpen, 
    setIsCalendarOpen, 
    projects, 
    setSelectedProjectForDetail 
  } = useApp();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // August (0-indexed)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (!isCalendarOpen) return null;

  // Calendar dates mock grid for August 2025
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const augustDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // Map deadlines to days
  const eventsByDay = {
    8: [{ title: 'Wood Polish & Cleaning (Home Renovation)', type: 'milestone', color: 'bg-emerald-500' }],
    10: [{ title: 'Home Renovation Final Delivery', project: 'Home Renovation', type: 'deadline', color: 'bg-emerald-600' }],
    18: [{ title: 'Today: Foundation Review', type: 'today', color: 'bg-blue-600' }],
    25: [{ title: 'HVAC Network Pressure Test', project: 'Office Building', type: 'inspection', color: 'bg-purple-500' }],
    28: [{ title: 'NABH Audit (Urban Health Clinic)', project: 'Urban Health Clinic', type: 'milestone', color: 'bg-amber-500' }],
    30: [{ title: 'Residential Villa Delivery', project: 'Residential Villa', type: 'deadline', color: 'bg-blue-600' }]
  };

  const handleOpenProject = (projectName) => {
    const proj = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (proj) {
      setIsCalendarOpen(false);
      setSelectedProjectForDetail(proj);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#08152c] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Project Deadlines & Site Schedule</h3>
              <p className="text-xs text-gray-300">Construction handover targets & milestones</p>
            </div>
          </div>

          <button
            onClick={() => setIsCalendarOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Month Selector Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#1B2559]">
            {months[currentMonthIndex]} 2025
          </h4>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11))}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold text-gray-500 px-2">Month</span>
            <button
              onClick={() => setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0))}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Blank offset for August 2025 (Starts on Friday, 5 empty days) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 bg-gray-50/40 rounded-xl" />
            ))}

            {augustDays.map(day => {
              const events = eventsByDay[day];
              const isToday = day === 18;

              return (
                <div
                  key={day}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between transition ${
                    isToday
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/40'
                      : events
                      ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xs'
                      : 'bg-white border-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Event indicator */}
                  {events && (
                    <div className="space-y-0.5">
                      {events.map((ev, i) => (
                        <div
                          key={i}
                          onClick={() => ev.project && handleOpenProject(ev.project)}
                          className={`text-[9px] sm:text-[10px] font-semibold text-white px-1 py-0.5 rounded truncate ${ev.color} ${ev.project ? 'cursor-pointer hover:opacity-90' : ''}`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Upcoming Deliveries */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Deadline
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Completed
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Inspection
            </span>
          </div>

          <button
            onClick={() => setIsCalendarOpen(false)}
            className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
