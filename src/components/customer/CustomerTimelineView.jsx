import React from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerTimelineView() {
  const { customerUpdates, customerProject } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E60FF]">
              <Clock size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30]">Project Timeline & Site Log</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Chronological log of on-site activities, material approvals, and completed works.
          </p>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <div className="relative border-l-2 border-purple-200 ml-4 sm:ml-6 space-y-8 pb-4">
          {customerUpdates.map((item, index) => (
            <div key={item.id} className="relative pl-6 sm:pl-8 group">
              {/* Bullet node */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-purple-100 group-hover:scale-125 transition-transform" />

              <div className="bg-[#F8FAFC] hover:bg-purple-50/50 p-5 rounded-2xl border border-gray-100 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-sm sm:text-base text-[#0B1A30]">
                      {item.activity}
                    </h3>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500 flex items-center gap-1">
                    <Calendar size={13} className="text-gray-400" />
                    {item.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-200/50">
                  <span className="text-gray-400 font-medium">Logged by: Tech Builders Supervisor</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={13} /> {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
