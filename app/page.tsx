import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-headline text-2xl font-bold text-primary">Gas<span className="text-secondary">ur</span>a</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/spending-plan" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Spending Plan</Link>
            <Link href="/ask-gasura" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Ask Gasura</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="font-label text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Sign In</Link>
            <Link
              href="/onboarding/income"
              className="bg-primary text-on-primary font-label text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container font-label text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            AI-POWERED · RWANDA
          </div>
          <h1 className="font-headline text-6xl md:text-7xl font-bold text-on-surface leading-tight mb-6">
            Your money.<br />
            <span className="text-primary">Finally guided.</span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl">
            Tell Gasura your income. Get a complete spending plan before you spend a single franc. AI-powered budgeting built for Rwanda.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/onboarding/income"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
            >
              Start Your Plan
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
            <Link
              href="/ask-gasura"
              className="inline-flex items-center gap-2 bg-surface-container-low text-on-surface font-label font-semibold px-8 py-4 rounded-full text-base hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl text-secondary">mic</span>
              Ask Gasura
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Columns */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="font-label text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Why Gasura</p>
            <h2 className="font-headline text-4xl font-bold text-on-surface">Built for the Rwandan household.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Knows Your Context</h3>
              <p className="font-body text-on-surface-variant leading-relaxed">
                Understands Kigali prices, Mutuelle de Santé, Ikimina savings groups, and WASAC bills. Real advice for real Rwandan life.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-secondary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">AI Financial Parent</h3>
              <p className="font-body text-on-surface-variant leading-relaxed">
                Gasura acts like a trusted mentor—firm on needs, flexible on wants, and always working toward your family&apos;s financial safety.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Plan Every Franc</h3>
              <p className="font-body text-on-surface-variant leading-relaxed">
                Get a detailed monthly spending plan categorized into MUST, NEED, SAVE, and WANT — so every franc has a purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MUST/NEED/SAVE/WANT Framework */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="font-label text-xs font-semibold text-secondary uppercase tracking-widest mb-3">The Framework</p>
            <h2 className="font-headline text-4xl font-bold text-on-surface mb-4">Four tiers. Zero guesswork.</h2>
            <p className="font-body text-on-surface-variant text-lg max-w-xl">
              Every expense in your life fits into one of four categories. Gasura allocates your income across all four automatically.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {/* MUST */}
            <div className="bg-error-container rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-error text-on-error font-label text-xs font-bold px-2.5 py-1 rounded-full">MUST</span>
              </div>
              <div className="w-full bg-error/20 rounded-full h-2 mb-4">
                <div className="bg-error h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Priority Obligations</h3>
              <p className="font-body text-sm text-on-surface-variant">Rent, school fees, utilities. Non-negotiable, always funded first.</p>
            </div>
            {/* NEED */}
            <div className="bg-surface-container-low rounded-2xl p-6" style={{ backgroundColor: '#fff3e0' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-label text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#e65100' }}>NEED</span>
              </div>
              <div className="w-full rounded-full h-2 mb-4" style={{ backgroundColor: '#ffcc02aa' }}>
                <div className="h-2 rounded-full" style={{ width: '80%', backgroundColor: '#e65100' }}></div>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Household Essentials</h3>
              <p className="font-body text-sm text-on-surface-variant">Food, transport, medical. Life-sustaining but adjustable.</p>
            </div>
            {/* SAVE */}
            <div className="bg-surface-container-low rounded-2xl p-6" style={{ backgroundColor: '#e3f2fd' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-label text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#1565c0' }}>SAVE</span>
              </div>
              <div className="w-full rounded-full h-2 mb-4" style={{ backgroundColor: '#90caf9aa' }}>
                <div className="h-2 rounded-full" style={{ width: '60%', backgroundColor: '#1565c0' }}></div>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Future Protection</h3>
              <p className="font-body text-sm text-on-surface-variant">Ikimina, emergency fund, long-term goals. Your future self.</p>
            </div>
            {/* WANT */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-surface-container-highest text-on-surface font-label text-xs font-bold px-2.5 py-1 rounded-full">WANT</span>
              </div>
              <div className="w-full bg-outline-variant/30 rounded-full h-2 mb-4">
                <div className="bg-on-surface-variant h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Lifestyle & Comfort</h3>
              <p className="font-body text-sm text-on-surface-variant">Dining, entertainment, treats. Enjoy life within limits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Green CTA Banner */}
      <section className="bg-primary py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-secondary text-5xl mb-6 block" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-primary mb-6">
            Stop guessing. Start planning.
          </h2>
          <p className="font-body text-on-primary-container text-xl mb-10 max-w-2xl mx-auto opacity-90">
            In 3 minutes, Gasura builds a complete spending plan tailored to your income, household, and Rwandan context.
          </p>
          <Link
            href="/onboarding/income"
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-label font-bold px-10 py-5 rounded-full text-lg hover:opacity-90 transition-opacity"
          >
            Build My Plan Now
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="font-headline text-2xl font-bold text-primary mb-2">Gas<span className="text-secondary">ur</span>a</div>
              <p className="font-body text-sm text-on-surface-variant max-w-xs">AI-powered financial planning for Rwandan households. Built with love in Kigali.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-label text-xs font-semibold text-on-surface uppercase tracking-widest mb-3">Product</p>
                <div className="flex flex-col gap-2">
                  <Link href="/onboarding/income" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Get Started</Link>
                  <Link href="/dashboard" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
                  <Link href="/spending-plan" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Spending Plan</Link>
                </div>
              </div>
              <div>
                <p className="font-label text-xs font-semibold text-on-surface uppercase tracking-widest mb-3">Support</p>
                <div className="flex flex-col gap-2">
                  <Link href="/ask-gasura" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Ask Gasura</Link>
                  <Link href="/auth" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-label text-xs text-on-surface-variant">© 2026 Gasura. All rights reserved.</p>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-base text-secondary">lock</span>
              <span className="font-label text-xs">Bank-grade security standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
