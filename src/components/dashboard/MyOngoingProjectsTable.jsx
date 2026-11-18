import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MyOngoingProjectsTable() {
  const { myProjects, setCurrentTab, setSelectedProjectForDetail } = useApp();

  // Top 3-4 ongoing projects
  const ongoingList = myProjects.filter(p => p.status === 'Ongoing').slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
            <Building2 size={19} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">My Ongoing Projects</h3>
        </div>

        <button
          onClick={() => setCurrentTab('my-projects')}
          className="text-xs font-bold text-[#1E60FF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
        </button>
      </div>

      {/* Table matching screenshot */}
      <div className="overflow-x-auto my-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="py-2.5 px-3">Project Name</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ongoingList.map((project) => (
              <tr
                key={project.id}
                onClick={() => setSelectedProjectForDetail(project)}
                className="hover:bg-blue-50/50 transition cursor-pointer group"
              >
                {/* Project Name */}
                <td className="py-3 px-3 font-bold text-gray-900 group-hover:text-blue-600">
                  {project.name}
                </td>

                {/* Location */}
                <td className="py-3 px-3 font-medium text-gray-600">
                  {project.location}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#EBF3FF] text-[#1E60FF] rounded-full border border-[#D0E2FF]">
                    Ongoing
                  </span>
                </td>

                {/* Deadline */}
                <td className="py-3 px-3 font-medium text-gray-600">
                  {project.deadline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
