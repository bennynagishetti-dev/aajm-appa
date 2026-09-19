import React, { useState } from 'react';
import {
  X,
  Shield,
  Calendar,
  Bell,
  Coins,
  BookOpenCheck,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  QrCode,
  Upload,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { PastorScheduleItem, NoticeCategory, NoticePriority } from '../../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'schedule' | 'notices' | 'bookings' | 'payment';
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'schedule',
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'notices' | 'bookings' | 'payment'>(defaultTab);

  // Schedule state
  const [scheduleItems, setScheduleItems] = useState<PastorScheduleItem[]>(
    churchStorage.getPastorSchedule()
  );
  const [newDay, setNewDay] = useState('Monday');
  const [newTime, setNewTime] = useState('06:00 PM - 08:00 PM');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLoc, setNewLoc] = useState('AAJM Main Sanctuary');

  // Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeCat, setNoticeCat] = useState<NoticeCategory>('Important');
  const [noticePriority, setNoticePriority] = useState<NoticePriority>('Important');
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState(churchStorage.getBookings());

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState(churchStorage.getPaymentDetails());
  const [donations, setDonations] = useState(churchStorage.getDonationRecords());
  const [paymentSaveSuccess, setPaymentSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePaymentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    churchStorage.savePaymentDetails(paymentDetails);
    setPaymentSaveSuccess(true);
    setTimeout(() => setPaymentSaveSuccess(false), 2500);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (url) {
          const updated = { ...paymentDetails, qrScannerImage: url, qrCodeUrl: url };
          setPaymentDetails(updated);
          churchStorage.savePaymentDetails(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyDonationRecord = (id: string, status: 'verified' | 'rejected') => {
    churchStorage.verifyDonation(id, status);
    setDonations(churchStorage.getDonationRecords());
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: PastorScheduleItem = {
      id: `sch_${Date.now()}`,
      day: newDay as PastorScheduleItem['day'],
      time: newTime,
      title: newTitle,
      description: newDesc,
      location: newLoc,
      enabled: true,
      order: scheduleItems.length + 1,
    };

    const updated = [...scheduleItems, newItem];
    churchStorage.savePastorSchedule(updated);
    setScheduleItems(updated);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = scheduleItems.filter((s) => s.id !== id);
    churchStorage.savePastorSchedule(updated);
    setScheduleItems(updated);
  };

  const handleToggleSchedule = (id: string) => {
    const updated = scheduleItems.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    churchStorage.savePastorSchedule(updated);
    setScheduleItems(updated);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeDesc) return;

    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    churchStorage.addNotice({
      title: noticeTitle,
      description: noticeDesc,
      category: noticeCat,
      priority: noticePriority,
      author: 'Church Administration',
      status: 'Published',
      audience: 'Everyone',
      date: today,
      time: timeNow,
      publishDate: today,
    });

    setNoticeSuccess(true);
    setTimeout(() => {
      setNoticeSuccess(false);
      setNoticeTitle('');
      setNoticeDesc('');
    }, 2500);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Confirmed' | 'Cancelled') => {
    churchStorage.updateBookingStatus(id, status);
    setBookings(churchStorage.getBookings());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight font-['Cinzel',serif]">
                AAJM Church Administration
              </h2>
              <p className="text-xs text-sky-200">
                Pastor Daniel Nagashetty's Schedule, Notices & Approvals
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)] px-4 sm:px-6 bg-[var(--color-surface)] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Calendar className="w-4 h-4" /> Weekly Schedule
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notices'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Bell className="w-4 h-4" /> Post Notices
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" /> Booking Approvals ({bookings.filter((b) => b.status === 'Pending').length})
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payment'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Coins className="w-4 h-4" /> Giving & UPI Setup
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Add Schedule Item */}
              <form onSubmit={handleAddSchedule} className="p-4 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] space-y-3">
                <h4 className="font-bold text-sm text-[var(--color-text)]">
                  Add / Update Pastor Daniel Nagashetty Weekly Schedule
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Day of Week</label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded-xl text-xs text-[var(--color-text)]"
                    >
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Location</label>
                    <input
                      type="text"
                      value={newLoc}
                      onChange={(e) => setNewLoc(e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastoral Counseling & Deliverance"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the pastoral schedule activity..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl text-xs text-[var(--color-text)]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add to Schedule
                </button>
              </form>

              {/* Existing Schedule Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[var(--color-text)]">Current Weekly Schedule Items</h4>
                {scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-blue-600">{item.day}</span>
                        <span className="text-[10px] text-[var(--color-muted)]">({item.time})</span>
                        {!item.enabled && (
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm">Disabled</span>
                        )}
                      </div>
                      <h5 className="font-bold text-xs text-[var(--color-text)] mt-0.5 truncate">{item.title}</h5>
                      <p className="text-[11px] text-[var(--color-muted)] truncate">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleSchedule(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          item.enabled ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.enabled ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <form onSubmit={handlePostNotice} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
              <h4 className="font-bold text-sm text-[var(--color-text)]">Broadcast New Official Notice</h4>

              {noticeSuccess && (
                <div className="p-3 bg-green-100 text-green-800 rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Official Notice Published & Broadcasted to members!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">Category</label>
                  <select
                    value={noticeCat}
                    onChange={(e) => setNoticeCat(e.target.value as NoticeCategory)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-2 rounded-xl text-xs"
                  >
                    <option value="Important">Important</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Church">Church</option>
                    <option value="Events">Events</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Groups">Groups</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as NoticePriority)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-2 rounded-xl text-xs"
                  >
                    <option value="Important">Important</option>
                    <option value="Emergency">Emergency (Push Notification)</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-muted)] mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Revival Meetings with Pastor Daniel Nagashetty"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--color-muted)] mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Full text of the pastoral announcement..."
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] p-3 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Publish Notice Immediately
              </button>
            </form>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[var(--color-text)]">
                Appointment Requests & Approvals
              </h4>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-[var(--color-text)]">{b.userName}</span>
                      <span className="text-[10px] text-[var(--color-muted)] ml-2">({b.phone})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : b.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-primary)] font-semibold">
                    {b.bookingType} • {b.preferredDate} ({b.timeSlot})
                  </p>

                  {b.purpose && <p className="text-[11px] text-[var(--color-muted)]">Notes: {b.purpose}</p>}

                  {b.status === 'Pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                        className="px-3 py-1 rounded-xl bg-green-600 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Approve & Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                        className="px-3 py-1 rounded-xl bg-red-600 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              {/* Payment Details Form */}
              <form
                onSubmit={handleSavePaymentDetails}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text)]">
                      Church Bank & UPI Configuration
                    </h4>
                    <p className="text-[11px] text-[var(--color-muted)]">
                      Configure official bank details, UPI ID, and QR code for church offerings and tithes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    Save Changes
                  </button>
                </div>

                {paymentSaveSuccess && (
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 font-bold text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Church payment credentials saved successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                      Official Church UPI ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentDetails.upiId}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                      GPay / PhonePe / Paytm Number
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.phonePe || ''}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, phonePe: e.target.value, googlePay: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.bankName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.accountName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, accountName: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.accountNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.ifsc}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, ifsc: e.target.value.toUpperCase() })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-mono uppercase"
                    />
                  </div>
                </div>

                {/* QR Code Upload / Preview */}
                <div className="pt-2 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-white p-2 border border-slate-300 flex items-center justify-center shrink-0">
                    {paymentDetails.qrCodeUrl ? (
                      <img
                        src={paymentDetails.qrCodeUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="w-12 h-12 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-xs text-[var(--color-text)] mb-1">
                      Update Church Offering QR Scanner Image
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)] mb-3">
                      Upload your official PhonePe, GPay, or BharatQR image for members to scan.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-primary-light)] cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      <span>Upload QR Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </form>

              {/* Donation / Offering Verification List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-500" />
                    Member Contribution Submissions ({donations.length})
                  </h4>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    {donations.filter((d) => d.status === 'pending').length} pending approval
                  </span>
                </div>

                {donations.length === 0 ? (
                  <div className="p-8 text-center bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-muted)]">No donation records submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {donations.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-[var(--color-text)]">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                              {item.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === 'verified'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                  : item.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {item.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-[11px] text-[var(--color-muted)]">
                            From: <strong className="text-[var(--color-text)]">{item.donorName}</strong> ({item.donorPhone || item.donorEmail || 'No contact'}) • Ref: <strong className="font-mono">{item.referenceNumber}</strong> ({item.paymentMethod}) • Date: {item.date}
                          </p>
                          {item.notes && (
                            <p className="text-[10px] text-[var(--color-muted)] mt-0.5">
                              Prayer Note: {item.notes}
                            </p>
                          )}
                        </div>

                        {item.status === 'pending' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleVerifyDonationRecord(item.id, 'verified')}
                              className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyDonationRecord(item.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
