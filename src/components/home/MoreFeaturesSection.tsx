import React from 'react';
import {
  Image,
  HeartHandshake,
  Tv,
  Coins,
  ShieldAlert,
  Building,
  Phone,
  Users,
  FileText,
  QrCode,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../../localization';

export type FeatureModalType =
  | 'photos_media'
  | 'prayer_request'
  | 'live_services'
  | 'offerings'
  | 'support_poor'
  | 'bank_details'
  | 'contact_us'
  | 'founder_family'
  | 'documents'
  | 'attendance'
  | null;

interface MoreFeaturesSectionProps {
  currentLang: AppLanguage;
  onSelectFeature: (feature: FeatureModalType) => void;
}

export const MoreFeaturesSection: React.FC<MoreFeaturesSectionProps> = ({
  currentLang,
  onSelectFeature,
}) => {
  const t = TRANSLATIONS[currentLang];

  const features = [
    {
      id: 'photos_media' as FeatureModalType,
      title: t.photosAndMedia,
      description: 'Church event albums, youth gatherings, and video archives',
      icon: Image,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'prayer_request' as FeatureModalType,
      title: t.prayerRequest,
      description: 'Submit confidential or public requests to prayer warriors',
      icon: HeartHandshake,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      badge: 'Active Intercession',
    },
    {
      id: 'live_services' as FeatureModalType,
      title: t.liveServices,
      description: 'Watch Sunday worship and mid-week broadcasts live',
      icon: Tv,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400',
      badge: 'Sunday 10 AM',
    },
    {
      id: 'offerings' as FeatureModalType,
      title: t.offeringsAndDonations,
      description: 'Official UPI, QR scanner image, and church tithe accounts',
      icon: Coins,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'support_poor' as FeatureModalType,
      title: t.supportPoorAndNeedy,
      description: 'Charity food hampers, medical aids, and widow support fund',
      icon: ShieldAlert,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'bank_details' as FeatureModalType,
      title: t.bankDetails,
      description: 'Official SBI account number, IFSC code, and branch details',
      icon: Building,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'contact_us' as FeatureModalType,
      title: t.contactUs,
      description: 'Pastoral counseling helpline, WhatsApp, and email contacts',
      icon: Phone,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      id: 'founder_family' as FeatureModalType,
      title: t.founderAndFamily,
      description: 'Pastor Daniel Nagashetty, Dorka Rani, Blessy, Benny profile',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      badge: 'Ministry History',
    },
    {
      id: 'documents' as FeatureModalType,
      title: t.documents,
      description: 'Sermon study notes, Bible reading plans, and PDF guidelines',
      icon: FileText,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    },
    {
      id: 'attendance' as FeatureModalType,
      title: t.attendance,
      description: 'Digital QR check-in for Sunday service & Sunday school',
      icon: QrCode,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <section id="more-features-section" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-lg text-[var(--color-text)] font-['Cinzel',serif]">
            {t.moreFeatures}
          </h3>
          <p className="text-[11px] text-[var(--color-muted)]">
            Explore church ministries, offerings, media, and community outreach
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectFeature(item.id)}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {item.title}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                {item.badge && (
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-sky-300">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
