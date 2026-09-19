import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Mail,
  Building,
  Edit3,
  ExternalLink,
  Share2,
  Check,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface LocationScreenProps {
  currentLang: AppLanguage;
  isAdmin: boolean;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({ currentLang, isAdmin }) => {
  const t = TRANSLATIONS[currentLang];
  const church = churchStorage.getChurchProfile();

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState(church.address);
  const [editPhone, setEditPhone] = useState(church.contactPhone);
  const [editEmail, setEditEmail] = useState(church.contactEmail);

  const handleDirections = () => {
    const query = encodeURIComponent(`${church.name}, ${church.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleShare = () => {
    const text = `⛪ ${church.name}\n📍 Address: ${church.address}\n📞 Phone: ${church.contactPhone}\n✉️ Email: ${church.contactEmail}`;
    if (navigator.share) {
      navigator.share({ title: church.name, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    churchStorage.updateChurchProfile({
      ...church,
      address: editAddress,
      contactPhone: editPhone,
      contactEmail: editEmail,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-text)] font-['Cinzel',serif]">
            {t.location}
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Official sanctuary address, transit directions, and pastoral office hours
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-[var(--color-primary-light)] text-[var(--color-text)] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Location'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-[var(--color-primary-light)] text-[var(--color-text)] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>Share</span>
          </button>

          <button
            onClick={handleDirections}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.directions}</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 text-xs">
          <h4 className="font-bold text-sm text-[var(--color-text)]">Edit Church Location Details (Admin)</h4>
          <div>
            <label className="block font-bold text-[var(--color-muted)] mb-1">Sanctuary Address</label>
            <textarea
              rows={3}
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-3 rounded-xl text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--color-muted)] mb-1">Phone</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--color-muted)] mb-1">Email</label>
              <input
                type="text"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>
          <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold cursor-pointer">
            Save Location Information
          </button>
        </form>
      ) : null}

      {/* Map Card */}
      <div className="rounded-3xl overflow-hidden border border-[var(--color-border)] bg-slate-100 dark:bg-slate-800 shadow-sm relative h-80">
        <div className="w-full h-full relative flex items-center justify-center bg-[#e5ecf5] dark:bg-[#1a2333] overflow-hidden">
          <svg className="w-full h-full opacity-40 dark:opacity-20 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="loc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loc-grid)" />
            <path d="M 0 120 Q 200 160 500 100 T 900 180" fill="none" stroke="#cbd5e1" strokeWidth="16" />
            <path d="M 300 0 L 320 500" fill="none" stroke="#cbd5e1" strokeWidth="12" />
            <path d="M 180 0 Q 380 200 650 500" fill="none" stroke="#94a3b8" strokeWidth="8" />
          </svg>

          {/* Marker */}
          <div className="relative z-10 flex flex-col items-center animate-bounce">
            <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800">
              <span className="text-2xl font-bold">✝</span>
            </div>
            <div className="mt-1 px-4 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-xs flex items-center gap-1.5">
              <span>{church.name} Sanctuary</span>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-3 rounded-2xl border border-[var(--color-border)] shadow-md text-xs">
            <p className="font-bold text-[var(--color-text)]">Secunderabad / Hyderabad Region</p>
            <p className="text-[10px] text-[var(--color-muted)]">Near Railway Station / Metro Pillar 104</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address & Office */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[var(--color-primary)]" />
            <h4 className="font-extrabold text-sm text-[var(--color-text)] font-['Cinzel',serif]">
              Sanctuary & Secretariat
            </h4>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)]">
            <p className="font-bold text-[var(--color-text)] mb-1">Physical Address</p>
            <p className="text-[var(--color-muted)] leading-relaxed">{church.address}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-[var(--color-muted)]">
              <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>{church.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[var(--color-muted)]">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{church.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Regular Services & Office Hours */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h4 className="font-extrabold text-sm text-[var(--color-text)] font-['Cinzel',serif]">
              Opening & Worship Schedule
            </h4>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--color-text)]">Sunday 1st Service (Telugu)</p>
                <p className="text-[10px] text-[var(--color-muted)]">Sanctuary Ground Floor</p>
              </div>
              <span className="font-bold text-[var(--color-primary)]">07:30 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--color-text)]">Sunday 2nd Service (Celebration)</p>
                <p className="text-[10px] text-[var(--color-muted)]">Main Auditorium</p>
              </div>
              <span className="font-bold text-[var(--color-primary)]">10:00 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--color-text)]">Friday Fasting Prayer</p>
                <p className="text-[10px] text-[var(--color-muted)]">Prayer Hall</p>
              </div>
              <span className="font-bold text-[var(--color-primary)]">10:30 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--color-text)]">Pastoral Office Counseling</p>
                <p className="text-[10px] text-[var(--color-muted)]">Tuesday - Saturday</p>
              </div>
              <span className="font-bold text-amber-600">10:00 AM - 04:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
