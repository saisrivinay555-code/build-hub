import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, Phone, AlertTriangle, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function CustomerSupportView() {
  const { customerProject, setCurrentTab } = useApp();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketDesc('');
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E60FF]">
              <HelpCircle size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30]">Customer Support & Project Help</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Need assistance with contractor deliverables, material checks, or payment receipts?
          </p>
        </div>
      </div>

      {/* 4 Support Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div 
          onClick={() => setCurrentTab('messages')}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B1A30]">Contact Builder Directly</h3>
            <p className="text-xs text-gray-500 mt-1">Send a quick direct message to Tech Builders supervisor on site.</p>
            <span className="text-xs font-bold text-blue-600 mt-2 inline-block">Open Chat →</span>
          </div>
        </div>

        <a 
          href={`tel:${customerProject.builderContact}`}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B1A30]">Call Site Contractor</h3>
            <p className="text-xs text-gray-500 mt-1">Direct telephonic assistance with {customerProject.builderContact}.</p>
            <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">Dial Call Now →</span>
          </div>
        </a>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B1A30]">Report Quality or Delay Issue</h3>
            <p className="text-xs text-gray-500 mt-1">Escalate a material dispute or timeline delay directly to Build Hub auditor.</p>
            <span className="text-xs font-bold text-amber-600 mt-2 inline-block">24/7 Quality Desk</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B1A30]">Build Hub Platform Support</h3>
            <p className="text-xs text-gray-500 mt-1">Email support@buildhub.io for invoice verification and app assistance.</p>
            <span className="text-xs font-bold text-purple-600 mt-2 inline-block">support@buildhub.io</span>
          </div>
        </div>
      </div>

      {/* Raise Support Ticket Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#0B1A30]">Raise a Support Request</h3>
        <p className="text-xs text-gray-500">Our engineering support team responds within 2 hours.</p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle2 size={18} />
            <span>Support Request #TKT-2026-901 submitted! We will contact you shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Issue Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Schedule visit for master bedroom electrical inspection"
                className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description / Details</label>
              <textarea
                required
                rows={4}
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder="Provide details of your request..."
                className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#092257] hover:bg-[#07183d] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send size={15} />
              <span>Submit Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
