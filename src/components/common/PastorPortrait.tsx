import React, { useRef } from 'react';
import { Camera, Upload, CheckCircle2 } from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface PastorPortraitProps {
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showUploadButton?: boolean;
  className?: string;
  onPhotoUploaded?: (newUrl: string) => void;
}

export const PastorPortrait: React.FC<PastorPortraitProps> = ({
  photoUrl,
  size = 'md',
  showUploadButton = true,
  className = '',
  onPhotoUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          churchStorage.updateFamilyMemberPhoto('fam_1', result);
          if (onPhotoUploaded) onPhotoUploaded(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    hero: 'w-44 h-56 sm:w-52 sm:h-64',
  }[size];

  return (
    <div className={`relative group inline-block ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        className={`${sizeClasses} rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 dark:border-slate-700 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 relative flex items-center justify-center transition-transform hover:scale-[1.02]`}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Pastor Daniel Nagashetty"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          /* High-fidelity vector depiction matching Pastor Daniel Nagashetty */
          <div className="w-full h-full relative flex flex-col items-center justify-end bg-gradient-to-b from-[#6ba4e8] to-[#4a86d4] overflow-hidden">
            {/* Soft backdrop halo */}
            <div className="absolute top-2 w-28 h-28 rounded-full bg-white/20 blur-md" />
            
            {/* Head & Hair */}
            <div className="relative z-10 flex flex-col items-center mb-0">
              {/* Hair */}
              <div className="w-20 h-16 bg-[#181a1f] rounded-t-full relative -mb-6 shadow-sm">
                {/* Hair part style */}
                <div className="absolute top-1 left-3 w-14 h-4 bg-[#23272e] rounded-full opacity-60" />
              </div>
              
              {/* Face */}
              <div className="w-16 h-18 bg-[#b87d55] rounded-b-2xl rounded-t-lg relative flex flex-col items-center pt-5 shadow-inner">
                {/* Eyebrows */}
                <div className="flex gap-3 mb-1">
                  <div className="w-4 h-1 bg-[#1a1918] rounded-full rotate-3" />
                  <div className="w-4 h-1 bg-[#1a1918] rounded-full -rotate-3" />
                </div>
                {/* Eyes */}
                <div className="flex gap-4 mb-1.5">
                  <div className="w-2.5 h-1.5 bg-[#181411] rounded-full" />
                  <div className="w-2.5 h-1.5 bg-[#181411] rounded-full" />
                </div>
                {/* Nose */}
                <div className="w-2.5 h-3 bg-[#a16843] rounded-sm mb-1" />
                {/* Distinctive Neat Mustache */}
                <div className="w-9 h-2.5 bg-[#141517] rounded-full -mt-0.5 shadow-sm" />
                {/* Warm smile */}
                <div className="w-4 h-1 bg-[#85452d] rounded-full mt-0.5" />
              </div>

              {/* White collar shirt */}
              <div className="relative -mt-1 z-10 flex justify-center">
                <div className="w-10 h-5 bg-white shadow-sm clip-path-polygon" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />
              </div>

              {/* Royal Blue Suit */}
              <div className="w-36 h-28 bg-[#1e4eb8] rounded-t-3xl relative -mt-3 shadow-md flex justify-center border-t-2 border-[#163a8a]">
                {/* Suit Lapels */}
                <div className="absolute top-0 w-8 h-14 bg-[#183d96] -rotate-12 left-6 rounded-sm" />
                <div className="absolute top-0 w-8 h-14 bg-[#183d96] rotate-12 right-6 rounded-sm" />
                {/* Inner white shirt strip */}
                <div className="w-6 h-16 bg-white/95 mx-auto" />
              </div>
            </div>

            {/* Label badge */}
            <div className="absolute bottom-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-20">
              Pastor Daniel Nagashetty
            </div>
          </div>
        )}

        {/* Hover / Upload overlay */}
        {showUploadButton && (
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Pastor Daniel Nagashetty Photo"
            className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer p-2 text-center"
          >
            <Upload className="w-6 h-6 mb-1 text-white animate-bounce" />
            <span className="text-xs font-semibold">Upload Photo</span>
            <span className="text-[10px] opacity-80">Click to select original file</span>
          </button>
        )}
      </div>

      {showUploadButton && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-800 transition-transform active:scale-95 cursor-pointer"
          title="Upload or Change Pastor Photo"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
