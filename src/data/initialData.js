// =========================================================================
// BUILD HUB - COMPLETE DATASET FOR ADMINISTRATOR, BUILDER & CUSTOMER ROLES
// =========================================================================
import builderAvatarImg from '../assets/builder-avatar.png';
import builderVillaBannerImg from '../assets/builder-villa-banner.png';
import galleryImg1 from '../assets/construction-gallery-1.png';
import galleryImg2 from '../assets/construction-gallery-2.png';
import galleryImg3 from '../assets/construction-gallery-3.png';
import galleryImg4 from '../assets/construction-gallery-4.png';

export { builderAvatarImg, builderVillaBannerImg, galleryImg1, galleryImg2, galleryImg3, galleryImg4 };

// --- 1. CUSTOMER SPECIFIC DATA (RAMESH KUMAR) ---
export const CUSTOMER_PROJECT_DATA = {
  id: 'cp_ramesh_1',
  name: 'Dream Villa',
  type: 'Luxury 4BHK Duplex Villa',
  builderName: 'Tech Builders',
  builderContact: '+91 98765 43210',
  builderEmail: 'contact@techbuilders.com',
  builderAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80',
  builderStatus: 'Available (On Site)',
  location: 'Hyderabad, Telangana',
  address: 'Plot 42, Green Meadows, Jubilee Hills Extension, Hyderabad',
  startDate: '01 Jan 2026',
  expectedCompletion: '30 Aug 2026',
  status: 'Ongoing',
  healthStatus: 'On Track',
  progress: 72,
  image: builderVillaBannerImg,
  totalCost: '₹20,00,000',
  totalCostNum: 2000000,
  amountPaid: '₹17,60,000',
  amountPaidNum: 1760000,
  pendingAmount: '₹2,40,000',
  pendingAmountNum: 240000,
  description: 'Custom contemporary 4BHK sustainable duplex villa featuring solar integration, Italian marble flooring, rainwater harvesting system, and landscaped private courtyard.'
};

export const CUSTOMER_PROGRESS_STAGES = [
  { id: 1, name: 'Planning & Approvals', status: 'Completed', date: '15 Jan 2026', desc: 'Soil test, blueprint approval & GHMC permit cleared.' },
  { id: 2, name: 'Foundation & Earthwork', status: 'Completed', date: '05 Feb 2026', desc: 'Excavation, anti-termite treatment, and RCC raft casting.' },
  { id: 3, name: 'Structure & Framing', status: 'Completed', date: '28 Mar 2026', desc: 'Pillars, roof slab casting for Ground + 1st floor completed.' },
  { id: 4, name: 'Electrical & Plumbing', status: 'Completed', date: '25 Apr 2026', desc: 'Concealed copper conduits, CPVC plumbing pipelines laid.' },
  { id: 5, name: 'Interior Work', status: 'In Progress', date: 'Target: 15 Jul 2026', desc: 'POP false ceiling, modular kitchen carpentry, wall putty.' },
  { id: 6, name: 'Final Inspection', status: 'Upcoming', date: 'Target: 10 Aug 2026', desc: 'Structural engineer audit & quality clearance.' },
  { id: 7, name: 'Handover & Housewarming', status: 'Upcoming', date: 'Target: 30 Aug 2026', desc: 'Key handover and occupancy certificate delivery.' }
];

export const CUSTOMER_RECENT_UPDATES = [
  {
    id: 'up1',
    date: '10 Apr 2026',
    activity: 'Interior Work Started',
    description: 'Interior work is currently in progress. False ceiling framework installed in living room & master bedroom.',
    status: 'In Progress',
    badge: 'Latest Update'
  },
  {
    id: 'up2',
    date: '15 Mar 2026',
    activity: 'Electrical & Plumbing Completed',
    description: 'All conduit wiring, switch boxes, and concealed water lines passed pressure testing.',
    status: 'Completed',
    badge: 'Milestone'
  },
  {
    id: 'up3',
    date: '05 Feb 2026',
    activity: 'Building Structure Completed',
    description: 'RCC second slab casting inspected and cured with high tensile steel verification.',
    status: 'Completed',
    badge: 'Milestone'
  },
  {
    id: 'up4',
    date: '10 Jan 2026',
    activity: 'Foundation Completed',
    description: 'Ground level footing and plinth beam concreting completed ahead of schedule.',
    status: 'Completed',
    badge: 'Milestone'
  }
];

export const CUSTOMER_DOCUMENTS = [
  {
    id: 'doc1',
    name: 'Construction Agreement & Contract',
    date: '02 Jan 2026',
    type: 'PDF Contract',
    size: '2.4 MB',
    status: 'Signed & Verified'
  },
  {
    id: 'doc2',
    name: 'Approved Architectural Blueprints',
    date: '10 Jan 2026',
    type: 'CAD Drawing',
    size: '8.1 MB',
    status: 'GHMC Approved'
  },
  {
    id: 'doc3',
    name: 'Detailed Project Estimate & BOQ',
    date: '05 Jan 2026',
    type: 'Spreadsheet',
    size: '1.2 MB',
    status: 'Finalized'
  },
  {
    id: 'doc4',
    name: 'Payment Receipts & Milestone Invoices',
    date: '10 Aug 2026',
    type: 'PDF Receipt',
    size: '3.6 MB',
    status: 'Updated'
  },
  {
    id: 'doc5',
    name: 'Municipal Building Permission Certificate',
    date: '20 Dec 2025',
    type: 'Official Certificate',
    size: '1.8 MB',
    status: 'Government Issued'
  },
  {
    id: 'doc6',
    name: 'Structural Stability & Soil Test Report',
    date: '28 Dec 2025',
    type: 'Technical Report',
    size: '4.5 MB',
    status: 'Passed A+'
  }
];

export const CUSTOMER_PAYMENTS = [
  {
    id: 'pay1',
    date: '10 Aug 2026',
    description: 'Stage 5 - Carpentry & False Ceiling Milestone',
    amount: '₹2,00,000',
    status: 'Paid',
    method: 'HDFC Bank NEFT #992144',
    receiptId: 'REC-2026-884'
  },
  {
    id: 'pay2',
    date: '10 Jul 2026',
    description: 'Stage 4 - Plumbing & Electrical Wiring Milestone',
    amount: '₹3,00,000',
    status: 'Paid',
    method: 'ICICI Bank Transfer #778120',
    receiptId: 'REC-2026-721'
  },
  {
    id: 'pay3',
    date: '15 May 2026',
    description: 'Stage 3 - Structure & Slab Casting Milestone',
    amount: '₹5,00,000',
    status: 'Paid',
    method: 'HDFC Bank NEFT #661092',
    receiptId: 'REC-2026-512'
  },
  {
    id: 'pay4',
    date: '20 Feb 2026',
    description: 'Stage 2 - Foundation Plinth Beam Milestone',
    amount: '₹4,60,000',
    status: 'Paid',
    method: 'RTGS Wire Transfer #441992',
    receiptId: 'REC-2026-309'
  },
  {
    id: 'pay5',
    date: '02 Jan 2026',
    description: 'Stage 1 - Project Booking & Civil Advance',
    amount: '₹3,00,000',
    status: 'Paid',
    method: 'Cheque Clearance #100293',
    receiptId: 'REC-2026-101'
  }
];

export const CUSTOMER_CHAT_MESSAGES = [
  {
    id: 'm1',
    sender: 'builder',
    senderName: 'Tech Builders',
    text: 'Hello Mr. Ramesh! The RCC roof slab curing is complete and plastering is ongoing.',
    time: '10:15 AM',
    date: 'Aug 17, 2026'
  },
  {
    id: 'm2',
    sender: 'customer',
    senderName: 'Ramesh Kumar',
    text: 'Thank you! When is the expected completion date for the interior work?',
    time: '10:20 AM',
    date: 'Aug 17, 2026'
  },
  {
    id: 'm3',
    sender: 'builder',
    senderName: 'Tech Builders',
    text: 'We expect to complete the interior modular carpentry by August 20. Would you like to inspect the Italian marble samples this Friday?',
    time: '10:25 AM',
    date: 'Aug 17, 2026'
  }
];

export const CUSTOMER_NOTIFICATIONS = [
  {
    id: 'cn1',
    title: 'Project Progress Updated',
    message: 'Project progress updated to 72% - False ceiling framing completed.',
    time: '25 mins ago',
    read: false,
    type: 'progress'
  },
  {
    id: 'cn2',
    title: 'New Document Uploaded',
    message: 'Tech Builders uploaded "Electrical Pressure Inspection Report.pdf".',
    time: '2 hours ago',
    read: false,
    type: 'document'
  },
  {
    id: 'cn3',
    title: 'Payment Acknowledged',
    message: 'Payment of ₹2,00,000 received for Stage 5 Interior milestone.',
    time: '1 day ago',
    read: true,
    type: 'payment'
  },
  {
    id: 'cn4',
    title: 'New Message from Builder',
    message: 'Tech Builders: "We expect to complete interior work by August 20."',
    time: '2 days ago',
    read: true,
    type: 'message'
  }
];

// --- 2. BUILDER SPECIFIC DATA (VINAY / TECH BUILDERS) ---
export const BUILDER_CUSTOMER_REQUESTS = [
  {
    id: 'req1',
    customer: 'Ramesh Kumar',
    location: 'Hyderabad, Telangana',
    projectType: 'Home Construction',
    date: 'Aug 17, 2025',
    budget: '$380,000',
    status: 'New',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 11223'
  },
  {
    id: 'req2',
    customer: 'Priya Sharma',
    location: 'Vijayawada, AP',
    projectType: 'Office Building',
    date: 'Aug 15, 2025',
    budget: '$750,000',
    status: 'In Progress',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 99114 43322'
  },
  {
    id: 'req3',
    customer: 'Aman Verma',
    location: 'Visakhapatnam, AP',
    projectType: 'Commercial Space',
    date: 'Aug 12, 2025',
    budget: '$520,000',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98223 77889'
  },
  {
    id: 'req4',
    customer: 'Sneha Reddy',
    location: 'Warangal, Telangana',
    projectType: 'Villa Construction',
    date: 'Aug 10, 2025',
    budget: '$420,000',
    status: 'New',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 99881 44556'
  }
];

export const BUILDER_MY_PROJECTS = [
  {
    id: 'bp1',
    name: 'Dream Villa',
    customer: 'Ramesh Kumar',
    location: 'Hyderabad',
    status: 'Ongoing',
    healthStatus: 'On Track',
    progress: 72,
    phase: 'Interior & Finishing',
    budget: '₹45,00,000',
    spent: '₹32,40,000',
    startDate: '01 Jan 2026',
    deadline: '30 Aug 2026',
    targetHandover: '30 Aug 2026',
    type: 'Residential',
    description: 'Modern villa with premium interiors and vastu compliant design.',
    image: builderVillaBannerImg,
    milestones: [
      { name: 'Foundation', stage: 'Foundation', completed: true, status: 'Completed', date: '10 Feb 2026' },
      { name: 'Structure', stage: 'Structure', completed: true, status: 'Completed', date: '25 Apr 2026' },
      { name: 'Interior & Finishing', stage: 'Interior & Finishing', completed: false, status: 'In Progress', date: 'Target: 15 Jul 2026' },
      { name: 'Painting', stage: 'Painting', completed: false, status: 'Pending', date: 'Target: 10 Aug 2026' },
      { name: 'Final Handover', stage: 'Final Handover', completed: false, status: 'Pending', date: 'Target: 30 Aug 2026' }
    ]
  },
  {
    id: 'bp2',
    name: 'Office Building',
    customer: 'Priya Sharma',
    location: 'Vijayawada',
    status: 'Ongoing',
    progress: 54,
    budget: '$1,200,000',
    spent: '$648,000',
    deadline: 'Sep 15, 2025',
    type: 'Commercial',
    description: '6-storey glass facade corporate office with high-efficiency HVAC and parking deck.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    milestones: [
      { name: 'Deep Basement Piling', completed: true, date: 'Jan 20, 2025' },
      { name: 'Steel Framing & Slabs', completed: true, date: 'May 10, 2025' },
      { name: 'Curtain Wall Glazing', completed: true, date: 'Jul 20, 2025' },
      { name: 'HVAC & Fire Safety', completed: false, date: 'Aug 25, 2025' },
      { name: 'Interior Fitout', completed: false, date: 'Sep 15, 2025' }
    ]
  },
  {
    id: 'bp3',
    name: 'Commercial Space',
    customer: 'Aman Verma',
    location: 'Visakhapatnam',
    status: 'Ongoing',
    progress: 38,
    budget: '$680,000',
    spent: '$258,000',
    deadline: 'Sep 20, 2025',
    type: 'Commercial',
    description: 'Multi-retail complex with wide storefronts and heavy load escalators.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    milestones: [
      { name: 'Ground Excavation & Civil Permits', completed: true, date: 'Apr 05, 2025' },
      { name: 'Column Erection', completed: true, date: 'Jun 12, 2025' },
      { name: 'Roof Truss & Flooring', completed: false, date: 'Sep 20, 2025' }
    ]
  },
  {
    id: 'bp4',
    name: 'Villa Construction',
    customer: 'Sneha Reddy',
    location: 'Warangal',
    status: 'Ongoing',
    progress: 25,
    budget: '$420,000',
    spent: '$105,000',
    deadline: 'Oct 05, 2025',
    type: 'Residential',
    description: 'Custom bioclimatic duplex villa with landscaped courtyard and rainwater recharge pit.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=80',
    milestones: [
      { name: 'Site Clearing & Survey', completed: true, date: 'May 10, 2025' },
      { name: 'Foundation Slab', completed: true, date: 'Jul 01, 2025' },
      { name: 'Masonry Walls', completed: false, date: 'Aug 20, 2025' },
      { name: 'Finishing & Handover', completed: false, date: 'Oct 05, 2025' }
    ]
  }
];

export const INITIAL_BUILDER_CUSTOMERS = [
  {
    id: 'bc1',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@gmail.com',
    phone: '+91 98765 11223',
    city: 'Hyderabad',
    project: 'Residential Villa',
    status: 'Active Client',
    totalSpent: '$450,000',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'bc2',
    name: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '+91 99114 43322',
    city: 'Vijayawada',
    project: 'Office Building',
    status: 'Active Client',
    totalSpent: '$1,200,000',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'bc3',
    name: 'Aman Verma',
    email: 'aman.verma@apex.in',
    phone: '+91 98223 77889',
    city: 'Visakhapatnam',
    project: 'Commercial Space',
    status: 'Active Client',
    totalSpent: '$680,000',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'bc4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '+91 99881 44556',
    city: 'Warangal',
    project: 'Villa Construction',
    status: 'Active Client',
    totalSpent: '$420,000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

// --- 3. ADMINISTRATOR SPECIFIC DATA ---
export const INITIAL_BUILDERS = [
  {
    id: 'b-ravi',
    name: 'Ravi Constructions',
    company: 'Ravi Constructions Pvt Ltd',
    owner: 'Ravi Teja',
    email: 'contact@raviconstructions.in',
    phone: '+91 98765 43210',
    specialization: 'Luxury Residential & Duplex Villas',
    licenseNo: 'BLD-2015-4491',
    rating: 4.8,
    reviewsCount: 520,
    experienceYears: 10,
    activeProjectsCount: 4,
    totalCompletedProjects: 520,
    avatar: builderAvatarImg,
    address: 'Plot 88, Road No. 36, Jubilee Hills, Hyderabad',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b-skyline',
    name: 'Skyline Builders',
    company: 'Skyline Infra Developers',
    owner: 'Sanjay Kapoor',
    email: 'info@skylinebuilders.in',
    phone: '+91 99114 43322',
    specialization: 'High-Rise Residential & Commercial',
    licenseNo: 'BLD-2017-6623',
    rating: 4.7,
    reviewsCount: 430,
    experienceYears: 8,
    activeProjectsCount: 3,
    totalCompletedProjects: 420,
    avatar: builderAvatarImg,
    address: 'Level 5, Metro Towers, Madhapur, Hyderabad',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b-dreamspace',
    name: 'DreamSpace Builders',
    company: 'DreamSpace Luxury Homes Ltd',
    owner: 'Arun Nambiar',
    email: 'hello@dreamspace.co',
    phone: '+91 98223 77889',
    specialization: 'Bioclimatic Homes & Turnkey Villas',
    licenseNo: 'BLD-2019-9941',
    rating: 4.6,
    reviewsCount: 390,
    experienceYears: 12,
    activeProjectsCount: 2,
    totalCompletedProjects: 350,
    avatar: builderAvatarImg,
    address: 'Banjara Hills Road No. 12, Hyderabad',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b-elite',
    name: 'Elite Constructions',
    company: 'Elite Infrastructure & Developers',
    owner: 'Manish Chawla',
    email: 'contact@eliteconstructions.org',
    phone: '+91 99881 44556',
    specialization: 'Civil Substructure & Duplex Homes',
    licenseNo: 'BLD-2016-3310',
    rating: 4.5,
    reviewsCount: 320,
    experienceYears: 9,
    activeProjectsCount: 3,
    totalCompletedProjects: 280,
    avatar: builderAvatarImg,
    address: 'Kukatpally Housing Board Colony, Hyderabad',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b1',
    name: 'Tech Builders',
    company: 'Tech Builders Pvt Ltd',
    email: 'contact@techbuilders.com',
    phone: '+91 98765 43210',
    specialization: 'Residential & High-Rise Commercial',
    licenseNo: 'BLD-2021-8849',
    rating: 4.9,
    reviewsCount: 180,
    experienceYears: 14,
    activeProjectsCount: 3,
    totalCompletedProjects: 42,
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80',
    address: 'Plot 45, Cyber Hills, Tech City',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b2',
    name: 'Urban Build',
    company: 'Urban Build Developers',
    email: 'info@urbanbuild.com',
    phone: '+91 98441 22334',
    specialization: 'Commercial Spaces & Corporate Offices',
    licenseNo: 'BLD-2019-3392',
    rating: 4.8,
    reviewsCount: 140,
    experienceYears: 11,
    activeProjectsCount: 2,
    totalCompletedProjects: 31,
    avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80',
    address: 'Level 4, Metro Tower, City Center',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b3',
    name: 'Dream Homes',
    company: 'Dream Homes Renovations',
    email: 'hello@dreamhomes.com',
    phone: '+91 97321 00982',
    specialization: 'Luxury Interiors & Home Renovations',
    licenseNo: 'BLD-2022-7714',
    rating: 4.9,
    reviewsCount: 210,
    experienceYears: 9,
    activeProjectsCount: 1,
    totalCompletedProjects: 58,
    avatar: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&auto=format&fit=crop&q=80',
    address: '88 Heritage Enclave, North Sector',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  },
  {
    id: 'b4',
    name: 'BuildCorp',
    company: 'BuildCorp Infrastructure',
    email: 'sales@buildcorp.in',
    phone: '+91 99001 88772',
    specialization: 'Industrial & Large Retail Malls',
    licenseNo: 'BLD-2018-1205',
    rating: 4.7,
    reviewsCount: 310,
    experienceYears: 18,
    activeProjectsCount: 2,
    totalCompletedProjects: 76,
    avatar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=80',
    address: 'BuildCorp Hub, Highway Express Zone',
    status: 'Active',
    verificationStatus: 'verified',
    accountStatus: 'active'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'c1',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@gmail.com',
    phone: '+91 98765 11223',
    city: 'Hyderabad',
    propertyType: 'Residential Villa',
    activeProject: 'Residential Villa',
    totalInvested: '₹20,00,000',
    status: 'Active Client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    verificationStatus: 'verified'
  },
  {
    id: 'c2',
    name: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '+91 99114 43322',
    city: 'Vijayawada',
    propertyType: 'Office Building',
    activeProject: 'Office Building',
    totalInvested: '₹1,20,00,000',
    status: 'Active Client',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    verificationStatus: 'verified'
  },
  {
    id: 'c3',
    name: 'Aman Verma',
    email: 'aman.verma@apex.in',
    phone: '+91 98223 77889',
    city: 'Visakhapatnam',
    propertyType: 'Commercial Space',
    activeProject: 'Commercial Space',
    totalInvested: '₹68,00,000',
    status: 'Active Client',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    verificationStatus: 'verified'
  },
  {
    id: 'c4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '+91 99881 44556',
    city: 'Warangal',
    propertyType: 'Villa Construction',
    activeProject: 'Villa Construction',
    totalInvested: '₹42,00,000',
    status: 'Active Client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    verificationStatus: 'verified'
  },
  {
    id: 'c5',
    name: 'Tech Solutions Ltd',
    email: 'admin@techsolutions.io',
    phone: '+91 98223 99881',
    city: 'Bangalore',
    propertyType: 'Corporate Office Complex',
    activeProject: 'Office Building',
    totalInvested: '₹1,20,00,000',
    status: 'Active Client',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    verificationStatus: 'verified'
  },
  {
    id: 'c6',
    name: 'Golden Traders',
    email: 'deepak@goldentraders.com',
    phone: '+91 97665 88990',
    city: 'Delhi NCR',
    propertyType: 'Commercial Showroom Hub',
    activeProject: 'Commercial Space',
    totalInvested: '₹68,00,000',
    status: 'Pending Start',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    verificationStatus: 'verified'
  }
];

export const INITIAL_WORKERS = [
  {
    id: 'w1',
    name: 'Deva Raju',
    trade: 'Master Mason',
    skillLevel: 'Expert (12 yrs)',
    phone: '+91 98440 11990',
    dailyRate: '$45/day',
    status: 'On Site',
    assignedProject: 'Residential Villa',
    builder: 'Tech Builders',
    safetyCertified: true,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w2',
    name: 'Mohammed Irfan',
    trade: 'Lead Electrician & Wiring',
    skillLevel: 'Certified Master (9 yrs)',
    phone: '+91 97331 44556',
    dailyRate: '$50/day',
    status: 'On Site',
    assignedProject: 'Office Building',
    builder: 'Urban Build',
    safetyCertified: true,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w3',
    name: 'Gurpreet Singh',
    trade: 'Structural Welder & Rebar',
    skillLevel: 'Senior (11 yrs)',
    phone: '+91 98112 77889',
    dailyRate: '$48/day',
    status: 'On Site',
    assignedProject: 'Residential Villa',
    builder: 'Tech Builders',
    safetyCertified: true,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w4',
    name: 'Karthik Swamy',
    trade: 'Plumber & Sanitary Engineer',
    skillLevel: 'Journeyman (7 yrs)',
    phone: '+91 99002 33441',
    dailyRate: '$42/day',
    status: 'On Leave',
    assignedProject: 'Home Renovation',
    builder: 'Dream Homes',
    safetyCertified: true,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ADMIN_PROJECTS = [
  {
    id: 'p1',
    name: 'Residential Villa',
    type: 'Residential',
    customer: 'Ramesh Kumar',
    builder: 'Tech Builders',
    status: 'Ongoing',
    progress: 72,
    budget: '$450,000',
    spent: '$324,000',
    deadline: 'Aug 30, 2025',
    location: 'Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    name: 'Office Building',
    type: 'Commercial',
    customer: 'Tech Solutions',
    builder: 'Urban Build',
    status: 'Ongoing',
    progress: 65,
    budget: '$1,200,000',
    spent: '$780,000',
    deadline: 'Sep 15, 2025',
    location: 'Electronic City, Bangalore',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'p3',
    name: 'Home Renovation',
    type: 'Renovation',
    customer: 'Priya Sharma',
    builder: 'Dream Homes',
    status: 'Completed',
    progress: 100,
    budget: '$85,000',
    spent: '$82,500',
    deadline: 'Aug 10, 2025',
    location: 'Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    name: 'Commercial Space',
    type: 'Commercial',
    customer: 'Golden Traders',
    builder: 'BuildCorp',
    status: 'Pending',
    progress: 0,
    budget: '$680,000',
    spent: '$0',
    deadline: 'Sep 20, 2025',
    location: 'Cyber Hub Sector 29, Gurgaon',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80'
  }
];

export const CHART_MONTHLY_OVERVIEW = [
  { month: 'Mar', Ongoing: 2.1, Completed: 0.8, Pending: 0.3 },
  { month: 'Apr', Ongoing: 5.4, Completed: 2.1, Pending: 1.2 },
  { month: 'May', Ongoing: 7.2, Completed: 3.2, Pending: 1.5 },
  { month: 'Jun', Ongoing: 6.9, Completed: 3.8, Pending: 1.1 },
  { month: 'Jul', Ongoing: 8.8, Completed: 4.8, Pending: 2.0 },
  { month: 'Aug', Ongoing: 10.2, Completed: 6.2, Pending: 2.2 },
];

// ─────────────────────────────────────────────────────────────
// 5. FIND BUILDERS & BOOKINGS DATA (Customer Discovery Module)
// ─────────────────────────────────────────────────────────────
export const FIND_BUILDERS_DATA = [
  {
    id: 'b-ravi',
    name: 'Ravi Constructions',
    company: 'Ravi Constructions Pvt Ltd',
    owner: 'Ravi Teja',
    rating: 4.8,
    reviewsCount: 520,
    experienceYears: '10+ Years',
    experienceNum: 10,
    pricePerSqFt: 1800,
    priceFormatted: '₹1,800/sq.ft',
    categories: ['Residential', 'Commercial', 'Renovation'],
    description: 'Building Dreams Since 2010',
    about: 'Ravi Constructions is a trusted name in the construction industry with over 10 years of experience in delivering high-quality residential and commercial projects. We focus on innovation, sustainability and customer satisfaction.',
    verified: true,
    completedProjects: '500+ Projects',
    completedProjectsNum: 520,
    location: 'Hyderabad',
    city: 'Hyderabad',
    address: 'Plot 88, Road No. 36, Jubilee Hills, Hyderabad',
    phone: '+91 98765 43210',
    email: 'contact@raviconstructions.in',
    avatar: builderAvatarImg,
    coverImage: builderVillaBannerImg,
    trustBadges: [
      { id: 'tb1', title: 'Trusted & Verified', subtitle: 'Verified License', icon: 'shield' },
      { id: 'tb2', title: '500+ Projects', subtitle: 'On-time delivery', icon: 'trophy' },
      { id: 'tb3', title: '4.8/5 Rating', subtitle: '520+ Reviews', icon: 'star' }
    ],
    projects: [
      {
        id: 'p-rc1',
        name: 'Skyline Luxury Villa',
        location: 'Jubilee Hills, Hyderabad',
        type: 'Residential',
        area: '4,200 sq.ft',
        cost: '₹75,60,000',
        description: '4BHK contemporary smart villa with private infinity pool and Italian marble interiors.',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-rc2',
        name: 'Apex Tech Tower',
        location: 'HITEC City, Hyderabad',
        type: 'Commercial',
        area: '28,000 sq.ft',
        cost: '₹5,04,00,000',
        description: '6-storey Grade-A corporate workspace with high-efficiency HVAC and double glass facade.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-rc3',
        name: 'Emerald Garden Duplex',
        location: 'Gachibowli, Hyderabad',
        type: 'Residential',
        area: '3,400 sq.ft',
        cost: '₹61,20,000',
        description: 'Modern bioclimatic residence featuring integrated solar power and rainwater harvesting.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        id: 'rev-rc1',
        name: 'Priya Sharma',
        avatarText: 'P',
        rating: 5,
        date: 'Aug 15, 2025',
        comment: 'Excellent work and very professional team!'
      },
      {
        id: 'rev-rc2',
        name: 'Vikram Reddy',
        avatarText: 'V',
        rating: 5,
        date: 'Jul 28, 2025',
        comment: 'Delivered our 4BHK villa 2 weeks ahead of schedule. Structural quality and MEP works are flawless.'
      },
      {
        id: 'rev-rc3',
        name: 'Ananya Rao',
        avatarText: 'A',
        rating: 4.8,
        date: 'Jun 12, 2025',
        comment: 'Completely transparent billing, weekly drone progress reports, and very receptive team.'
      }
    ],
    portfolio: [
      { id: 'pf-1', title: 'Luxury Villa Exterior', category: 'Residential', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80' },
      { id: 'pf-2', title: 'Corporate Glass Atrium', category: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80' },
      { id: 'pf-3', title: 'Modular Living Interior', category: 'Interior Design', image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&auto=format&fit=crop&q=80' },
      { id: 'pf-4', title: 'Minimalist Balcony & Pool', category: 'Residential', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'b-skyline',
    name: 'Skyline Builders',
    company: 'Skyline Infra Developers',
    owner: 'Sanjay Kapoor',
    rating: 4.7,
    reviewsCount: 430,
    experienceYears: '8+ Years',
    experienceNum: 8,
    pricePerSqFt: 1750,
    priceFormatted: '₹1,750/sq.ft',
    categories: ['Residential', 'Commercial', 'Industrial'],
    description: 'Quality You Can Trust',
    about: 'Skyline Builders delivers world-class residential towers and commercial infrastructures with precision engineering, seismically-tested RCC frameworks, and strict adherence to handover schedules.',
    verified: true,
    completedProjects: '420+ Projects',
    completedProjectsNum: 420,
    location: 'Hyderabad',
    city: 'Hyderabad',
    address: 'Level 5, Metro Towers, Madhapur, Hyderabad',
    phone: '+91 99114 43322',
    email: 'info@skylinebuilders.in',
    avatar: builderAvatarImg,
    coverImage: builderVillaBannerImg,
    trustBadges: [
      { id: 'tb1', title: 'Trusted & Verified', subtitle: 'ISO 9001 Certified', icon: 'shield' },
      { id: 'tb2', title: '420+ Projects', subtitle: 'Completed on Time', icon: 'trophy' },
      { id: 'tb3', title: '4.7/5 Rating', subtitle: '430+ Reviews', icon: 'star' }
    ],
    projects: [
      {
        id: 'p-sky1',
        name: 'Skyline Horizon Gated Community',
        location: 'Kondapur, Hyderabad',
        type: 'Residential',
        area: '65,000 sq.ft',
        cost: '₹11,37,50,000',
        description: 'Multi-tower luxury residential enclave with clubhouse and underground parking.',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-sky2',
        name: 'Cyber Heights Commercial Plaza',
        location: 'Madhapur, Hyderabad',
        type: 'Commercial',
        area: '18,500 sq.ft',
        cost: '₹3,23,75,000',
        description: 'Glass-front retail and commercial tech hub.',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        id: 'rev-sky1',
        name: 'Mahesh Goud',
        avatarText: 'M',
        rating: 5,
        date: 'Jul 10, 2025',
        comment: 'High standards of concrete pouring and structural integrity. Very transparent.'
      },
      {
        id: 'rev-sky2',
        name: 'Deepa Verma',
        avatarText: 'D',
        rating: 4.5,
        date: 'May 20, 2025',
        comment: 'Great craftsmanship on the masonry and plumbing. Smooth handover process.'
      }
    ],
    portfolio: [
      { id: 'pf-sky1', title: 'High-Rise Commercial', category: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80' },
      { id: 'pf-sky2', title: 'Gated Residential Enclave', category: 'Residential', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'b-dreamspace',
    name: 'DreamSpace Builders',
    company: 'DreamSpace Luxury Homes Ltd',
    owner: 'Arun Nambiar',
    rating: 4.6,
    reviewsCount: 390,
    experienceYears: '12+ Years',
    experienceNum: 12,
    pricePerSqFt: 1900,
    priceFormatted: '₹1,900/sq.ft',
    categories: ['Residential', 'Commercial', 'Luxury Homes'],
    description: 'Innovative Construction Solutions',
    about: 'DreamSpace specializes in bespoke luxury villas, smart architectural homes, and turnkey commercial environments built with green building materials and energy-positive designs.',
    verified: true,
    completedProjects: '350+ Projects',
    completedProjectsNum: 350,
    location: 'Hyderabad',
    city: 'Hyderabad',
    address: 'Banjara Hills Road No. 12, Hyderabad',
    phone: '+91 98223 77889',
    email: 'hello@dreamspace.co',
    avatar: builderAvatarImg,
    coverImage: builderVillaBannerImg,
    trustBadges: [
      { id: 'tb1', title: 'Trusted & Verified', subtitle: 'RERA Certified Firm', icon: 'shield' },
      { id: 'tb2', title: '350+ Projects', subtitle: 'Turnkey Solutions', icon: 'trophy' },
      { id: 'tb3', title: '4.6/5 Rating', subtitle: '390+ Reviews', icon: 'star' }
    ],
    projects: [
      {
        id: 'p-ds1',
        name: 'The Crown Villa Estate',
        location: 'Gandipet, Hyderabad',
        type: 'Luxury Homes',
        area: '5,800 sq.ft',
        cost: '₹1,10,20,000',
        description: 'Ultra-luxury lakeview villa with home theatre, landscaped lawn, and automation.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        id: 'rev-ds1',
        name: 'Karthik Somayaji',
        avatarText: 'K',
        rating: 5,
        date: 'Aug 02, 2025',
        comment: 'Architectural planning was outstanding. Every room has optimal natural light.'
      }
    ],
    portfolio: [
      { id: 'pf-ds1', title: 'Luxury Villa Frontage', category: 'Luxury Homes', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'b-elite',
    name: 'Elite Constructions',
    company: 'Elite Infrastructure & Developers',
    owner: 'Manish Chawla',
    rating: 4.5,
    reviewsCount: 320,
    experienceYears: '9+ Years',
    experienceNum: 9,
    pricePerSqFt: 1700,
    priceFormatted: '₹1,700/sq.ft',
    categories: ['Residential', 'Commercial', 'Renovation'],
    description: 'Strong Foundation. Better Tomorrow.',
    about: 'Elite Constructions has been crafting durable foundations, custom bungalows, and modern duplex residences with unmatched structural integrity and cost-efficient material management.',
    verified: true,
    completedProjects: '280+ Projects',
    completedProjectsNum: 280,
    location: 'Hyderabad',
    city: 'Hyderabad',
    address: 'Kukatpally Housing Board Colony, Hyderabad',
    phone: '+91 99881 44556',
    email: 'contact@eliteconstructions.org',
    avatar: builderAvatarImg,
    coverImage: builderVillaBannerImg,
    trustBadges: [
      { id: 'tb1', title: 'Trusted & Verified', subtitle: 'Government Licensed', icon: 'shield' },
      { id: 'tb2', title: '280+ Projects', subtitle: 'High Durability', icon: 'trophy' },
      { id: 'tb3', title: '4.5/5 Rating', subtitle: '320+ Reviews', icon: 'star' }
    ],
    projects: [
      {
        id: 'p-el1',
        name: 'Silver Oak Residences',
        location: 'Miyapur, Hyderabad',
        type: 'Residential',
        area: '2,900 sq.ft',
        cost: '₹49,30,000',
        description: 'Modern 3BHK duplex homes with earthquake-resistant RCC frame and premium teak finishes.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        id: 'rev-el1',
        name: 'Sunil Rao',
        avatarText: 'S',
        rating: 4.5,
        date: 'Jun 25, 2025',
        comment: 'Very cost effective and reliable team. No hidden charges throughout the project.'
      }
    ],
    portfolio: [
      { id: 'pf-el1', title: 'Duplex Bungalow', category: 'Residential', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'b-apex-bangalore',
    name: 'Apex Modern Spaces',
    company: 'Apex Modern Spaces LLP',
    owner: 'Chetan Murthy',
    rating: 4.8,
    reviewsCount: 260,
    experienceYears: '11+ Years',
    experienceNum: 11,
    pricePerSqFt: 2100,
    priceFormatted: '₹2,100/sq.ft',
    categories: ['Residential', 'Luxury Homes', 'Interior Design'],
    description: 'Eco-conscious Luxury Residences',
    about: 'Specialized in premium villa communities and sustainable architecture across Bangalore and South India.',
    verified: true,
    completedProjects: '310+ Projects',
    completedProjectsNum: 310,
    location: 'Bangalore',
    city: 'Bangalore',
    address: 'Indiranagar 100ft Road, Bangalore',
    phone: '+91 97410 55667',
    email: 'info@apexmodern.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    trustBadges: [
      { id: 'tb1', title: 'Trusted & Verified', subtitle: 'Green Building Council', icon: 'shield' },
      { id: 'tb2', title: '310+ Projects', subtitle: 'Zero Delay Record', icon: 'trophy' },
      { id: 'tb3', title: '4.8/5 Rating', subtitle: '260+ Reviews', icon: 'star' }
    ],
    projects: [],
    reviews: [],
    portfolio: []
  }
];

// =========================================================================
// CONSTRUCTION IMAGES GALLERY & PROGRESS UPDATES (MATCHING REFERENCE UI)
// =========================================================================

export const INITIAL_CONSTRUCTION_IMAGES = [
  {
    id: 'cimg_1',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    imageUrl: galleryImg1,
    stage: 'Structure',
    description: 'RCC column framing & roof slab casting under clear weather verification.',
    uploadDate: 'Aug 15, 2026',
    createdAt: '2026-08-15T10:30:00Z'
  },
  {
    id: 'cimg_2',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    imageUrl: galleryImg2,
    stage: 'Interior & Finishing',
    description: 'Interior room rough plastering, ceiling conduit routing, and window frame alignment.',
    uploadDate: 'Aug 10, 2026',
    createdAt: '2026-08-10T14:15:00Z'
  },
  {
    id: 'cimg_3',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    imageUrl: galleryImg3,
    stage: 'Brickwork',
    description: 'Red brick masonry walls erected with exterior bamboo scaffolding setup.',
    uploadDate: 'Aug 05, 2026',
    createdAt: '2026-08-05T09:45:00Z'
  },
  {
    id: 'cimg_4',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    imageUrl: galleryImg4,
    stage: 'Foundation',
    description: 'Completed external facade structural review with glass balconies and driveway.',
    uploadDate: 'Jul 28, 2026',
    createdAt: '2026-07-28T16:20:00Z'
  }
];

export const INITIAL_PROGRESS_UPDATES = [
  {
    id: 'pup_1',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    builderAvatar: builderAvatarImg,
    stage: 'Interior & Finishing',
    title: 'Rough Plastering & Ceiling Framework Completed',
    description: 'False ceiling framework and internal conduit wiring completed for first floor bedrooms. Wall putty application commenced.',
    progressPercentage: 25,
    date: 'Aug 15, 2026',
    time: '11:30 AM',
    images: [galleryImg1, galleryImg2]
  },
  {
    id: 'pup_2',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    builderAvatar: builderAvatarImg,
    stage: 'Brickwork',
    title: 'External Brick Masonry & Perimeter Walls',
    description: 'Completed double-wall brick masonry with mortar curing testing. Plumbing ducts left clear as per architectural drawings.',
    progressPercentage: 20,
    date: 'Aug 05, 2026',
    time: '04:15 PM',
    images: [galleryImg3]
  },
  {
    id: 'pup_3',
    projectId: 'cp_ramesh_1',
    builderId: 'b-ravi',
    builderName: 'Ravi Constructions',
    builderAvatar: builderAvatarImg,
    stage: 'Foundation',
    title: 'Earth Excavation & Anti-Termite RCC Raft',
    description: 'Soil bearing test certified by structural engineer. Footing casting and sub-surface waterproofing successfully applied.',
    progressPercentage: 10,
    date: 'Jul 28, 2026',
    time: '02:00 PM',
    images: [galleryImg4]
  }
];
