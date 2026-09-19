import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Users,
  Edit3,
  CheckCircle,
  Heart,
} from 'lucide-react';
import { PastorPortrait } from '../common/PastorPortrait';
import { churchStorage } from '../../services/storage';
import { AppLanguage, TRANSLATIONS } from '../../localization';
import { PastorScheduleItem } from '../../types';

interface PastorScheduleSectionProps {
  currentLang: AppLanguage;
  onOpenFounderFamily: () => void;
  onOpenScheduleEditor: () => void;
  isAdmin: boolean;
}

export const PastorScheduleSection: React.FC<PastorScheduleSectionProps> = ({
  currentLang,
  onOpenFounderFamily,
  onOpenScheduleEditor,
  isAdmin,
}) => {
  const t = TRANSLATIONS[currentLang];
  const founderFamily = churchStorage.getFounderFamily();
  const scheduleItems = churchStorage.getPastorSchedule().filter((s) => s.enabled);
  const pastorMember = founderFamily.members.find((m) => m.relation === 'Founder/Pastor');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const todayDayName = daysOfWeek[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState<string>(todayDayName);

  const activeItem = scheduleItems.find((s) => s.day === selectedDay) || scheduleItems[0];

  return (
    <section id="pastor-schedule-section" className="mb-8">
      {/* 1. Header Card with Pastor Daniel Nagashetty Photo & Pastor/Family Photo */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Subtle decorative cross and light aura */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-6 top-6 text-white/10 text-8xl font-black select-none pointer-events-none">
          ✝
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Pastor Photo with Upload Control */}
          <div className="shrink-0 flex flex-col items-center">
            <PastorPortrait
              photoUrl={pastorMember?.photoUrl}
              size="hero"
              showUploadButton={true}
              className="ring-4 ring-white/30 rounded-2xl shadow-2xl"
            />
            <span className="mt-2 text-[11px] font-semibold text-sky-200 tracking-wide bg-white/15 px-3 py-0.5 rounded-full backdrop-blur-xs">
              Founder & Senior Pastor
            </span>
          </div>

          {/* Details & Family Profile Link */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.weeklyScheduleSubtitle}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1 font-['Cinzel',serif]">
              {t.pastorScheduleTitle}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-xl mb-4">
              {founderFamily.pastorBio.slice(0, 160)}...
            </p>

            {/* Pastor and Family Quick Summary */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15 max-w-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Pastoral Family
                </span>
                <button
                  onClick={onOpenFounderFamily}
                  className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  View Full Profile <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Family members chips (strictly: Wife Dorka Rani, Blessy Daughter - no "eldest", Benny Son) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                <div className="bg-white/10 rounded-xl p-2">
                  <p className="text-[10px] text-sky-200 uppercase font-bold">Pastor</p>
                  <p className="text-xs font-bold text-white truncate">Pastor Daniel</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <p className="text-[10px] text-sky-200 uppercase font-bold">Wife</p>
                  <p className="text-xs font-bold text-white truncate">Dorka Rani</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <p className="text-[10px] text-sky-200 uppercase font-bold">Daughter</p>
                  <p className="text-xs font-bold text-white truncate">Blessy</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <p className="text-[10px] text-sky-200 uppercase font-bold">Son</p>
                  <p className="text-xs font-bold text-white truncate">Benny</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pastor Daniel Nagashetty Weekly Schedule */}
      <div className="mt-4 bg-[var(--color-surface)] rounded-3xl p-5 sm:p-6 border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-text)]">
                {t.pastorScheduleTitle} — {t.weeklyScheduleSubtitle}
              </h3>
              <p className="text-[11px] text-[var(--color-muted)]">
                Official pastoral appointments, counseling, prayer vigils & services
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenScheduleEditor}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Schedule</span>
            </button>
          )}
        </div>

        {/* Days of week selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {scheduleItems.map((item) => {
            const isSelected = selectedDay === item.day;
            const isToday = todayDayName === item.day;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedDay(item.day)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex flex-col items-center min-w-[72px] border ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm scale-102'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider">{item.day.slice(0, 3)}</span>
                <span className="text-xs">{item.day}</span>
                {isToday && (
                  <span className={`text-[9px] px-1 rounded-sm mt-0.5 ${isSelected ? 'bg-white text-blue-900 font-extrabold' : 'text-amber-500 font-bold'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day activity card */}
        {activeItem && (
          <div className="mt-4 p-4 rounded-2xl bg-[var(--color-primary-light)]/40 border border-[var(--color-border)] animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white inline-block w-fit">
                {activeItem.day} Activity
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary-dark)] dark:text-sky-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeItem.time}</span>
              </div>
            </div>

            <h4 className="text-base font-bold text-[var(--color-text)] mb-1">
              {activeItem.title}
            </h4>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-3">
              {activeItem.description}
            </p>

            <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] bg-[var(--color-surface)] px-3 py-1.5 rounded-xl border border-[var(--color-border)] w-fit">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{activeItem.location}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
