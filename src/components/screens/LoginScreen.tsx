import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  KeyRound,
  Users,
  Check,
  Building,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { ChurchAccountItem } from '../../services/churchData';
import { AppLanguage, TRANSLATIONS } from '../../localization';
import { UserRole } from '../../types';

interface LoginScreenProps {
  currentLang: AppLanguage;
  onLanguageToggle?: () => void;
  onLoginSuccess: () => void;
  onContinueAsGuest?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  currentLang,
  onLanguageToggle,
  onLoginSuccess,
  onContinueAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign In Form State
  const [emailOrPhone, setEmailOrPhone] = useState('pastor.daniel@aajmchurch.org');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Member');
  const [regDepartment, setRegDepartment] = useState('General Congregation');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password / OTP Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  const churchProfile = churchStorage.getChurchProfile();
  const accounts: ChurchAccountItem[] = churchStorage.getAccounts();

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!emailOrPhone.trim()) {
      setErrorMessage(currentLang === 'te' ? 'దయచేసి ఈమెయిల్ లేదా ఫోన్ నంబర్ నమోదు చేయండి' : 'Please enter your email or phone number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = churchStorage.login(emailOrPhone, password);
      setIsLoading(false);
      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.message || 'Login failed. Please check your credentials.');
      }
    }, 400);
  };

  // Handle Registration submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !regEmail.trim()) {
      setErrorMessage(currentLang === 'te' ? 'దయచేసి అన్ని వివరాలను పూరించండి' : 'Please provide your full name and email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage(currentLang === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి' : 'Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage(currentLang === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = churchStorage.register({
        name: fullName,
        email: regEmail,
        phone: regPhone,
        role: regRole,
        department: regDepartment,
        password: regPassword,
      });
      setIsLoading(false);
      if (result.success) {
        onLoginSuccess();
      }
    }, 450);
  };

  // Quick Account Select
  const handleQuickSelectAccount = (account: ChurchAccountItem) => {
    churchStorage.quickSwitchAccount(account.id);
    onLoginSuccess();
  };

  // Trigger simulated Forgot Password OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setOtpSent(true);
    setOtpCode('742918'); // Simulated 6-digit verification code
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSuccess(true);
    setTimeout(() => {
      // Auto login user
      churchStorage.login(forgotEmail, 'password123');
      setShowForgotModal(false);
      onLoginSuccess();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background Decorative Spiritual Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Church Brand & Language Switcher */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg ring-2 ring-white/20">
            ✝
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base tracking-wider text-white">
              {churchProfile.name}
            </h1>
            <p className="text-[11px] text-blue-200/80 font-medium tracking-wide">
              {churchProfile.tagline} • Secunderabad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLanguageToggle && (
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>{currentLang === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>
          )}

          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs font-semibold backdrop-blur-md border border-blue-400/30 transition-colors cursor-pointer"
            >
              {currentLang === 'te' ? 'అతిథిగా ప్రవేశించండి' : 'Guest Mode'}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="max-w-5xl w-full mx-auto my-auto py-6 sm:py-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Church Welcoming & Pastoral Introduction */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'te' ? 'ఆనందకరమైన పరిచర్యలకు స్వాగతం' : 'Welcome to All Are Joyful Ministries'}</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {currentLang === 'te' ? (
                  <>దేవుని సన్నిధిలో <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">ఆనందము</span> మరియు శాంతి</>
                ) : (
                  <>Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Joy & Grace</span> in Christ</>
                )}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-blue-100/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {currentLang === 'te'
                  ? 'పాస్టర్ డేనియల్ నాగశెట్టి గారి నాయకత్వంలో ఆత్మీయ ఆరాధన, దైవ వాక్యము, ఫెలోషిప్ మరియు కుటుంబ ఆశీర్వాదాలు.'
                  : 'Under the spiritual guidance of Pastor Daniel Nagashetty. Connect with live services, prayer fellowship, youth ministry, and children education.'}
              </p>
            </div>

            {/* Scripture Badge */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-md mx-auto lg:mx-0 text-left">
              <p className="text-xs italic text-blue-200 leading-relaxed font-serif">
                "{currentLang === 'te' ? 'రండి, యెహోవా సన్నిధిలో ఆనందింతము, మన రక్షణ దుర్గమునుబట్టి ఉత్సాహధ్వని చేయుదము.' : 'Come, let us sing for joy to the Lord; let us shout aloud to the Rock of our salvation.'}"
              </p>
              <span className="block mt-1 text-[11px] font-bold text-amber-400">
                — {currentLang === 'te' ? 'కీర్తనలు 95:1' : 'Psalm 95:1'}
              </span>
            </div>

            {/* Key Ministry Pillars */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-center">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg font-black text-white">100%</div>
                <div className="text-[10px] text-blue-200/70 font-semibold uppercase tracking-wider">
                  Biblical Truth
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg font-black text-amber-400">7 Days</div>
                <div className="text-[10px] text-blue-200/70 font-semibold uppercase tracking-wider">
                  Pastoral Care
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg font-black text-emerald-400">Kids Mode</div>
                <div className="text-[10px] text-blue-200/70 font-semibold uppercase tracking-wider">
                  Safe Learning
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 max-w-md w-full mx-auto">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              {/* Tab Switcher: Sign In vs Sign Up */}
              <div className="flex p-1 bg-white/10 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'signin'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-200/70 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{currentLang === 'te' ? 'లాగిన్' : 'Sign In'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-200/70 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{currentLang === 'te' ? 'నూతన నమోదు' : 'New Member'}</span>
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* ==========================================
                  FORM: SIGN IN
              ========================================== */}
              {authMode === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Email or Phone */}
                  <div>
                    <label className="block text-xs font-bold text-blue-200 mb-1.5">
                      {currentLang === 'te' ? 'ఈమెయిల్ లేదా ఫోన్ నంబర్' : 'Email Address or Phone'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="pastor.daniel@aajmchurch.org"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-blue-200">
                        {currentLang === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(emailOrPhone || 'pastor.daniel@aajmchurch.org');
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        {currentLang === 'te' ? 'పాస్‌వర్డ్ మర్చిపోయారా?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded-sm bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{currentLang === 'te' ? 'నన్ను గుర్తుంచుకో' : 'Remember this session'}</span>
                    </label>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>{currentLang === 'te' ? 'లాగిన్ చేయండి' : 'Sign In to AAJM Portal'}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ==========================================
                   FORM: NEW MEMBER REGISTRATION
                ========================================== */
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-blue-200 mb-1">
                      {currentLang === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1">
                        {currentLang === 'te' ? 'ఈమెయిల్' : 'Email Address'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="member@aajm.org"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1">
                        {currentLang === 'te' ? 'ఫోన్ నంబర్' : 'Phone / WhatsApp'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98490 00000"
                          className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role & Ministry Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1">
                        {currentLang === 'te' ? 'పాత్ర' : 'Church Role'}
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full py-2.5 px-3 bg-slate-800 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Member">Member</option>
                        <option value="Parent">Parent</option>
                        <option value="Group Leader">Group Leader</option>
                        <option value="Sunday School Teacher">Sunday School Teacher</option>
                        <option value="Host">Host</option>
                        <option value="Child">Child (Kids Mode)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1">
                        {currentLang === 'te' ? 'సేవా విభాగం' : 'Ministry Interest'}
                      </label>
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full py-2.5 px-3 bg-slate-800 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="General Congregation">General Congregation</option>
                        <option value="Choir & Music">Choir & Worship</option>
                        <option value="Youth Fellowship">Youth Fellowship</option>
                        <option value="Sunday School">Sunday School</option>
                        <option value="Intercessory Prayer">Intercessory Prayer</option>
                        <option value="Media & Audio">Media & Tech</option>
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1">
                        {currentLang === 'te' ? 'పాస్‌వర్డ్' : 'Create Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1">
                        {currentLang === 'te' ? 'నిర్ధారించండి' : 'Confirm Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter"
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>{currentLang === 'te' ? 'ఖాతా సృష్టించండి' : 'Register & Join Church Portal'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ==========================================
                  ONE-CLICK ROLE SWITCHER / TEST ACCOUNTS
              ========================================== */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>1-Click Verified Role Login</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Click to switch</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {accounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickSelectAccount(acc)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600/40 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {acc.role === 'Super Admin'
                          ? '👑'
                          : acc.role === 'Group Leader'
                          ? '👥'
                          : acc.role === 'Sunday School Teacher'
                          ? '🎓'
                          : acc.role === 'Host'
                          ? '🏛️'
                          : acc.role === 'Parent'
                          ? '👨‍👩‍👧'
                          : acc.role === 'Child'
                          ? '⭐'
                          : '✝️'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate group-hover:text-blue-300">
                          {acc.name.split(' ')[0]} {acc.name.split(' ')[1] ? acc.name.split(' ')[1][0] + '.' : ''}
                        </div>
                        <div className="text-[9px] text-blue-200/70 truncate">
                          {acc.role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-blue-200/60 z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()} {churchProfile.name} • {churchProfile.tagline}
        </p>
        <p className="text-[11px]">
          Telangana, India • Contact: {churchProfile.contactPhone.split('/')[0]}
        </p>
      </footer>

      {/* ==========================================
          MODAL: FORGOT PASSWORD / INSTANT OTP SIMULATION
      ========================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-white">
                {currentLang === 'te' ? 'పాస్‌వర్డ్ రీసెట్' : 'Reset Account Password'}
              </h3>
              <p className="text-xs text-blue-200/70 mt-1">
                Enter your registered church email to receive an instant security code.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="pastor.daniel@aajmchurch.org"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Send Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
                  ✅ <strong>Security OTP Generated:</strong> <span className="font-mono font-bold tracking-widest">{otpCode}</span>
                </div>

                <p className="text-[11px] text-slate-300">
                  Click below to verify and sign into your account immediately:
                </p>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Code & Login</span>
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setOtpSent(false);
                setOtpSuccess(false);
              }}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
