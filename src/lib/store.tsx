'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  EventMetadata,
  Person,
  Connection,
  Lead,
  Product,
  Session,
  Question,
    ExhibitorStats,
  DemoRole,
  QuestionStatus,
  LeadStatus,
  PrivacyConsent,
  InterestedVisitor
} from '../types';
import {
  INITIAL_EVENT,
  CURRENT_USER,
  INITIAL_ATTENDEES,
  INITIAL_CONNECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_LEADS,
  INITIAL_SESSIONS,
  INITIAL_QUESTIONS,
    INITIAL_EXHIBITORS,
  INITIAL_INTERESTED_VISITORS
} from './mockData';
import { api } from './api';
import { getStoredProfileImage } from './profileImageStorage';
import { getOfficialBoothNumber } from './officialBooths';


export const isPlaceholderDesignation = (d?: string): boolean => {
  if (!d) return true;
  const lower = d.trim().toLowerCase();
  return lower === 'delegate' || lower === 'summit attendee' || lower === 'attendee' || lower === 'participant';
};

export const isPlaceholderCompany = (c?: string): boolean => {
  if (!c) return true;
  const lower = c.trim().toLowerCase();
  return lower === 'summit attendee' || lower === 'mpss 2026' || lower === 'mpss26' || lower === 'delegate' || lower === 'attendee';
};

export const EMPTY_USER: Person = {
  id: '',
  name: '',
  designation: '',
  company: '',
  role: 'delegate',
  bio: '',
  interests: [],
  skills: [],
  email: '',
  mobile: '',
  linkedin: '',
  twitter: '',
  avatar: '',
  privacy: {
    preset: 'Connections Only',
    shareEmail: true,
    sharePhone: true,
    shareLinkedIn: true,
    shareTwitter: false,
  },
  checkedIn: false,
  registrationId: '',
  ticketType: 'Delegate',
};

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation & Role
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  activeDelegateTab: 'home' | 'people' | 'scan' | 'focus' | 'schedule' | 'profile' | 'companies' | 'company_detail' | 'edit_profile' | 'ai_recommendations' | 'speakers' | 'map' | 'sponsors' | 'support';
  setActiveDelegateTab: (tab: 'home' | 'people' | 'scan' | 'focus' | 'schedule' | 'profile' | 'companies' | 'company_detail' | 'edit_profile' | 'ai_recommendations' | 'speakers' | 'map' | 'sponsors' | 'support') => void;
  viewSavedPeopleOnly: boolean;
  setViewSavedPeopleOnly: (v: boolean) => void;
  viewSavedCompaniesOnly: boolean;
  setViewSavedCompaniesOnly: (v: boolean) => void;
  scheduleSubTab: 'all' | 'saved';
  setScheduleSubTab: (tab: 'all' | 'saved') => void;
  scheduleDay: number;
  setScheduleDay: (day: number) => void;
  savedCompanyIds: string[];
  savedPeopleIds: string[];
  toggleSavePerson: (id: string) => void;
  toggleSaveCompany: (id: string) => void;
  activeExhibitorTab: 'home' | 'leads' | 'scan' | 'products' | 'more';
  setActiveExhibitorTab: (tab: 'home' | 'leads' | 'scan' | 'products' | 'more') => void;
  activeOrganizerTab: 'overview' | 'attendees' | 'exhibitors' | 'sessions' | 'reports' | 'settings';
  setActiveOrganizerTab: (tab: 'overview' | 'attendees' | 'exhibitors' | 'sessions' | 'reports' | 'settings') => void;

  // View frame mode for Delegate/Exhibitor (centered 430px frame vs full)
  viewMode: 'frame' | 'responsive';
  setViewMode: (mode: 'frame' | 'responsive') => void;

  // Connectivity & Offline Sync Demo
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleConnectivity: () => void;
  isSyncing: boolean;
  syncPendingCount: number;
  lastSyncedTime: string;

  // Access Flow state
  hasAccessConfirmed: boolean;
  setHasAccessConfirmed: (confirmed: boolean) => void;
  isSessionLoading: boolean;
  triggerAccessFlow: (prefillMobile?: string, prefillEventId?: string) => void;
  logout: () => void;
  resetUserState: () => void;

  // Selected details
  selectedPersonId: string | null;
  setSelectedPersonId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string | null) => void;
  sessionBackTab: 'home' | 'schedule' | 'profile' | 'ai_recommendations';
  setSessionBackTab: (tab: 'home' | 'schedule' | 'profile' | 'ai_recommendations') => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;

  // Core Data
  event: EventMetadata;
  currentUser: Person;
  setCurrentUser: React.Dispatch<React.SetStateAction<Person>>;
  updateCurrentUser: (data: Partial<Person>) => Promise<void>;
  updateAttendee: (id: string, data: Partial<Person>) => Promise<void>;
  updateCurrentUserPrivacy: (newPrivacy: Partial<PrivacyConsent>) => void;
  attendees: Person[];
  setAttendees: React.Dispatch<React.SetStateAction<Person[]>>;
  connections: Connection[];
  leads: Lead[];
  products: Product[];
  sessions: Session[];
  questions: Question[];
  exhibitors: ExhibitorStats[];
  interestedVisitors: InterestedVisitor[];

  // Mutators & Business Logic
  connectWith: (personId: string, source?: 'direct' | 'qr_scan' | 'recommended') => { success: boolean; alreadyConnected: boolean };
  disconnectFrom: (personId: string) => void;
  acceptConnectionRequest: (personId: string) => void;
  ignoreConnectionRequest: (personId: string) => void;
  saveLead: (leadData: Omit<Lead, 'id' | 'capturedAt'>) => void | Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus, notes?: string) => void | Promise<void>;
  enquireProduct: (productId: string) => void;
  toggleSaveProduct: (productId: string) => void;
  updateProduct: (productId: string, data: Partial<Product>) => void | Promise<void>;
  deleteProduct: (productId: string) => void | Promise<void>;
  addProduct: (productData: Omit<Product, 'id'>) => void | Promise<void>;
  submitQuestion: (sessionId: string, text: string, isAnonymous: boolean) => void | Promise<void>;
  upvoteQuestion: (questionId: string) => Promise<{ success: boolean; message?: string }> | { success: boolean; message?: string };
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => void;
  toggleCheckIn: (personId: string) => void;
  addWalkInAttendee: (data: { name: string; email: string; mobile: string; company: string; designation: string; ticketType: string }) => void;
  importAttendeesMock: (count: number) => void;
  toggleBookmarkSession: (sessionId: string) => void;
  updateSession: (sessionId: string, data: Partial<Session>) => void;
  createSession: (sessionData: Omit<Session, 'id' | 'attendanceCount' | 'questionsCount'>) => void;
  deleteSession: (sessionId: string) => void;
  recordScan: () => void;
  resetAllData: () => void;

  // Notification Toast
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'eventsphere_mpss26_store_v14';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [role, setRoleState] = useState<DemoRole>('delegate');
  const [activeDelegateTab, setActiveDelegateTab] = useState<'home' | 'people' | 'scan' | 'focus' | 'schedule' | 'profile' | 'companies' | 'company_detail' | 'edit_profile' | 'ai_recommendations' | 'speakers' | 'map' | 'sponsors' | 'support'>('home');
  const [viewSavedPeopleOnly, setViewSavedPeopleOnly] = useState<boolean>(false);
  const [viewSavedCompaniesOnly, setViewSavedCompaniesOnly] = useState<boolean>(false);
  const [scheduleSubTab, setScheduleSubTab] = useState<'all' | 'saved'>('all');
  const [scheduleDay, setScheduleDay] = useState<number>(2);
  const [activeExhibitorTab, setActiveExhibitorTab] = useState<'home' | 'leads' | 'scan' | 'products' | 'more'>('home');
  const [activeOrganizerTab, setActiveOrganizerTab] = useState<'overview' | 'attendees' | 'exhibitors' | 'sessions' | 'reports' | 'settings'>('overview');
  const [viewMode, setViewMode] = useState<'frame' | 'responsive'>('frame');

  // Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncPendingCount, setSyncPendingCount] = useState<number>(0);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('12:40 PM');

  // Access Flow - Direct Instant Entry (No login required)
  const [hasAccessConfirmed, setHasAccessConfirmed] = useState<boolean>(true);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(false);

  // Selected Detail Views
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionBackTab, setSessionBackTab] = useState<'home' | 'schedule' | 'profile' | 'ai_recommendations'>('schedule');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>([]);
  const [savedPeopleIds, setSavedPeopleIds] = useState<string[]>([]);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Show Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2800);
  }, []);

  const toggleSaveCompany = useCallback((id: string) => {
    setSavedCompanyIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }, []);

  const toggleSavePerson = useCallback((id: string) => {
    setSavedPeopleIds((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]));
  }, []);

  // Entities - Ready-to-use summit content
  const [event, setEvent] = useState<EventMetadata>(INITIAL_EVENT);
  const [currentUser, setCurrentUser] = useState<Person>(CURRENT_USER);
  const [attendees, setAttendees] = useState<Person[]>(INITIAL_ATTENDEES);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [exhibitors, setExhibitors] = useState<ExhibitorStats[]>(INITIAL_EXHIBITORS);
  const [interestedVisitors, setInterestedVisitors] = useState<InterestedVisitor[]>(INITIAL_INTERESTED_VISITORS);

  // Clear user-specific session state (called on logout, 401, or prior to new login)
  const clearUserSessionState = useCallback(() => {
    setCurrentUser(EMPTY_USER);
    setSavedPeopleIds([]);
    setSavedCompanyIds([]);
    setConnections([]);
    setLeads([]);
    setInterestedVisitors([]);
    setSelectedPersonId(null);
    setSelectedProductId(null);
    setSelectedSessionId(null);
    setSelectedCompanyId(null);
    setViewSavedPeopleOnly(false);
    setViewSavedCompaniesOnly(false);
    setScheduleSubTab('all');
    setActiveDelegateTab('home');
    setRoleState('delegate');
    setSessions((prev) => prev.map((s) => ({ ...s, isBookmarked: false })));
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        upvotedBy: [],
      }))
    );
  }, []);

  const resetUserState = useCallback(() => {
    clearUserSessionState();
  }, [clearUserSessionState]);

  // Load from localStorage on mount if previously customized
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('eventsphere_mpss26_store_v13');
        } catch {
          // ignore
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.currentUser) {
            if (parsed.currentUser.id === 'att-hari-gupta' || parsed.currentUser.name === 'Hari Gupta') {
              localStorage.removeItem(STORAGE_KEY);
              setCurrentUser(CURRENT_USER);
            } else {
              setCurrentUser((prev) => ({ ...prev, ...parsed.currentUser }));
            }
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setHasAccessConfirmed(true);
      setIsSessionLoading(false);
    }
  }, []);

  // Save to localStorage when state changes (strictly user-scoped)
  useEffect(() => {
    if (!currentUser?.id) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentUser, role }));
      } catch {
        // ignore
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [currentUser, role]);

  // Set role without touching tokens - role is determined by demo/view state
  const setRole = useCallback((newRole: DemoRole) => {
    setRoleState(newRole);
  }, []);

  // Centralized logout
  const logout = useCallback(() => {
    api.auth.logout();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('eventsphere_')) {
            localStorage.removeItem(key);
          }
        });
      } catch {
        // ignore
      }
    }
    clearUserSessionState();
    setHasAccessConfirmed(false);
    showToast('Logged out successfully', 'info');
  }, [clearUserSessionState, showToast]);

  // Listen for unauthorized 401 events from ApiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      // Do not log out active delegates on transient background auth issues
      if (role === 'delegate' && hasAccessConfirmed) {
        console.warn('Ignoring unauthorized event for active delegate session');
        return;
      }
      logout();
      showToast('Session expired. Please log in again.', 'error');
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('eventsphere:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('eventsphere:unauthorized', handleUnauthorized);
    }
  }, [logout, showToast, role, hasAccessConfirmed]);

  // Connectivity toggle
  const toggleConnectivity = useCallback(() => {
    if (isOnline) {
      setIsOnline(false);
      showToast('Switched to Offline Mode · Sync pending for new actions', 'info');
    } else {
      setIsSyncing(true);
      showToast('Syncing offline data with GetMyEvent server...', 'info');
      setTimeout(() => {
        setIsSyncing(false);
        setIsOnline(true);
        setSyncPendingCount(0);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncedTime(timeStr);
        // Mark pending leads as synced
        setLeads((prev) => prev.map((l) => ({ ...l, syncStatus: 'synced' })));
        showToast('Synced ✓ All data up to date', 'success');
      }, 1200);
    }
  }, [isOnline, showToast]);

  // Trigger Access Flow
  const triggerAccessFlow = useCallback(() => {
    setHasAccessConfirmed(false);
    setActiveDelegateTab('home');
  }, []);

  // Update current user profile in local state
  const updateCurrentUser = useCallback(async (data: Partial<Person>) => {
    setCurrentUser((prev) => {
      const updatedUser = { ...prev, ...data };
      setAttendees((att) => att.map((a) => (a.id === prev.id ? updatedUser : a)));
      return updatedUser;
    });
    showToast('Profile saved successfully ✓', 'success');
  }, [showToast]);

  // Update specific attendee info (used by organizer console)
  const updateAttendee = useCallback(async (id: string, data: Partial<Person>) => {
    if (role !== 'organizer') {
      showToast('Only organizers can modify attendee records', 'error');
      return;
    }
    // 1. Optimistic update
    setAttendees((att) => att.map((a) => (a.id === id ? { ...a, ...data } : a)));
    if (id === currentUser.id) {
      setCurrentUser((prev) => ({ ...prev, ...data }));
    }

    // 2. Persist to MySQL database via organizer API
    try {
      const res = await api.organizer.updateAttendee(id, data);
      if (res) {
        setAttendees((att) => att.map((a) => {
          if (a.id === id) {
            return {
              ...a,
              ...data,
              name: res.name || a.name,
              designation: res.designation || a.designation,
              company: res.company || a.company,
              bio: res.bio || a.bio,
              email: res.email || a.email,
              mobile: res.mobile || a.mobile,
              avatar: res.avatar || a.avatar,
              linkedin: res.linkedin || a.linkedin,
              twitter: res.twitter || a.twitter,
              interests: (res.interests && res.interests.length > 0) ? res.interests : a.interests,
              skills: (res.skills && res.skills.length > 0) ? res.skills : a.skills,
            };
          }
          return a;
        }));
      }
      showToast('Attendee record updated successfully', 'success');
    } catch (err: any) {
      console.warn('Backend updateAttendee failed:', err);
      showToast(err.message || 'Failed to update attendee', 'error');
    }
  }, [role, currentUser.id, showToast]);

  const updateCurrentUserPrivacy = useCallback((newPrivacy: Partial<PrivacyConsent>) => {
    setCurrentUser((prev) => {
      const updatedPrivacy = { ...prev.privacy, ...newPrivacy };
      // Also update in attendees list
      setAttendees((att) =>
        att.map((a) => (a.id === prev.id ? { ...a, privacy: updatedPrivacy } : a))
      );
      return {
        ...prev,
        privacy: updatedPrivacy,
      };
    });
    showToast('Privacy preferences updated ✓', 'success');
  }, [showToast]);

  // Record a QR scan
  const recordScan = useCallback(() => {
    setEvent((prev) => ({
      ...prev,
      totalScans: prev.totalScans + 1,
    }));
  }, []);

  // Connect with person (Delegate)
  const connectWith = useCallback((personId: string, source: 'direct' | 'qr_scan' | 'recommended' = 'direct') => {
    const existing = connections.find((c) => c.personId === personId);
    const targetPerson = attendees.find((a) => a.id === personId);
    if (!targetPerson) return { success: false, alreadyConnected: false };

    if (existing) {
      return { success: true, alreadyConnected: true };
    }

    const tempConnId = `conn-${Date.now()}`;
    const newConnection: Connection = {
      id: tempConnId,
      personId: targetPerson.id,
      personName: targetPerson.name,
      designation: targetPerson.designation,
      company: targetPerson.company,
      avatar: targetPerson.avatar,
      status: source === 'qr_scan' ? 'connected' : 'pending',
      type: 'sent',
      source,
      connectedAt: 'Just now',
    };

    setConnections((prev) => [newConnection, ...prev]);

    // Update global event metrics
    setEvent((prev) => ({
      ...prev,
      totalConnections: prev.totalConnections + 1,
      totalScans: source === 'qr_scan' ? prev.totalScans + 1 : prev.totalScans,
    }));

    if (!isOnline) {
      setSyncPendingCount((c) => c + 1);
    }

    showToast(`Sent connection request to ${targetPerson.name} ✓`, 'success');

    api.attendees.requestConnection(personId)
      .then((res) => {
        if (res && res.id) {
          setConnections((prev) => prev.map((c) => c.id === tempConnId ? { ...c, id: res.id, status: res.status || c.status } : c));
        }
      })
      .catch((err) => {
        console.warn('Backend requestConnection error:', err);
      });

    return { success: true, alreadyConnected: false };
  }, [connections, attendees, isOnline, showToast]);

  // Disconnect from person
  const disconnectFrom = useCallback(async (personId: string) => {
    const existing = connections.find((c) => c.personId === personId);
    if (!existing) return;

    setConnections((prev) => prev.filter((c) => c.personId !== personId));

    const targetPerson = attendees.find((a) => a.id === personId);
    if (targetPerson) {
      showToast(`Disconnected from ${targetPerson.name}`, 'info');
    }

    setEvent((prev) => ({
      ...prev,
      totalConnections: Math.max(0, prev.totalConnections - 1),
    }));

    try {
      await api.attendees.disconnect(existing.id || personId);
    } catch (err: any) {
      console.warn('Backend disconnect error:', err);
    }
  }, [connections, attendees, showToast]);

  const acceptConnectionRequest = useCallback(async (personId: string) => {
    const conn = connections.find((c) => c.personId === personId && c.type === 'received' && c.status === 'pending');
    setConnections((prev) => prev.map((c) => 
      c.personId === personId && c.type === 'received' && c.status === 'pending'
        ? { ...c, status: 'connected', connectedAt: 'Just now' }
        : c
    ));
    showToast('Connection request accepted', 'success');

    if (conn && conn.id) {
      try {
        await api.attendees.acceptConnection(conn.id);
      } catch (err: any) {
        console.warn('Backend acceptConnection error:', err);
      }
    }
  }, [connections, showToast]);

  const ignoreConnectionRequest = useCallback((personId: string) => {
    setConnections(prev => prev.filter(c => !(c.personId === personId && c.type === 'received' && c.status === 'pending')));
  }, []);

  // Save Lead (Exhibitor)
  const saveLead = useCallback(async (leadData: Omit<Lead, 'id' | 'capturedAt'>) => {
    const tempLeadId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      id: tempLeadId,
      capturedAt: 'Just now',
      syncStatus: isOnline ? 'synced' : 'pending',
    };

    setLeads((prev) => {
      const existingIndex = prev.findIndex((l) => l.personId === leadData.personId);
      if (existingIndex >= 0) {
        const copy = [...prev];
        const existing = copy[existingIndex];
        const updatedLead: Lead = {
          ...existing,
          ...leadData,
          status: leadData.status,
          notes: leadData.notes || existing.notes,
          capturedAt: 'Just now',
          syncStatus: isOnline ? 'synced' : 'pending',
        };
        copy.splice(existingIndex, 1);
        return [updatedLead, ...copy];
      } else {
        return [newLead, ...prev];
      }
    });

    // Update matching exhibitor stats
    const currentCompany = (currentUser.company || '').toLowerCase();
    setExhibitors((prev) =>
      prev.map((ex) =>
        (currentCompany && ex.company.toLowerCase() === currentCompany) || (currentUser.boothNumber && ex.booth === currentUser.boothNumber)
          ? { ...ex, leads: ex.leads + 1 }
          : ex
      )
    );

    // Update event metrics
    setEvent((prev) => ({
      ...prev,
      totalScans: prev.totalScans + 1,
    }));

    if (!isOnline) {
      setSyncPendingCount((c) => c + 1);
      showToast(`Lead saved for ${leadData.name} (Sync pending)`, 'info');
      return;
    }

    try {
      const res = await api.exhibitor.captureLead({
        attendeeId: leadData.personId,
        status: leadData.status,
        source: leadData.source,
        notes: leadData.notes,
        interests: leadData.interests,
      });
      if (res && res.id) {
        setLeads((prev) =>
          prev.map((l) => (l.id === tempLeadId ? { ...l, id: res.id, syncStatus: 'synced' } : l))
        );
      }
      showToast(`Lead saved for ${leadData.name} as "${leadData.status}" ✓`, 'success');
    } catch (err: any) {
      console.warn('Backend captureLead error:', err);
      // Rollback on server failure
      setLeads((prev) => prev.filter((l) => l.id !== tempLeadId));
      showToast(err.message || `Failed to save lead for ${leadData.name}`, 'error');
    }
  }, [currentUser, isOnline, showToast]);

  // Update Lead Status
  const updateLeadStatus = useCallback(async (leadId: string, status: LeadStatus, notes?: string) => {
    const prevLead = leads.find((l) => l.id === leadId);
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status, ...(notes !== undefined ? { notes } : {}) }
          : l
      )
    );

    try {
      await api.exhibitor.updateLead(leadId, { status, notes });
      showToast(`Lead updated to ${status} ✓`, 'success');
    } catch (err: any) {
      console.warn('Backend updateLead error:', err);
      // Rollback on server failure
      if (prevLead) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? prevLead : l)));
      }
      showToast(err.message || `Failed to update lead status`, 'error');
    }
  }, [leads, showToast]);

  // Enquire product
  const enquireProduct = useCallback(async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Increment enquiries and interested visitors count
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              enquiries: p.enquiries + 1,
              interestedVisitorsCount: p.interestedVisitorsCount + 1,
            }
          : p
      )
    );

    // Update matching exhibitor booth stats
    const productCompany = (product.company || '').toLowerCase();
    setExhibitors((prev) =>
      prev.map((ex) =>
        (productCompany && ex.company.toLowerCase() === productCompany) || (product.booth && ex.booth === product.booth)
          ? { ...ex, enquiries: ex.enquiries + 1 }
          : ex
      )
    );

    // Add currentUser to interested visitors (respecting privacy consent!)
    const alreadyVisitor = interestedVisitors.find(
      (v) => v.productId === productId && v.personId === currentUser.id
    );

    if (!alreadyVisitor) {
      const newVisitor: InterestedVisitor = {
        id: `v-${Date.now()}`,
        productId,
        personId: currentUser.id,
        name: currentUser.name,
        designation: currentUser.designation,
        company: currentUser.company,
        email: currentUser.privacy.shareEmail ? currentUser.email : 'Not shared',
        mobile: currentUser.privacy.sharePhone ? currentUser.mobile : 'Not shared',
        linkedin: (currentUser.privacy.shareLinkedIn && currentUser.linkedin) ? currentUser.linkedin : 'Not shared',
        interactionType: 'enquiry',
        timestamp: 'Just now',
      };
      setInterestedVisitors((prev) => [newVisitor, ...prev]);
    }

    try {
      await api.exhibitors.enquireProduct(productId);
    } catch (err: any) {
      console.warn('Backend enquireProduct error:', err);
    }

    showToast(`Enquiry submitted for ${product.name} ✓`, 'success');
  }, [products, interestedVisitors, currentUser, showToast]);

  // Save/Bookmark Product
  const toggleSaveProduct = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextState = !p.isSaved;
          showToast(nextState ? `Saved ${p.name} to your items` : `Removed ${p.name} from saved`, 'info');
          return { ...p, isSaved: nextState };
        }
        return p;
      })
    );
  }, [showToast]);

  // Update product (Exhibitor)
  const updateProduct = useCallback(async (productId: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...data } : p))
    );
    showToast('Product updated successfully ✓', 'success');

    try {
      await api.exhibitor.updateProduct(productId, {
        name: data.name,
        tagline: data.tagline,
        category: data.category,
        overview: data.overview,
        features: data.features,
        benefits: data.benefits,
        useCases: data.useCases,
        imageUrl: data.image,
        websiteUrl: data.resources?.websiteUrl,
        brochureUrl: data.resources?.brochureUrl,
      });
    } catch (err: any) {
      console.warn('Backend updateProduct error:', err);
    }
  }, [showToast]);

  // Delete product (Exhibitor)
  const deleteProduct = useCallback(async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from showcase ✓', 'info');

    try {
      await api.exhibitor.deleteProduct(productId);
    } catch (err: any) {
      console.warn('Backend deleteProduct error:', err);
    }
  }, [showToast]);

  // Add product (Exhibitor)
  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    const tempId = `prod-truechip-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: tempId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('New product added to showcase ✓', 'success');

    try {
      const res = await api.exhibitor.createProduct({
        name: productData.name,
        tagline: productData.tagline,
        category: productData.category,
        overview: productData.overview || productData.tagline,
        features: productData.features || [],
        benefits: productData.benefits || [],
        useCases: productData.useCases || [],
        imageUrl: productData.image,
        websiteUrl: productData.resources?.websiteUrl,
        brochureUrl: productData.resources?.brochureUrl,
      });
      if (res && res.id) {
        setProducts((prev) => prev.map((p) => p.id === tempId ? { ...p, id: res.id } : p));
      }
    } catch (err: any) {
      console.warn('Backend createProduct error:', err);
    }
  }, [showToast]);

  // Submit Q&A Question
  const submitQuestion = useCallback(async (sessionId: string, text: string, isAnonymous: boolean) => {
    if (!text.trim()) return;

    let createdId = `q-${Date.now()}`;
    try {
      const res = await api.sessions.submitQuestion(sessionId, text.trim(), isAnonymous);
      if (res && res.id) {
        createdId = res.id;
      }
    } catch (err: any) {
      console.warn('Backend submitQuestion error:', err);
    }

    const newQuestion: Question = {
      id: createdId,
      sessionId,
      text: text.trim(),
      authorName: isAnonymous ? 'Anonymous' : currentUser.name,
      authorId: isAnonymous ? 'usr-anon' : currentUser.id,
      isAnonymous,
      status: 'Submitted',
      upvotes: 0,
      upvotedBy: [],
      createdAt: 'Just now',
    };

    setQuestions((prev) => [newQuestion, ...prev]);

    // Update session questions count
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, questionsCount: s.questionsCount + 1 } : s
      )
    );

    showToast('Question submitted ✓', 'success');
  }, [currentUser, showToast]);

  // Upvote Question (optimistic local state)
  const upvoteQuestion = useCallback(async (questionId: string) => {
    const q = questions.find((item) => item.id === questionId);
    if (!q) return { success: false };

    const userId = currentUser.id || 'usr-delegate';
    const hasUpvoted = q.upvotedBy.includes(userId);
    const newUpvotes = hasUpvoted ? Math.max(0, q.upvotes - 1) : q.upvotes + 1;
    const newUpvotedBy = hasUpvoted
      ? q.upvotedBy.filter((id) => id !== userId)
      : [...q.upvotedBy, userId];

    setQuestions((prev) =>
      prev.map((item) =>
        item.id === questionId
          ? {
              ...item,
              upvotes: newUpvotes,
              upvotedBy: newUpvotedBy,
            }
          : item
      )
    );
    showToast(!hasUpvoted ? 'Question upvoted ✓' : 'Upvote removed', 'info');
    return { success: true };
  }, [questions, currentUser.id, showToast]);

  // Update question status (Moderator action)
  const updateQuestionStatus = useCallback((questionId: string, status: QuestionStatus) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status } : q))
    );
    showToast(`Question marked as ${status} ✓`, 'info');
  }, [showToast]);

  
  // Toggle check-in (Organizer)
  const toggleCheckIn = useCallback(async (personId: string) => {
    let nextCheckedInState = false;
    setAttendees((prev) =>
      prev.map((p) => {
        if (p.id === personId) {
          const next = !p.checkedIn;
          nextCheckedInState = next;
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...p,
            checkedIn: next,
            checkInTime: next ? `12 Feb 2026, ${nowStr}` : undefined,
          };
        }
        return p;
      })
    );

    setEvent((prev) => {
      const target = attendees.find((a) => a.id === personId);
      const isCurrentlyCheckedIn = target?.checkedIn;
      return {
        ...prev,
        totalCheckedIn: isCurrentlyCheckedIn ? Math.max(0, prev.totalCheckedIn - 1) : prev.totalCheckedIn + 1,
      };
    });

    if (!isOnline) {
      setSyncPendingCount((c) => c + 1);
    }

    showToast('Check-in status updated ✓', 'success');

    // Call backend API when connected
    try {
      const res = await api.organizer.toggleCheckIn(personId);
      if (res) {
        setAttendees((prev) =>
          prev.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  checkedIn: res.checkedIn,
                  checkInTime: res.checkInTime ? new Date(res.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
                }
              : p
          )
        );
      }
    } catch (err: any) {
      console.warn('Backend toggleCheckIn error:', err);
    }
  }, [attendees, isOnline, showToast]);

  // Add Walk-in Attendee (Organizer)
  const addWalkInAttendee = useCallback(async (data: {
    name: string;
    email: string;
    mobile: string;
    company: string;
    designation: string;
    ticketType: string;
  }) => {
    let newPerson: Person | null = null;
    try {
      const res = await api.organizer.registerWalkIn({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        company: data.company,
        designation: data.designation,
        ticketType: data.ticketType,
        category: 'DELEGATE',
      });
      if (res && res.id) {
        newPerson = {
          id: res.id,
          name: res.name,
          email: res.email,
          mobile: res.mobile,
          company: res.company || data.company,
          designation: res.designation || data.designation,
          ticketType: res.ticketType || data.ticketType,
          role: 'delegate',
          bio: res.bio || 'On-site walk-in registered delegate.',
          interests: res.interests || ['General Tech', 'Networking'],
          skills: res.skills || [],
          linkedin: res.linkedin || '',
          registrationId: res.registrationId || `REG-MPSS26-${Math.floor(1000 + Math.random() * 9000)}`,
          checkedIn: res.checkedIn ?? true,
          checkInTime: '23 Oct 2026, Just now',
          privacy: {
            preset: 'Connections Only',
            shareEmail: true,
            sharePhone: false,
            shareLinkedIn: true,
          },
        };
      }
    } catch (err: any) {
      console.warn('Backend registerWalkIn error:', err);
    }

    if (!newPerson) {
      newPerson = {
        id: `usr-walkin-${Date.now()}`,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        company: data.company,
        designation: data.designation,
        ticketType: data.ticketType,
        role: 'delegate',
        bio: 'On-site walk-in registered delegate.',
        interests: ['General Tech', 'Networking'],
        skills: [],
        linkedin: '',
        registrationId: `REG-MPSS26-${Math.floor(1000 + Math.random() * 9000)}`,
        checkedIn: true,
        checkInTime: '23 Oct 2026, Just now',
        privacy: {
          preset: 'Connections Only',
          shareEmail: true,
          sharePhone: false,
          shareLinkedIn: true,
        },
      };
    }

    setAttendees((prev) => [newPerson!, ...prev]);
    setEvent((prev) => ({
      ...prev,
      totalRegistered: prev.totalRegistered + 1,
      totalCheckedIn: prev.totalCheckedIn + 1,
    }));

    showToast(`Walk-in attendee ${data.name} checked in ✓`, 'success');
  }, [showToast]);

  // Import mock CSV attendees
  const importAttendeesMock = useCallback((count: number) => {
    setEvent((prev) => ({
      ...prev,
      totalRegistered: prev.totalRegistered + count,
    }));
    showToast(`Successfully imported ${count} registrations from CSV ✓`, 'success');
  }, [showToast]);

  // Toggle bookmark session (purely local state)
  const toggleBookmarkSession = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const next = !s.isBookmarked;
          return { ...s, isBookmarked: next };
        }
        return s;
      })
    );
  }, []);

  // Update session
  const updateSession = useCallback((sessionId: string, data: Partial<Session>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...data } : s))
    );
    showToast('Session updated successfully ✓', 'success');

    if (data.status && Object.keys(data).length === 1) {
      api.organizer.updateSessionStatus(sessionId, data.status).catch((err) => {
        console.warn('Backend updateSessionStatus error:', err);
      });
    } else {
      const existing = sessions.find((s) => s.id === sessionId);
      if (existing) {
        const merged = { ...existing, ...data };
        api.organizer.updateSession(sessionId, {
          title: merged.title,
          track: merged.track,
          day: merged.day,
          timeRange: merged.timeRange,
          room: merged.room,
          status: merged.status,
          speakerName: merged.speakerName,
          speakerDesignation: merged.speakerDesignation,
          speakerCompany: merged.speakerCompany,
          description: merged.description,
          takeaways: merged.takeaways || [],
        }).catch((err) => {
          console.warn('Backend updateSession error:', err);
        });
      }
    }
  }, [sessions, showToast]);

  // Create session
  const createSession = useCallback(async (sessionData: Omit<Session, 'id' | 'attendanceCount' | 'questionsCount'>) => {
    try {
      const res = await api.organizer.createSession({
        title: sessionData.title,
        track: sessionData.track,
        day: sessionData.day,
        timeRange: sessionData.timeRange,
        room: sessionData.room,
        status: sessionData.status,
        speakerName: sessionData.speakerName,
        speakerDesignation: sessionData.speakerDesignation,
        speakerCompany: sessionData.speakerCompany,
        description: sessionData.description,
        takeaways: sessionData.takeaways || [],
      });
      const assignedId = (res && res.id) ? res.id : `sess-${Date.now()}`;
      const newSession: Session = {
        ...sessionData,
        id: assignedId,
        attendanceCount: 0,
        questionsCount: 0,
      };
      setSessions((prev) => [newSession, ...prev]);
      showToast('Session created successfully ✓', 'success');
    } catch (err: any) {
      console.warn('Backend createSession error:', err);
      showToast(err?.message || 'Failed to create session on server', 'error');
    }
  }, [showToast]);

  // Delete session
  const deleteSession = useCallback(async (sessionId: string) => {
    const previous = sessions;
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    try {
      await api.organizer.deleteSession(sessionId);
      showToast('Session deleted ✓', 'info');
    } catch (err: any) {
      console.warn('Backend deleteSession error:', err);
      setSessions(previous);
      showToast(err?.message || 'Failed to delete session on server', 'error');
    }
  }, [sessions, showToast]);

  // Reset all data
  const resetAllData = useCallback(() => {
    setEvent(INITIAL_EVENT);
    setCurrentUser(CURRENT_USER);
    setAttendees(INITIAL_ATTENDEES);
    setConnections(INITIAL_CONNECTIONS);
    setLeads(INITIAL_LEADS);
    setProducts(INITIAL_PRODUCTS);
    setSessions(INITIAL_SESSIONS);
    setQuestions(INITIAL_QUESTIONS);
    setExhibitors(INITIAL_EXHIBITORS);
    setInterestedVisitors(INITIAL_INTERESTED_VISITORS);
    setRoleState('delegate');
    setHasAccessConfirmed(false);
    setIsOnline(true);
    setSyncPendingCount(0);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Demo data reset to initial state ✓', 'info');
  }, [showToast]);

  const value = useMemo<StoreContextType>(() => ({
    role,
    setRole,
    activeDelegateTab,
    viewSavedPeopleOnly,
    setViewSavedPeopleOnly,
    viewSavedCompaniesOnly,
    setViewSavedCompaniesOnly,
    scheduleSubTab,
    setScheduleSubTab,
    scheduleDay,
    setScheduleDay,
    savedCompanyIds,
    savedPeopleIds,
    toggleSavePerson,
    toggleSaveCompany,
    setActiveDelegateTab,
    activeExhibitorTab,
    setActiveExhibitorTab,
    activeOrganizerTab,
    setActiveOrganizerTab,
    viewMode,
    setViewMode,
    isOnline,
    setIsOnline,
    toggleConnectivity,
    isSyncing,
    syncPendingCount,
    lastSyncedTime,
    hasAccessConfirmed,
    setHasAccessConfirmed,
    isSessionLoading,
    triggerAccessFlow,
    logout,
    resetUserState,
    selectedPersonId,
    setSelectedPersonId,
    selectedProductId,
    setSelectedProductId,
    selectedSessionId,
    setSelectedSessionId,
    sessionBackTab,
    setSessionBackTab,
    selectedCompanyId,
    setSelectedCompanyId,
    event,
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    updateAttendee,
    updateCurrentUserPrivacy,
    attendees,
    setAttendees,
    connections,
    leads,
    products,
    sessions,
    questions,
    exhibitors,
    interestedVisitors,
    connectWith,
    disconnectFrom,
    acceptConnectionRequest,
    ignoreConnectionRequest,
    saveLead,
    updateLeadStatus,
    enquireProduct,
    toggleSaveProduct,
    updateProduct,
    deleteProduct,
    addProduct,
    submitQuestion,
    upvoteQuestion,
    updateQuestionStatus,
    toggleCheckIn,
    addWalkInAttendee,
    importAttendeesMock,
    toggleBookmarkSession,
    updateSession,
    createSession,
    deleteSession,
    recordScan,
    resetAllData,
    toast,
    showToast,
  }), [
    role,
    setRole,
    activeDelegateTab,
    viewSavedPeopleOnly,
    viewSavedCompaniesOnly,
    scheduleSubTab,
    scheduleDay,
    setScheduleDay,
    savedCompanyIds,
    savedPeopleIds,
    toggleSavePerson,
    toggleSaveCompany,
    activeExhibitorTab,
    activeOrganizerTab,
    viewMode,
    isOnline,
    toggleConnectivity,
    isSyncing,
    syncPendingCount,
    lastSyncedTime,
    hasAccessConfirmed,
    isSessionLoading,
    triggerAccessFlow,
    logout,
    resetUserState,
    selectedPersonId,
    selectedProductId,
    selectedSessionId,
    sessionBackTab,
    selectedCompanyId,
    event,
    currentUser,
    updateCurrentUser,
    updateAttendee,
    updateCurrentUserPrivacy,
    attendees,
    connections,
    leads,
    products,
    sessions,
    questions,
    exhibitors,
    interestedVisitors,
    connectWith,
    disconnectFrom,
    acceptConnectionRequest,
    ignoreConnectionRequest,
    saveLead,
    updateLeadStatus,
    enquireProduct,
    toggleSaveProduct,
    updateProduct,
    deleteProduct,
    addProduct,
    submitQuestion,
    upvoteQuestion,
    updateQuestionStatus,
    toggleCheckIn,
    addWalkInAttendee,
    importAttendeesMock,
    toggleBookmarkSession,
    updateSession,
    createSession,
    deleteSession,
    recordScan,
    resetAllData,
    toast,
    showToast,
  ]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
