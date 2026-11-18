import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  FolderKanban, 
  Calendar, 
  Eye, 
  X, 
  ArrowUpDown,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomersView() {
  const { 
    customers = [], 
    deleteCustomer, 
    setModalType, 
    setEditingItem, 
    setCurrentTab, 
    setSelectedProjectForDetail, 
    projects = [],
    customerRequests = [],
    currentUser,
    updateCustomerAccountStatus
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccountStatus, setFilterAccountStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Selected customer for View Details modal
  const [detailCustomer, setDetailCustomer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Format registration date helper
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

  // Timestamp extraction helper
  const getTimestamp = (c) => {
    if (!c?.createdAt) return 0;
    if (c.createdAt.toDate && typeof c.createdAt.toDate === 'function') {
      return c.createdAt.toDate().getTime();
    }
    const d = new Date(c.createdAt);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  // Calculate actual associated construction projects
  const getCustomerProjects = (customer) => {
    if (!customer) return [];
    const cId = customer.uid || customer.id;
    const cEmail = (customer.email || '').toLowerCase().trim();
    return projects.filter(p => {
      const matchId = p.customerId && p.customerId === cId;
      const matchEmail = p.customerEmail && p.customerEmail.toLowerCase().trim() === cEmail;
      return matchId || matchEmail;
    });
  };

  // Calculate customer inquiries/requests
  const getCustomerRequests = (customer) => {
    if (!customer) return [];
    const cEmail = (customer.email || '').toLowerCase().trim();
    return customerRequests.filter(r => (r.email || '').toLowerCase().trim() === cEmail);
  };

  // Filter and sort customers
  const filteredCustomers = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    const nameMatch = (c.fullName || c.name || '').toLowerCase().includes(q);
    const emailMatch = (c.email || '').toLowerCase().includes(q);
    const cityMatch = (c.city || c.location || '').toLowerCase().includes(q);
    const matchesSearch = nameMatch || emailMatch || cityMatch;

    const accStatus = (c.accountStatus || 'active').toLowerCase();
    const matchesStatus = filterAccountStatus === 'All' || accStatus === filterAccountStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const timeA = getTimestamp(a);
    const timeB = getTimestamp(b);
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const handleStatusChange = async (customer, newStatus) => {
    setActionLoading(true);
    try {
      const cId = customer.uid || customer.id;
      if (updateCustomerAccountStatus) {
        await updateCustomerAccountStatus(cId, newStatus, {
          adminEmail: currentUser?.email || 'Admin'
        });
      }
      if (detailCustomer && (detailCustomer.uid === cId || detailCustomer.id === cId)) {
        setDetailCustomer(prev => ({ ...prev, accountStatus: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update customer status:', err);
      alert('Error updating status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getAccountBadge = (accountStatus) => {
    const status = (accountStatus || 'active').toLowerCase();
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Active</span>
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200">
            <Clock size={13} className="text-gray-500" />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#10B981]">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1B2559]">
                Manage Customers ({customers.length})
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Real-time property owner accounts, linked construction projects and requests.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingItem && setEditingItem(null);
            setModalType && setModalType('customer');
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#10B981] hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F4F7FE] p-1 rounded-xl text-xs">
            <span className="text-gray-400 px-2 font-medium">Status:</span>
            {['All', 'Active', 'Suspended'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterAccountStatus(status)}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterAccountStatus === status
                    ? 'bg-white text-emerald-600 shadow-xs'
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

      {/* Main Customers Table & Empty State */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1A30]">
            No customers registered yet. New Customer registrations will appear here automatically.
          </h3>
          <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
            When a property owner registers on the Customer Portal, their profile will be synchronized via real-time Firestore listeners and displayed instantly.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase text-[11px] border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4">Customer Name</th>
                  <th className="px-4 py-4">Email Address</th>
                  <th className="px-4 py-4">Phone Number</th>
                  <th className="px-4 py-4">City / Location</th>
                  <th className="px-4 py-4">Registration Date</th>
                  <th className="px-4 py-4">Account Status</th>
                  <th className="px-4 py-4 text-center">Projects</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => {
                  const cName = customer.fullName || customer.name || 'Unnamed Customer';
                  const cProjects = getCustomerProjects(customer);
                  const projectCount = cProjects.length;

                  return (
                    <tr key={customer.id || customer.uid} className="hover:bg-emerald-50/30 transition">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {cName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div 
                              className="font-bold text-gray-900 text-sm hover:text-emerald-600 cursor-pointer"
                              onClick={() => setDetailCustomer(customer)}
                            >
                              {cName}
                            </div>
                            <div className="text-gray-400 font-mono text-[10px] truncate max-w-[120px]">
                              {customer.uid || customer.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Mail size={12} className="text-gray-400" />
                          <span>{customer.email || 'No email'}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Phone size={12} className="text-gray-400" />
                          <span>{customer.phone || 'N/A'}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{customer.city || customer.location || 'Not Specified'}</span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="px-4 py-4 text-gray-600 font-medium whitespace-nowrap">
                        {formatRegDate(customer.createdAt)}
                      </td>

                      {/* Account Status */}
                      <td className="px-4 py-4">
                        {getAccountBadge(customer.accountStatus)}
                      </td>

                      {/* Number of Projects */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          projectCount > 0 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {projectCount}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailCustomer(customer)}
                            className="px-3 py-1.5 bg-[#E8F8F0] hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                            title="View Customer Profile & Projects"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          {(customer.accountStatus || 'active').toLowerCase() === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(customer, 'suspended')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-xs transition cursor-pointer"
                              title="Suspend Customer Account"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(customer, 'active')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs transition cursor-pointer"
                              title="Activate Customer Account"
                            >
                              Activate
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

      {/* CUSTOMER DETAILS MODAL (Phase 5 Specification) */}
      {detailCustomer && (() => {
        const cName = detailCustomer.fullName || detailCustomer.name;
        const linkedProjects = getCustomerProjects(detailCustomer);
        const linkedRequests = getCustomerRequests(detailCustomer);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-[#081734] to-[#133256] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-[#081734] font-black flex items-center justify-center text-xl shadow-md">
                    {cName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">
                      {cName}
                    </h3>
                    <p className="text-xs text-emerald-300 font-medium">
                      Registered Customer & Property Owner
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDetailCustomer(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-gray-700">
                {/* Registered Profile Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-medium block">Email Address</span>
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <Mail size={14} className="text-blue-600" />
                      {detailCustomer.email || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium block">Phone Number</span>
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <Phone size={14} className="text-emerald-600" />
                      {detailCustomer.phone || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium block">City / Location</span>
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <MapPin size={14} className="text-red-500" />
                      {detailCustomer.city || detailCustomer.location || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium block">Site Address</span>
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <Home size={14} className="text-purple-600" />
                      {detailCustomer.address || 'No specific site address entered'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium block">Firebase Auth UID</span>
                    <span className="font-mono text-gray-600 text-[11px] truncate block mt-0.5">
                      {detailCustomer.uid || detailCustomer.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium block">Registered Since</span>
                    <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                      {formatRegDate(detailCustomer.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status Box */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-900 block">Account Status</span>
                    <div className="mt-1">
                      {getAccountBadge(detailCustomer.accountStatus)}
                    </div>
                  </div>

                  <div>
                    {(detailCustomer.accountStatus || 'active').toLowerCase() === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(detailCustomer, 'suspended')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        Suspend Account
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(detailCustomer, 'active')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        Activate Account
                      </button>
                    )}
                  </div>
                </div>

                {/* Associated Construction Projects */}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                    <FolderKanban size={15} className="text-emerald-600" />
                    <span>Associated Construction Projects ({linkedProjects.length})</span>
                  </h4>

                  {linkedProjects.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 font-medium">
                      No construction projects created or assigned to this customer yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {linkedProjects.map((p) => (
                        <div key={p.id} className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                            <span className="font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              {p.status} ({p.progress}%)
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-3">
                            <span>🏗️ Builder: <strong className="text-gray-700">{p.builderName || 'Unassigned'}</strong></span>
                            <span>📍 Location: <strong className="text-gray-700">{p.location || 'N/A'}</strong></span>
                            <span>💰 Total Cost: <strong className="text-gray-700">{p.totalCost || '₹0'}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Relevant Customer Requests */}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                    <FileText size={15} className="text-blue-600" />
                    <span>Inquiries & Requests ({linkedRequests.length})</span>
                  </h4>

                  {linkedRequests.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 font-medium">
                      No inquiries submitted by this customer.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {linkedRequests.map((r, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                          <div>
                            <div className="font-bold text-gray-800">{r.subject || r.type || 'Inquiry'}</div>
                            <div className="text-[11px] text-gray-500">{r.message || r.description}</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {r.status || 'Received'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setDetailCustomer(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
