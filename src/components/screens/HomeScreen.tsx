import React, { useState } from 'react';
import { PastorScheduleSection } from '../home/PastorScheduleSection';
import { NoticeBoardSection } from '../home/NoticeBoardSection';
import { MoreFeaturesSection, FeatureModalType } from '../home/MoreFeaturesSection';
import { ChurchLocationSection } from '../home/ChurchLocationSection';
import { FounderFamilyModal } from '../modals/FounderFamilyModal';
import { OfferingsModal } from '../modals/OfferingsModal';
import { PrayerRequestModal } from '../modals/PrayerRequestModal';
import { LiveServicesModal } from '../modals/LiveServicesModal';
import { PhotosMediaModal } from '../modals/PhotosMediaModal';
import { AttendanceModal } from '../modals/AttendanceModal';
import { DocumentsModal } from '../modals/DocumentsModal';
import { ContactUsModal } from '../modals/ContactUsModal';
import { AppLanguage } from '../../localization';
import { UserRole } from '../../types';

interface HomeScreenProps {
  currentLang: AppLanguage;
  currentRole: UserRole;
  onOpenScheduleEditor: () => void;
  onOpenAdmin: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLang,
  currentRole,
  onOpenScheduleEditor,
  onOpenAdmin,
}) => {
  const [activeModal, setActiveModal] = useState<FeatureModalType>(null);
  const [initialOfferingCategory, setInitialOfferingCategory] = useState<string>('Church Offering');

  const isAdmin = currentRole === 'Admin' || currentRole === 'Super Admin';

  const handleSelectFeature = (feat: FeatureModalType) => {
    if (feat === 'support_poor') {
      setInitialOfferingCategory('Support Poor & Needy People');
      setActiveModal('offerings');
      return;
    }
    if (feat === 'bank_details') {
      setInitialOfferingCategory('Church Offering');
      setActiveModal('offerings');
      return;
    }
    setActiveModal(feat);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* 1. PASTOR DANIEL NAGASHETTY & WEEKLY SCHEDULE */}
      <PastorScheduleSection
        currentLang={currentLang}
        onOpenFounderFamily={() => setActiveModal('founder_family')}
        onOpenScheduleEditor={onOpenScheduleEditor}
        isAdmin={isAdmin}
      />

      {/* 2. NOTICE BOARD */}
      <NoticeBoardSection
        currentLang={currentLang}
        isAdmin={isAdmin}
        onOpenCreateNotice={onOpenAdmin}
      />

      {/* 3. MORE FEATURES */}
      <MoreFeaturesSection
        currentLang={currentLang}
        onSelectFeature={handleSelectFeature}
      />

      {/* 4. CHURCH LOCATION */}
      <ChurchLocationSection currentLang={currentLang} />

      {/* Modals triggered from Home Features */}
      <FounderFamilyModal
        isOpen={activeModal === 'founder_family'}
        onClose={() => setActiveModal(null)}
        isAdmin={isAdmin}
      />

      <OfferingsModal
        isOpen={activeModal === 'offerings'}
        onClose={() => setActiveModal(null)}
        isAdmin={isAdmin}
        initialCategory={initialOfferingCategory}
      />

      <PrayerRequestModal
        isOpen={activeModal === 'prayer_request'}
        onClose={() => setActiveModal(null)}
        isAdmin={isAdmin}
      />

      <LiveServicesModal
        isOpen={activeModal === 'live_services'}
        onClose={() => setActiveModal(null)}
      />

      <PhotosMediaModal
        isOpen={activeModal === 'photos_media'}
        onClose={() => setActiveModal(null)}
        isAdmin={isAdmin}
      />

      <AttendanceModal
        isOpen={activeModal === 'attendance'}
        onClose={() => setActiveModal(null)}
      />

      <DocumentsModal
        isOpen={activeModal === 'documents'}
        onClose={() => setActiveModal(null)}
      />

      <ContactUsModal
        isOpen={activeModal === 'contact_us'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
