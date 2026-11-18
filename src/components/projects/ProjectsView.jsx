import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  MapPin, 
  User, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  List,
  Columns,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProjectsView() {
  const { 
    projects, 
    deleteProject, 
    setModalType, 
    setEditingItem, 
    setSelectedProjectForDetail 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table' | 'kanban'

  const statuses = ['All', 'Ongoing', 'Completed', 'Pending'];
  const types = ['All', 'Residential', 'Commercial', 'Renovation', 'Industrial', 'Hospitality'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.builder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesType = filterType === 'All' || p.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingItem(project);
    setModalType('project');
  };

  const handleDelete = (e, project) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteProject(project.id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF3FF] text-[#1E60FF] border border-[#D0E2FF]">
            Ongoing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F8F0] text-[#059669] border border-[#C2F0DA]">
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF4E5] text-[#D97706] border border-[#FDE68A]">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
              <FolderKanban size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B2559]">
              Construction Projects ({projects.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track blueprints, construction timelines, budgets, milestones, and contractor deliveries.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setModalType('project');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, clients, builders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#1E60FF] text-white shadow-xs'
                  : 'bg-[#F4F7FE] text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Building Type Filter & View Mode Switcher */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            {types.map(t => (
              <option key={t} value={t}>{t === 'All' ? 'All Building Types' : t}</option>
            ))}
          </select>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-[#F4F7FE] p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
              title="Kanban Board View"
            >
              <Columns size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProjectForDetail(project)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image Header with Status Badge */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      {project.type}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-base leading-tight drop-shadow-md">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-200 mt-0.5">
                      <MapPin size={12} className="shrink-0 text-amber-300" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3.5">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-blue-600 font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.progress === 100 
                            ? 'bg-emerald-500' 
                            : project.progress > 50 
                            ? 'bg-blue-600' 
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Customer & Builder info */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#F4F7FE] p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Customer</span>
                      <span className="font-semibold text-gray-800 truncate block mt-0.5">{project.customer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Builder</span>
                      <span className="font-semibold text-gray-800 truncate block mt-0.5">{project.builder}</span>
                    </div>
                  </div>

                  {/* Budget & Deadline */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-gray-400 text-[11px] block">Budget</span>
                      <span className="font-bold text-gray-900 font-mono text-sm">{project.budget}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-[11px] block">Deadline</span>
                      <span className="font-semibold text-gray-700 flex items-center gap-1">
                        <Calendar size={12} className="text-blue-500" />
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  <span>View Details & Milestones</span>
                  <ChevronRight size={14} />
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleEdit(e, project)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-white transition"
                    title="Edit Project"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, project)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-semibold uppercase tracking-wider bg-gray-50/80 border-b border-gray-100">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Builder</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedProjectForDetail(project)}
                    className="hover:bg-blue-50/50 transition cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                            {project.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">{project.type}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{project.customer}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">{project.builder}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{project.budget}</td>
                    <td className="py-3 px-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-0.5">
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(project.status)}</td>
                    <td className="py-3 px-4 font-medium text-gray-600">{project.deadline}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleEdit(e, project)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, project)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Kanban Board Mode */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ongoing Column */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-blue-100 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E60FF]" />
                <h3 className="font-bold text-sm text-gray-800">Ongoing Projects</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {projects.filter(p => p.status === 'Ongoing').length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {projects.filter(p => p.status === 'Ongoing').map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectForDetail(project)}
                  className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-gray-900">{project.name}</h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {project.progress}%
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-600 pt-2 border-t border-gray-50">
                    <span>{project.builder}</span>
                    <span className="font-mono font-bold text-gray-800">{project.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-emerald-100 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <h3 className="font-bold text-sm text-gray-800">Completed Projects</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {projects.filter(p => p.status === 'Completed').length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {projects.filter(p => p.status === 'Completed').map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectForDetail(project)}
                  className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-gray-900">{project.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      100%
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-600 pt-2 border-t border-gray-50">
                    <span>{project.builder}</span>
                    <span className="font-mono font-bold text-gray-800">{project.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Column */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-amber-100 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <h3 className="font-bold text-sm text-gray-800">Pending Start</h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {projects.filter(p => p.status === 'Pending').length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {projects.filter(p => p.status === 'Pending').map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectForDetail(project)}
                  className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-gray-900">{project.name}</h4>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      Scheduled
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-600 pt-2 border-t border-gray-50">
                    <span>{project.builder}</span>
                    <span className="font-mono font-bold text-gray-800">{project.budget}</span>
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
