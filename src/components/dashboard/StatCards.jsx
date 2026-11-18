import React from 'react';
import { Users, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatCards() {
  const { 
    totalCustomersCount, 
    ongoingProjectsCount, 
    completedProjectsCount, 
    setCurrentTab 
  } = useApp();

  const cards = [
    {
      id: 'customers',
      title: 'Total Customers',
      count: totalCustomersCount, // 48
      subtitle: 'Registered Customers',
      tab: 'customers',
      bgIcon: 'bg-[#EBF3FF] text-[#1E60FF]',
      borderHover: 'hover:border-blue-300',
      icon: Users
    },
    {
      id: 'ongoing',
      title: 'Ongoing Projects',
      count: ongoingProjectsCount, // 8
      subtitle: 'Projects in Progress',
      tab: 'my-projects',
      bgIcon: 'bg-[#E8F8F0] text-[#10B981]',
      borderHover: 'hover:border-emerald-300',
      icon: Building2
    },
    {
      id: 'completed',
      title: 'Completed Projects',
      count: completedProjectsCount, // 12
      subtitle: 'Projects Completed',
      tab: 'completed-projects',
      bgIcon: 'bg-[#F3E8FF] text-[#8B5CF6]',
      borderHover: 'hover:border-purple-300',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => setCurrentTab(card.tab)}
            className={`bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group ${card.borderHover}`}
          >
            <div className="flex items-center gap-4">
              {/* Soft Pastel Circular Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bgIcon} transition-transform group-hover:scale-105 shadow-2xs`}>
                <Icon size={28} className="stroke-[2.2]" />
              </div>

              {/* Stat Text */}
              <div>
                <p className="text-xs font-semibold text-gray-500">
                  {card.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A30] mt-0.5 tracking-tight">
                  {card.count}
                </h3>
                <p className="text-xs font-medium text-gray-400 mt-0.5">
                  {card.subtitle}
                </p>
              </div>
            </div>

            {/* Right Chevron Arrow */}
            <div className="p-1 rounded-full text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
              <ChevronRight size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
