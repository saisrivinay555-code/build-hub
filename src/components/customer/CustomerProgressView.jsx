import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Check,
  CheckCircle2,
  Clock,
  HardHat,
  Paintbrush,
  Home,
  UploadCloud,
  Image as ImageIcon,
  FileText,
  Search,
  Calendar,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Sparkles,
  Building2,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function CustomerProgressView() {
  const {
    customerProject,
    currentUser,
    constructionImages = [],
    progressUpdates = [],
    uploadConstructionImages,
    deleteConstructionImage
  } = useApp();

  const userRole = (currentUser?.role || '').toLowerCase();
  const isBuilder = userRole === 'builder';
  const isAdmin = userRole === 'admin' || userRole === 'administrator';
  const canUpload = isBuilder || isAdmin;

  // Active Tab: 'images' | 'updates'
  const [activeTab, setActiveTab] = useState('images');

  // Filter & Sort State
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Image Preview Modal State
  const [previewImage, setPreviewImage] = useState(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadStage, setUploadStage] = useState('Interior & Finishing');
  const [uploadDate, setUploadDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  );
  const [uploadDescription, setUploadDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // 5 Stepper Milestone Stages matching reference image exactly
  const milestoneStages = [
    {
      id: 'foundation',
      name: 'Foundation',
      status: 'Completed',
      statusColor: 'text-[#10B981]',
      icon: Check,
      circleBg: 'bg-[#7428E8] text-white',
      lineAfter: 'bg-[#7428E8]'
    },
    {
      id: 'structure',
      name: 'Structure',
      status: 'Completed',
      statusColor: 'text-[#10B981]',
      icon: Check,
      circleBg: 'bg-[#7428E8] text-white',
      lineAfter: 'bg-[#7428E8]'
    },
    {
      id: 'interior',
      name: 'Interior & Finishing',
      status: 'In Progress',
      statusColor: 'text-[#7428E8]',
      icon: HardHat,
      circleBg: 'border-2 border-[#7428E8] bg-[#F3E8FF] text-[#7428E8] ring-4 ring-purple-100',
      lineAfter: 'bg-gray-200',
      isActive: true
    },
    {
      id: 'painting',
      name: 'Painting',
      status: 'Pending',
      statusColor: 'text-gray-400',
      icon: Paintbrush,
      circleBg: 'bg-gray-100 border border-gray-200 text-gray-400',
      lineAfter: 'bg-gray-200'
    },
    {
      id: 'handover',
      name: 'Final Handover',
      status: 'Pending',
      statusColor: 'text-gray-400',
      icon: Home,
      circleBg: 'bg-gray-100 border border-gray-200 text-gray-400',
      lineAfter: null
    }
  ];

  // Available stages for upload & filter
  const stageOptions = [
    'All',
    'Foundation',
    'Structure',
    'Brickwork',
    'Plumbing',
    'Electrical',
    'Interior & Finishing',
    'Painting',
    'Final Handover'
  ];

  // Filtered & Sorted Images
  const filteredImages = useMemo(() => {
    let list = [...constructionImages];

    if (selectedStageFilter !== 'All') {
      list = list.filter(
        img => (img.stage || '').toLowerCase() === selectedStageFilter.toLowerCase()
      );
    }

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.uploadDate || 0).getTime();
      const timeB = new Date(b.createdAt || b.uploadDate || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [constructionImages, selectedStageFilter, sortOrder]);

  // Handle local file selection for uploading
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Validate image types
    const validFiles = files.filter(f =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type)
    );

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Generate local data URL previews
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
        projectId: customerProject?.id || 'cp_ramesh_1',
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

      setUploadSuccessMessage('Construction photographs uploaded successfully!');
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

  // Preview Modal Navigation
  const previewIndex = useMemo(() => {
    if (!previewImage) return -1;
    return filteredImages.findIndex(img => img.id === previewImage.id);
  }, [previewImage, filteredImages]);

  const handlePrevPreview = () => {
    if (previewIndex > 0) {
      setPreviewImage(filteredImages[previewIndex - 1]);
    }
  };

  const handleNextPreview = () => {
    if (previewIndex < filteredImages.length - 1) {
      setPreviewImage(filteredImages[previewIndex + 1]);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP HEADER (Matching Reference UI Card)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#7428E8] flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101D3A] tracking-tight leading-tight">
              Project Progress & Construction Milestones
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Real-time stage-by-stage structural verification for{' '}
              <span className="font-semibold text-gray-700">
                {customerProject?.name || 'No Active Project'}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Overall Completion Percentage Badge */}
        <div className="bg-[#E8F8F0] border border-[#C2F0DA] px-5 py-2.5 rounded-2xl text-center sm:text-right shadow-2xs self-start sm:self-auto min-w-[150px]">
          <span className="text-2xl font-black text-[#059669] block leading-none font-mono">
            {customerProject?.progress || 0}%
          </span>
          <span className="text-[11px] font-bold text-gray-500 mt-1 block">
            Overall Construction Done
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MILESTONE SUMMARY & STEPPER (The Middle Card)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-gray-100 shadow-xs space-y-6">
        {/* Phase Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-bold text-[#101D3A]">
          <span>Project Kickoff ({customerProject?.startDate || '01 Jan 2026'})</span>
          <span className="text-[#7428E8] font-extrabold">
            Current Phase: Interior & Finishing
          </span>
          <span>Target Handover ({customerProject?.expectedCompletion || '30 Aug 2026'})</span>
        </div>

        {/* Purple Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] rounded-full transition-all duration-700"
              style={{ width: `${customerProject?.progress > 0 ? customerProject.progress : 25}%` }}
            />
          </div>
          <span className="text-sm font-black text-[#7428E8] shrink-0 font-mono">
            {customerProject?.progress > 0 ? `${customerProject.progress}%` : '25%'}
          </span>
        </div>

        {/* Horizontal Milestone Stepper matching reference image */}
        <div className="pt-3 pb-2 overflow-x-auto">
          <div className="min-w-[620px] flex items-center justify-between relative px-4">
            {milestoneStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <React.Fragment key={stage.id}>
                  {/* Stage Node */}
                  <div className="flex flex-col items-center text-center relative z-10 w-28 shrink-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-transform shadow-xs mb-2 ${
                        stage.circleBg
                      } ${stage.isActive ? 'scale-110 -mt-1' : ''}`}
                    >
                      <Icon size={stage.isActive ? 20 : 17} className="stroke-[2.6]" />
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-bold leading-tight ${
                        stage.isActive ? 'text-[#101D3A]' : 'text-gray-700'
                      }`}
                    >
                      {stage.name}
                    </span>
                    <span className={`text-[11px] font-bold mt-0.5 ${stage.statusColor}`}>
                      {stage.status}
                    </span>
                  </div>

                  {/* Connecting Line to next stage */}
                  {idx < milestoneStages.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 -mt-8 ${stage.lineAfter || 'bg-gray-200'}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CONSTRUCTION IMAGES GALLERY & PROGRESS UPDATES (The Bottom Card)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-gray-100 shadow-xs space-y-5">
        {/* Top Action Bar: Tabs & Upload Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100/80">
          {/* Two Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'images'
                  ? 'bg-[#F3E8FF] text-[#7428E8]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <ImageIcon size={17} />
              <span>Construction Images</span>
            </button>

            <button
              onClick={() => setActiveTab('updates')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'updates'
                  ? 'bg-[#F3E8FF] text-[#7428E8]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <FileText size={17} />
              <span>Progress Updates</span>
            </button>
          </div>

          {/* Upload Images Button (Only visible for Builder & Admin logins, completely hidden for Customers) */}
          {canUpload && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-[#7428E8] text-[#7428E8] hover:bg-purple-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud size={17} className="stroke-[2.2]" />
              <span>Upload Images</span>
            </button>
          )}
        </div>

        {/* ──────── TAB 1: CONSTRUCTION IMAGES GALLERY ──────── */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            {/* Filter & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Stage Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1 shrink-0">
                  <Filter size={13} />
                  <span>Stage:</span>
                </span>
                {stageOptions.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setSelectedStageFilter(stage)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                      selectedStageFilter === stage
                        ? 'bg-[#7428E8] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* Sort By Toggle */}
              <button
                onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-700 bg-gray-50 border border-gray-200/70 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <ArrowUpDown size={12} />
                <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>

            {/* Gallery Grid */}
            {filteredImages.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-[#7428E8] mx-auto flex items-center justify-center mb-3">
                  <ImageIcon size={22} />
                </div>
                <h4 className="text-sm font-bold text-gray-800">
                  No Construction Images Available Yet
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  {selectedStageFilter !== 'All'
                    ? `No photographs uploaded under "${selectedStageFilter}". Try selecting "All Stages".`
                    : 'Your contractor will upload site photographs as each construction milestone is reached.'}
                </p>
                {canUpload && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition cursor-pointer"
                  >
                    Upload First Photo
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setPreviewImage(img)}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-100 shadow-xs cursor-pointer transform hover:-translate-y-0.5 transition duration-200"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.stage}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-90 group-hover:opacity-100 transition-opacity" />

                    {/* Top Stage Tag */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#7428E8]/90 text-white text-[10px] font-bold backdrop-blur-xs">
                        {img.stage}
                      </span>
                    </div>

                    {/* Date Pill at bottom-left */}
                    <div className="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <Calendar size={12} className="stroke-[2.2]" />
                      <span>{img.uploadDate}</span>
                    </div>

                    {/* Zoom / Preview Button at bottom-right */}
                    <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/65 group-hover:bg-[#7428E8] backdrop-blur-xs text-white flex items-center justify-center transition-colors shadow-sm">
                      <Search size={13} className="stroke-[2.5]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Information Notice Banner matching reference image */}
            <div className="bg-[#F8F5FF] border border-[#E9D5FF] rounded-2xl p-3.5 flex items-center gap-3 mt-4">
              <div className="w-5 h-5 rounded-full bg-[#7428E8] text-white flex items-center justify-center shrink-0">
                <Info size={13} className="stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Images are updated by your builder regularly to keep you informed about the construction progress.
              </p>
            </div>
          </div>
        )}

        {/* ──────── TAB 2: PROGRESS UPDATES TIMELINE ──────── */}
        {activeTab === 'updates' && (
          <div className="space-y-4 pt-1">
            {progressUpdates.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <FileText size={28} className="mx-auto text-gray-400 mb-2" />
                <h4 className="text-sm font-bold text-gray-800">No Progress Updates Logged</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Updates with progress percentages and photos will be logged as the builder verifies milestones.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressUpdates.map((update, idx) => (
                  <div
                    key={update.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-[#FAF9FF] hover:border-purple-200 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7428E8] text-xs font-bold">
                          {update.stage}
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#101D3A]">
                          {update.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <Calendar size={13} />
                        <span>{update.date}</span>
                        {update.time && <span>• {update.time}</span>}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {update.description}
                    </p>

                    {/* Attached Update Photos */}
                    {update.images && update.images.length > 0 && (
                      <div className="flex items-center gap-3 overflow-x-auto pt-1">
                        {update.images.map((imgUrl, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              setPreviewImage({
                                id: update.id + '_' + i,
                                stage: update.stage,
                                uploadDate: update.date,
                                imageUrl: imgUrl,
                                description: update.description,
                                builderName: update.builderName
                              })
                            }
                            className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-2xs cursor-pointer group"
                          >
                            <img
                              src={imgUrl}
                              alt="Update attachment"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Builder Signature Footer */}
                    <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <img
                          src={update.builderAvatar || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80'}
                          alt={update.builderName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-gray-700">Verified by {update.builderName}</span>
                      </div>
                      {update.progressPercentage && (
                        <span className="font-bold text-[#7428E8]">
                          Project Progress: {update.progressPercentage}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. FULL-SCREEN ENLARGED IMAGE PREVIEW MODAL
      ───────────────────────────────────────────────────────────── */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-[#F3E8FF] text-[#7428E8] text-xs font-bold">
                  {previewImage.stage}
                </span>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{previewImage.uploadDate}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isBuilder && (
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this construction photograph?')) {
                        deleteConstructionImage(previewImage.id);
                        setPreviewImage(null);
                      }
                    }}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Image Area with Navigation Arrows */}
            <div className="relative bg-black flex items-center justify-center flex-1 min-h-[300px] max-h-[58vh] overflow-hidden">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.stage}
                className="max-w-full max-h-[58vh] object-contain"
              />

              {/* Prev Button */}
              {previewIndex > 0 && (
                <button
                  onClick={handlePrevPreview}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Next Button */}
              {previewIndex < filteredImages.length - 1 && (
                <button
                  onClick={handleNextPreview}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Modal Details Footer */}
            <div className="p-5 bg-white space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Uploaded by: <strong className="text-gray-700">{previewImage.builderName || 'Ravi Constructions'}</strong></span>
                <span>Photo {previewIndex + 1} of {filteredImages.length}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 pt-1 leading-relaxed">
                {previewImage.description || 'Verified site progress inspection photograph.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. BUILDER UPLOAD IMAGES MODAL
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
                  Add site verification photographs for {customerProject?.name || 'Current Project'}
                </p>
              </div>
            </div>

            {uploadSuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#059669] mx-auto flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-base font-bold text-gray-900">{uploadSuccessMessage}</h4>
                <p className="text-xs text-gray-500">Your customer can now view the latest photos.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
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
                    {stageOptions.filter(s => s !== 'All').map(st => (
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
