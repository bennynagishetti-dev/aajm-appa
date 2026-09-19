import React, { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  Play,
  Heart,
  Share2,
  Upload,
  ArrowLeft,
  Eye,
  Check,
  Calendar,
  Film,
} from 'lucide-react';

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
}

interface Album {
  id: string;
  title: string;
  date: string;
  coverUrl: string;
  description: string;
  photos: PhotoItem[];
}

interface VideoItem {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  date: string;
  thumbnail: string;
  videoUrl: string;
}

interface PhotosMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export const PhotosMediaModal: React.FC<PhotosMediaModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [copied, setCopied] = useState(false);

  const [albums, setAlbums] = useState<Album[]>([
    {
      id: 'alb_1',
      title: 'Harvest Thanksgiving Celebration Service',
      date: 'Sep 2026',
      description: 'Annual harvest thanksgiving service with praise, choir dedication and family blessings.',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      photos: [
        {
          id: 'p1',
          url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
          caption: 'Sanctuary choir leading opening worship',
          date: 'Sep 13, 2026',
        },
        {
          id: 'p2',
          url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
          caption: 'Pastor Daniel Nagashetty preaching the Thanksgiving Word',
          date: 'Sep 13, 2026',
        },
        {
          id: 'p3',
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          caption: 'Congregational prayer and thanksgiving offering',
          date: 'Sep 13, 2026',
        },
      ],
    },
    {
      id: 'alb_2',
      title: 'Youth Camp & Acoustic Night 2026',
      date: 'Aug 2026',
      description: 'Three days of spiritual revival, campfire worship, and leadership sessions led by Brother Benny.',
      coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      photos: [
        {
          id: 'p4',
          url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
          caption: 'Youth fellowship group discussion',
          date: 'Aug 22, 2026',
        },
        {
          id: 'p5',
          url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
          caption: 'Acoustic evening praise under the stars',
          date: 'Aug 22, 2026',
        },
      ],
    },
    {
      id: 'alb_3',
      title: 'Sunday School VBS Bible Story Exhibition',
      date: 'Jul 2026',
      description: 'Kids presenting Noah’s Ark, David & Goliath models, and scripture recitation awards.',
      coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      photos: [
        {
          id: 'p6',
          url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
          caption: 'Children reciting memory verses with Sister Blessy',
          date: 'Jul 18, 2026',
        },
      ],
    },
    {
      id: 'alb_4',
      title: 'Poor & Needy Food Hamper Distribution',
      date: 'Aug 2026',
      description: 'Charity food grains, blankets, and school kits distribution across neighboring colonies.',
      coverUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      photos: [
        {
          id: 'p7',
          url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
          caption: 'Volunteer team packing rations for 250 families',
          date: 'Aug 05, 2026',
        },
      ],
    },
  ]);

  const videos: VideoItem[] = [
    {
      id: 'v1',
      title: 'Sunday Morning Miracle Service Message',
      speaker: 'Pastor Daniel Nagashetty',
      duration: '48:15',
      date: 'Sep 13, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.youtube.com',
    },
    {
      id: 'v2',
      title: 'AAJM Choir: "How Great Thou Art" Special Rendition',
      speaker: 'Sister Blessy & Choir Team',
      duration: '06:40',
      date: 'Sep 06, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.youtube.com',
    },
    {
      id: 'v3',
      title: 'Testimony: Supernatural Healing & Grace',
      speaker: 'Brother Mark & Family',
      duration: '11:20',
      date: 'Aug 30, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.youtube.com',
    },
  ];

  if (!isOpen) return null;

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedAlbum) {
      const reader = new FileReader();
      reader.onload = (uploadEv) => {
        const result = uploadEv.target?.result as string;
        if (result) {
          const newPhoto: PhotoItem = {
            id: `p_${Date.now()}`,
            url: result,
            caption: 'Uploaded by Church Administrator',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          };
          const updatedAlbums = albums.map((alb) =>
            alb.id === selectedAlbum.id
              ? { ...alb, photos: [newPhoto, ...alb.photos] }
              : alb
          );
          setAlbums(updatedAlbums);
          setSelectedAlbum({ ...selectedAlbum, photos: [newPhoto, ...selectedAlbum.photos] });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareMedia = (title: string) => {
    const text = `📸 AAJM Church Gallery: ${title}\nView more in the official AAJM Church application!`;
    if (navigator.share) {
      navigator.share({ title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {selectedAlbum ? (
              <button
                onClick={() => setSelectedAlbum(null)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white mr-1 cursor-pointer"
                title="Back to all albums"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : null}

            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              {activeTab === 'photos' ? <ImageIcon className="w-5 h-5 text-sky-200" /> : <Film className="w-5 h-5 text-sky-200" />}
            </div>

            <div>
              <h3 className="font-extrabold text-base tracking-tight font-['Cinzel',serif]">
                {selectedAlbum ? selectedAlbum.title : 'AAJM Church Media & Gallery'}
              </h3>
              <p className="text-[11px] text-sky-200">
                {selectedAlbum ? `${selectedAlbum.photos.length} Photographs • ${selectedAlbum.date}` : 'Worship services, youth camps & outreach photographs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher (when not inside an album) */}
        {!selectedAlbum && (
          <div className="flex border-b border-[var(--color-border)] px-4 sm:px-6 bg-[var(--color-surface)]">
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'photos'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Photo Albums ({albums.length})
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'videos'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Play className="w-4 h-4" /> Sermons & Choir Videos ({videos.length})
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* 1. Inside an Album View */}
          {selectedAlbum ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  {selectedAlbum.description}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleShareMedia(selectedAlbum.title)}
                    className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-text)] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>Share</span>
                  </button>

                  {isAdmin && (
                    <label className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedAlbum.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] relative group cursor-pointer aspect-4/3"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white text-[10px]">
                      <p className="font-semibold line-clamp-1">{photo.caption}</p>
                      <span className="opacity-80 text-[9px]">{photo.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'photos' ? (
            /* 2. Photo Albums Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs group hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="h-44 overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                      {album.photos.length} Photos
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 mb-1">
                        {album.title}
                      </h4>
                      <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[var(--color-border)] text-[10px] text-[var(--color-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                        {album.date}
                      </span>
                      <span className="font-semibold text-[var(--color-primary)] flex items-center gap-0.5">
                        <Eye className="w-3 h-3" /> View Album
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 3. Videos List */
            <div className="space-y-3">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--color-primary)] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-28 h-18 rounded-xl overflow-hidden bg-slate-800 relative shrink-0">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1.5 py-0.2 rounded-sm font-mono">
                        {vid.duration}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text)] truncate mb-0.5">
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-[var(--color-primary)] font-semibold">
                        {vid.speaker}
                      </p>
                      <p className="text-[10px] text-[var(--color-muted)] mt-0.5">
                        Recorded on {vid.date} • AAJM Sanctuary Broadcast
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShareMedia(vid.title)}
                    className="px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] text-[var(--color-text)] font-semibold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Video</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Full Photo View Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-white"
          >
            <div className="p-3.5 flex items-center justify-between border-b border-slate-800">
              <div>
                <h4 className="font-bold text-xs">{selectedPhoto.caption}</h4>
                <p className="text-[10px] text-slate-400">{selectedPhoto.date}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
