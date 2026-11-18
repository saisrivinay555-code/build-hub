import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import StatCards from './StatCards';
import ProjectOverviewChart from './ProjectOverviewChart';
import CustomerRequestsCard from './CustomerRequestsCard';
import MyOngoingProjectsTable from './MyOngoingProjectsTable';
import ProjectCompletionRateCard from './ProjectCompletionRateCard';
import { Plus, UserPlus, FolderPlus, TrendingUp, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardView() {
  const { setModalType, setCurrentTab } = useApp();

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Top 3 Metric Cards */}
      <StatCards />

      {/* 3. Mid Grid: Project Overview (Donut) & Customer Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ProjectOverviewChart />
        </div>
        <div className="lg:col-span-7">
          <CustomerRequestsCard />
        </div>
      </div>

      {/* 4. Bottom Grid: My Ongoing Projects & Project Completion Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MyOngoingProjectsTable />
        </div>
        <div className="lg:col-span-5">
          <ProjectCompletionRateCard />
        </div>
      </div>

      {/* 5. Builder Quick Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          ⚡ Quick Builder Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setModalType('add_customer')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EBF3FF] hover:bg-[#DDEBFF] text-[#1E60FF] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add Customer</span>
          </button>

          <button
            onClick={() => setModalType('create_project')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E8F8F0] hover:bg-[#D4F4E4] text-[#059669] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <FolderPlus size={15} />
            <span>Create Project</span>
          </button>

          <button
            onClick={() => setCurrentTab('project-progress')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#7C3AED] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <TrendingUp size={15} />
            <span>Update Project Progress</span>
          </button>

          <button
            onClick={() => setCurrentTab('customer-requests')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFF4E5] hover:bg-[#FEE2C3] text-[#D97706] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <FileText size={15} />
            <span>View Customer Requests</span>
          </button>
        </div>
      </div>
    </div>
  );
}
