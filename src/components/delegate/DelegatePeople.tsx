'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { RECOMMENDED_PEOPLE_IDS, INITIAL_ATTENDEES } from '../../lib/mockData';
import { Person } from '../../types';
import { getOptimizedAvatarUrl } from '../../lib/cloudinary';



export const DelegatePeople: React.FC = () => {
  const router = useRouter();
  const {
    attendees,
    setSelectedPersonId,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [renderLimit, setRenderLimit] = useState(20);

  // All curated attendees/speakers pool
  const allPool = useMemo(() => {
    return RECOMMENDED_PEOPLE_IDS.map((id) =>
      attendees.find((a) => a.id === id)
    ).filter(Boolean) as Person[];
  }, [attendees]);

  const displayedList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allPool;

    return attendees.filter((person) => {
      return (
        person.name.toLowerCase().includes(q) ||
        person.company.toLowerCase().includes(q) ||
        person.designation.toLowerCase().includes(q) ||
        (person.interests && person.interests.some((i) => i.toLowerCase().includes(q))) ||
        (person.skills && person.skills.some((s) => s.toLowerCase().includes(q)))
      );
    });
  }, [allPool, attendees, searchQuery]);

  return (
    <div className="flex-1 min-h-0 h-full bg-[#F8F7F4] select-none flex flex-col overflow-hidden">
      {/* Fixed Top Section: Header & Search */}
      <div className="shrink-0 bg-[#F8F7F4] px-3.5 z-10 border-b border-[#E5E7EB]">
        {/* Header */}
        <div className="pt-4 pb-1">
          <p className="text-[10.5px] uppercase tracking-[0.15em] text-[#6B6B6B] font-semibold mb-0.5">
            MPSS26 · DIRECTORY
          </p>
          <h1 className="text-[32px] font-sans font-semibold text-[#181818] tracking-tight leading-none">
            People
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2 pb-3">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-[19px] -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, or interest (e.g. AI)..."
            className="w-full h-10 bg-white border border-[#E5E7EB] rounded-[14px] pl-10 pr-9 text-[12.5px] focus:ring-2 focus:ring-[#B51F32]/20 focus:border-[#B51F32] outline-none text-[#181818] placeholder-[#9CA3AF] shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-[19px] -translate-y-1/2 text-[11px] font-bold text-[#6B6B6B] hover:text-[#181818]"
            >
              Clear
            </button>
          )}

        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-2.5 no-scrollbar pb-2.5">
        <p className="text-[12.5px] font-medium text-[#6B7280] px-0.5">
          {displayedList.length} {displayedList.length === 1 ? 'Attendee' : 'Attendees'}
        </p>

        {/* Attendees / Profiles List */}
        <div className="space-y-2.5">
          {displayedList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-[20px] border border-[#DEDCD7]">
              <p className="text-xs font-semibold text-[#181818]">
                No attendees found
              </p>
              <p className="text-[11px] text-[#6B6B6B] mt-1">
                Try adjusting your search keywords.
              </p>
            </div>
          ) : (
            displayedList.slice(0, renderLimit).map((person) => (
              <div
                key={person.id}
                onClick={() => setSelectedPersonId(person.id)}
                className="bg-white p-3.5 rounded-[20px] border border-[#E5E7EB] hover:border-gray-400 transition-all shadow-xs cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  {person.avatar ? (
                    <img
                      src={getOptimizedAvatarUrl(person.avatar, 96)}
                      alt={person.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 shadow-xs border border-[#E5E7EB]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#F6F4F0] border border-[#E5E7EB] flex items-center justify-center font-bold text-[15px] text-[#181818] flex-shrink-0 shadow-xs">
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-[#181818] truncate leading-tight">
                      {person.name}
                    </h3>
                    <p className="text-[12.5px] text-[#6B7280] font-normal truncate mt-1 leading-normal">
                      {person.designation} · {person.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] stroke-[2]" />
                </div>
              </div>
            ))
          )}
          {displayedList.length > renderLimit && (
            <div className="pt-2 pb-4 text-center">
              <button
                type="button"
                onClick={() => setRenderLimit((prev) => prev + 25)}
                className="text-[12px] font-semibold px-4 py-2 bg-white border border-[#E5E7EB] rounded-full hover:bg-gray-50 text-[#181818] shadow-xs transition-colors cursor-pointer"
              >
                Show More Attendees ({displayedList.length - renderLimit} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
