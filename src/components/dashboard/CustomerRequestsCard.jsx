import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerRequestsCard() {
  const { customerRequests, setCurrentTab, updateCustomerRequestStatus } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#E8F8F0] text-[#059669] rounded-full border border-[#C2F0DA]">
            New
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#FFF4E5] text-[#D97706] rounded-full border border-[#FDE68A]">
            In Progress
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#EBF3FF] text-[#1E60FF] rounded-full border border-[#D0E2FF]">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-gray-100 text-gray-700 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
            <User size={19} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B1A30]">Customer Requests</h3>
        </div>

        <button
          onClick={() => setCurrentTab('customer-requests')}
          className="text-xs font-bold text-[#1E60FF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50 my-auto">
        {customerRequests.slice(0, 4).map((req) => (
          <div
            key={req.id}
            onClick={() => setCurrentTab('customer-requests')}
            className="py-3 px-1 flex items-center justify-between hover:bg-gray-50/80 rounded-xl transition cursor-pointer group"
          >
            {/* Customer Avatar & Details */}
            <div className="flex items-center gap-3">
              <img
                src={req.avatar}
                alt={req.customer}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B1A30] group-hover:text-blue-600 transition-colors">
                  {req.customer}
                </h4>
                <p className="text-[11px] text-gray-400 font-medium">
                  {req.location}
                </p>
              </div>
            </div>

            {/* Project Type */}
            <div className="hidden sm:block text-xs font-semibold text-gray-600">
              {req.projectType}
            </div>

            {/* Status Badge */}
            <div>
              {getStatusBadge(req.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
