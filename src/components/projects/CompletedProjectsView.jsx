import React from 'react';
import { CheckCircle2, MapPin, Calendar, DollarSign, Award, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CompletedProjectsView() {
  const { myProjects, setSelectedProjectForDetail } = useApp();

  const completedList = myProjects.filter(p => p.status === 'Completed' || p.progress === 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#059669]">
              <CheckCircle2 size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Completed Projects Portfolio ({completedList.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Delivered residential villas, commercial facilities, and client handover certificates.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {completedList.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProjectForDetail(project)}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <div className="absolute top-3 right-3">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={13} /> Delivered
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base">{project.name}</h3>
                  <p className="text-xs text-gray-200">{project.location}</p>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-gray-600 line-clamp-2">{project.description}</p>

                <div className="bg-[#F4F7FE] p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Client</span>
                    <span className="font-bold text-gray-900">{project.customer}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Value</span>
                    <span className="font-mono font-bold text-emerald-700">{project.budget}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span>Handover Complete</span>
                <ChevronRight size={14} />
              </span>
              <span className="text-gray-500 font-medium">Delivered: {project.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
