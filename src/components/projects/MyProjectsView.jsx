import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  MapPin, 
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MyProjectsView() {
  const { 
    myProjects, 
    setModalType, 
    setSelectedBuilderProjectId,
    setCurrentTab
  } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['All', 'Ongoing', 'Completed', 'Upcoming'];

  const handleOpenProject = (project) => {
    if (setSelectedBuilderProjectId) {
      setSelectedBuilderProjectId(project.id);
    }
    if (setCurrentTab) {
      setCurrentTab('project-progress');
    }
  };

  const filtered = (myProjects || []).filter(p => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
              <FolderKanban size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              My Construction Projects ({myProjects.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track site operations, milestones, contractor blueprints, and project delivery schedules.
          </p>
        </div>

        <button
          onClick={() => setModalType('create_project')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus size={18} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, clients, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#1E60FF] text-white shadow-xs'
                  : 'bg-[#F4F7FE] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <div
            key={project.id}
            onClick={() => handleOpenProject(project)}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Cover Image & Badges */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {project.type}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md text-white ${
                    project.status === 'Ongoing'
                      ? 'bg-blue-600/90'
                      : project.status === 'Completed'
                      ? 'bg-emerald-600/90'
                      : 'bg-purple-600/90'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base leading-tight drop-shadow-md">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-200 mt-0.5">
                    <MapPin size={12} className="shrink-0 text-amber-300" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Customer */}
              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-blue-600 font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#F4F7FE] p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Customer</span>
                    <span className="font-bold text-gray-900">{project.customer}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Deadline</span>
                    <span className="font-semibold text-gray-700">{project.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-gray-800">{project.budget}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenProject(project);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>View Project Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-xs">
            <FolderKanban className="mx-auto text-gray-300 mb-3" size={48} />
            <h3 className="font-bold text-gray-800 text-lg">No Projects Found</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Get started by creating your first construction project.</p>
            <button
              onClick={() => setModalType('create_project')}
              className="mt-4 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create Project</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
