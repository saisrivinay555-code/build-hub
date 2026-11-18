import React from 'react';
import { 
  FolderKanban, 
  ChevronRight, 
  Clock, 
  Calendar,
  Building,
  User,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RecentProjectsTable() {
  const { projects, setCurrentTab, setSelectedProjectForDetail } = useApp();

  // Show the top 4 recent projects matching the screenshot
  const recentProjects = projects.slice(0, 4);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF3FF] text-[#1E60FF] border border-[#D0E2FF]">
            Ongoing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#059669] border border-[#C2F0DA]">
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFF4E5] text-[#D97706] border border-[#FDE68A]">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <FolderKanban size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1B2559]">Recent Projects</h3>
            <p className="text-xs text-gray-500">Live active construction sites & statuses</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('projects')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition"
        >
          <span>View All</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="py-2.5 px-3">Project Name</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Builder</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Deadline</th>
              <th className="py-2.5 px-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentProjects.map((project) => (
              <tr
                key={project.id}
                onClick={() => setSelectedProjectForDetail(project)}
                className="hover:bg-blue-50/50 transition cursor-pointer group"
              >
                {/* Project Name + Image */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {project.type}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="py-3 px-3">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <User size={12} className="text-gray-400 shrink-0" />
                    <span>{project.customer}</span>
                  </div>
                </td>

                {/* Builder */}
                <td className="py-3 px-3">
                  <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                    <Building size={12} className="text-gray-400 shrink-0" />
                    <span>{project.builder}</span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3">
                  {getStatusBadge(project.status)}
                </td>

                {/* Deadline */}
                <td className="py-3 px-3">
                  <div className="font-medium text-gray-600 flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400 shrink-0" />
                    <span>{project.deadline}</span>
                  </div>
                </td>

                {/* Action Arrow */}
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex p-1 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100/70 transition">
                    <ChevronRight size={16} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
