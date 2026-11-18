import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, Circle, Clock, Save, ChevronRight, UploadCloud, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function ProjectProgressView() {
  const { myProjects, updateProjectProgress, toggleProjectMilestone, uploadConstructionImages } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(myProjects[0]?.id || 'cp_ramesh_1');
  const [uploadStage, setUploadStage] = useState('Interior & Finishing');
  const [uploadDate, setUploadDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  );
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  const stageOptions = [
    'Foundation',
    'Structure',
    'Brickwork',
    'Plumbing',
    'Electrical',
    'Interior & Finishing',
    'Painting',
    'Final Handover'
  ];

  const handleSliderChange = (id, val) => {
    updateProjectProgress(id, val);
  };

  const handleMilestoneClick = (projectId, milestoneIdx) => {
    toggleProjectMilestone(projectId, milestoneIdx);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(f =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type)
    );

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrls(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!previewUrls.length) {
      alert('Please select at least one photograph to upload.');
      return;
    }

    setIsSubmitting(true);
    try {
      await uploadConstructionImages({
        projectId: selectedProjectId,
        stage: uploadStage,
        description: uploadDescription,
        uploadDate: uploadDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        images: previewUrls
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      setUploadSuccessMessage('Construction photographs uploaded and synced to customer view!');
      setTimeout(() => {
        setUploadSuccessMessage('');
        setIsUploadModalOpen(false);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setUploadDescription('');
      }, 1200);
    } catch (err) {
      console.error('Error uploading images:', err);
      alert('Failed to upload construction images. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A30]">
              Project Progress & Milestone Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Adjust completion percentages, sign off on construction phases, and upload site verification photos.
          </p>
        </div>

        {/* Builder Upload Images Action */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud size={17} className="stroke-[2.2]" />
          <span>Upload Construction Images</span>
        </button>
      </div>

      {/* Projects Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0B1A30]">{project.name}</h3>
                <span className="text-xs text-gray-500">Customer: {project.customer} • {project.location}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                project.progress === 100 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {project.progress}% Complete
              </span>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                <span>Update Progress:</span>
                <span className="text-blue-600 font-mono font-bold">{project.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => handleSliderChange(project.id, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Milestones checklist */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <span className="text-[11px] uppercase font-bold text-gray-400 block mb-1">
                Construction Phase Sign-Offs:
              </span>
              {project.milestones?.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => handleMilestoneClick(project.id, idx)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    m.completed ? 'bg-emerald-50/70 text-emerald-900' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {m.completed ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-gray-400 shrink-0" />
                    )}
                    <span className={m.completed ? 'line-through text-emerald-800/80' : ''}>{m.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BUILDER UPLOAD MODAL
      ───────────────────────────────────────────────────────────── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 sm:p-7 space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFiles([]);
                setPreviewUrls([]);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] text-[#7428E8] flex items-center justify-center shrink-0">
                <UploadCloud size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#101D3A]">
                  Upload Construction Images
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Verified photographs sync live to customer's progress dashboard
                </p>
              </div>
            </div>

            {uploadSuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#059669] mx-auto flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-base font-bold text-gray-900">{uploadSuccessMessage}</h4>
                <p className="text-xs text-gray-500">The assigned customer can now view the latest verification photos.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Select Project */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select Construction Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#101D3A] focus:outline-none focus:border-[#7428E8] cursor-pointer"
                  >
                    {myProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.customer})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Construction Stage Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select Construction Stage
                  </label>
                  <select
                    value={uploadStage}
                    onChange={(e) => setUploadStage(e.target.value)}
                    className="w-full bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#101D3A] focus:outline-none focus:border-[#7428E8] cursor-pointer"
                  >
                    {stageOptions.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Upload Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Upload / Inspection Date
                  </label>
                  <input
                    type="text"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    placeholder="e.g. Aug 18, 2026"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                  />
                </div>

                {/* File Upload Drag & Drop Area */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Upload Photos (JPG, JPEG, PNG, WEBP)
                  </label>
                  <label className="border-2 border-dashed border-[#E9D5FF] bg-[#FAF5FF]/60 hover:bg-[#FAF5FF] rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition">
                    <UploadCloud size={28} className="text-[#7428E8] mb-1.5" />
                    <span className="text-xs font-bold text-[#7428E8]">
                      Click to browse or drag and drop
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Select one or multiple high-resolution photos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Thumbnails Preview */}
                {previewUrls.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Selected Photos ({previewUrls.length})
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Description & Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Provide details about structural inspections, material curing, or completed milestone..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-[#101D3A] focus:outline-none focus:border-[#7428E8] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !previewUrls.length}
                  className="w-full py-3 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <UploadCloud size={18} />
                      <span>Submit {previewUrls.length ? `${previewUrls.length} ` : ''}Images</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
