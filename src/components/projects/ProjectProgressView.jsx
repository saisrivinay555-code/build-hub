import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  UploadCloud,
  X,
  Image as ImageIcon,
  FileText,
  Home,
  Calendar,
  MapPin,
  Search,
  Eye,
  Download,
  Plus,
  ArrowLeft,
  Edit3,
  MessageSquare,
  MoreVertical,
  Check,
  Paintbrush,
  Receipt,
  ListFilter,
  Info,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { BLUEPRINT_VECTORS } from '../../data/documentsData';
import { builderVillaBannerImg, builderAvatarImg } from '../../data/initialData';
import BuilderDocumentUploadModal from '../common/BuilderDocumentUploadModal';
import DocumentViewerModal from '../common/DocumentViewerModal';

export default function ProjectProgressView() {
  const {
    myProjects,
    setMyProjects,
    selectedBuilderProjectId,
    setSelectedBuilderProjectId,
    setCurrentTab,
    toggleProjectMilestone,
    updateProjectProgress,
    projectDocuments,
    constructionImages,
    progressUpdates,
    uploadConstructionImages,
    addProgressUpdate,
    currentUser
  } = useApp();

  // Active Project resolution
  const activeProject = useMemo(() => {
    return (
      (myProjects || []).find((p) => p.id === selectedBuilderProjectId) ||
      myProjects?.[0] || {
        id: 'bp1',
        name: 'Dream Villa',
        customer: 'Ramesh Kumar',
        location: 'Hyderabad',
        status: 'Ongoing',
        healthStatus: 'On Track',
        progress: 72,
        phase: 'Interior & Finishing',
        startDate: '01 Jan 2026',
        targetHandover: '30 Aug 2026',
        deadline: '30 Aug 2026',
        description: 'Modern villa with premium interiors and vastu compliant design.',
        image: builderVillaBannerImg
      }
    );
  }, [myProjects, selectedBuilderProjectId]);

  // Tab State: 'blueprints' | 'receipts' | 'updates' | 'photos'
  const [activeTab, setActiveTab] = useState('blueprints');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [receiptsSubFilter, setReceiptsSubFilter] = useState('All');
  const [photoStageFilter, setPhotoStageFilter] = useState('All');

  // Modals
  const [isDocUploadOpen, setIsDocUploadOpen] = useState(false);
  const [docUploadCategory, setDocUploadCategory] = useState('plans');
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isUploadPhotosOpen, setIsUploadPhotosOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  // Quick Edit State
  const [editName, setEditName] = useState(activeProject.name || 'Dream Villa');
  const [editLocation, setEditLocation] = useState(activeProject.location || 'Hyderabad');
  const [editHandover, setEditHandover] = useState(activeProject.targetHandover || activeProject.deadline || '30 Aug 2026');
  const [editSummary, setEditSummary] = useState(activeProject.description || 'Modern villa with premium interiors and vastu compliant design.');

  // Form State for Add Progress Update Modal
  const [updateStage, setUpdateStage] = useState('Interior & Finishing');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');
  const [updateProgressPct, setUpdateProgressPct] = useState(activeProject.progress || 72);
  const [_updateFiles, setUpdateFiles] = useState([]);
  const [updatePreviewUrls, setUpdatePreviewUrls] = useState([]);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  // Form State for Upload Photos Modal
  const [photoStage, setPhotoStage] = useState('Interior & Finishing');
  const [photoDesc, setPhotoDesc] = useState('');
  const [_photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);
  const [isSubmittingPhotos, setIsSubmittingPhotos] = useState(false);

  const constructionStages = [
    'Foundation',
    'Structure',
    'Brickwork',
    'Plumbing',
    'Electrical',
    'Interior & Finishing',
    'Painting',
    'Final Handover'
  ];

  // 5 milestones matching exact UI in screenshot
  const milestones = useMemo(() => {
    if (activeProject.milestones && activeProject.milestones.length === 5) {
      return activeProject.milestones;
    }
    return [
      { name: 'Foundation', stage: 'Foundation', completed: true, status: 'Completed', date: '10 Feb 2026' },
      { name: 'Structure', stage: 'Structure', completed: true, status: 'Completed', date: '25 Apr 2026' },
      { name: 'Interior & Finishing', stage: 'Interior & Finishing', completed: false, status: 'In Progress', date: 'Target: 15 Jul 2026' },
      { name: 'Painting', stage: 'Painting', completed: false, status: 'Pending', date: 'Target: 10 Aug 2026' },
      { name: 'Final Handover', stage: 'Final Handover', completed: false, status: 'Pending', date: 'Target: 30 Aug 2026' }
    ];
  }, [activeProject]);

  const handleMilestoneClick = (index) => {
    if (toggleProjectMilestone) {
      toggleProjectMilestone(activeProject.id, index);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  // Filtered Blueprints & Documents
  const projectBlueprints = useMemo(() => {
    return (projectDocuments || []).filter((doc) => {
      const isPlans = doc.category === 'plans' || doc.category === 'blueprints' || !doc.category;
      const matchesSearch =
        !searchQuery ||
        (doc.title || doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedTypeFilter === 'All' ||
        (doc.title || doc.name || '').toLowerCase().includes(selectedTypeFilter.toLowerCase());
      return isPlans && matchesSearch && matchesType;
    });
  }, [projectDocuments, searchQuery, selectedTypeFilter]);

  // Filtered Receipts & Bills
  const projectReceiptsBills = useMemo(() => {
    return (projectDocuments || []).filter((doc) => {
      const isFin = doc.category === 'receipts' || doc.category === 'bills';
      const matchesSub = receiptsSubFilter === 'All' || doc.category === receiptsSubFilter;
      const matchesSearch =
        !searchQuery ||
        (doc.title || doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.amount || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return isFin && matchesSub && matchesSearch;
    });
  }, [projectDocuments, receiptsSubFilter, searchQuery]);

  // Filtered Progress Updates
  const activeUpdates = useMemo(() => {
    return (progressUpdates || []).filter((up) => {
      const matchesSearch =
        !searchQuery ||
        (up.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (up.stage || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (up.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [progressUpdates, searchQuery]);

  // Filtered Construction Photos
  const activePhotos = useMemo(() => {
    return (constructionImages || []).filter((img) => {
      const matchesStage = photoStageFilter === 'All' || img.stage === photoStageFilter;
      const matchesSearch =
        !searchQuery ||
        (img.stage || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (img.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [constructionImages, photoStageFilter, searchQuery]);

  // Download Handler for any blueprint / doc
  const handleDownloadDoc = (doc) => {
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
BUILD HUB CERTIFIED PROJECT DOCUMENT
==================================================
Project: ${activeProject.name}
Document: ${doc.title || doc.name}
Category: ${doc.category || 'Architectural Blueprint'}
Version: ${doc.version || 'v1.0'}
Date: ${doc.date || new Date().toLocaleDateString()}
Status: ${doc.status || 'Verified'}
Customer: ${activeProject.customer || 'Ramesh Kumar'}
Builder: ${doc.builderName || currentUser?.name || 'Ravi Constructions'}
Location: ${activeProject.location || 'Hyderabad'}
==================================================
${doc.description || 'Verified authentic structural specification stored in Build Hub cloud repository.'}
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

  // Handle Progress Update Submission
  const handleCreateProgressUpdate = async (e) => {
    e.preventDefault();
    if (!updateDesc.trim()) {
      alert('Please enter a description for this progress update.');
      return;
    }

    setIsSubmittingUpdate(true);
    try {
      if (addProgressUpdate) {
        await addProgressUpdate({
          projectId: activeProject.id,
          stage: updateStage,
          title: updateTitle.trim() || `${updateStage} Progress Verification`,
          description: updateDesc,
          progressPercentage: Number(updateProgressPct),
          images: updatePreviewUrls,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        });
      }

      if (updateProjectProgress) {
        updateProjectProgress(activeProject.id, Number(updateProgressPct));
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsAddUpdateOpen(false);
      setUpdateTitle('');
      setUpdateDesc('');
      setUpdateFiles([]);
      setUpdatePreviewUrls([]);
    } catch (err) {
      console.error('Error adding progress update:', err);
      alert('Failed to save progress update. Please try again.');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  // Handle Photo Gallery Upload Submission
  const handleUploadPhotos = async (e) => {
    e.preventDefault();
    if (!photoPreviewUrls.length) {
      alert('Please select at least one photograph to upload.');
      return;
    }

    setIsSubmittingPhotos(true);
    try {
      if (uploadConstructionImages) {
        await uploadConstructionImages({
          projectId: activeProject.id,
          stage: photoStage,
          description: photoDesc,
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          images: photoPreviewUrls
        });
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsUploadPhotosOpen(false);
      setPhotoDesc('');
      setPhotoFiles([]);
      setPhotoPreviewUrls([]);
    } catch (err) {
      console.error('Error uploading photos:', err);
      alert('Failed to upload construction images.');
    } finally {
      setIsSubmittingPhotos(false);
    }
  };

  const handleUpdateFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUpdateFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUpdatePreviewUrls((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPhotoFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreviewUrls((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER WITH BACK BUTTON
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F4EBFF] text-[#7428E8] flex items-center justify-center shrink-0">
              <TrendingUp size={22} className="stroke-[2.5]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#101D3A]">
              Project Progress
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Track construction milestones and access project documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('my-projects')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#7428E8]/40 text-gray-700 hover:text-[#7428E8] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to My Projects</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. PROJECT SUMMARY RIBBON CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Project & Location */}
          <div className="flex items-center gap-3.5 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EBFF] text-[#7428E8] flex items-center justify-center shrink-0">
              <Home size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-gray-500">Project:</span>
                <span className="text-sm sm:text-base font-extrabold text-[#101D3A]">
                  {activeProject.name || 'Dream Villa'}
                </span>
                {myProjects?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                    className="p-1 rounded-md text-gray-400 hover:text-[#7428E8] hover:bg-purple-50 transition cursor-pointer"
                    title="Switch Project"
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Location: {activeProject.location || 'Hyderabad'}
              </p>
            </div>

            {/* Dropdown to switch project */}
            {isProjectDropdownOpen && (
              <div className="absolute top-14 left-0 z-30 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-64 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Select Project
                </div>
                {myProjects.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      if (setSelectedBuilderProjectId) setSelectedBuilderProjectId(proj.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-purple-50 transition ${
                      proj.id === activeProject.id ? 'bg-purple-50 text-[#7428E8]' : 'text-gray-700'
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{proj.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Current Phase & Progress Bar */}
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#7428E8]">
                Current Phase: <span className="font-extrabold">{activeProject.phase || 'Interior & Finishing'}</span>
              </span>
              <span className="text-[#7428E8] font-mono text-sm">{activeProject.progress || 72}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] rounded-full transition-all duration-500"
                style={{ width: `${activeProject.progress || 72}%` }}
              />
            </div>
          </div>

          {/* Right: Target Handover Date */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EBFF] text-[#7428E8] flex items-center justify-center shrink-0">
              <Calendar size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                Target Handover
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#101D3A]">
                {activeProject.targetHandover || activeProject.deadline || '30 Aug 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. CONSTRUCTION MILESTONE STEPPER (5 STAGES)
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-5 items-center relative">
            {/* Horizontal Connecting Track Behind Steps */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-0">
              <div
                className="h-full bg-[#7428E8] transition-all duration-500"
                style={{
                  width: `${
                    milestones[4].completed
                      ? 100
                      : milestones[3].completed
                      ? 75
                      : milestones[2].completed
                      ? 50
                      : milestones[1].completed
                      ? 50 // active stage 3 is In Progress
                      : milestones[0].completed
                      ? 25
                      : 0
                  }%`
                }}
              />
            </div>

            {milestones.map((m, idx) => {
              const isCompleted = m.completed || m.status === 'Completed';
              const isInProgress = !isCompleted && (m.status === 'In Progress' || idx === 2);

              return (
                <div
                  key={idx}
                  onClick={() => handleMilestoneClick(idx)}
                  className="flex flex-col items-center text-center cursor-pointer group z-10"
                  title="Click to toggle milestone sign-off"
                >
                  {/* Step Node Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? 'bg-[#7428E8] text-white shadow-md shadow-purple-500/25 group-hover:scale-110'
                        : isInProgress
                        ? 'bg-white border-2 border-[#7428E8] text-[#7428E8] shadow-md shadow-purple-500/20 ring-4 ring-purple-100 group-hover:scale-110'
                        : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-purple-300 group-hover:text-purple-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} className="stroke-[3]" />
                    ) : isInProgress ? (
                      <Paintbrush size={18} className="stroke-[2.2]" />
                    ) : idx === 3 ? (
                      <Paintbrush size={16} />
                    ) : (
                      <Home size={16} />
                    )}
                  </div>

                  {/* Stage Name */}
                  <span
                    className={`text-xs sm:text-sm font-bold mt-2.5 ${
                      isInProgress
                        ? 'text-[#7428E8] font-extrabold'
                        : isCompleted
                        ? 'text-[#101D3A]'
                        : 'text-gray-500'
                    }`}
                  >
                    {m.name}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-semibold mt-0.5 ${
                      isCompleted
                        ? 'text-emerald-600'
                        : isInProgress
                        ? 'text-[#7428E8] font-bold'
                        : 'text-gray-400'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN TWO-COLUMN WORKSPACE (Left 8 cols, Right 4 cols)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ═════════════════════════════════════════════════════════════
            LEFT WORKSPACE CARD (Tabs, Grid, Actions)
        ═════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-7 space-y-6">
          {/* Tabs Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => {
                setActiveTab('blueprints');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'blueprints'
                  ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <FileText size={16} className="stroke-[2.2]" />
              <span>Blueprints & Documents</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('receipts');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'receipts'
                  ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <Receipt size={16} className="stroke-[2.2]" />
              <span>Receipts & Bills</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('updates');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'updates'
                  ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <ListFilter size={16} className="stroke-[2.2]" />
              <span>Progress Updates</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('photos');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#F4EBFF] text-[#7428E8] border border-[#E9D5FF] shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <ImageIcon size={16} className="stroke-[2.2]" />
              <span>Photos</span>
            </button>
          </div>

          {/* Subheader: Title, Subtitle, Search, Filter & Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#101D3A]">
                {activeTab === 'blueprints' && 'Blueprints & Documents'}
                {activeTab === 'receipts' && 'Receipts & Bills'}
                {activeTab === 'updates' && 'Progress Updates'}
                {activeTab === 'photos' && 'Construction Photos'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {activeTab === 'blueprints' && 'View and download all project blueprints and documents.'}
                {activeTab === 'receipts' && 'Track project finances, payment receipts and contractor billing.'}
                {activeTab === 'updates' && 'Chronological timeline of construction milestones and updates.'}
                {activeTab === 'photos' && 'High-resolution site verification and progress photographs.'}
              </p>
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'blueprints'
                      ? 'Search documents...'
                      : activeTab === 'receipts'
                      ? 'Search receipts & bills...'
                      : 'Search...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#F4F7FE] border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#7428E8] w-36 sm:w-48"
                />
              </div>

              {/* Filter Dropdown for Blueprints */}
              {activeTab === 'blueprints' && (
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="bg-[#F4F7FE] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#7428E8] cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Floor Plan">Floor Plan</option>
                  <option value="Elevation">Elevation</option>
                  <option value="Structural">Structural</option>
                  <option value="Site Layout">Site Layout</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Interior">Interior</option>
                </select>
              )}

              {/* Filter for Receipts & Bills */}
              {activeTab === 'receipts' && (
                <select
                  value={receiptsSubFilter}
                  onChange={(e) => setReceiptsSubFilter(e.target.value)}
                  className="bg-[#F4F7FE] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#7428E8] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="receipts">Receipts</option>
                  <option value="bills">Bills</option>
                </select>
              )}

              {/* Filter for Photos */}
              {activeTab === 'photos' && (
                <select
                  value={photoStageFilter}
                  onChange={(e) => setPhotoStageFilter(e.target.value)}
                  className="bg-[#F4F7FE] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#7428E8] cursor-pointer"
                >
                  <option value="All">All Stages</option>
                  {constructionStages.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              )}

              {/* Primary Action Button */}
              {activeTab === 'blueprints' && (
                <button
                  type="button"
                  onClick={() => {
                    setDocUploadCategory('plans');
                    setIsDocUploadOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>Upload Document</span>
                </button>
              )}

              {activeTab === 'receipts' && (
                <button
                  type="button"
                  onClick={() => {
                    setDocUploadCategory('receipts');
                    setIsDocUploadOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>Upload Receipt / Bill</span>
                </button>
              )}

              {activeTab === 'updates' && (
                <button
                  type="button"
                  onClick={() => setIsAddUpdateOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Progress Update</span>
                </button>
              )}

              {activeTab === 'photos' && (
                <button
                  type="button"
                  onClick={() => setIsUploadPhotosOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <UploadCloud size={14} />
                  <span>Upload Photos</span>
                </button>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              TAB 1 CONTENT: BLUEPRINTS & ARCHITECTURAL DRAWINGS
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'blueprints' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {projectBlueprints.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all p-3 flex flex-col justify-between group"
                >
                  <div>
                    {/* Blueprint Thumbnail */}
                    <div
                      onClick={() => setViewingDoc(doc)}
                      className="relative h-40 w-full bg-[#0B1528] rounded-xl overflow-hidden flex items-center justify-center p-2 mb-3 border border-gray-800 cursor-pointer group-hover:border-[#7428E8]/40 transition"
                      title="Click to view full architectural blueprint"
                    >
                      {doc.vectorKey && BLUEPRINT_VECTORS[doc.vectorKey] ? (
                        <div
                          className="w-full h-full flex items-center justify-center pointer-events-none"
                          dangerouslySetInnerHTML={{ __html: BLUEPRINT_VECTORS[doc.vectorKey] }}
                        />
                      ) : doc.previewUrl ? (
                        <img
                          src={doc.previewUrl}
                          alt={doc.title || doc.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-purple-400">
                          <FileText size={36} />
                        </div>
                      )}

                      {/* Top right 3-dots */}
                      <div className="absolute top-2 right-2 text-gray-400 opacity-70 group-hover:opacity-100">
                        <MoreVertical size={16} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-sm text-[#101D3A] truncate" title={doc.title || doc.name}>
                      {doc.title || doc.name}
                    </h3>

                    {/* Meta row: Date and Version */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{doc.date || 'Aug 15, 2026'}</span>
                      </div>
                      <span className="bg-[#F4EBFF] text-[#7428E8] text-[11px] font-bold px-2 py-0.5 rounded-md">
                        {doc.version || 'v1.0'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: View and Download buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={() => setViewingDoc(doc)}
                      className="py-1.5 px-2 rounded-xl border border-[#7428E8] text-[#7428E8] hover:bg-purple-50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc)}
                      className="py-1.5 px-2 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}

              {projectBlueprints.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                  <FileText className="mx-auto mb-2 text-gray-300" size={40} />
                  <p className="text-sm font-semibold">No blueprints match your filter.</p>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 2 CONTENT: RECEIPTS & BILLS
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'receipts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {projectReceiptsBills.map((item) => {
                const isReceipt = item.category === 'receipts';
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isReceipt ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {isReceipt ? 'Payment Receipt' : 'Project Bill'}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Verified'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status || 'Verified'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-[#101D3A] mt-2.5">
                        {item.title || item.name}
                      </h3>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Ref: {item.receiptNumber || item.billNumber || item.version || 'REC-2026-081'}
                      </p>

                      <div className="mt-3 bg-[#F4F7FE] p-2.5 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Amount:</span>
                        <span className="text-sm font-extrabold text-[#101D3A] font-mono">
                          {item.amount || '₹2,50,000'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                        <Calendar size={12} />
                        <span>Date: {item.date || 'Aug 10, 2026'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => setViewingDoc(item)}
                        className="py-1.5 px-2 rounded-xl border border-[#7428E8] text-[#7428E8] hover:bg-purple-50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(item)}
                        className="py-1.5 px-2 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {projectReceiptsBills.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                  <Receipt className="mx-auto mb-2 text-gray-300" size={40} />
                  <p className="text-sm font-semibold">No receipts or bills found.</p>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 3 CONTENT: PROGRESS UPDATES TIMELINE
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              {activeUpdates.map((update) => (
                <div
                  key={update.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 hover:border-purple-200 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#F4EBFF] text-[#7428E8] text-xs font-bold px-3 py-1 rounded-full">
                        {update.stage}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#101D3A]">
                        {update.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={13} />
                      <span>
                        {update.date} {update.time ? `• ${update.time}` : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {update.description}
                  </p>

                  {/* Photo attachments */}
                  {update.images && update.images.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {update.images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setViewingPhoto({ imageUrl: img, stage: update.stage, description: update.description, date: update.date })}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition shrink-0"
                        >
                          <img src={img} alt="Update attachment" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={update.builderAvatar || builderAvatarImg}
                        alt="Builder"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-gray-500 font-medium">
                        Verified by <span className="font-bold text-gray-800">{update.builderName || 'Ravi Constructions'}</span>
                      </span>
                    </div>
                    <span className="text-[#7428E8] font-bold font-mono">
                      Project Progress: {update.progressPercentage || activeProject.progress || 72}%
                    </span>
                  </div>
                </div>
              ))}

              {activeUpdates.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <ListFilter className="mx-auto mb-2 text-gray-300" size={40} />
                  <p className="text-sm font-semibold">No progress updates found.</p>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 4 CONTENT: CONSTRUCTION PHOTOS GALLERY
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setViewingPhoto(photo)}
                    className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-xs group cursor-pointer h-48 bg-gray-100"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.description || photo.stage}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Top stage badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                        {photo.stage}
                      </span>
                    </div>

                    {/* Bottom date and zoom */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-200">
                        <Calendar size={12} />
                        <span>{photo.uploadDate}</span>
                      </div>
                      <div className="p-1 rounded-lg bg-black/40 text-white">
                        <Maximize2 size={13} />
                      </div>
                    </div>
                  </div>
                ))}

                {activePhotos.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    <ImageIcon className="mx-auto mb-2 text-gray-300" size={40} />
                    <p className="text-sm font-semibold">No photos match the selected stage.</p>
                  </div>
                )}
              </div>

              {/* Informational notice banner */}
              <div className="p-3.5 rounded-2xl bg-[#F4EBFF] border border-[#E9D5FF] text-xs text-[#7428E8] flex items-center gap-2.5">
                <Info size={16} className="shrink-0" />
                <span>
                  Images are updated by your builder regularly to keep you informed about the construction progress.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════
            RIGHT WORKSPACE CARD ("Project Details" Widget)
        ═════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-black text-lg text-[#101D3A]">Project Details</h3>
            <button
              type="button"
              onClick={() => setIsEditProjectOpen(true)}
              className="p-2 rounded-xl bg-purple-50 text-[#7428E8] hover:bg-purple-100 transition cursor-pointer"
              title="Edit Project Summary"
            >
              <Edit3 size={16} />
            </button>
          </div>

          {/* Photograph Banner */}
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
            <img
              src={activeProject.image || builderVillaBannerImg}
              alt={activeProject.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Status */}
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-extrabold text-[#101D3A]">
              {activeProject.name || 'Dream Villa'}
            </h4>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {activeProject.healthStatus || 'On Track'}
            </span>
          </div>

          {/* Meta rows: Location & Started */}
          <div className="space-y-1.5 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#7428E8] shrink-0" />
              <span>{activeProject.location || 'Hyderabad'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#7428E8] shrink-0" />
              <span>Started: {activeProject.startDate || '01 Jan 2026'}</span>
            </div>
          </div>

          {/* Progress Bar with percentage */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] rounded-full transition-all duration-500"
                style={{ width: `${activeProject.progress || 72}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-[#7428E8] font-mono shrink-0">
              {activeProject.progress || 72}%
            </span>
          </div>

          {/* Project Summary */}
          <div className="pt-2">
            <h5 className="text-xs font-extrabold text-[#101D3A] uppercase tracking-wider mb-1">
              Project Summary
            </h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              {activeProject.description || 'Modern villa with premium interiors and vastu compliant design.'}
            </p>
          </div>

          {/* Need Help? Contact Box */}
          <div className="bg-[#F6F0FE] border border-[#E9D5FF] rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#7428E8] flex items-center justify-center shrink-0 shadow-xs">
                <FileText size={18} />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-[#101D3A]">Need Help?</h5>
                <p className="text-[11px] text-gray-600 leading-tight mt-0.5">
                  Contact customer or team for any document-related queries.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('messages')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <MessageSquare size={14} />
              <span>Contact Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODALS & LIGHTBOXES
      ───────────────────────────────────────────────────────────── */}

      {/* 1. Document Viewer Modal */}
      <DocumentViewerModal
        key={viewingDoc ? viewingDoc.id || 'viewing' : 'closed'}
        isOpen={Boolean(viewingDoc)}
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
      />

      {/* 2. Builder Document Upload Modal */}
      <BuilderDocumentUploadModal
        key={`${docUploadCategory}_${activeProject.id}_${isDocUploadOpen ? 'open' : 'closed'}`}
        isOpen={isDocUploadOpen}
        initialCategory={docUploadCategory}
        initialProjectId={activeProject.id}
        onClose={() => setIsDocUploadOpen(false)}
      />

      {/* 3. Add Progress Update Modal */}
      {isAddUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#7428E8]">
                  <TrendingUp size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101D3A]">Add Progress Update</h3>
                  <p className="text-xs text-gray-500">Publish verified milestone update to client</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUpdateOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProgressUpdate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Construction Stage</label>
                <select
                  value={updateStage}
                  onChange={(e) => setUpdateStage(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                >
                  {constructionStages.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Update Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Rough Plastering & False Ceiling Framework Completed"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Overall Completion Percentage (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={updateProgressPct}
                    onChange={(e) => setUpdateProgressPct(e.target.value)}
                    className="flex-1 accent-[#7428E8] cursor-pointer"
                  />
                  <span className="font-mono font-bold text-sm text-[#7428E8] w-12 text-right">
                    {updateProgressPct}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe works executed, quality testing results, and upcoming target schedule..."
                  value={updateDesc}
                  onChange={(e) => setUpdateDesc(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Attach Verification Photographs</label>
                <label className="border-2 border-dashed border-[#E9D5FF] bg-[#FAF5FF]/60 hover:bg-[#FAF5FF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition">
                  <UploadCloud size={24} className="text-[#7428E8] mb-1" />
                  <span className="text-xs font-bold text-[#7428E8]">Select images to attach</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpdateFilesChange}
                    className="hidden"
                  />
                </label>
                {updatePreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {updatePreviewUrls.map((url, i) => (
                      <img key={i} src={url} alt="preview" className="w-12 h-12 rounded-lg object-cover border" />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUpdateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpdate}
                  className="px-5 py-2 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold shadow-xs transition"
                >
                  {isSubmittingUpdate ? 'Publishing...' : 'Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Upload Site Photos Modal */}
      {isUploadPhotosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#7428E8]">
                  <UploadCloud size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101D3A]">Upload Site Photographs</h3>
                  <p className="text-xs text-gray-500">Live syncs to customer construction gallery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadPhotosOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadPhotos} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Construction Stage</label>
                <select
                  value={photoStage}
                  onChange={(e) => setPhotoStage(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                >
                  {constructionStages.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Photos</label>
                <label className="border-2 border-dashed border-[#E9D5FF] bg-[#FAF5FF]/60 hover:bg-[#FAF5FF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition">
                  <UploadCloud size={26} className="text-[#7428E8] mb-1" />
                  <span className="text-xs font-bold text-[#7428E8]">Click or drag photos here</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WEBP (Multiple allowed)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoFilesChange}
                    className="hidden"
                  />
                </label>
                {photoPreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {photoPreviewUrls.map((url, i) => (
                      <img key={i} src={url} alt="preview" className="w-14 h-14 rounded-lg object-cover border" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ground beam reinforcement inspection before concrete pour"
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#101D3A] font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadPhotosOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPhotos}
                  className="px-5 py-2 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-white text-xs font-bold shadow-xs transition"
                >
                  {isSubmittingPhotos ? 'Uploading...' : 'Submit Images'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Photo Lightbox Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            <button
              type="button"
              onClick={() => setViewingPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer z-10"
            >
              <X size={18} />
            </button>
            <div className="max-h-[65vh] bg-black flex items-center justify-center">
              <img
                src={viewingPhoto.imageUrl}
                alt="Enlarged preview"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="p-5 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-[#F4EBFF] text-[#7428E8] text-xs font-bold px-3 py-1 rounded-full">
                  {viewingPhoto.stage}
                </span>
                <span className="text-xs text-gray-400 font-medium">{viewingPhoto.uploadDate || viewingPhoto.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                {viewingPhoto.description || `Site verification image for ${viewingPhoto.stage} stage.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Quick Edit Project Summary Modal */}
      {isEditProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#101D3A]">Edit Project Overview</h3>
              <button
                type="button"
                onClick={() => setIsEditProjectOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Handover Date</label>
                <input
                  type="text"
                  value={editHandover}
                  onChange={(e) => setEditHandover(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Project Summary</label>
                <textarea
                  rows={3}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7428E8]"
                />
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditProjectOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (setMyProjects) {
                    setMyProjects((prev) =>
                      prev.map((p) =>
                        p.id === activeProject.id
                          ? {
                              ...p,
                              name: editName,
                              location: editLocation,
                              targetHandover: editHandover,
                              deadline: editHandover,
                              description: editSummary
                            }
                          : p
                      )
                    );
                  }
                  setIsEditProjectOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#7428E8] hover:bg-[#6415C5] text-xs font-bold text-white shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
