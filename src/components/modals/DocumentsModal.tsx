import React, { useState } from 'react';
import { X, FileText, Download, Check, BookOpen, ExternalLink } from 'lucide-react';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({ isOpen, onClose }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const docs = [
    {
      id: 'doc_1',
      title: 'AAJM Church Constitution & Statement of Faith',
      category: 'Guidelines',
      size: '1.2 MB PDF',
      date: '2026 Edition',
    },
    {
      id: 'doc_2',
      title: 'Pastor Daniel Nagashetty - Expository Study of Romans',
      category: 'Sermon Notes',
      size: '840 KB PDF',
      date: 'Sep 2026',
    },
    {
      id: 'doc_3',
      title: 'Annual Bible Reading Schedule (Telugu & English)',
      category: 'Bible Study',
      size: '2.1 MB PDF',
      date: '365 Day Plan',
    },
    {
      id: 'doc_4',
      title: 'Sunday School Teacher Curriculum & VBS Handbook',
      category: 'Education',
      size: '3.4 MB PDF',
      date: 'Semester 2',
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedId(id);
      setTimeout(() => setDownloadedId(null), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-3xl shadow-2xl border border-[var(--color-border)] p-5 sm:p-6 overflow-hidden text-xs">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm text-[var(--color-text)]">Church Documents & Resources</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--color-primary-light)] text-[var(--color-muted)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {docs.map((d) => (
            <div
              key={d.id}
              className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between gap-3 hover:border-teal-500 transition-colors"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                  {d.category}
                </span>
                <h5 className="font-bold text-xs text-[var(--color-text)] mt-1 truncate">{d.title}</h5>
                <p className="text-[10px] text-[var(--color-muted)] mt-0.5">{d.size} • {d.date}</p>
              </div>

              <button
                onClick={() => handleDownload(d.id, d.title)}
                disabled={downloadingId === d.id}
                className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                title="Download document"
              >
                {downloadingId === d.id ? (
                  <span className="text-[10px] animate-pulse">Saving...</span>
                ) : downloadedId === d.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
