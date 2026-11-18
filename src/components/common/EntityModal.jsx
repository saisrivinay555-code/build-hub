import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  FolderPlus, 
  Check,
  Calendar,
  MapPin,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function EntityModal() {
  const { 
    modalType, 
    setModalType, 
    editingItem, 
    setEditingItem,
    addCustomer, 
    addProject,
    currentUser
  } = useApp();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      if (modalType === 'add_customer' || modalType === 'customer') {
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: 'Hyderabad',
          project: 'New Villa Project',
          totalSpent: '$450,000'
        });
      } else if (modalType === 'create_project' || modalType === 'project') {
        setFormData({
          name: '',
          type: 'Residential',
          customer: 'Ramesh Kumar',
          status: 'Ongoing',
          progress: 15,
          budget: '$450,000',
          deadline: 'Dec 31, 2025',
          location: 'Hyderabad',
          description: 'Contemporary construction project with quality finishes.'
        });
      }
    }
  }, [modalType, editingItem]);

  if (!modalType) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'add_customer' || modalType === 'customer') {
      addCustomer(formData);
    } else if (modalType === 'create_project' || modalType === 'project') {
      addProject(formData);
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setModalType(null);
    setEditingItem(null);
  };

  const isCustomer = modalType === 'add_customer' || modalType === 'customer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#071739] to-[#0d2757] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white">
              {isCustomer ? <UserPlus size={20} /> : <FolderPlus size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {isCustomer ? 'Add New Customer' : 'Create New Construction Project'}
              </h3>
              <p className="text-xs text-gray-300">
                {isCustomer ? 'Register client details into your builder records.' : 'Set up a new contracted site and milestone schedule.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setModalType(null);
              if (typeof setEditingItem === 'function') setEditingItem(null);
            }}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isCustomer ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 11223"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / Location</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hyderabad, Vijayawada"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Name</label>
                  <input
                    type="text"
                    value={formData.project || ''}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    placeholder="Residential Villa"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Residential Villa Phase 2"
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Customer / Client</label>
                  <input
                    type="text"
                    required
                    value={formData.customer || ''}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Hyderabad"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Budget Allocation</label>
                  <input
                    type="text"
                    required
                    value={formData.budget || '$450,000'}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="$450,000"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Deadline</label>
                  <input
                    type="text"
                    required
                    value={formData.deadline || 'Aug 30, 2025'}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="Aug 30, 2025"
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Check size={16} />
              <span>{isCustomer ? 'Save Customer' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
