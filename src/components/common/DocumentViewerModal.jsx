import React, { useState, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Building,
  Printer,
  Sparkles
} from 'lucide-react';
import { BLUEPRINT_VECTORS } from '../../data/documentsData';

export default function DocumentViewerModal({ document: doc, isOpen, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Reset zoom when modal opens or document changes
    setZoomLevel(1);
    setIsFullscreen(false);
  }, [doc, isOpen]);

  if (!isOpen || !doc) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (!doc) return;
    
    // Create text / SVG / mock blob for download
    let content = '';
    let fileName = `${(doc.title || doc.name || 'document').replace(/\s+/g, '_')}`;
    let mimeType = 'text/plain';

    if (doc.vectorKey && BLUEPRINT_VECTORS[doc.vectorKey]) {
      content = BLUEPRINT_VECTORS[doc.vectorKey];
      fileName += '.svg';
      mimeType = 'image/svg+xml';
    } else if (doc.previewUrl && doc.previewUrl.startsWith('data:')) {
      // If base64 data url
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
Version/Reference: ${doc.version || doc.receiptNumber || doc.billNumber || 'v1.0'}
Date: ${doc.date || new Date().toLocaleDateString()}
Status: ${doc.status || 'Verified'}
Project: Residential Villa (Plot 42, Jubilee Hills Ext., Hyderabad)
Customer: Sai Attada
Builder: ${doc.builderName || 'Ravi Constructions'}
----------------------------------------
${doc.description || 'Verified authentic document stored in Build Hub cloud.'}
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

  const handlePrint = () => {
    window.print();
  };

  const vectorSvg = doc.vectorKey && BLUEPRINT_VECTORS[doc.vectorKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`bg-[#0B1528] rounded-3xl border border-gray-700/60 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none fixed inset-0'
            : 'w-full max-w-5xl max-h-[92vh] h-[85vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-[#0F1D38] px-4 sm:px-6 py-3.5 border-b border-gray-700/60 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white leading-tight">
                  {doc.title || doc.name}
                </h2>
                {(doc.version || doc.receiptNumber || doc.billNumber) && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30">
                    {doc.version || doc.receiptNumber || doc.billNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                <span>{doc.date}</span>
                <span>•</span>
                <span className="capitalize">{doc.category || 'Document'}</span>
                {doc.status && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{doc.status}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action & Zoom Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Zoom Controls */}
            <div className="bg-gray-800/80 border border-gray-700 rounded-xl px-2 py-1 flex items-center gap-1.5 text-xs">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title="Zoom Out"
                className="p-1 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ZoomOut size={16} />
              </button>
              <span className="font-mono text-gray-300 w-11 text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                title="Zoom In"
                className="p-1 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Zoom"
                className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer ml-1"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
            >
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>

            {/* Print Document */}
            <button
              onClick={handlePrint}
              title="Print Document"
              className="hidden sm:flex p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
            >
              <Printer size={17} />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer transition"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close Viewer"
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition cursor-pointer"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Document Content Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-[#070E1A]">
          <div
            className="transition-transform duration-150 origin-center max-w-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* 1. BLUEPRINT VECTOR VIEW */}
            {vectorSvg ? (
              <div
                className="w-[760px] max-w-full bg-[#0A182F] rounded-2xl overflow-hidden shadow-2xl border border-blue-900/50"
                dangerouslySetInnerHTML={{ __html: vectorSvg }}
              />
            ) : doc.category === 'receipts' ? (
              /* 2. CERTIFIED RECEIPT VOUCHER VIEW */
              <div className="w-[620px] max-w-full bg-white text-gray-900 rounded-2xl p-7 shadow-2xl border border-gray-200 font-sans relative overflow-hidden">
                {/* Build Hub Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-9xl font-black text-purple-900 rotate-[-30deg]">
                  BUILDHUB
                </div>

                {/* Receipt Header */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                  <div>
                    <span className="text-xs font-black tracking-widest text-[#7428E8] uppercase">
                      BUILD HUB SMART CONSTRUCTION
                    </span>
                    <h3 className="text-xl font-extrabold text-[#101D3A] mt-1">
                      Official Payment Voucher
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      GHMC Sanctioned Project • RERA Certified
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs">
                      ✓ {doc.status || 'PAID IN FULL'}
                    </span>
                    <p className="font-mono text-xs text-gray-400 mt-2">
                      Receipt No: <strong className="text-gray-800">{doc.receiptNumber || 'REC-2026-001'}</strong>
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 py-5 border-b border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Billed To (Customer):</span>
                    <p className="font-bold text-gray-800 text-sm mt-0.5">Sai Attada</p>
                    <p className="text-gray-500">Plot 42, Jubilee Hills Ext., Hyderabad</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Issued By (Contractor):</span>
                    <p className="font-bold text-gray-800 text-sm mt-0.5">{doc.builderName || 'Ravi Constructions'}</p>
                    <p className="text-gray-500">Reg: #BUILD-HYD-5520 • Class 1 Civil</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Payment Date:</span>
                    <p className="font-bold text-gray-800 mt-0.5">{doc.date || 'Aug 15, 2026'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Payment Mode:</span>
                    <p className="font-bold text-gray-800 mt-0.5">{doc.paymentMethod || 'Bank Wire / NEFT'}</p>
                  </div>
                </div>

                {/* Purpose & Amount */}
                <div className="py-5 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">Payment Description:</span>
                  <p className="font-bold text-gray-800 text-sm mt-1">{doc.purpose || doc.title}</p>
                  <div className="mt-4 bg-[#F5F6FF] rounded-xl p-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Total Amount Settled:</span>
                    <span className="text-2xl font-black text-[#7428E8]">{doc.amount || '₹3,00,000'}</span>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="pt-5 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <ShieldCheck size={16} />
                    <span>Digital Verification Hash Verified</span>
                  </div>
                  <div className="text-right">
                    <p className="font-serif italic font-bold text-gray-700">Ravi Kumar</p>
                    <p className="text-[10px] text-gray-400">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            ) : doc.category === 'bills' ? (
              /* 3. ITEMISED CONSTRUCTION BILL & ESTIMATE VIEW */
              <div className="w-[640px] max-w-full bg-white text-gray-900 rounded-2xl p-7 shadow-2xl border border-gray-200 font-sans relative">
                <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                  <div>
                    <span className="text-xs font-black tracking-widest text-[#7428E8] uppercase">
                      BUILD HUB CONSTRUCTION BILLING
                    </span>
                    <h3 className="text-xl font-extrabold text-[#101D3A] mt-1">
                      {doc.title || doc.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Bill No: <span className="font-mono font-bold text-gray-800">{doc.billNumber || 'BILL-2026-01'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-purple-50 text-[#7428E8] border border-purple-200 rounded-full font-bold text-xs">
                      {doc.status || 'Verified'}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">Date: {doc.date}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="py-4 text-xs text-gray-600 border-b border-gray-100">
                  <p className="font-semibold text-gray-800 mb-1">Scope of Work / Description:</p>
                  <p>{doc.description || 'Turn-key construction estimation & material BOQ schedule.'}</p>
                </div>

                {/* Line Items Table */}
                <div className="py-4 border-b border-gray-100 text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 pb-2">
                        <th className="font-semibold pb-2">Milestone / Item</th>
                        <th className="font-semibold pb-2 text-right">Units</th>
                        <th className="font-semibold pb-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="py-2.5 font-medium text-gray-800">Primary Civil Construction Phase</td>
                        <td className="py-2.5 text-right text-gray-500">1,000 sq.ft</td>
                        <td className="py-2.5 text-right font-bold text-gray-800">{doc.amount || '₹20,00,000'}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-gray-800">Structural Quality Inspection & Testing</td>
                        <td className="py-2.5 text-right text-gray-500">Batch M25</td>
                        <td className="py-2.5 text-right font-bold text-gray-800">Included</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-gray-800">Architectural Cadastral Stamping</td>
                        <td className="py-2.5 text-right text-gray-500">GHMC Permitted</td>
                        <td className="py-2.5 text-right font-bold text-gray-800">Included</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">Issued by:</span>
                    <p className="font-bold text-gray-800 text-xs">{doc.builderName || 'Ravi Constructions'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-500">Total Billed Amount</span>
                    <p className="text-2xl font-black text-[#7428E8]">{doc.amount || '₹20,00,000'}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* 4. DEFAULT IMAGE OR LEGAL DOCUMENT VIEW */
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 max-w-xl text-center">
                {doc.previewUrl && (
                  <img
                    src={doc.previewUrl}
                    alt={doc.title}
                    className="max-h-[500px] w-auto mx-auto rounded-xl shadow-xs object-contain"
                  />
                )}
                <div className="mt-4 text-left">
                  <h4 className="font-bold text-base text-[#101D3A]">{doc.title || doc.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>Uploaded: {doc.date}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7428E8] font-bold">
                      {doc.version || doc.status || 'Verified'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

