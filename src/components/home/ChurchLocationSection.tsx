import React from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface ChurchLocationSectionProps {
  currentLang: AppLanguage;
}

export const ChurchLocationSection: React.FC<ChurchLocationSectionProps> = ({
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const church = churchStorage.getChurchProfile();

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${church.name}, ${church.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section id="church-location-section" className="mb-12">
      <div className="bg-[var(--color-surface)] rounded-3xl p-5 sm:p-7 border border-[var(--color-border)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[var(--color-text)] font-['Cinzel',serif]">
                {t.churchLocation}
              </h3>
              <p className="text-[11px] text-[var(--color-muted)]">
                Visit AAJM Church Sanctuary for fellowship and prayers
              </p>
            </div>
          </div>

          <button
            onClick={handleGetDirections}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer w-fit"
          >
            <Navigation className="w-4 h-4" />
            <span>{t.directions}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Map Visualization */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-slate-100 dark:bg-slate-800 relative h-64 sm:h-72">
            {/* Visual SVG Map Canvas representation */}
            <div className="w-full h-full relative flex items-center justify-center bg-[#e5ecf5] dark:bg-[#1a2333] overflow-hidden">
              {/* Grid Roads */}
              <svg className="w-full h-full opacity-40 dark:opacity-20 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                {/* Major Arterial Roads */}
                <path d="M 0 100 Q 150 120 400 80 T 800 140" fill="none" stroke="#cbd5e1" strokeWidth="12" />
                <path d="M 200 0 L 250 400" fill="none" stroke="#cbd5e1" strokeWidth="10" />
                <path d="M 120 0 Q 300 180 500 400" fill="none" stroke="#94a3b8" strokeWidth="6" />
              </svg>

              {/* Church Marker Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800">
                  <span className="text-xl font-bold">✝</span>
                </div>
                <div className="mt-1 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-xs flex items-center gap-1.5 whitespace-nowrap">
                  <span>{church.name}</span>
                </div>
              </div>

              {/* Map controls badge */}
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                Lat: 17.4399° N, Lng: 78.4983° E (Secunderabad)
              </div>
            </div>
          </div>

          {/* Right: Address & Service Timings */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[var(--color-text)] mb-0.5">
                      Sanctuary Address
                    </h5>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      {church.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[var(--color-muted)] font-bold">Pastoral Helpline</p>
                    <p className="font-semibold text-[var(--color-text)] truncate">{church.contactPhone.split('/')[0]}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[var(--color-muted)] font-bold">Email</p>
                    <p className="font-semibold text-[var(--color-text)] truncate">{church.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Services Summary */}
            <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <h5 className="text-xs font-bold text-[var(--color-text)] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Primary Worship Timings
              </h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[var(--color-muted)]">
                  <span>Sunday Morning Service</span>
                  <span className="font-bold text-[var(--color-text)]">07:30 AM & 10:00 AM</span>
                </div>
                <div className="flex justify-between items-center text-[var(--color-muted)]">
                  <span>Friday Fasting & Deliverance</span>
                  <span className="font-bold text-[var(--color-text)]">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center text-[var(--color-muted)]">
                  <span>Wednesday Bible Study</span>
                  <span className="font-bold text-[var(--color-text)]">06:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
