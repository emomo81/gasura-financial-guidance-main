'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface IncomeRow {
  id: string;
  type: string;
  amount: string;
  frequency: 'Monthly' | 'Weekly' | 'One-time';
}

interface DeductionRow {
  id: string;
  icon: string;
  name: string;
  amount: string;
}

function toMonthly(amount: number, freq: string): number {
  if (freq === 'Weekly') return amount * 4.33;
  if (freq === 'One-time') return amount / 12;
  return amount;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

// Simple SVG line chart points
function getChartPoints(data: number[], width: number, height: number): string {
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');
}

const BALANCE_DATA = [185000, 210000, 195000, 230000, 215000, 245000, 260000, 238000];

const TRANSACTIONS = [
  { icon: 'local_grocery_store', label: 'Grocery — Kigali Market', date: 'Today', amount: -12400, cat: 'NEED' },
  { icon: 'directions_bus', label: 'MTN Tap & Go — Transport', date: 'Yesterday', amount: -3500, cat: 'NEED' },
  { icon: 'account_balance', label: 'Salary — Received', date: 'Mar 25', amount: 380000, cat: 'INCOME' },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);

  useEffect(() => {
    try {
      const name = localStorage.getItem('gasura_user_name') || 'Friend';
      let inc = 380000;
      let ded = 142000;

      const incomeRaw = localStorage.getItem('gasura_income');
      if (incomeRaw) {
        const parsed = JSON.parse(incomeRaw) as { incomeRows?: IncomeRow[]; deductions?: DeductionRow[] };
        inc = (parsed.incomeRows || []).reduce((sum: number, r: IncomeRow) => {
          return sum + toMonthly(parseFloat(r.amount) || 0, r.frequency);
        }, 0) || 380000;
        ded = (parsed.deductions || []).reduce((sum: number, d: DeductionRow) => {
          return sum + (parseFloat(d.amount) || 0);
        }, 0) || 142000;
      }

      setUserName(name);
      setTotalIncome(inc);
      setTotalDeductions(ded);
    } catch {
      setUserName('Friend');
      setTotalIncome(380000);
      setTotalDeductions(142000);
    }
  }, []);

  const balance = totalIncome - totalDeductions;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  const chartPoints = getChartPoints(BALANCE_DATA, 500, 100);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold text-primary">
            Gas<span className="text-secondary">ur</span>a
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <span className="font-label text-sm font-semibold text-primary border-b-2 border-primary pb-0.5">Dashboard</span>
            <Link href="/spending-plan" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Spending Plan</Link>
            <Link href="/ask-gasura" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Ask Gasura</Link>
            <Link href="/auth" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Settings</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="font-label text-sm font-bold text-on-primary">
                {userName ? userName[0].toUpperCase() : 'G'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            {greeting}, {userName || 'Friend'} 👋
          </h1>
          <p className="font-body text-on-surface-variant mt-1">
            Here&apos;s your financial overview for <strong className="text-on-surface">{month} {year}</strong>
          </p>
        </div>

        {/* Row 1: Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Total Income */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Total Income</span>
              <div className="w-8 h-8 bg-surface-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              </div>
            </div>
            <p className="font-headline text-3xl font-bold text-on-surface">
              {totalIncome > 0 ? `RWF ${totalIncome.toLocaleString()}` : 'RWF 380,000'}
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-2">This month</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Total Expenses</span>
              <div className="w-8 h-8 bg-surface-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
              </div>
            </div>
            <p className="font-headline text-3xl font-bold text-on-surface">
              {totalDeductions > 0 ? `RWF ${totalDeductions.toLocaleString()}` : 'RWF 142,000'}
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-2">Fixed + spent</p>
          </div>

          {/* Balance — accent green */}
          <div className="bg-primary rounded-2xl p-6 text-on-primary">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-xs font-semibold text-on-primary-container uppercase tracking-wide">Current Balance</span>
              <div className="w-8 h-8 bg-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
            </div>
            <p className="font-headline text-3xl font-bold text-on-primary">
              RWF {(balance > 0 ? balance : 238000).toLocaleString()}
            </p>
            <p className="font-body text-xs text-on-primary-container mt-2">Available to allocate</p>
          </div>
        </div>

        {/* Row 2: Chart + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Balance overview chart — 8 cols */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline text-lg font-bold text-on-surface">Balance Overview</h2>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Last 8 months</p>
              </div>
              <span className="font-label text-xs font-semibold text-secondary bg-secondary-container px-3 py-1.5 rounded-full">+12.4%</span>
            </div>
            <div className="relative w-full" style={{ height: '120px' }}>
              <svg
                viewBox="0 0 500 100"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                {/* Fill area */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,100 ${chartPoints} 500,100`}
                  fill="url(#chartGradient)"
                />
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data dots */}
                {BALANCE_DATA.map((v, i) => {
                  const min = Math.min(...BALANCE_DATA);
                  const max = Math.max(...BALANCE_DATA);
                  const range = max - min || 1;
                  const x = (i / (BALANCE_DATA.length - 1)) * 500;
                  const y = 100 - ((v - min) / range) * 80 - 10;
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="var(--color-primary)" />
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-3">
              {MONTHS.map((m) => (
                <span key={m} className="font-label text-xs text-on-surface-variant">{m}</span>
              ))}
            </div>
          </div>

          {/* Plan adherence donut — 4 cols */}
          <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-1">Plan Adherence</h2>
            <p className="font-body text-xs text-on-surface-variant mb-5">{month} {year}</p>
            {/* Simple donut SVG */}
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-surface-container-highest)" strokeWidth="12" />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 38 * 0.76} ${2 * Math.PI * 38 * 0.24}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-2xl font-bold text-primary">76%</span>
                  <span className="font-label text-xs text-on-surface-variant">on track</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'MUST covered', done: true },
                { label: 'NEED within budget', done: true },
                { label: 'SAVE goal met', done: false },
                { label: 'WANT limit OK', done: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-base ${item.done ? 'text-primary' : 'text-on-surface-variant/50'}`} style={{ fontVariationSettings: `'FILL' ${item.done ? 1 : 0}` }}>
                    {item.done ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className={`font-body text-xs ${item.done ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Transactions + AI Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent transactions — 8 cols */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-headline text-lg font-bold text-on-surface">Recent Transactions</h2>
              <Link href="/spending-plan" className="font-label text-xs font-semibold text-secondary hover:opacity-80 transition-opacity">
                View plan →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {TRANSACTIONS.map((tx, i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{tx.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-on-surface truncate">{tx.label}</p>
                    <p className="font-body text-xs text-on-surface-variant">{tx.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-label text-sm font-bold ${tx.amount > 0 ? 'text-primary' : 'text-on-surface'}`}>
                      {tx.amount > 0 ? '+' : ''}RWF {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <span className={`font-label text-xs px-2 py-0.5 rounded-full ${
                      tx.cat === 'INCOME' ? 'bg-primary-container text-on-primary-container'
                      : tx.cat === 'NEED' ? 'bg-surface-container-highest text-on-surface-variant'
                      : 'bg-error-container text-on-error-container'
                    }`}>
                      {tx.cat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight — 4 cols */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden flex flex-col">
            <div className="w-full flex flex-col flex-1">
              <div className="flex h-full">
                <div className="w-1 flex-shrink-0 bg-secondary rounded-l-2xl" />
                <div className="bg-surface-container-low flex-1 rounded-r-2xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="font-label text-xs font-semibold text-secondary uppercase tracking-wide">AI Insight</span>
                  </div>
                  <h3 className="font-headline text-base font-bold text-on-surface mb-3">
                    You&apos;re 76% on track this month.
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed flex-1">
                    Your food spending is 18% over budget. Consider buying staples like rice and beans at Kimironko market instead of supermarkets — you could save up to RWF 12,000 this week.
                  </p>
                  <Link
                    href="/ask-gasura"
                    className="mt-5 flex items-center gap-2 font-label text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                  >
                    Ask Gasura for advice
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating action button */}
      <Link
        href="/ask-gasura"
        className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        title="Ask Gasura"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
      </Link>
    </div>
  );
}
