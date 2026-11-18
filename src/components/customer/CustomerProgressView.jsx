import React from 'react';
import { TrendingUp, CheckCircle2, Clock, Circle, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerProgressView() {
  const { customerProject, customerStages } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#059669]">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30]">
              Project Progress & Construction Milestones
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time stage-by-stage structural verification for {customerProject.name}.
          </p>
        </div>

        <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-center sm:text-right">
          <span className="text-2xl font-extrabold text-emerald-700 block leading-none font-mono">
            {customerProject.progress}%
          </span>
          <span className="text-[11px] font-bold text-gray-600">Overall Construction Done</span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
          <span>Project Kickoff (01 Jan 2026)</span>
          <span className="text-purple-700">Current Phase: Interior & Finishing</span>
          <span>Target Handover (30 Aug 2026)</span>
        </div>
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${customerProject.progress}%` }}
          />
        </div>
      </div>

      {/* Detailed Milestone List */}
      <div className="space-y-4">
        {customerStages.map((stage) => {
          const isCompleted = stage.status === 'Completed';
          const isInProgress = stage.status === 'In Progress';

          return (
            <div
              key={stage.id}
              className={`bg-white p-5 sm:p-6 rounded-3xl border shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted 
                  ? 'border-emerald-100 bg-emerald-50/20' 
                  : isInProgress
                  ? 'border-purple-200 bg-purple-50/30 ring-2 ring-purple-200'
                  : 'border-gray-200 opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : isInProgress ? (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center animate-pulse shadow-xs">
                      <Clock size={18} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                      <Circle size={18} />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#0B1A30]">
                      Stage {stage.id}: {stage.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isInProgress
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {stage.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{stage.desc}</p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 shrink-0">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Date / Target</span>
                <span className="text-xs font-bold text-gray-800 font-mono">{stage.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
