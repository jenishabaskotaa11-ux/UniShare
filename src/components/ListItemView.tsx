import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AcademicCategory, CampusHub, ItemCondition } from '../types.ts';
import { CATEGORIES } from './CategoryPills.tsx';
import { CAMPUS_HUBS } from './HeroSection.tsx';

const PRESET_PHOTOS = [
  { label: 'Scientific Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Laptop Charger', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80' },
  { label: 'White Lab Coat', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9FuXEK0eXQr868y2BSBfM6qQ32Q579bLNAFrVB8wh75Nv6vBChIJFFe4bpcl8RCb3au2th5NCYy_uhNa0vzcH7XNInSlIBmW4Kw0RN9UStF-3A2xh1eNtf9TKgqc_ibS-EOenJpG0IYJbSRKoXNjAArpyMVipo3ywn9vL1Dl5SJcuuDDFSbbXbuFqQg_uSS0a3oSov7CEiBXaMT7vM150a7W2QrXL_mC8P5FLlIwVt4MKOrdfSxNR' },
  { label: 'Display Adapter', url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=600&q=80' },
  { label: 'Arduino / Breadboard', url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80' },
  { label: 'College Textbook', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80' },
];

export const ListItemView: React.FC = () => {
  const { listItem, currentUser, openAuthModal } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<AcademicCategory>('Calculators & Academic Tools');
  const [subcategory, setSubcategory] = useState('Scientific Calculator');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [description, setDescription] = useState('');
  const [specsInput, setSpecsInput] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [pricePerDay, setPricePerDay] = useState(40);
  const [deposit, setDeposit] = useState(150);
  const [pickupLocation, setPickupLocation] = useState<CampusHub>('Central Library Desk 1A');
  const [availableUnits, setAvailableUnits] = useState(1);
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('signin');
      return;
    }
    if (!name.trim() || !description.trim()) {
      return;
    }

    const specs = specsInput
      ? specsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Campus peer verified', 'Ready for exam handover'];

    listItem({
      name: name.trim(),
      category,
      subcategory,
      condition,
      description: description.trim(),
      specs,
      image: imageUrl,
      pricePerDay: isFree ? 0 : Number(pricePerDay),
      deposit: Number(deposit),
      isFree,
      pickupLocation,
      distanceKm: 0.4,
      initialAvailableCount: Number(availableUnits),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-surface rounded-3xl border border-surface-container-high p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">List an Item to Share or Rent</h2>
          <p className="text-xs text-outline mt-0.5">
            Turn your idle calculators, lab coats, and adapters into peer earnings and SharePoints.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>Earn +20 pts on listing</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form: Details (2 Cols) */}
        <div className="lg:col-span-2 bg-surface rounded-3xl border border-surface-container-high p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          
          {/* Item Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
              Item Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Casio fx-991CW Scientific Calculator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AcademicCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
              >
                {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
              >
                <option value="Like New">Like New (Flawless)</option>
                <option value="Excellent">Excellent (Minor signs of use)</option>
                <option value="Good">Good (Working fine)</option>
                <option value="Fair">Fair (Cosmetic wear)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
              Description & Campus Handover Notes *
            </label>
            <textarea
              rows={3}
              placeholder="Mention key details: approved for which exams, battery life, included snap cover, or sanitation status..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
            />
          </div>

          {/* Key Specs / Highlights */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
              Highlights / Specs (Comma separated)
            </label>
            <input
              type="text"
              placeholder="552 functions, Fresh AAA battery, Hard cover, Syllabus approved"
              value={specsInput}
              onChange={(e) => setSpecsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
            />
          </div>

          {/* Pricing & Free Share Toggle */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-on-surface block">Community Free Item?</span>
                <span className="text-[11px] text-outline">Lend for Rs. 0 to earn maximum SharePoints karma</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {!isFree && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-container">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Rental Fee (Rs. / 24hrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface text-on-surface border border-outline-variant"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Security Deposit (Rs. held)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface text-on-surface border border-outline-variant"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Handover Hub & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                Handover Campus Hub *
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value as CampusHub)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
              >
                {CAMPUS_HUBS.filter((h) => h !== 'All Campus Hubs').map((hub) => (
                  <option key={hub} value={hub}>
                    {hub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                Quantity Available *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={availableUnits}
                onChange={(e) => setAvailableUnits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Photo & Live Preview (1 Col) */}
        <div className="space-y-4 text-xs">
          
          {/* Photo Selector */}
          <div className="bg-surface rounded-3xl border border-surface-container-high p-5 shadow-xs space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline">
              Item Photo
            </label>

            {/* Preview image */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] border border-surface-container">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* File Upload Button */}
            <div>
              <label className="w-full py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant font-semibold text-center cursor-pointer flex items-center justify-center space-x-1.5 transition-colors">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preset Photos for quick testing */}
            <div>
              <span className="text-[10px] text-outline block mb-1.5">Or choose a preset template:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`p-1 rounded-lg border text-[10px] truncate transition-colors ${
                      imageUrl === p.url
                        ? 'border-primary bg-primary-container/20 font-bold text-primary'
                        : 'border-outline-variant bg-surface-container-low text-outline hover:text-on-surface'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-hover shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">publish</span>
            <span>Publish Listing (+20 pts)</span>
          </button>

          <p className="text-[11px] text-outline text-center leading-relaxed">
            All listings are backed by Apex University student code of conduct. You approve every handover request before sharing.
          </p>

        </div>

      </form>

    </div>
  );
};
