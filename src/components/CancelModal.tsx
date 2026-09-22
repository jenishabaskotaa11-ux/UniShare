import React from 'react';
import { Booking } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

interface CancelModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({ booking, onClose }) => {
  const { cancelBooking } = useApp();

  if (!booking) return null;

  const handleConfirmCancel = () => {
    cancelBooking(booking.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-surface-container-high p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 text-error">
          <div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">cancel</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-on-surface">Cancel Pre-booking?</h3>
            <p className="text-xs text-outline">Ref: {booking.referenceCode}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs space-y-1">
          <p className="font-bold text-on-surface">{booking.itemName}</p>
          <p className="text-outline">Reserved for {booking.pickupDate} at {booking.pickupTime}</p>
          <p className="text-outline">Lender: {booking.ownerName} • {booking.pickupLocation}</p>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Cancelling will instantly release this equipment slot back to waiting classmates on campus. Any held security deposit (Rs. {booking.deposit}) and fee balance will be immediately restored.
        </p>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-surface-container-high">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
          >
            Keep Reservation
          </button>
          <button
            onClick={handleConfirmCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-error text-on-error hover:opacity-90 shadow-sm transition-all"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};
