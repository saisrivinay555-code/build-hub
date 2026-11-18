import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Briefcase, 
  Trash2, 
  Edit3, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  X,
  Calendar,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BuildersView() {
  const { 
    builders = [], 
    deleteBuilder, 
    setModalType, 
    setEditingItem, 
    setCurrentTab,
    currentUser,
    updateBuilderApprovalStatus,
    projects = []
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerification, setFilterVerification] = useState('All');
  const [filterAccountStatus, setFilterAccountStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Selected builder for View Details modal
  const [detailBuilder, setDetailBuilder] = useState(null);
  
  // Rejection reason prompt modal state
  const [rejectionModalBuilder, setRejectionModalBuilder] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Helper to format date
  const formatRegDate = (createdAt) => {
    if (!createdAt) return 'Recent';
    try {
      if (createdAt.toDate && typeof createdAt.toDate === 'function') {
        return createdAt.toDate().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      if (typeof createdAt === 'string' || typeof createdAt === 'number') {
        const d = new Date(createdAt);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      }
      return 'Recent';
    } catch {
      return 'Recent';
    }
  };

  // Helper to get sort timestamp
  const getTimestamp = (b) => {
    if (!b?.createdAt) return 0;
    if (b.createdAt.toDate && typeof b.createdAt.toDate === 'function') {
      return b.createdAt.toDate().getTime();
    }
    const d = new Date(b.createdAt);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  // Filtering and sorting builders
  const filteredBuilders = builders.filter(b => {
    const q = searchTerm.toLowerCase();
    const nameMatch = (b.name || b.fullName || '').toLowerCase().includes(q);
    const companyMatch = (b.company || b.companyName || '').toLowerCase().includes(q);
    const emailMatch = (b.email || '').toLowerCase().includes(q);
    const matchesSearch = nameMatch || companyMatch || emailMatch;

    const bVerification = (b.verificationStatus || 'pending').toLowerCase();
    const matchesVerification = filterVerification === 'All' || 
      bVerification === filterVerification.toLowerCase();

    const bAccount = (b.accountStatus || 'pending').toLowerCase();
    const matchesAccount = filterAccountStatus === 'All' || 
      bAccount === filterAccountStatus.toLowerCase();

    return matchesSearch && matchesVerification && matchesAccount;
  }).sort((a, b) => {
    const timeA = getTimestamp(a);
    const timeB = getTimestamp(b);
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const handleStatusChange = async (builder, newStatus, reason = '') => {
    setActionLoading(true);
    try {
      const bId = builder.uid || builder.id;
      if (updateBuilderApprovalStatus) {
        await updateBuilderApprovalStatus(bId, newStatus, {
          adminEmail: currentUser?.email || 'Admin',
          rejectionReason: reason
        });
      }
      // Update local modal if currently viewing
      if (detailBuilder && (detailBuilder.uid === bId || detailBuilder.id === bId)) {
        setDetailBuilder(prev => ({
          ...prev,
          verificationStatus: newStatus,
          accountStatus: newStatus === 'Approved' ? 'active' : (newStatus === 'Rejected' ? 'rejected' : (newStatus === 'Suspended' ? 'suspended' : 'pending')),
          reviewedBy: currentUser?.email || 'Admin',
          rejectionReason: reason
        }));
      }
    } catch (err) {
      console.error('Failed to update builder status:', err);
      alert('Error updating status: ' + err.message);
    } finally {
      setActionLoading(false);
      setRejectionModalBuilder(null);
      setRejectionReasonInput('');
    }
  };

  const getStatusBadge = (verificationStatus) => {
    const status = (verificationStatus || 'pending').toLowerCase();
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle size={13} className="text-red-600" />
            <span>Rejected</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle size={13} className="text-amber-600" />
            <span>Suspended</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={13} className="text-blue-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const getAccountBadge = (accountStatus) => {
    const status = (accountStatus || 'pending').toLowerCase();
    switch (status) {
      case 'active':
        return <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">Active</span>;
      case 'suspended':
        return <span className="text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">Suspended</span>;
      case 'rejected':
        return <span className="text-[11px] font-bold text-red-700 bg-red-100/60 px-2 py-0.5 rounded">Rejected</span>;
      default:
        return <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E60FF]">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1B2559]">
                Manage Builders ({builders.length})
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Real-time contractor profiles, credentials verification & account governance.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingItem && setEditingItem(null);
            setModalType && setModalType('builder');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E60FF] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add New Builder</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Filter Pills & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Approval Filter */}
          <div className="flex items-center gap-1 bg-[#F4F7FE] p-1 rounded-xl text-xs">
            <span className="text-gray-400 px-2 font-medium">Approval:</span>
            {['All', 'Pending', 'Approved', 'Rejected', 'Suspended'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterVerification(status)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterVerification === status
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F4F7FE] hover:bg-gray-200/70 rounded-xl text-xs font-bold text-gray-700 transition cursor-pointer"
            title="Toggle Registration Date Sort"
          >
            <ArrowUpDown size={14} className="text-gray-500" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Main Builders Table & Empty State */}
      {filteredBuilders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1A30]">
            No builders registered yet. New Builder registrations will appear here automatically.
          </h3>
          <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
            When a contractor registers on the Builder Portal, their profile will be synchronized via real-time Firestore listeners and displayed instantly.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase text-[11px] border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4">Builder & Company</th>
                  <th className="px-4 py-4">Contact Details</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Experience</th>
                  <th className="px-4 py-4">Registered</th>
                  <th className="px-4 py-4">Verification</th>
                  <th className="px-4 py-4">Account Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBuilders.map((builder) => {
                  const bName = builder.name || builder.fullName || 'Unnamed Builder';
                  const bCompany = builder.company || builder.companyName || 'General Contracting';
                  const bLocation = builder.location || builder.city || 'Not Specified';
                  const bExp = builder.experience || builder.experienceYears || 0;
                  const bStatus = builder.verificationStatus || 'pending';

                  return (
                    <tr key={builder.id || builder.uid} className="hover:bg-blue-50/30 transition">
                      {/* Name & Company */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {bName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer" onClick={() => setDetailBuilder(builder)}>
                              {bName}
                            </div>
                            <div className="text-gray-500 text-[11px] font-medium">
                              {bCompany}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                            <Mail size={12} className="text-gray-400" />
                            <span>{builder.email || 'No email'}</span>
                          </div>
                          {builder.phone && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                              <Phone size={11} className="text-gray-400" />
                              <span>{builder.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{bLocation}</span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-4 py-4 text-gray-700 font-medium">
                        <span className="font-bold text-gray-900">{bExp}</span> Years
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-4 text-gray-600 font-medium whitespace-nowrap">
                        {formatRegDate(builder.createdAt)}
                      </td>

                      {/* Verification Status */}
                      <td className="px-4 py-4">
                        {getStatusBadge(bStatus)}
                      </td>

                      {/* Account Status */}
                      <td className="px-4 py-4">
                        {getAccountBadge(builder.accountStatus)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailBuilder(builder)}
                            className="px-3 py-1.5 bg-[#EBF3FF] hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                            title="View Full Registration Profile"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          {/* Quick Approval / Rejection dropdown buttons */}
                          {bStatus.toLowerCase() !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(builder, 'Approved')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs transition cursor-pointer"
                              title="Approve Contractor"
                            >
                              Approve
                            </button>
                          )}

                          {bStatus.toLowerCase() !== 'rejected' && (
                            <button
                              onClick={() => {
                                setRejectionModalBuilder(builder);
                                setRejectionReasonInput('');
                              }}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-xs transition cursor-pointer"
                              title="Reject Application"
                            >
                              Reject
                            </button>
                          )}

                          {bStatus.toLowerCase() !== 'suspended' && (
                            <button
                              onClick={() => handleStatusChange(builder, 'Suspended')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-bold text-xs transition cursor-pointer"
                              title="Suspend Account"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BUILDER DETAILS MODAL (Phase 4 Specification) */}
      {detailBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#081734] to-[#152e60] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#081734] font-black flex items-center justify-center text-xl shadow-md">
                  {(detailBuilder.name || detailBuilder.fullName || 'B').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    {detailBuilder.name || detailBuilder.fullName}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {detailBuilder.company || detailBuilder.companyName || 'Registered Contractor'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailBuilder(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-gray-700">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Official Email</span>
                  <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                    <Mail size={14} className="text-blue-600" />
                    {detailBuilder.email || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Phone Number</span>
                  <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                    <Phone size={14} className="text-emerald-600" />
                    {detailBuilder.phone || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Contractor License</span>
                  <span className="font-bold font-mono text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    {detailBuilder.licenseNo || 'Pending Verification'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Location / City</span>
                  <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin size={14} className="text-red-500" />
                    {detailBuilder.location || detailBuilder.city || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Experience</span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    {detailBuilder.experience || detailBuilder.experienceYears || 0} Years in Construction
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Specialization</span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    {detailBuilder.specialization || 'General Contractor'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Firebase Auth UID</span>
                  <span className="font-mono text-gray-600 text-[11px] truncate block mt-0.5">
                    {detailBuilder.uid || detailBuilder.id}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-medium block">Registration Date</span>
                  <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                    {formatRegDate(detailBuilder.createdAt)}
                  </span>
                </div>
              </div>

              {/* Status and Audit Info */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-blue-900 block">Current Verification Status</span>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusBadge(detailBuilder.verificationStatus)}
                    {getAccountBadge(detailBuilder.accountStatus)}
                  </div>
                </div>

                {detailBuilder.reviewedBy && (
                  <div className="text-right sm:text-right text-[11px] text-gray-500">
                    <span>Reviewed by: <strong className="text-gray-800">{detailBuilder.reviewedBy}</strong></span>
                    {detailBuilder.rejectionReason && (
                      <p className="text-red-600 font-medium mt-0.5">
                        Reason: {detailBuilder.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Associated Projects */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                  <Briefcase size={15} className="text-blue-600" />
                  <span>Associated Construction Projects</span>
                </h4>
                {projects.filter(p => p.builderEmail === detailBuilder.email || p.builderId === detailBuilder.uid).length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 font-medium">
                    No construction projects assigned to this builder yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.filter(p => p.builderEmail === detailBuilder.email || p.builderId === detailBuilder.uid).map(p => (
                      <div key={p.id} className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-2xs">
                        <div>
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-[11px] text-gray-500">{p.type} • {p.location}</div>
                        </div>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {p.status} ({p.progress}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons for Admin Workflow */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => handleStatusChange(detailBuilder, 'Approved')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <CheckCircle2 size={15} />
                  <span>Approve Builder</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRejectionModalBuilder(detailBuilder);
                    setRejectionReasonInput('');
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <XCircle size={15} />
                  <span>Reject Application</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(detailBuilder, 'Suspended')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <AlertTriangle size={15} />
                  <span>Suspend</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(detailBuilder, 'Pending')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Clock size={15} />
                  <span>Set Pending</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON PROMPT MODAL */}
      {rejectionModalBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-extrabold text-base text-gray-900">
                Reject Contractor Application
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Please enter the official reason for rejecting <strong>{rejectionModalBuilder.name || rejectionModalBuilder.fullName}</strong>. This note will be recorded in the security audit trail.
            </p>

            <textarea
              rows="3"
              placeholder="e.g. Invalid contractor license, missing credentials, unverified firm registration..."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalBuilder(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(rejectionModalBuilder, 'Rejected', rejectionReasonInput)}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
