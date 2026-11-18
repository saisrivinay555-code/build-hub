import React, { useState } from 'react';
import { User, Building2, Shield, Phone, Mail, MapPin, CheckCircle, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BuilderProfileView() {
  const { currentUser, setCurrentUser, addNotification } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [company, setCompany] = useState(currentUser.company || 'Vinay Builders & Infra');
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      company,
      email
    });
    setSaved(true);
    addNotification({
      title: 'Profile Updated',
      message: 'Builder credentials updated successfully.',
      type: 'approval'
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-50 text-[#1E60FF]">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">Builder Profile & Credentials</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your contractor profile and verified construction license.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20"
            />
            <div>
              <h3 className="font-bold text-lg text-gray-900">{currentUser.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  🏗️ Verified Builder
                </span>
                <span className="text-xs font-mono font-semibold text-gray-500">
                  License: BLD-2021-8849
                </span>
              </div>
            </div>
          </div>

          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle size={14} /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Entity</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
