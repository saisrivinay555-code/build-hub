import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function BuilderDocumentUploadModal({ isOpen, onClose }) {
  const { myProjects, uploadProjectDocument } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState(myProjects[0]?.id || 'cp_ramesh_1');
  const [category, setCategory] = useState('plans');
  const [docTitle, setDocTitle] = useState('');
  const [version, setVersion] = useState('Version 1.0');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }

    setIsSubmitting(true);
    try {
      await uploadProjectDocument({
        projectId: selectedProjectId,
        category,
        title: docTitle,
        name: docTitle,
        version: version || 'Version 1.0',
        amount: amount ? (amount.startsWith('₹') ? amount : `₹${amount}`) : '',
        description,
        previewUrl: filePreview,
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
        setDocTitle('');
        setVersion('Version 1.0');
        setAmount('');
        setDescription('');
        setSelectedFile(null);
        setFilePreview(null);
      }, 1200);
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* Project Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Target Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
              >
                {myProjects.length > 0 ? (
                  myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.customer || 'Assigned Customer'})
                    </option>
                  ))
                ) : (
                  <option value="cp_ramesh_1">Residential Villa (Sai Attada)</option>
                )}
              </select>
            </div>

            {/* Document Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Document Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
              >
                <option value="plans">House Plans & Blueprints</option>
                <option value="receipts">Project Receipts</option>
                <option value="bills">Bills & Cost Estimates</option>
                <option value="other">Other Documents & Approvals</option>
              </select>
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Document Title / Drawing Name
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Electrical Conduit Plan or Foundation Raft"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
              />
            </div>

            {/* Version & Amount Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Version / Reference
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. Version 1.0 or REC-2026-90"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>

              {(category === 'receipts' || category === 'bills') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. ₹2,50,000"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                  />
                </div>
              )}
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Upload File (Image, PDF or CAD Drawing)
              </label>
              <label className="border-2 border-dashed border-[#E9D5FF] bg-[#FAF5FF]/60 hover:bg-[#FAF5FF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition">
                <UploadCloud size={26} className="text-[#7428E8] mb-1" />
                <span className="text-xs font-bold text-[#7428E8]">
                  {selectedFile ? selectedFile.name : 'Click to choose file or drag & drop'}
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  PNG, JPG, WEBP or PDF (Max 15MB)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Description / Engineering Notes
              </label>
              <textarea
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

