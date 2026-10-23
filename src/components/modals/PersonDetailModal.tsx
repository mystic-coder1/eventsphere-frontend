'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../../lib/store';
import { INITIAL_ATTENDEES, INITIAL_SESSIONS } from '../../lib/mockData';
import { Person } from '../../types';
import { X, Mail, Phone, Linkedin, Twitter, Star, Pencil, Save } from 'lucide-react';
import { getProfileAvatar, getCloudinaryProfileUrl, hasRealProfilePhoto } from '../../lib/profileImages';

const getInitials = (name: string) => {
  const clean = name.replace(/^(dr\.|prof\.|maj\.\s*gen\.?|mr\.|mrs\.|ms\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const PersonDetailModal: React.FC = () => {
  const {
    selectedPersonId,
    setSelectedPersonId,
    attendees,
    sessions,
    updateAttendee,
    currentUser,
    role,
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    designation: '',
    company: '',
    bio: '',
    email: '',
    mobile: '',
    linkedin: '',
    twitter: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPersonId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedPersonId]);



  const normalizedSearch = (selectedPersonId || '').toLowerCase().trim();

  // Multi-tier resolution:
  const person: Person | null = useMemo(() => {
    if (!selectedPersonId) return null;

    return (
    attendees.find((a) => a.id === selectedPersonId) ||
    INITIAL_ATTENDEES.find((a) => a.id === selectedPersonId) ||
    (selectedPersonId.includes('rochak')
      ? attendees.find((a) => a.id.includes('rochak')) || INITIAL_ATTENDEES.find((a) => a.id.includes('rochak'))
      : null) ||
    attendees.find((a) => a.name.toLowerCase() === normalizedSearch) ||
    INITIAL_ATTENDEES.find((a) => a.name.toLowerCase() === normalizedSearch) ||
    attendees.find((a) => a.id.toLowerCase().includes(normalizedSearch)) ||
    INITIAL_ATTENDEES.find((a) => a.id.toLowerCase().includes(normalizedSearch)) ||
    (() => {
      // 1. Find matching panelist across sessions
      const allSessions = [...(sessions || []), ...INITIAL_SESSIONS];
      for (const s of allSessions) {
        if (s.panelists && s.panelists.length > 0) {
          const p = s.panelists.find(
            (item, idx) =>
              (item.speakerId && item.speakerId === selectedPersonId) ||
              `spk-panel-${s.id}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}` === selectedPersonId ||
              `spk-panel-${s.id}-${idx}` === selectedPersonId ||
              item.name.toLowerCase().trim() === normalizedSearch
          );
          if (p) {
            return {
              id: selectedPersonId,
              name: p.name,
              avatar: (p as any).avatar || getCloudinaryProfileUrl(p.name) || getCloudinaryProfileUrl(selectedPersonId),
              designation: p.designation || 'Panelist',
              company: p.company || 'Madhya Pradesh Semiconductor Summit 2026',
              role: 'speaker' as const,
              panelRole: p.role || 'Panelist',
              bio: `${p.role ? p.role + ' · ' : ''}${p.name} (${p.designation || 'Speaker'}, ${p.company || 'MPSS 2026'}) participating in "${s.title}" at the Madhya Pradesh Semiconductor Summit 2026.`,
              interests: ['Semiconductors', 'Electronics Ecosystem'],
              skills: [],
              email: 'Not listed',
              mobile: 'Not listed',
              linkedin: p.linkedin || '',
              privacy: {
                preset: 'Connections Only' as const,
                shareEmail: false,
                sharePhone: false,
                shareLinkedIn: Boolean(p.linkedin),
                shareTwitter: false,
              },
              checkedIn: true,
              ticketType: 'Speaker',
              registrationId: `#SPK-${selectedPersonId.slice(-4).toUpperCase()}`,
              relevanceScore: 95,
            } as Person;
          }
        }
      }

      // 2. Find matching session speaker
      for (const s of allSessions) {
        const matches =
          s.speakerId === selectedPersonId ||
          `spk-${s.id}` === selectedPersonId ||
          (s.speakerIds && s.speakerIds.includes(selectedPersonId)) ||
          s.speakerName?.toLowerCase() === normalizedSearch ||
          (s.speakerName && normalizedSearch.includes(s.speakerName.toLowerCase()));

        if (matches) {
          return {
            id: selectedPersonId,
            name: s.speakerName,
            avatar: (s as any).avatar || (s as any).speakerAvatar || getCloudinaryProfileUrl(s.speakerName) || getCloudinaryProfileUrl(selectedPersonId),
            designation: s.speakerDesignation || 'Keynote Speaker',
            company: s.speakerCompany || 'MP Semiconductor Summit',
            role: 'speaker' as const,
            bio: `${s.speakerName} is a distinguished keynote speaker at the Madhya Pradesh Semiconductor Summit 2026, presenting "${s.title}". Leading national semiconductor ecosystem, fab enablement, and industry initiatives.`,
            interests: [],
            skills: [],
            email: 'Not listed',
            mobile: 'Not listed',
            linkedin: 'https://linkedin.com',
            privacy: {
              preset: 'Open' as const,
              shareEmail: false,
              sharePhone: false,
              shareLinkedIn: true,
              shareTwitter: false,
            },
            checkedIn: true,
            ticketType: 'Speaker',
            registrationId: `#SPK-${selectedPersonId.slice(-4).toUpperCase()}`,
            relevanceScore: 98,
          } as Person;
        }
      }
      return null;
    })()

    );
  }, [selectedPersonId, attendees, sessions, normalizedSearch]);

  // Defensive fallback: if selectedPersonId is invalid or not found, automatically clear it to avoid stuck backdrops
  useEffect(() => {
    if (selectedPersonId && !person) {
      setSelectedPersonId(null);
    }
  }, [selectedPersonId, person, setSelectedPersonId]);

  if (!selectedPersonId || !person) return null;

  const handleStartEdit = () => {
    setEditForm({
      name: person.name || '',
      designation: person.designation || '',
      company: person.company || '',
      bio: person.bio || '',
      email: person.email || '',
      mobile: person.mobile || '',
      linkedin: person.linkedin || '',
      twitter: person.twitter || '',
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      await updateAttendee(person.id, editForm);
      setIsEditing(false);
    } catch {
      // toast in store
    } finally {
      setIsSaving(false);
    }
  };

  // Combine unique tags from interests and skills
  const allTags = Array.from(
    new Set([...(person.interests || []), ...(person.skills || [])])
  ).filter(Boolean);

  return (
    <div
      onClick={() => setSelectedPersonId(null)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-5 space-y-3.5 shadow-2xl border border-[#DEDCD7]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDCD7]">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#DC2626]">
            {person.role === 'speaker' || person.ticketType === 'Speaker' ? 'Featured Speaker Profile' : 'Attendee Profile'}
          </span>
          <div className="flex items-center gap-1.5">
            {!isEditing && role === 'organizer' && (
              <button
                onClick={handleStartEdit}
                className="p-1 rounded-md text-[#6B6B6B] hover:text-[#181818] hover:bg-gray-100 transition-colors"
                title="Edit Info"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedPersonId(null)}
              className="p-1 rounded-md text-[#6B6B6B] hover:text-[#181818] hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isEditing && role === 'organizer' ? (
          /* EDIT MODE */
          <div className="space-y-3 pt-1 text-xs">
            <h3 className="font-bold text-[#181818] text-sm pb-1 border-b border-gray-100">
              Edit Attendee Information
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-[#4B5563]">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#DEDCD7] text-xs focus:outline-none focus:ring-1 focus:ring-[#181818]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-[#4B5563]">Designation</label>
                <input
                  type="text"
                  value={editForm.designation}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DEDCD7] text-xs focus:outline-none focus:ring-1 focus:ring-[#181818]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-[#4B5563]">Company</label>
                <input
                  type="text"
                  value={editForm.company}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, company: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DEDCD7] text-xs focus:outline-none focus:ring-1 focus:ring-[#181818]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-[#4B5563]">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DEDCD7] text-xs focus:outline-none focus:ring-1 focus:ring-[#181818]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-[#4B5563]">Mobile</label>
                <input
                  type="text"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DEDCD7] text-xs focus:outline-none focus:ring-1 focus:ring-[#181818]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#4B5563]">LinkedIn URL</label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/username"
                value={editForm.linkedin}
                onChange={(e) => setEditForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#DEDCD7] text-xs focus:outline-none focus:ring-1 focus:ring-[#181818]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-[#181818] text-white hover:bg-black font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          /* VIEW MODE */
          <>
            {/* Identity & Avatar */}
            <div className="flex items-start gap-3 relative">
              {hasRealProfilePhoto(person) ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-sm border border-[#E5E7EB]">
                  <img
                    src={getProfileAvatar(person)}
                    alt={person.name}
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                  <div className="avatar-fallback w-full h-full hidden items-center justify-center bg-[#181818] text-white font-bold text-lg select-none">
                    {getInitials(person.name)}
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#181818] text-white flex items-center justify-center font-bold text-lg shadow-sm border border-[#E5E7EB] shrink-0 select-none">
                  {getInitials(person.name)}
                </div>
              )}
              <div className="pt-0.5 pr-8 min-w-0 flex-1">
                <h2 className="text-[16px] font-bold text-[#181818] leading-tight truncate">{person.name}</h2>
                {[person.designation, person.company].filter(Boolean).length > 0 && (
                  <p className="text-[13.5px] text-[#4B5563] mt-0.5 leading-snug">
                    {[person.designation, person.company].filter(Boolean).join(' · ')}
                  </p>
                )}
                {(() => {
                  const rawTag = person.ticketType !== undefined ? person.ticketType : (person.role === 'speaker' ? 'Speaker' : 'Delegate');
                  const tag = (rawTag || '').trim();
                  
                  // Never show Team tag on any profile, and suppress tags for founders and guidance team
                  if (
                    !tag ||
                    tag.toLowerCase() === 'team' ||
                    person.id === 'att-hari-gupta' ||
                    person.id === 'att-pushpit-upadhyay' ||
                    person.id.startsWith('att-akarshan') ||
                    person.id.startsWith('att-rochak') ||
                    person.id.startsWith('att-aniket') ||
                    person.id.startsWith('att-sarthak') ||
                    person.id.startsWith('att-sagar') ||
                    person.id.startsWith('att-vipul')
                  ) {
                    return null;
                  }

                  return (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-medium text-[#4B5563] bg-[#F3F4F6] px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                      {person.relevanceScore !== undefined && person.relevanceScore > 0 && (
                        <span className="text-[11px] font-medium text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] px-2 py-0.5 rounded-md">
                          {person.relevanceScore}% Match
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Bio */}
            {person.bio && (
              <div className="text-[12.5px] text-[#4B5563] leading-relaxed bg-[#F8F7F4] p-2.5 rounded-lg border border-[#EBE8E2]">
                <p>{person.bio}</p>
              </div>
            )}

            {/* Focus Areas & Skills (hidden for speakers, founders, and when empty) */}
            {person.role !== 'speaker' &&
              allTags.length > 0 &&
              person.id !== 'att-hari-gupta' &&
              person.id !== 'att-pushpit-upadhyay' && (
              <div className="pt-1">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1.5">
                  Focus Areas & Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] bg-[#F3F4F6] text-[#4B5563] px-2.5 py-1 rounded-md font-medium border border-[#E5E7EB]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact details */}
            <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E5E7EB] space-y-2.5 text-[12px]">
              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B6B6B]">
                  <Mail className="w-4 h-4 text-[#4B5563]" />
                  Email
                </span>
                <span className="text-[#181818] font-medium text-[11.5px] flex items-center justify-end">
                  {person.email && person.email !== 'Not listed' && person.email !== 'Not publicly listed' ? (
                    <a href={`mailto:${person.email}`} className="hover:underline text-[#181818] font-mono truncate max-w-[210px] block">
                      {person.email}
                    </a>
                  ) : (
                    <span className="text-[#9CA3AF] italic font-normal pr-1.5 inline-block">Not listed</span>
                  )}
                </span>
              </div>

              {/* Mobile */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B6B6B]">
                  <Phone className="w-4 h-4 text-[#4B5563]" />
                  Mobile
                </span>
                <span className="text-[#181818] font-medium text-[11.5px] flex items-center justify-end">
                  {person.mobile && person.mobile !== 'Not listed' && person.mobile !== 'Not publicly listed' ? (
                    <a href={`tel:${person.mobile}`} className="hover:underline text-[#181818] font-mono">
                      {person.mobile}
                    </a>
                  ) : (
                    <span className="text-[#9CA3AF] italic font-normal pr-1.5 inline-block">Not listed</span>
                  )}
                </span>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B6B6B]">
                  <div className="w-[17px] h-[17px] rounded-[3.5px] bg-[#0A66C2] flex items-center justify-center text-white text-[10px] font-bold leading-none font-sans shrink-0 shadow-2xs">
                    in
                  </div>
                  LinkedIn
                </span>
                <span className="flex items-center justify-end">
                  {person.linkedin ? (
                    <a
                      href={person.linkedin.startsWith('http') ? person.linkedin : `https://${person.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] font-semibold hover:underline"
                    >
                      View LinkedIn Profile →
                    </a>
                  ) : (
                    <span className="text-[#9CA3AF] italic font-normal pr-1.5 inline-block">Not shared</span>
                  )}
                </span>
              </div>

              {/* Twitter / X */}
              {person.twitter &&
                person.id !== 'att-hari-gupta' &&
                person.id !== 'att-pushpit-upadhyay' && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6B6B6B]">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    Twitter / X
                  </span>
                  <span>
                    <a
                      href={person.twitter.startsWith('http') ? person.twitter : `https://x.com/${person.twitter.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#181818] font-medium hover:underline"
                    >
                      {person.twitter.startsWith('http')
                        ? `@${person.twitter.split('/').pop()?.split('?')[0] || 'profile'}`
                        : person.twitter.startsWith('@')
                        ? person.twitter
                        : `@${person.twitter}`}
                    </a>
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-1 flex items-center">
              <button
                onClick={() => setSelectedPersonId(null)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DEDCD7] bg-[#F8F7F4] hover:bg-[#EFECE6] text-[#181818] font-semibold text-xs cursor-pointer text-center transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
