import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const ImpactSection: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Sustainability & Campus Metrics Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-surface-container-high p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[14px] mr-1">eco</span>
            Campus Circular Economy Impact
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface">
            Together, We’ve Diverted Over 1,200 Academic Items from Landfills
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Every calculator borrowed for an exam, every lab coat passed to an underclassman, and every display adapter shared for a presentation saves real money and keeps valuable electronics circulating.
          </p>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              Student Money Saved
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-primary mt-1 block">
              Rs. 4.8L+
            </span>
            <span className="text-[11px] text-outline mt-0.5 block">
              In unnecessary retail purchases
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              CO₂ Emissions Prevented
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-secondary mt-1 block">
              1,840 kg
            </span>
            <span className="text-[11px] text-outline mt-0.5 block">
              Reduced manufacturing impact
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              Active Student Shares
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1 block">
              3,290+
            </span>
            <span className="text-[11px] text-outline mt-0.5 block">
              Successful peer loans to date
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              Deposit Return Rate
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1 block">
              99.8%
            </span>
            <span className="text-[11px] text-outline mt-0.5 block">
              Zero-theft campus community
            </span>
          </div>
        </div>
      </div>

      {/* How It Works: 4 Simple Steps */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-container-high shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
            Simple 4-Step Process
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
            How UniShare Keeps Campus Handovers Safe & Fast
          </h3>
          <p className="text-xs text-outline mt-1">
            No shipping fees, no awkward dorm deliveries. Only verified campus desks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Find & Pre-Book',
              desc: 'Select scientific calculators, chargers, or lab coats and choose your exact date slot.',
              icon: 'search',
            },
            {
              step: '02',
              title: 'Meet at Campus Hub',
              desc: 'Handover takes place at designated desks like Central Library Desk 1A or Student Lounge.',
              icon: 'pin_drop',
            },
            {
              step: '03',
              title: 'Ace Your Class or Exam',
              desc: 'Use equipment worry-free with peer security deposits and verified checklists.',
              icon: 'school',
            },
            {
              step: '04',
              title: 'Return & Unlock Karma',
              desc: 'Hand the item back, unlock your deposit immediately, and earn SharePoints.',
              icon: 'published_with_changes',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-surface-container-low border border-surface-container relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <span className="text-xl font-black text-outline/30">{item.step}</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface">{item.title}</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveTab('browse')}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-sm inline-flex items-center space-x-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            <span>Explore Campus Equipment Catalog</span>
          </button>
        </div>
      </div>

    </div>
  );
};
