import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Database,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  Bell,
  Lock,
  Sparkles,
  Building2,
  HardHat
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SettingsView() {
  const { 
    currentUser, 
    setCurrentUser, 
    resetToDefaultData, 
    builders, 
    customers, 
    workers, 
    projects,
    addNotification
  } = useApp();

  const [userName, setUserName] = useState(currentUser.name);
  const [userRole, setUserRole] = useState(currentUser.role);
  const [userEmail, setUserEmail] = useState(currentUser.email || 'saisri.vinay@buildhub.io');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: userName,
      role: userRole,
      email: userEmail
    });
    setSaveSuccess(true);
    addNotification({
      title: 'Profile Updated',
      message: `User details saved for ${userName} (${userRole}).`,
      type: 'profile'
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportDatabase = () => {
    const backupData = {
      version: 'BuildHub_v2.4',
      exportDate: new Date().toISOString(),
      builders,
      customers,
      workers,
      projects
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BuildHub_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFactoryReset = () => {
    if (window.confirm('Are you sure you want to reset all Build Hub data to default sample records? This will restore the 12 Builders, 48 Customers, 26 Workers, and 14 Projects.')) {
      resetToDefaultData();
      alert('Build Hub system has been reset to default state.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1B2559]">System Settings & Preferences</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage user credentials, role permissions, and database backups.</p>
        </div>
      </div>

      {/* Profile & RBAC Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/20"
            />
            <div>
              <h3 className="font-bold text-base text-gray-900">{currentUser.name}</h3>
              <p className="text-xs text-blue-600 font-semibold">{currentUser.role} Account</p>
            </div>
          </div>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle size={14} /> Changes Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Role / Access Level</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="Administrator">Administrator (Super User)</option>
              <option value="Builder">Builder / Contractor View</option>
              <option value="Customer">Customer / Property Owner</option>
              <option value="Worker">Worker / Site Tradesman</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#1E60FF] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Update Profile & Role
            </button>
          </div>
        </form>
      </div>

      {/* Database & Data Integrity Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Database size={20} className="text-purple-600" />
          <h3 className="font-bold text-base text-gray-900">Database & Backup Management</h3>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Build Hub stores all records locally with persistent synchronization across your browser session. You can create JSON backups or reset to factory defaults anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#F4F7FE] border border-gray-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-gray-900">Export Complete JSON Backup</h4>
              <p className="text-[11px] text-gray-500 mt-1">
                Download all builders, customers, workforce logs, and project blueprints.
              </p>
            </div>
            <button
              onClick={handleExportDatabase}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-blue-500 rounded-xl text-xs font-bold text-gray-800 transition cursor-pointer"
            >
              <Download size={15} />
              <span>Download Backup (.json)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-red-900">Factory Data Reset</h4>
              <p className="text-[11px] text-red-700/80 mt-1">
                Restore sample database with 12 builders, 48 customers, 26 workers, and 14 projects.
              </p>
            </div>
            <button
              onClick={handleFactoryReset}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
