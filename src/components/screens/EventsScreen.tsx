import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  Share2,
  Check,
  Search,
  CheckCircle,
  ExternalLink,
  PlusCircle,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { ChurchEvent } from '../../types';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface EventsScreenProps {
  currentLang: AppLanguage;
  isAdmin: boolean;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ currentLang, isAdmin }) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [eventsList, setEventsList] = useState<ChurchEvent[]>(churchStorage.getEvents());

  // Add event modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Worship');
  const [newSpeaker, setNewSpeaker] = useState('Pastor Daniel Nagashetty');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('10:00 AM - 01:00 PM');
  const [newLocation, setNewLocation] = useState('AAJM Main Sanctuary, Secunderabad');
  const [newDescription, setNewDescription] = useState('');
  const [newCapacity, setNewCapacity] = useState('500');
  const [newBannerUrl, setNewBannerUrl] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80');

  const categories = [
    'All',
    'Worship',
    'Youth',
    'Fasting Prayer',
    'Special Meeting',
    'Sunday School',
    'Outreach',
    'Women Fellowship',
    'Men Fellowship',
  ];

  const now = new Date().toISOString().split('T')[0];

  const filteredEvents = eventsList.filter((ev) => {
    const eventDate = ev.date || ev.startDate || '';
    const isPast = (ev.endDate || eventDate) < now || ev.status === 'Completed';
    const tabMatch = activeTab === 'upcoming' ? !isPast : isPast;

    const catMatch = selectedCategory === 'All' ? true : ev.category === selectedCategory;
    const speaker = ev.speaker || ev.organizer || '';
    const searchMatch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase());

    return tabMatch && catMatch && searchMatch;
  });

  const handleRegister = (eventId: string) => {
    churchStorage.registerForEvent(eventId);
    setEventsList(churchStorage.getEvents());
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    churchStorage.addEvent({
      title: newTitle.trim(),
      category: newCategory,
      speaker: newSpeaker,
      organizer: newSpeaker || 'AAJM Ministries',
      date: newDate,
      startDate: newDate,
      startTime: newTime,
      endTime: newTime.includes('-') ? newTime.split('-')[1].trim() : '01:00 PM',
      location: newLocation,
      description: newDescription || 'Join us for praise, worship, and the Word of God at AAJM Church Sanctuary.',
      capacity: parseInt(newCapacity) || 500,
      bannerUrl: newBannerUrl,
      imageUrl: newBannerUrl,
      status: 'Upcoming',
    });

    setEventsList(churchStorage.getEvents());
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleShare = (event: ChurchEvent) => {
    const eventDate = event.date || event.startDate || '';
    const speaker = event.speaker || event.organizer || 'Pastor Daniel Nagashetty';
    const text = `📅 AAJM CHURCH EVENT: ${event.title}\nSpeaker: ${speaker}\nDate: ${eventDate} at ${event.startTime}\nLocation: ${event.location}\nRegister now in the AAJM Church App!`;
    if (navigator.share) {
      navigator.share({ title: event.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddToCalendar = (event: ChurchEvent) => {
    const eventDate = (event.date || event.startDate || now).replace(/-/g, '');
    const startTimeClean = (event.startTime || '10:00').replace(':', '');
    const startIso = `${eventDate}T${startTimeClean}00`;
    const speaker = event.speaker || event.organizer || 'Pastor Daniel Nagashetty';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startIso}/${startIso}&details=${encodeURIComponent(
      `${event.description}\nSpeaker: ${speaker}`
    )}&location=${encodeURIComponent(event.location)}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-text)] font-['Cinzel',serif]">
            {t.events}
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Sunday worships, youth conventions, fasting prayers & gospel revivals
          </p>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          )}

          {/* Upcoming vs Past Toggle */}
          <div className="flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {t.upcomingEvents}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {t.pastEvents}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-2.5 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title, speaker, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] pl-10 pr-4 py-2 rounded-xl text-xs placeholder:text-[var(--color-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
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
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-[var(--color-surface)] rounded-3xl border border-dashed border-[var(--color-border)]">
            <CalendarIcon className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-[var(--color-muted)]">
              No {activeTab} events found in this category.
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <article
              key={event.id}
              className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row"
            >
              {/* Event Image Banner */}
              <div className="md:w-64 h-48 md:h-auto relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                <img
                  src={event.bannerUrl || event.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {event.category}
                </span>
                {(event.registrationFee === 'Free' || !event.registrationFee) && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                    Free Entry
                  </span>
                )}
              </div>

              {/* Event Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-extrabold text-base text-[var(--color-text)]">
                      {event.title}
                    </h3>
                    <button
                      onClick={() => handleShare(event)}
                      className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors cursor-pointer"
                      title="Share Event"
                    >
                      {copiedId === event.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--color-muted)] mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      <span>{event.startDate || event.date} ({event.startTime})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      <span>Leader: {event.speaker || event.organizer || 'Pastor Daniel Nagashetty'}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
                    <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>
                      <strong>{event.currentRegistered ?? event.rsvpCount ?? 0}</strong> registered
                      {(event.maxCapacity || event.capacity) && ` / ${event.maxCapacity || event.capacity} capacity`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCalendar(event)}
                      className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      + Calendar
                    </button>

                    {(event.isRegistered || event.isRsvpd) ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id)}
                        className="px-4 py-1.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold shadow-xs transition-opacity cursor-pointer"
                      >
                        Register / RSVP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Add Event Modal for Administrators */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-3xl shadow-2xl border border-[var(--color-border)] p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-[var(--color-text)]">Create Church Event</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-[var(--color-primary-light)] text-[var(--color-muted)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All-Night Revival & Healing Service"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                    Speaker / Minister
                  </label>
                  <input
                    type="text"
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                    Time Slot *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM - 01:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details about worship, special choir, fasting instructions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] font-semibold hover:bg-[var(--color-primary-light)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
