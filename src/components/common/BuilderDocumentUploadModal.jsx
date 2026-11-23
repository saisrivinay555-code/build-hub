import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

const BLUEPRINT_CATEGORIES = [
  'Floor Plan',
  'Elevation Plan',
  'Structural Plan',
  'Site Layout Plan',
  'Foundation Plan',
  'Electrical Layout',
  'Plumbing Layout',
  'Interior Layout',
  'Architectural Drawings',
  'Construction Agreement',
  'Building Approvals',
  'Other Architectural Plan'
];

const RECEIPT_CATEGORIES = [
  'Advance Payment Receipt',
  'Customer Payment Receipt',
  'Material Purchase Receipt',
  'Labour Payment Receipt',
  'Equipment Purchase Receipt',
  'Other Payment Receipt'
];

const BILL_CATEGORIES = [
  'Construction Quotation',
  'Material Cost Breakdown',
  'Labour Cost Breakdown',
  'Additional Expenses',
  'Construction Stage Bill',
  'Final Project Invoice'
];

const OTHER_CATEGORIES = [
  'Construction Agreement',
  'Municipal Approval',
  'Building Permit',
  'Land Documents',
  'Quality Test Report',
  'Legal Documents',
  'Other Supporting Document'
];

function getVectorKeyFromTitle(title = '') {
  const t = title.toLowerCase();
  if (t.includes('floor')) return 'floor-plan';
  if (t.includes('elevation')) return 'elevation-plan';
  if (t.includes('structural')) return 'structural-plan';
  if (t.includes('site') || t.includes('layout')) return 'site-layout';
  if (t.includes('electric')) return 'electrical-plan';
  if (t.includes('plumb')) return 'plumbing-plan';
  if (t.includes('foundation')) return 'foundation-plan';
  if (t.includes('interior')) return 'interior-layout';
  return null;
}

export default function BuilderDocumentUploadModal({ 
  isOpen, 
  onClose, 
  initialCategory = 'plans', 
  initialProjectId = null 
}) {
  if (!isOpen) return null;

  return (
    <BuilderDocumentUploadDialog
      key={`${initialCategory}_${initialProjectId || 'default'}`}
      onClose={onClose}
      initialCategory={initialCategory}
      initialProjectId={initialProjectId}
    />
  );
}

function BuilderDocumentUploadDialog({
  onClose,
  initialCategory = 'plans',
  initialProjectId = null
}) {
  const { myProjects, uploadProjectDocument } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || myProjects[0]?.id || 'bp1'
  );
  const [section, setSection] = useState(initialCategory || 'plans');
  const [specificCategory, setSpecificCategory] = useState(() => {
    if (initialCategory === 'receipts') return RECEIPT_CATEGORIES[0];
    if (initialCategory === 'bills') return BILL_CATEGORIES[0];
    if (initialCategory === 'other') return OTHER_CATEGORIES[0];
    return BLUEPRINT_CATEGORIES[0];
  });
  const [docTitle, setDocTitle] = useState(() => {
    if (initialCategory === 'receipts') return RECEIPT_CATEGORIES[0];
    if (initialCategory === 'bills') return BILL_CATEGORIES[0];
    if (initialCategory === 'other') return OTHER_CATEGORIES[0];
    return BLUEPRINT_CATEGORIES[0];
  });
  const [version, setVersion] = useState(() => {
    if (initialCategory === 'receipts') return `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    if (initialCategory === 'bills') return `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;
    return 'Version 1.0';
  });
  const [amount, setAmount] = useState('');
  const [docStatus, setDocStatus] = useState(() => {
    if (initialCategory === 'plans') return 'GHMC Approved';
    if (initialCategory === 'receipts') return 'Paid';
    return 'Verified';
  });
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    let firstCat = BLUEPRINT_CATEGORIES[0];
    let defaultStatus = 'GHMC Approved';
    let defaultVersion = 'Version 1.0';

    if (newSection === 'receipts') {
      firstCat = RECEIPT_CATEGORIES[0];
      defaultStatus = 'Paid';
      defaultVersion = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    } else if (newSection === 'bills') {
      firstCat = BILL_CATEGORIES[0];
      defaultStatus = 'Verified';
      defaultVersion = `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;
    } else if (newSection === 'other') {
      firstCat = OTHER_CATEGORIES[0];
      defaultStatus = 'Verified';
    }

    setSpecificCategory(firstCat);
    setDocTitle(firstCat);
    setDocStatus(defaultStatus);
    setVersion(defaultVersion);
  };

  const handleSpecificCategoryChange = (cat) => {
    setSpecificCategory(cat);
    setDocTitle(cat);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }

    setIsSubmitting(true);
    try {
      const targetProject = myProjects.find(p => p.id === selectedProjectId) || myProjects[0];
      const vectorKey = getVectorKeyFromTitle(docTitle);

      await uploadProjectDocument({
        projectId: selectedProjectId,
        projectName: targetProject?.name || 'Dream Villa',
        customerName: targetProject?.customer || 'Ramesh Kumar',
        category: section,
        subCategory: specificCategory,
        title: docTitle.trim(),
        name: docTitle.trim(),
        version: version || 'Version 1.0',
        amount: amount ? (amount.startsWith('₹') ? amount : `₹${amount}`) : '',
        status: docStatus,
        description: description.trim() || `Official ${specificCategory} document for ${targetProject?.name || 'project'}.`,
        previewUrl: filePreview,
        vectorKey: vectorKey,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccessMessage('Document uploaded and published to customer dashboard!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = 
    section === 'receipts'
      ? RECEIPT_CATEGORIES
      : section === 'bills'
      ? BILL_CATEGORIES
      : section === 'other'
      ? OTHER_CATEGORIES
      : BLUEPRINT_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-[#7428E8]">
              <UploadCloud size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#101D3A]">Upload Project Document</h3>
              <p className="text-xs text-gray-500">Publish blueprints, receipts, bills or agreements</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {successMessage ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-base font-bold text-gray-800">Upload Successful!</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Target Project Selection */}
            <div>
              <label htmlFor="target-project-select" className="block text-xs font-bold text-gray-700 mb-1.5">
                Target Project
              </label>
              <select
                id="target-project-select"
                name="targetProject"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
              >
                {myProjects.length > 0 ? (
                  myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.customer || 'Assigned Customer'}) • {p.location || 'Site'}
                    </option>
                  ))
                ) : (
                  <option value="bp1">Dream Villa (Ramesh Kumar) • Hyderabad</option>
                )}
              </select>
            </div>

            {/* Document Section Pills */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Document Section
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSectionChange('plans')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    section === 'plans'
                      ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  Blueprints
                </button>
                <button
                  type="button"
                  onClick={() => handleSectionChange('receipts')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    section === 'receipts'
                      ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  Receipts
                </button>
                <button
                  type="button"
                  onClick={() => handleSectionChange('bills')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    section === 'bills'
                      ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  Bills
                </button>
                <button
                  type="button"
                  onClick={() => handleSectionChange('other')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    section === 'other'
                      ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  Other Docs
                </button>
              </div>
            </div>

            {/* Specific Category Selection */}
            <div>
              <label htmlFor="specific-category-select" className="block text-xs font-bold text-gray-700 mb-1.5">
                Select Document Category
              </label>
              <select
                id="specific-category-select"
                name="specificCategory"
                value={specificCategory}
                onChange={(e) => handleSpecificCategoryChange(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Title / Name */}
            <div>
              <label htmlFor="document-title-input" className="block text-xs font-bold text-gray-700 mb-1.5">
                Document Title
              </label>
              <input
                id="document-title-input"
                name="docTitle"
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Ground Floor Plan or Advance Payment Receipt"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
              />
            </div>

            {/* Version & Reference Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="document-version-input" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Version / Reference #
                </label>
                <input
                  id="document-version-input"
                  name="version"
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. Version 1.0 or REC-2026-90"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>

              <div>
                <label htmlFor="document-status-select" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Document Status
                </label>
                <select
                  id="document-status-select"
                  name="docStatus"
                  value={docStatus}
                  onChange={(e) => setDocStatus(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                >
                  <option value="Verified">Verified</option>
                  <option value="GHMC Approved">GHMC Approved</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>

            {/* Financial Amount Input (Only for receipts or bills) */}
            {(section === 'receipts' || section === 'bills') && (
              <div>
                <label htmlFor="document-amount-input" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Amount in INR (₹)
                </label>
                <input
                  id="document-amount-input"
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. ₹5,00,000"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>
            )}

            {/* File Upload Box */}
            <div>
              <label htmlFor="doc-file-input" className="block text-xs font-bold text-gray-700 mb-1.5">
                Upload File (Image, PDF or CAD Drawing)
              </label>

              {selectedFile ? (
                <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {filePreview && selectedFile.type.startsWith('image/') ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-purple-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#7428E8] flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#101D3A] truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="doc-file-input"
                  className="border-2 border-dashed border-[#E9D5FF] bg-[#FAF5FF]/60 hover:bg-[#FAF5FF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition"
                >
                  <UploadCloud size={26} className="text-[#7428E8] mb-1" />
                  <span className="text-xs font-bold text-[#7428E8]">
                    Click to choose file or drag & drop
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5">
                    PNG, JPG, WEBP or PDF (Max 15MB)
                  </span>
                  <input
                    id="doc-file-input"
                    name="docFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="document-desc-textarea" className="block text-xs font-bold text-gray-700 mb-1.5">
                Description / Engineering Notes
              </label>
              <textarea
                id="document-desc-textarea"
                name="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add structural specifications, approvals or payment details..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-[#101D3A] focus:outline-none focus:border-[#7428E8] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !docTitle.trim()}
              className="w-full py-3 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Document...</span>
              ) : (
                <>
                  <UploadCloud size={18} />
                  <span>Publish Document</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
