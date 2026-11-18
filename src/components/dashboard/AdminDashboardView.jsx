import React from 'react';
import { 
  Building2, 
  Users, 
  HardHat, 
  FolderKanban, 
  ChevronRight, 
  TrendingUp, 
  BarChart2, 
  PieChart as PieIcon, 
  FolderPlus, 
  UserPlus, 
  Zap, 
  Calendar as CalendarIcon,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';

export default function AdminDashboardView() {
  const { 
    currentUser, 
    setCurrentTab, 
    setIsCalendarOpen, 
    setModalType,
    setSelectedProjectForDetail,
    CHART_MONTHLY_OVERVIEW,
    builders = [],
    customers = [],
    workers = [],
    projects = []
  } = useApp();

  // Phase 7: Real dynamic KPI metrics calculated strictly from Firestore records
  const totalBuilders = builders.length;
  const pendingBuilderApprovals = builders.filter(b => (b.verificationStatus || 'pending').toLowerCase() === 'pending').length;
  const approvedBuilders = builders.filter(b => (b.verificationStatus || '').toLowerCase() === 'approved').length;
  const totalCustomers = customers.length;
  const activeProjects = projects.filter(p => p.status === 'Ongoing' || p.status === 'Active').length;
  const ongoingProjects = activeProjects;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const pendingProjects = projects.filter(p => p.status === 'Upcoming' || p.status === 'Planning' || p.status === 'Pending').length;
  const totalProjects = projects.length;

  const donutData = totalProjects > 0 ? [
    { name: 'Active', value: activeProjects, color: '#1E60FF', percent: Math.round((activeProjects / totalProjects) * 100) },
    { name: 'Completed', value: completedProjects, color: '#10B981', percent: Math.round((completedProjects / totalProjects) * 100) },
    { name: 'Other', value: Math.max(0, totalProjects - activeProjects - completedProjects), color: '#F59E0B', percent: Math.round((Math.max(0, totalProjects - activeProjects - completedProjects) / totalProjects) * 100) },
  ] : [
    { name: 'No Projects', value: 1, color: '#E2E8F0', percent: 100 }
  ];

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. Admin Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl animate-bounce origin-bottom">👋</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Welcome Back, <span className="text-[#1E60FF]">{currentUser.name || 'Administrator'}</span>
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              Administrator Master Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Real-time Builder & Customer Management System • Cloud Firestore Synced
          </p>
        </div>

        <button 
          onClick={() => setIsCalendarOpen(true)}
          className="flex items-center gap-3 px-4 py-2.5 bg-[#F4F7FE] hover:bg-blue-50 border border-gray-200/80 hover:border-blue-200 rounded-xl text-gray-700 transition group self-start sm:self-auto cursor-pointer"
        >
          <div className="p-1.5 bg-white rounded-lg shadow-2xs text-[#1E60FF] group-hover:scale-110 transition">
            <CalendarIcon size={18} />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-[#0B1A30]">
              Real-time Firestore
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Synced
            </div>
          </div>
        </button>
      </div>

      {/* 2. 6 Phase 7 Real Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Total Registered Builders */}
        <div
          onClick={() => setCurrentTab('builders')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#EBF3FF] text-[#1E60FF] flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Builders</p>
            <h3 className="text-2xl font-black text-[#0B1A30] mt-0.5">{totalBuilders}</h3>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Registered directory</p>
          </div>
        </div>

        {/* Card 2: Pending Builder Approvals */}
        <div
          onClick={() => setCurrentTab('builders')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap size={22} />
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Pending Approvals</p>
            <h3 className="text-2xl font-black text-[#0B1A30] mt-0.5">{pendingBuilderApprovals}</h3>
            <p className="text-[10px] font-semibold text-amber-600 mt-0.5">Requires review</p>
          </div>
        </div>

        {/* Card 3: Approved Builders */}
        <div
          onClick={() => setCurrentTab('builders')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Approved Builders</p>
            <h3 className="text-2xl font-black text-[#0B1A30] mt-0.5">{approvedBuilders}</h3>
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Verified partners</p>
          </div>
        </div>

        {/* Card 4: Total Registered Customers */}
        <div
          onClick={() => setCurrentTab('customers')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center">
              <Users size={22} />
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-black text-[#0B1A30] mt-0.5">{totalCustomers}</h3>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Property owners</p>
          </div>
        </div>

        {/* Card 5: Active Projects */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderPlus size={22} />
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Active Projects</p>
            <h3 className="text-2xl font-black text-[#0B1A30] mt-0.5">{activeProjects}</h3>
            <p className="text-[10px] font-semibold text-blue-600 mt-0.5">Under construction</p>
          </div>
        </div>

        {/* Card 6: Completed Projects */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HardHat size={22} />
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Completed Projects</p>
            <h3 className="text-2xl font-black text-[#0B1A30] mt-0.5">{completedProjects}</h3>
            <p className="text-[10px] font-semibold text-purple-600 mt-0.5">Handed over</p>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Spline Area Chart + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Overview Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <BarChart2 size={19} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Project Overview</h3>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
              Last 6 Months ▼
            </span>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-[#F4F7FE] p-3 rounded-xl">
              <span className="text-xl font-bold text-[#0B1A30]">{ongoingProjects}</span>
              <span className="text-[11px] font-semibold text-blue-600 block mt-0.5">• Ongoing Projects</span>
            </div>
            <div className="bg-[#E8F8F0] p-3 rounded-xl">
              <span className="text-xl font-bold text-[#0B1A30]">{completedProjects}</span>
              <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">• Completed Projects</span>
            </div>
            <div className="bg-[#FFF4E5] p-3 rounded-xl">
              <span className="text-xl font-bold text-[#0B1A30]">{pendingProjects}</span>
              <span className="text-[11px] font-semibold text-amber-600 block mt-0.5">• Pending Projects</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_MONTHLY_OVERVIEW || [
                { month: 'Mar', Ongoing: 2.1, Completed: 0.8, Pending: 0.3 },
                { month: 'Apr', Ongoing: 5.4, Completed: 2.1, Pending: 1.2 },
                { month: 'May', Ongoing: 7.2, Completed: 3.2, Pending: 1.5 },
                { month: 'Jun', Ongoing: 6.9, Completed: 3.8, Pending: 1.1 },
                { month: 'Jul', Ongoing: 8.8, Completed: 4.8, Pending: 2.0 },
                { month: 'Aug', Ongoing: 10.2, Completed: 6.2, Pending: 2.2 },
              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminOngoing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E60FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1E60FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="adminCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="adminPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#718096' }} />
                <YAxis tick={{ fontSize: 11, fill: '#718096' }} domain={[0, 12]} />
                <Tooltip />
                <Area type="monotone" dataKey="Ongoing" stroke="#1E60FF" strokeWidth={3} fill="url(#adminOngoing)" />
                <Area type="monotone" dataKey="Completed" stroke="#10B981" strokeWidth={2.5} fill="url(#adminCompleted)" />
                <Area type="monotone" dataKey="Pending" stroke="#F59E0B" strokeWidth={2.5} fill="url(#adminPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <PieIcon size={19} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Project Status</h3>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
              All Projects ▼
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 my-auto py-2">
            <div className="sm:col-span-7 relative h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-[#0B1A30]">{totalProjects}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Projects</span>
              </div>
            </div>

            <div className="sm:col-span-5 space-y-2.5">
              {donutData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-500 font-mono">{item.value} ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Recent Projects Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Projects Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FolderKanban size={19} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Recent Projects</h3>
            </div>
            <button
              onClick={() => setCurrentTab('projects')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto my-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-semibold uppercase border-b border-gray-100">
                  <th className="py-2.5 px-3">Project Name</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Builder</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Deadline</th>
                  <th className="py-2.5 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      No projects created yet. Use Quick Actions below to add your first project.
                    </td>
                  </tr>
                ) : (
                  recentProjects.map(p => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProjectForDetail(p)}
                      className="hover:bg-blue-50/50 transition cursor-pointer group"
                    >
                      <td className="py-3 px-3 font-bold text-gray-900 group-hover:text-blue-600 flex items-center gap-2.5">
                        <img src={p.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=100&auto=format&fit=crop&q=80'} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-800">{p.customer || 'Unassigned'}</td>
                      <td className="py-3 px-3 text-gray-700">{p.builder || 'Unassigned'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.status === 'Ongoing' ? 'bg-[#EBF3FF] text-[#1E60FF]' : (p.status === 'Completed' ? 'bg-[#E8F8F0] text-[#059669]' : 'bg-[#FFF4E5] text-[#D97706]')
                        }`}>
                          {p.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 font-medium">{p.deadline || 'TBD'}</td>
                      <td className="py-3 px-3 text-right">
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 inline" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions 2x2 */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap size={19} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => setModalType('add_builder')}
              className="bg-[#EBF3FF] hover:bg-[#DDEBFF] p-4 rounded-2xl text-center transition cursor-pointer"
            >
              <div className="p-2 bg-white rounded-xl shadow-2xs inline-block text-blue-600">
                <Building2 size={20} />
              </div>
              <div className="font-bold text-xs text-[#1E60FF] mt-2">Add Builder</div>
              <div className="text-[10px] text-gray-500">Register new builder</div>
            </button>

            <button
              onClick={() => setModalType('add_customer')}
              className="bg-[#E8F8F0] hover:bg-[#D4F4E4] p-4 rounded-2xl text-center transition cursor-pointer"
            >
              <div className="p-2 bg-white rounded-xl shadow-2xs inline-block text-emerald-600">
                <Users size={20} />
              </div>
              <div className="font-bold text-xs text-[#059669] mt-2">Add Customer</div>
              <div className="text-[10px] text-gray-500">Register new customer</div>
            </button>

            <button
              onClick={() => setModalType('add_worker')}
              className="bg-[#F3E8FF] hover:bg-[#E9D5FF] p-4 rounded-2xl text-center transition cursor-pointer"
            >
              <div className="p-2 bg-white rounded-xl shadow-2xs inline-block text-purple-600">
                <HardHat size={20} />
              </div>
              <div className="font-bold text-xs text-[#7C3AED] mt-2">Add Worker</div>
              <div className="text-[10px] text-gray-500">Register new worker</div>
            </button>

            <button
              onClick={() => setModalType('create_project')}
              className="bg-[#FFE4E6] hover:bg-[#FECDD3] p-4 rounded-2xl text-center transition cursor-pointer"
            >
              <div className="p-2 bg-white rounded-xl shadow-2xs inline-block text-red-600">
                <FolderPlus size={20} />
              </div>
              <div className="font-bold text-xs text-[#E11D48] mt-2">Add Project</div>
              <div className="text-[10px] text-gray-500">Create new project</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
