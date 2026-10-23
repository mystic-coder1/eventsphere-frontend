'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export interface PartnerItem {
  id: string;
  name: string;
  category: string;
  logo?: string;
}

export const EVENT_PARTNERS: PartnerItem[] = [
  {
    id: 'partner-msme',
    name: 'MSME Department',
    category: 'Government Partner',
    logo: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507137/MSME-logo.png',
  },
  {
    id: 'partner-scl',
    name: 'Semi-Conductor Laboratory',
    category: 'Technology Partner',
    logo: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507139/SCL-logo.png',
  },
  {
    id: 'partner-mp-tourism',
    name: 'MP Tourism',
    category: 'Tourism Partner',
    logo: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507116/mp-tourism-logo.jpg',
  },
  {
    id: 'partner-invest-mp',
    name: 'Invest MP',
    category: 'Investment Partner',
    logo: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507118/mpinvestmetnlogo.jpg',
  },
  {
    id: 'partner-vlsi',
    name: 'VLSI Society of India',
    category: 'Industry Partner',
    logo: '/images/partners/vlsi.png',
  },
  {
    id: 'partner-isig',
    name: 'ISIG',
    category: 'Industry Partner',
    logo: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507113/isig.jpg',
  },
  {
    id: 'partner-make-in-india',
    name: 'Make in India',
    category: 'National Initiative',
    logo: 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507116/makeitindi.jpg',
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const DelegatePartners: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex-1 min-h-0 bg-[#F8F7F4] flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="pt-4 pb-3 px-4 bg-[#F8F7F4] flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/delegate/home')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#181818] transition-active active:scale-95 shadow-xs border border-gray-100 cursor-pointer"
            aria-label="Back to Home"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#181818] tracking-tight">Partners</h1>
        </div>
      </div>

      {/* Partners List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-8 space-y-3 no-scrollbar">
        {EVENT_PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl p-3.5 border border-[#E5E7EB] shadow-xs flex items-center gap-3.5 cursor-default select-none"
          >
            {/* Logo Box */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-2xs">
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-[#FAF9F6] flex items-center justify-center text-[#9CA3AF] text-xs font-bold tracking-wider">
                  {getInitials(partner.name)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[#181818] leading-tight truncate">
                {partner.name}
              </h2>
              <p className="text-[12.5px] text-[#6B7280] font-medium mt-1 leading-snug">
                {partner.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
