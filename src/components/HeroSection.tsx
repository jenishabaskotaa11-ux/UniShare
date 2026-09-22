import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CampusHub } from '../types.ts';

export const CAMPUS_HUBS: string[] = [
  'All Campus Hubs',
  'Central Library Desk 1A',
  'Student Lounge',
  'Science Block',
  'Engineering Block',
  'Management Wing',
  'Main Entrance',
  'Computer Lab Lobby',
];

export const HeroSection: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    selectedHub,
    setSelectedHub,
    selectedDateFilter,
    setSelectedDateFilter,
    setSelectedCategory,
    setSearchQuery,
    openPreBook,
    items,
  } = useApp();

  const [customDate, setCustomDate] = useState('2026-09-28');
  const [showHubPicker, setShowHubPicker] = useState(false);

  const fxCalculator = items.find((i) => i.id === 'item-1');

  const handleDateSelect = (filter: 'today' | 'tomorrow' | 'this-week' | 'choose') => {
    setSelectedDateFilter(filter);
  };

  const handleQuickCategory = (cat: string) => {
    setSelectedCategory(cat as any);
    setActiveTab('browse');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface-container-low border border-surface-container-high p-5 sm:p-8 lg:p-10 mb-8 shadow-xs">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl">
        
        {/* User Greeting & Verified Status */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-on-surface flex items-center">
            Hi, {currentUser ? currentUser.name.split(' ')[0] : 'Student'} 👋
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[13px] mr-1">verified</span>
            Verified Student • Apex Campus
          </span>
          <span className="text-[11px] text-outline hidden sm:inline">
            • Closed campus peer circle
          </span>
        </div>

        {/* Tagline & Main Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
          Borrow more. Buy less.{' '}
          <span className="text-primary block sm:inline">Connect more.</span>
        </h1>
        
        <p className="mt-2.5 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          UniShare is your university peer-to-peer equipment library. Securely borrow, rent, lend, and pre-book academic gear, chargers, and project kits from trusted students in your residence & campus hubs.
        </p>

        {/* Impact Highlights Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-on-surface-variant">
          <div className="flex items-center space-x-1.5 bg-surface px-3 py-1.5 rounded-xl border border-surface-container-high shadow-2xs">
            <span className="material-symbols-outlined text-secondary text-[16px]">savings</span>
            <span><strong className="text-on-surface">Rs. 6,500+</strong> saved per semester</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-surface px-3 py-1.5 rounded-xl border border-surface-container-high shadow-2xs">
            <span className="material-symbols-outlined text-primary text-[16px]">distance</span>
            <span><strong className="text-on-surface">10 min</strong> Central Library handover</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-surface px-3 py-1.5 rounded-xl border border-surface-container-high shadow-2xs">
            <span className="material-symbols-outlined text-primary text-[16px]">handshake</span>
            <span><strong className="text-on-surface">Zero Waste</strong> peer circularity</span>
          </div>
        </div>

        {/* Core Date & Availability Selector Card */}
        <div className="mt-6 bg-surface p-4 sm:p-5 rounded-2xl border border-surface-container-high shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-surface-container-high">
            
            {/* When Do You Need It Segment */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1.5">
                When do you need it?
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleDateSelect('today')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    selectedDateFilter === 'today'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-outline-variant'
                  }`}
                >
                  Today (27 Sept)
                </button>

                <button
                  onClick={() => handleDateSelect('tomorrow')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    selectedDateFilter === 'tomorrow'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-outline-variant'
                  }`}
                >
                  Tomorrow (28 Sept)
                </button>

                <button
                  onClick={() => handleDateSelect('this-week')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    selectedDateFilter === 'this-week'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-outline-variant'
                  }`}
                >
                  This Week
                </button>

                <div className="relative inline-flex items-center">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      setCustomDate(e.target.value);
                      handleDateSelect('choose');
                    }}
                    className="px-2.5 py-1.2 rounded-xl text-xs font-medium bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Campus Hub Filter Dropdown */}
            <div className="relative min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1.5">
                Handover Location Hub
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowHubPicker(!showHubPicker)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-medium border border-outline-variant text-on-surface hover:bg-surface-container"
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                    <span className="truncate">{selectedHub}</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
                </button>

                {showHubPicker && (
                  <div className="absolute right-0 mt-1 w-64 bg-surface rounded-xl shadow-xl border border-surface-container-high py-1 z-50">
                    {CAMPUS_HUBS.map((hub) => (
                      <button
                        key={hub}
                        onClick={() => {
                          setSelectedHub(hub);
                          setShowHubPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-container ${
                          selectedHub === hub ? 'font-bold text-primary bg-primary-container/20' : 'text-on-surface'
                        }`}
                      >
                        <span>{hub}</span>
                        {selectedHub === hub && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Search & Explore Row */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-outline">
              <span className="font-semibold text-on-surface">Trending Midterm Needs:</span>
              {[
                'Casio fx-991EX',
                '65W USB-C',
                'Lab Coat M',
                'HDMI Adapter',
                'Presentation Clicker'
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setActiveTab('browse');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('browse')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-hover transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">explore</span>
              <span>Explore All Verified Gear</span>
            </button>
          </div>
        </div>

        {/* Live Midterms High Demand Alert Bar */}
        <div className="mt-4 p-3.5 rounded-2xl bg-warning-container/30 border border-warning/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-warning-container text-on-warning-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">
                Exam Week Alert: Scientific Calculators & Presentation Clickers are filling up!
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Pre-book today to guarantee availability before your morning exam slots.
              </p>
            </div>
          </div>

          {fxCalculator && (
            <button
              onClick={() => openPreBook(fxCalculator, '2026-09-28')}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-all flex items-center justify-center space-x-1 self-start sm:self-auto shadow-2xs"
            >
              <span>Pre-book Casio fx-991EX</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
