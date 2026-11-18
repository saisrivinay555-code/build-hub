import React, { useState } from 'react';
import { 
  HardHat, 
  Plus, 
  Search, 
  ShieldCheck, 
  Phone, 
  Building, 
  Hammer, 
  FolderKanban, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WorkersView() {
  const { workers, updateWorker, deleteWorker, setModalType, setEditingItem } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrade, setFilterTrade] = useState('All');

  const trades = ['All', 'Mason', 'Electrician', 'Welder', 'Plumber', 'Machinery', 'Carpenter', 'Foreman'];

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (w.assignedProject && w.assignedProject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTrade = filterTrade === 'All' || w.trade.toLowerCase().includes(filterTrade.toLowerCase());
    return matchesSearch && matchesTrade;
  });

  const handleEdit = (worker) => {
    setEditingItem(worker);
    setModalType('worker');
  };

  const toggleStatus = (worker) => {
    const nextStatus = worker.status === 'On Site' ? 'On Leave' : (worker.status === 'On Leave' ? 'Available' : 'On Site');
    updateWorker(worker.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-[#8B5CF6]">
              <HardHat size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B2559]">
              Workforce & Tradesmen Directory ({workers.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track certified construction crew, trade assignments, daily rates, and live on-site attendance.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setModalType('worker');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8B5CF6] hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Worker</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workers by name, trade, project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {trades.map(trade => (
            <button
              key={trade}
              onClick={() => setFilterTrade(trade)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterTrade === trade
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'bg-[#F4F7FE] text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Avatar + Name + Trade */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/20 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
                      {worker.name}
                    </h3>
                    <p className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                      <Hammer size={12} />
                      {worker.trade}
                    </p>
                  </div>
                </div>

                {/* Safety Badge */}
                {worker.safetyCertified && (
                  <span title="OSHA / Safety Certified" className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={16} />
                  </span>
                )}
              </div>

              {/* Attendance Status Toggle Pill */}
              <div className="mt-3.5 flex items-center justify-between">
                <span className="text-xs text-gray-400">Attendance:</span>
                <button
                  onClick={() => toggleStatus(worker)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    worker.status === 'On Site'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : worker.status === 'On Leave'
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                  title="Click to toggle attendance status"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    worker.status === 'On Site' ? 'bg-emerald-500' : (worker.status === 'On Leave' ? 'bg-red-500' : 'bg-blue-500')
                  }`} />
                  <span>{worker.status}</span>
                </button>
              </div>

              {/* Assignment & Rates */}
              <div className="mt-3 space-y-2 text-xs border-t border-gray-50 pt-3">
                <div className="bg-[#F4F7FE] p-2.5 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Assigned Project:</span>
                    <span className="font-bold text-gray-900 truncate ml-2">
                      {worker.assignedProject || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Contractor:</span>
                    <span className="text-gray-700 font-medium">
                      {worker.builder || 'Tech Builders'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-400">Daily Wage:</span>
                  <span className="font-bold text-gray-800 font-mono">
                    {worker.dailyRate || '$45/day'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href={`tel:${worker.phone}`}
                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition flex items-center gap-1 text-xs font-semibold"
              >
                <Phone size={14} />
                <span>{worker.phone}</span>
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(worker)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-gray-100 transition"
                  title="Edit Worker"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete record for worker ${worker.name}?`)) {
                      deleteWorker(worker.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete Worker"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
