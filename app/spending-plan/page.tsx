'use client';

import { useState } from 'react';
import Link from 'next/link';

type Category = 'ALL' | 'MUST' | 'NEED' | 'SAVE' | 'WANT';

interface SpendingItem {
  id: string;
  name: string;
  amount: number;
  category: 'MUST' | 'NEED' | 'SAVE' | 'WANT';
  insight?: string;
  icon: string;
}

const ITEMS: SpendingItem[] = [
  // MUST
  { id: 'm1', name: 'Electricity (RECO/REG)', amount: 15000, category: 'MUST', icon: 'bolt' },
  { id: 'm2', name: 'School transport', amount: 20000, category: 'MUST', icon: 'directions_bus' },
  // NEED
  { id: 'n1', name: 'Rice (25kg sack)', amount: 26000, category: 'NEED', icon: 'rice_bowl', insight: 'Best price at Kimironko market on weekdays — avg RWF 22,000 per sack.' },
  { id: 'n2', name: 'Cooking oil (5L)', amount: 16400, category: 'NEED', icon: 'local_grocery_store', insight: 'Buy in bulk — 5L at RWF 14,500 from wholesale shops near Nyabugogo.' },
  { id: 'n3', name: 'Beans (10kg)', amount: 16800, category: 'NEED', icon: 'spa' },
  // SAVE
  { id: 's1', name: 'Ikimina contribution', amount: 17500, category: 'SAVE', icon: 'savings' },
  // WANT
  { id: 'w1', name: 'Restaurant / dining out', amount: 10000, category: 'WANT', icon: 'restaurant', insight: 'You have RWF 10,000 allocated for dining. Enjoy — you\'ve earned it!' },
];

const CATEGORY_CONFIG = {
  MUST: {
    label: 'Priority Obligations',
    badge: 'MUST',
    borderColor: 'border-error',
    badgeBg: 'bg-error text-on-error',
    dot: 'bg-error',
  },
  NEED: {
    label: 'Household Essentials',
    badge: 'NEED',
    borderColor: 'border-orange-500',
    badgeBg: 'bg-orange-500 text-white',
    dot: 'bg-orange-500',
  },
  SAVE: {
    label: 'Future Protection',
    badge: 'SAVE',
    borderColor: 'border-blue-600',
    badgeBg: 'bg-blue-600 text-white',
    dot: 'bg-blue-600',
  },
  WANT: {
    label: 'Lifestyle & Comfort',
    badge: 'WANT',
    borderColor: 'border-stone-400',
    badgeBg: 'bg-stone-400 text-white',
    dot: 'bg-stone-400',
  },
};

const TABS: Category[] = ['ALL', 'MUST', 'NEED', 'SAVE', 'WANT'];

const TOTAL_SPENDABLE = 238000;

export default function SpendingPlanPage() {
  const [activeTab, setActiveTab] = useState<Category>('ALL');

  const allocated = ITEMS.reduce((sum, i) => sum + i.amount, 0);
  const buffer = TOTAL_SPENDABLE - allocated;
  const progress = Math.min(100, (allocated / TOTAL_SPENDABLE) * 100);

  const visibleItems =
    activeTab === 'ALL' ? ITEMS : ITEMS.filter((i) => i.category === activeTab);

  const groupedCategories = (['MUST', 'NEED', 'SAVE', 'WANT'] as const).filter((cat) =>
    activeTab === 'ALL' ? true : cat === activeTab
  );

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold text-primary">
            Gas<span className="text-secondary">ur</span>a
          </Link>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Summary banner */}
      <div className="bg-primary text-on-primary">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="font-label text-xs font-semibold text-on-primary-container uppercase tracking-widest mb-1">Your Plan</p>
          <h1 className="font-headline text-2xl font-bold text-on-primary mb-6">July Spending Plan</h1>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="font-label text-xs text-on-primary-container uppercase tracking-wide mb-1">Spendable</p>
              <p className="font-headline text-xl font-bold text-on-primary">RWF {TOTAL_SPENDABLE.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-label text-xs text-on-primary-container uppercase tracking-wide mb-1">Allocated</p>
              <p className="font-headline text-xl font-bold text-secondary">RWF {allocated.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-label text-xs text-on-primary-container uppercase tracking-wide mb-1">Buffer</p>
              <p className={`font-headline text-xl font-bold ${buffer >= 0 ? 'text-on-primary' : 'text-error-container'}`}>
                RWF {buffer.toLocaleString()}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-primary-container rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-body text-xs text-on-primary-container mt-2">
            {Math.round(progress)}% of spendable income allocated
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-16 z-30 bg-surface-container-lowest border-b border-outline-variant/20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto hide-scrollbar py-3">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 font-label text-xs font-bold px-4 py-2 rounded-full transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped spending list */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-6 pb-28">
        {groupedCategories.map((cat) => {
          const catItems = visibleItems.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          const cfg = CATEGORY_CONFIG[cat];
          const catTotal = catItems.reduce((sum, i) => sum + i.amount, 0);

          return (
            <section key={cat} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <h2 className="font-headline text-base font-bold text-on-surface">{cfg.label}</h2>
                </div>
                <span className="font-label text-xs font-semibold text-on-surface-variant">
                  RWF {catTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-surface-container-lowest rounded-xl p-4 border-l-4 ${cfg.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-on-surface-variant text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-body text-sm font-medium text-on-surface">{item.name}</p>
                          <span className={`font-label text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg}`}>
                            {cfg.badge}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-label text-sm font-bold text-on-surface">
                          RWF {item.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {item.insight && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-start gap-2">
                        <span
                          className="material-symbols-outlined text-base text-secondary flex-shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          auto_awesome
                        </span>
                        <p className="font-body text-xs text-on-surface-variant leading-relaxed">{item.insight}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {visibleItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">category</span>
            <p className="font-body text-on-surface-variant">No items in this category</p>
          </div>
        )}
      </main>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link
            href="/ask-gasura"
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-label font-bold text-sm py-3.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            Ask Gasura about this plan
          </Link>
        </div>
      </div>
    </div>
  );
}
