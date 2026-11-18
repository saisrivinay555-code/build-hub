import React from 'react';
import { FileText, Download, Eye, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerDocumentsView() {
  const { customerDocuments } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-[#8B5CF6]">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30]">
              Project Documents & Verified Blueprints
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access certified contracts, municipal permissions, architectural drawings, and test reports.
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {customerDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0B1A30] leading-snug">{doc.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{doc.type} • {doc.size}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shrink-0">
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono text-[11px]">Uploaded: {doc.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Viewing ${doc.name}...`)}
                  className="px-3 py-1.5 bg-[#F4F7FE] hover:bg-blue-50 text-[#1E60FF] font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => alert(`Downloading ${doc.name}...`)}
                  className="px-3 py-1.5 bg-[#092257] hover:bg-[#07183d] text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
