'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Search,
  Star,
} from 'lucide-react';

import { useStore } from '../../lib/store';
import { Person } from '../../types';
import { getCloudinaryProfileUrl } from '../../lib/profileImages';
import { getOptimizedAvatarUrl, optimizeCloudinaryUrl } from '../../lib/cloudinary';

export const DelegateSpeakers: React.FC = () => {
  const router = useRouter();
  const {
    attendees,
    currentUser,
    connections,
    connectWith,
    setSelectedPersonId,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  const isConnected = (personId: string) => connections.some((c) => c.personId === personId && c.status === 'connected');
  const isPending = (personId: string) => connections.some((c) => c.personId === personId && c.status === 'pending');

  const getInitials = (name: string) => {
    const clean = name.replace(/^(dr\.|prof\.|maj\.\s*gen\.?|mr\.|mrs\.|ms\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return name.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getSpeakerRoleBadge = (speaker: Person) => {
    if (speaker.panelRole) return speaker.panelRole;
    if (speaker.id === 'speaker-dr-mohan-yadav') return 'Chief Guest';
    if (speaker.id === 'speaker-ashok-barnwal' || speaker.id === 'speaker-prof-rajeev-dixit') return 'Dignitary';
    if (speaker.priority && speaker.priority >= 4 && speaker.priority <= 7) return 'Keynote Speaker';
    if (speaker.id === 'speaker-anand-kumar-panel') return 'Round Table Panelist';
    return 'Panelist';
  };

  const speakers = useMemo(() => {
    return attendees
      .filter((p) => p.role === 'speaker' && p.id !== currentUser.id)
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  }, [attendees, currentUser.id]);

  const cmSpeaker = useMemo(() => {
    return speakers.find(
      (s) =>
        s.id === 'speaker-dr-mohan-yadav' ||
        s.name.toLowerCase().includes('mohan yadav') ||
        s.designation.toLowerCase().includes('chief minister')
    );
  }, [speakers]);

  const filteredSpeakers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return speakers;
    return speakers.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(q) ||
        speaker.company.toLowerCase().includes(q) ||
        speaker.designation.toLowerCase().includes(q)
    );
  }, [speakers, searchQuery]);

  const isCmMatched = useMemo(() => {
    if (!cmSpeaker) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      cmSpeaker.name.toLowerCase().includes(q) ||
      cmSpeaker.company.toLowerCase().includes(q) ||
      cmSpeaker.designation.toLowerCase().includes(q)
    );
  }, [cmSpeaker, searchQuery]);

  const otherSpeakers = useMemo(() => {
    return filteredSpeakers.filter((s) => s.id !== cmSpeaker?.id);
  }, [filteredSpeakers, cmSpeaker]);

  return (
    <div className="flex-1 min-h-0 bg-[#F8F7F4] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="pt-4 pb-3 px-4 bg-[#F8F7F4] flex-shrink-0 z-10">
        <div className="flex items-center gap-3 mb-3.5">
          <button 
            onClick={() => router.push('/delegate/home')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#181818] transition-active active:scale-95 shadow-xs border border-gray-100"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#181818] tracking-tight">Speakers</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search speakers by name, company, or role..."
            className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 text-[13px] focus:ring-2 focus:ring-[#B51F32]/20 focus:border-[#B51F32] outline-none text-[#181818] placeholder-[#9CA3AF] shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Grid of 2 Columns */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 no-scrollbar">
        <div className="flex items-center justify-between mt-3 mb-2.5 px-0.5">
          <p className="text-[13.5px] font-bold text-[#1F2937]">
            {filteredSpeakers.length === speakers.length
              ? `${speakers.length} Official Speakers`
              : `${filteredSpeakers.length} Speakers`}
          </p>
          <span className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE]">
            MP Semiconductor Summit
          </span>
        </div>

        {/* Featured Chief Minister Card on First Line */}
        {cmSpeaker && isCmMatched && (
          <div
            onClick={() => setSelectedPersonId(cmSpeaker.id)}
            className="bg-white rounded-[16px] p-2.5 mb-3 border border-[#E5E7EB] hover:border-gray-400 transition-all shadow-xs cursor-pointer flex flex-col group select-none"
          >
            <div className="relative w-full h-[120px] rounded-[12px] overflow-hidden bg-slate-50 shrink-0 border border-slate-200/70 flex items-center justify-center">
              {cmSpeaker.avatar || getCloudinaryProfileUrl(cmSpeaker.name) ? (
                <>
                  <img
                    src={getOptimizedAvatarUrl(cmSpeaker.avatar || getCloudinaryProfileUrl(cmSpeaker.name), 260)}
                    alt={cmSpeaker.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                  <div className="avatar-fallback w-full h-full hidden items-center justify-center bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1] text-[#1E293B] font-bold text-2xl select-none">
                    {getInitials(cmSpeaker.name)}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1] text-[#1E293B] font-bold text-2xl select-none">
                  {getInitials(cmSpeaker.name)}
                </div>
              )}

              {cmSpeaker.linkedin ? (
                <a
                  href={
                    cmSpeaker.linkedin.startsWith('http')
                      ? cmSpeaker.linkedin
                      : `https://${cmSpeaker.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 w-[24px] h-[24px] rounded-[6px] bg-white shadow-xs border border-white/80 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10"
                  title="View LinkedIn Profile"
                >
                  <div className="w-[15px] h-[15px] rounded-[2.5px] bg-[#0A66C2] flex items-center justify-center text-white text-[9.5px] font-bold leading-none font-sans">
                    in
                  </div>
                </a>
              ) : null}
            </div>

            {/* Speaker Info - Centered */}
            <div className="mt-2 pb-0.5 text-center px-1">
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-[14px] font-bold text-[#111827] leading-tight tracking-tight">
                  {cmSpeaker.name}
                </h3>
                <span className="text-[9.5px] font-bold text-[#B51F32] bg-[#FDF2F2] border border-[#FCA5A5]/40 px-2 py-0.5 rounded-full shrink-0">
                  Chief Guest
                </span>
              </div>
              <p className="text-[11.5px] text-[#6B7280] leading-snug mt-0.5">
                {cmSpeaker.designation} · {cmSpeaker.company}
              </p>
            </div>
          </div>
        )}

        {/* Remaining Speakers in 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3">
          {otherSpeakers.map((speaker) => {
            return (
              <div
                key={speaker.id}
                onClick={() => setSelectedPersonId(speaker.id)}
                className="bg-white rounded-[16px] p-2.5 border border-[#E5E7EB] hover:border-gray-400 transition-all shadow-xs cursor-pointer flex flex-col justify-between group select-none"
              >
                <div>
                  {/* Photo with LinkedIn Badge */}
                  <div className="relative w-full h-[126px] rounded-[12px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                    {speaker.avatar || getCloudinaryProfileUrl(speaker.name) ? (
                      <>
                        <img
                          src={getOptimizedAvatarUrl(speaker.avatar || getCloudinaryProfileUrl(speaker.name), 220)}
                          alt={speaker.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }}
                        />
                        <div className="avatar-fallback w-full h-full hidden items-center justify-center bg-[#181818] text-white font-bold text-2xl select-none">
                          {getInitials(speaker.name)}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#181818] text-white font-bold text-2xl select-none">
                        {getInitials(speaker.name)}
                      </div>
                    )}

                    {/* LinkedIn Badge at Top Right (if linkedin profile exists) */}
                    {speaker.linkedin ? (
                      <a
                        href={
                          speaker.linkedin.startsWith('http')
                            ? speaker.linkedin
                            : `https://${speaker.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 w-[24px] h-[24px] rounded-[6px] bg-white shadow-xs border border-white/80 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10"
                        title="View LinkedIn Profile"
                      >
                        <div className="w-[15px] h-[15px] rounded-[2.5px] bg-[#0A66C2] flex items-center justify-center text-white text-[9.5px] font-bold leading-none font-sans">
                          in
                        </div>
                      </a>
                    ) : null}
                  </div>

                  {/* Speaker Info */}
                  <div className="mt-2 px-0.5 min-w-0">
                    <h4 className="text-[13.5px] font-bold text-[#111827] leading-tight truncate tracking-tight">
                      {speaker.name}
                    </h4>
                    <p className="text-[11px] text-[#6B7280] leading-snug truncate mt-0.5">
                      {speaker.designation} · {speaker.company}
                    </p>
                    <div className="mt-1.5 flex items-center">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] truncate max-w-full">
                        {getSpeakerRoleBadge(speaker)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!isCmMatched && otherSpeakers.length === 0 && (
          <div className="py-12 text-center text-[#6B7280] text-[13px]">
            No speakers found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
