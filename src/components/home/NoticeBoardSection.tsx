import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Search,
  Share2,
  Calendar,
  Clock,
  User,
  Filter,
  Eye,
  Check,
  PlusCircle,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { NoticeItem, NoticeCategory } from '../../types';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface NoticeBoardSectionProps {
  currentLang: AppLanguage;
  isAdmin: boolean;
  onOpenCreateNotice?: () => void;
}

export const NoticeBoardSection: React.FC<NoticeBoardSectionProps> = ({
  currentLang,
  isAdmin,
  onOpenCreateNotice,
}) => {
  const t = TRANSLATIONS[currentLang];
  const allNotices = churchStorage.getNotices().filter((n) => n.status === 'Published');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: string[] = ['All', 'Important', 'Emergency', 'Events', 'Prayer', 'Church', 'Groups', 'General'];

  const filteredNotices = allNotices.filter((n) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Emergency'
        ? n.priority === 'Emergency'
        : selectedCategory === 'Important'
        ? n.priority === 'Important'
        : n.category === selectedCategory;

    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleShare = (notice: NoticeItem) => {
    const text = `📢 AAJM CHURCH NOTICE: ${notice.title}\n\n${notice.description}\n\nDate: ${notice.date} | ${notice.time}\nIssued by: ${notice.author}`;
    if (navigator.share) {
      navigator.share({ title: notice.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="notice-board-section" className="mb-8">
      <div className="bg-[var(--color-surface)] rounded-3xl p-5 sm:p-6 border border-[var(--color-border)] shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-[var(--color-text)] font-['Cinzel',serif]">
                  {t.noticeBoard}
                </h3>
                <span className="text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-muted)]">
                Official announcements, pastoral letters, prayer alerts & updates
              </p>
            </div>
          </div>

          {isAdmin && onOpenCreateNotice && (
            <button
              onClick={onOpenCreateNotice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer w-fit"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Notice</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-2.5 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search announcements, dates, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] text-[var(--color-text)] pl-10 pr-4 py-2 rounded-xl text-xs placeholder:text-[var(--color-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-[var(--color-primary-light)]/30 text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        <div className="space-y-3">
          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center bg-[var(--color-primary-light)]/20 rounded-2xl border border-dashed border-[var(--color-border)]">
              <p className="text-xs font-medium text-[var(--color-muted)]">
                No announcements found matching the selected filter.
              </p>
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const isEmergency = notice.priority === 'Emergency';
              const isImportant = notice.priority === 'Important';

              return (
                <article
                  key={notice.id}
                  className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                    isEmergency
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                      : isImportant
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isEmergency
                            ? 'bg-red-600 text-white animate-pulse'
                            : isImportant
                            ? 'bg-amber-500 text-white'
                            : 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-sky-300'
                        }`}
                      >
                        {notice.category}
                      </span>
                      {isEmergency && (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Emergency
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleShare(notice)}
                      className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50 transition-colors cursor-pointer"
                      title="Share notice"
                    >
                      {copiedId === notice.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--color-text)] mb-1">
                    {notice.title}
                  </h4>

                  <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-3">
                    {notice.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]/60">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-[var(--color-primary)]" />
                        <span className="font-medium text-[var(--color-text)]">{notice.author}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{notice.date}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] opacity-75">
                      <Eye className="w-3 h-3" />
                      <span>{notice.viewsCount} views</span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
