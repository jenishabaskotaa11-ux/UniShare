import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { resolveItemOwner, getFallbackAvatar } from '../utils/userHelpers.ts';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedItemForDetail,
    closeItemDetail,
    openPreBook,
    toggleFavorite,
    isFavorite,
    startOrOpenConversation,
    joinWaitlist,
    isItemWaitlisted,
    triggerDemoAvailabilityRestored,
  } = useApp();

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-09-28');
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const owner = resolveItemOwner(item);
  const ownerName = owner.name;
  const ownerAvatar = avatarError ? getFallbackAvatar(ownerName) : owner.avatar;

  const favorited = isFavorite(item.id);
  const waitlisted = isItemWaitlisted(item.id);
  const isBookedOut = item.currentAvailableCount === 0 || item.status === 'booked';

  const handleMessageOwner = () => {
    const peerUser = {
      id: owner.id,
      name: owner.name,
      email: owner.email || 'student@university.edu',
      university: 'Apex University',
      program: owner.program,
      avatar: owner.avatar,
      rating: owner.rating,
      reviewsCount: owner.reviewsCount,
      isVerified: owner.isVerified,
      sharePoints: 200,
      itemsBorrowed: 2,
      itemsLent: 5,
      moneySaved: 2000,
      campusHub: owner.campusHub,
    };

    startOrOpenConversation(peerUser, `Hi ${ownerName}! I'm interested in borrowing your ${item.name}. Is it available for handover at ${item.pickupLocation}?`, {
      id: item.id,
      name: item.name,
    });
    closeItemDetail();
  };

  const handleBookDate = (date: string) => {
    setSelectedCalendarDate(date);
    openPreBook(item, date);
    closeItemDetail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-scrim/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-surface rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high bg-surface shrink-0">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant">
              {item.category}
            </span>
            <span className="text-xs text-outline">• {item.condition}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full transition-colors ${
                favorited
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container text-outline hover:text-on-surface'
              }`}
              aria-label="Save to favorites"
            >
              <span className={`material-symbols-outlined text-[20px] ${favorited ? 'fill-current' : ''}`}>
                favorite
              </span>
            </button>

            <button
              onClick={closeItemDetail}
              className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image Preview & Badges */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] border border-surface-container">
              <img
                src={imageError ? 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' : item.image}
                alt={item.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {item.demandBadge && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface/90 backdrop-blur-md text-on-surface shadow-xs">
                    {item.demandBadge}
                  </span>
                )}
                {item.isFree && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                    100% Free
                  </span>
                )}
              </div>
            </div>

            {/* Core Info & Pricing */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface leading-snug">
                  {item.name}
                </h2>
                
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary fill-current mr-0.5">star</span>
                    <span>{item.rating}</span>
                  </div>
                  <span className="text-xs text-outline">({item.reviewsCount} student reviews)</span>
                  <span className="text-outline">•</span>
                  <span className="text-xs text-on-surface-variant font-medium flex items-center">
                    <span className="material-symbols-outlined text-[14px] mr-0.5 text-primary">pin_drop</span>
                    {item.pickupLocation}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-on-surface">
                      {item.pricePerDay === 0 ? 'Free' : `Rs. ${item.pricePerDay}`}
                    </span>
                    <span className="text-xs text-outline font-normal"> / 24-hr day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-on-surface-variant block">
                      Refundable Deposit
                    </span>
                    <span className="text-xs text-outline">Rs. {item.deposit} (held securely)</span>
                  </div>
                </div>

                {/* Specs Pill List */}
                {item.specs && item.specs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">
                      Key Highlights & Inclusions
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-on-surface-variant">
                      {item.specs.map((spec, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Owner Micro Card */}
              <div className="p-3.5 rounded-2xl bg-surface-container border border-surface-container-high flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={ownerAvatar}
                    alt={ownerName}
                    onError={() => setAvatarError(true)}
                    className="w-10 h-10 rounded-full object-cover border border-primary shrink-0 bg-surface-container-high"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate flex items-center">
                      {ownerName}
                      <span className="material-symbols-outlined text-[14px] text-secondary ml-1">verified</span>
                    </p>
                    <p className="text-[11px] text-outline truncate">{owner.program}</p>
                    <p className="text-[10px] text-outline">Replies in ~{owner.avgReplyTime || '5 mins'}</p>
                  </div>
                </div>

                <button
                  onClick={handleMessageOwner}
                  className="px-3 py-1.5 rounded-xl bg-surface text-on-surface hover:bg-surface-container-high text-xs font-semibold border border-outline-variant transition-colors flex items-center space-x-1 shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Chat</span>
                </button>
              </div>

            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Item Details & Campus Usage
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-surface-container">
              {item.description}
            </p>
          </div>

          {/* 5-Day Interactive Availability Schedule */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
                  5-Day Interactive Availability Calendar
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Click any available date slot below to pre-book your equipment pickup.
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-3 text-[11px]">
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary mr-1"></span> Available
                </span>
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-warning mr-1"></span> Low stock
                </span>
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-error mr-1"></span> Booked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {item.futureAvailabilitySchedule.map((slot) => {
                const isSelected = selectedCalendarDate === slot.date;
                const isBooked = slot.count === 0 || slot.status === 'booked';
                const isLow = slot.status === 'low';

                return (
                  <button
                    key={slot.date}
                    onClick={() => {
                      if (!isBooked) {
                        handleBookDate(slot.date);
                      }
                    }}
                    disabled={isBooked}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary-container/20'
                        : isBooked
                        ? 'opacity-60 bg-surface-container-low border-surface-container cursor-not-allowed'
                        : 'bg-surface hover:bg-surface-container border-outline-variant hover:border-primary'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-on-surface">{slot.displayDate.split(',')[0]}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          isBooked ? 'bg-error' : isLow ? 'bg-warning' : 'bg-secondary'
                        }`}></span>
                      </div>
                      <span className="text-[11px] text-outline block">{slot.date}</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-surface-container">
                      <span className={`text-[11px] font-bold block ${
                        isBooked ? 'text-error' : isLow ? 'text-warning' : 'text-secondary'
                      }`}>
                        {isBooked ? 'Fully Booked' : `${slot.count} Available`}
                      </span>
                      <span className="text-[10px] text-outline truncate block mt-0.5">
                        {slot.note || 'Regular slot'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Demo Helper: Restore Availability (useful for live presentations) */}
            {isBookedOut && (
              <div className="mt-3 p-3 rounded-xl bg-surface-container text-xs flex items-center justify-between">
                <span className="text-outline">
                  Currently booked for today. Want to test slot notification?
                </span>
                <button
                  onClick={() => triggerDemoAvailabilityRestored(item.id)}
                  className="px-2.5 py-1 rounded-lg bg-surface text-primary font-semibold hover:bg-surface-container-high border border-outline-variant"
                >
                  Simulate Slot Freed 🔔
                </button>
              </div>
            )}
          </div>

          {/* Student Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
                Verified Student Reviews ({item.reviewsCount})
              </h4>
              <span className="text-xs font-semibold text-primary">
                100% Peer Verified
              </span>
            </div>

            {item.reviews.length === 0 ? (
              <div className="p-4 rounded-2xl bg-surface-container-low text-center text-xs text-outline">
                Be the first to borrow and leave a review for this listing!
              </div>
            ) : (
              <div className="space-y-2.5">
                {item.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-on-surface">{rev.authorName}</span>
                        <span className="text-[11px] text-outline">• {rev.authorProgram}</span>
                      </div>
                      <div className="flex items-center text-secondary">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[14px] fill-current">star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-on-surface-variant">{rev.comment}</p>
                    <span className="text-[10px] text-outline mt-1 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-surface-container-high bg-surface flex items-center justify-between shrink-0">
          <div>
            <span className="text-lg font-bold text-on-surface">
              {item.pricePerDay === 0 ? 'Free' : `Rs. ${item.pricePerDay}`}
            </span>
            <span className="text-xs text-outline"> / day</span>
            <span className="text-[11px] text-outline block">Handover at {item.pickupLocation}</span>
          </div>

          <div className="flex items-center space-x-2">
            {isBookedOut ? (
              <button
                onClick={() => joinWaitlist(item.id, selectedCalendarDate)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center space-x-1.5 ${
                  waitlisted
                    ? 'bg-surface-container text-on-surface-variant border border-outline'
                    : 'bg-primary text-on-primary hover:bg-primary-hover shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {waitlisted ? 'done' : 'notifications_active'}
                </span>
                <span>{waitlisted ? 'Already on Waitlist' : 'Join Waitlist for This Slot'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  openPreBook(item, selectedCalendarDate);
                  closeItemDetail();
                }}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Pre-book for {selectedCalendarDate}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
