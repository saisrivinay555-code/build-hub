import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Building2, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  MapPin, 
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerDashboardView() {
  const { 
    currentUser, 
    customerProject, 
    customerStages, 
    customerUpdates, 
    setCurrentTab
  } = useApp();

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Customer Welcome Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] border border-[#E9D5FF] flex items-center justify-center text-[#8B5CF6] shrink-0 shadow-2xs">
            <Home size={28} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Welcome Back, <span className="text-[#8B5CF6]">{currentUser.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Track your construction project and stay connected with your builder.
            </p>
          </div>
        </div>

        {/* Project Meta Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-[#F4F7FE] border border-gray-200/80 text-xs">
            <span className="text-gray-400 font-bold block text-[9px] uppercase">Current Project</span>
            <span className="font-bold text-[#0B1A30]">{customerProject?.name || 'Residential Villa'}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#F4F7FE] border border-gray-200/80 text-xs">
            <span className="text-gray-400 font-bold block text-[9px] uppercase">Location</span>
            <span className="font-bold text-gray-700">Hyderabad</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#F4F7FE] border border-gray-200/80 text-xs">
            <span className="text-gray-400 font-bold block text-[9px] uppercase">Builder</span>
            <span className="font-bold text-blue-600">{customerProject?.builderName || 'Tech Builders'}</span>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-[#E8F8F0] border border-[#C2F0DA] text-[#059669] text-xs font-bold self-center">
            ● Ongoing
          </span>

          <button
            onClick={() => setCurrentTab('find-builders')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Find Builders</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. 4 Customer KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: My Project */}
        <div 
          onClick={() => setCurrentTab('my-project')}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition">
              <Home size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">My Project</p>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1A30] mt-0.5 truncate max-w-[130px]">
                {customerProject?.name || 'Residential Villa'}
              </h3>
              <p className="text-[11px] font-bold text-emerald-600 mt-0.5">Status: Ongoing</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 2: Project Progress */}
        <div 
          onClick={() => setCurrentTab('project-progress')}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center group-hover:scale-105 transition">
              <TrendingUp size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Project Progress</p>
              <h3 className="text-2xl font-extrabold text-[#0B1A30] mt-0.5">
                {customerProject?.progress || 72}%
              </h3>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">Construction Completed</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 3: Expected Completion */}
        <div 
          onClick={() => setCurrentTab('project-timeline')}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#EBF3FF] text-[#1E60FF] flex items-center justify-center group-hover:scale-105 transition">
              <CalendarIcon size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Expected Completion</p>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1A30] mt-0.5">
                {customerProject?.expectedCompletion || '30 Aug 2026'}
              </h3>
              <p className="text-[11px] font-bold text-blue-600 mt-0.5">Estimated Handover</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 4: Pending Payments */}
        <div 
          onClick={() => setCurrentTab('payments')}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#FFF4E5] text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition">
              <CreditCard size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Pending Payments</p>
              <h3 className="text-xl font-extrabold text-[#0B1A30] mt-0.5 font-mono">
                {customerProject?.pendingAmount || '₹2,40,000'}
              </h3>
              <p className="text-[11px] font-bold text-amber-600 mt-0.5">Remaining Balance</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
        </div>

      </div>

      {/* 3. Project Progress Horizontal Construction Timeline */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1A30] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#8B5CF6]" />
              <span>Project Progress Timeline</span>
            </h3>
            <p className="text-xs text-gray-500">Live phase-by-phase execution status for your Villa.</p>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200">
            <span className="text-xs font-extrabold text-[#7C3AED] font-mono">{customerProject?.progress || 72}%</span>
            <span className="text-xs font-semibold text-gray-600">Overall Completion</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${customerProject?.progress || 72}%` }}
          />
        </div>

        {/* 7 Horizontal Stages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {customerStages?.map((stage) => {
            const isCompleted = stage.status === 'Completed';
            const isInProgress = stage.status === 'In Progress';
            const isUpcoming = stage.status === 'Upcoming';

            return (
              <div 
                key={stage.id} 
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                  isCompleted 
                    ? 'bg-[#E8F8F0]/70 border-[#C2F0DA]' 
                    : isInProgress
                    ? 'bg-[#F3E8FF] border-[#D8B4FE] ring-2 ring-purple-300'
                    : 'bg-[#F9FAFB] border-gray-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-center mb-2">
                    {isCompleted && (
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                    {isInProgress && (
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center animate-pulse shadow-xs">
                        <Clock size={16} />
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                        <Circle size={16} />
                      </div>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-[#0B1A30] leading-tight">
                    {stage.id}. {stage.name.split(' ')[0]}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">
                    {stage.name}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200/60">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    isCompleted 
                      ? 'text-emerald-700 bg-emerald-100' 
                      : isInProgress
                      ? 'text-purple-700 bg-purple-200'
                      : 'text-gray-500 bg-gray-100'
                  }`}>
                    {stage.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Row 3 Cards: My Project, My Builder, Recent Updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: My Project */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-[#8B5CF6]">
                  <Home size={19} />
                </div>
                <h3 className="text-base font-bold text-[#0B1A30]">My Project</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ongoing
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400 font-semibold">Project Name</span>
                <span className="font-bold text-[#0B1A30]">{customerProject?.name || 'Residential Villa'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400 font-semibold">Builder</span>
                <span className="font-bold text-blue-600">{customerProject?.builderName || 'Tech Builders'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400 font-semibold">Location</span>
                <span className="font-semibold text-gray-700">{customerProject?.location || 'Hyderabad'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400 font-semibold">Start Date</span>
                <span className="font-semibold text-gray-700">{customerProject?.startDate || '01 Jan 2026'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Expected Completion</span>
                <span className="font-bold text-purple-700">{customerProject?.expectedCompletion || '30 Aug 2026'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('my-project')}
            className="mt-5 w-full py-2.5 bg-[#092257] hover:bg-[#07183d] text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Project Details</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 2: My Builder */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
                  <Building2 size={19} />
                </div>
                <h3 className="text-base font-bold text-[#0B1A30]">My Builder</h3>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Available
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <img
                src={customerProject?.builderAvatar || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80'}
                alt={customerProject?.builderName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h4 className="font-bold text-sm text-[#0B1A30]">{customerProject?.builderName || 'Tech Builders'}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-gray-400" />
                  <span>Licensed Contractor</span>
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600 bg-[#F4F7FE] p-2.5 rounded-xl">
                <Phone size={14} className="text-blue-600 shrink-0" />
                <span className="font-semibold">{customerProject?.builderContact || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 bg-[#F4F7FE] p-2.5 rounded-xl">
                <Mail size={14} className="text-blue-600 shrink-0" />
                <span className="font-semibold">{customerProject?.builderEmail || 'contact@techbuilders.com'}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentTab('messages')}
              className="py-2.5 px-3 bg-[#1E60FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Message</span>
            </button>
            <a
              href={`tel:${customerProject?.builderContact || '+919876543210'}`}
              className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 text-center"
            >
              <Phone size={14} />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Card 3: Recent Project Updates */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981]">
                  <Clock size={19} />
                </div>
                <h3 className="text-base font-bold text-[#0B1A30]">Recent Updates</h3>
              </div>
              <button
                onClick={() => setCurrentTab('project-timeline')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {customerUpdates?.slice(0, 3).map((up) => (
                <div key={up.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0 ring-4 ring-purple-100" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-gray-900">{up.activity}</h5>
                      <span className="text-[10px] text-gray-400 font-mono">{up.date}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {up.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full inline-block">
              ✨ Latest: Interior work is currently in progress.
            </span>
          </div>
        </div>

      </div>

      {/* 5. Customer Quick Action Chips */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          ⚡ Quick Customer Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('my-project')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#7C3AED] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <Home size={14} />
            <span>View Project</span>
          </button>

          <button
            onClick={() => setCurrentTab('project-progress')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E8F8F0] hover:bg-[#D4F4E4] text-[#059669] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <TrendingUp size={14} />
            <span>Track Progress</span>
          </button>

          <button
            onClick={() => setCurrentTab('messages')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EBF3FF] hover:bg-[#DDEBFF] text-[#1E60FF] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Message Builder</span>
          </button>

          <button
            onClick={() => setCurrentTab('documents')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFF4E5] hover:bg-[#FEE2C3] text-[#D97706] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <FileText size={14} />
            <span>View Documents</span>
          </button>

          <button
            onClick={() => setCurrentTab('payments')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EFF6FF] hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <CreditCard size={14} />
            <span>Payment Details</span>
          </button>

          <button
            onClick={() => setCurrentTab('support')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

    </div>
  );
}
