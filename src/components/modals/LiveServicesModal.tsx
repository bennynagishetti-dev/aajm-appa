import React from 'react';
import { X, Tv, Play, Radio, Calendar, Share2, ExternalLink } from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface LiveServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveServicesModal: React.FC<LiveServicesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const church = churchStorage.getChurchProfile();

  const streams = [
    {
      id: 'live_1',
      title: 'Sunday Celebration Worship & Holy Communion',
      minister: 'Pastor Daniel Nagashetty',
      time: 'Sunday, 10:00 AM IST',
      isLiveNow: false,
      embedUrl: 'https://www.youtube.com/embed/live_stream?channel=AAJMChurch',
      youtubeUrl: church.socialLinks.youtube || 'https://youtube.com/@aajmchurch',
    },
    {
      id: 'live_2',
      title: 'Friday Fasting & Deliverance Live Service',
      minister: 'Pastor Daniel Nagashetty & Pastoral Team',
      time: 'Friday, 10:30 AM IST',
      isLiveNow: false,
      youtubeUrl: church.socialLinks.youtube || 'https://youtube.com/@aajmchurch',
    },
    {
      id: 'live_3',
      title: 'Mid-Week Expository Bible Study: Epistle to Ephesians',
      minister: 'Pastor Daniel Nagashetty',
      time: 'Wednesday, 06:30 PM IST',
      isLiveNow: false,
      youtubeUrl: church.socialLinks.youtube || 'https://youtube.com/@aajmchurch',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              <Tv className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight font-['Cinzel',serif]">
                AAJM Live Services
              </h2>
              <p className="text-xs text-red-100">
                Official YouTube & High-Definition Live Broadcasts
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Main Broadcast Player Representation */}
          <div className="rounded-2xl overflow-hidden bg-black aspect-video relative flex flex-col items-center justify-center text-white p-4 shadow-lg group">
            <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl mb-3 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Broadcast Room</span>
            </div>
            <h3 className="font-bold text-sm text-center max-w-md">
              AAJM Church Official Live Service Stream
            </h3>
            <p className="text-[11px] text-slate-300 mt-1">
              Stream scheduled every Sunday at 07:30 AM & 10:00 AM IST
            </p>
          </div>

          {/* Service Links List */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[var(--color-text)] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-600" />
              Scheduled Live Streams & Archives
            </h4>

            {streams.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between gap-3 hover:border-red-400 transition-colors"
              >
                <div>
                  <h5 className="font-bold text-xs text-[var(--color-text)] mb-0.5">{s.title}</h5>
                  <p className="text-[11px] text-[var(--color-muted)]">{s.minister}</p>
                  <p className="text-[10px] text-red-600 font-bold mt-1">{s.time}</p>
                </div>

                <a
                  href={s.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                >
                  <span>Watch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
