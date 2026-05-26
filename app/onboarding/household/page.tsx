'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type DietaryPref = 'Vegetarian' | 'Gluten-Free' | 'Halal' | 'No Preference';

interface HouseholdData {
  adults: number;
  children: number;
  dietaryPrefs: DietaryPref[];
  hasMedication: boolean;
  medicationDetails: string;
  groceryBudget: number;
}

const DIETARY_OPTIONS: DietaryPref[] = ['Vegetarian', 'Gluten-Free', 'Halal', 'No Preference'];
const MIN_GROCERY = 10000;
const MAX_GROCERY = 500000;

export default function HouseholdPage() {
  const router = useRouter();

  const [data, setData] = useState<HouseholdData>({
    adults: 1,
    children: 0,
    dietaryPrefs: ['No Preference'],
    hasMedication: false,
    medicationDetails: '',
    groceryBudget: 80000,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gasura_household');
      if (saved) {
        const parsed = JSON.parse(saved) as HouseholdData;
        setData(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  function save() {
    localStorage.setItem('gasura_household', JSON.stringify(data));
  }

  function adjust(field: 'adults' | 'children', delta: number) {
    setData((prev) => ({
      ...prev,
      [field]: Math.max(field === 'adults' ? 1 : 0, prev[field] + delta),
    }));
  }

  function toggleDiet(pref: DietaryPref) {
    setData((prev) => {
      if (pref === 'No Preference') {
        return { ...prev, dietaryPrefs: ['No Preference'] };
      }
      const withoutNone = prev.dietaryPrefs.filter((p) => p !== 'No Preference');
      const has = withoutNone.includes(pref);
      const next = has ? withoutNone.filter((p) => p !== pref) : [...withoutNone, pref];
      return { ...prev, dietaryPrefs: next.length === 0 ? ['No Preference'] : next };
    });
  }

  function handleNext() {
    save();
    router.push('/onboarding/priorities');
  }

  const totalMembers = data.adults + data.children;

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold text-primary">
            Gas<span className="text-secondary">ur</span>a
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-label text-xs text-secondary font-semibold">STEP 2 OF 3</span>
            <div className="flex gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-primary" />
              <div className="w-6 h-1.5 rounded-full bg-primary" />
              <div className="w-6 h-1.5 rounded-full bg-outline-variant" />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 pb-40">
        <div className="mb-10">
          <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
            Who are you providing for?
          </h1>
          <p className="font-body text-on-surface-variant">
            Gasura needs to understand your household to build an accurate food and care budget.
          </p>
        </div>

        {/* Household size */}
        <section className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            Household Size
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(['adults', 'children'] as const).map((field) => (
              <div key={field} className="bg-surface-container-lowest rounded-xl p-5 flex flex-col items-center gap-3">
                <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  {field === 'adults' ? 'Adults' : 'Children'}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => adjust(field, -1)}
                    disabled={data[field] <= (field === 'adults' ? 1 : 0)}
                    className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-outline-variant/40 transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-lg text-on-surface">remove</span>
                  </button>
                  <span className="font-headline text-3xl font-bold text-on-surface w-8 text-center">
                    {data[field]}
                  </span>
                  <button
                    onClick={() => adjust(field, 1)}
                    className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-lg text-on-primary">add</span>
                  </button>
                </div>
                <span className="font-body text-xs text-on-surface-variant">
                  {field === 'adults' ? (data.adults === 1 ? 'person' : 'people') : (data.children === 1 ? 'child' : 'children')}
                </span>
              </div>
            ))}
          </div>
          <p className="font-body text-sm text-on-surface-variant mt-4 text-center">
            Total household: <strong className="text-on-surface">{totalMembers} {totalMembers === 1 ? 'member' : 'members'}</strong>
          </p>
        </section>

        {/* Dietary preferences */}
        <section className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            Dietary Preferences
          </h2>
          <p className="font-body text-sm text-on-surface-variant mb-4">This helps Gasura recommend appropriate food items.</p>
          <div className="flex flex-wrap gap-3">
            {DIETARY_OPTIONS.map((pref) => {
              const selected = data.dietaryPrefs.includes(pref);
              return (
                <button
                  key={pref}
                  onClick={() => toggleDiet(pref)}
                  className={`font-label text-sm font-semibold px-4 py-2.5 rounded-full border-2 transition-all ${
                    selected
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:border-primary/40'
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </section>

        {/* Medical needs */}
        <section className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
            Medical Needs
          </h2>
          <div className="flex items-center justify-between py-2">
            <p className="font-body text-sm text-on-surface">Any chronic medication needed?</p>
            <button
              onClick={() => setData((prev) => ({ ...prev, hasMedication: !prev.hasMedication }))}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${data.hasMedication ? 'bg-primary' : 'bg-outline-variant'}`}
              role="switch"
              aria-checked={data.hasMedication}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.hasMedication ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
          {data.hasMedication && (
            <textarea
              value={data.medicationDetails}
              onChange={(e) => setData((prev) => ({ ...prev, medicationDetails: e.target.value }))}
              placeholder="Describe medications or conditions (e.g., diabetes medication — 15,000 RWF/month)..."
              rows={3}
              className="mt-4 w-full bg-surface-container-highest text-on-surface font-body text-sm px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/50 resize-none"
            />
          )}
        </section>

        {/* Grocery budget slider */}
        <section className="bg-surface-container-low rounded-2xl p-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            Monthly Grocery Budget Preference
          </h2>
          <p className="font-body text-sm text-on-surface-variant mb-5">
            Your preferred monthly grocery budget. Gasura will optimize within this target.
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-xs text-on-surface-variant">RWF {MIN_GROCERY.toLocaleString()}</span>
            <span className="font-headline text-2xl font-bold text-secondary">
              RWF {data.groceryBudget.toLocaleString()}
            </span>
            <span className="font-label text-xs text-on-surface-variant">RWF {MAX_GROCERY.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={MIN_GROCERY}
            max={MAX_GROCERY}
            step={5000}
            value={data.groceryBudget}
            onChange={(e) => setData((prev) => ({ ...prev, groceryBudget: parseInt(e.target.value) }))}
            className="w-full accent-primary cursor-pointer"
            style={{ accentColor: 'var(--color-primary)' }}
          />
          <div className="flex justify-between mt-2">
            <span className="font-label text-xs text-on-surface-variant">Basic</span>
            <span className="font-label text-xs text-on-surface-variant">Comfortable</span>
            <span className="font-label text-xs text-on-surface-variant">Premium</span>
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <Link
              href="/onboarding/income"
              className="flex-shrink-0 flex items-center gap-1.5 font-label text-sm font-semibold text-on-surface-variant bg-surface-container-low px-5 py-3 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </Link>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-label font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Next: Priorities
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
