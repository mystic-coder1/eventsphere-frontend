'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Search,
  Mail,
  Phone,
  X,
  Star,
} from 'lucide-react';

export interface OrganizerMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  organization: 'MPSeDC' | 'AIGGPA';
  linkedin?: string;
  avatar?: string;
}

export const MPSEDC_MEMBERS: OrganizerMember[] = [
  {
    id: 'mpsedc-01',
    name: 'M. Selvendran',
    designation: 'Principal Secretary',
    department: 'Dept. of Science and Technology',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/manickam-selvendran-023570197',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502525/m-selvendran.jpg',
  },
  {
    id: 'mpsedc-02',
    name: 'Anshuman Raj',
    designation: 'Managing Director',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/anshuman-raj-ias-3068a71b6',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441685/anshuman_raj.jpg',
  },
  {
    id: 'mpsedc-03',
    name: 'Mahip Kishore Tejasvi',
    designation: 'Executive Director',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502526/mahip-kishore-tejasvi.jpg',
  },
  {
    id: 'mpsedc-04',
    name: 'Avantika Varma',
    designation: 'OIC Investment Promotion',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/awantika-varma-03b26a9',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502498/avantika-verma.jpg',
  },
  {
    id: 'mpsedc-05',
    name: 'Avinash Sharma',
    designation: 'Project Manager',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/avinash-sharma-a9529242',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502497/avinash-sharma.jpg',
  },
  {
    id: 'mpsedc-06',
    name: 'Manoj Sethiya',
    designation: 'Tech Lead',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/manoj-sethiya',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502531/manoj-sethiya.jpg',
  },
  {
    id: 'mpsedc-07',
    name: 'Abhishek Pandit',
    designation: 'Java Developer',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/abhishek-kumar-pandit-967a08229',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502570/abhishek-pandit.png',
  },
  {
    id: 'mpsedc-08',
    name: 'Shailendra Raghuwanshi',
    designation: 'UI UX Designer',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/shailendra-raghuwanshi-2487668b',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502537/shailendra-raghuwanshi.jpg',
  },
  {
    id: 'mpsedc-09',
    name: 'Mayank Nagar',
    designation: 'Database Developer',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/mayank-nagar-2a517b23',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502533/mayank-nagar.png',
  },
  {
    id: 'mpsedc-10',
    name: 'Ashish Tiwari',
    designation: 'Java Developer',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/ashish-tiwari-1b39337a',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502537/ashish-tiwari.png',
  },
  {
    id: 'mpsedc-11',
    name: 'Shivangi Kushwah',
    designation: 'Business Analyst',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/shivangi-kushwah-3515bb355',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502571/shivangi-kushwah.png',
  },
  {
    id: 'mpsedc-12',
    name: 'Dhwaj Sharma',
    designation: 'Associate Engineer PMO',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/dhwaj-sharma',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502513/dhwaj-sharma.jpg',
  },
  {
    id: 'mpsedc-13',
    name: 'Rishi Pandey',
    designation: 'Intern',
    department: 'MPSeDC',
    organization: 'MPSeDC',
    linkedin: 'https://www.linkedin.com/in/rishi-pandey2005',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502536/rishi-pandey.png',
  },
];

export const AIGGPA_MEMBERS: OrganizerMember[] = [
  {
    id: 'aiggpa-01',
    name: 'Prof. Santosh Kumar Vishvakarma',
    designation: 'Chief Scientific Advisor & Professor, IIT Indore',
    department: 'AIGGPA, Bhopal, Govt of Madhya Pradesh',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/dr-santosh-kumar-vishvakarma/',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502537/prof-santosh-kumar-vishvakarma.png',
  },
  {
    id: 'aiggpa-02',
    name: 'Priyanka Gajbhiye',
    designation: 'Advisor',
    department: 'AIGGPA, Bhopal, Government of Madhya Pradesh',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/priyanka-gajbhiye-86b42963/',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502535/priyanka-gajbhiye.jpg',
  },
  {
    id: 'aiggpa-03',
    name: 'Dr. Jaya R Koshta',
    designation: 'Advisor',
    department: 'AIGGPA, Bhopal',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/jaya-koshta-b10b4613b/',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502517/jaya-r-koshta.png',
  },
  {
    id: 'aiggpa-04',
    name: 'Dr. Swati Chauhan',
    designation: 'Advisor',
    department: 'AIGGPA, Bhopal',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/dr-swati-chauhan-5b088822',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502538/swati-chauhan.jpg',
  },
  {
    id: 'aiggpa-05',
    name: 'Dr. Anshul Puriya',
    designation: 'Advisor',
    department: 'AIGGPA, Bhopal',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/anshulpuriya',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502487/anshul-puriya.jpg',
  },
  {
    id: 'aiggpa-06',
    name: 'Horil Dev Rajak',
    designation: 'Advisor',
    department: 'AIGGPA, Bhopal',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/horil-dev/',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502509/horil-dev-rajak.jpg',
  },
  {
    id: 'aiggpa-07',
    name: 'Akshay Verma',
    designation: 'Research Associate',
    department: 'AIGGPA, Bhopal, Government of Madhya Pradesh',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/akshay-verma-3a90b121b/',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502511/akshay-verma.png',
  },
  {
    id: 'aiggpa-08',
    name: 'Kishan Kumar',
    designation: 'Research Associate',
    department: 'AIGGPA, Bhopal, Government of Madhya Pradesh',
    organization: 'AIGGPA',
    linkedin: 'https://www.linkedin.com/in/kishan-kumar-27070226b/',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502556/kishan-kumar.png',
  },
  {
    id: 'aiggpa-09',
    name: 'Devendra Gwal',
    designation: 'Research Associate',
    department: 'AIGGPA, Bhopal, Government of Madhya Pradesh',
    organization: 'AIGGPA',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502494/devendra-gwal.jpg',
  },
  {
    id: 'aiggpa-10',
    name: 'Devesh Kumar Basal',
    designation: 'Research Associate',
    department: 'AIGGPA, Bhopal, Government of Madhya Pradesh',
    organization: 'AIGGPA',
    avatar: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502532/devesh-kumar-basal.png',
  },
];

function getInitials(name: string): string {
  const parts = name.replace(/^(dr\.|prof\.|mr\.|ms\.|shri|smt\.)\s*/i, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const DelegateOrganizers: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerMember | null>(null);
  const [savedOrganizers, setSavedOrganizers] = useState<Set<string>>(new Set());

  const toggleSaveOrganizer = (id: string) => {
    setSavedOrganizers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filterMembers = (list: OrganizerMember[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q)
    );
  };

  const filteredMpsedc = useMemo(() => filterMembers(MPSEDC_MEMBERS), [searchQuery]);
  const filteredAiggpa = useMemo(() => filterMembers(AIGGPA_MEMBERS), [searchQuery]);

  return (
    <div className="flex-1 min-h-0 bg-[#F8F7F4] flex flex-col h-full overflow-hidden relative select-none">
      {/* Header */}
      <div className="pt-4 pb-3 px-4 bg-[#F8F7F4] flex-shrink-0 z-10">
        <div className="flex items-center gap-3 mb-3.5">
          <button
            onClick={() => router.push('/delegate/home')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#181818] transition-active active:scale-95 shadow-xs border border-gray-100 cursor-pointer"
            aria-label="Back to Home"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#181818] tracking-tight">Organizers</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizers by name, organization, or role..."
            className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-10 text-[13px] focus:ring-2 focus:ring-[#B51F32]/20 focus:border-[#B51F32] outline-none text-[#181818] placeholder-[#9CA3AF] shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#6B6B6B] hover:text-[#181818] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Organizers Layout */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-8 no-scrollbar">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 items-start">
          {/* COLUMN 1: MPSeDC */}
          <div className="bg-[#FAF7F2] p-2 sm:p-2.5 rounded-2xl border border-[#EBE5DA] shadow-xs flex flex-col">
            {/* Column Header */}
            <div className="text-center py-2 border-b border-[#EFEAE0]">
              <h2 className="text-[16px] sm:text-[17px] font-bold text-[#181818] tracking-tight">
                MPSeDC
              </h2>
            </div>

            {/* Members List - Speaker-style Card Grid */}
            <div className="space-y-2.5 mt-2.5">
              {filteredMpsedc.length === 0 ? (
                <div className="py-8 text-center text-[11.5px] text-[#9CA3AF]">
                  No matching members
                </div>
              ) : (
                filteredMpsedc.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => setSelectedOrganizer(person)}
                    className="bg-white rounded-[16px] p-2 sm:p-2.5 border border-[#E5E7EB] hover:border-gray-400 hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between group select-none"
                  >
                    <div>
                      {/* Photo with LinkedIn Badge (matches speaker layout) */}
                      <div className="relative w-full h-[120px] sm:h-[130px] rounded-[12px] overflow-hidden bg-[#EFEBE5] shrink-0 border border-[#DEDCD7] flex items-center justify-center">
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EFEBE5] to-[#E2DDD5] text-[#181818] font-bold text-xl select-none">
                            {getInitials(person.name)}
                          </div>
                        )}

                        {/* Top-Right LinkedIn Badge */}
                        {person.linkedin && (
                          <div
                            className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[6px] bg-white shadow-xs border border-white/90 flex items-center justify-center z-10"
                            title="LinkedIn Profile"
                          >
                            <svg className="w-3.5 h-3.5 fill-[#0077B5]" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.81a1.45 1.45 0 0 0-1.45 1.45 1.45 1.45 0 0 0 1.45 1.45 1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45Z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="mt-2">
                        <h3 className="font-bold text-[12.5px] sm:text-[13px] text-[#111827] leading-tight truncate">
                          {person.name}
                        </h3>
                        <p className="text-[10.5px] text-[#6B7280] leading-snug truncate mt-0.5">
                          {person.designation} · {person.department}
                        </p>
                      </div>
                    </div>

                    {/* Tag & Action */}
                    <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between">
                      <span className="inline-block text-[9.5px] font-semibold text-[#4B5563] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-[6px]">
                        {person.organization}
                      </span>
                      <span className="text-[10px] font-semibold text-[#B51F32]">
                        View &gt;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 2: AIGGPA */}
          <div className="bg-[#FAF7F2] p-2 sm:p-2.5 rounded-2xl border border-[#EBE5DA] shadow-xs flex flex-col">
            {/* Column Header */}
            <div className="text-center py-2 border-b border-[#EFEAE0]">
              <h2 className="text-[16px] sm:text-[17px] font-bold text-[#181818] tracking-tight">
                AIGGPA
              </h2>
            </div>

            {/* Members List - Speaker-style Card Grid */}
            <div className="space-y-2.5 mt-2.5">
              {filteredAiggpa.length === 0 ? (
                <div className="py-8 text-center text-[11.5px] text-[#9CA3AF]">
                  No matching members
                </div>
              ) : (
                filteredAiggpa.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => setSelectedOrganizer(person)}
                    className="bg-white rounded-[16px] p-2 sm:p-2.5 border border-[#E5E7EB] hover:border-gray-400 hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between group select-none"
                  >
                    <div>
                      {/* Photo with LinkedIn Badge (matches speaker layout) */}
                      <div className="relative w-full h-[120px] sm:h-[130px] rounded-[12px] overflow-hidden bg-[#EFEBE5] shrink-0 border border-[#DEDCD7] flex items-center justify-center">
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EFEBE5] to-[#E2DDD5] text-[#181818] font-bold text-xl select-none">
                            {getInitials(person.name)}
                          </div>
                        )}

                        {/* Top-Right LinkedIn Badge */}
                        {person.linkedin && (
                          <div
                            className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-[6px] bg-white shadow-xs border border-white/90 flex items-center justify-center z-10"
                            title="LinkedIn Profile"
                          >
                            <svg className="w-3.5 h-3.5 fill-[#0077B5]" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.81a1.45 1.45 0 0 0-1.45 1.45 1.45 1.45 0 0 0 1.45 1.45 1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45Z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="mt-2">
                        <h3 className="font-bold text-[12.5px] sm:text-[13px] text-[#111827] leading-tight truncate">
                          {person.name}
                        </h3>
                        <p className="text-[10.5px] text-[#6B7280] leading-snug truncate mt-0.5">
                          {person.designation} · {person.department}
                        </p>
                      </div>
                    </div>

                    {/* Tag & Action */}
                    <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between">
                      <span className="inline-block text-[9.5px] font-semibold text-[#4B5563] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-[6px]">
                        {person.organization}
                      </span>
                      <span className="text-[10px] font-semibold text-[#B51F32]">
                        View &gt;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Profile Detail Modal */}
      {selectedOrganizer && (() => {
        const isSaved = savedOrganizers.has(selectedOrganizer.id);

        return (
          <div
            onClick={() => setSelectedOrganizer(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-5 space-y-3.5 shadow-2xl border border-[#DEDCD7]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDCD7]">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#DC2626]">
                  ORGANIZER PROFILE
                </span>
                <button
                  onClick={() => setSelectedOrganizer(null)}
                  className="p-1 rounded-md text-[#6B6B6B] hover:text-[#181818] hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Identity & Avatar */}
              <div className="flex items-start gap-3 relative">
                <button
                  onClick={() => toggleSaveOrganizer(selectedOrganizer.id)}
                  className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title={isSaved ? 'Remove from Saved' : 'Save Person'}
                >
                  <Star
                    className={`w-5 h-5 ${
                      isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-[#9CA3AF]'
                    }`}
                  />
                </button>

                {selectedOrganizer.avatar ? (
                  <img
                    src={selectedOrganizer.avatar}
                    alt={selectedOrganizer.name}
                    className="w-14 h-14 rounded-full object-cover shadow-xs border border-[#E5E7EB] flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedOrganizer.name
                      )}&background=181818&color=ffffff&bold=true`;
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EFEBE5] border border-[#DEDCD7] flex items-center justify-center font-bold text-[17px] text-[#181818] shadow-xs flex-shrink-0 select-none">
                    {getInitials(selectedOrganizer.name)}
                  </div>
                )}

                <div className="pt-0.5 pr-8 min-w-0 flex-1">
                  <h2 className="text-[16px] font-bold text-[#181818] leading-tight truncate">
                    {selectedOrganizer.name}
                  </h2>
                  <p className="text-[13.5px] text-[#4B5563] mt-0.5 leading-snug">
                    {[selectedOrganizer.designation, selectedOrganizer.department]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] font-medium text-[#4B5563] bg-[#F3F4F6] px-2 py-0.5 rounded-md">
                      Organizer
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E5E7EB] space-y-2.5 text-[12px]">
                {/* Email */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6B6B6B]">
                    <Mail className="w-4 h-4 text-[#4B5563]" />
                    Email
                  </span>
                  <span className="text-[#9CA3AF] italic font-normal pr-1.5 inline-block">
                    Not listed
                  </span>
                </div>

                {/* Mobile */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#6B6B6B]">
                    <Phone className="w-4 h-4 text-[#4B5563]" />
                    Mobile
                  </span>
                  <span className="text-[#9CA3AF] italic font-normal pr-1.5 inline-block">
                    Not listed
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
                    {selectedOrganizer.linkedin ? (
                      <a
                        href={
                          selectedOrganizer.linkedin.startsWith('http')
                            ? selectedOrganizer.linkedin
                            : `https://${selectedOrganizer.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A66C2] font-semibold hover:underline"
                      >
                        View LinkedIn Profile →
                      </a>
                    ) : (
                      <span className="text-[#9CA3AF] italic font-normal pr-1.5 inline-block">
                        Not shared
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1 flex items-center">
                <button
                  onClick={() => setSelectedOrganizer(null)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#DEDCD7] bg-[#F8F7F4] hover:bg-[#EFECE6] text-[#181818] font-semibold text-xs cursor-pointer text-center transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
