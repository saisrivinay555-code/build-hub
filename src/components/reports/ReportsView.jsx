import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';

export default function ReportsView() {
  const { projects, builders, workers, customers } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('financial'); // 'financial' | 'timeline' | 'workforce'

  // Calculate totals
  const totalBudgetRaw = projects.reduce((acc, p) => {
    const val = parseInt(p.budget?.replace(/[^0-9]/g, '') || '0', 10);
    return acc + val;
  }, 0);

  const totalSpentRaw = projects.reduce((acc, p) => {
    const val = parseInt(p.spent?.replace(/[^0-9]/g, '') || '0', 10);
    return acc + val;
  }, 0);

  // Financial chart data (Top 6 projects)
  const financialData = projects.slice(0, 6).map(p => ({
    name: p.name.length > 14 ? p.name.substring(0, 12) + '...' : p.name,
    Budget: parseInt(p.budget?.replace(/[^0-9]/g, '') || '0', 10) / 1000,
    Spent: parseInt(p.spent?.replace(/[^0-9]/g, '') || '0', 10) / 1000
  }));

  // Workforce trade distribution
  const tradeCounts = workers.reduce((acc, w) => {
    const tradeKey = w.trade.split(' ')[0];
    acc[tradeKey] = (acc[tradeKey] || 0) + 1;
    return acc;
  }, {});

  const tradePieData = Object.keys(tradeCounts).map((key, index) => {
    const colors = ['#1E60FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    return {
      name: key,
      value: tradeCounts[key],
      color: colors[index % colors.length]
    };
  });

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Project Name,Customer,Builder,Status,Budget,Spent,Deadline,Progress\n';
    projects.forEach(p => {
      csvContent += `"${p.name}","${p.customer}","${p.builder}","${p.status}","${p.budget}","${p.spent}","${p.deadline}","${p.progress}%"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BuildHub_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
              <FileBarChart size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B2559]">
              Reports & Executive Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Generate construction deliverables, budget variances, worker allocations, and export audit files.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F4F7FE] hover:bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border border-gray-200"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Portfolio Budget</span>
            <h3 className="text-2xl font-black text-[#1B2559] mt-1 font-mono">
              ${(totalBudgetRaw / 1000000).toFixed(2)}M
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across 14 Active & Completed Sites</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capital Deployed / Spent</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              ${(totalSpentRaw / 1000000).toFixed(2)}M
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold mt-1">
              {Math.round((totalSpentRaw / totalBudgetRaw) * 100)}% of Allocated Budget
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Resource Pool</span>
            <h3 className="text-2xl font-black text-purple-600 mt-1">
              {builders.length} Builders • {workers.length} Crew
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold mt-1">{customers.length} Property Owners</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSelectedReportType('financial')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            selectedReportType === 'financial'
              ? 'bg-[#1E60FF] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Financial Variance (Budget vs Spent)
        </button>
        <button
          onClick={() => setSelectedReportType('timeline')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            selectedReportType === 'timeline'
              ? 'bg-[#1E60FF] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Project Timeline & Delivery Schedule
        </button>
        <button
          onClick={() => setSelectedReportType('workforce')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            selectedReportType === 'workforce'
              ? 'bg-[#1E60FF] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Workforce & Trade Allocations
        </button>
      </div>

      {/* Report 1: Financial View */}
      {selectedReportType === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-[#1B2559] mb-1">Project Budget vs. Capital Expended ($ in Thousands)</h3>
            <p className="text-xs text-gray-500 mb-4">Comparison of contracted budget allocations against actual spend</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#718096' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#718096' }} unit="k" />
                  <Tooltip />
                  <Bar dataKey="Budget" fill="#1E60FF" radius={[6, 6, 0, 0]} name="Budget ($k)" />
                  <Bar dataKey="Spent" fill="#10B981" radius={[6, 6, 0, 0]} name="Spent ($k)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <h3 className="text-base font-bold text-[#1B2559] mb-3">Project Budget Breakdown</h3>
            <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
              {projects.slice(0, 5).map(p => (
                <div key={p.id} className="p-3 bg-[#F4F7FE] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span className="truncate">{p.name}</span>
                    <span className="text-blue-600 font-mono">{p.budget}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Contractor: {p.builder}</span>
                    <span className="text-emerald-600 font-semibold">{p.progress}% Done</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Timeline Schedule View (Gantt style) */}
      {selectedReportType === 'timeline' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1B2559]">Construction Schedule & Gantt Progress</h3>
              <p className="text-xs text-gray-500">Live milestones and completion target dates</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {projects.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{p.name}</h4>
                    <span className="text-xs text-gray-500">{p.builder} • Client: {p.customer}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <Calendar size={13} className="text-blue-500" />
                      Target: {p.deadline}
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {p.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      p.progress === 100 ? 'bg-emerald-500' : (p.progress > 50 ? 'bg-blue-600' : 'bg-amber-500')
                    }`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report 3: Workforce Allocations View */}
      {selectedReportType === 'workforce' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-[#1B2559] mb-1">Workforce Skill & Trade Share</h3>
            <p className="text-xs text-gray-500 mb-4">Distribution of specialized construction tradesmen</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={tradePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {tradePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-[#1B2559] mb-3">On-Site Labor Allocation</h3>
            <div className="space-y-2.5">
              {workers.map(w => (
                <div key={w.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7FE] text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-gray-900 block">{w.name}</span>
                      <span className="text-gray-500 text-[11px]">{w.trade}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-blue-600 block">{w.assignedProject}</span>
                    <span className="text-emerald-700 font-bold text-[11px]">{w.dailyRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
