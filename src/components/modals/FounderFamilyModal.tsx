import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Calendar,
  Award,
  BookOpen,
  Camera,
  Heart,
  Users,
  CheckCircle,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { PastorPortrait } from '../common/PastorPortrait';

interface FounderFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export const FounderFamilyModal: React.FC<FounderFamilyModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'family' | 'history' | 'timeline'>('family');
  const founderFamily = churchStorage.getFounderFamily();

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  if (!isOpen) return null;

  const handlePhotoUpload = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          churchStorage.updateFamilyMemberPhoto(memberId, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight font-['Cinzel',serif]">
                Founder & Pastoral Family
              </h2>
              <p className="text-xs text-sky-100">
                Pastor Daniel Nagashetty & Family Ministry Heritage
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--color-border)] px-4 sm:px-6 bg-[var(--color-surface)]">
          <button
            onClick={() => setActiveTab('family')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'family'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Pastoral Family
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Church & Ministry History
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Ministry Timeline
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'family' && (
            <div className="space-y-6">
              {/* Pastor Daniel Portrait Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-primary-light)]/30 border border-[var(--color-border)] flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <PastorPortrait
                  photoUrl={founderFamily.members.find((m) => m.relation === 'Founder/Pastor')?.photoUrl}
                  size="hero"
                  showUploadButton={true}
                  className="shrink-0"
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold mb-1">
                    Founder & Senior Pastor
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--color-text)] mb-2 font-['Cinzel',serif]">
                    Pastor Daniel Nagashetty
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-4">
                    {founderFamily.pastorBio}
                  </p>

                  {isAdmin && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-[var(--color-border)] w-fit">
                      <Camera className="w-4 h-4" />
                      <span>Use original photographs uploaded by Church Administrator.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Family Members Grid */}
              <div>
                <h4 className="font-bold text-sm text-[var(--color-text)] mb-3 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Pastoral Family Members
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {founderFamily.members
                    .filter((m) => m.relation !== 'Founder/Pastor')
                    .map((member) => (
                      <div
                        key={member.id}
                        className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col items-center text-center relative group"
                      >
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[member.id] = el;
                          }}
                          onChange={(e) => handlePhotoUpload(member.id, e)}
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Member Photo or Avatar */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative mb-3 border-2 border-[var(--color-border)]">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-tr from-[var(--color-primary)] to-sky-400 text-white">
                              {member.name.slice(0, 1)}
                            </div>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() => fileInputRefs.current[member.id]?.click()}
                              className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                            >
                              <Upload className="w-4 h-4 mb-0.5" />
                              Upload
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] uppercase font-bold text-[var(--color-primary)] tracking-wider">
                          {member.relation}
                        </span>

                        <h5 className="font-bold text-sm text-[var(--color-text)] mb-1">
                          {member.name}
                        </h5>

                        <p className="text-[11px] text-[var(--color-muted)] leading-snug">
                          {member.bio}
                        </p>

                        {isAdmin && (
                          <button
                            onClick={() => fileInputRefs.current[member.id]?.click()}
                            className="mt-3 text-[10px] font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            Upload Photo
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)]">
                <h4 className="font-bold text-sm mb-2 text-[var(--color-primary-dark)] dark:text-sky-300">
                  Church History
                </h4>
                <p className="text-[var(--color-muted)]">{founderFamily.churchHistory}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)]">
                <h4 className="font-bold text-sm mb-2 text-[var(--color-primary-dark)] dark:text-sky-300">
                  Ministry History & Global Vision
                </h4>
                <p className="text-[var(--color-muted)]">{founderFamily.ministryHistory}</p>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {founderFamily.familyTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-xs font-black text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-md">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex-1 p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <h5 className="font-bold text-xs sm:text-sm text-[var(--color-text)] mb-0.5">
                      {item.title}
                    </h5>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      {item.description}
                    </p>
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
