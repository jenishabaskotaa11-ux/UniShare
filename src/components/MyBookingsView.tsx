import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Booking, BookingStatus } from '../types.ts';
import { CancelModal } from './CancelModal.tsx';
import { RatingModal } from './RatingModal.tsx';
import { getFallbackAvatar, handleAvatarError } from '../utils/userHelpers.ts';

export const MyBookingsView: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    startOrOpenConversation,
    openPreBook,
    items,
    setActiveTab,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('active');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [selectedBookingForRate, setSelectedBookingForRate] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'active') return b.status === 'Pre-booked' || b.status === 'Picked Up';
    if (filterTab === 'completed') return b.status === 'Completed' || b.status === 'Returned';
    if (filterTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  const handleMessageLender = (booking: Booking) => {
    const item = items.find((i) => i.id === booking.itemId);
    const owner = (item ? item.owner : null) || {
      id: 'usr_peer',
      name: booking.ownerName || 'Verified Student',
      email: 'peer@university.edu',
      university: 'Apex University',
      program: booking.ownerProgram || 'Student',
      avatar: booking.ownerAvatar || getFallbackAvatar(booking.ownerName),
      rating: 4.9,
      reviewsCount: 10,
      isVerified: true,
      sharePoints: 200,
      itemsBorrowed: 2,
      itemsLent: 5,
      moneySaved: 2000,
      campusHub: booking.pickupLocation || 'Central Library',
    };

    startOrOpenConversation(
      owner,
      `Hi ${booking.ownerName || 'Student'}! Following up on booking ${booking.referenceCode} for ${booking.itemName}.`,
      { id: booking.itemId, name: booking.itemName }
    );
  };

  const handleBookAgain = (booking: Booking) => {
    const item = items.find((i) => i.id === booking.itemId);
    if (item) {
      openPreBook(item);
    } else {
      setActiveTab('browse');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-5 sm:p-6 rounded-3xl border border-surface-container-high shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">My Equipment Loans & Handovers</h2>
          <p className="text-xs text-outline mt-0.5">
            Track active reservations, schedule pickups at campus hubs, and manage returns.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-surface-container-low p-1 rounded-2xl border border-surface-container-high self-start sm:self-auto">
          {[
            { id: 'active', label: 'Upcoming & Active' },
            { id: 'completed', label: 'Past Completed' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'all', label: 'All History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterTab === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-surface border border-surface-container-high space-y-3">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
            <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">No {filterTab} bookings found</h3>
          <p className="text-xs text-outline max-w-sm mx-auto">
            Need a scientific calculator, laptop charger, or lab coat for upcoming classes? Browse what classmates are sharing.
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-colors inline-flex items-center space-x-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>Browse Campus Catalog</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPreBooked = booking.status === 'Pre-booked';
            const isPickedUp = booking.status === 'Picked Up';
            const isCompleted = booking.status === 'Completed' || booking.status === 'Returned';
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking.id}
                className="bg-surface rounded-3xl border border-surface-container-high p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left Item & Lender Overview */}
                <div className="flex items-start space-x-4 min-w-0">
                  <img
                    src={booking.itemImage}
                    alt={booking.itemName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-surface-container"
                  />
                  
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary-container/20">
                        {booking.referenceCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isPreBooked
                            ? 'bg-warning-container text-on-warning-container'
                            : isPickedUp
                            ? 'bg-primary-container text-on-primary'
                            : isCompleted
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                      {booking.itemName}
                    </h3>

                    {/* Lender & Handover Schedule */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-outline pt-1">
                      <div className="flex items-center space-x-1.5">
                        <img
                          src={booking.ownerAvatar || getFallbackAvatar(booking.ownerName)}
                          alt={booking.ownerName || 'Lender'}
                          onError={(e) => handleAvatarError(e, booking.ownerName)}
                          className="w-4 h-4 rounded-full object-cover bg-surface-container"
                        />
                        <span className="text-on-surface font-medium">{booking.ownerName || 'Verified Student'}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] text-primary">calendar_month</span>
                        <span>{booking.pickupDate} ({booking.pickupTime})</span>
                      </div>

                      <div className="flex items-center space-x-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] text-primary">pin_drop</span>
                        <span>{booking.pickupLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Financials & Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-surface-container shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-base font-extrabold text-on-surface">
                      Rs. {booking.totalCost}
                    </span>
                    <span className="text-[11px] text-outline block">
                      Deposit: Rs. {booking.deposit} {isCompleted ? '• Released' : '• Held'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Message Lender Button */}
                    <button
                      onClick={() => handleMessageLender(booking)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold border border-outline-variant flex items-center space-x-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                      <span>Message</span>
                    </button>

                    {/* Actions for Pre-booked */}
                    {isPreBooked && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'Picked Up')}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-xs flex items-center space-x-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">verified</span>
                          <span>Mark Picked Up</span>
                        </button>

                        <button
                          onClick={() => setSelectedBookingForCancel(booking)}
                          className="px-2.5 py-1.5 rounded-xl text-error hover:bg-error/10 text-xs font-semibold transition-colors"
                          title="Cancel reservation"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {/* Actions for Picked Up */}
                    {isPickedUp && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'Completed')}
                        className="px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:opacity-90 shadow-xs flex items-center space-x-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        <span>Mark Returned (+10 pts)</span>
                      </button>
                    )}

                    {/* Actions for Completed */}
                    {isCompleted && (
                      <>
                        {!booking.isRated ? (
                          <button
                            onClick={() => setSelectedBookingForRate(booking)}
                            className="px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold hover:bg-secondary-container/80 flex items-center space-x-1 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px] fill-current">star</span>
                            <span>Rate Lender</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-secondary flex items-center px-2 py-1 bg-secondary-container/20 rounded-lg">
                            <span className="material-symbols-outlined text-[14px] fill-current mr-1">check</span>
                            Reviewed
                          </span>
                        )}

                        <button
                          onClick={() => handleBookAgain(booking)}
                          className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-colors"
                        >
                          Book Again
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {selectedBookingForCancel && (
        <CancelModal
          booking={selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
        />
      )}

      {/* Rating Modal */}
      {selectedBookingForRate && (
        <RatingModal
          booking={selectedBookingForRate}
          onClose={() => setSelectedBookingForRate(null)}
        />
      )}

    </div>
  );
};
