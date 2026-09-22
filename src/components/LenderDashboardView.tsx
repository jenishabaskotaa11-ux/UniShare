import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Item } from '../types.ts';

export const LenderDashboardView: React.FC = () => {
  const {
    items,
    currentUser,
    togglePauseItem,
    deleteItem,
    updateItem,
    setActiveTab,
    bookings,
    startOrOpenConversation,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'requests' | 'handovers'>('listings');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // User's own items or demo items owned by current user
  const myItems = items.filter(
    (i) => i.isCreatedByUser || i.owner?.id === currentUser?.id || i.owner?.name === currentUser?.name || i.ownerId === currentUser?.id
  );

  const pendingRequests = bookings.filter((b) => b.status === 'Pre-booked');

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateItem(editingItem.id, {
      name: editingItem.name,
      pricePerDay: Number(editingItem.pricePerDay),
      deposit: Number(editingItem.deposit),
      pickupLocation: editingItem.pickupLocation,
      description: editingItem.description,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="bg-surface rounded-3xl border border-surface-container-high p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Lender Management Hub</h2>
            <p className="text-xs text-outline mt-0.5">
              Manage your shared campus items, adjust daily slots, and coordinate borrower handovers.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('list-item')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>List Another Item</span>
          </button>
        </div>

        {/* 4 Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-semibold text-outline block">Active Listings</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-on-surface">
                {myItems.filter((i) => i.status === 'active').length}
              </span>
              <span className="text-[10px] text-secondary font-medium">Live on campus</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-semibold text-outline block">Active Handovers</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-primary">
                {pendingRequests.length}
              </span>
              <span className="text-[10px] text-outline font-medium">Tomorrow / this week</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-semibold text-outline block">Student Earnings</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-on-surface">
                Rs. 1,450
              </span>
              <span className="text-[10px] text-secondary font-medium">+15% this month</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-semibold text-outline block">Peer Lender Score</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-secondary flex items-center">
                4.9 <span className="material-symbols-outlined text-[18px] ml-1 fill-current">star</span>
              </span>
              <span className="text-[10px] text-outline font-medium">100% on-time</span>
            </div>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center space-x-1 border-t border-surface-container-high pt-3">
          {[
            { id: 'listings', label: `My Items (${myItems.length})`, icon: 'inventory_2' },
            { id: 'requests', label: `Handover Requests (${pendingRequests.length})`, icon: 'sync' },
            { id: 'handovers', label: 'Campus Hub Handover Schedule', icon: 'schedule' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeSubTab === tab.id
                  ? 'bg-primary-container text-on-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: My Items */}
      {activeSubTab === 'listings' && (
        <div className="space-y-4">
          {myItems.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-3xl bg-surface border border-surface-container-high space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                <span className="material-symbols-outlined text-[28px]">post_add</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">You haven't listed any items yet</h3>
              <p className="text-xs text-outline max-w-sm mx-auto">
                Got a calculator, laptop charger, or lab coat lying around? List it now to earn rental fees and help fellow students.
              </p>
              <button
                onClick={() => setActiveTab('list-item')}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover inline-flex items-center space-x-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>List an Item Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-3xl border border-surface-container-high p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-surface-container"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'active'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {item.status === 'active' ? 'Live & Searchable' : 'Paused'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-on-surface truncate mt-0.5">
                        {item.name}
                      </h4>

                      <div className="flex items-center space-x-3 text-xs text-outline mt-1">
                        <span className="font-bold text-on-surface">
                          {item.pricePerDay === 0 ? 'Free' : `Rs. ${item.pricePerDay}/day`}
                        </span>
                        <span>•</span>
                        <span>{item.pickupLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Day Availability Status Row */}
                  <div className="bg-surface-container-low p-2.5 rounded-2xl border border-surface-container text-xs">
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <span className="text-outline">Upcoming Availability Slots</span>
                      <span className="font-semibold text-primary">
                        {item.currentAvailableCount} units available today
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-center">
                      {item.futureAvailabilitySchedule.slice(0, 5).map((slot, idx) => (
                        <div
                          key={slot.date}
                          className="py-1 px-1 rounded-lg bg-surface border border-outline-variant text-[10px]"
                        >
                          <span className="text-outline block text-[9px]">
                            {idx === 0 ? 'Today' : idx === 1 ? 'Thu' : idx === 2 ? 'Fri' : idx === 3 ? 'Sat' : 'Sun'}
                          </span>
                          <span className="font-bold text-on-surface block">{slot.count} left</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Management Buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-surface-container">
                    <button
                      onClick={() => togglePauseItem(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                    >
                      {item.status === 'active' ? 'Pause Listing' : 'Reactivate'}
                    </button>

                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-error hover:bg-error/10 transition-colors"
                      title="Delete Listing"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Handover Requests */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-3xl bg-surface border border-surface-container-high text-xs text-outline">
              No pending borrower requests right now.
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-surface rounded-3xl border border-surface-container-high p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded">
                        {req.referenceCode}
                      </span>
                      <span className="text-xs font-bold text-on-surface">
                        Handover with {req.borrowerName}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant">
                      Item: <strong>{req.itemName}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-outline">
                      <span className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1 text-primary">event</span>
                        {req.pickupDate} ({req.pickupTime})
                      </span>
                      <span className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1 text-primary">pin_drop</span>
                        {req.pickupLocation}
                      </span>
                      <span>Total: Rs. {req.totalCost}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={() => {
                      startOrOpenConversation(
                        {
                          id: 'usr_borrower',
                          name: req.borrowerName,
                          email: 'borrower@university.edu',
                          university: 'Apex University',
                          program: 'CS sophomore',
                          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
                          rating: 5.0,
                          reviewsCount: 4,
                          isVerified: true,
                          sharePoints: 120,
                          itemsBorrowed: 2,
                          itemsLent: 0,
                          moneySaved: 1000,
                          campusHub: req.pickupLocation,
                        },
                        `Hi ${req.borrowerName}! Looking forward to our handover for ${req.itemName} at ${req.pickupLocation}.`
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold border border-outline-variant flex items-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast(`Accepted handover for ${req.itemName}! Notification sent to borrower.`);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover shadow-xs flex items-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">check</span>
                    <span>Accept Request</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Campus Hub Handover Schedule */}
      {activeSubTab === 'handovers' && (
        <div className="bg-surface rounded-3xl border border-surface-container-high p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Designated Campus Handover Desks</h3>
              <p className="text-outline">Pre-arranged safe meeting zones equipped with security staff and test outlets.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              4 Campus Hubs Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { name: 'Central Library Desk 1A', desc: 'Main entrance ground floor by student lockers. Outlet station available for testing electronics.', hours: '8:00 AM – 10:00 PM' },
              { name: 'Student Lounge Hub', desc: 'Center pavilion near café. Great for quick charger and presentation remote handovers.', hours: '9:00 AM – 8:00 PM' },
              { name: 'Science Block Foyer', desc: 'Opposite chemistry laboratory 2. Sanitized locker drop available for lab coats.', hours: '8:30 AM – 6:00 PM' },
              { name: 'Engineering Block Lobby', desc: 'Next to robotics lab. Multimeter test bench and breadboard testing points.', hours: '9:00 AM – 7:00 PM' },
            ].map((hub) => (
              <div
                key={hub.name}
                className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface flex items-center">
                    <span className="material-symbols-outlined text-[16px] text-primary mr-1">pin_drop</span>
                    {hub.name}
                  </span>
                  <span className="text-[10px] text-outline">{hub.hours}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">{hub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-surface-container-high p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-bold text-base text-on-surface">Edit Listing Details</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-outline hover:text-on-surface bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Rental Fee (Rs./day)
                  </label>
                  <input
                    type="number"
                    value={editingItem.pricePerDay}
                    onChange={(e) => setEditingItem({ ...editingItem, pricePerDay: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Security Deposit (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editingItem.deposit}
                    onChange={(e) => setEditingItem({ ...editingItem, deposit: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Handover Hub
                </label>
                <input
                  type="text"
                  value={editingItem.pickupLocation}
                  onChange={(e) => setEditingItem({ ...editingItem, pickupLocation: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
