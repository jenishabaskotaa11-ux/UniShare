import React, { useState } from 'react';
import { Booking } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

interface RatingModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ booking, onClose }) => {
  const { addRating } = useApp();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      return;
    }
    addRating(booking.id, booking.itemId, stars, comment.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-surface-container-high p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div>
            <h3 className="font-bold text-base text-on-surface">Rate Your Experience</h3>
            <p className="text-xs text-outline">How was your peer loan with {booking.ownerName}?</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-outline hover:text-on-surface bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Item details */}
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-surface-container-low border border-surface-container">
            <img
              src={booking.itemImage}
              alt={booking.itemName}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-on-surface truncate">{booking.itemName}</h4>
              <p className="text-[11px] text-outline">Lent by {booking.ownerName}</p>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isLit = (hoveredStar || stars) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoveredStar(starVal)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setStars(starVal)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-[32px] ${
                        isLit ? 'text-secondary fill-current' : 'text-outline-variant'
                      }`}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-primary block mt-1">
              {stars === 5 ? 'Excellent — smooth handover!' : stars === 4 ? 'Very Good' : stars === 3 ? 'Average' : 'Could be better'}
            </span>
          </div>

          {/* Comment text area */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
              Share details for other students
            </label>
            <textarea
              rows={3}
              placeholder="Was the equipment clean? Was the owner on time at the library desk? Battery condition?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-sm transition-all"
            >
              Submit Review (+5 SharePoints)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
