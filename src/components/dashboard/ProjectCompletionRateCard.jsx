import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProjectCompletionRateCard() {
  const { completedProjectsCount, ongoingProjectsCount, upcomingProjectsCount } = useApp();

  const percentage = 60; // Matching screenshot: 60%

  // SVG Circular Progress values
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-50">
        <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
          <BarChart2 size={19} />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Project Completion Rate</h3>
      </div>

      {/* Center Circular Progress Ring & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-3 my-auto">
        {/* SVG Circular Ring matching screenshot */}
        <div className="sm:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-gray-100"
                strokeWidth="9"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Green Active Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#10B981] transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-[#0B1A30] leading-none">
                {percentage}%
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-gray-500 mt-1.5">
            Completed Projects
          </span>
        </div>

        {/* Breakdown List on Right matching screenshot */}
        <div className="sm:col-span-6 space-y-2.5 pl-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span>Completed</span>
            </div>
            <span className="font-bold text-gray-900 font-mono">12</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E60FF]" />
              <span>Ongoing</span>
            </div>
            <span className="font-bold text-gray-900 font-mono">8</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span>Upcoming</span>
            </div>
            <span className="font-bold text-gray-900 font-mono">4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
