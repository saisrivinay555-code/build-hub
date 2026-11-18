import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProjectStatusChart() {
  const { 
    projects,
    totalProjectsCount,
    ongoingProjectsCount, 
    completedProjectsCount, 
    pendingProjectsCount,
    setCurrentTab
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All Projects');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['All Projects', 'Residential', 'Commercial', 'Renovation', 'Industrial'];

  // Filter projects if category selected
  const filteredProjects = categoryFilter === 'All Projects' 
    ? projects 
    : projects.filter(p => p.type.toLowerCase() === categoryFilter.toLowerCase());

  const currentTotal = filteredProjects.length || totalProjectsCount;
  const ongoing = filteredProjects.filter(p => p.status === 'Ongoing').length;
  const completed = filteredProjects.filter(p => p.status === 'Completed').length;
  const pending = filteredProjects.filter(p => p.status === 'Pending').length;

  const data = [
    { name: 'Ongoing', value: ongoing || 8, color: '#1E60FF', percent: Math.round(((ongoing || 8) / currentTotal) * 100) },
    { name: 'Completed', value: completed || 4, color: '#10B981', percent: Math.round(((completed || 4) / currentTotal) * 100) },
    { name: 'Pending', value: pending || 2, color: '#F59E0B', percent: Math.round(((pending || 2) / currentTotal) * 100) },
  ];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-[#0A1931] border border-[#1f375f] text-white px-3 py-2 rounded-xl text-xs shadow-xl font-medium">
          <p className="flex items-center gap-1.5" style={{ color: item.payload.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
            {item.name}: <span className="font-bold text-white ml-1">{item.value} ({item.payload.percent}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between">
      {/* Header & Category Dropdown */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <PieIcon size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1B2559]">Project Status</h3>
            <p className="text-xs text-gray-500">Breakdown by current lifecycle stage</p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F7FE] hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
          >
            <span>{categoryFilter}</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 transition ${
                    categoryFilter === cat ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart & Legend layout */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 my-auto py-2">
        {/* Donut with Center Text */}
        <div className="sm:col-span-7 relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-[#1B2559] leading-tight">
              {currentTotal}
            </span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Projects
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="sm:col-span-5 space-y-3.5 pr-2">
          {data.map((item) => (
            <div 
              key={item.name}
              onClick={() => setCurrentTab('projects')}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-3 h-3 rounded-full shrink-0 group-hover:scale-125 transition-transform" 
                  style={{ backgroundColor: item.color }} 
                />
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    {item.name}
                  </div>
                  <div className="text-[11px] font-medium text-gray-500">
                    {item.value} Projects ({item.percent}%)
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
