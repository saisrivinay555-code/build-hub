import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Trophy,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ChevronDown,
  Home,
  Building2,
  Wrench,
  Palette,
  Phone,
  Mail,
  User,
  Clock,
  ArrowRight,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Filter,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Award,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export default function CustomerFindBuildersView() {
  const {
    currentUser,
    findBuildersList,
    placeBooking,
    setCurrentTab
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
  const [sortBy, setSortBy] = useState('Rating'); // 'Rating' | 'Price: Low to High' | 'Price: High to Low' | 'Experience' | 'Most Reviewed'

  // Selected Builder State (default to Ravi Constructions)
  const [selectedBuilderId, setSelectedBuilderId] = useState('b-ravi');
  const [activeTab, setActiveTab] = useState('About'); // 'About' | 'Projects' | 'Reviews' | 'Portfolio'

  // Booking Form State
  const [projectType, setProjectType] = useState('Residential');
  const [estimatedArea, setEstimatedArea] = useState(1000);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Modal Form Inputs
  const [bookingDetails, setBookingDetails] = useState({
    customerName: currentUser?.name || 'Sai Attada',
    customerEmail: currentUser?.email || 'sai.attada@buildhub.io',
    customerPhone: currentUser?.phone || '+91 98765 43210',
    location: 'Hyderabad',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    contactMethod: 'Phone Call',
    requirements: ''
  });

  const locationsList = [
    'Hyderabad',
    'Bangalore',
    'Mumbai',
    'Delhi NCR',
    'Chennai',
    'Pune',
    'Visakhapatnam',
    'Vijayawada',
    'All Locations'
  ];

  // Filter and Sort Builders
  const filteredBuilders = useMemo(() => {
    let list = [...(findBuildersList || [])];

    // 1. Location filter
    if (selectedLocation && selectedLocation !== 'All Locations') {
      list = list.filter(
        b => (b.location || b.city || '').toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => 
        (b.name || '').toLowerCase().includes(q) ||
        (b.company || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        (b.about || '').toLowerCase().includes(q) ||
        (b.categories || []).some(c => c.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'Price: Low to High') return (a.pricePerSqFt || 0) - (b.pricePerSqFt || 0);
      if (sortBy === 'Price: High to Low') return (b.pricePerSqFt || 0) - (a.pricePerSqFt || 0);
      if (sortBy === 'Experience') return (b.experienceNum || 0) - (a.experienceNum || 0);
      if (sortBy === 'Most Reviewed') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return 0;
    });

    return list;
  }, [findBuildersList, selectedLocation, searchQuery, sortBy]);

  // Selected builder object
  const selectedBuilder = useMemo(() => {
    const found = findBuildersList?.find(b => b.id === selectedBuilderId);
    return found || filteredBuilders[0] || findBuildersList?.[0] || null;
  }, [selectedBuilderId, findBuildersList, filteredBuilders]);

  // Calculate estimated cost
  const ratePerSqFt = selectedBuilder?.pricePerSqFt || 1800;
  const numArea = Number(estimatedArea) > 0 ? Number(estimatedArea) : 0;
  const estimatedCostNum = ratePerSqFt * numArea;
  const formattedEstimatedCost = `₹ ${estimatedCostNum.toLocaleString('en-IN')}`;

  // Handle Booking Submit
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const result = await placeBooking({
        builderId: selectedBuilder.id,
        builderName: selectedBuilder.name,
        builderEmail: selectedBuilder.email,
        builderPhone: selectedBuilder.phone,
        builderAvatar: selectedBuilder.avatar,
        projectType,
        location: bookingDetails.location || selectedBuilder.city,
        area: numArea,
        pricePerSqFt: ratePerSqFt,
        estimatedCost: formattedEstimatedCost,
        estimatedCostNum,
        customerName: bookingDetails.customerName,
        customerEmail: bookingDetails.customerEmail,
        customerPhone: bookingDetails.customerPhone,
        preferredDate: bookingDetails.preferredDate,
        contactMethod: bookingDetails.contactMethod,
        requirements: bookingDetails.requirements
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });

      setBookingConfirmed(result);
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert('Failed to place booking. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP HEADER (Matches Reference Image Card)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle purple decorative background wave on top right */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-bl from-purple-100/40 via-purple-50/20 to-transparent pointer-events-none rounded-bl-full" />

        {/* Left Side: Icon & Title */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] text-[#7428E8] flex items-center justify-center shrink-0 shadow-xs">
            <Search size={26} className="stroke-[2.3]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#101D3A] tracking-tight leading-none">
              Find <span className="text-[#7428E8]">Builders</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Discover verified builders and compare services
            </p>
          </div>
        </div>

        {/* Right Side: Notification Bell & Customer Profile */}
        <div className="flex items-center gap-3 sm:gap-4 relative z-10 self-end md:self-auto">
          {/* Notification Bell */}
          <div className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EA4335] text-white text-[9px] font-bold flex items-center justify-center">
              2
            </span>
          </div>

          {/* Customer Avatar & Name */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
            <div className="w-9 h-9 rounded-full bg-[#7428E8] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              SA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[#101D3A] leading-tight">
                {currentUser?.name || 'Sai Attada'}
              </p>
            </div>
            <ChevronDown size={15} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HORIZONTAL SEARCH & LOCATION BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center">
          <Search size={18} className="absolute left-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for builders (e.g. Modern Homes, Hyderabad)..."
            className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-[#101D3A] placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full sm:w-auto flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-3">
          <MapPin size={17} className="text-gray-400 shrink-0" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#101D3A] focus:outline-none cursor-pointer pr-4 py-1"
          >
            {locationsList.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold text-sm rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search size={16} className="stroke-[2.5]" />
          <span>Search</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT: 2-COLUMN SPLIT LAYOUT
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ────── LEFT COLUMN: Available Builders List (5 cols) ────── */}
        <div className="lg:col-span-5 space-y-4">
          {/* Header & Sort */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#101D3A]">
                Available Builders
              </h2>
              <span className="w-6 h-6 rounded-full bg-[#F3E8FF] text-[#7428E8] text-xs font-bold flex items-center justify-center">
                {filteredBuilders.length}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-bold text-[#101D3A] bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="Rating">Rating</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Experience">Experience</option>
                <option value="Most Reviewed">Most Reviewed</option>
              </select>
            </div>
          </div>

          {/* Builders Cards */}
          <div className="space-y-3">
            {filteredBuilders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7428E8] mx-auto flex items-center justify-center mb-3">
                  <Search size={22} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">No builders found</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Try adjusting your search query or location filter.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedLocation('All Locations'); }}
                  className="mt-3 text-xs font-bold text-[#7428E8] hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredBuilders.map((builder) => {
                const isSelected = selectedBuilder?.id === builder.id;

                return (
                  <div
                    key={builder.id}
                    onClick={() => setSelectedBuilderId(builder.id)}
                    className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#FAF5FF] border-2 border-[#7428E8] shadow-md shadow-purple-500/10'
                        : 'bg-white border border-gray-100 hover:border-purple-200 hover:shadow-xs'
                    }`}
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Avatar with verified badge */}
                      <div className="relative shrink-0">
                        <img
                          src={builder.avatar}
                          alt={builder.name}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-100"
                        />
                        {builder.verified && (
                          <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#7428E8] text-white flex items-center justify-center ring-2 ring-white">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#101D3A] truncate">
                          {builder.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-xs mt-0.5">
                          <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="font-bold text-[#101D3A]">{builder.rating}</span>
                          <span className="text-gray-400">({builder.reviewsCount} reviews)</span>
                        </div>

                        {/* Tagline */}
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {builder.description}
                        </p>

                        {/* Categories Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {(builder.categories || []).map((cat) => (
                            <span
                              key={cat}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F0FF] text-[#7428E8]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-extrabold text-[#7428E8] whitespace-nowrap">
                          {builder.priceFormatted}
                        </p>
                      </div>
                      <ChevronRight size={16} className={`transition ${isSelected ? 'text-[#7428E8] translate-x-0.5' : 'text-gray-400'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ────── RIGHT COLUMN: Selected Builder Profile & Booking (7 cols) ────── */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {selectedBuilder && (
            <>
              {/* Builder Profile Top Header Info matching reference */}
              <div className="p-5 sm:p-6 pb-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  {/* Left: Avatar in rounded box with purple verified badge */}
                  <div className="relative shrink-0">
                    <img
                      src={selectedBuilder.avatar}
                      alt={selectedBuilder.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-gray-100 shadow-xs"
                    />
                    {selectedBuilder.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7428E8] text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                        <Check size={13} className="stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Right: Villa Banner on top, Builder details below */}
                  <div className="flex-1 w-full min-w-0">
                    {/* Villa Banner */}
                    <div className="h-24 sm:h-28 w-full rounded-2xl overflow-hidden relative bg-gray-900 shadow-xs">
                      <img
                        src={selectedBuilder.coverImage}
                        alt={selectedBuilder.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                      {/* Verified Builder Pill on top right of banner */}
                      {selectedBuilder.verified && (
                        <div className="absolute top-2.5 right-2.5 bg-[#7428E8] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={13} className="stroke-[2.5]" />
                          <span>Verified Builder</span>
                        </div>
                      )}
                    </div>

                    {/* Builder info and Price row below banner */}
                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-extrabold text-[#101D3A] tracking-tight truncate">
                            {selectedBuilder.name}
                          </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5">
                          <div className="flex items-center gap-1 text-[#101D3A] font-bold">
                            <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                            <span>{selectedBuilder.rating}</span>
                            <span className="text-gray-400 font-normal">({selectedBuilder.reviewsCount} reviews)</span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-600 font-semibold">{selectedBuilder.experienceYears} Experience</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                          {selectedBuilder.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-2xl sm:text-[26px] font-black text-[#101D3A] leading-none">
                          ₹ {selectedBuilder.pricePerSqFt?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                          / sq.ft
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Tabs Navigation */}
              <div className="px-6 border-b border-gray-100 flex items-center gap-6 overflow-x-auto">
                {[
                  { id: 'About', label: 'About', icon: User },
                  { id: 'Projects', label: 'Projects', icon: Building2 },
                  { id: 'Reviews', label: 'Reviews', icon: Star },
                  { id: 'Portfolio', label: 'Portfolio', icon: ImageIcon }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-[#7428E8] text-[#7428E8]'
                          : 'border-transparent text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content + Booking Panel Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* ────── Left Sub-Column: Tab Details (7 cols) ────── */}
                <div className="md:col-span-7 space-y-5">
                  {/* TAB 1: ABOUT */}
                  {activeTab === 'About' && (
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-[#101D3A] mb-2">
                          About the Builder
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {selectedBuilder.about}
                        </p>
                      </div>

                      {/* 3 Trust Indicator Cards */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="bg-[#FAF5FF] border border-[#E9D5FF] p-3 rounded-2xl text-center">
                          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#7428E8] mx-auto flex items-center justify-center mb-1.5">
                            <Shield size={16} className="stroke-[2.2]" />
                          </div>
                          <p className="text-[11px] font-bold text-[#101D3A]">Trusted & Verified</p>
                        </div>

                        <div className="bg-[#FAF5FF] border border-[#E9D5FF] p-3 rounded-2xl text-center">
                          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#7428E8] mx-auto flex items-center justify-center mb-1.5">
                            <Trophy size={16} className="stroke-[2.2]" />
                          </div>
                          <p className="text-[11px] font-bold text-[#101D3A]">{selectedBuilder.completedProjects}</p>
                        </div>

                        <div className="bg-[#FAF5FF] border border-[#E9D5FF] p-3 rounded-2xl text-center">
                          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#7428E8] mx-auto flex items-center justify-center mb-1.5">
                            <Star size={16} className="stroke-[2.2] fill-[#7428E8]" />
                          </div>
                          <p className="text-[11px] font-bold text-[#101D3A]">{selectedBuilder.rating}/5 Rating</p>
                        </div>
                      </div>

                      {/* Client Reviews Preview */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-[#101D3A]">
                            Client Reviews
                          </h4>
                          <button
                            onClick={() => setActiveTab('Reviews')}
                            className="text-xs font-bold text-[#7428E8] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>View All</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>

                        {selectedBuilder.reviews && selectedBuilder.reviews[0] ? (
                          <div className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-2xl">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#7428E8] text-white font-bold text-xs flex items-center justify-center">
                                  {selectedBuilder.reviews[0].avatarText}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#101D3A]">{selectedBuilder.reviews[0].name}</p>
                                  <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[11px] text-gray-400">{selectedBuilder.reviews[0].date}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 italic">
                              "{selectedBuilder.reviews[0].comment}"
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PROJECTS */}
                  {activeTab === 'Projects' && (
                    <div className="space-y-3.5">
                      <h4 className="text-sm font-bold text-[#101D3A]">
                        Completed Projects ({selectedBuilder.projects?.length || 0})
                      </h4>
                      {(!selectedBuilder.projects || selectedBuilder.projects.length === 0) ? (
                        <p className="text-xs text-gray-500">No project records uploaded yet.</p>
                      ) : (
                        selectedBuilder.projects.map(proj => (
                          <div key={proj.id} className="border border-gray-100 rounded-2xl p-3 flex gap-3.5 hover:shadow-xs transition">
                            <img
                              src={proj.image}
                              alt={proj.name}
                              className="w-20 h-20 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs sm:text-sm font-bold text-[#101D3A] truncate">{proj.name}</h5>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-[#7428E8]">
                                  {proj.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={11} />
                                <span>{proj.location}</span>
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{proj.description}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 3: REVIEWS */}
                  {activeTab === 'Reviews' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-[#101D3A]">
                        Verified Customer Reviews ({selectedBuilder.reviews?.length || 0})
                      </h4>
                      {selectedBuilder.reviews?.map(rev => (
                        <div key={rev.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#7428E8] text-white font-bold text-xs flex items-center justify-center">
                                {rev.avatarText}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#101D3A]">{rev.name}</p>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1.5">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 4: PORTFOLIO */}
                  {activeTab === 'Portfolio' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-[#101D3A]">
                        Work Portfolio & Gallery
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedBuilder.portfolio?.map(item => (
                          <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-video">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                              <p className="text-white text-xs font-bold">{item.title}</p>
                              <p className="text-purple-300 text-[10px]">{item.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ────── Right Sub-Column: BOOK THIS BUILDER PANEL (5 cols) ────── */}
                <div className="md:col-span-5 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-4">
                  <h3 className="text-base font-extrabold text-[#101D3A] tracking-tight">
                    Book This Builder
                  </h3>

                  {/* Select Your Project Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Select Your Project Type
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7428E8]">
                        <Home size={16} />
                      </div>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-[#101D3A] focus:outline-none focus:border-[#7428E8] cursor-pointer appearance-none"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Renovation">Renovation</option>
                        <option value="Interior Design">Interior Design</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Estimated Area (sq.ft) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Estimated Area (sq.ft)
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={estimatedArea}
                      onChange={(e) => setEstimatedArea(e.target.value)}
                      placeholder="Enter construction area in square feet"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#101D3A] focus:outline-none focus:border-[#7428E8] transition"
                    />
                  </div>

                  {/* Estimated Cost Highlight Card */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Estimated Cost
                    </label>
                    <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-2xl p-4 text-center">
                      <p className="text-xl sm:text-2xl font-black text-[#7428E8] tracking-tight">
                        {formattedEstimatedCost}
                      </p>
                      <p className="text-[11px] font-semibold text-[#7428E8]/80 mt-0.5">
                        (₹ {ratePerSqFt.toLocaleString('en-IN')} / sq.ft)
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-1.5">
                      *Approximate estimate. Final quotation confirmed by builder.
                    </p>
                  </div>

                  {/* Place Booking Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setBookingConfirmed(null);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-purple-500/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Calendar size={18} className="stroke-[2.2]" />
                    <span>Place Booking</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOOKING CONFIRMATION MODAL WORKFLOW
      ───────────────────────────────────────────────────────────── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            
            {/* Close button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {bookingConfirmed ? (
              /* Success confirmation state */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F8F0] text-[#059669] mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} className="stroke-[2.5]" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#101D3A]">
                    Booking Request Placed!
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your request has been delivered to <span className="font-bold text-[#7428E8]">{selectedBuilder?.name}</span>.
                  </p>
                </div>

                {/* Reference Card */}
                <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Reference:</span>
                    <span className="font-mono font-bold text-[#7428E8]">{bookingConfirmed.referenceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Project Type:</span>
                    <span className="font-bold text-gray-800">{bookingConfirmed.projectType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Cost:</span>
                    <span className="font-bold text-emerald-700">{bookingConfirmed.estimatedCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                      Pending Builder Review
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  The builder will review your requirements and reach out via {bookingConfirmed.contactMethod} to finalize architectural milestones and contract terms.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setCurrentTab('my-project');
                    }}
                    className="flex-1 py-3 px-4 bg-[#7428E8] hover:bg-[#6415C5] text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    View in My Projects
                  </button>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Modal Booking Form */
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7428E8] flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#101D3A]">
                      Confirm Builder Booking
                    </h3>
                    <p className="text-xs text-gray-500">
                      Booking with <span className="font-bold text-[#7428E8]">{selectedBuilder?.name}</span>
                    </p>
                  </div>
                </div>

                {/* Builder Rate Summary Card */}
                <div className="bg-[#FAF5FF] border border-[#E9D5FF] p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Rate:</span>
                    <span className="font-bold text-[#7428E8]">₹ {ratePerSqFt.toLocaleString('en-IN')}/sq.ft</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Area:</span>
                    <span className="font-bold text-gray-800">{numArea} sq.ft</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Estimated Cost:</span>
                    <span className="font-bold text-emerald-700">{formattedEstimatedCost}</span>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingDetails.customerName}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, customerName: e.target.value })}
                      className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={bookingDetails.customerPhone}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, customerPhone: e.target.value })}
                      className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={bookingDetails.customerEmail}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, customerEmail: e.target.value })}
                      className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Site Location / City</label>
                    <input
                      type="text"
                      required
                      value={bookingDetails.location}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })}
                      className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Meeting Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDetails.preferredDate}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, preferredDate: e.target.value })}
                      className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={bookingDetails.contactMethod}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, contactMethod: e.target.value })}
                      className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium cursor-pointer"
                    >
                      <option value="Phone Call">Phone Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="In-Person Site Visit">In-Person Site Visit</option>
                      <option value="Video Consultation">Video Consultation</option>
                    </select>
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Project Requirements / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={bookingDetails.requirements}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, requirements: e.target.value })}
                    placeholder="e.g. 4BHK duplex, prefer Italian marble flooring, need structural blueprint approval..."
                    className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-600 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#7428E8] to-[#9B5CFF] hover:from-[#6415C5] hover:to-[#8B5CF6] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-2"
                  >
                    {isSubmittingBooking ? (
                      <span>Placing Booking...</span>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
