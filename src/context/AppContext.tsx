import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Item,
  Booking,
  Conversation,
  ChatMessage,
  NotificationItem,
  WaitlistEntry,
  AcademicCategory,
  CampusHub,
  BookingStatus,
} from '../types.ts';
import {
  CURRENT_USER,
  INITIAL_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData.ts';
import { resolveItemOwner, getFallbackAvatar } from '../utils/userHelpers.ts';

export type NavTab =
  | 'home'
  | 'browse'
  | 'pre-book'
  | 'bookings'
  | 'messages'
  | 'list-item'
  | 'lender-dashboard'
  | 'lender'
  | 'profile'
  | 'impact'
  | 'item-details';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  items: Item[];
  bookings: Booking[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  notifications: NotificationItem[];
  favorites: string[];
  waitlists: WaitlistEntry[];
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCategory: AcademicCategory | 'All' | null;
  setSelectedCategory: (cat: AcademicCategory | 'All' | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedHub: string;
  setSelectedHub: (hub: string) => void;
  selectedDateFilter: 'today' | 'tomorrow' | 'this-week' | 'choose';
  setSelectedDateFilter: (filter: 'today' | 'tomorrow' | 'this-week' | 'choose') => void;
  
  // Modals & View Details
  selectedItemForDetail: Item | null;
  openItemDetail: (item: Item) => void;
  closeItemDetail: () => void;

  selectedItemForPreBook: Item | null;
  openPreBook: (item: Item, preferredDate?: string) => void;
  closePreBook: () => void;

  authModalOpen: boolean;
  authMode: 'signin' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;

  // Actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  signup: (userData: { name: string; email: string; university: string; program: string; password: string }) => { success: boolean; error?: string };
  updateProfile: (updated: Partial<User>) => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  createBooking: (payload: {
    itemId: string;
    pickupDate: string;
    returnDate: string;
    pickupTime: string;
    pickupLocation: CampusHub;
    paymentMethod: 'cash' | 'wallet' | 'card';
  }) => { success: boolean; referenceCode?: string; booking?: Booking };

  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  addRating: (bookingId: string, itemId: string, stars: number, comment: string) => void;
  joinWaitlist: (itemId: string, targetDate?: string) => void;
  isItemWaitlisted: (itemId: string) => boolean;

  listItem: (newItem: Omit<Item, 'id' | 'owner' | 'rating' | 'reviewsCount' | 'reviews' | 'status' | 'isCreatedByUser' | 'futureAvailabilitySchedule' | 'currentAvailableCount'> & { initialAvailableCount?: number }) => void;
  updateItem: (itemId: string, updated: Partial<Item>) => void;
  deleteItem: (itemId: string) => void;
  togglePauseItem: (itemId: string) => void;

  sendMessage: (conversationId: string, text: string) => void;
  startOrOpenConversation: (peerUser: User, initialMsg?: string, relatedItem?: { id: string; name: string }) => string;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerDemoAvailabilityRestored: (itemId: string) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unishare_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  // 2. Items
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('unishare_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  // 3. Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('unishare_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // 4. Conversations & Messages
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('unishare_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('unishare_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // 5. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('unishare_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 6. Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('unishare_favorites');
    return saved ? JSON.parse(saved) : ['item-1', 'item-4'];
  });

  // 7. Waitlists
  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem('unishare_waitlists');
    return saved ? JSON.parse(saved) : [
      { id: 'wl-1', itemId: 'item-6', itemName: 'Arduino Uno Rev3 Complete Kit', itemImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoEIBH_H8O_c2oL9T6gdagxgs6yTaSRS4tqXWR-lRxyaaVp2tRSlrTlKLZwcGC3_1SgfR0UeT1fx0Ia8V76kCgTuTHdSrPnKPuXEfi7AA_QFs_zmLKPcN8vF8LWyg_nPcQgpdDVKXbFcbm7xOHrgOyMeS_UUq1dg--nuUXNMH9Ic6-VnPvLouGtGcyZe7QAJ_XbuTd3RhHVpmjLo_XPotoKRQ_vdZphfEfQzWocI_kHbDhKRXJ4fJm', targetDate: '2026-09-28', joinedAt: '2026-09-27', status: 'waiting' }
    ];
  });

  // Nav state & filters
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<AcademicCategory | 'All' | null>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHub, setSelectedHub] = useState<string>('All Campus Hubs');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'tomorrow' | 'this-week' | 'choose'>('tomorrow');

  // Modals
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | null>(null);
  const [selectedItemForPreBook, setSelectedItemForPreBook] = useState<Item | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('unishare_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('unishare_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('unishare_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('unishare_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('unishare_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('unishare_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('unishare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('unishare_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('unishare_waitlists', JSON.stringify(waitlists));
  }, [waitlists]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth
  const login = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your university email.' };
    }
    if (!trimmedEmail.includes('@') || (!trimmedEmail.endsWith('.edu') && !trimmedEmail.includes('university') && !trimmedEmail.includes('campus'))) {
      return { success: false, error: 'Please enter a valid university email address (e.g. name@university.edu).' };
    }
    // Demo credentials check
    if (trimmedEmail === 'riya@university.edu' && pass !== 'demo123') {
      return { success: false, error: 'Incorrect password for demo account. Password is: demo123' };
    }
    if (pass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const user: User = {
      ...CURRENT_USER,
      email: trimmedEmail,
    };
    setCurrentUser(user);
    setAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}! Verified .edu session active.`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const signup = (userData: { name: string; email: string; university: string; program: string; password: string }) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    if (!trimmedEmail.includes('@')) {
      return { success: false, error: 'Invalid university email format.' };
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'University Student',
      email: trimmedEmail,
      university: userData.university || 'Apex University • Main Campus',
      program: userData.program || 'General Academic Studies',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'New verified campus member. Excited to borrow and share college resources!',
      rating: 5.0,
      reviewsCount: 0,
      isVerified: true,
      sharePoints: 100, // Welcome bonus
      itemsBorrowed: 0,
      itemsLent: 0,
      moneySaved: 0,
      campusHub: 'Central Library',
      avgReplyTime: '10 mins',
    };
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    showToast(`Welcome to UniShare, ${newUser.name}! +100 SharePoints added.`);
    return { success: true };
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    showToast('Profile updated successfully!');
  };

  const openAuthModal = (mode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Favorites
  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== itemId);
      } else {
        showToast('Saved to your favorites!');
        return [...prev, itemId];
      }
    });
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Detail & PreBook Modals
  const openItemDetail = (item: Item) => {
    setSelectedItemForDetail(item);
  };

  const closeItemDetail = () => {
    setSelectedItemForDetail(null);
  };

  const openPreBook = (item: Item, _preferredDate?: string) => {
    setSelectedItemForPreBook(item);
  };

  const closePreBook = () => {
    setSelectedItemForPreBook(null);
  };

  // Booking Flow
  const createBooking = (payload: {
    itemId: string;
    pickupDate: string;
    returnDate: string;
    pickupTime: string;
    pickupLocation: CampusHub;
    paymentMethod: 'cash' | 'wallet' | 'card';
  }) => {
    const item = items.find((i) => i.id === payload.itemId);
    if (!item) return { success: false };

    // Calculate days
    const d1 = new Date(payload.pickupDate);
    const d2 = new Date(payload.returnDate);
    const diffTime = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyFee = item.pricePerDay;
    const totalDaily = dailyFee * diffTime;
    const supportFee = item.isFree ? 5 : 5;
    const deposit = item.deposit;
    const totalCost = totalDaily + supportFee;

    const refNum = Math.floor(100 + Math.random() * 900);
    const dateFormatted = payload.pickupDate.replace(/-/g, '').slice(2);
    const referenceCode = `UNI-${dateFormatted}-${refNum}`;

    const owner = resolveItemOwner(item);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      referenceCode,
      itemId: item.id,
      itemName: item.name,
      itemImage: item.image,
      category: item.category,
      ownerName: owner.name,
      ownerAvatar: owner.avatar,
      ownerProgram: `${owner.program} • ${owner.year || ''}`,
      borrowerName: currentUser?.name || 'Riya Sharma',
      pickupDate: payload.pickupDate,
      returnDate: payload.returnDate,
      pickupTime: payload.pickupTime,
      pickupLocation: payload.pickupLocation,
      rentalDays: diffTime,
      dailyFee,
      supportFee,
      deposit,
      totalCost,
      status: 'Pre-booked',
      paymentMethod: payload.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Decrease item availability
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        const newCount = Math.max(0, i.currentAvailableCount - 1);
        const updatedSchedule = i.futureAvailabilitySchedule.map((slot) => {
          if (slot.date === payload.pickupDate) {
            const slotCount = Math.max(0, slot.count - 1);
            return {
              ...slot,
              count: slotCount,
              status: slotCount === 0 ? 'booked' : slotCount <= 1 ? 'low' : slot.status,
            };
          }
          return slot;
        });
        return {
          ...i,
          currentAvailableCount: newCount,
          futureAvailabilitySchedule: updatedSchedule,
          demandBadge: newCount === 0 ? 'Booked Today' : newCount === 1 ? 'Only 1 left' : i.demandBadge,
          status: newCount === 0 ? 'booked' : i.status,
        };
      })
    );

    // Add Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: `Your booking for ${item.name} is confirmed for ${payload.pickupDate} at ${payload.pickupTime} (${referenceCode}).`,
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'bookings',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Award SharePoints
    if (currentUser) {
      setCurrentUser((prev) => prev ? {
        ...prev,
        sharePoints: prev.sharePoints + 15,
        itemsBorrowed: prev.itemsBorrowed + 1,
        moneySaved: prev.moneySaved + (item.pricePerDay > 0 ? item.pricePerDay * 3 : 500),
      } : prev);
    }

    showToast(`Pre-booking confirmed! Reference: ${referenceCode} (+15 SharePoints)`);
    return { success: true, referenceCode, booking: newBooking };
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );

    // Restore item availability
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== booking.itemId) return i;
        const newCount = i.currentAvailableCount + 1;
        const updatedSchedule = i.futureAvailabilitySchedule.map((slot) => {
          if (slot.date === booking.pickupDate) {
            const slotCount = slot.count + 1;
            return {
              ...slot,
              count: slotCount,
              status: slotCount >= 2 ? 'available' : slot.status,
            };
          }
          return slot;
        });
        return {
          ...i,
          currentAvailableCount: newCount,
          futureAvailabilitySchedule: updatedSchedule,
          status: 'active',
          demandBadge: newCount > 1 && i.demandBadge === 'Booked Today' ? 'Available Now' : i.demandBadge,
        };
      })
    );

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Booking ${booking.referenceCode} for ${booking.itemName} was cancelled. Any held deposit has been released.`,
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'bookings',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Booking ${booking.referenceCode} cancelled and slot released.`, 'info');
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    if (status === 'Picked Up') {
      showToast('Item marked as Picked Up. Happy learning!');
    } else if (status === 'Returned' || status === 'Completed') {
      showToast('Item marked as Returned! +10 SharePoints awarded.');
      if (currentUser) {
        setCurrentUser((prev) => prev ? { ...prev, sharePoints: prev.sharePoints + 10 } : prev);
      }
    }
  };

  const addRating = (bookingId: string, itemId: string, stars: number, comment: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, isRated: true } : b))
    );

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newReview = {
          id: `rev-${Date.now()}`,
          authorName: currentUser?.name || 'Riya Sharma',
          authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          authorProgram: currentUser?.program || 'CS sophomore',
          rating: stars,
          date: 'Just now',
          comment,
        };
        const updatedReviews = [newReview, ...item.reviews];
        const avg = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...item,
          rating: avg,
          reviewsCount: updatedReviews.length,
          reviews: updatedReviews,
        };
      })
    );

    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, sharePoints: prev.sharePoints + 5 } : prev);
    }
    showToast('Review submitted! Thank you for supporting the campus community (+5 pts).');
  };

  // Waitlist
  const joinWaitlist = (itemId: string, targetDate: string = '2026-09-28') => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (waitlists.some((w) => w.itemId === itemId)) {
      showToast('You are already on the waitlist for this item.', 'info');
      return;
    }

    const newEntry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemImage: item.image,
      targetDate,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'waiting',
    };

    setWaitlists((prev) => [...prev, newEntry]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'waitlist_update',
      title: 'Joined Waitlist',
      message: `You've joined the waitlist for ${item.name}. We'll notify you the instant a peer returns or frees a slot.`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Joined waitlist for ${item.name}! You will be alerted first.`);
  };

  const isItemWaitlisted = (itemId: string) => waitlists.some((w) => w.itemId === itemId);

  // Trigger Demo availability restored (classroom demo feature!)
  const triggerDemoAvailabilityRestored = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const newSchedule = i.futureAvailabilitySchedule.map((s, idx) =>
          idx === 1 ? { ...s, count: 2, status: 'available' as const } : s
        );
        return {
          ...i,
          currentAvailableCount: 2,
          futureAvailabilitySchedule: newSchedule,
          status: 'active',
          demandBadge: 'Available Now',
        };
      })
    );

    setWaitlists((prev) =>
      prev.map((w) => (w.itemId === itemId ? { ...w, status: 'available_notified' } : w))
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'item_available',
      title: 'Good news! Slot Opened',
      message: `A ${item.name} is now available for 28 Sept! Book now to secure it.`,
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'item-details',
      linkItemId: item.id,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Demo Event: ${item.name} is now available for 28 Sept!`);
  };

  // List Item Flow
  const listItem = (newItemData: Omit<Item, 'id' | 'owner' | 'rating' | 'reviewsCount' | 'reviews' | 'status' | 'isCreatedByUser' | 'futureAvailabilitySchedule' | 'currentAvailableCount'> & { initialAvailableCount?: number }) => {
    if (!currentUser) {
      openAuthModal('signin');
      return;
    }

    const availableCount = newItemData.initialAvailableCount || 1;
    const schedule = [
      { date: '2026-09-27', displayDate: 'Today, 27 Sept', count: availableCount, status: 'available' as const, note: 'Listed today' },
      { date: '2026-09-28', displayDate: 'Tomorrow, 28 Sept', count: availableCount, status: 'available' as const, note: 'Available' },
      { date: '2026-09-29', displayDate: 'Friday, 29 Sept', count: availableCount, status: 'available' as const, note: 'Available' },
      { date: '2026-09-30', displayDate: 'Saturday, 30 Sept', count: availableCount, status: 'available' as const, note: 'Weekend slot' },
      { date: '2026-10-01', displayDate: 'Sunday, 01 Oct', count: availableCount, status: 'available' as const, note: 'Available' },
    ];

    const newItem: Item = {
      ...newItemData,
      id: `item-${Date.now()}`,
      owner: currentUser,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      status: 'active',
      isCreatedByUser: true,
      currentAvailableCount: availableCount,
      futureAvailabilitySchedule: schedule,
      demandBadge: 'Available Now',
      featureNote: 'Listed by you',
    };

    setItems((prev) => [newItem, ...prev]);

    // +20 SharePoints for listing
    setCurrentUser((prev) => prev ? {
      ...prev,
      itemsLent: prev.itemsLent + 1,
      sharePoints: prev.sharePoints + 20,
    } : prev);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'high_demand',
      title: 'Listing Published!',
      message: `"${newItem.name}" is now live in the campus directory. Peers in your hub can browse and pre-book it. (+20 SharePoints)`,
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'browse',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Published "${newItem.name}" successfully! (+20 SharePoints)`);
    setActiveTab('browse');
  };

  const updateItem = (itemId: string, updated: Partial<Item>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, ...updated } : i))
    );
    showToast('Listing updated successfully!');
  };

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Listing deleted.', 'info');
  };

  const togglePauseItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const newStatus = i.status === 'active' ? 'paused' : 'active';
        showToast(newStatus === 'paused' ? 'Listing paused from campus search.' : 'Listing reactivated!');
        return { ...i, status: newStatus };
      })
    );
  };

  // Messaging
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim() || !currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastMessageTime: 'Just now',
            }
          : c
      )
    );

    // Simulate smart quick reply from peer after 2.5 seconds if first reply
    setTimeout(() => {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          conversationId,
          senderId: conv.peerId,
          senderName: conv.peerName,
          text: `Got it! Sounds good to meet at ${conv.relatedItem?.location || 'the Central Library hub'}. Let's do it!`,
          timestamp: 'Just now',
          isRead: false,
        };
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: replyMsg.text,
                  lastMessageTime: 'Just now',
                  unreadCount: (c.unreadCount || 0) + 1,
                }
              : c
          )
        );
      }
    }, 2000);
  };

  const startOrOpenConversation = (peerUser: Partial<User>, initialMsg?: string, relatedItem?: { id: string; name: string }) => {
    const peerId = peerUser?.id || `usr-${Date.now()}`;
    const peerName = peerUser?.name?.trim() || 'Verified Student';
    const peerAvatar = peerUser?.avatar?.trim() || getFallbackAvatar(peerName);
    const peerProgram = peerUser?.program ? `${peerUser.program} • ${peerUser.year || ''}` : 'Apex University';
    const peerHub = peerUser?.campusHub || 'Central Library Desk 1A';

    const existing = conversations.find((c) => c.peerId === peerId);
    if (existing) {
      if (initialMsg) {
        sendMessage(existing.id, initialMsg);
      }
      setActiveTab('messages');
      return existing.id;
    }

    const convId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: convId,
      peerId,
      peerName,
      peerAvatar,
      peerProgram,
      lastMessage: initialMsg || `Chat started regarding ${relatedItem?.name || 'peer loan'}`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      relatedItem: relatedItem
        ? {
            id: relatedItem.id,
            name: relatedItem.name,
            location: peerHub,
          }
        : undefined,
    };

    setConversations((prev) => [newConv, ...prev]);

    if (initialMsg && currentUser) {
      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: convId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: initialMsg,
        timestamp: 'Just now',
        isRead: true,
      };
      setMessages((prev) => ({ ...prev, [convId]: [msg] }));
    }

    setActiveTab('messages');
    return convId;
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        items,
        bookings,
        conversations,
        messages,
        notifications,
        favorites,
        waitlists,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedHub,
        setSelectedHub,
        selectedDateFilter,
        setSelectedDateFilter,

        selectedItemForDetail,
        openItemDetail,
        closeItemDetail,

        selectedItemForPreBook,
        openPreBook,
        closePreBook,

        authModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,

        login,
        logout,
        signup,
        updateProfile,
        toggleFavorite,
        isFavorite,

        createBooking,
        cancelBooking,
        updateBookingStatus,
        addRating,
        joinWaitlist,
        isItemWaitlisted,

        listItem,
        updateItem,
        deleteItem,
        togglePauseItem,

        sendMessage,
        startOrOpenConversation,

        markNotificationRead,
        markAllNotificationsRead,
        triggerDemoAvailabilityRestored,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
