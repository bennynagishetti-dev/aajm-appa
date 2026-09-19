import React, { useState } from 'react';
import {
  BookOpenCheck,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { BookingItem, BookingType } from '../../types';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface BookingScreenProps {
  currentLang: AppLanguage;
  isAdmin: boolean;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ currentLang, isAdmin }) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'new_booking' | 'my_bookings'>('new_booking');

  const bookingTypes: BookingType[] = [
    'Pastoral Counseling',
    'Prayer Meeting Slot',
    'House Visit / Family Prayer',
    'Baby Dedication',
    'Water Baptism',
    'Wedding / Marriage Blessing',
    'Church Hall / Facility Booking',
    'Other Appointment',
  ];

  const currentUser = churchStorage.getCurrentUser();
  const [bookingType, setBookingType] = useState<BookingType>('Pastoral Counseling');
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [userName, setUserName] = useState(currentUser.name);
  const [phone, setPhone] = useState('+91 98490 12345');
  const [email, setEmail] = useState('member@aajmchurch.org');
  const [preferredDate, setPreferredDate] = useState('2026-09-24');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [altDate, setAltDate] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [address, setAddress] = useState('');
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  const bookings = churchStorage.getBookings();

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '05:30 PM - 06:30 PM',
    '07:00 PM - 08:00 PM',
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double booking check
    const existing = bookings.find(
      (b) =>
        b.preferredDate === preferredDate &&
        b.timeSlot === timeSlot &&
        b.bookingType === bookingType &&
        b.status !== 'Cancelled'
    );

    if (existing) {
      alert('This exact slot has already been requested or confirmed. Please pick another time slot or alternative date.');
      return;
    }

    const [startSlot = '10:00', endSlot = '11:00'] = timeSlot.split(' - ');
    churchStorage.createBooking({
      name: userName,
      userName,
      phoneNumber: phone,
      phone,
      location: bookingType === 'House Visit / Family Prayer' ? address : 'AAJM Church Office',
      bookingDate: preferredDate,
      preferredDate,
      startTime: startSlot,
      endTime: endSlot,
      timeSlot,
      bookingType,
      email,
      alternativeDate: altDate,
      attendeesCount: attendees,
      purpose,
      homeAddress: bookingType === 'House Visit / Family Prayer' ? address : undefined,
      memberId: churchStorage.getCurrentUser().id,
    });

    setConfirmationNotice('Appointment request submitted successfully! Pastoral office will confirm shortly.');
    setTimeout(() => {
      setConfirmationNotice(null);
      setActiveTab('my_bookings');
    }, 2500);
  };

  const handleCancel = (bookingId: string) => {
    churchStorage.updateBookingStatus(bookingId, 'Cancelled');
    setCancelConfirmId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-text)] font-['Cinzel',serif]">
            {t.booking}
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Schedule pastoral counseling, baptism, home blessing visits, and hall bookings
          </p>
        </div>

        <div className="flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('new_booking')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new_booking'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            New Request
          </button>
          <button
            onClick={() => setActiveTab('my_bookings')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my_bookings'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Booking History ({bookings.length})
          </button>
        </div>
      </div>

      {activeTab === 'new_booking' ? (
        <form onSubmit={handleBookingSubmit} className="bg-[var(--color-surface)] rounded-3xl p-5 sm:p-7 border border-[var(--color-border)] shadow-sm space-y-5 text-xs">
          {confirmationNotice && (
            <div className="p-4 bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300 rounded-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <span>{confirmationNotice}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--color-text)] mb-2">
              Select Appointment / Ministry Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {bookingTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setBookingType(type)}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    bookingType === type
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)] dark:text-sky-300 font-bold shadow-xs'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <p className="truncate">{type}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Number of Attendees
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Preferred Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {bookingType === 'House Visit / Family Prayer' && (
            <div>
              <label className="block font-bold text-[var(--color-text)] mb-1">
                Home Address for Pastoral Visit *
              </label>
              <textarea
                required
                rows={2}
                placeholder="House / Flat No., Landmark, Street, Colony..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-3 rounded-xl text-xs text-[var(--color-text)]"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-[var(--color-text)] mb-1">
              Purpose / Specific Prayer Points
            </label>
            <textarea
              rows={3}
              placeholder="Brief details regarding the meeting purpose so Pastor Daniel Nagashetty can prepare..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-3 rounded-xl text-xs text-[var(--color-text)]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-90 text-white font-extrabold text-sm shadow-md transition-opacity cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Submit Appointment Request</span>
          </button>
        </form>
      ) : (
        /* My Bookings History */
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-primary)]">
                    Ref #{b.id}
                  </span>
                  <h4 className="text-base font-bold text-[var(--color-text)]">
                    {b.bookingType}
                  </h4>
                </div>

                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase w-fit ${
                    b.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                      : b.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[var(--color-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>{b.preferredDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{b.timeSlot}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Assigned: {b.assignedPastor || 'Pastor Daniel Nagashetty'}</span>
                </div>
              </div>

              {b.purpose && (
                <p className="text-xs text-[var(--color-muted)] bg-[var(--color-primary-light)]/20 p-2.5 rounded-xl">
                  <strong>Notes:</strong> {b.purpose}
                </p>
              )}

              {b.adminNotes && (
                <p className="text-xs text-[var(--color-primary)] bg-[var(--color-primary-light)]/40 p-2.5 rounded-xl font-medium">
                  <strong>Pastoral Office Note:</strong> {b.adminNotes}
                </p>
              )}

              {b.status !== 'Cancelled' && (
                <div className="pt-2 flex items-center justify-end gap-2">
                  {cancelConfirmId === b.id ? (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 p-1.5 px-3 rounded-xl border border-red-200 dark:border-red-900/50">
                      <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Cancel request?</span>
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 cursor-pointer"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        onClick={() => setCancelConfirmId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-[var(--color-text)] font-semibold text-[10px] cursor-pointer"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCancelConfirmId(b.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Appointment
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
