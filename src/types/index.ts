export type UserRole =
  | 'Member'
  | 'Child'
  | 'Parent'
  | 'Sunday School Teacher'
  | 'Group Leader'
  | 'Host'
  | 'Admin'
  | 'Super Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  assignedGroupIds?: string[];
  assignedClassIds?: string[];
  childrenIds?: string[];
  parentPin?: string;
}

export interface ChurchProfile {
  name: string;
  tagline: string;
  logoUrl: string;
  pastorName: string;
  founderName: string;
  about: string;
  history: string;
  mission: string;
  vision: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mapEmbedUrl?: string;
  mapCoordinates: { lat: number; lng: number };
  socialLinks: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  serviceTimings: {
    day: string;
    time: string;
    serviceName: string;
  }[];
}

export interface FounderFamilyMember {
  id: string;
  name: string;
  relation: 'Founder/Pastor' | 'Wife' | 'Daughter' | 'Son';
  title: string;
  bio: string;
  photoUrl: string;
  displayOrder: number;
}

export interface FounderFamilyData {
  pastorBio: string;
  familyBio: string;
  churchHistory: string;
  ministryHistory: string;
  familyTimeline: {
    year: string;
    title: string;
    description: string;
  }[];
  members: FounderFamilyMember[];
}

export interface PastorScheduleItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  title: string;
  location: string;
  description: string;
  enabled: boolean;
  order: number;
}

export type NoticeCategory =
  | 'General'
  | 'Important'
  | 'Prayer'
  | 'Events'
  | 'Groups'
  | 'Church'
  | 'Emergency';

export type NoticePriority = 'Normal' | 'Important' | 'Emergency';
export type NoticeStatus = 'Draft' | 'Published' | 'Expired' | 'Archived';
export type NoticeAudience = 'Everyone' | 'Specific Group' | 'Specific Users';

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  category: NoticeCategory;
  priority: NoticePriority;
  audience: NoticeAudience;
  targetGroupId?: string;
  relatedEventId?: string;
  relatedMeetingId?: string;
  publishDate: string;
  expiryDate?: string;
  status: NoticeStatus;
  viewsCount: number;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl?: string;
  organizer: string;
  capacity: number;
  rsvpCount: number;
  isRsvpd?: boolean;
  relatedGroupId?: string;
  meetingLink?: string;
  category: string;
  endDate?: string;
  status?: string;
  speaker?: string;
  startDate?: string;
  bannerUrl?: string;
  registrationFee?: string;
  currentRegistered?: number;
  maxCapacity?: number;
  isRegistered?: boolean;
}

export type BookingStatus =
  | 'AVAILABLE'
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'Confirmed'
  | 'Cancelled'
  | 'Pending';

export interface BookingRecord {
  id: string;
  name: string;
  phoneNumber: string;
  location: string;
  bookingDate: string; // YYYY-MM-DD
  purpose?: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  createdAt: string;
  rejectionReason?: string;
  memberId: string;
  remindersSent: string[]; // e.g. ['3_days', '2_days', 'date_of', 'end_of_time']
  bookingType?: string;
  preferredDate?: string;
  timeSlot?: string;
  assignedPastor?: string;
  adminNotes?: string;
  userName?: string;
  email?: string;
  alternativeDate?: string;
  attendeesCount?: number;
  homeAddress?: string;
  phone?: string;
}

export type BookingItem = BookingRecord;
export type BookingType =
  | 'Personal Pastoral Counseling'
  | 'House Visit / Family Prayer'
  | 'Hospital / Sick Visit'
  | 'Child Dedication / Blessing'
  | 'Matrimonial / Wedding Consultation'
  | 'Thanksgiving Prayer'
  | 'Youth / Career Guidance'
  | string;

export interface GroupItem {
  id: string;
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  memberCount: number;
  membersCount?: number;
  isMember: boolean;
  leaderId: string;
  leaderName: string;
  imageUrl: string;
  meetingSchedule: string;
}

export type FellowshipGroup = GroupItem;

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'file';
  mediaUrl?: string;
  fileName?: string;
  isPinned?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  readBy: string[];
}

export interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  category: string;
  isPrivate: boolean;
  contactInfo?: string;
  date: string;
  status: 'submitted' | 'under_review' | 'approved' | 'prayed_for' | 'closed';
  prayedCount: number;
  submittedBy: string;
  hasPrayed?: boolean;
}

export interface PaymentSettings {
  qrScannerImage: string;
  qrCodeUrl?: string;
  upiId: string;
  phonePe: string;
  googlePay: string;
  paytm: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  instructions: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  category: string;
  amount: number;
  date: string;
  referenceNumber: string;
  status: 'pending' | 'verified' | 'failed' | 'rejected';
  purpose?: string;
  notes?: string;
  paymentMethod?: string;
  donorEmail?: string;
  donorPhone?: string;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatar: string;
  bibleStars: number;
  streakDays: number;
  currentAdventureStage: string;
  badges: string[];
}

export interface QuizQuestion {
  id: string;
  category:
    | 'General Bible'
    | 'Old Testament'
    | 'New Testament'
    | 'Jesus'
    | 'Bible Characters'
    | 'Bible Places'
    | 'Bible Stories'
    | 'Bible Books'
    | 'Bible Verses'
    | 'Parables'
    | 'Apostles';
  language: 'en' | 'te';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface BibleStory {
  id: string;
  title: string;
  character: string;
  summary: string;
  paragraphs: string[];
  imageUrl: string;
  scriptureReference: string;
  memoryVerse: string;
  audioNarrationText: string;
}

export interface MemoryVerseAssignment {
  id: string;
  weekNumber: number;
  verse: string;
  scriptureReference: string;
  language: 'en' | 'te';
  description: string;
  deadline: string;
  ageGroup: string;
  className: string;
}

export interface MemoryVerseSubmission {
  id: string;
  childId: string;
  childName: string;
  verseId: string;
  verseRef: string;
  status: 'submitted' | 'under_review' | 'approved' | 'try_again';
  recordingUrl?: string;
  mediaType: 'audio' | 'video';
  submittedAt: string;
  feedback?: string;
  starsAwarded?: number;
}

export interface SundaySchoolClass {
  id: string;
  name: string;
  ageGroup: string;
  teacherId: string;
  teacherName: string;
  weeklyLesson: string;
  memoryVerse: string;
  studentCount: number;
  schedule: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredStars: number;
}

export interface LeaderboardChild {
  rank: number;
  name: string;
  avatar: string;
  stars: number;
  versesMemorized: number;
  badgesCount: number;
  isCurrentChild?: boolean;
}

export type ThemePreset =
  | 'blue'
  | 'red'
  | 'green'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'custom';

export interface AppThemeConfig {
  preset: ThemePreset;
  customColor?: string;
  mode: 'light' | 'dark' | 'system';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  targetRecord?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'notice' | 'booking' | 'event' | 'group' | 'prayer' | 'children' | 'system';
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'high';
}
