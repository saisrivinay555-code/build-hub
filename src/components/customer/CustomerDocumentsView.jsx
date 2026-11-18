import React, { useState, useMemo } from 'react';
import {
  FileText,
  Home,
  Receipt,
  Calculator,
  Folder,
  Search,
  Calendar,
  Eye,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DocumentViewerModal from '../common/DocumentViewerModal';
import BuilderDocumentUploadModal from '../common/BuilderDocumentUploadModal';
import { BLUEPRINT_VECTORS } from '../../data/documentsData';

export default function CustomerDocumentsView() {
  const { projectDocuments, currentUser } = useApp();

  const userRole = (currentUser?.role || '').toLowerCase();
  const isBuilder = userRole === 'builder';
  const isAdmin = userRole === 'admin' || userRole === 'administrator';
  const canUpload = isBuilder || isAdmin;

  // Active Tab: 'plans' | 'receipts' | 'bills' | 'other'
  const [activeTab, setActiveTab] = useState('plans');

  // Search queries per tab
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination per tab
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 4 cards per page matching reference image grid

  // Viewer & Upload modals
  const [selectedDocForViewer, setSelectedDocForViewer] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Tab definitions
  const tabs = [
    { id: 'plans', label: 'House Plans & Blueprints', icon: Home },
    { id: 'receipts', label: 'Project Receipts', icon: Receipt },
    { id: 'bills', label: 'Bills & Cost Estimates', icon: Calculator },
    { id: 'other', label: 'Other Documents', icon: Folder }
  ];

  // Filter documents by active tab and search query
  const filteredDocuments = useMemo(() => {
    return (projectDocuments || []).filter((doc) => {
      const matchesCategory = (doc.category || 'plans') === activeTab;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (doc.title && doc.title.toLowerCase().includes(q)) ||
        (doc.name && doc.name.toLowerCase().includes(q)) ||
        (doc.description && doc.description.toLowerCase().includes(q)) ||
        (doc.receiptNumber && doc.receiptNumber.toLowerCase().includes(q)) ||
        (doc.billNumber && doc.billNumber.toLowerCase().includes(q)) ||
        (doc.type && doc.type.toLowerCase().includes(q))
      );
    });
  }, [projectDocuments, activeTab, searchQuery]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / itemsPerPage));
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(start, start + itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleOpenViewer = (doc) => {
    setSelectedDocForViewer(doc);
    setIsViewerOpen(true);
  };

  const handleDownloadDirect = (doc) => {
    if (!doc) return;
    let content = '';
    let fileName = `${(doc.title || doc.name || 'document').replace(/\s+/g, '_')}`;
    let mimeType = 'text/plain';

    if (doc.vectorKey && BLUEPRINT_VECTORS[doc.vectorKey]) {
      content = BLUEPRINT_VECTORS[doc.vectorKey];
      fileName += '.svg';
      mimeType = 'image/svg+xml';
    } else if (doc.previewUrl && doc.previewUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.previewUrl;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } else {
      content = `
BUILD HUB CERTIFIED DOCUMENT
----------------------------------------
Document: ${doc.title || doc.name}
Category: ${doc.category || 'Official Document'}
Version/Ref: ${doc.version || doc.receiptNumber || doc.billNumber || 'v1.0'}
Date: ${doc.date || 'Aug 2026'}
Status: ${doc.status || 'Verified'}
Project: Residential Villa (Sai Attada)
Builder: ${doc.builderName || 'Ravi Constructions'}
----------------------------------------
${doc.description || 'Verified authentic document.'}
      `.trim();
      fileName += '.txt';
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* ──────── 1. TOP HEADER CARD (Matches Reference Image) ──────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#7428E8] flex items-center justify-center shrink-0">
            <FileText size={24} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101D3A] tracking-tight">
              Documents
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Access all your project documents, house plans and blueprints.
            </p>
          </div>
        </div>

        {/* Builder / Admin Upload Action (Only shown for authenticated contractors) */}
        {canUpload && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-purple-500/20 cursor-pointer self-start sm:self-auto"
          >
            <UploadCloud size={17} className="stroke-[2.2]" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* ──────── 2. FOUR CLICKABLE TABS (Matches Reference Image) ──────── */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white border border-[#7428E8] text-[#7428E8] shadow-xs'
                  : 'bg-white/60 hover:bg-white text-gray-600 hover:text-[#7428E8] border border-transparent'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-[#7428E8] stroke-[2.3]' : 'text-gray-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────── 3. MAIN SECTION CARD (Matches Reference Image) ──────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-7 space-y-6">
        {/* Inner Header Row with Title & Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] text-[#7428E8] flex items-center justify-center shrink-0">
              {activeTab === 'plans' && <Home size={20} className="stroke-[2.2]" />}
              {activeTab === 'receipts' && <Receipt size={20} className="stroke-[2.2]" />}
              {activeTab === 'bills' && <Calculator size={20} className="stroke-[2.2]" />}
              {activeTab === 'other' && <Folder size={20} className="stroke-[2.2]" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#101D3A]">
                {activeTab === 'plans' && 'House Plans & Blueprints'}
                {activeTab === 'receipts' && 'Project Receipts'}
                {activeTab === 'bills' && 'Bills & Cost Estimates'}
                {activeTab === 'other' && 'Other Documents'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {activeTab === 'plans' && 'View and download the architectural plans and blueprints for your project.'}
                {activeTab === 'receipts' && 'Certified transaction receipts, payment slips, and material vouchers.'}
                {activeTab === 'bills' && 'Detailed bills of quantities (BOQ), construction bills, and invoices.'}
                {activeTab === 'other' && 'Municipal approvals, building sanctions, contracts, and legal clearances.'}
              </p>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                activeTab === 'plans'
                  ? 'Search plans...'
                  : activeTab === 'receipts'
                  ? 'Search receipts...'
                  : activeTab === 'bills'
                  ? 'Search bills...'
                  : 'Search documents...'
              }
              className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-[#101D3A] focus:outline-none focus:border-[#7428E8] transition"
            />
          </div>
        </div>

        {/* ──────── 4. DOCUMENTS GRID ──────── */}
        {paginatedDocs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#7428E8] flex items-center justify-center mx-auto mb-3">
              <FileText size={26} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No Documents Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : 'No documents have been uploaded under this category yet.'}
            </p>
            {canUpload && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Upload First Document
              </button>
            )}
          </div>
        ) : activeTab === 'plans' ? (
          /* ─── TAB 1: HOUSE PLANS & BLUEPRINTS (Grid of 4 cards per row matching screenshot) ─── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {paginatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all p-3.5 flex flex-col justify-between group"
              >
                {/* Blueprint Architectural Preview */}
                <div>
                  <div className="relative w-full aspect-[16/10] bg-[#0A182F] rounded-xl overflow-hidden border border-gray-100 mb-3 flex items-center justify-center">
                    {doc.previewUrl ? (
                      <img
                        src={doc.previewUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="p-3 text-center">
                        <Home size={28} className="text-[#38BDF8] mx-auto mb-1 opacity-75" />
                        <span className="text-[10px] font-mono text-blue-200">CAD Blueprint</span>
                      </div>
                    )}
                    {/* Three-dots Menu */}
                    <button
                      onClick={() => handleOpenViewer(doc)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                      title="More options"
                    >
                      <MoreVertical size={13} />
                    </button>
                  </div>

                  {/* Document Title */}
                  <h3 className="font-bold text-sm text-[#101D3A] tracking-tight">
                    {doc.title || doc.name}
                  </h3>

                  {/* Metadata Row: Date & Version */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{doc.date}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#7428E8]">
                      {doc.version || 'Version 1.0'}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons: View & Download (Matching Screenshot) */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenViewer(doc)}
                    className="flex-1 py-2 bg-white hover:bg-purple-50 text-[#7428E8] border border-[#7428E8] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDirect(doc)}
                    className="flex-1 py-2 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'receipts' ? (
          /* ─── TAB 2: PROJECT RECEIPTS ─── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      {doc.receiptNumber || 'REC-2026'}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {doc.status || 'Paid'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#101D3A] mt-2.5">
                    {doc.title || doc.name}
                  </h3>
                  <p className="text-xl font-extrabold text-[#7428E8] mt-1">
                    {doc.amount || '₹3,00,000'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {doc.purpose || doc.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
                    <Calendar size={12} />
                    <span>Payment Date: {doc.date}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenViewer(doc)}
                    className="flex-1 py-2 bg-white hover:bg-purple-50 text-[#7428E8] border border-[#7428E8] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Receipt</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDirect(doc)}
                    className="flex-1 py-2 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'bills' ? (
          /* ─── TAB 3: BILLS & COST ESTIMATES ─── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#7428E8]">
                      {doc.billNumber || 'BILL-2026'}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {doc.status || 'Verified'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#101D3A] mt-2.5">
                    {doc.title || doc.name}
                  </h3>
                  <p className="text-xl font-extrabold text-[#101D3A] mt-1">
                    {doc.amount || '₹20,00,000'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Building size={12} />
                      <span>{doc.builderName || 'Ravi Constructions'}</span>
                    </div>
                    <span>{doc.date}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenViewer(doc)}
                    className="flex-1 py-2 bg-white hover:bg-purple-50 text-[#7428E8] border border-[#7428E8] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Bill</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDirect(doc)}
                    className="flex-1 py-2 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ─── TAB 4: OTHER DOCUMENTS ─── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7428E8] border border-purple-100">
                      {doc.type || 'Legal Document'}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {doc.status || 'Verified'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#101D3A] mt-2.5">
                    {doc.title || doc.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{doc.date}</span>
                    </div>
                    <span>{doc.size || '3.5 MB'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenViewer(doc)}
                    className="flex-1 py-2 bg-white hover:bg-purple-50 text-[#7428E8] border border-[#7428E8] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDirect(doc)}
                    className="flex-1 py-2 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──────── 5. CARD FOOTER: COUNT & PAGINATION (Matches Reference Image) ──────── */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing{' '}
            <strong className="text-gray-800">
              {filteredDocuments.length === 0
                ? '0'
                : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                    currentPage * itemsPerPage,
                    filteredDocuments.length
                  )}`}
            </strong>{' '}
            of <strong className="text-gray-800">{filteredDocuments.length}</strong> documents
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#7428E8] text-white shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ──────── 6. MODALS: DOCUMENT VIEWER & BUILDER UPLOAD ──────── */}
      <DocumentViewerModal
        document={selectedDocForViewer}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocForViewer(null);
        }}
      />

      <BuilderDocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
