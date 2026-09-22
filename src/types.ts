export type AcademicCategory =
  | 'Calculators & Academic Tools'
  | 'Textbooks & Study Materials'
  | 'Laptop & Tech Accessories'
  | 'Presentation Equipment'
  | 'IT & Engineering Project Kits'
  | 'Lab Materials'
  | 'Art & Design Materials'
  | 'Campus Event & Project Equipment';

export type CampusHub =
  | 'Central Library Desk 1A'
  | 'Central Library'
  | 'Student Lounge'
  | 'Engineering Block'
  | 'Science Block'
  | 'Main Building'
  | 'Computer Lab Lobby'
  | 'Management Wing'
  | 'Main Cafeteria'
  | 'Main Entrance';

export type ItemCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair';

export type DemandStatus = 'available' | 'low' | 'high_demand' | 'booked';

export interface DayAvailability {
  date: string; // e.g. "2026-09-27"
  displayDate: string; // e.g. "Today, 27 Sept"
  count: number;
  status: DemandStatus;
  note?: string;
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  program: string;
  year?: string;
  studentId?: string;
  avatar: string;
  bio?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  sharePoints: number;
  itemsBorrowed: number;
  itemsLent: number;
  moneySaved: number;
  campusHub?: CampusHub | string;
  avgReplyTime?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorProgram: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Item {
  id: string;
  name: string;
  category: AcademicCategory;
  subcategory?: string;
  description: string;
  image: string;
  condition: ItemCondition;
  pricePerDay: number;
  deposit: number;
  isFree?: boolean;
  isOfficial?: boolean;
  isUrgentDemand?: boolean;
  demandBadge?: 'High Demand' | 'Available Now' | 'Sanitized' | 'Community Free' | 'Only 1 left' | 'Booked Today';
  owner?: User;
  ownerId?: string;
  pickupLocation: CampusHub;
  distanceKm: number;
  currentAvailableCount: number;
  futureAvailabilitySchedule: DayAvailability[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  status: 'active' | 'paused' | 'booked';
  isCreatedByUser?: boolean;
  featureNote?: string;
  specs?: string[];
  productType?: 'scientific' | 'graphing' | 'usbc' | 'dell' | 'hp' | 'lenovo' | 'macbook' | 'labcoat-s' | 'labcoat-m' | 'labcoat-l' | 'labcoat-xl' | 'hdmi' | 'vga' | 'ethernet' | 'other';
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Pre-booked'
  | 'Picked Up'
  | 'Due Soon'
  | 'Returned'
  | 'Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  referenceCode: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  category: AcademicCategory;
  ownerName: string;
  ownerAvatar: string;
  ownerProgram: string;
  borrowerName: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  pickupLocation: CampusHub;
  rentalDays: number;
  dailyFee: number;
  supportFee: number;
  deposit: number;
  totalCost: number;
  status: BookingStatus;
  paymentMethod: 'cash' | 'wallet' | 'card';
  createdAt: string;
  isRated?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  peerProgram: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedItem?: {
    id: string;
    name: string;
    pickupTime?: string;
    location?: string;
    isConfirmed?: boolean;
  };
}

export type NotificationType =
  | 'booking_confirmed'
  | 'pickup_reminder'
  | 'return_reminder'
  | 'high_demand'
  | 'waitlist_update'
  | 'new_message'
  | 'booking_cancelled'
  | 'item_available';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: 'browse' | 'bookings' | 'messages' | 'item-details';
  linkItemId?: string;
}

export interface WaitlistEntry {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  targetDate: string;
  joinedAt: string;
  status: 'waiting' | 'available_notified';
}
