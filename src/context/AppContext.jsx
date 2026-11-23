import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CUSTOMER_PROJECT_DATA,
  CUSTOMER_PROGRESS_STAGES,
  CUSTOMER_RECENT_UPDATES,
  CUSTOMER_DOCUMENTS,
  CUSTOMER_PAYMENTS,
  CUSTOMER_CHAT_MESSAGES,
  CUSTOMER_NOTIFICATIONS,
  BUILDER_CUSTOMER_REQUESTS,
  BUILDER_MY_PROJECTS,
  INITIAL_BUILDERS,
  INITIAL_CUSTOMERS,
  INITIAL_WORKERS,
  CHART_MONTHLY_OVERVIEW,
  FIND_BUILDERS_DATA,
  INITIAL_CONSTRUCTION_IMAGES,
  INITIAL_PROGRESS_UPDATES,
  builderVillaBannerImg,
  builderAvatarImg
} from '../data/initialData';
import {
  signInAsDemoRole,
  signInUser,
  registerUser,
  signOutUser,
  onAuthChange,
  getUserProfile,
  signInWithGoogle,
  signInWithMicrosoft
} from '../services/firebase/authService';
import {
  createBuilderBookingInFirestore,
  updateBookingStatusInFirestore,
  saveConstructionImageToFirestore,
  deleteConstructionImageFromFirestore,
  subscribeToConstructionImages,
  saveProgressUpdateToFirestore,
  subscribeToProgressUpdates,
  saveProjectDocumentToFirestore,
  deleteProjectDocumentFromFirestore,
  subscribeToProjectDocuments
} from '../services/firebase/firestoreService';
import { INITIAL_PROJECT_DOCUMENTS } from '../data/documentsData';
import {
  seedInitialDataIfEmpty,
  subscribeToProjects,
  subscribeToCustomerProject,
  updateProjectProgressInDb,
  addProjectToDb
} from '../services/firebase/projectService';
import {
  subscribeToAllBuilders,
  subscribeToAllCustomers,
  updateBuilderApproval,
  updateCustomerStatus
} from '../services/firebase/userService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation tab (defaults to 'find-builders' for customer builder discovery)
  const [currentTab, setCurrentTab] = useState('find-builders');

  // Authentication & Role Selection Flow
  // 'role-selection' | 'login-admin' | 'login-builder' | 'login-customer' | 'register-customer' | 'register-builder'
  const [authStep, setAuthStep] = useState('role-selection');

  // Start with isAuthenticated = false so user lands on login/role selection
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('buildhub_auth_v5');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Current Logged-in User (Clean state, no fake demo profile)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('buildhub_user_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.name || parsed.name.toLowerCase() === 'conductor') {
          parsed.name = parsed.role === 'Customer' ? 'Customer' : (parsed.role || 'Customer');
        }
        return parsed;
      } catch (e) {
        console.warn('Error reading saved user:', e);
      }
    }
    return {
      name: 'Customer',
      role: 'Customer',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: '',
      city: '',
      address: '',
      project: '',
      unreadNotifications: 0
    };
  });

  // --- CUSTOMER DATA STATE (With comprehensive demo data) ---
  const [customerProject, setCustomerProject] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_project_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== 'No Active Project') {
          return parsed;
        }
      } catch { }
    }
    return CUSTOMER_PROJECT_DATA;
  });

  const [customerStages, setCustomerStages] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_stages_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return CUSTOMER_PROGRESS_STAGES;
  });

  const [customerUpdates, setCustomerUpdates] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_updates_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return CUSTOMER_RECENT_UPDATES;
  });

  const [customerDocuments, setCustomerDocuments] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_docs_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return CUSTOMER_DOCUMENTS;
  });

  const [customerPayments, setCustomerPayments] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_payments_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return CUSTOMER_PAYMENTS;
  });

  const [customerMessages, setCustomerMessages] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_messages_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return CUSTOMER_CHAT_MESSAGES;
  });

  const [customerNotifications, setCustomerNotifications] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_notifs_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return CUSTOMER_NOTIFICATIONS;
  });

  // --- BUILDER & ADMIN STATE (Loaded with verified contractors & client accounts) ---
  const [myProjects, setMyProjects] = useState(() => {
    const saved = localStorage.getItem('buildhub_my_projects_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure bp1 (Dream Villa) aligns with the latest detailed milestones schema
          return parsed.map(p => {
            if (p.id === 'bp1' && (p.name === 'Residential Villa' || !p.healthStatus)) {
              return {
                ...p,
                name: 'Dream Villa',
                healthStatus: 'On Track',
                phase: 'Interior & Finishing',
                startDate: '01 Jan 2026',
                targetHandover: '30 Aug 2026',
                deadline: '30 Aug 2026',
                image: builderVillaBannerImg,
                description: 'Modern villa with premium interiors and vastu compliant design.',
                milestones: [
                  { name: 'Foundation', stage: 'Foundation', completed: true, status: 'Completed', date: '10 Feb 2026' },
                  { name: 'Structure', stage: 'Structure', completed: true, status: 'Completed', date: '25 Apr 2026' },
                  { name: 'Interior & Finishing', stage: 'Interior & Finishing', completed: false, status: 'In Progress', date: 'Target: 15 Jul 2026' },
                  { name: 'Painting', stage: 'Painting', completed: false, status: 'Pending', date: 'Target: 10 Aug 2026' },
                  { name: 'Final Handover', stage: 'Final Handover', completed: false, status: 'Pending', date: 'Target: 30 Aug 2026' }
                ]
              };
            }
            return p;
          });
        }
      } catch { }
    }
    return BUILDER_MY_PROJECTS;
  });

  // Selected project for Builder details view workspace
  const [selectedBuilderProjectId, setSelectedBuilderProjectId] = useState(() => {
    return localStorage.getItem('buildhub_selected_builder_project_id') || 'bp1';
  });

  useEffect(() => {
    if (selectedBuilderProjectId) {
      localStorage.setItem('buildhub_selected_builder_project_id', selectedBuilderProjectId);
    }
  }, [selectedBuilderProjectId]);

  const [customerRequests, setCustomerRequests] = useState(() => {
    const saved = localStorage.getItem('buildhub_customer_requests_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return BUILDER_CUSTOMER_REQUESTS;
  });

  const [myCustomers, setMyCustomers] = useState(() => {
    const saved = localStorage.getItem('buildhub_customers_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return INITIAL_CUSTOMERS;
  });

  const [buildersList, setBuildersList] = useState(() => {
    const saved = localStorage.getItem('buildhub_builders_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return INITIAL_BUILDERS;
  });

  const [workersList, setWorkersList] = useState(() => {
    const saved = localStorage.getItem('buildhub_workers_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return INITIAL_WORKERS;
  });

  // --- BUILDER BOOKINGS STATE (Find Builders Module) ---
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('buildhub_bookings_v5');
    return saved ? JSON.parse(saved) : [];
  });

  // --- CONSTRUCTION IMAGES GALLERY & PROGRESS UPDATES ---
  const [constructionImages, setConstructionImages] = useState(() => {
    const saved = localStorage.getItem('buildhub_construction_images_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return INITIAL_CONSTRUCTION_IMAGES;
  });

  const [progressUpdates, setProgressUpdates] = useState(() => {
    const saved = localStorage.getItem('buildhub_progress_updates_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return INITIAL_PROGRESS_UPDATES;
  });

  // --- PROJECT DOCUMENTS, BLUEPRINTS, RECEIPTS & BILLS ---
  const [projectDocuments, setProjectDocuments] = useState(() => {
    const saved = localStorage.getItem('buildhub_project_documents_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return INITIAL_PROJECT_DOCUMENTS;
  });

  // Modals & Popups
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Wipe old demo localStorage keys once on mount, sanitize conductor name, and ensure demo data is populated
  useEffect(() => {
    const oldDemoKeys = [
      'buildhub_auth_v4', 'buildhub_user_v4', 'buildhub_customer_project',
      'buildhub_customer_stages', 'buildhub_customer_updates', 'buildhub_customer_docs',
      'buildhub_customer_payments', 'buildhub_customer_messages', 'buildhub_customer_notifs',
      'buildhub_my_projects', 'buildhub_my_projects_v4'
    ];
    oldDemoKeys.forEach(k => localStorage.removeItem(k));

    // Clear any stale 'conductor' user name in localStorage
    const savedUserStr = localStorage.getItem('buildhub_user_v5');
    if (savedUserStr && savedUserStr.toLowerCase().includes('conductor')) {
      try {
        const parsed = JSON.parse(savedUserStr);
        parsed.name = parsed.role === 'Customer' ? 'Customer' : (parsed.role || 'Customer');
        localStorage.setItem('buildhub_user_v5', JSON.stringify(parsed));
      } catch { }
    }

    // If customer project is empty or "No Active Project", seed with comprehensive demo project
    const savedCustProj = localStorage.getItem('buildhub_customer_project_v5');
    if (!savedCustProj || savedCustProj.includes('"No Active Project"')) {
      localStorage.setItem('buildhub_customer_project_v5', JSON.stringify(CUSTOMER_PROJECT_DATA));
    }
  }, []);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('buildhub_auth_v5', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('buildhub_user_v5', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_project_v5', JSON.stringify(customerProject));
  }, [customerProject]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_stages_v5', JSON.stringify(customerStages));
  }, [customerStages]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_updates_v5', JSON.stringify(customerUpdates));
  }, [customerUpdates]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_docs_v5', JSON.stringify(customerDocuments));
  }, [customerDocuments]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_payments_v5', JSON.stringify(customerPayments));
  }, [customerPayments]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_messages_v5', JSON.stringify(customerMessages));
  }, [customerMessages]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_notifs_v5', JSON.stringify(customerNotifications));
  }, [customerNotifications]);

  useEffect(() => {
    localStorage.setItem('buildhub_my_projects_v5', JSON.stringify(myProjects));
  }, [myProjects]);

  useEffect(() => {
    localStorage.setItem('buildhub_customers_v5', JSON.stringify(myCustomers));
  }, [myCustomers]);

  useEffect(() => {
    localStorage.setItem('buildhub_builders_v5', JSON.stringify(buildersList));
  }, [buildersList]);

  useEffect(() => {
    localStorage.setItem('buildhub_workers_v5', JSON.stringify(workersList));
  }, [workersList]);

  useEffect(() => {
    localStorage.setItem('buildhub_customer_requests_v5', JSON.stringify(customerRequests));
  }, [customerRequests]);

  useEffect(() => {
    localStorage.setItem('buildhub_bookings_v5', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('buildhub_construction_images_v5', JSON.stringify(constructionImages));
  }, [constructionImages]);

  useEffect(() => {
    localStorage.setItem('buildhub_progress_updates_v5', JSON.stringify(progressUpdates));
  }, [progressUpdates]);

  useEffect(() => {
    localStorage.setItem('buildhub_project_documents_v5', JSON.stringify(projectDocuments));
  }, [projectDocuments]);

  // Reset or load complete demo data on demand
  const resetDemoData = () => {
    setCustomerProject(CUSTOMER_PROJECT_DATA);
    setCustomerStages(CUSTOMER_PROGRESS_STAGES);
    setCustomerUpdates(CUSTOMER_RECENT_UPDATES);
    setCustomerDocuments(CUSTOMER_DOCUMENTS);
    setCustomerPayments(CUSTOMER_PAYMENTS);
    setCustomerMessages(CUSTOMER_CHAT_MESSAGES);
    setCustomerNotifications(CUSTOMER_NOTIFICATIONS);
    setMyProjects(BUILDER_MY_PROJECTS);
    setMyCustomers(INITIAL_CUSTOMERS);
    setBuildersList(INITIAL_BUILDERS);
    setWorkersList(INITIAL_WORKERS);
    setCustomerRequests(BUILDER_CUSTOMER_REQUESTS);
    setProjectDocuments(INITIAL_PROJECT_DOCUMENTS);
    setConstructionImages(INITIAL_CONSTRUCTION_IMAGES);
    setProgressUpdates(INITIAL_PROGRESS_UPDATES);

    localStorage.setItem('buildhub_customer_project_v5', JSON.stringify(CUSTOMER_PROJECT_DATA));
    localStorage.setItem('buildhub_customer_stages_v5', JSON.stringify(CUSTOMER_PROGRESS_STAGES));
    localStorage.setItem('buildhub_customer_updates_v5', JSON.stringify(CUSTOMER_RECENT_UPDATES));
    localStorage.setItem('buildhub_customer_docs_v5', JSON.stringify(CUSTOMER_DOCUMENTS));
    localStorage.setItem('buildhub_customer_payments_v5', JSON.stringify(CUSTOMER_PAYMENTS));
    localStorage.setItem('buildhub_customer_messages_v5', JSON.stringify(CUSTOMER_CHAT_MESSAGES));
    localStorage.setItem('buildhub_customer_notifs_v5', JSON.stringify(CUSTOMER_NOTIFICATIONS));
    localStorage.setItem('buildhub_my_projects_v5', JSON.stringify(BUILDER_MY_PROJECTS));
    localStorage.setItem('buildhub_customers_v5', JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem('buildhub_builders_v5', JSON.stringify(INITIAL_BUILDERS));
    localStorage.setItem('buildhub_workers_v5', JSON.stringify(INITIAL_WORKERS));
    localStorage.setItem('buildhub_customer_requests_v5', JSON.stringify(BUILDER_CUSTOMER_REQUESTS));
    localStorage.setItem('buildhub_project_documents_v5', JSON.stringify(INITIAL_PROJECT_DOCUMENTS));
    localStorage.setItem('buildhub_construction_images_v5', JSON.stringify(INITIAL_CONSTRUCTION_IMAGES));
    localStorage.setItem('buildhub_progress_updates_v5', JSON.stringify(INITIAL_PROGRESS_UPDATES));
  };

  // ─── FIREBASE REALTIME SYNC ───
  useEffect(() => {
    // Seed initial demo data to Firestore if database is empty
    seedInitialDataIfEmpty().catch(() => { });

    // 1. Realtime listener for Firestore projects
    const unsubscribeProjects = subscribeToProjects((remoteProjects) => {
      if (remoteProjects && remoteProjects.length > 0) {
        setMyProjects(remoteProjects);
      }
    });

    // 2. Realtime listener for all registered Builders (Admin & Directory)
    const unsubscribeBuilders = subscribeToAllBuilders((remoteBuilders) => {
      if (remoteBuilders && remoteBuilders.length > 0) {
        setBuildersList(remoteBuilders);
      }
    });

    // 3. Realtime listener for all registered Customers (Admin oversight)
    const unsubscribeCustomers = subscribeToAllCustomers((remoteCustomers) => {
      if (remoteCustomers && remoteCustomers.length > 0) {
        setMyCustomers(remoteCustomers);
      }
    });

    // 4. Realtime listener for Customer project if one exists
    let unsubscribeCustomer = () => { };
    if (customerProject?.id) {
      unsubscribeCustomer = subscribeToCustomerProject(customerProject.id, (remoteCustProj) => {
        if (remoteCustProj) {
          setCustomerProject((prev) => ({ ...prev, ...remoteCustProj }));
          if (remoteCustProj.stages) {
            setCustomerStages(remoteCustProj.stages);
          }
        }
      });
    }

    // 5. Session restoration listener from Firebase Auth
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          const rawRole = (profile.role || '').toLowerCase();
          const canonicalRole = rawRole === 'builder' ? 'Builder' : (rawRole === 'admin' || rawRole === 'administrator' ? 'Administrator' : 'Customer');
          setCurrentUser((prev) => {
            const preservedRole = prev?.role || canonicalRole;
            return {
              ...prev,
              ...profile,
              role: preservedRole,
              uid: firebaseUser.uid,
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email
            };
          });
        }
      }
    });

    // 6. Realtime listener for Construction Images
    const unsubscribeImgs = subscribeToConstructionImages(null, (remoteImgs) => {
      if (remoteImgs && remoteImgs.length > 0) {
        setConstructionImages(remoteImgs);
      }
    });

    // 7. Realtime listener for Progress Updates
    const unsubscribeUpdates = subscribeToProgressUpdates(null, (remoteUpdates) => {
      if (remoteUpdates && remoteUpdates.length > 0) {
        setProgressUpdates(remoteUpdates);
      }
    });

    // 8. Realtime listener for Project Documents
    const unsubscribeDocs = subscribeToProjectDocuments(null, (remoteDocs) => {
      if (remoteDocs && remoteDocs.length > 0) {
        setProjectDocuments((prev) => {
          const existingIds = new Set(remoteDocs.map(d => d.id));
          const localOnly = prev.filter(d => !existingIds.has(d.id));
          return [...remoteDocs, ...localOnly];
        });
      }
    });

    return () => {
      unsubscribeProjects();
      unsubscribeBuilders();
      unsubscribeCustomers();
      unsubscribeCustomer();
      unsubscribeAuth();
      unsubscribeImgs();
      unsubscribeUpdates();
      unsubscribeDocs();
    };
  }, [customerProject?.id]);

  // Auth Helpers: Build userData from actual user input
  const loginAsRole = async (roleName, customData = {}) => {
    const enteredEmail = customData.email || '';
    const rawRole = (roleName || customData.role || '').toLowerCase();
    const canonicalRole = rawRole === 'builder' ? 'Builder' : (rawRole === 'admin' || rawRole === 'administrator' ? 'Administrator' : 'Customer');

    let resolvedName = customData.name || (enteredEmail ? enteredEmail.split('@')[0] : (roleName === 'Administrator' ? 'Administrator' : roleName));
    if (!resolvedName || resolvedName.toLowerCase() === 'conductor') {
      resolvedName = canonicalRole === 'Customer' ? 'Customer' : canonicalRole;
    }

    const userData = {
      name: resolvedName,
      email: enteredEmail,
      avatar: customData.avatar || (canonicalRole === 'Builder' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
      phone: customData.phone || '',
      city: customData.city || '',
      address: customData.address || '',
      company: customData.company || (canonicalRole === 'Builder' ? 'Vinay Builders & Infra' : ''),
      licenseNo: customData.licenseNo || (canonicalRole === 'Builder' ? 'BLD-2021-8849' : ''),
      unreadNotifications: 0,
      ...customData,
      role: canonicalRole // strictly enforce canonical role
    };

    setCurrentUser(userData);
    setIsAuthenticated(true);
    setCurrentTab(canonicalRole === 'Customer' ? 'find-builders' : 'dashboard');

    // Authenticate with Firebase Auth and sync user profile
    signInAsDemoRole(roleName, userData).then(({ profile }) => {
      if (profile && profile.uid) {
        setCurrentUser((prev) => ({
          ...prev,
          firebaseUid: profile.uid,
          uid: profile.uid,
          role: canonicalRole // preserve role strictly
        }));
      }
    }).catch(() => { });
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    localStorage.removeItem('buildhub_auth_v5');
    localStorage.removeItem('buildhub_user_v5');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthStep('role-selection');
  };

  // --- SOCIAL / OAUTH LOGIN HANDLERS ---
  const loginWithGoogle = async (targetRole = 'customer') => {
    const { user, profile } = await signInWithGoogle(targetRole);
    const isTargetBuilder = (targetRole || '').toLowerCase() === 'builder';
    const canonicalRole = isTargetBuilder
      ? 'Builder'
      : ((profile?.role || '').toLowerCase() === 'admin' ? 'Administrator' : 'Customer');

    const userData = {
      name: profile?.name || profile?.fullName || user.displayName || (canonicalRole === 'Builder' ? 'Builder Partner' : 'Customer'),
      email: user.email || profile?.email || '',
      avatar: user.photoURL || profile?.avatar || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      address: profile?.address || '',
      company: profile?.companyName || profile?.company || (canonicalRole === 'Builder' ? 'Vinay Builders & Infra' : ''),
      licenseNo: profile?.licenseNo || (canonicalRole === 'Builder' ? 'BLD-2021-8849' : ''),
      uid: user.uid,
      firebaseUid: user.uid,
      unreadNotifications: 0,
      ...profile,
      role: canonicalRole // strictly enforce canonical role
    };
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setCurrentTab(canonicalRole === 'Customer' ? 'find-builders' : 'dashboard');
    return { user, profile };
  };

  const loginWithMicrosoft = async (targetRole = 'customer') => {
    const { user, profile } = await signInWithMicrosoft(targetRole);
    const isTargetBuilder = (targetRole || '').toLowerCase() === 'builder';
    const canonicalRole = isTargetBuilder
      ? 'Builder'
      : ((profile?.role || '').toLowerCase() === 'admin' ? 'Administrator' : 'Customer');

    const userData = {
      name: profile?.name || profile?.fullName || user.displayName || (canonicalRole === 'Builder' ? 'Builder Partner' : 'Customer'),
      email: user.email || profile?.email || '',
      avatar: user.photoURL || profile?.avatar || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      address: profile?.address || '',
      company: profile?.companyName || profile?.company || (canonicalRole === 'Builder' ? 'Vinay Builders & Infra' : ''),
      licenseNo: profile?.licenseNo || (canonicalRole === 'Builder' ? 'BLD-2021-8849' : ''),
      uid: user.uid,
      firebaseUid: user.uid,
      unreadNotifications: 0,
      ...profile,
      role: canonicalRole // strictly enforce canonical role
    };
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setCurrentTab(canonicalRole === 'Customer' ? 'find-builders' : 'dashboard');
    return { user, profile };
  };

  // --- CUSTOMER ACTIONS ---
  const sendCustomerMessage = (text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'customer',
      senderName: currentUser.name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    };

    setCustomerMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const replies = [
        `Thanks for the update, Mr. ${currentUser.name.split(' ')[0]}. Our site supervisor has logged this and we are on track for the target timeline.`,
        'We will verify the material batch quality today and upload the inspection certificate to your documents folder.',
        'Noted! I will schedule a site visit walkthrough for you this Saturday morning at 11:00 AM.'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const builderReply = {
        id: 'mb_' + Date.now(),
        sender: 'builder',
        senderName: customerProject.builderName,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today'
      };
      setCustomerMessages((prev) => [...prev, builderReply]);
    }, 1500);
  };

  const makeCustomerPayment = (amountStr, desc) => {
    const newPay = {
      id: 'pay_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: desc || 'Milestone Construction Payment',
      amount: amountStr,
      status: 'Paid',
      method: 'Online NetBanking Clearance #88201',
      receiptId: `REC-2026-${Math.floor(100 + Math.random() * 900)}`
    };

    setCustomerPayments([newPay, ...customerPayments]);
  };

  const updateCustomerProfile = (updatedFields) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
  };

  // Add Builder / Project Helpers for Admin/Builder
  const addBuilder = (newBuilder) => {
    setBuildersList([newBuilder, ...buildersList]);
  };

  const addProject = (newProject) => {
    setMyProjects([newProject, ...myProjects]);
    addProjectToDb(newProject).catch(() => { });
  };

  const addCustomer = (newCustomer) => {
    setMyCustomers([newCustomer, ...myCustomers]);
  };

  const updateProjectProgress = (id, newProgress) => {
    setMyProjects(myProjects.map(p => p.id === id ? { ...p, progress: Number(newProgress) } : p));
    updateProjectProgressInDb(id, newProgress).catch(() => { });
  };

  const toggleProjectMilestone = (projectId, milestoneIdx) => {
    setMyProjects(prev => prev.map(p => {
      if (p.id === projectId && Array.isArray(p.milestones)) {
        const updatedMilestones = p.milestones.map((m, idx) => {
          if (idx === milestoneIdx) {
            const nextCompleted = !m.completed;
            return {
              ...m,
              completed: nextCompleted,
              status: nextCompleted ? 'Completed' : (idx === 2 ? 'In Progress' : 'Pending')
            };
          }
          return m;
        });
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...p, milestones: updatedMilestones, progress: newProgress };
      }
      return p;
    }));
  };

  const addProgressUpdate = async (updateData) => {
    const builderName = currentUser?.name || currentUser?.company || 'Tech Builders';
    const newUpdate = {
      id: 'pup_' + Date.now(),
      projectId: updateData.projectId || selectedBuilderProjectId || 'bp1',
      builderId: currentUser?.uid || 'b-tech',
      builderName,
      builderAvatar: currentUser?.avatar || builderAvatarImg,
      stage: updateData.stage || 'Interior & Finishing',
      title: updateData.title || `${updateData.stage || 'Interior & Finishing'} Stage Update`,
      description: updateData.description || '',
      progressPercentage: updateData.progressPercentage !== undefined ? Number(updateData.progressPercentage) : 72,
      date: updateData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      images: updateData.images || []
    };
    setProgressUpdates(prev => [newUpdate, ...prev]);
    saveProgressUpdateToFirestore(newUpdate).catch(err => {
      console.warn('Firestore progress update save notice:', err);
    });
    return newUpdate;
  };

  const updateCustomerRequestStatus = (id, newStatus) => {
    setCustomerRequests(customerRequests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    // Also update any matching booking
    setBookings(prev => prev.map(b => (b.id === id || b.requestId === id) ? { ...b, status: newStatus } : b));
    updateBookingStatusInFirestore(id, newStatus).catch(() => { });
  };

  // Place a new builder booking
  const placeBooking = async (bookingData) => {
    const bookingRefId = `BKG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingRefId,
      referenceNo: bookingRefId,
      customerId: currentUser.uid || 'cust_local',
      customerName: currentUser.name || bookingData.customerName || 'Sai Attada',
      customerEmail: currentUser.email || bookingData.customerEmail || 'sai.attada@buildhub.io',
      customerPhone: currentUser.phone || bookingData.customerPhone || '+91 98765 43210',
      builderId: bookingData.builderId,
      builderName: bookingData.builderName,
      builderEmail: bookingData.builderEmail || '',
      builderPhone: bookingData.builderPhone || '',
      builderAvatar: bookingData.builderAvatar || '',
      projectType: bookingData.projectType || 'Residential',
      location: bookingData.location || 'Hyderabad',
      area: Number(bookingData.area) || 1000,
      pricePerSqFt: Number(bookingData.pricePerSqFt) || 1800,
      estimatedCost: bookingData.estimatedCost || '₹18,00,000',
      estimatedCostNum: Number(bookingData.estimatedCostNum) || 1800000,
      requirements: bookingData.requirements || '',
      preferredDate: bookingData.preferredDate || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      contactMethod: bookingData.contactMethod || 'Phone Call',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // 1. Add to local bookings
    setBookings(prev => [newBooking, ...prev]);

    // 2. Add to customerRequests for Builder Portal visibility
    const leadItem = {
      id: bookingRefId,
      customer: newBooking.customerName,
      location: `${newBooking.location}, India`,
      projectType: newBooking.projectType,
      date: newBooking.date,
      budget: newBooking.estimatedCost,
      status: 'New',
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: newBooking.customerPhone,
      email: newBooking.customerEmail,
      area: `${newBooking.area} sq.ft`
    };
    setCustomerRequests(prev => [leadItem, ...prev]);

    // 3. Save to Firestore
    createBuilderBookingInFirestore(newBooking).catch(err => {
      console.warn('Could not sync booking to Firestore, kept locally:', err);
    });

    return newBooking;
  };

  // --- CONSTRUCTION IMAGES GALLERY ACTIONS ---
  const uploadConstructionImages = async ({
    projectId = customerProject?.id || 'cp_ramesh_1',
    stage = 'Interior & Finishing',
    description = '',
    uploadDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    images = [] // Array of base64 data URLs or image URLs
  }) => {
    const builderName = currentUser?.role?.toLowerCase() === 'builder'
      ? (currentUser?.name || currentUser?.company || 'Ravi Constructions')
      : (customerProject?.builderName || 'Ravi Constructions');
    const builderId = currentUser?.role?.toLowerCase() === 'builder'
      ? (currentUser?.uid || 'b-ravi')
      : (customerProject?.builderId || 'b-ravi');

    const createdImages = [];

    for (let i = 0; i < images.length; i++) {
      const imgData = {
        id: 'cimg_' + Date.now() + '_' + i,
        projectId,
        builderId,
        builderName,
        imageUrl: images[i],
        stage,
        description: description || `Construction progress verification for ${stage}.`,
        uploadDate,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      saveConstructionImageToFirestore(imgData).catch(err => {
        console.warn('Firestore image save notice:', err);
      });
      createdImages.push(imgData);
    }

    setConstructionImages(prev => [...createdImages, ...prev]);

    // Create a corresponding Progress Update timeline record
    const newProgressUpdate = {
      id: 'pup_' + Date.now(),
      projectId,
      builderId,
      builderName,
      builderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80',
      stage,
      title: `${stage} Stage Progress Verification`,
      description: description || `Uploaded ${images.length} construction verification photograph(s) for ${stage} stage inspection.`,
      progressPercentage: customerProject?.progress || 25,
      date: uploadDate,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      images: images
    };

    saveProgressUpdateToFirestore(newProgressUpdate).catch(err => {
      console.warn('Firestore progress update save notice:', err);
    });
    setProgressUpdates(prev => [newProgressUpdate, ...prev]);

    return createdImages;
  };

  const deleteConstructionImage = async (imageId) => {
    setConstructionImages(prev => prev.filter(img => img.id !== imageId));
    deleteConstructionImageFromFirestore(imageId).catch(err => {
      console.warn('Firestore image delete notice:', err);
    });
  };

  // --- PROJECT DOCUMENTS ACTIONS (House plans, receipts, bills, agreements) ---
  const uploadProjectDocument = async (docData) => {
    const builderName = currentUser?.role?.toLowerCase() === 'builder'
      ? (currentUser?.name || currentUser?.company || 'Ravi Constructions')
      : (customerProject?.builderName || 'Ravi Constructions');
    const builderId = currentUser?.role?.toLowerCase() === 'builder'
      ? (currentUser?.uid || 'b-ravi')
      : (customerProject?.builderId || 'b-ravi');

    const newDoc = {
      id: 'pdoc_' + Date.now(),
      projectId: docData.projectId || customerProject?.id || 'cp_ramesh_1',
      customerId: customerProject?.customerId || 'cust-1',
      builderId,
      builderName,
      title: docData.title || docData.name,
      name: docData.title || docData.name,
      category: docData.category || 'plans',
      version: docData.version || 'Version 1.0',
      date: docData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: docData.amount || '',
      status: docData.status || (docData.category === 'plans' ? 'GHMC Approved' : 'Verified'),
      description: docData.description || '',
      previewUrl: docData.previewUrl || '',
      size: '2.4 MB',
      createdAt: new Date().toISOString()
    };

    setProjectDocuments(prev => [newDoc, ...prev]);

    saveProjectDocumentToFirestore(newDoc).catch(err => {
      console.warn('Firestore document save notice:', err);
    });

    return newDoc;
  };

  const deleteProjectDocument = async (docId) => {
    setProjectDocuments(prev => prev.filter(d => d.id !== docId));
    deleteProjectDocumentFromFirestore(docId).catch(err => {
      console.warn('Firestore document delete notice:', err);
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        authStep,
        setAuthStep,
        isAuthenticated,
        currentUser,
        loginAsRole,
        logout,
        loginWithGoogle,
        loginWithMicrosoft,
        signInUser,
        registerUser,
        // Safe alias exports for all modules
        builders: buildersList || [],
        customers: myCustomers || [],
        workers: workersList || [],
        projects: myProjects || [],
        chats: [
          {
            id: 'chat1',
            name: 'Tech Builders (Residential Villa)',
            role: 'Lead Contractor',
            lastMessage: 'Interior work is ongoing on schedule.',
            time: '10:25 AM',
            unread: 1,
            avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80',
            messages: customerMessages
          }
        ],
        notifications: customerNotifications || [],
        sendMessage: sendCustomerMessage,
        // Customer Data & Functions
        customerProject,
        setCustomerProject,
        customerStages,
        customerUpdates,
        customerDocuments,
        customerPayments,
        customerMessages,
        customerNotifications,
        sendCustomerMessage,
        makeCustomerPayment,
        updateCustomerProfile,
        // Builder & Admin Data
        myProjects,
        setMyProjects,
        selectedBuilderProjectId,
        setSelectedBuilderProjectId,
        customerRequests,
        myCustomers,
        buildersList,
        workersList,
        totalCustomersCount: myCustomers?.length || 0,
        ongoingProjectsCount: myProjects.filter(p => p.status === 'Ongoing').length,
        completedProjectsCount: myProjects.filter(p => p.status === 'Completed').length,
        upcomingProjectsCount: myProjects.filter(p => p.status === 'Upcoming' || p.status === 'Planning').length,
        totalProjectsCount: myProjects.length,
        CHART_MONTHLY_OVERVIEW,
        // Modals & Navigation
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isCalendarOpen,
        setIsCalendarOpen,
        selectedProjectForDetail,
        setSelectedProjectForDetail,
        modalType,
        setModalType,
        editingItem,
        setEditingItem,
        searchQuery,
        setSearchQuery,
        addBuilder,
        addProject,
        addCustomer,
        updateProjectProgress,
        toggleProjectMilestone,
        addProgressUpdate,
        updateCustomerRequestStatus,
        updateBuilderApprovalStatus: updateBuilderApproval,
        updateCustomerAccountStatus: updateCustomerStatus,
        // Find Builders & Bookings
        bookings,
        placeBooking,
        updateBookingStatus: updateCustomerRequestStatus,
        findBuildersList: FIND_BUILDERS_DATA,
        // Construction Images Gallery & Progress Updates
        constructionImages,
        setConstructionImages,
        progressUpdates,
        setProgressUpdates,
        uploadConstructionImages,
        deleteConstructionImage,
        // Project Documents, House Plans, Receipts & Bills
        projectDocuments,
        setProjectDocuments,
        uploadProjectDocument,
        deleteProjectDocument,
        // Demo Data Control
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    return {};
  }
  return context;
}
