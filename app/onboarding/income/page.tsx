'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type IncomeFrequency = 'Monthly' | 'Weekly' | 'One-time';
type IncomeType = 'Salary' | 'Allowance' | 'Wages' | 'Business' | 'Other';

interface IncomeRow {
  id: string;
  type: IncomeType;
  amount: string;
  frequency: IncomeFrequency;
}

interface DeductionRow {
  id: string;
  icon: string;
  name: string;
  amount: string;
}

const DEFAULT_DEDUCTIONS: DeductionRow[] = [
  { id: 'rent', icon: 'home', name: 'Rent', amount: '' },
  { id: 'school', icon: 'school', name: 'School Fees', amount: '' },
  { id: 'mutuelle', icon: 'health_and_safety', name: 'Mutuelle de Santé', amount: '' },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function toMonthly(amount: number, freq: IncomeFrequency): number {
  if (freq === 'Weekly') return amount * 4.33;
  if (freq === 'One-time') return amount / 12;
  return amount;
}

export default function IncomePage() {
  const router = useRouter();

  const [incomeRows, setIncomeRows] = useState<IncomeRow[]>([
    { id: genId(), type: 'Salary', amount: '', frequency: 'Monthly' },
  ]);
  const [deductions, setDeductions] = useState<DeductionRow[]>(DEFAULT_DEDUCTIONS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gasura_income');
      if (saved) {
        const parsed = JSON.parse(saved) as { incomeRows: IncomeRow[]; deductions: DeductionRow[] };
        if (parsed.incomeRows) setIncomeRows(parsed.incomeRows);
        if (parsed.deductions) setDeductions(parsed.deductions);
      }
    } catch {
      // ignore
    }
  }, []);

  function save() {
    localStorage.setItem('gasura_income', JSON.stringify({ incomeRows, deductions }));
  }

  function addIncomeRow() {
    setIncomeRows((prev) => [
      ...prev,
      { id: genId(), type: 'Salary', amount: '', frequency: 'Monthly' },
    ]);
  }

  function removeIncomeRow(id: string) {
    setIncomeRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateIncomeRow(id: string, field: keyof IncomeRow, value: string) {
    setIncomeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function addDeduction() {
    setDeductions((prev) => [
      ...prev,
      { id: genId(), icon: 'payments', name: 'Other Deduction', amount: '' },
    ]);
  }

  function removeDeduction(id: string) {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  }

  function updateDeduction(id: string, field: 'name' | 'amount', value: string) {
    setDeductions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  const totalMonthlyIncome = incomeRows.reduce((sum, row) => {
    const amt = parseFloat(row.amount) || 0;
    return sum + toMonthly(amt, row.frequency);
  }, 0);

  const totalDeductions = deductions.reduce((sum, d) => {
    return sum + (parseFloat(d.amount) || 0);
  }, 0);

  const available = totalMonthlyIncome - totalDeductions;

  function handleNext() {
    save();
    router.push('/onboarding/household');
  }

  const inputClass =
    'w-full bg-surface-container-highest text-on-surface font-body text-sm px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/50';

  const selectClass =
    'bg-surface-container-highest text-on-surface font-body text-sm px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer';

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold text-primary">
            Gas<span className="text-secondary">ur</span>a
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-label text-xs text-secondary font-semibold">STEP 1 OF 3</span>
            <div className="flex gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-primary" />
              <div className="w-6 h-1.5 rounded-full bg-outline-variant" />
              <div className="w-6 h-1.5 rounded-full bg-outline-variant" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 pb-40">
        <div className="mb-10">
          <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
            What comes in every month?
          </h1>
          <p className="font-body text-on-surface-variant">
            Tell Gasura about your income sources and fixed obligations so we can build your plan.
          </p>
        </div>

        {/* Income Sources */}
        <section className="mb-10">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            Income Sources
          </h2>
          <div className="flex flex-col gap-3">
            {incomeRows.map((row) => (
              <div
                key={row.id}
                className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wide mb-1.5 block">Type</label>
                  <select
                    value={row.type}
                    onChange={(e) => updateIncomeRow(row.id, 'type', e.target.value)}
                    className={`${selectClass} w-full`}
                  >
                    {(['Salary', 'Allowance', 'Wages', 'Business', 'Other'] as IncomeType[]).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wide mb-1.5 block">RWF Amount</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 200,000"
                    value={row.amount}
                    onChange={(e) => updateIncomeRow(row.id, 'amount', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wide mb-1.5 block">Frequency</label>
                  <select
                    value={row.frequency}
                    onChange={(e) => updateIncomeRow(row.id, 'frequency', e.target.value as IncomeFrequency)}
                    className={`${selectClass} w-full`}
                  >
                    {(['Monthly', 'Weekly', 'One-time'] as IncomeFrequency[]).map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                {incomeRows.length > 1 && (
                  <button
                    onClick={() => removeIncomeRow(row.id)}
                    className="mt-1 sm:mt-6 text-on-surface-variant hover:text-error transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addIncomeRow}
            className="mt-4 flex items-center gap-2 font-label text-sm font-semibold text-primary border border-primary/30 rounded-xl px-4 py-2.5 hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add income source
          </button>
        </section>

        {/* Fixed Deductions */}
        <section className="mb-10">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            Fixed Deductions
          </h2>
          <div className="flex flex-col gap-3">
            {deductions.map((d) => (
              <div
                key={d.id}
                className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{d.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => updateDeduction(d.id, 'name', e.target.value)}
                    className="bg-transparent font-body text-sm font-medium text-on-surface outline-none w-full"
                    readOnly={['rent', 'school', 'mutuelle'].includes(d.id)}
                  />
                </div>
                <div className="w-36 flex-shrink-0">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-label text-xs text-on-surface-variant">RWF</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={d.amount}
                      onChange={(e) => updateDeduction(d.id, 'amount', e.target.value)}
                      className="w-full bg-surface-container-highest text-on-surface font-body text-sm pl-10 pr-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>
                {!['rent', 'school', 'mutuelle'].includes(d.id) && (
                  <button
                    onClick={() => removeDeduction(d.id)}
                    className="text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addDeduction}
            className="mt-4 flex items-center gap-2 font-label text-sm font-semibold text-on-surface-variant border border-outline-variant/50 rounded-xl px-4 py-2.5 hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add deduction
          </button>
        </section>

        {/* Insight card */}
        <div className="rounded-xl overflow-hidden flex">
          <div className="w-1 flex-shrink-0 bg-secondary" />
          <div className="bg-secondary-container/30 flex-1 p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <div>
                <p className="font-label text-xs font-semibold text-on-surface uppercase tracking-wide mb-1">Gasura Insight</p>
                <p className="font-body text-sm text-on-surface-variant">
                  Fixed deductions come off the top before any spending decisions are made. This ensures your obligations are always covered first — the foundation of every healthy budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wide">Available this month</span>
            <span className={`font-headline text-2xl font-bold ${available >= 0 ? 'text-secondary' : 'text-error'}`}>
              {available >= 0 ? '' : '-'}RWF {Math.abs(available).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1.5 font-label text-sm font-semibold text-on-surface-variant bg-surface-container-low px-5 py-3 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </Link>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-label font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Next: Household
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
