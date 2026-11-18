import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  User,
  CheckCircle2,
  Circle,
  HardHat,
  Share2,
  FileText,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function ProjectDetailModal() {
  const { 
    selectedProjectForDetail, 
    setSelectedProjectForDetail, 
    toggleProjectMilestone,
    workers,
    setCurrentTab
  } = useApp();

  if (!selectedProjectForDetail) return null;

  const project = selectedProjectForDetail;

  // Find workers assigned to this project
  const assignedCrew = workers.filter(w => 
    w.assignedProject && w.assignedProject.toLowerCase() === project.name.toLowerCase()
  );

  const handleMilestoneToggle = (index) => {
    toggleProjectMilestone(project.id, index);
    // Trigger celebratory confetti if completing milestone
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Top Header with Project Hero Cover */}
        <div className="relative h-48 sm:h-60 w-full shrink-0">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Close Button */}
          <button
            onClick={() => setSelectedProjectForDetail(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Type & Status Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
              {project.type}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-md ${
              project.status === 'Ongoing'
                ? 'bg-blue-600/90 text-white'
                : project.status === 'Completed'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-amber-500/90 text-white'
            }`}>
              {project.status}
            </span>
          </div>

          {/* Title & Location in Cover */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md">
              {project.name}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
              <MapPin size={14} className="text-amber-400 shrink-0" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* 1. Progress & Metrics Row */}
          <div className="bg-[#F4F7FE] p-4 sm:p-5 rounded-2xl border border-gray-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Overall Completion Progress</span>
              <span className="text-base font-extrabold text-blue-600">{project.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200/80 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Total Budget</span>
                <span className="font-mono font-bold text-gray-900 text-sm sm:text-base">{project.budget}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Spent to Date</span>
                <span className="font-mono font-bold text-emerald-600 text-sm sm:text-base">{project.spent || '$0'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Start Date</span>
                <span className="font-semibold text-gray-800">{project.startDate || 'Jan 2025'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Target Deadline</span>
                <span className="font-semibold text-blue-600">{project.deadline}</span>
              </div>
            </div>
          </div>

          {/* 2. Customer & Builder info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Property Owner / Customer</span>
                  <span className="font-bold text-gray-900 text-sm">{project.customer}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedProjectForDetail(null);
                  setCurrentTab('customers');
                }}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Profile →
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">General Contractor / Builder</span>
                  <span className="font-bold text-gray-900 text-sm">{project.builder}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedProjectForDetail(null);
                  setCurrentTab('builders');
                }}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Profile →
              </button>
            </div>
          </div>

          {/* 3. Project Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Project Scope & Description</h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
              {project.description}
            </p>
          </div>

          {/* 4. Interactive Milestone Tracker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                <span>Construction Milestones (Click to toggle completion)</span>
              </h4>
              <span className="text-xs font-bold text-gray-500">
                {project.milestones?.filter(m => m.completed).length || 0} of {project.milestones?.length || 0} Done
              </span>
            </div>

            <div className="space-y-2">
              {project.milestones?.map((milestone, idx) => (
                <div
                  key={idx}
                  onClick={() => handleMilestoneToggle(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    milestone.completed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-white border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {milestone.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-gray-400 shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm font-semibold ${milestone.completed ? 'line-through text-emerald-800/80' : 'text-gray-800'}`}>
                      {milestone.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-500">
                    {milestone.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Assigned Workforce Crew */}
          {assignedCrew.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HardHat size={14} className="text-purple-600" />
                <span>On-Site Assigned Workers ({assignedCrew.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedCrew.map(worker => (
                  <div key={worker.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F4F7FE] border border-gray-200/80">
                    <img src={worker.avatar} alt={worker.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{worker.name}</p>
                      <p className="text-[11px] text-purple-700 font-medium">{worker.trade}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {worker.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              setSelectedProjectForDetail(null);
              setCurrentTab('messages');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <MessageSquare size={16} className="text-blue-600" />
            <span>Open Project Discussion</span>
          </button>

          <button
            onClick={() => setSelectedProjectForDetail(null)}
            className="px-5 py-2 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
