import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CampusHub, Booking } from '../types.ts';
import { CAMPUS_HUBS } from './HeroSection.tsx';
import { resolveItemOwner } from '../utils/userHelpers.ts';

export const PreBookModal: React.FC = () => {
  const {
    selectedItemForPreBook,
    closePreBook,
    createBooking,
    currentUser,
    openAuthModal,
    setActiveTab,
    startOrOpenConversation,
  } = useApp();

  const [pickupDate, setPickupDate] = useState('2026-09-28');
  const [returnDate, setReturnDate] = useState('2026-09-29');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [pickupHub, setPickupHub] = useState<CampusHub>(
    (selectedItemForPreBook?.pickupLocation as CampusHub) || 'Central Library Desk 1A'
  );
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash' | 'card'>('wallet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!selectedItemForPreBook) return null;

  const item = selectedItemForPreBook;
  const owner = resolveItemOwner(item);

  // Calculate rental days
  const d1 = new Date(pickupDate);
  const d2 = new Date(returnDate);
  const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));

  const dailyFee = item.pricePerDay;
  const subtotal = dailyFee * diffDays;
  const supportFee = 5;
  const deposit = item.deposit;
  const totalDue = subtotal + supportFee;

  const handleConfirm = () => {
    if (!currentUser) {
      closePreBook();
      openAuthModal('signin');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = createBooking({
        itemId: item.id,
        pickupDate,
        returnDate,
        pickupTime,
        pickupLocation: pickupHub,
        paymentMethod,
      });

      setIsSubmitting(false);
      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
      }
    }, 700);
  };

  const handleViewBookings = () => {
    closePreBook();
    setActiveTab('bookings');
  };

  const handleChatOwner = () => {
    if (confirmedBooking) {
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

      startOrOpenConversation(
        peerUser,
        `Hi ${owner.name}! I just pre-booked your ${item.name} for ${confirmedBooking.pickupDate} at ${confirmedBooking.pickupTime}. Reference: ${confirmedBooking.referenceCode}. See you at ${confirmedBooking.pickupLocation}!`,
        { id: item.id, name: item.name }
      );
    }
    closePreBook();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-scrim/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-xl bg-surface rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high bg-surface shrink-0">
          <div>
            <h3 className="text-base font-bold text-on-surface">
              {confirmedBooking ? 'Pre-Booking Confirmed! 🎉' : 'Pre-book Campus Equipment'}
            </h3>
            <p className="text-xs text-outline">
              {confirmedBooking
                ? 'Your slot is secured. Handover instructions below.'
                : 'Zero-risk student equipment sharing'}
            </p>
          </div>

          <button
            onClick={closePreBook}
            className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {confirmedBooking ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="space-y-5 animate-in zoom-in-95">
              
              {/* Reference Banner */}
              <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary/30 text-center">
                <span className="material-symbols-outlined text-[36px] text-secondary">
                  check_circle
                </span>
                <h4 className="text-lg font-extrabold text-on-surface mt-1">
                  Reservation #{confirmedBooking.referenceCode}
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Show this code or your student ID during pickup at the hub desk.
                </p>
              </div>

              {/* Handover Details Summary */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="text-outline">Reserved Item:</span>
                  <span className="font-bold text-on-surface">{confirmedBooking.itemName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="text-outline">Lender:</span>
                  <span className="font-bold text-on-surface flex items-center">
                    <img
                      src={confirmedBooking.ownerAvatar}
                      alt={confirmedBooking.ownerName}
                      className="w-5 h-5 rounded-full mr-1.5 object-cover"
                    />
                    {confirmedBooking.ownerName}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="text-outline">Handover Window:</span>
                  <span className="font-bold text-primary">
                    {confirmedBooking.pickupDate} • {confirmedBooking.pickupTime}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="text-outline">Handover Hub:</span>
                  <span className="font-bold text-on-surface">{confirmedBooking.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-outline">Total Paid / Due:</span>
                  <span className="font-bold text-on-surface">
                    Rs. {confirmedBooking.totalCost} (Deposit: Rs. {confirmedBooking.deposit} held)
                  </span>
                </div>
              </div>

              {/* Verified Handover Note */}
              <div className="p-3 rounded-xl bg-primary-container/15 border border-primary/20 text-xs text-on-surface flex items-start space-x-2">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  security
                </span>
                <p>
                  <strong>Apex Student Security Guarantee:</strong> You will inspect the equipment before accepting. Security deposits are automatically unlocked upon returning the item undamaged.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleChatOwner}
                  className="py-2.5 px-4 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high border border-outline-variant text-xs flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Message {confirmedBooking.ownerName}</span>
                </button>

                <button
                  onClick={handleViewBookings}
                  className="py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-sm flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>View in My Bookings</span>
                </button>
              </div>

            </div>
          ) : (
            /* BOOKING CONFIGURATION SCREEN */
            <>
              {/* Item Card Banner */}
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-surface-container-low border border-surface-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-on-surface truncate">{item.name}</h4>
                  <p className="text-[11px] text-outline">
                    Lent by {owner.name} • {item.pickupLocation}
                  </p>
                  <span className="text-xs font-extrabold text-on-surface mt-0.5 block">
                    {item.pricePerDay === 0 ? 'Free' : `Rs. ${item.pricePerDay} / day`}
                  </span>
                </div>
              </div>

              {/* Schedule Dates & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    min="2026-09-27"
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Handover Window & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Handover Time Window
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="10:00 AM">10:00 AM (Morning Study)</option>
                    <option value="12:00 PM">12:00 PM (Lunch Break)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon Lab)</option>
                    <option value="04:00 PM">04:00 PM (Evening Class)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Pickup Campus Hub
                  </label>
                  <select
                    value={pickupHub}
                    onChange={(e) => setPickupHub(e.target.value as CampusHub)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    {CAMPUS_HUBS.filter((h) => h !== 'All Campus Hubs').map((hub) => (
                      <option key={hub} value={hub}>
                        {hub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-primary-container/20 border-primary text-primary font-bold'
                        : 'bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] block mb-1">account_balance_wallet</span>
                    <span className="text-xs block">UniWallet</span>
                    <span className="text-[10px] text-outline block">Rs. 450 ready</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-primary-container/20 border-primary text-primary font-bold'
                        : 'bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] block mb-1">credit_card</span>
                    <span className="text-xs block">Demo Card</span>
                    <span className="text-[10px] text-outline block">•••• 4242</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-primary-container/20 border-primary text-primary font-bold'
                        : 'bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] block mb-1">payments</span>
                    <span className="text-xs block">Cash</span>
                    <span className="text-[10px] text-outline block">At pickup desk</span>
                  </button>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-outline">
                    Rental Duration:
                  </span>
                  <span className="font-semibold text-on-surface">
                    {diffDays} day{diffDays > 1 ? 's' : ''} (Rs. {dailyFee}/day)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-outline">Share Fee Subtotal:</span>
                  <span className="font-semibold text-on-surface">Rs. {subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-outline">UniShare Campus Platform Fee:</span>
                  <span className="font-semibold text-on-surface">Rs. {supportFee}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-surface-container text-outline">
                  <span>Refundable Security Deposit (Held):</span>
                  <span>Rs. {deposit}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-surface-container text-sm font-bold text-on-surface">
                  <span>Total Due Today:</span>
                  <span className="text-primary text-base">Rs. {totalDue}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!confirmedBooking && (
          <div className="p-4 sm:p-5 border-t border-surface-container-high bg-surface flex items-center justify-between shrink-0">
            <button
              onClick={closePreBook}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-md transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Securing equipment...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Confirm Pre-booking (Rs. {totalDue})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
