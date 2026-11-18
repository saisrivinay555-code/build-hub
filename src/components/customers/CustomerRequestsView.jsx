import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, Phone, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function CustomerRequestsView() {
  const { customerRequests, updateCustomerRequestStatus } = useApp();

  const handleStatusChange = (id, newStatus) => {
    updateCustomerRequestStatus(id, newStatus);
    if (newStatus === 'In Progress') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileText size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Customer Inquiries & Project Requests ({customerRequests.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review incoming construction proposals, site requests, and convert leads into active projects.
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {customerRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Customer Details */}
            <div className="flex items-start gap-4">
              <img
                src={req.avatar}
                alt={req.customer}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-gray-900">{req.customer}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    req.status === 'New'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : req.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-600 mt-0.5">{req.projectType}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    {req.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-gray-400" />
                    Received: {req.date}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    Est. Budget: {req.budget}
                  </span>
                  {req.area && (
                    <span className="text-purple-700 font-semibold">
                      Area: {req.area}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
              <a
                href={`tel:${req.phone}`}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
              >
                <Phone size={14} />
                <span>Call Client</span>
              </a>

              {req.status === 'New' && (
                <>
                  <button
                    onClick={() => handleStatusChange(req.id, 'In Progress')}
                    className="px-4 py-2 rounded-xl bg-[#1E60FF] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Accept & Start
                  </button>
                  <button
                    onClick={() => handleStatusChange(req.id, 'Rejected')}
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer border border-red-200"
                  >
                    Reject
                  </button>
                </>
              )}

              {req.status === 'In Progress' && (
                <button
                  onClick={() => handleStatusChange(req.id, 'Pending')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer"
                >
                  Hold Proposal
                </button>
              )}

              {req.status === 'Rejected' && (
                <span className="text-xs text-red-500 font-bold px-3 py-1 bg-red-50 rounded-lg">
                  Declined
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
