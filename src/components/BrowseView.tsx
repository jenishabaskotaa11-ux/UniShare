import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ItemCard } from './ItemCard.tsx';
import { CATEGORIES } from './CategoryPills.tsx';
import { CAMPUS_HUBS } from './HeroSection.tsx';
import { AcademicCategory, Item } from '../types.ts';

export const BrowseView: React.FC = () => {
  const {
    items,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedHub,
    setSelectedHub,
    selectedDateFilter,
    setSelectedDateFilter,
  } = useApp();

  // Local filter states
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'under50' | 'under100'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'distance' | 'rating'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Subtype filters based on selected category
  const subTypeOptions = useMemo(() => {
    if (selectedCategory === 'Calculators & Academic Tools') {
      return [
        { id: 'all', label: 'All Calculators' },
        { id: 'scientific', label: 'Scientific (fx-991EX/CW)' },
        { id: 'graphing', label: 'Graphing (TI-84)' },
      ];
    }
    if (selectedCategory === 'Laptop & Tech Accessories') {
      return [
        { id: 'all', label: 'All Laptop Accessories' },
        { id: 'usbc', label: 'USB-C GaN Chargers & Hubs' },
        { id: 'dell', label: 'Dell Barrel Chargers' },
        { id: 'hp', label: 'HP Blue-Pin Chargers' },
        { id: 'lenovo', label: 'Lenovo Slim Tip' },
        { id: 'macbook', label: 'MacBook MagSafe 3' },
      ];
    }
    if (selectedCategory === 'Lab Materials') {
      return [
        { id: 'all', label: 'All Lab Gear' },
        { id: 'labcoat-s', label: 'Lab Coat (Small)' },
        { id: 'labcoat-m', label: 'Lab Coat (Medium)' },
        { id: 'labcoat-l', label: 'Lab Coat (Large)' },
      ];
    }
    if (selectedCategory === 'Presentation Equipment') {
      return [
        { id: 'all', label: 'All Presentation Gear' },
        { id: 'vga', label: 'HDMI to VGA Adapters' },
        { id: 'other', label: 'Clickers & Remotes' },
      ];
    }
    return [];
  }, [selectedCategory]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (item.name || '').toLowerCase().includes(query);
        const matchesCat = (item.category || '').toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesOwner = (item.owner?.name || '').toLowerCase().includes(query);
        const matchesHub = (item.pickupLocation || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesOwner && !matchesHub) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory && selectedCategory !== 'All') {
        if (item.category !== selectedCategory) return false;
      }

      // 3. Subtype
      if (selectedSubtype !== 'all' && item.productType) {
        if (item.productType !== selectedSubtype) return false;
      }

      // 4. Campus Hub
      if (selectedHub && selectedHub !== 'All Campus Hubs') {
        if (item.pickupLocation !== selectedHub) return false;
      }

      // 5. Price Filter
      if (priceFilter === 'free' && item.pricePerDay !== 0) return false;
      if (priceFilter === 'under50' && item.pricePerDay > 50) return false;
      if (priceFilter === 'under100' && item.pricePerDay > 100) return false;

      // 6. Rating Filter
      if (minRating > 0 && item.rating < minRating) return false;

      // 7. Availability Only
      if (availabilityOnly && item.currentAvailableCount === 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Recommended: prioritize midterm high demand & in-stock
      if (a.currentAvailableCount > 0 && b.currentAvailableCount === 0) return -1;
      if (b.currentAvailableCount > 0 && a.currentAvailableCount === 0) return 1;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [items, searchQuery, selectedCategory, selectedSubtype, selectedHub, priceFilter, minRating, availabilityOnly, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedHub('All Campus Hubs');
    setPriceFilter('all');
    setMinRating(0);
    setAvailabilityOnly(false);
    setSelectedSubtype('all');
    setSortBy('recommended');
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'All') ||
    searchQuery.trim() !== '' ||
    selectedHub !== 'All Campus Hubs' ||
    priceFilter !== 'all' ||
    minRating > 0 ||
    availabilityOnly ||
    selectedSubtype !== 'all';

  return (
    <div className="space-y-6">
      
      {/* Search Header Bar */}
      <div className="bg-surface rounded-3xl border border-surface-container-high p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search items, calculators, chargers, lab coats, owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-outline">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-outline hover:text-on-surface p-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Quick Toggle Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Campus Hub Select */}
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-xs font-medium border border-outline-variant focus:outline-none focus:border-primary shrink-0"
            >
              {CAMPUS_HUBS.map((hub) => (
                <option key={hub} value={hub}>
                  {hub}
                </option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-xs font-medium border border-outline-variant focus:outline-none focus:border-primary shrink-0"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="distance">Closest First</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* More Filters Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center space-x-1.5 border transition-colors ${
                showFilterDrawer || hasActiveFilters
                  ? 'bg-primary-container text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Category Selector Chips */}
        <div className="overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center space-x-1.5 min-w-max">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubtype('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-outline-variant'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtype Chips (e.g. Scientific vs Graphing) */}
        {subTypeOptions.length > 0 && (
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline shrink-0 mr-1">
              Filter by model:
            </span>
            {subTypeOptions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubtype(sub.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedSubtype === sub.id
                    ? 'bg-secondary-container text-on-secondary-container border-secondary font-bold'
                    : 'bg-surface text-outline hover:text-on-surface border-outline-variant'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Expandable Advanced Filter Drawer */}
        {showFilterDrawer && (
          <div className="pt-4 border-t border-surface-container-high grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Price Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1.5">
                Daily Fee Budget
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'free', label: '100% Free' },
                  { id: 'under50', label: 'Under Rs. 50' },
                  { id: 'under100', label: 'Under Rs. 100' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriceFilter(p.id as any)}
                    className={`px-2.5 py-1 rounded-lg border ${
                      priceFilter === p.id
                        ? 'bg-primary text-on-primary border-primary font-bold'
                        : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Star Rating */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1.5">
                Lender Rating
              </label>
              <div className="flex items-center space-x-1.5">
                {[
                  { val: 0, label: 'Any' },
                  { val: 4.5, label: '4.5+ ★' },
                  { val: 4.8, label: '4.8+ ★' },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setMinRating(r.val)}
                    className={`px-2.5 py-1 rounded-lg border ${
                      minRating === r.val
                        ? 'bg-primary text-on-primary border-primary font-bold'
                        : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Only Toggle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1.5">
                Availability
              </label>
              <label className="flex items-center space-x-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-on-surface font-medium">Only show items with slots today</span>
              </label>
            </div>
          </div>
        )}

        {/* Active Filters Summary & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-surface-container text-outline">
            <div className="flex items-center space-x-1.5 truncate">
              <span>Showing filtered results</span>
              <span className="font-bold text-on-surface">({filteredItems.length} items)</span>
            </div>
            <button
              onClick={resetAllFilters}
              className="text-primary hover:underline font-bold flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset all filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Catalog Grid Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Campus Equipment Catalog'}
          </h2>
          <p className="text-xs text-outline">
            {filteredItems.length} peer-verified items available across Apex campus
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-surface shadow-xs text-primary' : 'text-outline hover:text-on-surface'}`}
            aria-label="Grid view"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-surface shadow-xs text-primary' : 'text-outline hover:text-on-surface'}`}
            aria-label="List view"
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
          </button>
        </div>
      </div>

      {/* Items Display (Grid or Empty State) */}
      {filteredItems.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-surface border border-surface-container-high space-y-3">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">No equipment found matching criteria</h3>
          <p className="text-xs text-outline max-w-sm mx-auto">
            Try adjusting your search terms, changing the campus hub location, or clearing applied filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-colors inline-flex items-center space-x-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'
              : 'space-y-4'
          }
        >
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
};
