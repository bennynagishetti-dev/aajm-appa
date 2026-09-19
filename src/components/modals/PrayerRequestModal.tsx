import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  Lock,
  Globe,
  Send,
  CheckCircle2,
  Clock,
  Heart,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface PrayerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export const PrayerRequestModal: React.FC<PrayerRequestModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'wall'>('submit');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Healing & Health');
  const [requestText, setRequestText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const prayerRequests = churchStorage.getPrayerRequests();
  const currentUser = churchStorage.getCurrentUser();

  if (!isOpen) return null;

  const categories = [
    'Healing & Health',
    'Family Peace',
    'Financial Breakthrough',
    'Job & Career',
    'Deliverance',
    'Children & Salvation',
    'Thanksgiving & Praise',
    'Other Petition',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    churchStorage.addPrayerRequest(
      name.trim() || currentUser.name,
      requestText.trim(),
      category,
      isPrivate,
      contactInfo.trim()
    );

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setRequestText('');
      setName('');
      setContactInfo('');
      setActiveTab('history');
    }, 2000);
  };

  const handlePrayClick = (id: string) => {
    churchStorage.incrementPrayedCount(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-700 via-pink-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight font-['Cinzel',serif]">
                Pastoral Prayer Request
              </h2>
              <p className="text-xs text-rose-100">
                Intercessory Prayer Ministry & Prayer Wall
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)] px-4 sm:px-6 bg-[var(--color-surface)]">
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'submit'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Submit Request
          </button>
          <button
            onClick={() => setActiveTab('wall')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'wall'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Community Prayer Wall
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            My Prayer History
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Your prayer request has been received by Pastor Daniel and the prayer team!
                </div>
              )}

              <div>
                <label className="block font-bold text-[var(--color-text)] mb-1">
                  Your Name (or Leave blank for Anonymous)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sister Grace / Anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--color-text)] mb-1">
                  Prayer Petition Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-text)] mb-1">
                  Prayer Request / Petition *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your spiritual, health, or family need with Pastor Daniel and the intercessory prayer team..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-3 rounded-xl text-xs text-[var(--color-text)] leading-relaxed resize-none"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {isPrivate ? (
                    <Lock className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-rose-500" />
                  )}
                  <div>
                    <p className="font-bold text-[var(--color-text)]">
                      {isPrivate ? 'Confidential / Private Prayer' : 'Share on Church Prayer Wall'}
                    </p>
                    <p className="text-[10px] text-[var(--color-muted)]">
                      {isPrivate
                        ? 'Only Pastor Daniel Nagashetty & pastoral team will view this.'
                        : 'Approved request will be visible for church members to pray.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isPrivate ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isPrivate ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-text)] mb-1">
                  Optional Phone / WhatsApp for Pastoral Follow-up
                </label>
                <input
                  type="text"
                  placeholder="+91 98490 00000"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Prayer Request
              </button>
            </form>
          )}

          {activeTab === 'wall' && (
            <div className="space-y-3">
              {prayerRequests.filter((p) => !p.isPrivate).map((pr) => (
                <div
                  key={pr.id}
                  className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[var(--color-text)]">{pr.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-semibold text-[10px]">
                      {pr.category}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">{pr.request}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/50">
                    <span className="text-[10px] text-[var(--color-muted)]">{pr.date}</span>

                    <button
                      onClick={() => handlePrayClick(pr.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        pr.hasPrayed
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${pr.hasPrayed ? 'fill-current' : ''}`} />
                      <span>{pr.hasPrayed ? 'Prayed' : 'I Prayed'}</span>
                      <span className="text-[10px] opacity-80 font-mono">({pr.prayedCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {prayerRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--color-text)]">{pr.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        pr.status === 'prayed_for'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : pr.status === 'approved'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {pr.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">{pr.request}</p>
                  <div className="text-[10px] text-[var(--color-muted)] flex items-center justify-between">
                    <span>Submitted on: {pr.date}</span>
                    <span>{pr.prayedCount} people prayed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
