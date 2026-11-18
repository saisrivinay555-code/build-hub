import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Building2, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProjectOverviewChart() {
  const { setCurrentTab, ongoingProjectsCount, completedProjectsCount, upcomingProjectsCount } = useApp();

  // Data matching the screenshot donut breakdown:
  // Ongoing: 8 (40%), Completed: 8 (40%), Upcoming: 4 (20%) => Total 20
  const data = [
    { name: 'Ongoing Projects', value: 8, color: '#1E60FF', percent: '40%' },
    { name: 'Completed Projects', value: 8, color: '#10B981', percent: '40%' },
    { name: 'Upcoming Projects', value: 4, color: '#8B5CF6', percent: '20%' },
  ];

  const total = 20;

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-[#071739] border border-[#1f375f] text-white px-3 py-2 rounded-xl text-xs shadow-xl font-medium">
          <p className="flex items-center gap-1.5" style={{ color: item.payload.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
            {item.name}: <span className="font-bold text-white ml-1">{item.value} ({item.payload.percent})</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
            <Building2 size={19} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Project Overview</h3>
        </div>

        <button
          onClick={() => setCurrentTab('my-projects')}
          className="text-xs font-bold text-[#1E60FF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
        </button>
      </div>

      {/* Donut Chart & Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-4 my-auto">
        {/* Donut Chart */}
        <div className="sm:col-span-6 relative h-48 sm:h-52 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1A30] leading-none">
              {total}
            </span>
            <span className="text-[11px] font-semibold text-gray-500 mt-1">
              Total Projects
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="sm:col-span-6 space-y-3 pl-2">
          {data.map((item) => (
            <div 
              key={item.name}
              onClick={() => setCurrentTab('my-projects')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-800 font-mono">
                {item.value} ({item.percent})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
