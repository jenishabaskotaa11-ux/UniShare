import React, { useState } from 'react';
import { Item } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { resolveItemOwner, getFallbackAvatar } from '../utils/userHelpers.ts';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const {
    openItemDetail,
    openPreBook,
    toggleFavorite,
    isFavorite,
    joinWaitlist,
    isItemWaitlisted,
  } = useApp();

  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (!item) return null;

  const owner = resolveItemOwner(item);
  const ownerName = owner.name;
  const ownerAvatar = avatarError ? getFallbackAvatar(ownerName) : owner.avatar;

  const favorited = isFavorite(item.id);
  const waitlisted = isItemWaitlisted(item.id);

  // Fallback image map based on category
  const getFallbackImage = () => {
    const cat = item.category || '';
    if (cat.includes('Calculator')) {
      return 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('Laptop') || cat.includes('Tech')) {
      return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('Lab')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9FuXEK0eXQr868y2BSBfM6qQ32Q579bLNAFrVB8wh75Nv6vBChIJFFe4bpcl8RCb3au2th5NCYy_uhNa0vzcH7XNInSlIBmW4Kw0RN9UStF-3A2xh1eNtf9TKgqc_ibS-EOenJpG0IYJbSRKoXNjAArpyMVipo3ywn9vL1Dl5SJcuuDDFSbbXbuFqQg_uSS0a3oSov7CEiBXaMT7vM150a7W2QrXL_mC8P5FLlIwVt4MKOrdfSxNR';
    }
    if (cat.includes('Presentation')) {
      return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
  };

  const isBookedOut = item.currentAvailableCount === 0 || item.status === 'booked';
  const schedule = Array.isArray(item.futureAvailabilitySchedule)
    ? item.futureAvailabilitySchedule.slice(0, 5)
    : [];

  return (
    <div
      onClick={() => openItemDetail(item)}
      className="group relative bg-surface rounded-2xl border border-surface-container-high overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-primary/40"
    >
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        <img
          src={imageError ? getFallbackImage() : (item.image || getFallbackImage())}
          alt={item.name || 'Equipment'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            favorited
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface/80 text-on-surface hover:bg-surface hover:scale-110 shadow-xs'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className={`material-symbols-outlined text-[20px] ${favorited ? 'fill-current' : ''}`}>
            favorite
          </span>
        </button>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
          {item.demandBadge && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-md ${
                item.demandBadge.includes('High')
                  ? 'bg-warning-container text-on-warning-container'
                  : item.demandBadge.includes('Sanitized')
                  ? 'bg-secondary-container text-on-secondary-container'
                  : item.demandBadge.includes('Free')
                  ? 'bg-primary text-on-primary'
                  : item.demandBadge.includes('Booked')
                  ? 'bg-error text-on-error'
                  : 'bg-surface/90 text-on-surface'
              }`}
            >
              {item.demandBadge}
            </span>
          )}

          {item.isFree && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
              Community Free
            </span>
          )}
        </div>

        {/* Price Tag Overlay on Bottom of Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-surface-container-high shadow-xs">
            <span className="text-xs font-bold text-on-surface">
              {item.pricePerDay === 0 ? 'Rs. 0' : `Rs. ${item.pricePerDay ?? 0}`}
            </span>
            <span className="text-[10px] text-outline font-normal"> / day</span>
          </div>

          <span className="bg-surface/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-outline">
            {item.condition || 'Good'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between text-[11px] text-outline mb-1">
            <span className="truncate">{item.category || 'General Equipment'}</span>
            <span className="shrink-0 flex items-center text-primary font-medium">
              <span className="material-symbols-outlined text-[14px] text-secondary fill-current mr-0.5">star</span>
              {item.rating ?? 4.9} ({item.reviewsCount ?? 0})
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {item.name}
          </h3>

          {/* Predictive Note / 5-Day Mini Schedule */}
          <div className="mt-2.5 bg-surface-container-low rounded-xl p-2 border border-surface-container">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-medium text-on-surface-variant flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isBookedOut ? 'bg-error' : item.currentAvailableCount === 1 ? 'bg-warning' : 'bg-secondary'
                }`}></span>
                {item.featureNote || (isBookedOut ? 'Booked Today' : `${item.currentAvailableCount ?? 1} available now`)}
              </span>
              <span className="text-[10px] text-outline">5-day window</span>
            </div>

            {/* Visual 5-Day Status Dots */}
            <div className="grid grid-cols-5 gap-1 text-center">
              {schedule.map((slot, idx) => {
                const dayLabel = idx === 0 ? 'Today' : idx === 1 ? 'Thu' : idx === 2 ? 'Fri' : idx === 3 ? 'Sat' : 'Sun';
                const statusColor =
                  slot.status === 'booked' || slot.count === 0
                    ? 'bg-error/20 text-error border-error/30'
                    : slot.status === 'low' || slot.count === 1
                    ? 'bg-warning/20 text-on-warning-container border-warning/30'
                    : 'bg-secondary/15 text-secondary border-secondary/30';

                return (
                  <div
                    key={slot.date || idx}
                    className={`py-0.5 rounded text-[9px] font-semibold border ${statusColor}`}
                    title={`${slot.displayDate || 'Date'}: ${slot.count ?? 0} available`}
                  >
                    <span>{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Owner & Pickup Hub info */}
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-surface-container">
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={ownerAvatar}
                alt={ownerName}
                onError={() => setAvatarError(true)}
                className="w-6 h-6 rounded-full object-cover shrink-0 bg-surface-container border border-surface-container-high"
                loading="lazy"
              />
              <span className="truncate text-on-surface font-medium text-[11px]">
                {ownerName}
              </span>
            </div>
            <div className="text-[11px] text-outline flex items-center shrink-0">
              <span className="material-symbols-outlined text-[13px] mr-0.5 text-primary">pin_drop</span>
              <span>{item.distanceKm ?? 0.4} km</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-1 flex items-center space-x-2">
          {isBookedOut ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                joinWaitlist(item.id);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                waitlisted
                  ? 'bg-surface-container text-on-surface-variant border border-outline'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {waitlisted ? 'done' : 'notifications_active'}
              </span>
              <span>{waitlisted ? 'On Waitlist' : 'Join Waitlist'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPreBook(item);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-all flex items-center justify-center space-x-1 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                <span>Pre-book</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openItemDetail(item);
                }}
                className="py-2 px-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-colors"
                title="View details & specs"
              >
                <span className="material-symbols-outlined text-[16px]">info</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
