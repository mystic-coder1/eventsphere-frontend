'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Building2, User } from 'lucide-react';
import { useStore } from '../../lib/store';
import { cleanupLingeringOverlays } from '../../lib/overlayCleanup';

export const DelegateBottomNavRouted: React.FC = () => {
  const pathname = usePathname();
  const {
    setSelectedPersonId,
    setSelectedSessionId,
    setScheduleSubTab,
    setScheduleDay,
    setSessionBackTab,
    setViewSavedCompaniesOnly,
    setViewSavedPeopleOnly,
  } = useStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/delegate/home' },
    { id: 'agenda', label: 'Agenda', icon: Calendar, href: '/delegate/agenda/allsessions' },
    { id: 'exhibitors', label: 'Exhibitors', icon: Building2, href: '/delegate/exhibitors' },
    { id: 'profile', label: 'Profile', icon: User, href: '/delegate/profile' },
  ];

  const getActiveId = (): string => {
    if (!pathname) return 'home';
    if (
      pathname === '/delegate/home' ||
      pathname === '/delegate/speakers' ||
      pathname === '/delegate/organizers' ||
      pathname === '/delegate/partners' ||
      pathname === '/delegate/map' ||
      pathname === '/delegate/sponsors' ||
      pathname === '/delegate/people' ||
      pathname === '/delegate/about' ||
      pathname === '/delegate/founders'
    ) {
      return 'home';
    }
    if (pathname.startsWith('/delegate/agenda')) {
      return 'agenda';
    }
    if (pathname.startsWith('/delegate/exhibitors')) {
      return 'exhibitors';
    }
    if (pathname.startsWith('/delegate/profile')) {
      return 'profile';
    }
    return 'home';
  };

  const activeId = getActiveId();

  const handleNavClick = (item: (typeof navItems)[0]) => {
    // 1. Immediately dismiss any open modal dialogs
    setSelectedPersonId(null);
    setSelectedSessionId(null);

    // 2. Clear sub-views and filter states
    if (item.id === 'agenda') {
      setScheduleSubTab('all');
      setSessionBackTab('schedule');
      setScheduleDay(2);
    }
    if (item.id === 'exhibitors') {
      setViewSavedCompaniesOnly(false);
    }
    if (item.id === 'home') {
      setViewSavedPeopleOnly(false);
    }

    // 3. Remove any lingering Google Identity Services (GIS) / One-Tap backdrops or iframes
    cleanupLingeringOverlays();
  };

  return (
    <nav
      className="flex-shrink-0 w-full z-[60] bg-[#FFFFFF] border-t border-[#DEDCD7] pb-safe px-2 pt-1 shadow-md select-none touch-manipulation pointer-events-auto"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              onClick={() => handleNavClick(item)}
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
