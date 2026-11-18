import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MyCustomersView() {
  const { myCustomers, setModalType, setSelectedProjectForDetail, myProjects } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = myCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenProject = (projectName) => {
    const proj = myProjects.find(p => p.name === projectName);
    if (proj) {
      setSelectedProjectForDetail(proj);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
              <Users size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              My Customers ({myCustomers.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your contracted clients, contact records, and project deliveries.
          </p>
        </div>

        <button
          onClick={() => setModalType('add_customer')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, city, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-gray-400" />
                      <span>{c.city}</span>
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.status === 'Active Client'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {c.status}
                </span>
              </div>

              {/* Linked Project info */}
              <div className="mt-4 bg-[#F4F7FE] p-3 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Assigned Project</span>
                <div 
                  onClick={() => handleOpenProject(c.project)}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center justify-between"
                >
                  <span>{c.project}</span>
                  <ExternalLink size={13} />
                </div>
              </div>
            </div>

            {/* Contact Row */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                <Phone size={13} />
                <span>{c.phone}</span>
              </a>
              <a href={`mailto:${c.email}`} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
                <Mail size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
