import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, User, Calendar, MapPin, Sparkles } from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedService, setSelectedService] = useState('Sunday Celebration Service');
  const user = churchStorage.getCurrentUser();

  if (!isOpen) return null;

  const handleCheckIn = () => {
    setCheckedIn(true);
    churchStorage.addNotification({
      title: 'Attendance Recorded',
      message: `Checked in successfully for ${selectedService} on ${new Date().toLocaleDateString()}.`,
      type: 'event',
      priority: 'normal',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-md rounded-3xl shadow-2xl border border-[var(--color-border)] p-5 sm:p-6 overflow-hidden text-center text-xs">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-sm text-[var(--color-text)]">Church Attendance & QR Check-In</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--color-primary-light)] text-[var(--color-muted)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkedIn ? (
          <div className="py-8 space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-base text-[var(--color-text)]">
              Welcome, {user.name}!
            </h4>
            <p className="text-xs text-[var(--color-muted)]">
              Your attendance for <strong>{selectedService}</strong> has been logged to the church records. God bless you!
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-[var(--color-border)] flex flex-col items-center">
              {/* QR Code representation */}
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              <p className="text-[11px] text-[var(--color-muted)] mt-2">
                Scan sanctuary kiosk or tap button below to check in
              </p>
            </div>

            <div className="text-left space-y-2">
              <label className="block text-[10px] font-bold text-[var(--color-muted)]">
                Select Service / Meeting
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              >
                <option value="Sunday Celebration Service">Sunday Celebration Service (10:00 AM)</option>
                <option value="Sunday Morning Telugu Service">Sunday Morning Telugu Service (07:30 AM)</option>
                <option value="Sunday School Kids Class">Sunday School Kids Class (10:00 AM)</option>
                <option value="Friday Fasting & Deliverance">Friday Fasting & Deliverance (10:30 AM)</option>
                <option value="Wednesday Bible Study">Wednesday Bible Study (06:30 PM)</option>
              </select>
            </div>

            <button
              onClick={handleCheckIn}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm My Attendance</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
