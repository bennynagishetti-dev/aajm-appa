import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  QrCode,
  Building,
  CreditCard,
  Copy,
  Check,
  Upload,
  Heart,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';

interface OfferingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  initialCategory?: string;
}

export const OfferingsModal: React.FC<OfferingsModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  initialCategory = 'Church Offering',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [customAmount, setCustomAmount] = useState<string>('1000');
  const [donorName, setDonorName] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const qrFileInputRef = useRef<HTMLInputElement>(null);
  const paymentSettings = churchStorage.getPaymentSettings();

  if (!isOpen) return null;

  const categories = [
    'Church Offering',
    'Support Poor & Needy People',
    'Medical/Emergency Support',
    'Food & Essentials',
    'Education Support',
    'Other Donation',
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          churchStorage.updatePaymentSettings({
            ...paymentSettings,
            qrScannerImage: result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim() || !donorName.trim()) {
      setErrorMessage('Please enter your full Name and Payment Reference/Transaction ID.');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    const amt = parseFloat(customAmount) || 0;
    churchStorage.submitDonation({
      donorName: donorName.trim(),
      category: selectedCategory,
      amount: amt,
      referenceNumber: referenceNumber.trim(),
      purpose: notes,
    });

    setErrorMessage(null);
    setSubmittedStatus('Donation reference successfully submitted! Receipt pending verification.');
    setTimeout(() => {
      setSubmittedStatus(null);
      setReferenceNumber('');
      setNotes('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight font-['Cinzel',serif]">
                Offerings & Donations
              </h2>
              <p className="text-xs text-emerald-100">
                Official AAJM Church Tithes & Benevolence Accounts
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text)] mb-2">
              Select Donation Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <p className="truncate">{cat}</p>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code and UPI Information */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            {/* Left: Official QR scanner image */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
              <input
                type="file"
                ref={qrFileInputRef}
                onChange={handleQrUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="w-44 h-44 rounded-2xl bg-white p-3 shadow-md border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                {paymentSettings.qrScannerImage ? (
                  <img
                    src={paymentSettings.qrScannerImage}
                    alt="Official Church QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* Standard high-contrast UPI QR representation */
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-800">
                    <QrCode className="w-24 h-24 mb-1 text-emerald-700" />
                    <span className="text-[10px] font-bold text-slate-700">Scan to Pay via UPI</span>
                    <span className="text-[9px] text-slate-500">GPay, PhonePe, Paytm</span>
                  </div>
                )}

                {isAdmin && (
                  <button
                    onClick={() => qrFileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Upload Official QR</span>
                  </button>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => qrFileInputRef.current?.click()}
                  className="mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Upload Official QR Scanner
                </button>
              )}
            </div>

            {/* Right: UPI details */}
            <div className="sm:col-span-7 flex flex-col justify-center space-y-2.5">
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--color-muted)]">
                  Primary Church UPI ID
                </p>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-[var(--color-border)] mt-0.5">
                  <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {paymentSettings.upiId}
                  </span>
                  <button
                    onClick={() => handleCopy(paymentSettings.upiId, 'upi')}
                    className="p-1 text-[var(--color-muted)] hover:text-emerald-600 cursor-pointer"
                  >
                    {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-[var(--color-border)] text-center">
                  <p className="text-[9px] text-[var(--color-muted)] font-bold">Google Pay</p>
                  <p className="text-[10px] font-bold text-[var(--color-text)] truncate">{paymentSettings.googlePay}</p>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-[var(--color-border)] text-center">
                  <p className="text-[9px] text-[var(--color-muted)] font-bold">PhonePe</p>
                  <p className="text-[10px] font-bold text-[var(--color-text)] truncate">{paymentSettings.phonePe}</p>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-[var(--color-border)] text-center">
                  <p className="text-[9px] text-[var(--color-muted)] font-bold">Paytm</p>
                  <p className="text-[10px] font-bold text-[var(--color-text)] truncate">{paymentSettings.paytm}</p>
                </div>
              </div>

              <p className="text-[10px] text-[var(--color-muted)] italic leading-tight">
                {paymentSettings.instructions}
              </p>
            </div>
          </div>

          {/* Official Bank Account Details */}
          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <h4 className="font-bold text-xs text-[var(--color-text)] flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[var(--color-primary)]" />
              Direct Bank Transfer Details (NEFT / RTGS / IMPS)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[var(--color-muted)] font-bold">Bank Name</p>
                  <p className="font-bold text-[var(--color-text)]">{paymentSettings.bankName}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[var(--color-muted)] font-bold">Account Holder</p>
                  <p className="font-bold text-[var(--color-text)] truncate">{paymentSettings.accountName}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[var(--color-muted)] font-bold">Account Number</p>
                  <p className="font-mono font-bold text-xs text-[var(--color-text)]">{paymentSettings.accountNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(paymentSettings.accountNumber, 'acc')}
                  className="p-1 text-[var(--color-muted)] hover:text-emerald-600 cursor-pointer"
                >
                  {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[var(--color-muted)] font-bold">IFSC Code</p>
                  <p className="font-mono font-bold text-xs text-[var(--color-text)]">{paymentSettings.ifsc}</p>
                </div>
                <button
                  onClick={() => handleCopy(paymentSettings.ifsc, 'ifsc')}
                  className="p-1 text-[var(--color-muted)] hover:text-emerald-600 cursor-pointer"
                >
                  {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Reference / Transaction for Official Receipt */}
          <form onSubmit={handleSubmitReference} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <h4 className="font-bold text-xs text-[var(--color-text)] flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              Submit Payment Reference for 80G Tax Receipt
            </h4>

            {errorMessage && (
              <div className="p-3 bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 rounded-xl font-semibold flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                {errorMessage}
              </div>
            )}

            {submittedStatus && (
              <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                {submittedStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Rao"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  Amount Transferred (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  UPI Ref / UTR / Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 628192019481"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--color-muted)] mb-1">
                  Optional Purpose Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thanksgiving offering"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Submit Payment Reference
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
