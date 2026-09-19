import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Heart,
  Music,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BellRing,
  Mic,
  Square,
  Play,
  Pause,
  Trophy,
  Flame,
  Star,
  Users,
  Check,
  ChevronRight,
  X,
  Languages,
} from 'lucide-react';
import { churchStorage } from '../../services/storage';
import { AppLanguage, TRANSLATIONS } from '../../localization';
import { BibleStory, QuizQuestion } from '../../types';

interface ChildrenModeScreenProps {
  currentLang: AppLanguage;
  onExitChildrenMode: () => void;
}

export const ChildrenModeScreen: React.FC<ChildrenModeScreenProps> = ({
  currentLang: initialLang,
  onExitChildrenMode,
}) => {
  const [lang, setLang] = useState<AppLanguage>(initialLang);
  const [activeTab, setActiveTab] = useState<'verse' | 'stories' | 'quiz' | 'songs' | 'class'>('verse');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [emergencySent, setEmergencySent] = useState(false);
  
  // Storage state
  const [childProfile, setChildProfile] = useState(() => churchStorage.getChildProfile());
  const [leaderboard, setLeaderboard] = useState(() => churchStorage.getLeaderboard());
  const [badgesList] = useState(() => churchStorage.getBadgesList());

  // Speech Narration State (Web Speech API)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  // Story Reader Modal
  const [selectedStory, setSelectedStory] = useState<BibleStory | null>(null);

  // Audio Recording for Memory Verse
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlobReady, setRecordedBlobReady] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    churchStorage.getQuizQuestions(lang)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Song Synthesizer State (Web Audio API)
  const [playingSongIndex, setPlayingSongIndex] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isSongPlayingRef = useRef(false);

  // Sync with storage changes
  useEffect(() => {
    const unsub = churchStorage.subscribe(() => {
      setChildProfile(churchStorage.getChildProfile());
      setLeaderboard(churchStorage.getLeaderboard());
    });
    return () => unsub();
  }, []);

  // Update questions when language changes
  useEffect(() => {
    const qList = churchStorage.getQuizQuestions(lang);
    setQuizQuestions(qList.length > 0 ? qList : churchStorage.getQuizQuestions());
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
  }, [lang]);

  // Clean up speech synthesis & Web Audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopSongSynth();
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Speak text aloud using browser SpeechSynthesis
  const speakText = (text: string, id: string, spokenLang: 'en' | 'te' = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking && currentSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.lang = spokenLang === 'te' ? 'te-IN' : 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play musical tune for songs via Web Audio API
  const playSongMelody = (songIndex: number) => {
    if (playingSongIndex === songIndex) {
      stopSongSynth();
      return;
    }

    stopSongSynth();
    setPlayingSongIndex(songIndex);
    isSongPlayingRef.current = true;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Note frequencies (C4 major scale melodies)
      const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;
      
      const melodies: number[][] = [
        // Father Abraham (C4, E4, G4, E4, C4, G4, C5)
        [C4, E4, G4, E4, C4, G4, C5, G4, E4, C4, E4, G4, C5],
        // This Little Light of Mine (G4, G4, E4, G4, A4, G4, E4, D4, C4)
        [G4, G4, E4, G4, A4, G4, E4, D4, C4, E4, G4, A4, G4],
        // Yesayya Naa Rakshakudu (Telugu Praise Melody: E4, G4, A4, C5, A4, G4, E4, D4, C4)
        [E4, G4, A4, C5, A4, G4, E4, D4, C4, D4, E4, G4, C4],
        // Lord's Army (C4, C4, E4, G4, G4, C5, G4, E4, C4)
        [C4, C4, E4, G4, G4, C5, G4, E4, C4, D4, E4, C4],
      ];

      const notes = melodies[songIndex] || melodies[0];
      let time = ctx.currentTime + 0.1;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // pleasant chime tone
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.4);

        time += 0.38;
      });

      // Reset when melody finishes
      setTimeout(() => {
        if (isSongPlayingRef.current) {
          setPlayingSongIndex(null);
          isSongPlayingRef.current = false;
        }
      }, notes.length * 380 + 300);

    } catch (err) {
      console.warn('Web Audio not supported:', err);
      setPlayingSongIndex(null);
    }
  };

  const stopSongSynth = () => {
    isSongPlayingRef.current = false;
    setPlayingSongIndex(null);
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  // Parent PIN Verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (churchStorage.verifyParentPin(pinInput)) {
      setShowPinModal(false);
      onExitChildrenMode();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  // Recite Memory Verse (+50 stars)
  const handleReciteVerse = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
    churchStorage.awardChildPoints(50, 'Recited Weekly Memory Verse');
    setChildProfile(churchStorage.getChildProfile());
  };

  // Submit recorded verse to teacher
  const handleSubmitRecording = () => {
    churchStorage.submitMemoryVerseRecording({
      childId: childProfile?.id || 'child_1',
      childName: childProfile?.name || 'Joshua',
      verseId: 'mv_week_1',
      verseRef: childProfile?.memoryVerseOfWeek?.reference || 'Philippians 4:13',
      mediaType: 'audio',
      feedback: 'Recitation submitted for review by Sunday School Teacher Rachel.',
      starsAwarded: 50,
    });
    churchStorage.awardChildPoints(50, 'Submitted Memory Verse to Teacher Rachel');
    setSubmissionSuccess(true);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => {
      setIsRecordingModalOpen(false);
      setIsRecording(false);
      setRecordingSeconds(0);
      setRecordedBlobReady(false);
      setSubmissionSuccess(false);
    }, 2000);
  };

  // Answer Quiz Question
  const handleAnswerQuiz = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ?.correctAnswerIndex;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      churchStorage.awardChildPoints(25, 'Bible Quiz Correct Answer');
      confetti({ particleCount: 45, spread: 60 });
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Emergency assistance button
  const handleEmergencyAlert = () => {
    churchStorage.addNotification({
      title: '🚨 Child Safety Alert Triggered',
      message: `${childProfile?.name || 'Child'} in ${childProfile?.sundaySchoolClass || 'Sunday School'} pressed the emergency assistance button.`,
      type: 'children',
      priority: 'high',
    });
    setEmergencySent(true);
    setTimeout(() => setEmergencySent(false), 6000);
  };

  const stories: BibleStory[] = churchStorage.getBibleStories();

  const praiseSongs = [
    {
      id: 'song_1',
      title: 'Father Abraham Had Many Sons',
      teluguTitle: 'అబ్రాహామునకు ఎందరో కుమారులు',
      duration: '2:15',
      theme: 'Faith & Obedience',
      lyrics:
        'Father Abraham had many sons, and many sons had Father Abraham!\nI am one of them, and so are you, so let’s just praise the Lord!\nRight arm! Left arm! Right foot! Left foot! Chin up! Turn around! Sit down!',
    },
    {
      id: 'song_2',
      title: 'This Little Light of Mine',
      teluguTitle: 'నా ఈ చిన్న దీపమును వెలిగించెదన్',
      duration: '1:45',
      theme: 'Witness & Joy',
      lyrics:
        'This little light of mine, I’m gonna let it shine!\nThis little light of mine, I’m gonna let it shine!\nLet it shine, let it shine, let it shine!\nHide it under a bushel? NO! I’m gonna let it shine!',
    },
    {
      id: 'song_3',
      title: 'Yesayya Naa Rakshakudu',
      teluguTitle: 'యేసయ్య నా రక్షకుడు - నా మంచి కాపరి',
      duration: '2:30',
      theme: 'Jesus is My Savior (Telugu)',
      lyrics:
        'యేసయ్య నా రక్షకుడు - నన్ను ప్రేమించు దేవుడు!\nచేయి పట్టి నడిపించును - భయము లేక కాపాడును!\nహల్లెలూయా ఆమెన్ - యేసయ్యకే స్తోత్రము!\nఆనందముతో పాడెదము - నిరంతరము కొలిచెదము!',
    },
    {
      id: 'song_4',
      title: 'I Am in the Lord’s Army',
      teluguTitle: 'నేను ప్రభువు సైన్యములో సైనికుడను',
      duration: '1:55',
      theme: 'Spiritual Armor',
      lyrics:
        'I may never march in the infantry, ride in the cavalry, shoot the artillery!\nI may never zoom o’er the enemy, but I am in the Lord’s army!\nYes, Sir! I’m in the Lord’s army!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-3 sm:p-6 pb-24 text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <header className="max-w-4xl mx-auto flex items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 shadow-md border-2 border-amber-300 dark:border-amber-700/50 mb-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg text-amber-600 dark:text-amber-400">
                {childProfile?.name || 'Joshua'}’s Sunday School
              </h1>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-black">
                Age {childProfile?.age || 9}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-none">
              Class: {childProfile?.sundaySchoolClass || 'Kingdom Kids'} • Teacher: {childProfile?.teacherName || 'Rachel'}
            </p>
          </div>
        </div>

        {/* Stars, Language Toggle & Exit Parent Gate */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <button
            onClick={() => setLang((prev) => (prev === 'en' ? 'te' : 'en'))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            title="Toggle Telugu / English"
          >
            <Languages className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Stars Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-black text-xs shadow-inner">
            <Sparkles className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{childProfile?.bibleStars ?? 280} Stars</span>
          </div>

          {/* Parent Lock Gate */}
          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Parent Gate (PIN Required)"
          >
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Parent Exit</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav aria-label="Children activities" className="max-w-4xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveTab('verse')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'verse'
              ? 'bg-amber-500 text-white shadow-md scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'te' ? 'కంఠస్థ వాక్యము' : 'Memory Verse'}</span>
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'stories'
              ? 'bg-sky-500 text-white shadow-md scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'te' ? 'బైబిల్ కథలు' : 'Bible Stories'}</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-emerald-500 text-white shadow-md scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'te' ? 'బైబిల్ క్విజ్' : 'Bible Quiz'}</span>
        </button>

        <button
          onClick={() => setActiveTab('songs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'songs'
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>{lang === 'te' ? 'స్తుతి పాటలు' : 'Action Songs'}</span>
        </button>

        <button
          onClick={() => setActiveTab('class')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'class'
              ? 'bg-purple-500 text-white shadow-md scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{lang === 'te' ? 'తరగతి & అవార్డులు' : 'Class & Badges'}</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto">
        {/* ============================================================
            TAB 1: MEMORY VERSE OF THE WEEK
        ============================================================ */}
        {activeTab === 'verse' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-700/40 shadow-xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {lang === 'te' ? 'ఈ వారపు కంఠస్థ వాక్యము' : 'Memory Verse of the Week'}
              </span>
            </div>

            <blockquote className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed font-['Cinzel',serif] max-w-xl mx-auto">
              "{lang === 'te' ? childProfile?.memoryVerseOfWeek?.teluguVerse || 'నన్ను బలపరచువానియందే నేను సమస్తమును చేయగలను.' : childProfile?.memoryVerseOfWeek?.verse || 'I can do all things through Christ who strengthens me.'}"
            </blockquote>

            <div className="font-extrabold text-base text-amber-600 dark:text-amber-400">
              — {lang === 'te' ? childProfile?.memoryVerseOfWeek?.teluguReference || 'ఫిలిప్పీయులకు 4:13' : childProfile?.memoryVerseOfWeek?.reference || 'Philippians 4:13'}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300 text-left">
              💡 <strong>{lang === 'te' ? 'పిల్లల భావము:' : 'Meaning for Kids:'}</strong>{' '}
              {lang === 'te'
                ? childProfile?.memoryVerseOfWeek?.teluguMeaning || 'యేసుక్రీస్తు మనకు ఎల్లప్పుడూ తోడై ఉండి జయాన్ని, బలాన్ని ఇస్తారు.'
                : childProfile?.memoryVerseOfWeek?.meaning || 'Jesus gives us bravery, grace, and divine strength in school, at home, and in everything we do.'}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {/* Listen to Verse Aloud */}
              <button
                onClick={() =>
                  speakText(
                    lang === 'te'
                      ? childProfile?.memoryVerseOfWeek?.teluguVerse || 'నన్ను బలపరచువానియందే నేను సమస్తమును చేయగలను.'
                      : childProfile?.memoryVerseOfWeek?.verse || 'I can do all things through Christ who strengthens me.',
                    'weekly_verse',
                    lang
                  )
                }
                className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                {isSpeaking && currentSpeakingId === 'weekly_verse' ? (
                  <>
                    <VolumeX className="w-4 h-4 animate-pulse" />
                    <span>{lang === 'te' ? 'ఆపుము' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{lang === 'te' ? 'వాక్యం వినండి' : 'Listen Aloud'}</span>
                  </>
                )}
              </button>

              {/* I Recited It */}
              <button
                onClick={handleReciteVerse}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{lang === 'te' ? 'నేను చెప్పాను! (+50 నక్షత్రాలు)' : 'I Recited It! (+50 Stars)'}</span>
              </button>

              {/* Record for Teacher */}
              <button
                onClick={() => setIsRecordingModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>{lang === 'te' ? 'టీచర్‌కు పంపండి' : 'Send to Teacher Rachel'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: BIBLE STORIES
        ============================================================ */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {story.scriptureReference}
                  </div>
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {story.character}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1.5">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {story.summary}
                    </p>
                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-semibold">
                      ⭐ <strong>Moral:</strong> {story.memoryVerse}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {/* Read Full Story Button */}
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                      <span>Read Story</span>
                    </button>

                    {/* Listen Narration */}
                    <button
                      onClick={() =>
                        speakText(story.audioNarrationText || story.summary, story.id, 'en')
                      }
                      className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isSpeaking && currentSpeakingId === story.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            TAB 3: BIBLE TRIVIA QUIZ
        ============================================================ */}
        {activeTab === 'quiz' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto">
            {quizFinished ? (
              <div className="space-y-5 text-center py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-inner">
                  🎉
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {lang === 'te' ? 'అద్భుతమైన ప్రదర్శన!' : 'Outstanding Job,'} {childProfile?.name || 'Joshua'}!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'te'
                      ? `మీరు ${quizQuestions.length} ప్రశ్నలకు ${quizScore} సరైన సమాధానాలు ఇచ్చి ${quizScore * 25} నక్షత్రాలను సంపాదించారు!`
                      : `You scored ${quizScore} out of ${quizQuestions.length} correctly and earned ${quizScore * 25} Bible Stars!`}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setQuizFinished(false);
                    setCurrentQuestionIndex(0);
                    setQuizScore(0);
                    setSelectedOption(null);
                    setShowExplanation(false);
                  }}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-2 mx-auto shadow-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'te' ? 'మళ్ళీ ఆడండి' : 'Play Again'}</span>
                </button>
              </div>
            ) : quizQuestions.length > 0 ? (
              <div className="space-y-5">
                {/* Header & Score */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                    <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    <span>Score: {quizScore}</span>
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === quizQuestions[currentQuestionIndex].correctAnswerIndex;
                    let styleClass =
                      'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700';

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        styleClass = 'bg-emerald-500 text-white font-black border-emerald-600 shadow-md';
                      } else if (isSelected) {
                        styleClass = 'bg-rose-500 text-white font-black border-rose-600';
                      } else {
                        styleClass = 'bg-slate-100 dark:bg-slate-800 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleAnswerQuiz(idx)}
                        className={`p-3.5 rounded-2xl text-xs font-bold transition-all text-left flex items-center justify-between border cursor-pointer ${styleClass}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Next button */}
                {showExplanation && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                    <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      📖 <strong>Scripture Fact:</strong> {quizQuestions[currentQuestionIndex].explanation}
                    </div>
                    <button
                      onClick={handleNextQuizQuestion}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{currentQuestionIndex + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                No quiz questions available in this category.
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 4: PRAISE SONGS & AUDIO SYNTH
        ============================================================ */}
        {activeTab === 'songs' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Sunday School Praise Jukebox
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tap play to hear the musical tune with interactive melodic chimes!
                </p>
              </div>
              {playingSongIndex !== null && (
                <button
                  onClick={stopSongSynth}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Melody</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {praiseSongs.map((song, i) => {
                const isPlaying = playingSongIndex === i;
                return (
                  <div
                    key={song.id}
                    className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                      isPlaying
                        ? 'border-rose-400 ring-2 ring-rose-400/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {lang === 'te' ? song.teluguTitle : song.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {song.theme} • {song.duration}
                        </p>
                      </div>

                      <button
                        onClick={() => playSongMelody(i)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform shadow-md shrink-0 ${
                          isPlaying
                            ? 'bg-rose-600 text-white scale-110 animate-bounce'
                            : 'bg-rose-500 hover:bg-rose-600 text-white'
                        }`}
                        title={isPlaying ? 'Pause' : 'Play Tune'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                    </div>

                    {/* Lyrics Box */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line border border-slate-100 dark:border-slate-700">
                      {song.lyrics}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: SUNDAY SCHOOL CLASS & BADGES
        ============================================================ */}
        {activeTab === 'class' && (
          <div className="space-y-5">
            {/* Sunday School Class Info */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-black tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-1">
                  Enrolled Sunday School Class
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {childProfile?.sundaySchoolClass || 'Kingdom Kids (Ages 6-9)'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Teacher: {childProfile?.teacherName || 'Teacher Rachel'} • Sunday 10:00 AM • Room 102
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-center">
                  <div className="text-lg font-black">{childProfile?.streakDays || 7} Days</div>
                  <div className="text-[10px] font-bold">Attendance Streak</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-center">
                  <div className="text-lg font-black">{childProfile?.bibleStars || 280}</div>
                  <div className="text-[10px] font-bold">Total Stars</div>
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Discipleship Badges & Achievements</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badgesList.map((badge) => {
                  const isUnlocked =
                    Array.isArray(childProfile?.badges) &&
                    childProfile.badges.some((b: string) => b.toLowerCase().includes(badge.name.toLowerCase()));
                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                        isUnlocked
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {badge.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isUnlocked ? 'Unlocked 🎉' : `${badge.requiredStars} Stars required`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-time Sunday School Leaderboard */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Class Star Leaderboard</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaderboard.map((item) => (
                  <div
                    key={item.rank}
                    className={`py-3 px-3 rounded-xl flex items-center justify-between text-xs ${
                      item.isCurrentChild
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-black text-slate-400">
                        #{item.rank}
                      </span>
                      <span className="text-lg">{item.avatar}</span>
                      <div>
                        <div className="font-bold">
                          {item.name} {item.isCurrentChild && '(You ⭐)'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.versesMemorized} Verses • {item.badgesCount} Badges
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-black text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>{item.stars} Stars</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Notes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Teacher Rachel’s Notes & Feedback</span>
              </h3>
              <div className="space-y-2">
                {Array.isArray(childProfile?.teacherNotes) &&
                  childProfile.teacherNotes.map((note: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60"
                    >
                      "{note}"
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Assistance Button */}
        <div className="mt-8 text-center">
          {emergencySent ? (
            <div className="inline-block p-3.5 rounded-2xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-black shadow-md animate-pulse">
              🔔 Parent Alert Sent! Your parent and Sunday School teacher have been notified immediately.
            </div>
          ) : (
            <button
              onClick={handleEmergencyAlert}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200 dark:border-rose-900"
            >
              <BellRing className="w-4 h-4 text-rose-500" />
              <span>Need Help? Alert Parent Now</span>
            </button>
          )}
        </div>
      </main>

      {/* ============================================================
          MODAL 1: BIBLE STORY READER LIGHTBOX
      ============================================================ */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="relative h-48 sm:h-56 bg-slate-100 dark:bg-slate-800 shrink-0">
              <img
                src={selectedStory.imageUrl}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full">
                {selectedStory.scriptureReference}
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedStory.title}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {Array.isArray(selectedStory.paragraphs) &&
                  selectedStory.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                🌟 <strong>Memory Verse:</strong> {selectedStory.memoryVerse}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center gap-3">
              <button
                onClick={() =>
                  speakText(
                    selectedStory.audioNarrationText || selectedStory.summary,
                    `modal_${selectedStory.id}`,
                    'en'
                  )
                }
                className="py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                {isSpeaking && currentSpeakingId === `modal_${selectedStory.id}` ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedStory(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: MEMORY VERSE RECORDING & TEACHER SUBMISSION
      ============================================================ */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
              <Mic className={`w-7 h-7 ${isRecording ? 'animate-pulse text-red-500' : ''}`} />
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Record Weekly Verse
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Recite Philippians 4:13 clearly and submit it to Teacher Rachel for your 50 Stars!
              </p>
            </div>

            {/* Timer and Waveform */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-2">
                00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </div>

              {isRecording ? (
                <div className="flex items-center justify-center gap-1 h-6">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-red-500 rounded-full animate-bounce"
                      style={{
                        height: `${Math.max(8, Math.sin((i + recordingSeconds) * 1.5) * 22)}px`,
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  {recordedBlobReady ? '✅ Audio Recitation Ready!' : 'Ready to record'}
                </div>
              )}
            </div>

            {submissionSuccess ? (
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Submitted to Teacher Rachel! +50 Stars!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {!isRecording && !recordedBlobReady && (
                  <button
                    onClick={() => {
                      setIsRecording(true);
                      setRecordingSeconds(0);
                    }}
                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Voice Recording</span>
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={() => {
                      setIsRecording(false);
                      setRecordedBlobReady(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordedBlobReady && (
                  <button
                    onClick={handleSubmitRecording}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit to Teacher Rachel</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsRecordingModalOpen(false);
                    setIsRecording(false);
                    setRecordingSeconds(0);
                    setRecordedBlobReady(false);
                  }}
                  className="w-full py-2 text-xs text-slate-500 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: PARENT GATE PIN MODAL
      ============================================================ */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>

            <h3 className="font-black text-base text-slate-900 dark:text-white mb-1">
              Parent Gate PIN
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter 4-digit security PIN to exit Children Mode (Default: 1234)
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-2xl font-mono tracking-widest bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

              {pinError && (
                <p className="text-xs text-rose-500 font-bold">
                  Incorrect PIN. Please try again.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
