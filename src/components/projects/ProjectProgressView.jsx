import React from 'react';
import { TrendingUp, CheckCircle2, Circle, Clock, Save, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function ProjectProgressView() {
  const { myProjects, updateProjectProgress, toggleProjectMilestone, setSelectedProjectForDetail } = useApp();

  const handleSliderChange = (id, val) => {
    updateProjectProgress(id, val);
  };

  const handleMilestoneClick = (projectId, milestoneIdx) => {
    toggleProjectMilestone(projectId, milestoneIdx);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Project Progress & Milestone Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Adjust completion percentages and sign off on construction phases.
          </p>
        </div>
      </div>

      {/* Projects Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0B1A30]">{project.name}</h3>
                <span className="text-xs text-gray-500">Customer: {project.customer} • {project.location}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                project.progress === 100 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {project.progress}% Complete
              </span>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                <span>Update Progress:</span>
                <span className="text-blue-600 font-mono font-bold">{project.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => handleSliderChange(project.id, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Milestones checklist */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <span className="text-[11px] uppercase font-bold text-gray-400 block mb-1">
                Construction Phase Sign-Offs:
              </span>
              {project.milestones?.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => handleMilestoneClick(project.id, idx)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    m.completed ? 'bg-emerald-50/70 text-emerald-900' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {m.completed ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-gray-400 shrink-0" />
                    )}
                    <span className={m.completed ? 'line-through text-emerald-800/80' : ''}>{m.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
