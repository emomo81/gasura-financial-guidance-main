'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SavingsLevel = 'Conservative (10%)' | 'Balanced (20%)' | 'Aggressive (30%)';

interface PriorityItem {
  id: string;
  label: string;
  icon: string;
}

const INITIAL_PRIORITIES: PriorityItem[] = [
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'health', label: 'Health', icon: 'favorite' },
  { id: 'savings', label: 'Savings', icon: 'savings' },
  { id: 'entertainment', label: 'Entertainment', icon: 'theater_comedy' },
  { id: 'food', label: 'Food Quality', icon: 'restaurant' },
  { id: 'transport', label: 'Transport', icon: 'directions_car' },
];

const GOAL_OPTIONS = [
  { id: 'emergency', label: 'Build emergency fund', icon: 'emergency' },
  { id: 'school', label: 'Save for school fees', icon: 'school' },
  { id: 'debt', label: 'Pay off debt', icon: 'money_off' },
  { id: 'business', label: 'Start a business', icon: 'storefront' },
  { id: 'property', label: 'Buy property', icon: 'home' },
  { id: 'travel', label: 'Travel', icon: 'flight' },
];

const SAVINGS_OPTIONS: SavingsLevel[] = [
  'Conservative (10%)',
  'Balanced (20%)',
  'Aggressive (30%)',
];

export default function PrioritiesPage() {
  const router = useRouter();

  const [priorities, setPriorities] = useState<PriorityItem[]>(INITIAL_PRIORITIES);
  const [goals, setGoals] = useState<string[]>(['emergency']);
  const [savingsLevel, setSavingsLevel] = useState<SavingsLevel>('Balanced (20%)');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gasura_priorities');
      if (saved) {
        const parsed = JSON.parse(saved) as {
          priorities: PriorityItem[];
          goals: string[];
          savingsLevel: SavingsLevel;
        };
        if (parsed.priorities) setPriorities(parsed.priorities);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.savingsLevel) setSavingsLevel(parsed.savingsLevel);
      }
    } catch {
      // ignore
    }
  }, []);

  function moveUp(index: number) {
    if (index === 0) return;
    setPriorities((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    setPriorities((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  function toggleGoal(id: string) {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function handleGenerate() {
    localStorage.setItem(
      'gasura_priorities',
      JSON.stringify({ priorities, goals, savingsLevel })
    );
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold text-primary">
            Gas<span className="text-secondary">ur</span>a
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-label text-xs text-secondary font-semibold">STEP 3 OF 3</span>
            <div className="flex gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-primary" />
              <div className="w-6 h-1.5 rounded-full bg-primary" />
              <div className="w-6 h-1.5 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 pb-40">
        <div className="mb-10">
          <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
            What matters most to you?
          </h1>
          <p className="font-body text-on-surface-variant">
            Help Gasura understand your values so it can allocate your money accordingly.
          </p>
        </div>

        {/* Priority ranking */}
        <section className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>format_list_numbered</span>
            Priority Ranking
          </h2>
          <p className="font-body text-sm text-on-surface-variant mb-5">
            Drag to reorder — highest priority at the top. Gasura will protect spending on items ranked higher.
          </p>
          <div className="flex flex-col gap-2">
            {priorities.map((item, index) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl px-4 py-3 flex items-center gap-4"
              >
                <span className="font-headline text-xl font-bold text-secondary w-6 text-center flex-shrink-0">
                  {index + 1}
                </span>
                <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <span className="flex-1 font-body text-sm font-medium text-on-surface">{item.label}</span>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-base text-on-surface-variant">keyboard_arrow_up</span>
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === priorities.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-base text-on-surface-variant">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financial goals */}
        <section className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
            Financial Goals
          </h2>
          <p className="font-body text-sm text-on-surface-variant mb-5">Select all that apply — Gasura will prioritize these in your plan.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GOAL_OPTIONS.map((goal) => {
              const selected = goals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`rounded-xl p-4 flex flex-col items-center gap-2 border-2 transition-all text-center ${
                    selected
                      ? 'bg-primary-container border-primary text-on-surface'
                      : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/40 text-on-surface-variant'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1", color: selected ? 'var(--color-on-primary-container)' : undefined }}
                  >
                    {goal.icon}
                  </span>
                  <span className="font-label text-xs font-semibold leading-tight">{goal.label}</span>
                  {selected && (
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Savings aggressiveness */}
        <section className="bg-surface-container-low rounded-2xl p-6">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            Savings Aggressiveness
          </h2>
          <p className="font-body text-sm text-on-surface-variant mb-5">
            How much of your available income should Gasura protect for savings?
          </p>
          <div className="flex flex-col gap-3">
            {SAVINGS_OPTIONS.map((opt) => {
              const selected = savingsLevel === opt;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-4 rounded-xl px-5 py-4 cursor-pointer border-2 transition-all ${
                    selected
                      ? 'border-primary bg-primary-container/30'
                      : 'border-transparent bg-surface-container-lowest hover:border-outline-variant/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-on-primary" />}
                  </div>
                  <input
                    type="radio"
                    name="savings"
                    value={opt}
                    checked={selected}
                    onChange={() => setSavingsLevel(opt)}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-body text-sm font-semibold text-on-surface">{opt}</p>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">
                      {opt === 'Conservative (10%)' && 'Safe and steady — small but consistent savings.'}
                      {opt === 'Balanced (20%)' && 'Recommended — good balance of spending and saving.'}
                      {opt === 'Aggressive (30%)' && 'Maximum growth — sacrifice comfort for rapid savings.'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <Link
              href="/onboarding/household"
              className="flex-shrink-0 flex items-center gap-1.5 font-label text-sm font-semibold text-on-surface-variant bg-surface-container-low px-5 py-3 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </Link>
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-label font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity sm:flex-initial sm:px-8"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Generate My Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
