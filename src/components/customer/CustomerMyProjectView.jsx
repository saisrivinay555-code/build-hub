import React from 'react';
import { 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerMyProjectView() {
  const { customerProject, setCurrentTab } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-[#8B5CF6]">
              <Home size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30]">
              {customerProject.name}
            </h1>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              ● Ongoing Construction
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span>{customerProject.address}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('messages')}
            className="px-4 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Message Builder</span>
          </button>
        </div>
      </div>

      {/* Main Project Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Project Image & Description */}
        <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={customerProject.image}
                alt={customerProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                  {customerProject.type}
                </span>
                <h2 className="text-xl font-extrabold mt-0.5">{customerProject.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-bold text-base text-[#0B1A30]">Architectural Overview</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {customerProject.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#F4F7FE] p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Area</span>
                  <span className="text-sm font-bold text-[#0B1A30]">4,250 Sq. Ft.</span>
                </div>
                <div className="bg-[#F4F7FE] p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Structure</span>
                  <span className="text-sm font-bold text-[#0B1A30]">G + 1 Duplex</span>
                </div>
                <div className="bg-[#F4F7FE] p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Bedrooms</span>
                  <span className="text-sm font-bold text-[#0B1A30]">4 BHK + Home Theatre</span>
                </div>
                <div className="bg-[#F4F7FE] p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">GHMC Permit</span>
                  <span className="text-sm font-bold text-emerald-700">GHMC-2025-9921</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Builder Details */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0B1A30] uppercase tracking-wider text-gray-400">
              Assigned Contractor
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={customerProject.builderAvatar}
                alt={customerProject.builderName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h4 className="font-bold text-base text-[#0B1A30]">{customerProject.builderName}</h4>
                <p className="text-xs text-gray-500">Master Contractor</p>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Verified Contractor
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-[#F4F7FE] p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-600" />
                <span className="font-semibold">{customerProject.builderContact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-600" />
                <span className="font-semibold">{customerProject.builderEmail}</span>
              </div>
            </div>
          </div>

          {/* Key Dates & Cost */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-sm text-[#0B1A30] uppercase tracking-wider text-gray-400 mb-2">
              Timeline & Financials
            </h3>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Commencement Date</span>
              <span className="font-bold text-[#0B1A30]">{customerProject.startDate}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Target Delivery</span>
              <span className="font-bold text-purple-700">{customerProject.expectedCompletion}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Agreed Project Cost</span>
              <span className="font-mono font-bold text-[#0B1A30]">{customerProject.totalCost}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-mono font-bold text-emerald-600">{customerProject.amountPaid}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
