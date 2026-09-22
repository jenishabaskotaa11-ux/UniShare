import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CategoryPills } from './components/CategoryPills.tsx';
import { ItemCard } from './components/ItemCard.tsx';
import { BrowseView } from './components/BrowseView.tsx';
import { MyBookingsView } from './components/MyBookingsView.tsx';
import { MessagesView } from './components/MessagesView.tsx';
import { ListItemView } from './components/ListItemView.tsx';
import { LenderDashboardView } from './components/LenderDashboardView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { ItemDetailModal } from './components/ItemDetailModal.tsx';
import { PreBookModal } from './components/PreBookModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ImpactSection } from './components/ImpactSection.tsx';

export const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    items,
    currentUser,
    login,
    openAuthModal,
    showToast,
  } = useApp();

  // High-demand midterm items
  const midtermEssentials = items.filter((i) => i.isUrgentDemand || i.category === 'Calculators & Academic Tools').slice(0, 4);
  const freeItems = items.filter((i) => i.isFree || i.pricePerDay === 0).slice(0, 4);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary">
      <ToastContainer />
      
      {/* Top Main Navigation */}
      <Header />

      {/* Main Body View Switching */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Section with Live Date Filters */}
            <HeroSection />

            {/* Quick Academic Category Browser */}
            <CategoryPills />

            {/* Midterm Urgency Essentials Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      Midterm Exams Week — High Demand Items
                    </h2>
                  </div>
                  <p className="text-xs text-outline mt-0.5">
                    Calculators & chargers reserved quickly. Pre-book your slot ahead of morning exams.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('browse')}
                  className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                >
                  <span>View all ({items.length})</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {midtermEssentials.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Free Student Community Shares */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                      Rs. 0 RENTAL
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      Free Peer Community Equipment
                    </h2>
                  </div>
                  <p className="text-xs text-outline mt-0.5">
                    Generously shared by senior students and campus tech clubs for zero rental fees.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('browse')}
                  className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                >
                  <span>See more free items</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {freeItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Circular Economy Impact & 4-Step Process */}
            <ImpactSection />
          </div>
        )}

        {activeTab === 'browse' && <BrowseView />}
        {activeTab === 'bookings' && <MyBookingsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'list-item' && <ListItemView />}
        {activeTab === 'lender' && <LenderDashboardView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Interactive Modals */}
      <ItemDetailModal />
      <PreBookModal />
      <AuthModal />

      {/* Footer */}
      <footer className="mt-12 border-t border-surface-container-high bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-on-surface">UniShare</span>
                  <span className="text-[10px] text-primary block -mt-1 font-semibold">Apex Campus</span>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                “Borrow more. Buy less. Connect more.”
                <br />
                The trusted university-only peer equipment sharing platform.
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-outline">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                <span>Verified .edu student logins only</span>
              </div>
            </div>

            {/* Academic Equipment */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
                High-Demand Categories
              </h4>
              <ul className="space-y-1.5 text-on-surface-variant">
                <li>
                  <button onClick={() => setActiveTab('browse')} className="hover:text-primary">
                    Scientific Calculators (fx-991EX / CW)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('browse')} className="hover:text-primary">
                    Laptop Chargers (USB-C GaN, MagSafe)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('browse')} className="hover:text-primary">
                    Chemistry Lab Coats & Safety Glasses
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('browse')} className="hover:text-primary">
                    HDMI, VGA & USB-C Display Adapters
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('browse')} className="hover:text-primary">
                    Arduino & Engineering Breadboards
                  </button>
                </li>
              </ul>
            </div>

            {/* Campus Handover Hubs */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
                Safe Handover Desks
              </h4>
              <ul className="space-y-1.5 text-on-surface-variant">
                <li className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">pin_drop</span>
                  <span>Central Library Desk 1A (8am - 10pm)</span>
                </li>
                <li className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">pin_drop</span>
                  <span>Student Lounge Hub (9am - 8pm)</span>
                </li>
                <li className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">pin_drop</span>
                  <span>Science Block Foyer (8:30am - 6pm)</span>
                </li>
                <li className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">pin_drop</span>
                  <span>Engineering Block Lobby (9am - 7pm)</span>
                </li>
              </ul>
            </div>

            {/* Demo & Test Quick Actions */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
                Demo & Evaluation Controls
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    login('riya@university.edu', 'demo123');
                    showToast('Logged into demo account: Riya Sharma (CS Sophomore)');
                  }}
                  className="w-full text-left p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block">Switch to Riya Sharma</span>
                    <span className="text-[10px] text-outline">Verified Demo Student</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block">Reset Demo State</span>
                    <span className="text-[10px] text-outline">Restore seed bookings & catalog</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline">refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between text-[11px] text-outline gap-3">
            <p>© 2026 UniShare Platform. Built for Apex University students.</p>
            <p>Protected by Student Code of Conduct & Peer Deposit Guarantee.</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
