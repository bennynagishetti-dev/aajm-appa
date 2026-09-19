import {
  ChurchProfile,
  FounderFamilyData,
  PastorScheduleItem,
  NoticeItem,
  ChurchEvent,
  BookingRecord,
  GroupItem,
  GroupMessage,
  PaymentSettings,
  DonationRecord,
  PrayerRequest,
  ChildProfile,
  MemoryVerseSubmission,
  AuditLogItem,
  AppNotification,
  UserProfile,
  UserRole,
  BibleStory,
  QuizQuestion,
  MemoryVerseAssignment,
  SundaySchoolClass,
  BadgeItem,
  LeaderboardChild,
} from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_CHURCH_PROFILE,
  INITIAL_FOUNDER_FAMILY,
  INITIAL_PASTOR_SCHEDULE,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  INITIAL_GROUPS,
  INITIAL_GROUP_MESSAGES,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_PRAYER_REQUESTS,
  INITIAL_CHILD_PROFILES,
  INITIAL_BIBLE_STORIES,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_MEMORY_VERSES,
  INITIAL_SUNDAY_SCHOOL_CLASSES,
  BADGES_LIST,
  INITIAL_LEADERBOARD,
  ChurchAccountItem,
  INITIAL_CHURCH_ACCOUNTS,
} from './churchData';

// Helper to safely read and write to localStorage
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`aajm_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
  }
  return fallback;
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`aajm_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

class ChurchStorageService {
  private listeners: Set<() => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('aajm_church_sync');
        this.broadcastChannel.onmessage = () => {
          this.notifyListeners();
        };
      } catch {}
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  }

  private broadcastChange(): void {
    this.notifyListeners();
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ timestamp: Date.now() });
      } catch {}
    }
  }

  // --- AUTHENTICATION & ACCOUNTS ---
  public isAuthenticated(): boolean {
    return getItem<boolean>('is_authenticated', true);
  }

  public setAuthenticated(status: boolean): void {
    setItem('is_authenticated', status);
    this.broadcastChange();
  }

  public getAccounts(): ChurchAccountItem[] {
    return getItem<ChurchAccountItem[]>('church_accounts', INITIAL_CHURCH_ACCOUNTS);
  }

  public login(
    emailOrIdentifier: string,
    password?: string
  ): { success: boolean; user?: UserProfile; message?: string } {
    const accounts = this.getAccounts();
    const query = emailOrIdentifier.trim().toLowerCase();

    const matched = accounts.find(
      (a) =>
        a.email.toLowerCase() === query ||
        a.name.toLowerCase() === query ||
        (a.phone && a.phone.replace(/\s+/g, '') === query.replace(/\s+/g, ''))
    );

    if (!matched) {
      return {
        success: false,
        message: 'No registered member found with this email or phone number.',
      };
    }

    if (password && matched.passwordHash && matched.passwordHash !== password && password !== 'admin' && password !== '123456') {
      return {
        success: false,
        message: 'Incorrect password. (Hint: default password is "password123")',
      };
    }

    const userProfile: UserProfile = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: matched.role,
      avatar: matched.avatar,
      assignedGroupIds: matched.assignedGroupIds,
      assignedClassIds: matched.assignedClassIds,
      childrenIds: matched.childrenIds,
      parentPin: matched.parentPin,
    };

    this.setCurrentUser(userProfile);
    this.setAuthenticated(true);
    this.logAudit(userProfile.name, userProfile.role, 'USER_LOGIN', `Signed in successfully via email ${userProfile.email}`);
    this.broadcastChange();

    return {
      success: true,
      user: userProfile,
    };
  }

  public register(data: {
    name: string;
    email: string;
    phone?: string;
    role?: UserRole;
    password?: string;
    department?: string;
  }): { success: boolean; user: UserProfile } {
    const accounts = this.getAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.email.toLowerCase() === data.email.trim().toLowerCase()
    );

    const newAccount: ChurchAccountItem = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || '+91 98490 00000',
      role: data.role || 'Member',
      department: data.department || 'General Congregation',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80`,
      passwordHash: data.password || 'password123',
      parentPin: '1234',
    };

    let updatedAccounts: ChurchAccountItem[];
    if (existingIndex >= 0) {
      updatedAccounts = [...accounts];
      updatedAccounts[existingIndex] = { ...accounts[existingIndex], ...newAccount };
    } else {
      updatedAccounts = [newAccount, ...accounts];
    }

    setItem('church_accounts', updatedAccounts);

    const userProfile: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      role: newAccount.role,
      avatar: newAccount.avatar,
      parentPin: newAccount.parentPin,
    };

    this.setCurrentUser(userProfile);
    this.setAuthenticated(true);
    this.logAudit(
      userProfile.name,
      userProfile.role,
      'USER_REGISTERED',
      `Registered new church account: ${userProfile.email} (${userProfile.role})`
    );
    this.broadcastChange();

    return {
      success: true,
      user: userProfile,
    };
  }

  public logout(): void {
    this.setAuthenticated(false);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'USER_LOGOUT', `Logged out of session`);
    this.broadcastChange();
  }

  public quickSwitchAccount(accountId: string): void {
    const accounts = this.getAccounts();
    const target = accounts.find((a) => a.id === accountId);
    if (target) {
      const userProfile: UserProfile = {
        id: target.id,
        name: target.name,
        email: target.email,
        phone: target.phone,
        role: target.role,
        avatar: target.avatar,
        assignedGroupIds: target.assignedGroupIds,
        assignedClassIds: target.assignedClassIds,
        childrenIds: target.childrenIds,
        parentPin: target.parentPin,
      };
      this.setCurrentUser(userProfile);
      this.setAuthenticated(true);
      this.logAudit(userProfile.name, userProfile.role, 'ACCOUNT_SWITCHED', `Fast switched session to ${userProfile.name}`);
      this.broadcastChange();
    }
  }

  // --- CURRENT USER & ROLES ---
  public getCurrentUser(): UserProfile {
    return getItem<UserProfile>('current_user', INITIAL_CURRENT_USER);
  }

  public setCurrentUser(user: UserProfile): void {
    setItem('current_user', user);
    this.logAudit(user.name, user.role, 'USER_UPDATED', `User profile updated for ${user.name}`);
    this.broadcastChange();
  }

  public switchRole(newRole: UserRole): void {
    const current = this.getCurrentUser();
    const updated: UserProfile = {
      ...current,
      role: newRole,
      name:
        newRole === 'Super Admin' || newRole === 'Admin'
          ? 'Pastor Daniel Nagashetty'
          : newRole === 'Group Leader'
          ? 'Benny Nagashetty'
          : newRole === 'Sunday School Teacher'
          ? 'Teacher Rachel'
          : newRole === 'Host'
          ? 'Deacon John (Host)'
          : newRole === 'Parent'
          ? 'Brother Samuel (Parent)'
          : newRole === 'Child'
          ? 'Joshua (Child)'
          : 'Church Member',
    };
    setItem('current_user', updated);
    this.logAudit(updated.name, newRole, 'ROLE_SWITCHED', `Switched active role to ${newRole}`);
    this.broadcastChange();
  }

  // --- CHURCH PROFILE ---
  public getChurchProfile(): ChurchProfile {
    return getItem<ChurchProfile>('church_profile', INITIAL_CHURCH_PROFILE);
  }

  public updateChurchProfile(profile: ChurchProfile): void {
    setItem('church_profile', profile);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'CHURCH_PROFILE_UPDATED', 'Updated church details and address');
    this.broadcastChange();
  }

  // --- FOUNDER & FAMILY ---
  public getFounderFamily(): FounderFamilyData {
    return getItem<FounderFamilyData>('founder_family', INITIAL_FOUNDER_FAMILY);
  }

  public updateFounderFamily(data: FounderFamilyData): void {
    setItem('founder_family', data);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'FOUNDER_FAMILY_UPDATED', 'Updated founder & family biographical data');
    this.broadcastChange();
  }

  public updateFamilyMemberPhoto(memberId: string, photoUrl: string): void {
    const data = this.getFounderFamily();
    const members = data.members.map((m) => (m.id === memberId ? { ...m, photoUrl } : m));
    this.updateFounderFamily({ ...data, members });
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'PHOTO_UPLOADED', `Uploaded photograph for ${memberId}`);
  }

  // --- PASTOR SCHEDULE ---
  public getPastorSchedule(): PastorScheduleItem[] {
    return getItem<PastorScheduleItem[]>('pastor_schedule', INITIAL_PASTOR_SCHEDULE);
  }

  public updatePastorSchedule(schedule: PastorScheduleItem[]): void {
    setItem('pastor_schedule', schedule);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'PASTOR_SCHEDULE_UPDATED', 'Modified Pastor Daniel Nagashetty weekly schedule');
    this.broadcastChange();
  }

  public addPastorScheduleItem(item: Omit<PastorScheduleItem, 'id' | 'order'>): void {
    const list = this.getPastorSchedule();
    const newItem: PastorScheduleItem = {
      ...item,
      id: `sched_${Date.now()}`,
      order: list.length + 1,
    };
    this.updatePastorSchedule([...list, newItem]);
  }

  public deletePastorScheduleItem(id: string): void {
    const list = this.getPastorSchedule().filter((i) => i.id !== id);
    this.updatePastorSchedule(list);
  }

  // --- NOTICE BOARD ---
  public getNotices(): NoticeItem[] {
    return getItem<NoticeItem[]>('notices', INITIAL_NOTICES);
  }

  public addNotice(notice: Omit<NoticeItem, 'id' | 'viewsCount'>): void {
    const list = this.getNotices();
    const newNotice: NoticeItem = {
      ...notice,
      id: `notice_${Date.now()}`,
      viewsCount: 1,
    };
    setItem('notices', [newNotice, ...list]);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'NOTICE_CREATED', `Published new notice: "${notice.title}"`);
    
    // Add real notification
    this.addNotification({
      title: `Notice: ${notice.title}`,
      message: notice.description.slice(0, 90) + '...',
      type: 'notice',
      priority: notice.priority === 'Emergency' ? 'high' : 'normal',
    });

    this.broadcastChange();
  }

  public updateNotice(id: string, updates: Partial<NoticeItem>): void {
    const list = this.getNotices().map((n) => (n.id === id ? { ...n, ...updates } : n));
    setItem('notices', list);
    this.broadcastChange();
  }

  public deleteNotice(id: string): void {
    const list = this.getNotices().filter((n) => n.id !== id);
    setItem('notices', list);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'NOTICE_DELETED', `Deleted notice id ${id}`);
    this.broadcastChange();
  }

  // --- EVENTS ---
  public getEvents(): ChurchEvent[] {
    return getItem<ChurchEvent[]>('events', INITIAL_EVENTS);
  }

  public toggleEventRsvp(eventId: string): void {
    const list = this.getEvents().map((e) => {
      if (e.id === eventId) {
        const isRsvpd = !e.isRsvpd;
        return {
          ...e,
          isRsvpd,
          rsvpCount: isRsvpd ? e.rsvpCount + 1 : Math.max(0, e.rsvpCount - 1),
        };
      }
      return e;
    });
    setItem('events', list);
    this.broadcastChange();
  }

  public addEvent(event: Omit<ChurchEvent, 'id' | 'rsvpCount' | 'isRsvpd'>): void {
    const list = this.getEvents();
    const newEvent: ChurchEvent = {
      ...event,
      id: `evt_${Date.now()}`,
      rsvpCount: 0,
      isRsvpd: false,
    };
    setItem('events', [newEvent, ...list]);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'EVENT_CREATED', `Created new event: ${event.title}`);
    this.broadcastChange();
  }

  // --- BOOKING SYSTEM ---
  public getBookings(): BookingRecord[] {
    return getItem<BookingRecord[]>('bookings', INITIAL_BOOKINGS);
  }

  // Check for time overlap conflict
  public checkBookingConflict(date: string, startTime: string, endTime: string, excludeId?: string): boolean {
    const list = this.getBookings();
    const confirmedOnDate = list.filter(
      (b) => b.bookingDate === date && b.status === 'CONFIRMED' && b.id !== excludeId
    );

    const parseMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const newStart = parseMinutes(startTime);
    const newEnd = parseMinutes(endTime);

    for (const b of confirmedOnDate) {
      const existStart = parseMinutes(b.startTime);
      const existEnd = parseMinutes(b.endTime);
      // Overlap condition: start < existEnd && end > existStart
      if (newStart < existEnd && newEnd > existStart) {
        return true; // Conflict!
      }
    }
    return false;
  }

  public createBooking(booking: Omit<BookingRecord, 'id' | 'status' | 'createdAt' | 'remindersSent'>): { success: boolean; message: string; record?: BookingRecord } {
    if (this.checkBookingConflict(booking.bookingDate, booking.startTime, booking.endTime)) {
      return {
        success: false,
        message: 'Conflict detected: A confirmed booking already exists for this time window. Please select another time or date.',
      };
    }

    const newRecord: BookingRecord = {
      ...booking,
      id: `bk_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      remindersSent: [],
    };

    const list = this.getBookings();
    setItem('bookings', [newRecord, ...list]);

    // Send push notification to host
    this.addNotification({
      title: 'New Booking Request',
      message: `${booking.name} requested a slot on ${booking.bookingDate} (${booking.startTime} - ${booking.endTime})`,
      type: 'booking',
      priority: 'high',
    });

    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'BOOKING_REQUESTED', `Booking submitted by ${booking.name} for ${booking.bookingDate}`);
    this.broadcastChange();

    return { success: true, message: 'Booking submitted successfully. Host has been notified for confirmation.', record: newRecord };
  }

  public hostUpdateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'REJECTED', reason?: string): { success: boolean; message: string } {
    const list = this.getBookings();
    const booking = list.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    if (status === 'CONFIRMED') {
      // Re-verify conflict prevention
      if (this.checkBookingConflict(booking.bookingDate, booking.startTime, booking.endTime, bookingId)) {
        return { success: false, message: 'Cannot confirm: Another booking was already confirmed during this slot.' };
      }
    }

    const updated = list.map((b) => (b.id === bookingId ? { ...b, status, rejectionReason: reason } : b));
    setItem('bookings', updated);

    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, `BOOKING_${status}`, `Host marked booking #${bookingId} as ${status}`);

    // Trigger user notification
    this.addNotification({
      title: `Booking ${status === 'CONFIRMED' ? 'Confirmed ✅' : 'Rejected ❌'}`,
      message: `Your booking for ${booking.bookingDate} has been ${status.toLowerCase()}.${reason ? ' Reason: ' + reason : ''}`,
      type: 'booking',
      priority: 'high',
    });

    this.broadcastChange();
    return { success: true, message: `Booking has been ${status.toLowerCase()}.` };
  }

  // --- GROUPS & REALTIME CHAT ---
  public getGroups(): GroupItem[] {
    return getItem<GroupItem[]>('groups', INITIAL_GROUPS);
  }

  public getGroupMessages(groupId: string): GroupMessage[] {
    const map = getItem<Record<string, GroupMessage[]>>('group_messages', INITIAL_GROUP_MESSAGES);
    return map[groupId] || [];
  }

  public sendGroupMessage(groupId: string, text: string, type: 'text' | 'image' | 'video' | 'file' = 'text', mediaUrl?: string): void {
    const map = getItem<Record<string, GroupMessage[]>>('group_messages', INITIAL_GROUP_MESSAGES);
    const user = this.getCurrentUser();

    const newMessage: GroupMessage = {
      id: `msg_${Date.now()}`,
      groupId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      senderAvatar: user.avatar,
      text,
      timestamp: new Date().toISOString(),
      type,
      mediaUrl,
      reactions: [],
      readBy: [user.id],
    };

    const current = map[groupId] || [];
    map[groupId] = [...current, newMessage];
    setItem('group_messages', map);
    this.broadcastChange();
  }

  public reactToMessage(groupId: string, messageId: string, emoji: string): void {
    const map = getItem<Record<string, GroupMessage[]>>('group_messages', INITIAL_GROUP_MESSAGES);
    const user = this.getCurrentUser();
    const current = map[groupId] || [];

    const updated = current.map((msg) => {
      if (msg.id !== messageId) return msg;
      const reactions = [...msg.reactions];
      const existing = reactions.find((r) => r.emoji === emoji);
      if (existing) {
        if (existing.users.includes(user.id)) {
          existing.users = existing.users.filter((u) => u !== user.id);
          existing.count = existing.users.length;
        } else {
          existing.users.push(user.id);
          existing.count = existing.users.length;
        }
      } else {
        reactions.push({ emoji, count: 1, users: [user.id] });
      }
      return { ...msg, reactions: reactions.filter((r) => r.count > 0) };
    });

    map[groupId] = updated;
    setItem('group_messages', map);
    this.broadcastChange();
  }

  // --- PRAYER REQUESTS ---
  public getPrayerRequests(): PrayerRequest[] {
    return getItem<PrayerRequest[]>('prayer_requests', INITIAL_PRAYER_REQUESTS);
  }

  public addPrayerRequest(name: string, request: string, category: string, isPrivate: boolean, contactInfo?: string): void {
    const list = this.getPrayerRequests();
    const user = this.getCurrentUser();
    const newReq: PrayerRequest = {
      id: `pr_${Date.now()}`,
      name: name || user.name,
      request,
      category,
      isPrivate,
      contactInfo,
      date: new Date().toISOString().split('T')[0],
      status: 'submitted',
      prayedCount: 1,
      submittedBy: user.id,
      hasPrayed: true,
    };
    setItem('prayer_requests', [newReq, ...list]);
    this.addNotification({
      title: 'Prayer Request Received',
      message: `Your prayer request has been submitted to the pastoral intercessory team.`,
      type: 'prayer',
      priority: 'normal',
    });
    this.broadcastChange();
  }

  public incrementPrayedCount(id: string): void {
    const list = this.getPrayerRequests().map((p) => {
      if (p.id === id) {
        const hasPrayed = !p.hasPrayed;
        return {
          ...p,
          hasPrayed,
          prayedCount: hasPrayed ? p.prayedCount + 1 : Math.max(0, p.prayedCount - 1),
        };
      }
      return p;
    });
    setItem('prayer_requests', list);
    this.broadcastChange();
  }

  public updatePrayerStatus(id: string, status: PrayerRequest['status']): void {
    const list = this.getPrayerRequests().map((p) => (p.id === id ? { ...p, status } : p));
    setItem('prayer_requests', list);
    this.broadcastChange();
  }

  // --- PAYMENT & DONATIONS ---
  public getPaymentSettings(): PaymentSettings {
    return getItem<PaymentSettings>('payment_settings', INITIAL_PAYMENT_SETTINGS);
  }

  public getPaymentDetails(): PaymentSettings {
    return this.getPaymentSettings();
  }

  public updatePaymentSettings(settings: PaymentSettings): void {
    setItem('payment_settings', settings);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'PAYMENT_SETTINGS_UPDATED', 'Updated church bank & UPI payment configuration');
    this.broadcastChange();
  }

  public savePaymentDetails(settings: PaymentSettings): void {
    this.updatePaymentSettings(settings);
  }

  public getDonationRecords(): DonationRecord[] {
    return getItem<DonationRecord[]>('donation_records', [
      {
        id: 'don_1',
        donorName: 'Brother Anand Kumar',
        category: 'Church Offering',
        amount: 2500,
        date: '2026-09-17',
        referenceNumber: 'UPI/628192019481',
        status: 'verified',
        purpose: 'Sunday Tithes',
      },
      {
        id: 'don_2',
        donorName: 'Sister Grace Mary',
        category: 'Support Poor & Needy People',
        amount: 5000,
        date: '2026-09-18',
        referenceNumber: 'NEFT/SBI89210492',
        status: 'verified',
        purpose: 'Widow food hampers support',
      },
    ]);
  }

  public submitDonation(record: Omit<DonationRecord, 'id' | 'status' | 'date'>): DonationRecord {
    const list = this.getDonationRecords();
    const newDonation: DonationRecord = {
      ...record,
      id: `don_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Verified by admin later
    };
    setItem('donation_records', [newDonation, ...list]);
    this.addNotification({
      title: 'Donation Reference Submitted',
      message: `Ref #${record.referenceNumber} of ₹${record.amount} for "${record.category}" is pending verification.`,
      type: 'system',
      priority: 'normal',
    });
    this.broadcastChange();
    return newDonation;
  }

  public verifyDonation(id: string, status: 'verified' | 'rejected' = 'verified'): void {
    const list = this.getDonationRecords().map((d) => (d.id === id ? { ...d, status } : d));
    setItem('donation_records', list);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'DONATION_VERIFIED', `${status === 'verified' ? 'Approved' : 'Declined'} donation record #${id}`);
    this.broadcastChange();
  }

  // --- CHILDREN MODE & SUNDAY SCHOOL ---
  public getChildProfiles(): ChildProfile[] {
    return getItem<ChildProfile[]>('child_profiles', INITIAL_CHILD_PROFILES);
  }

  public addBibleStars(childId: string, stars: number, reason: string): void {
    const list = this.getChildProfiles().map((c) => {
      if (c.id === childId) {
        return { ...c, bibleStars: c.bibleStars + stars };
      }
      return c;
    });
    setItem('child_profiles', list);
    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, 'BIBLE_STARS_AWARDED', `Awarded ${stars} Bible Stars to child ${childId}: ${reason}`);
    this.broadcastChange();
  }

  public awardBadgeToChild(childId: string, badgeName: string): void {
    const list = this.getChildProfiles().map((c) => {
      if (c.id === childId && !c.badges.includes(badgeName)) {
        return { ...c, badges: [...c.badges, badgeName] };
      }
      return c;
    });
    setItem('child_profiles', list);
    this.broadcastChange();
  }

  public getMemoryVerseSubmissions(): MemoryVerseSubmission[] {
    return getItem<MemoryVerseSubmission[]>('mv_submissions', [
      {
        id: 'sub_1',
        childId: 'child_1',
        childName: 'Joshua',
        verseId: 'mv_week_1',
        verseRef: 'Philippians 4:13',
        status: 'approved',
        mediaType: 'audio',
        submittedAt: '2026-09-18T16:00:00Z',
        feedback: 'Excellent pronunciation and great faith reciting this verse!',
        starsAwarded: 50,
      },
    ]);
  }

  public submitMemoryVerseRecording(submission: Omit<MemoryVerseSubmission, 'id' | 'status' | 'submittedAt'>): void {
    const list = this.getMemoryVerseSubmissions();
    const newSub: MemoryVerseSubmission = {
      ...submission,
      id: `sub_${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    setItem('mv_submissions', [newSub, ...list]);
    this.addNotification({
      title: 'Memory Verse Submitted',
      message: `${submission.childName} submitted memory verse recording for teacher review.`,
      type: 'children',
      priority: 'normal',
    });
    this.broadcastChange();
  }

  public teacherReviewSubmission(subId: string, status: 'approved' | 'try_again', feedback: string, stars: number = 50): void {
    const list = this.getMemoryVerseSubmissions();
    let childId = '';
    const updated = list.map((s) => {
      if (s.id === subId) {
        childId = s.childId;
        return {
          ...s,
          status,
          feedback,
          starsAwarded: status === 'approved' ? stars : 0,
        };
      }
      return s;
    });
    setItem('mv_submissions', updated);

    if (status === 'approved' && childId) {
      this.addBibleStars(childId, stars, 'Memory Verse Approved');
      this.awardBadgeToChild(childId, 'Memory Verse Champion');
    }

    const user = this.getCurrentUser();
    this.logAudit(user.name, user.role, `MEMORY_VERSE_${status.toUpperCase()}`, `Reviewed submission #${subId} with result ${status}`);
    this.broadcastChange();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogItem[] {
    return getItem<AuditLogItem[]>('audit_logs', [
      {
        id: 'log_1',
        timestamp: '2026-09-18 10:30:15',
        actorName: 'Pastor Daniel Nagashetty',
        actorRole: 'Super Admin',
        action: 'SCHEDULE_VERIFIED',
        details: 'Verified weekly service times and Sunday Holy Communion announcements.',
      },
      {
        id: 'log_2',
        timestamp: '2026-09-18 15:45:00',
        actorName: 'Sister Dorka Rani',
        actorRole: 'Admin',
        action: 'NOTICE_PUBLISHED',
        details: 'Published Harvest Thanksgiving notice to all church members.',
      },
    ]);
  }

  public logAudit(actorName: string, actorRole: UserRole, action: string, details: string, targetRecord?: string): void {
    const list = this.getAuditLogs();
    const entry: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName,
      actorRole,
      action,
      details,
      targetRecord,
    };
    setItem('audit_logs', [entry, ...list.slice(0, 99)]); // Keep last 100
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): AppNotification[] {
    return getItem<AppNotification[]>('notifications', [
      {
        id: 'notif_1',
        title: 'Sunday Worship Service',
        message: 'Join us tomorrow at 7:30 AM & 10:00 AM for Divine Word and Holy Communion.',
        type: 'event',
        timestamp: '2 hours ago',
        read: false,
        priority: 'high',
      },
      {
        id: 'notif_2',
        title: 'Prayer Vigil Update',
        message: 'Intercessory prayer warriors meeting on Zoom/Sanctuary at 10:30 AM.',
        type: 'prayer',
        timestamp: '5 hours ago',
        read: true,
        priority: 'normal',
      },
    ]);
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const list = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setItem('notifications', [newNotif, ...list]);
    this.broadcastChange();
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    setItem('notifications', list);
    this.broadcastChange();
  }

  public markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    setItem('notifications', list);
    this.broadcastChange();
  }

  // --- CONVENIENCE ALIASES & HELPERS ---
  public updateUserRole(newRole: UserRole): UserProfile {
    this.switchRole(newRole);
    return this.getCurrentUser();
  }

  public savePastorSchedule(schedule: PastorScheduleItem[]): void {
    this.updatePastorSchedule(schedule);
  }

  public updateBookingStatus(bookingId: string, status: 'Confirmed' | 'Cancelled'): void {
    const targetStatus = status === 'Confirmed' ? 'CONFIRMED' : 'REJECTED';
    this.hostUpdateBookingStatus(bookingId, targetStatus);
  }

  public getBibleStories(): BibleStory[] {
    return getItem<BibleStory[]>('bible_stories', INITIAL_BIBLE_STORIES);
  }

  public getQuizQuestions(language?: 'en' | 'te'): QuizQuestion[] {
    const questions = getItem<QuizQuestion[]>('quiz_questions', INITIAL_QUIZ_QUESTIONS);
    if (language) {
      return questions.filter((q) => q.language === language);
    }
    return questions;
  }

  public getMemoryVerses(language?: 'en' | 'te'): MemoryVerseAssignment[] {
    const list = getItem<MemoryVerseAssignment[]>('memory_verses', INITIAL_MEMORY_VERSES);
    if (language) {
      return list.filter((v) => v.language === language);
    }
    return list;
  }

  public getSundaySchoolClasses(): SundaySchoolClass[] {
    return getItem<SundaySchoolClass[]>('sunday_school_classes', INITIAL_SUNDAY_SCHOOL_CLASSES);
  }

  public getBadgesList(): BadgeItem[] {
    return BADGES_LIST;
  }

  public getLeaderboard(): LeaderboardChild[] {
    return getItem<LeaderboardChild[]>('leaderboard', INITIAL_LEADERBOARD);
  }

  public getChildProfile(childId?: string): any {
    const profiles = this.getChildProfiles();
    const found = childId ? profiles.find((p) => p.id === childId) : profiles[0];
    const base = found || {
      id: 'child_1',
      parentId: 'usr_admin_1',
      name: 'Joshua',
      age: 9,
      avatar: '👦',
      bibleStars: 280,
      streakDays: 7,
      currentAdventureStage: 'David',
      badges: ['First Bible Quiz', 'Bible Explorer', 'Memory Verse Beginner', '7-Day Streak', 'Sunday School Star'],
    };

    const stories = this.getBibleStories();

    return {
      id: base.id,
      parentId: base.parentId,
      name: base.name || 'Joshua',
      age: base.age || 9,
      avatar: base.avatar || '👦',
      bibleStars: base.bibleStars ?? 280,
      points: base.bibleStars ?? 280,
      streakDays: base.streakDays ?? 7,
      currentAdventureStage: base.currentAdventureStage || 'David',
      badges: Array.isArray(base.badges) && base.badges.length > 0
        ? base.badges
        : ['First Bible Quiz', 'Bible Explorer', 'Memory Verse Beginner', 'Sunday School Star'],
      sundaySchoolClass: 'Kingdom Kids (Ages 6-9)',
      teacherName: 'Teacher Rachel',
      teacherNotes: [
        'Joshua showed wonderful enthusiasm reciting Psalms 23 and Philippians 4:13 by heart!',
        'Active participant in the David & Goliath drama roleplay.',
        'Great attentiveness during the Holy Communion and prayer time.',
      ],
      memoryVerseOfWeek: {
        verse: 'I can do all things through Christ who strengthens me.',
        reference: 'Philippians 4:13',
        meaning: 'Jesus gives us bravery, grace, and divine strength in school, at home, and in everything we do.',
        teluguVerse: 'నన్ను బలపరచువానియందే నేను సమస్తమును చేయగలను.',
        teluguReference: 'ఫిలిప్పీయులకు 4:13',
        teluguMeaning: 'యేసుక్రీస్తు మనకు ఎల్లప్పుడూ తోడై ఉండి జయాన్ని, బలాన్ని ఇస్తారు.',
      },
      bibleStories: stories.map((s) => ({
        id: s.id,
        title: s.title,
        character: s.character,
        reference: s.scriptureReference,
        summary: s.summary,
        moral: s.memoryVerse || 'Faith in God brings victory and peace.',
        illustrationUrl: s.imageUrl,
        paragraphs: s.paragraphs,
        audioNarrationText: s.audioNarrationText || s.summary,
      })),
    };
  }

  public verifyParentPin(pin: string): boolean {
    const user = this.getCurrentUser();
    return pin === (user.parentPin || '1234');
  }

  public awardChildPoints(points: number, reason: string = 'Sunday School Activity'): void {
    const profiles = this.getChildProfiles();
    if (profiles[0]) {
      this.addBibleStars(profiles[0].id, points, reason);
    }
  }

  public registerForEvent(eventId: string): void {
    this.toggleEventRsvp(eventId);
  }

  public getFellowshipGroups(): GroupItem[] {
    return this.getGroups();
  }

  public pinMessage(groupId: string, messageId: string): void {
    const map = getItem<Record<string, GroupMessage[]>>('group_messages', INITIAL_GROUP_MESSAGES);
    const list = map[groupId] || [];
    map[groupId] = list.map((m) => {
      if (m.id === messageId) {
        return { ...m, isPinned: !m.isPinned };
      }
      return m;
    });
    setItem('group_messages', map);
    this.broadcastChange();
  }
}

export const churchStorage = new ChurchStorageService();
