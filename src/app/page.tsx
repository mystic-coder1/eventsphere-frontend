'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../lib/store';
import dynamic from 'next/dynamic';
import { PhoneFrame } from '../components/shell/PhoneFrame';

// Exhibitor views (dynamically loaded on demand)
const ExhibitorHome = dynamic(() => import('../components/exhibitor/ExhibitorHome').then(m => m.ExhibitorHome), { ssr: false });
const ExhibitorLeads = dynamic(() => import('../components/exhibitor/ExhibitorLeads').then(m => m.ExhibitorLeads), { ssr: false });
const ExhibitorScan = dynamic(() => import('../components/exhibitor/ExhibitorScan').then(m => m.ExhibitorScan), { ssr: false });
const ExhibitorProducts = dynamic(() => import('../components/exhibitor/ExhibitorProducts').then(m => m.ExhibitorProducts), { ssr: false });
const ExhibitorMore = dynamic(() => import('../components/exhibitor/ExhibitorMore').then(m => m.ExhibitorMore), { ssr: false });
const ExhibitorBottomNav = dynamic(() => import('../components/exhibitor/ExhibitorBottomNav').then(m => m.ExhibitorBottomNav), { ssr: false });

// Organizer console (dynamically loaded on demand)
const OrganizerConsole = dynamic(() => import('../components/organizer/OrganizerConsole').then(m => m.OrganizerConsole), { ssr: false });

// Modals (dynamically loaded on demand)
const ContactPrivacyModal = dynamic(() => import('../components/modals/ContactPrivacyModal').then(m => m.ContactPrivacyModal), { ssr: false });
const PersonDetailModal = dynamic(() => import('../components/modals/PersonDetailModal').then(m => m.PersonDetailModal), { ssr: false });
const MyQRCodeModal = dynamic(() => import('../components/modals/MyQRCodeModal').then(m => m.MyQRCodeModal), { ssr: false });
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function App() {
  const router = useRouter();
  const {
    role,
    hasAccessConfirmed,
    setHasAccessConfirmed,
    activeExhibitorTab,
    selectedPersonId,
    toast,
  } = useStore();

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    if (hasAccessConfirmed && role === 'delegate') {
      router.replace('/delegate/home');
    }
  }, [hasAccessConfirmed, role, router]);

  return (
    <div className={`bg-[#F6F4F0] flex flex-col font-sans ${role === 'organizer' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}>

      {/* Modals */}
      {isPrivacyModalOpen && (
        <ContactPrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      )}
      {isQRModalOpen && (
        <MyQRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      )}
      {selectedPersonId && <PersonDetailModal />}

      {/* Floating Feedback Toast Notification for Organizer */}
      {toast && role === 'organizer' && (
        <div className="fixed top-14 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#181818] text-white px-3 py-2.5 rounded-lg shadow-lg border border-[#333333] flex items-center gap-2.5 text-xs max-w-sm">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#2F7D58] flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#B51F32] flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#00A4EF] flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main View Router based on Role */}
      {role === 'organizer' ? (
        /* Full-Width Desktop Organizer Console */
        <OrganizerConsole />
      ) : role === 'delegate' ? (
        /* Delegate Experience: Transition to canonical routed portal */
        <PhoneFrame>
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
            <div className="w-8 h-8 border-2 border-[#181818] border-t-transparent rounded-full animate-spin" />
            <p className="text-[12px] font-semibold text-[#6B6B6B] tracking-wide uppercase">
              Loading Summit...
            </p>
          </div>
        </PhoneFrame>
      ) : (
        /* Exhibitor Experience */
        <PhoneFrame>
          {toast && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-200 w-[90%] max-w-[340px]">
              <div className="bg-[#181818] text-white px-3 py-3 rounded-[14px] shadow-xl border border-[#333333] flex items-center gap-2 text-[12px]">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2F7D58] flex-shrink-0" />
                ) : toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-[#B51F32] flex-shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-[#00A4EF] flex-shrink-0" />
                )}
                <span className="font-semibold truncate">{toast.message}</span>
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto overscroll-contain no-scrollbar">
              {activeExhibitorTab === 'home' && <ExhibitorHome />}
              {activeExhibitorTab === 'leads' && <ExhibitorLeads />}
              {activeExhibitorTab === 'scan' && <ExhibitorScan />}
              {activeExhibitorTab === 'products' && <ExhibitorProducts />}
              {activeExhibitorTab === 'more' && <ExhibitorMore />}
            </div>
            <ExhibitorBottomNav />
          </div>
        </PhoneFrame>
      )}
    </div>
  );
}
