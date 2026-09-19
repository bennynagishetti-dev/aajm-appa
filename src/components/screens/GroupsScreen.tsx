import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  MessageSquare,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Pin,
  Shield,
  Search,
  Check,
  CheckCheck,
  Mic,
  Image as ImageIcon,
  MoreVertical,
  Volume2,
  VolumeX,
  UserX,
  FileText,
  Calendar,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { FellowshipGroup, GroupMessage } from '../../types';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface GroupsScreenProps {
  currentLang: AppLanguage;
  onStartCall: () => void;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({ currentLang, onStartCall }) => {
  const t = TRANSLATIONS[currentLang];
  const allGroups: FellowshipGroup[] = churchStorage.getFellowshipGroups();
  const currentUser = churchStorage.getCurrentUser();

  const [activeGroupId, setActiveGroupId] = useState<string>(allGroups[0]?.id || 'group_youth');
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'chat' | 'info'>('chat');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeGroup: FellowshipGroup = allGroups.find((g: FellowshipGroup) => g.id === activeGroupId) || allGroups[0];

  const isLeader =
    activeGroup.leaderId === currentUser.id ||
    currentUser.role === 'Admin' ||
    currentUser.role === 'Super Admin' ||
    currentUser.role === 'Group Leader';

  // Load messages for current group
  useEffect(() => {
    const msgs = churchStorage.getGroupMessages(activeGroupId);
    setMessages(msgs);
  }, [activeGroupId]);

  // Listen for real-time cross-tab broadcasts
  useEffect(() => {
    const unsubscribe = churchStorage.subscribe(() => {
      const msgs = churchStorage.getGroupMessages(activeGroupId);
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [activeGroupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    churchStorage.sendGroupMessage(activeGroupId, inputText.trim(), 'text');
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleSendVoiceNote = () => {
    churchStorage.sendGroupMessage(
      activeGroupId,
      '🎙️ Voice prayer / audio reflection (0:45)',
      'file'
    );
  };

  const handleSendPhoto = () => {
    churchStorage.sendGroupMessage(
      activeGroupId,
      '📷 Attached ministry photograph',
      'image'
    );
  };

  const handleReaction = (messageId: string, emoji: string) => {
    churchStorage.reactToMessage(activeGroupId, messageId, emoji);
  };

  const handlePin = (messageId: string) => {
    if (isLeader) {
      churchStorage.pinMessage(activeGroupId, messageId);
    }
  };

  const pinnedMessage = messages.find((m) => m.isPinned);

  const emojis = ['🙏', '❤️', '🔥', 'Amen', '🙌', '✝️', '✨'];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-24 h-[calc(100vh-5rem)] flex flex-col">
      <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Groups List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--color-border)] flex flex-col shrink-0">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-black text-[var(--color-text)] font-['Cinzel',serif] flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--color-primary)]" />
              <span>{t.groups}</span>
            </h2>
            <p className="text-[11px] text-[var(--color-muted)]">
              Real-time ministry fellowship channels
            </p>

            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fellowship groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] pl-8 pr-3 py-1.5 rounded-xl text-xs text-[var(--color-text)] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {allGroups
              .filter((g: FellowshipGroup) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((group: FellowshipGroup) => {
                const isSelected = group.id === activeGroupId;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setActiveGroupId(group.id);
                      setActiveView('chat');
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white shadow-xs'
                        : 'hover:bg-[var(--color-primary-light)]/30 text-[var(--color-text)]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                      }`}
                    >
                      {group.name.slice(0, 1)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs truncate">{group.name}</h4>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[var(--color-muted)]'}`}>
                          {group.membersCount}m
                        </span>
                      </div>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-[var(--color-muted)]'}`}>
                        {group.category} • Leader: {group.leaderName}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Area: Active Chat or Group Info */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-surface)]">
          {/* Group Header */}
          <div className="p-3.5 px-5 border-b border-[var(--color-border)] flex items-center justify-between gap-3 bg-[var(--color-surface)]">
            <div
              onClick={() => setActiveView(activeView === 'chat' ? 'info' : 'chat')}
              className="flex items-center gap-3 min-w-0 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-sky-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {activeGroup.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                  {activeGroup.name}
                </h3>
                <p className="text-[10px] text-[var(--color-muted)] flex items-center gap-1.5 truncate">
                  <span>{activeGroup.membersCount} members</span>
                  <span>•</span>
                  <span>Leader: {activeGroup.leaderName}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions (Audio / Video calls / Info toggle) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onStartCall}
                className="p-2 rounded-xl bg-[var(--color-primary-light)]/40 hover:bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-sky-300 transition-colors cursor-pointer"
                title="Voice Call Fellowship"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={onStartCall}
                className="p-2 rounded-xl bg-[var(--color-primary-light)]/40 hover:bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-sky-300 transition-colors cursor-pointer"
                title="Video Conference Room"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView(activeView === 'chat' ? 'info' : 'chat')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  activeView === 'info'
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
                title="Group Details & Leader Controls"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeView === 'chat' ? (
            /* Chat View */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Pinned Message Bar */}
              {pinnedMessage && (
                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2 truncate">
                    <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-bold">Pinned:</span>
                    <span className="truncate">{pinnedMessage.text}</span>
                  </div>
                </div>
              )}

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                    >
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-[var(--color-muted)]">
                          {msg.senderName}
                        </span>
                        <span className="text-[9px] text-[var(--color-muted)] opacity-70">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl max-w-[85%] sm:max-w-md text-xs relative ${
                          isMe
                            ? 'bg-[var(--color-primary)] text-white rounded-br-xs'
                            : 'bg-[var(--color-primary-light)]/30 text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-xs'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* Reactions row */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-black/10 dark:border-white/10">
                            {msg.reactions.map((r, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-0.5 text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-md"
                              >
                                <span>{r.emoji}</span>
                                <span className="font-bold">{r.count}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message Hover Quick Actions */}
                      <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleReaction(msg.id, '🙏')}
                          className="text-[10px] hover:scale-125 transition-transform cursor-pointer"
                        >
                          🙏
                        </button>
                        <button
                          onClick={() => handleReaction(msg.id, 'Amen')}
                          className="text-[10px] hover:scale-125 transition-transform cursor-pointer font-bold"
                        >
                          Amen
                        </button>
                        <button
                          onClick={() => handleReaction(msg.id, '❤️')}
                          className="text-[10px] hover:scale-125 transition-transform cursor-pointer"
                        >
                          ❤️
                        </button>
                        {isLeader && (
                          <button
                            onClick={() => handlePin(msg.id)}
                            className="text-[10px] text-[var(--color-muted)] hover:text-amber-500 cursor-pointer ml-1"
                            title="Pin message"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                {showEmojiPicker && (
                  <div className="flex gap-2 p-2 mb-2 bg-[var(--color-primary-light)]/30 rounded-xl">
                    {emojis.map((em) => (
                      <button
                        key={em}
                        onClick={() => {
                          setInputText((prev) => prev + ' ' + em);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg hover:scale-125 transition-transform cursor-pointer px-1"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendPhoto}
                    className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    title="Send Photo"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendVoiceNote}
                    className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    title="Record Voice Note"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    placeholder={`Message #${activeGroup.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-[var(--color-primary-light)]/20 border border-[var(--color-border)] px-4 py-2 rounded-2xl text-xs text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />

                  <button
                    type="submit"
                    className="p-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-90 text-white shadow-xs transition-opacity cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Group Info & Leader Controls View */
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              <div>
                <h4 className="font-bold text-sm text-[var(--color-text)] mb-1">
                  About {activeGroup.name}
                </h4>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  {activeGroup.description}
                </p>
              </div>

              {/* Leader Controls Panel */}
              {isLeader && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <h5 className="font-bold text-amber-900 dark:text-amber-200">
                      Leader & Host Moderation Controls
                    </h5>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    As an appointed Leader/Host, you can moderate this group, schedule video meetings, and manage announcements.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => alert('All participants muted by Leader.')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <VolumeX className="w-3.5 h-3.5" /> Mute All
                    </button>
                    <button
                      onClick={onStartCall}
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Start Group Meeting
                    </button>
                  </div>
                </div>
              )}

              {/* Members List */}
              <div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-3 flex items-center justify-between">
                  <span>Group Members ({activeGroup.membersCount})</span>
                  <span className="text-[10px] text-[var(--color-muted)]">Active Fellowship</span>
                </h4>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        {activeGroup.leaderName.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-text)]">{activeGroup.leaderName}</p>
                        <p className="text-[10px] text-amber-600 font-bold">Group Leader / Pastor</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">
                        {currentUser.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-text)]">{currentUser.name} (You)</p>
                        <p className="text-[10px] text-[var(--color-muted)]">{currentUser.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
