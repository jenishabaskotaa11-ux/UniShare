import { User, Item } from '../types.ts';
import { SAMPLE_USERS, CURRENT_USER } from '../data/initialData.ts';

export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Student&background=e8f5e9&color=1b5e20';

export function getFallbackAvatar(name: string = 'Student'): string {
  const safeName = encodeURIComponent(name.trim() || 'Student');
  return `https://ui-avatars.com/api/?name=${safeName}&background=e8f5e9&color=1b5e20`;
}

export function handleAvatarError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  name: string = 'Student'
) {
  const target = e.currentTarget;
  const fallback = getFallbackAvatar(name);
  if (target.src !== fallback) {
    target.src = fallback;
  }
}

export interface ResolvedOwner {
  id: string;
  name: string;
  avatar: string;
  program: string;
  year?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  campusHub: string;
  avgReplyTime: string;
  email?: string;
}

export function resolveItemOwner(item?: Partial<Item> | null): ResolvedOwner {
  const fallbackName = 'Verified Student';
  const defaultResolved: ResolvedOwner = {
    id: 'usr_verified_student',
    name: fallbackName,
    avatar: getFallbackAvatar(fallbackName),
    program: 'Apex University',
    year: 'Class of 2026',
    rating: 4.9,
    reviewsCount: 12,
    isVerified: true,
    campusHub: item?.pickupLocation || 'Central Library Desk 1A',
    avgReplyTime: '5 mins',
    email: 'student@university.edu',
  };

  if (!item) {
    return defaultResolved;
  }

  // 1. Direct owner object provided
  if (item.owner && typeof item.owner === 'object') {
    const o = item.owner;
    const name = o.name?.trim() || fallbackName;
    return {
      id: o.id || 'usr_unknown',
      name,
      avatar: o.avatar?.trim() || getFallbackAvatar(name),
      program: o.program || 'Apex University',
      year: o.year || '',
      rating: typeof o.rating === 'number' ? o.rating : 4.9,
      reviewsCount: typeof o.reviewsCount === 'number' ? o.reviewsCount : 10,
      isVerified: o.isVerified !== undefined ? o.isVerified : true,
      campusHub: o.campusHub || item.pickupLocation || 'Central Library Desk 1A',
      avgReplyTime: o.avgReplyTime || '5 mins',
      email: o.email || 'student@university.edu',
    };
  }

  // 2. ownerId lookup
  if (item.ownerId) {
    if (item.ownerId === CURRENT_USER.id) {
      return {
        ...CURRENT_USER,
        avatar: CURRENT_USER.avatar || getFallbackAvatar(CURRENT_USER.name),
        campusHub: CURRENT_USER.campusHub || item.pickupLocation || 'Central Library Desk 1A',
        avgReplyTime: CURRENT_USER.avgReplyTime || '5 mins',
      };
    }

    const matchedUser = SAMPLE_USERS[item.ownerId];
    if (matchedUser) {
      return {
        ...matchedUser,
        avatar: matchedUser.avatar || getFallbackAvatar(matchedUser.name),
        campusHub: matchedUser.campusHub || item.pickupLocation || 'Central Library Desk 1A',
        avgReplyTime: matchedUser.avgReplyTime || '5 mins',
      };
    }
  }

  return defaultResolved;
}
