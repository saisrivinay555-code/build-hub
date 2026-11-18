import React from 'react';
import { 
  Zap, 
  UserPlus, 
  Users, 
  HardHat, 
  FolderPlus, 
  Building2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function QuickActions() {
  const { setModalType, setEditingItem } = useApp();

  const actions = [
    {
      id: 'builder',
      title: 'Add Builder',
      subtitle: 'Register new builder',
      bgColor: 'bg-[#EBF3FF] hover:bg-[#DDEBFF]',
      textColor: 'text-[#1E60FF]',
      iconColor: 'text-[#1E60FF]',
      icon: Building2
    },
    {
      id: 'customer',
      title: 'Add Customer',
      subtitle: 'Register new customer',
      bgColor: 'bg-[#E8F8F0] hover:bg-[#D4F4E4]',
      textColor: 'text-[#059669]',
      iconColor: 'text-[#059669]',
      icon: Users
    },
    {
      id: 'worker',
      title: 'Add Worker',
      subtitle: 'Register new worker',
      bgColor: 'bg-[#F3E8FF] hover:bg-[#E9D5FF]',
      textColor: 'text-[#7C3AED]',
      iconColor: 'text-[#7C3AED]',
      icon: HardHat
    },
    {
      id: 'project',
      title: 'Add Project',
      subtitle: 'Create new project',
      bgColor: 'bg-[#FFE4E6] hover:bg-[#FECDD3]',
      textColor: 'text-[#E11D48]',
      iconColor: 'text-[#E11D48]',
      icon: FolderPlus
    }
  ];

  const handleOpenAction = (type) => {
    setEditingItem(null);
    setModalType(type);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-50">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1B2559]">Quick Actions</h3>
          <p className="text-xs text-gray-500">Fast registry shortcuts & management</p>
        </div>
      </div>

      {/* 2x2 Grid of Actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => handleOpenAction(act.id)}
              className={`${act.bgColor} p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 group cursor-pointer border border-transparent shadow-xs`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs group-hover:shadow-md transition">
                <Icon size={24} className={act.iconColor} />
              </div>
              <div className={`font-bold text-xs sm:text-sm mt-2.5 ${act.textColor}`}>
                {act.title}
              </div>
              <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                {act.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
