'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Coffee,
  MapPin,
  Music,
  Sparkles,
  Utensils,
} from 'lucide-react';

import { useStore } from '../../lib/store';
import { INITIAL_ATTENDEES, INITIAL_SESSIONS } from '../../lib/mockData';
import { Session, Person, SessionSpeakerInfo } from '../../types';
import { getCloudinaryProfileUrl } from '../../lib/profileImages';
import { getOptimizedAvatarUrl } from '../../lib/cloudinary';

const getSessionImage = (session: Session) => {
  const stageImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
  ];
  const charCode = session.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return stageImages[charCode % stageImages.length];
};

const parseTime = (timeRange: string) => {
  if (!timeRange) return { start: '', end: '' };
  if (timeRange.includes('–')) {
    const parts = timeRange.split('–');
    return { start: parts[0].trim(), end: parts[1].trim() };
  }
  if (timeRange.toLowerCase().includes('onwards')) {
    const parts = timeRange.split(' ');
    return { start: parts[0].trim(), end: 'Onwards' };
  }
  return { start: timeRange, end: '' };
};

const isBreakSession = (session: Session) => {
  const t = (session.title + ' ' + (session.track || '')).toLowerCase();
  return (
    t.includes('registration') ||
    t.includes('high tea') ||
    t.includes('lunch') ||
    t.includes('tea') ||
    t.includes('break') ||
    t.includes('cultural evening') ||
    t.includes('gala dinner')
  );
};

const getBreakIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('cultural') || t.includes('dinner') || t.includes('gala')) {
    return <Music className="w-4 h-4 text-[#B45309]" />;
  }
  if (t.includes('tea')) {
    return <Coffee className="w-4 h-4 text-[#B45309]" />;
  }
  return <Utensils className="w-4 h-4 text-[#B45309]" />;
};

export const DelegateSchedule: React.FC = () => {
  const router = useRouter();
  const {
    sessions,
    attendees,
    setAttendees,
    selectedPersonId,
    setSelectedPersonId,
    selectedSessionId,
    setSelectedSessionId,
    currentUser,
    scheduleSubTab,
    setScheduleSubTab,
    setActiveDelegateTab,
    sessionBackTab,
    setSessionBackTab,
  } = useStore();

  const [activeDay, setActiveDay] = useState<number>(1);
  const [detailSubTab, setDetailSubTab] = useState<'overview' | 'speaker'>('overview');

  // Helper to resolve all distinct speaker profiles for a session
  const resolveSessionSpeakers = (session: Session): Person[] => {
    if (!session) return [];

    const speakerPool = [...attendees, ...INITIAL_ATTENDEES];
    const initialSession =
      INITIAL_SESSIONS.find((s: Session) => s.id === session.id) ||
      INITIAL_SESSIONS.find((s: Session) => s.title.toLowerCase().trim() === session.title?.toLowerCase().trim());

    // Priority 1: If session has explicit panelists array (or matched in INITIAL_SESSIONS), resolve each panelist
    const panelistsList =
      (session.panelists && session.panelists.length > 0)
        ? session.panelists
        : (initialSession?.panelists && initialSession.panelists.length > 0)
        ? initialSession.panelists
        : [];

    if (panelistsList.length > 0) {
      return panelistsList.map((p: SessionSpeakerInfo, idx: number) => {
        // Find existing match in speaker pool by speakerId or name
        const matched = p.speakerId
          ? speakerPool.find((a) => a.id === p.speakerId)
          : speakerPool.find(
              (a) =>
                a.name.toLowerCase() === p.name.toLowerCase() ||
                a.name.toLowerCase().includes(p.name.toLowerCase()) ||
                p.name.toLowerCase().includes(a.name.toLowerCase())
            );

        const roleText = p.role || (panelistsList.length > 1 ? 'Panelist' : 'Keynote Speaker');

        if (matched) {
          return {
            ...matched,
            designation: p.designation || matched.designation,
            company: p.company || matched.company,
            panelRole: roleText,
            linkedin: p.linkedin || matched.linkedin,
            avatar: p.avatar || matched.avatar || getCloudinaryProfileUrl(p.name) || getCloudinaryProfileUrl(p.speakerId),
          };
        }

        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
          id: p.speakerId || `spk-panel-${session.id}-${slug || idx}`,
          name: p.name,
          designation: p.designation || 'Participant',
          company: p.company || 'MP Semiconductor Summit 2026',
          role: 'speaker',
          panelRole: roleText,
          bio: `${roleText} · ${p.name} (${p.designation || 'Speaker'}, ${p.company || 'MPSS 2026'}) participating in "${session.title}" at the Madhya Pradesh Semiconductor Summit 2026.`,
          interests: ['Semiconductors', 'Electronics Ecosystem'],
          skills: [],
          email: '',
          mobile: '',
          linkedin: p.linkedin || '',
          avatar: p.avatar || getCloudinaryProfileUrl(p.name) || getCloudinaryProfileUrl(p.speakerId),
          privacy: {
            preset: 'Connections Only',
            shareEmail: false,
            sharePhone: false,
            shareLinkedIn: Boolean(p.linkedin),
            shareTwitter: false,
          },
          checkedIn: true,
          ticketType: 'Speaker',
          registrationId: `#SPK-${slug.slice(0, 4).toUpperCase() || 'PNL'}`,
        } as Person;
      });
    }

    if (session.speakerIds && session.speakerIds.length > 0) {
      const matched = session.speakerIds
        .map((id) => speakerPool.find((a) => a.id === id))
        .filter(Boolean) as Person[];
      if (matched.length > 0) return matched;
    }

    if (session.speakerId) {
      const single = speakerPool.find((a) => a.id === session.speakerId);
      if (single) return [single];
    }

    if (session.speakerName) {
      const rawNames = session.speakerName
        .split(/[,&]/)
        .map((n) => n.trim().replace(/^and\s+/i, ''))
        .filter(
          (n) =>
            n.length > 1 &&
            !n.toLowerCase().includes('committee') &&
            !n.toLowerCase().includes('panel') &&
            !n.toLowerCase().includes('ensemble')
        );

      const found: Person[] = [];
      for (const name of rawNames) {
        const norm = name.toLowerCase();
        const match = speakerPool.find(
          (a) =>
            a.name.toLowerCase() === norm ||
            a.name.toLowerCase().includes(norm) ||
            norm.includes(a.name.toLowerCase())
        );
        if (match && !found.some((f) => f.id === match.id)) {
          found.push(match);
        }
      }
      if (found.length > 0) return found;

      if (
        !session.speakerName.toLowerCase().includes('committee') &&
        !session.speakerName.toLowerCase().includes('ensemble')
      ) {
        return [
          {
            id: session.speakerId || `spk-${session.id}`,
            name: session.speakerName,
            designation: session.speakerDesignation || 'Speaker',
            company: session.speakerCompany || 'MP Semiconductor Summit',
            role: 'speaker',
            bio: 'Keynote voice driving the Madhya Pradesh semiconductor ecosystem, national fab supply chain initiatives, and industry-academia collaborations.',
            interests: ['Semiconductors', 'Chip Design'],
            skills: [],
            email: '',
            mobile: '',
            privacy: {
              preset: 'Connections Only',
              shareEmail: true,
              sharePhone: true,
              shareLinkedIn: true,
              shareTwitter: false,
            },
            checkedIn: true,
            ticketType: 'Speaker',
            registrationId: session.speakerId ? `#SPK-${session.speakerId.slice(-4).toUpperCase()}` : `#SPK-${session.id.slice(-3).toUpperCase()}`,
          } as Person,
        ];
      }
    }

    return [];
  };

  // If a session is selected, render Session Detail Screen (excluding breaks/informational slots)
  const rawActiveSession = sessions.find((s: Session) => s.id === selectedSessionId && !isBreakSession(s));
  const activeSessionInitial = rawActiveSession
    ? INITIAL_SESSIONS.find((s: Session) => s.id === rawActiveSession.id) ||
      INITIAL_SESSIONS.find((s: Session) => s.title.toLowerCase().trim() === rawActiveSession.title?.toLowerCase().trim())
    : null;

  const activeSession = rawActiveSession
    ? {
        ...rawActiveSession,
        timeRange: activeSessionInitial?.timeRange || rawActiveSession.timeRange,
        room: activeSessionInitial?.room || rawActiveSession.room,
        track: activeSessionInitial?.track || rawActiveSession.track,
        panelists:
          (rawActiveSession.panelists && rawActiveSession.panelists.length > 0)
            ? rawActiveSession.panelists
            : (activeSessionInitial?.panelists || []),
        speakerName: activeSessionInitial?.speakerName || rawActiveSession.speakerName,
        takeaways:
          (activeSessionInitial?.takeaways && activeSessionInitial.takeaways.length > 0)
            ? activeSessionInitial.takeaways
            : rawActiveSession.takeaways,
        description: activeSessionInitial?.description || rawActiveSession.description,
      }
    : null;

  // Enhanced session list mapped with official INITIAL_SESSIONS definitions (memoized for 60fps scrolling)
  const enhancedSessions = useMemo(() => {
    return sessions.map((s: Session) => {
      const init =
        INITIAL_SESSIONS.find((is: Session) => is.id === s.id) ||
        INITIAL_SESSIONS.find((is: Session) => is.title.toLowerCase().trim() === s.title?.toLowerCase().trim());
      if (init) {
        return {
          ...s,
          timeRange: init.timeRange || s.timeRange,
          room: init.room || s.room,
          track: init.track || s.track,
          speakerName: init.speakerName || s.speakerName,
          panelists: (s.panelists && s.panelists.length > 0) ? s.panelists : init.panelists,
          takeaways: (init.takeaways && init.takeaways.length > 0) ? init.takeaways : s.takeaways,
          description: init.description || s.description,
        };
      }
      return s;
    });
  }, [sessions]);

  // Day filter counts
  const daySessions = enhancedSessions.filter((s) => s.day === activeDay);
  const daySavedSessions = daySessions.filter((s) => s.isBookmarked);
  const totalSavedSessions = enhancedSessions.filter((s) => s.isBookmarked);

  // Filter sessions by Day
  const filteredSessions = enhancedSessions.filter((s) => {
    return s.day === activeDay;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [selectedSessionId, activeDay]);

  // If viewing session detail
  if (activeSession) {
    const sessionSpeakers = resolveSessionSpeakers(activeSession);

    return (
      <div ref={scrollRef} className="flex-1 bg-[#F8F7F4] select-none overflow-y-auto pb-4">
        {/* Stage Hero Image Section */}
        <div
          className="relative h-[210px] w-full bg-cover bg-center overflow-hidden flex flex-col justify-between p-3 select-none"
          style={{
            backgroundImage: `url("${getSessionImage(activeSession)}")`,
          }}
        >
          {/* Multi-stop gradient overlay for crisp text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/35 pointer-events-none" />

          {/* Top Bar with round back button and bookmark */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedSessionId(null);
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/delegate/agenda/allsessions');
                }
              }}
              className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all shadow-md"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2">
              {activeSession.status === 'live' && (
                <span className="bg-[#DCFCE7] text-[#166534] font-bold text-[12px] px-3 py-1.5 rounded-lg shadow-sm tracking-wider uppercase backdrop-blur-sm animate-pulse">
                  LIVE NOW
                </span>
              )}
            </div>
          </div>

          {/* Bottom Title & Metadata */}
          <div className="relative z-10 pt-2">
            <p className="text-[12.5px] font-medium text-white/85 tracking-wide">
              {activeSession.timeRange} · {activeSession.room || 'Main Hall'} · {activeSession.track || 'Keynote'}
            </p>
            <h1 className="text-[20px] font-serif font-bold text-white tracking-tight leading-tight mt-1">
              {activeSession.title}
            </h1>
          </div>
        </div>

        {/* 2 Detail Tabs: Overview | Speaker(s) */}
        <div className="bg-white border-b border-[#E5E7EB] grid grid-cols-2 sticky top-0 z-20 shadow-xs">
          {[
            { id: 'overview' as const, label: 'Overview' },
            {
              id: 'speaker' as const,
              label: sessionSpeakers.length > 1 ? `Speakers · ${sessionSpeakers.length}` : 'Speaker',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setDetailSubTab(tab.id);
              }}
              className={`text-[13px] transition-all flex items-center justify-center relative ${
                detailSubTab === tab.id
                  ? 'font-bold text-[#111827]'
                  : 'font-medium text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <span className="relative py-3 inline-flex items-center justify-center">
                <span>{tab.label}</span>
                {detailSubTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#DC2626] rounded-full" />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="px-3 pt-3 space-y-3">
          {/* TAB 1: OVERVIEW */}
          {detailSubTab === 'overview' && (
            <div className="bg-white p-3.5 rounded-[16px] border border-[#E5E7EB] space-y-3 shadow-xs text-xs">
              <div>
                <h3 className="font-bold text-[#111827] mb-1.5 uppercase tracking-wider text-[11px]">
                  Session Abstract
                </h3>
                <p className="text-[#4B5563] leading-relaxed text-[12.5px]">
                  {activeSession.description}
                </p>
              </div>

              {activeSession.takeaways && activeSession.takeaways.length > 0 && (
                <div>
                  <h3 className="font-bold text-[#111827] mb-2 uppercase tracking-wider text-[11px]">
                    Key Takeaways & Highlights
                  </h3>
                  <ul className="space-y-1.5 text-[#4B5563] text-[12px]">
                    {activeSession.takeaways.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: SPEAKERS - CLICKABLE TO OPEN FULL PROFILE, NO DESCRIPTION IN LIST */}
          {detailSubTab === 'speaker' && (
            <div className="space-y-2.5">
              {sessionSpeakers.length === 0 ? (
                <div className="bg-white p-6 rounded-[16px] border border-[#E5E7EB] text-center text-xs text-[#6B7280]">
                  No speaker profiles published for this session.
                </div>
              ) : (
                sessionSpeakers.map((spk, idx) => (
                  <div
                    key={spk.id || idx}
                    onClick={() => {
                      if (spk.id) {
                        setSelectedPersonId(spk.id);
                      } else if (spk.name) {
                        setSelectedPersonId(spk.name);
                      }
                    }}
                    className="group bg-white p-3 sm:p-3.5 rounded-[16px] border border-[#E5E7EB] hover:border-[#DC2626]/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {spk.avatar ? (
                        <img
                          src={getOptimizedAvatarUrl(spk.avatar, 96)}
                          alt={spk.name}
                          loading="lazy"
                          decoding="async"
                          className="w-12 h-12 rounded-full object-cover border border-[#E5E7EB] flex-shrink-0 shadow-xs group-hover:ring-2 group-hover:ring-[#DC2626]/20 transition-all"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center font-bold text-[14px] text-[#DC2626] flex-shrink-0">
                          {spk.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[13.5px] sm:text-[14px] font-bold text-[#111827] group-hover:text-[#DC2626] transition-colors truncate">
                            {spk.name}
                          </h3>
                          {(() => {
                            const roleText = spk.panelRole || (sessionSpeakers.length > 1 ? 'Panelist' : 'Keynote Speaker');
                            const lower = roleText.toLowerCase();
                            let badgeStyle = 'text-[#475569] bg-[#F1F5F9] border-[#E2E8F0]';
                            if (lower.includes('moderator')) {
                              badgeStyle = 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]';
                            } else if (lower.includes('chair')) {
                              badgeStyle = 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]';
                            } else if (lower.includes('keynote')) {
                              badgeStyle = 'text-[#DC2626] bg-[#FEF2F2] border-[#FEE2E2]';
                            } else if (lower.includes('guest') || lower.includes('dignitary')) {
                              badgeStyle = 'text-[#047857] bg-[#ECFDF5] border-[#A7F3D0]';
                            }

                            return (
                              <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${badgeStyle}`}>
                                {roleText}
                              </span>
                            );
                          })()}
                        </div>

                        <p className="text-[11.5px] sm:text-[12px] text-[#4B5563] mt-0.5 truncate">
                          {spk.designation} · <strong className="text-[#111827]">{spk.company}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Right side: Arrow to open profile */}
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#DC2626] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // SCHEDULE LIST VIEW
  return (
    <div className="flex-1 min-h-0 h-full bg-[#F8F7F4] select-none flex flex-col overflow-hidden">
      {/* Fixed Top Section: Header, Toggle, and Day Selector */}
      <div className="shrink-0 bg-[#F8F7F4] px-3 z-10 border-b border-[#E5E7EB]">
        {/* Header section matching reference mockup */}
        <div className="pt-4 pb-1">
          <p className="text-[10.5px] uppercase tracking-[0.15em] text-[#6B6B6B] font-semibold mb-0.5">
            MPSS26 · PROGRAMME
          </p>
          <h1 className="text-[32px] font-sans font-semibold text-[#181818] tracking-tight leading-none">
            Schedule
          </h1>
        </div>

        {/* Day Selector Tabs: Day 1: Oct 23, 2026 | Day 2: Oct 24, 2026 */}
        <div className="-mx-3 px-3 pt-2">
          <div className="flex -mb-[1px]">
            {[
              { day: 1, label: 'Day 1: Oct 23, 2026' },
              { day: 2, label: 'Day 2: Oct 24, 2026' },
            ].map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`flex-1 py-2.5 px-2 text-center text-[13px] transition-all whitespace-nowrap border-b-2 flex items-center justify-center gap-1.5 ${
                  activeDay === d.day
                    ? 'text-[#0F172A] font-bold border-[#DC2626]'
                    : 'text-[#6B7280] hover:text-[#0F172A] font-medium border-transparent'
                }`}
              >
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Scroll Container */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-2">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-[16px] border border-[#E5E7EB] shadow-xs my-4">
            <p className="text-[13px] font-bold text-[#111827]">
              No matching sessions found
            </p>
            <p className="text-[11.5px] text-[#6B7280] mt-1 leading-relaxed max-w-[260px] mx-auto">
              Try adjusting your search query or pick a different summit day.
            </p>
          </div>
        ) : (
          <div className="relative">
            {filteredSessions.map((session, index) => {
              const time = parseTime(session.timeRange);
              const isSpecialBreak = isBreakSession(session);

              return (
                <div key={session.id} className="relative flex items-stretch group">
                  {/* Left Column: Fixed, compact time column (50px width so mobile session box has maximal room) */}
                  <div className="w-[50px] sm:w-[56px] flex-shrink-0 text-right pr-2 pt-2.5 select-none">
                    <span className="block text-[12.5px] font-bold text-[#0F172A] leading-tight font-mono tracking-tight">
                      {time.start}
                    </span>
                    {time.end && (
                      <span className="block text-[10.5px] font-medium text-[#64748B] leading-tight font-mono mt-0.5">
                        {time.end}
                      </span>
                    )}
                  </div>

                  {/* Center Column: Continuous Timeline Line & Dot Node */}
                  <div className="w-3.5 flex-shrink-0 flex flex-col items-center relative">
                    {/* Top half line */}
                    <div
                      className={`w-[1.5px] flex-1 ${
                        index === 0 ? 'bg-transparent' : 'bg-[#CBD5E1]'
                      }`}
                    />
                    {/* Node circle */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 my-0.5 border border-white shadow-xs ${
                        isSpecialBreak
                          ? 'bg-[#B45309] ring-2 ring-[#FEF3C7]'
                          : 'bg-[#64748B]'
                      }`}
                    />
                    {/* Bottom half line */}
                    <div
                      className={`w-[1.5px] flex-1 ${
                        index === filteredSessions.length - 1 ? 'bg-transparent' : 'bg-[#CBD5E1]'
                      }`}
                    />
                  </div>

                  {/* Right Column: SESSION BOX (flex-1 min-w-0 guarantees full visibility on mobile viewports!) */}
                  <div className={`flex-1 min-w-0 pl-2.5 sm:pl-3 pt-0.5 ${index === filteredSessions.length - 1 ? 'pb-1' : 'pb-3'}`}>
                    {isSpecialBreak ? (
                      /* Special Break / Dining / Non-Session Row (Non-clickable) */
                      <div
                        className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[16px] p-3 shadow-xs flex items-center gap-2.5 cursor-default select-none"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0">
                          {getBreakIcon(session.title)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[12.5px] font-bold text-[#92400E] leading-tight truncate">
                            {session.title}
                          </h4>
                          <p className="text-[10.5px] text-[#B45309] mt-0.5 truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{session.room || 'Brilliant Convention Centre'}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Crisp White Session Box */
                      <div
                        onClick={() => {
                          router.push(`/delegate/agenda/sessions/${session.id}`);
                        }}
                        className="bg-white rounded-[16px] border border-[#E2E8F0] hover:border-[#CBD5E1] p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
                      >
                        {/* Top row: Track tag */}
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md truncate max-w-[200px]">
                            {session.track || 'Session'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] leading-snug group-hover:text-[#DC2626] transition-colors">
                          {session.title}
                        </h3>

                        {/* Speaker / Panelist Summary */}
                        {session.speakerName && (
                          <p className="mt-1 text-[11px] text-[#475569] font-medium line-clamp-1">
                            {session.speakerName}
                          </p>
                        )}

                        {/* Location / Room */}
                        {session.room && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-[#64748B]">
                            <MapPin className="w-3 h-3 text-[#94A3B8] flex-shrink-0" />
                            <span className="truncate">{session.room}</span>
                          </div>
                        )}

                        {/* Bottom row: Live badge / info & Details button */}
                        <div className="mt-2 pt-1.5 border-t border-[#F1F5F9] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {session.status === 'live' && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                LIVE NOW
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-bold text-[#475569] group-hover:text-[#DC2626] flex items-center gap-0.5 ml-auto">
                            Details{' '}
                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
