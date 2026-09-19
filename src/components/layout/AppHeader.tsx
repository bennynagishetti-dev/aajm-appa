import React, { useState } from 'react';
import {
  Bell,
  PhoneCall,
  User,
  ShieldCheck,
  Baby,
  Globe,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { UserRole, AppNotification } from '../../types';
import { useAppTheme } from '../../theme/ThemeContext';
import { AppLanguage, TRANSLATIONS } from '../../localization';

interface AppHeaderProps {
  currentRole: UserRole;
  currentLang: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  onLanguageToggle?: () => void;
  onOpenCalls: () => void;
  onOpenAdmin?: () => void;
  onToggleChildrenMode?: () => void;
  onOpenChildrenMode?: () => void;
  onRoleChange?: (newRole: UserRole) => void;
  onLogout?: () => void;
  onOpenLogin?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRole,
  currentLang,
  onLanguageChange,
  onLanguageToggle,
  onOpenCalls,
  onOpenAdmin,
  onToggleChildrenMode,
  onOpenChildrenMode,
  onRoleChange,
  onLogout,
  onOpenLogin,
}) => {
  const { isDark, setThemeMode } = useAppTheme();
  const t = TRANSLATIONS[currentLang];

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  
  const notifications = churchStorage.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentUser = churchStorage.getCurrentUser();

  const ROLES_LIST: UserRole[] = [
    'Super Admin',
    'Admin',
    'Host',
    'Group Leader',
    'Sunday School Teacher',
    'Parent',
    'Member',
    'Child',
  ];

  const handleRoleSelect = (role: UserRole) => {
    churchStorage.switchRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
    setRoleMenuOpen(false);
  };

  const handleLangToggle = () => {
    if (onLanguageToggle) {
      onLanguageToggle();
    } else if (onLanguageChange) {
      onLanguageChange(currentLang === 'en' ? 'te' : 'en');
    }
  };

  const handleChildrenModeToggle = () => {
    if (onOpenChildrenMode) {
      onOpenChildrenMode();
    } else if (onToggleChildrenMode) {
      onToggleChildrenMode();
    }
  };

  const handleMarkAllRead = () => {
    churchStorage.markAllNotificationsAsRead();
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand & Cross / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-md tracking-wider">
            ✝
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-[var(--color-text)] flex items-center gap-1.5 font-['Cinzel',serif]">
              {t.appTitle}
            </h1>
            <p className="text-[11px] text-[var(--color-muted)] font-medium leading-none hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center: Active Role Badge with Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-blue-200 text-xs font-semibold hover:opacity-90 transition-opacity border border-[var(--color-border)] cursor-pointer"
            title="Switch User Role to test permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="max-w-[110px] truncate">{currentRole}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {/* Role selection dropdown */}
          {roleMenuOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider border-b border-[var(--color-border)]">
                Backend Role Simulation
              </div>
              {ROLES_LIST.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer ${
                    currentRole === role ? 'font-bold text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                  }`}
                >
                  <span>{role}</span>
                  {currentRole === role && <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons: Calls, Notifications, Language, Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Admin Dashboard shortcut if Admin/Super Admin */}
          {(currentRole === 'Admin' || currentRole === 'Super Admin') && (
            <button
              onClick={onOpenAdmin}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
            >
              <span>{t.adminDashboard}</span>
            </button>
          )}

          {/* Children Mode Quick Switch */}
          <button
            onClick={handleChildrenModeToggle}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-semibold border border-amber-300/40 transition-colors cursor-pointer"
            title="Launch Children Mode"
          >
            <Baby className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Kids</span>
          </button>

          {/* Calls button */}
          <button
            onClick={onOpenCalls}
            className="p-2 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-primary-light)] relative transition-colors cursor-pointer"
            title={t.calls}
          >
            <PhoneCall className="w-5 h-5 text-[var(--color-primary)]" />
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-primary-light)] relative transition-colors cursor-pointer"
              title={t.notifications}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in">
                <div className="px-4 py-3 bg-[var(--color-primary-light)] border-b border-[var(--color-border)] flex items-center justify-between">
                  <div className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>{t.notifications}</span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[var(--color-primary)] hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border)]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[var(--color-muted)]">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => churchStorage.markNotificationAsRead(notif.id)}
                        className={`p-3 text-xs transition-colors hover:bg-[var(--color-primary-light)] cursor-pointer ${
                          !notif.read ? 'bg-blue-50/50 dark:bg-blue-950/20 font-medium' : 'opacity-85'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[var(--color-text)]">{notif.title}</span>
                          <span className="text-[10px] text-[var(--color-muted)]">{notif.timestamp}</span>
                        </div>
                        <p className="text-[var(--color-muted)] text-[11px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language selector toggle */}
          <button
            onClick={handleLangToggle}
            className="px-2 py-1 rounded-lg text-xs font-bold border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer flex items-center gap-1"
            title="Switch Language (English / తెలుగు)"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>{currentLang === 'en' ? 'తెలుగు' : 'EN'}</span>
          </button>

          {/* Theme Mode toggle */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="p-2 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all cursor-pointer overflow-hidden"
              title={t.profile}
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] p-3 z-50 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.name.slice(0, 1)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-[var(--color-text)] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[var(--color-muted)] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenAdmin?.();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-primary-light)] text-[var(--color-text)] font-medium cursor-pointer"
                  >
                    ⚙️ Church Settings & Admin
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleChildrenModeToggle();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-primary-light)] text-[var(--color-text)] font-medium cursor-pointer"
                  >
                    👶 Switch to Children Mode
                  </button>

                  <div className="pt-1 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        if (onLogout) {
                          onLogout();
                        } else {
                          churchStorage.logout();
                        }
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{currentLang === 'te' ? 'లాగ్ అవుట్ / ఖాతా మార్చండి' : 'Sign Out / Switch Account'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
