import React from 'react';
import { Calendar, Home, BookOpenCheck, Users, MapPin } from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../../localization';

export type MainTab = 'events' | 'home' | 'booking' | 'groups' | 'location';

interface BottomNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  currentLang: AppLanguage;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];

  // Exact requested order: Events | Home | Booking | Groups | Location
  const tabs = [
    { id: 'events' as MainTab, label: t.events, icon: Calendar },
    { id: 'home' as MainTab, label: t.home, icon: Home, isCentral: true },
    { id: 'booking' as MainTab, label: t.booking, icon: BookOpenCheck },
    { id: 'groups' as MainTab, label: t.groups, icon: Users },
    { id: 'location' as MainTab, label: t.location, icon: MapPin },
  ];

  return (
    <nav
      id="bottom-main-nav"
      aria-label="Main member navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg transition-colors"
    >
      <div className="max-w-md md:max-w-xl mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCentral) {
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center -mt-5 relative group cursor-pointer focus:outline-hidden`}
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary-light)] scale-110'
                      : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-2 border-[var(--color-border)] group-hover:border-[var(--color-primary)]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-1 transition-colors ${
                    isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative min-h-[48px] rounded-lg transition-all cursor-pointer focus:outline-hidden ${
                isActive ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight transition-colors ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
