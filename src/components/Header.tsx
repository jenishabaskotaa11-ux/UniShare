import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NavTab } from '../context/AppContext.tsx';
import { getFallbackAvatar, handleAvatarError } from '../utils/userHelpers.ts';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    bookings,
    conversations,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openAuthModal,
    logout,
    searchQuery,
    setSearchQuery,
    openItemDetail,
    items,
  } = useApp();

  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('Apex University • Main Campus');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const campusRef = useRef<HTMLDivElement>(null);

  // Unread message count
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  // Active/upcoming bookings count
  const activeBookingsCount = bookings.filter((b) => b.status === 'Pre-booked' || b.status === 'Picked Up').length;
  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (campusRef.current && !campusRef.current.contains(event.target as Node)) {
        setCampusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'browse') {
      setActiveTab('browse');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container-high transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & University Hub */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 text-left group"
              id="unishare-logo-btn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">sync_saved_locally</span>
              </div>
              <div className="hidden xs:block">
                <span className="text-xl font-bold tracking-tight text-on-surface flex items-center">
                  UniShare
                  <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-primary-container text-on-primary tracking-wide">
                    CAMPUS
                  </span>
                </span>
                <span className="text-[11px] text-outline block leading-none">
                  Borrow more • Buy less
                </span>
              </div>
            </button>

            {/* University Switcher Pill */}
            <div className="relative hidden md:block" ref={campusRef}>
              <button
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium hover:bg-surface-container-high border border-outline-variant transition-colors"
                id="campus-switcher-btn"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                <span className="truncate max-w-[160px] lg:max-w-[210px]">{selectedCampus}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>

              {campusDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-surface shadow-xl border border-surface-container-high py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-outline">
                    Connected Campus Network
                  </div>
                  {[
                    'Apex University • Main Campus',
                    'Apex University • Science & Tech Block',
                    'Apex University • Medical & Allied Center',
                    'Apex University • City Satellite Campus',
                  ].map((campus) => (
                    <button
                      key={campus}
                      onClick={() => {
                        setSelectedCampus(campus);
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-container ${
                        selectedCampus === campus ? 'font-semibold text-primary bg-primary-container/20' : 'text-on-surface'
                      }`}
                    >
                      <span>{campus}</span>
                      {selectedCampus === campus && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-surface-container-high mt-1 pt-1.5 px-3">
                    <span className="text-[11px] text-outline flex items-center">
                      <span className="material-symbols-outlined text-[13px] mr-1 text-primary">verified_user</span>
                      Protected by .edu domain verification
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Search Field in Header */}
          <div className="flex-1 max-w-xs lg:max-w-md mx-3 hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search calculators, chargers, lab coats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (activeTab !== 'browse') setActiveTab('browse');
                }}
                className="w-full bg-surface-container-low text-on-surface text-sm rounded-full pl-9 pr-4 py-2 border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                id="header-quick-search"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </form>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            <button
              onClick={() => handleNavClick('browse')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'browse'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              id="nav-browse-btn"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Browse Catalog</span>
            </button>

            <button
              onClick={() => handleNavClick('pre-book')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'pre-book'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              id="nav-prebook-btn"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Pre-book</span>
            </button>

            <button
              onClick={() => handleNavClick('bookings')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 relative ${
                activeTab === 'bookings'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              id="nav-bookings-btn"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>My Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('messages')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 relative ${
                activeTab === 'messages'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              id="nav-messages-btn"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Messages</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1 animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* List an Item Primary CTA */}
            <button
              onClick={() => handleNavClick('list-item')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover shadow-sm transition-all transform active:scale-95"
              id="header-list-item-btn"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">List an Item</span>
              <span className="sm:hidden text-xs">List</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                aria-label="Notifications"
                id="notif-bell-btn"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface shadow-2xl border border-surface-container-high py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-surface-container-high flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Campus Activity</h4>
                      <p className="text-[11px] text-outline">Real-time alerts & loan updates</p>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-surface-container">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-outline">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkTab) setActiveTab(n.linkTab);
                            if (n.linkItemId) {
                              const found = items.find((i) => i.id === n.linkItemId);
                              if (found) openItemDetail(found);
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3.5 hover:bg-surface-container transition-colors cursor-pointer flex items-start space-x-3 ${
                            !n.isRead ? 'bg-primary-container/15' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            n.type === 'booking_confirmed' ? 'bg-primary-container text-on-primary' :
                            n.type === 'pickup_reminder' ? 'bg-secondary-container text-on-secondary-container' :
                            n.type === 'high_demand' ? 'bg-warning-container text-on-warning-container' :
                            'bg-surface-container-high text-on-surface'
                          }`}>
                            <span className="material-symbols-outlined text-[16px]">
                              {n.type === 'booking_confirmed' ? 'check' :
                               n.type === 'pickup_reminder' ? 'schedule' :
                               n.type === 'high_demand' ? 'trending_up' :
                               n.type === 'new_message' ? 'chat' : 'info'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-on-surface truncate">{n.title}</p>
                              <span className="text-[10px] text-outline shrink-0 ml-1">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-4 border-t border-surface-container-high text-center">
                    <button
                      onClick={() => {
                        setActiveTab('bookings');
                        setNotifDropdownOpen(false);
                      }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View all booking history →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown or Sign In */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 pl-2 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-colors"
                  id="user-profile-btn"
                >
                  <div className="hidden md:flex flex-col text-right leading-tight pr-1">
                    <span className="text-xs font-bold text-on-surface truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-primary font-semibold flex items-center justify-end">
                      <span className="material-symbols-outlined text-[11px] mr-0.5">toll</span>
                      {currentUser.sharePoints} pts
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={currentUser.avatar || getFallbackAvatar(currentUser.name)}
                      alt={currentUser.name}
                      onError={(e) => handleAvatarError(e, currentUser.name)}
                      className="w-8 h-8 rounded-full object-cover border border-primary bg-surface-container"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-surface"></span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline pr-1">arrow_drop_down</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface shadow-2xl border border-surface-container-high py-2 z-50">
                    <div className="px-4 py-3 border-b border-surface-container-high">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.avatar || getFallbackAvatar(currentUser.name)}
                          alt={currentUser.name}
                          onError={(e) => handleAvatarError(e, currentUser.name)}
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary bg-surface-container"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-outline truncate">{currentUser.email}</p>
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-secondary-container text-on-secondary-container mt-1">
                            <span className="material-symbols-outlined text-[11px] mr-0.5">verified</span>
                            Verified Student
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 p-2 rounded-xl bg-surface-container flex items-center justify-between text-xs">
                        <span className="text-outline">SharePoints Balance</span>
                        <span className="font-bold text-primary flex items-center">
                          <span className="material-symbols-outlined text-[14px] mr-1">stars</span>
                          {currentUser.sharePoints}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center space-x-2.5"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                        <span>Student Profile & Favorites</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('lender-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center space-x-2.5"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">storefront</span>
                        <span>Lender Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('bookings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center space-x-2.5"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">receipt_long</span>
                        <span>My Bookings & Handovers</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('impact');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center space-x-2.5"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">eco</span>
                        <span>Campus Savings & Impact</span>
                      </button>
                    </div>

                    <div className="border-t border-surface-container-high pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error/10 flex items-center space-x-2.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-sm font-semibold hover:bg-surface-container-highest transition-colors"
                id="sign-in-btn"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container"
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-container-high bg-surface px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search calculators, chargers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface text-sm rounded-xl pl-9 pr-4 py-2 border border-outline-variant"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
              search
            </span>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNavClick('browse')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                activeTab === 'browse' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Browse Catalog</span>
            </button>

            <button
              onClick={() => handleNavClick('pre-book')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                activeTab === 'pre-book' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Pre-book</span>
            </button>

            <button
              onClick={() => handleNavClick('bookings')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                activeTab === 'bookings' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>My Bookings ({activeBookingsCount})</span>
            </button>

            <button
              onClick={() => handleNavClick('messages')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                activeTab === 'messages' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Messages ({unreadMessagesCount})</span>
            </button>

            <button
              onClick={() => handleNavClick('lender-dashboard')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                activeTab === 'lender-dashboard' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Lender Hub</span>
            </button>

            <button
              onClick={() => handleNavClick('impact')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                activeTab === 'impact' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">eco</span>
              <span>Campus Impact</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
