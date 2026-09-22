import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ItemCard } from './ItemCard.tsx';
import { getFallbackAvatar, handleAvatarError } from '../utils/userHelpers.ts';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    favorites,
    waitlists,
    items,
    setActiveTab,
  } = useApp();

  const [activeTab, setActiveProfileTab] = useState<'favorites' | 'waitlist' | 'perks'>('favorites');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editHub, setEditHub] = useState<string>(currentUser?.campusHub || 'Central Library Desk 1A');
  const [editProgram, setEditProgram] = useState(currentUser?.program || 'B.Sc. Computer Science');

  if (!currentUser) return null;

  const favoritedItems = items.filter((i) => favorites.includes(i.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      campusHub: editHub,
      program: editProgram.trim(),
    });
    setIsEditing(false);
  };

  // Progress to next tier
  const currentPoints = currentUser.sharePoints || 320;
  const nextTierPoints = 400;
  const progressPercent = Math.min(100, Math.round((currentPoints / nextTierPoints) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Student Profile Card */}
      <div className="bg-surface rounded-3xl border border-surface-container-high p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-surface-container-high">
          
          <div className="flex items-start sm:items-center space-x-4">
            <div className="relative">
              <img
                src={currentUser.avatar || getFallbackAvatar(currentUser.name)}
                alt={currentUser.name}
                onError={(e) => handleAvatarError(e, currentUser.name)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-primary shadow-sm bg-surface-container"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary border-2 border-surface"></span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface">
                  {currentUser.name}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-[13px] mr-1">verified</span>
                  Verified Apex Student
                </span>
              </div>

              <p className="text-xs text-on-surface-variant font-medium">
                {currentUser.program} • {currentUser.year || 'Class of 2026'}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-outline pt-0.5">
                <span>ID: {currentUser.studentId || 'APX-2024-8841'}</span>
                <span>•</span>
                <span className="flex items-center">
                  <span className="material-symbols-outlined text-[14px] mr-1 text-primary">pin_drop</span>
                  {currentUser.campusHub || 'Central Library Desk 1A'}
                </span>
                <span>•</span>
                <span className="flex items-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[14px] text-secondary fill-current mr-0.5">star</span>
                  {currentUser.rating} ({currentUser.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant transition-colors flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio & Academic Mission */}
        <p className="text-xs text-on-surface-variant leading-relaxed py-4">
          {currentUser.bio || 'Computer Science student enthusiastic about sharing academic tools to reduce campus waste.'}
        </p>

        {/* 4 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] text-outline block">Items Borrowed</span>
            <span className="text-lg font-extrabold text-on-surface mt-0.5 block">
              {currentUser.itemsBorrowed}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] text-outline block">Items Shared</span>
            <span className="text-lg font-extrabold text-on-surface mt-0.5 block">
              {currentUser.itemsLent}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] text-outline block">Estimated Money Saved</span>
            <span className="text-lg font-extrabold text-primary mt-0.5 block">
              Rs. {currentUser.moneySaved.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] text-outline block">SharePoints Balance</span>
            <span className="text-lg font-extrabold text-secondary mt-0.5 flex items-center">
              <span className="material-symbols-outlined text-[18px] mr-1">stars</span>
              {currentPoints}
            </span>
          </div>
        </div>

        {/* SharePoints Tier & Rewards Progress */}
        <div className="mt-5 p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-bold text-[10px]">
                LEVEL 3 SCHOLAR
              </span>
              <span className="font-bold text-on-surface">Zero Deposit Privilege Active</span>
            </div>
            <span className="text-outline font-medium">
              {currentPoints} / {nextTierPoints} pts to Level 4 Master Lender
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-outline pt-0.5">
            <span>Perks unlocked: Priority midterms pre-booking • Zero-deposit waiver on calculators</span>
            <button
              onClick={() => setActiveProfileTab('perks')}
              className="text-primary font-semibold hover:underline"
            >
              View Tier Perks →
            </button>
          </div>
        </div>

      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-2 border-b border-surface-container-high pb-2">
        <button
          onClick={() => setActiveProfileTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'favorites'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          <span>Saved Favorites ({favoritedItems.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('waitlist')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'waitlist'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">notifications_active</span>
          <span>Active Waitlists ({waitlists.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('perks')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'perks'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">military_tech</span>
          <span>SharePoints Rules & Perks</span>
        </button>
      </div>

      {/* Tab Content 1: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoritedItems.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-3xl bg-surface border border-surface-container-high space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                <span className="material-symbols-outlined text-[28px]">favorite_border</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">No saved items yet</h3>
              <p className="text-xs text-outline max-w-sm mx-auto">
                Click the heart icon on any calculator, charger, or lab coat to save it for quick pre-booking during exam season.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-xs"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoritedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Active Waitlists */}
      {activeTab === 'waitlist' && (
        <div className="space-y-4">
          {waitlists.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-3xl bg-surface border border-surface-container-high text-xs text-outline">
              You are not currently waiting on any fully-booked items.
            </div>
          ) : (
            waitlists.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-3xl bg-surface border border-surface-container-high flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={entry.itemImage}
                    alt={entry.itemName}
                    className="w-14 h-14 rounded-2xl object-cover border border-surface-container"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                      {entry.itemName}
                    </h4>
                    <span className="text-xs text-outline block mt-0.5">
                      Joined waitlist for slot: {entry.targetDate}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning-container text-on-warning-container mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mr-1"></span>
                      Waiting for Peer Return
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-xs"
                  >
                    View in Catalog
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 3: Tier Perks & Rules */}
      {activeTab === 'perks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-surface border border-surface-container-high space-y-3">
            <h3 className="font-bold text-sm text-on-surface flex items-center">
              <span className="material-symbols-outlined text-[18px] mr-1 text-primary">toll</span>
              How to Earn SharePoints
            </h3>
            <div className="space-y-2 text-on-surface-variant">
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                <span>List a useful academic item</span>
                <strong className="text-secondary font-bold">+20 pts</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                <span>Complete a peer loan handover</span>
                <strong className="text-secondary font-bold">+15 pts</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                <span>Return equipment on time & sanitized</span>
                <strong className="text-secondary font-bold">+10 pts</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                <span>Submit a detailed peer review</span>
                <strong className="text-secondary font-bold">+5 pts</strong>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-surface border border-surface-container-high space-y-3">
            <h3 className="font-bold text-sm text-on-surface flex items-center">
              <span className="material-symbols-outlined text-[18px] mr-1 text-primary">verified</span>
              Reputation Tiers
            </h3>
            <div className="space-y-2 text-on-surface-variant">
              <div className="p-2 rounded-xl bg-surface-container-low">
                <strong className="text-on-surface block">Level 1: Novice (0–100 pts)</strong>
                <span className="text-[11px] text-outline">Standard campus borrowing with standard deposit.</span>
              </div>
              <div className="p-2 rounded-xl bg-surface-container-low">
                <strong className="text-on-surface block">Level 2: Trusted Peer (100–250 pts)</strong>
                <span className="text-[11px] text-outline">50% reduced security deposit hold on academic tools.</span>
              </div>
              <div className="p-2 rounded-xl bg-primary-container/20 border border-primary/30">
                <strong className="text-primary block">Level 3: Scholar (250–400 pts) • YOUR TIER</strong>
                <span className="text-[11px] text-on-surface">Zero-deposit waiver for scientific calculators and chargers!</span>
              </div>
              <div className="p-2 rounded-xl bg-surface-container-low">
                <strong className="text-on-surface block">Level 4: Master Lender (400+ pts)</strong>
                <span className="text-[11px] text-outline">Free campus courier delivery across academic blocks.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-surface-container-high p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-bold text-base text-on-surface">Edit Student Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Academic Program & Year
                </label>
                <input
                  type="text"
                  value={editProgram}
                  onChange={(e) => setEditProgram(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Preferred Handover Hub
                </label>
                <input
                  type="text"
                  value={editHub}
                  onChange={(e) => setEditHub(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  About You & Campus Sharing
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
