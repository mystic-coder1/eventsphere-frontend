'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { ChevronLeft, Mail } from 'lucide-react';

export const DelegateSupport: React.FC = () => {
  const router = useRouter();
  const { setActiveDelegateTab } = useStore();

  return (
    <div className="flex-1 min-h-0 h-full bg-[#F8F7F4] select-none flex flex-col overflow-hidden">
      {/* Top Fixed Header matching Profile & Schedule */}
      <div className="shrink-0 bg-[#F8F7F4] px-3 z-10 border-b border-[#E5E7EB]">
        <div className="pt-4 pb-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.15em] text-[#6B6B6B] font-semibold mb-0.5">
              MPSS26 · SUPPORT
            </p>
            <h1 className="text-[32px] font-sans font-semibold text-[#181818] tracking-tight leading-none">
              Help & Support
            </h1>
          </div>
          <button
            onClick={() => router.push('/delegate/profile')}
            className="px-3 py-1.5 rounded-full bg-white border border-[#DEDCD7] text-[#181818] font-bold text-[11px] shadow-sm hover:bg-[#FAF9F5] active:scale-95 transition-all flex items-center gap-1 shrink-0"
            aria-label="Back to Profile"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Content: Helpdesk Support */}
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-3 space-y-3">
        {/* Helpdesk Support Card */}
        <div className="bg-white p-4 rounded-[16px] border border-[#DEDCD7] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#181818]">Helpdesk Support</span>
          </div>

          <div>
            <a
              href="mailto:ed1@mpsedc.com"
              className="p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#181818] bg-[#F9FAFB] hover:bg-white flex items-center justify-between transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 text-[#181818]">
                <div className="w-8 h-8 rounded-lg bg-[#E6FFFA] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#0D9488]" />
                </div>
                <div>
                  <span className="text-[12px] font-bold block text-[#181818]">Email Support</span>
                  <span className="text-[11.5px] text-[#4B5563] group-hover:text-[#181818]">
                    ed1@mpsedc.com
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#B51F32]">Contact &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
