import React, { useState } from 'react';
import {
  X,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Users,
  MessageSquare,
  Hand,
  Monitor,
  ShieldAlert,
  Volume2,
  Copy,
  Check,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose }) => {
  const [callType, setCallType] = useState<'lobby' | 'active_meeting'>('lobby');
  const [meetingType, setMeetingType] = useState<'video' | 'voice'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentUser = churchStorage.getCurrentUser();
  const isChild = currentUser.role === 'Child';

  if (!isOpen) return null;

  // Requirement 14: "Children must have restricted calling permissions. Do not expose children to unrestricted adult calling."
  if (isChild) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
        <div className="bg-[var(--color-surface)] w-full max-w-md rounded-3xl p-6 text-center shadow-2xl border border-[var(--color-border)]">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-[var(--color-text)] mb-1">
            Child Calling Restriction Active
          </h3>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-5">
            For child protection and safety, unsupervised adult voice and video calls are disabled. Please join through your assigned Sunday School class or ask your parent.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs cursor-pointer"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  const sampleParticipants = [
    { name: currentUser.name, role: currentUser.role, isHost: true, isMuted: isMuted, camera: !isCameraOff },
    { name: 'Pastor Daniel Nagashetty', role: 'Pastor', isHost: false, isMuted: false, camera: true },
    { name: 'Benny Nagashetty', role: 'Youth Leader', isHost: false, isMuted: true, camera: true },
    { name: 'Sister Blessy', role: 'Choir Leader', isHost: false, isMuted: false, camera: true },
  ];

  const meetingUrl = 'https://meet.livekit.io/aajm-fellowship-sanctuary';

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 text-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              {meetingType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm font-['Cinzel',serif]">
                AAJM LiveKit WebRTC Conference
              </h3>
              <p className="text-[10px] text-slate-400">
                Up to 100 Participants • Managed Video/Audio Infrastructure
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {callType === 'lobby' ? (
          /* Lobby view */
          <div className="p-6 space-y-6 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full text-center">
            <div className="space-y-2">
              <h4 className="text-xl font-black">Join Pastoral Fellowship Call</h4>
              <p className="text-xs text-slate-400">
                Select your preferred meeting type or start a live room.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMeetingType('video')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  meetingType === 'video' ? 'bg-blue-600/30 border-blue-500' : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <Video className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <span className="font-bold block text-sm">Video Call / Meeting</span>
                <span className="text-[10px] text-slate-400">Camera + Microphone</span>
              </button>

              <button
                onClick={() => setMeetingType('voice')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  meetingType === 'voice' ? 'bg-blue-600/30 border-blue-500' : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <Phone className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <span className="font-bold block text-sm">Voice Conference</span>
                <span className="text-[10px] text-slate-400">Low-bandwidth Audio</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between text-left">
              <div className="min-w-0 pr-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Meeting Link</p>
                <p className="text-xs font-mono text-blue-300 truncate">{meetingUrl}</p>
              </div>
              <button
                onClick={copyMeetingLink}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setCallType('active_meeting')}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl transition-all cursor-pointer"
            >
              Start / Join Live Meeting
            </button>
          </div>
        ) : (
          /* Active LiveKit Conference View */
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Participants Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1 mb-4">
              {sampleParticipants.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-800 border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner"
                >
                  {p.camera ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xl mb-2 shadow-lg">
                        {p.name.slice(0, 1)}
                      </div>
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      <span className="text-[10px] text-blue-300">{p.role}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <VideoOff className="w-8 h-8 mb-1" />
                      <span className="text-xs">{p.name} (Camera off)</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[10px]">
                    {p.isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                    <span className="truncate max-w-[80px]">{p.name}</span>
                  </div>

                  {p.isHost && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* In-Call Controls Bar */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isCameraOff ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isHandRaised ? 'bg-amber-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsSharingScreen(!isSharingScreen)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isSharingScreen ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCallType('lobby')}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer ml-2 shadow-lg"
                title="Leave Meeting"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
