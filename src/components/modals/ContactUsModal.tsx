import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  Copy,
  ExternalLink,
  Users,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Pastoral Care & Counseling');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const church = churchStorage.getChurchProfile();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;

    churchStorage.addNotification({
      title: `Contact Inquiry: ${department}`,
      message: `Message from ${name} (${phone || 'No phone'}): ${message.slice(0, 80)}...`,
      type: 'notice',
      priority: 'normal',
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const emergencyPastoralNumber = '+91 98490 12345';
  const churchOfficeNumber = '+91 94401 23456';
  const whatsappNumber = '919849012345';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-700 via-blue-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight font-['Cinzel',serif]">
                Contact AAJM Church
              </h2>
              <p className="text-xs text-sky-100">
                Pastor Daniel Nagashetty Helpline & Church Ministry Office
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[var(--color-text)]">
          {/* 1. Emergency Pastoral Helpline */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white uppercase tracking-wider">
                  24/7 Prayer Line
                </span>
                <h4 className="font-extrabold text-sm text-[var(--color-text)]">
                  Pastor Daniel Nagashetty Direct Pastoral Helpline
                </h4>
              </div>
              <p className="text-[11px] text-[var(--color-muted)] mt-1">
                For urgent hospital visits, emergency sick prayers, and spiritual counseling.
              </p>
              <div className="flex items-center gap-2 mt-2 font-mono font-bold text-sm text-[var(--color-primary)]">
                <Phone className="w-4 h-4" />
                <span>{emergencyPastoralNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${emergencyPastoralNumber}`}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
              <button
                onClick={() => handleCopy(emergencyPastoralNumber, 'pastor_phone')}
                className="p-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] text-[var(--color-text)] cursor-pointer"
                title="Copy phone number"
              >
                {copiedKey === 'pastor_phone' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Pastoral Family Ministry Directory */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[var(--color-text)] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
              Pastoral Family & Department Contacts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase">Senior Pastor</p>
                <p className="font-bold text-xs">Pastor Daniel Nagashetty</p>
                <p className="text-[11px] text-[var(--color-muted)]">Pastoral counseling, sermons, dedication</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-1">📞 {emergencyPastoralNumber}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase">Women Fellowship</p>
                <p className="font-bold text-xs">Sister Dorka Rani</p>
                <p className="text-[11px] text-[var(--color-muted)]">Intercessory fasting & family counseling</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-1">📞 {churchOfficeNumber}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase">Choir & Worship</p>
                <p className="font-bold text-xs">Sister Blessy</p>
                <p className="text-[11px] text-[var(--color-muted)]">Sanctuary choir, music ministry, youth</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-1">✉️ blessy@aajmchurch.org</p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase">Youth & Media</p>
                <p className="font-bold text-xs">Brother Benny Nagashetty</p>
                <p className="text-[11px] text-[var(--color-muted)]">Youth fellowship, live broadcasts & audio</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-1">✉️ benny@aajmchurch.org</p>
              </div>
            </div>
          </div>

          {/* 3. Quick Communication Channels (WhatsApp, Email, Office) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Praise the Lord Pastor Daniel Nagashetty, I would like to connect with AAJM Church.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 transition-colors flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs group-hover:text-emerald-600 transition-colors">
                  WhatsApp Chat
                </p>
                <p className="text-[10px] text-[var(--color-muted)] truncate">Quick prayer requests</p>
              </div>
            </a>

            <a
              href={`mailto:${church.contactEmail || 'info@aajmchurch.org'}`}
              className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500 transition-colors flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs group-hover:text-blue-600 transition-colors">
                  Church Email
                </p>
                <p className="text-[10px] text-[var(--color-muted)] truncate">{church.contactEmail || 'info@aajmchurch.org'}</p>
              </div>
            </a>

            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-[var(--color-text)]">Office Timings</p>
                <p className="text-[10px] text-[var(--color-muted)]">Daily: 09:00 AM - 08:00 PM</p>
              </div>
            </div>
          </div>

          {/* 4. Sanctuary Physical Location */}
          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-[var(--color-text)]">Sanctuary Address</h5>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed mt-0.5">
                  {church.address}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const query = encodeURIComponent(`${church.name}, ${church.address}`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
              }}
              className="px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Directions
            </button>
          </div>

          {/* 5. Contact / Pastoral Message Form */}
          <form onSubmit={handleSendMessage} className="p-4 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] space-y-3">
            <h4 className="font-bold text-xs text-[var(--color-text)] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[var(--color-primary)]" />
              Send a Message to Church Office & Pastoral Team
            </h4>

            {sentSuccess && (
              <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 rounded-xl font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                Thank you! Your message has been safely received by the pastoral team.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[10px] text-[var(--color-muted)] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brother Samuel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[10px] text-[var(--color-muted)] mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="text"
                  placeholder="+91 94401 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[10px] text-[var(--color-muted)] mb-1">
                Department / Inquiry Topic
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs text-[var(--color-text)] font-semibold"
              >
                <option value="Pastoral Care & Counseling">Pastoral Care & Personal Counseling</option>
                <option value="Prayer Request / Hospital Visit">Prayer Request / Urgent Hospital Visit</option>
                <option value="Child Dedication / Baptism">Child Dedication / Holy Baptism Inquiry</option>
                <option value="Youth Fellowship & Music">Youth Fellowship & Music Ministry</option>
                <option value="Tithe / 80G Receipt Inquiry">Tithe & Offering / 80G Receipt</option>
                <option value="General Inquiry">General Church Ministry Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[10px] text-[var(--color-muted)] mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Write your question, prayer request, or appointment inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl text-xs text-[var(--color-text)] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-opacity cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Message to Pastoral Office</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
