import { useState, useCallback } from 'react';
import { AppProvider } from '@/store';
import { Navbar } from '@/components/Navbar';
import { Hero, HowItWorks, Testimonials } from '@/components/Home';
import { Trending } from '@/components/Trending';
import { Wizard, ProcessingScreen } from '@/components/Wizard';
import { Results } from '@/components/Results';
import { WishlistDrawer } from '@/components/Wishlist';
import { Chatbot } from '@/components/Chatbot';
import { Gift, Sparkles, Heart } from 'lucide-react';
import type { Recommendation } from '@/types';

type View = 'home' | 'wizard' | 'processing' | 'results';

function AppShell() {
  const [view, setView] = useState<View>('home');
  const [recs, setRecs] = useState<Recommendation[]>([]);

  const startWizard = useCallback(() => setView('wizard'), []);
  const goToTrending = useCallback(() => {
    setView('home');
    setTimeout(() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const handleComplete = useCallback((r: Recommendation[]) => {
    setRecs(r);
    setView('processing');
  }, []);

  const handleProcessed = useCallback(() => setView('results'), []);

  return (
    <div className="min-h-screen">
      {view !== 'wizard' && view !== 'processing' && (
        <Navbar onStart={startWizard} />
      )}

      {view === 'home' && (
        <>
          <Hero onStart={startWizard} onTrending={goToTrending} />
          <HowItWorks onStart={startWizard} />
          <Trending />
          <Testimonials />
          <Footer onStart={startWizard} />
        </>
      )}

      {view === 'wizard' && (
        <Wizard onComplete={handleComplete} onBack={() => setView('home')} />
      )}

      {view === 'processing' && (
        <ProcessingScreen onDone={handleProcessed} />
      )}

      {view === 'results' && (
        <Results recs={recs} onRestart={startWizard} onBack={() => setView('home')} />
      )}

      <WishlistDrawer />
      <Chatbot />
    </div>
  );
}

function Footer({ onStart }: { onStart: () => void }) {
  return (
    <footer className="relative py-20 px-4 border-t border-soft overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(124,77,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* CTA */}
        <div className="glass-card rounded-3xl p-10 sm:p-14 text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-soft rounded-full px-4 py-1.5 mb-6 text-xs font-bold text-secondary-c tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" /> AI-Powered Gifting
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-primary-c mb-4 leading-tight">
            Give them something<br />
            <span className="gradient-text animate-gradient-shift" style={{ backgroundSize: '200%' }}>they'll actually love.</span>
          </h2>
          <p className="text-secondary-c max-w-md mx-auto mb-8">
            Stop guessing. Let GiftGenie AI search every major Indian store and find the perfect gift for any person, any occasion.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-primary-500/35 hover:shadow-primary-500/55 hover:scale-[1.04] active:scale-95 transition text-base"
          >
            <Gift className="w-5 h-5" /> Find My Gift Now
          </button>
        </div>

        {/* Footer bottom */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-lg">
              <Gift className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-primary-c">GiftGenie</span>
              <span className="font-display font-extrabold text-lg gradient-text ml-1">AI</span>
            </div>
          </div>
          <p className="text-sm text-secondary-c max-w-md mx-auto mb-3">
            AI-powered gift recommendations across India's top stores.
            Find the perfect gift for every person and occasion.
          </p>
          <p className="text-xs text-muted-c flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> · Prices and availability are illustrative. Always verify at the store.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
