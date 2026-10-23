'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Home, Calendar, Building2, User } from 'lucide-react';
import { cleanupLingeringOverlays } from '../../lib/overlayCleanup';

export const DelegateBottomNav: React.FC = () => {
  const router = useRouter();
  const {
    activeDelegateTab,
    setActiveDelegateTab,
    selectedSessionId,
    setSelectedSessionId,
    setSelectedPersonId,
    setViewSavedCompaniesOnly,
    setViewSavedPeopleOnly,
    setScheduleSubTab,
    setScheduleDay,
    sessionBackTab,
    setSessionBackTab,
  } = useStore();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, href: '/delegate/home' },
    { id: 'schedule' as const, label: 'Agenda', icon: Calendar, href: '/delegate/agenda/allsessions' },
    { id: 'companies' as const, label: 'Exhibitors', icon: Building2, href: '/delegate/exhibitors' },
    { id: 'profile' as const, label: 'Profile', icon: User, href: '/delegate/profile' },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    setSelectedPersonId(null);
    setSelectedSessionId(null);

    if (item.id === 'schedule') {
      setScheduleSubTab('all');
      setSessionBackTab('schedule');
      setScheduleDay(2);
    }
    if (item.id === 'home') {
      setViewSavedPeopleOnly(false);
    }
    if (item.id === 'companies') {
      setViewSavedCompaniesOnly(false);
    }

    setActiveDelegateTab(item.id);
    cleanupLingeringOverlays();
    router.push(item.href);
  };

  return (
    <nav
      className="flex-shrink-0 w-full z-[60] bg-[#FFFFFF] border-t border-[#DEDCD7] pb-safe px-2 pt-1 shadow-md select-none touch-manipulation pointer-events-auto"
      role="navigation"
      aria-label="Delegate Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isHomeActive =
            item.id === 'home' &&
            (activeDelegateTab === 'home' ||
              (activeDelegateTab === 'schedule' && selectedSessionId !== null && sessionBackTab === 'home') ||
              [
                'speakers',
                'map',
                'sponsors',
                'ai_recommendations',
                'support',
                'people',
              ].includes(activeDelegateTab));

          const isScheduleActive =
            item.id === 'schedule' &&
            activeDelegateTab === 'schedule' &&
            !(selectedSessionId !== null && sessionBackTab === 'home');

          const isCompaniesActive =
            item.id === 'companies' &&
            (activeDelegateTab === 'companies' || activeDelegateTab === 'company_detail');

          const isProfileActive =
            item.id === 'profile' && activeDelegateTab === 'profile';

          const isActive = isHomeActive || isScheduleActive || isCompaniesActive || isProfileActive;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item);
              }}
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative cursor-pointer touch-manipulation select-none active:opacity-75 ${
                isActive ? 'text-[#D11E39]' : 'text-[#6B6B6B] hover:text-[#181818]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative pointer-events-none">
                <Icon
                  className={`w-[22px] h-[22px] ${
                    isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <div className="flex flex-col items-center mt-1 pointer-events-none">
                <span
                  className={`text-[9.5px] font-medium tracking-tight ${
                    isActive ? 'font-bold' : ''
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-[#D11E39] rounded-full mt-0.5" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
