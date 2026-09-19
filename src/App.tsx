import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation, MainTab } from './components/layout/BottomNavigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { GroupsScreen } from './components/screens/GroupsScreen';
import { LocationScreen } from './components/screens/LocationScreen';
import { ChildrenModeScreen } from './components/screens/ChildrenModeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { CallModal } from './components/modals/CallModal';
import { AdminPanelModal } from './components/modals/AdminPanelModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { churchStorage } from './services/storage';
import { AppLanguage } from './localization';
import { UserRole } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [currentLang, setCurrentLang] = useState<AppLanguage>('en');
  const [currentUser, setCurrentUser] = useState(churchStorage.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => churchStorage.isAuthenticated());
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isChildrenMode, setIsChildrenMode] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminDefaultTab, setAdminDefaultTab] = useState<'schedule' | 'notices' | 'bookings' | 'payment'>('schedule');

  // Sync state with storage and other tabs
  useEffect(() => {
    const unsubscribe = churchStorage.subscribe(() => {
      setCurrentUser(churchStorage.getCurrentUser());
      setIsAuthenticated(churchStorage.isAuthenticated());
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    const updated = churchStorage.updateUserRole(newRole);
    setCurrentUser(updated);
    if (newRole === 'Child') {
      setIsChildrenMode(true);
    }
  };

  const handleLogout = () => {
    churchStorage.logout();
    setIsAuthenticated(false);
    setIsGuestMode(false);
    setIsChildrenMode(false);
  };

  const handleLoginSuccess = () => {
    const freshUser = churchStorage.getCurrentUser();
    setCurrentUser(freshUser);
    setIsAuthenticated(true);
    setIsGuestMode(false);
    if (freshUser.role === 'Child') {
      setIsChildrenMode(true);
    }
  };

  const handleOpenScheduleEditor = () => {
    setAdminDefaultTab('schedule');
    setIsAdminModalOpen(true);
  };

  const handleOpenAdminNotices = () => {
    setAdminDefaultTab('notices');
    setIsAdminModalOpen(true);
  };

  // If user is not authenticated and not browsing in guest mode, show the Login / Register screen
  if (!isAuthenticated && !isGuestMode) {
    return (
      <LoginScreen
        currentLang={currentLang}
        onLanguageToggle={() => setCurrentLang((prev) => (prev === 'en' ? 'te' : 'en'))}
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={() => setIsGuestMode(true)}
      />
    );
  }

  // If Children Mode is active, display the protected Children Mode screen
  if (isChildrenMode) {
    return (
      <ChildrenModeScreen
        currentLang={currentLang}
        onExitChildrenMode={() => {
          setIsChildrenMode(false);
          // if role was Child, return to Member
          if (currentUser.role === 'Child') {
            handleRoleChange('Member');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Guest Mode Banner */}
      {isGuestMode && !isAuthenticated && (
        <aside aria-label="Guest banner" className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>
            {currentLang === 'te'
              ? '👋 మీరు అతిథిగా వీక్షిస్తున్నారు. పూర్తి ఫీచర్ల కోసం లాగిన్ చేయండి.'
              : '👋 You are browsing as a Church Guest Visitor. Sign in to access full member privileges.'}
          </span>
          <button
            onClick={() => {
              setIsGuestMode(false);
              setIsAuthenticated(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold cursor-pointer transition-colors"
          >
            {currentLang === 'te' ? 'లాగిన్ చేయండి' : 'Sign In Now'}
          </button>
        </aside>
      )}

      {/* Top Header */}
      <AppHeader
        currentLang={currentLang}
        onLanguageToggle={() => setCurrentLang((prev) => (prev === 'en' ? 'te' : 'en'))}
        currentRole={currentUser.role}
        onRoleChange={handleRoleChange}
        onOpenCalls={() => setIsCallModalOpen(true)}
        onOpenChildrenMode={() => setIsChildrenMode(true)}
        onLogout={handleLogout}
        onOpenLogin={() => {
          setIsGuestMode(false);
          setIsAuthenticated(false);
        }}
      />

      {/* Main Screen Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {activeTab === 'events' && (
          <EventsScreen
            currentLang={currentLang}
            isAdmin={currentUser.role === 'Admin' || currentUser.role === 'Super Admin'}
          />
        )}

        {activeTab === 'home' && (
          <HomeScreen
            currentLang={currentLang}
            currentRole={currentUser.role}
            onOpenScheduleEditor={handleOpenScheduleEditor}
            onOpenAdmin={handleOpenAdminNotices}
          />
        )}

        {activeTab === 'booking' && (
          <BookingScreen
            currentLang={currentLang}
            isAdmin={currentUser.role === 'Admin' || currentUser.role === 'Super Admin'}
          />
        )}

        {activeTab === 'groups' && (
          <GroupsScreen
            currentLang={currentLang}
            onStartCall={() => setIsCallModalOpen(true)}
          />
        )}

        {activeTab === 'location' && (
          <LocationScreen
            currentLang={currentLang}
            isAdmin={currentUser.role === 'Admin' || currentUser.role === 'Super Admin'}
          />
        )}
      </main>

      {/* Main Bottom Navigation: Events | Home | Booking | Groups | Location */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        currentLang={currentLang}
      />

      {/* Global Modals */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        defaultTab={adminDefaultTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
