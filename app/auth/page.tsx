'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign-in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign-up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === 'signup' && signUpName) {
      localStorage.setItem('gasura_user_name', signUpName);
    }
    router.push('/onboarding/income');
  }

  const inputClass =
    'w-full bg-surface-container-highest text-on-surface font-body text-base px-4 py-3.5 rounded-xl outline-none placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/30 transition-all';

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      {/* Top bar */}
      <nav className="h-16 flex items-center px-6">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Gas<span className="text-secondary">ur</span>a
        </Link>
      </nav>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
                {tab === 'signin' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="font-body text-on-surface-variant">
                {tab === 'signin'
                  ? 'Sign in to your Gasura account'
                  : 'Start your financial journey with Gasura'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-surface-container-highest rounded-xl p-1 mb-8">
              <button
                onClick={() => setTab('signin')}
                className={`flex-1 font-label text-sm font-semibold py-2.5 rounded-lg transition-all ${
                  tab === 'signin'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 font-label text-sm font-semibold py-2.5 rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'signup' && (
                <div>
                  <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Amina Uwase"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={tab === 'signin' ? signInEmail : signUpEmail}
                  onChange={(e) =>
                    tab === 'signin'
                      ? setSignInEmail(e.target.value)
                      : setSignUpEmail(e.target.value)
                  }
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={tab === 'signin' ? '••••••••' : 'Create a strong password'}
                    value={tab === 'signin' ? signInPassword : signUpPassword}
                    onChange={(e) =>
                      tab === 'signin'
                        ? setSignInPassword(e.target.value)
                        : setSignUpPassword(e.target.value)
                    }
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {tab === 'signin' && (
                <div className="text-right">
                  <button type="button" className="font-label text-xs text-secondary hover:opacity-80 transition-opacity">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-label font-bold text-base py-4 rounded-xl hover:opacity-90 transition-opacity mt-2"
              >
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="font-body text-sm text-on-surface-variant text-center mt-6">
              {tab === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setTab('signup')}
                    className="text-secondary font-semibold hover:opacity-80 transition-opacity"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setTab('signin')}
                    className="text-secondary font-semibold hover:opacity-80 transition-opacity"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-secondary">lock</span>
            <span className="font-label text-xs">Bank-grade security standards</span>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0, 38, 27, 0.04) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
