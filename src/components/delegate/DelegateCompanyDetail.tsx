'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Star } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getOfficialBoothNumber, formatBoothBadge } from '@/lib/officialBooths';

export const DelegateCompanyDetail: React.FC = () => {
  const router = useRouter();
  const { 
    setActiveDelegateTab, 
    selectedCompanyId, 
    exhibitors, 
  } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedCompanyId]);

  const company = exhibitors.find(e => e.id === selectedCompanyId) || exhibitors[0];

  if (!company) return null;

  return (
    <div ref={scrollRef} className="flex-1 bg-[#F6F4F0] flex flex-col h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="pt-4 pb-4 px-4 bg-[#F6F4F0] sticky top-0 z-10 flex items-center gap-2.5">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/delegate/exhibitors');
            }
          }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#181818] transition-active active:scale-95 shadow-sm shrink-0"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-[19px] font-bold text-[#181818] tracking-tight truncate">{company.company}</h1>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Main Card */}
        <div className="bg-white rounded-[14px] border border-[#DEDCD7] p-3 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.company} 
                className="w-12 h-12 rounded-xl object-contain p-1 border border-[#DEDCD7] bg-white shadow-xs"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.company)}&background=F3F4F6&color=181818&bold=true`;
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#EFEEEA] flex items-center justify-center font-bold text-[12px] text-[#181818]">
                {company.company.charAt(0)}
              </div>
            )}
            <div className="bg-[#181818] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
              {formatBoothBadge(getOfficialBoothNumber(company?.company, company?.booth))}
            </div>
          </div>
          
          <h2 className="text-[12px] font-bold text-[#181818] mb-1.5">{company.company}</h2>
          <div className="flex items-start gap-1 text-[#6B6B6B] mb-2">
            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p className="text-[12px]">Brilliant Convention Centre, Indore, MP</p>
          </div>

          <p className="text-[12px] text-[#181818] leading-relaxed">
            {company.company} is showcasing their latest innovations in the {company.category} space. Visit {formatBoothBadge(getOfficialBoothNumber(company?.company, company?.booth))} at MPSS26 to explore their products and engage with their experts.
          </p>
        </div>
      </div>
    </div>
  );
};
