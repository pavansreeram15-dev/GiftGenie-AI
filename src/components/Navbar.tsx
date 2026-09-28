import { useState } from 'react';
import { Sparkles, Heart, MessageCircle, Gift, Menu, X } from 'lucide-react';
import { useApp } from '@/store';

export function Navbar({ onStart }: { onStart: () => void }) {
  const { wishlist, setOpenWishlist, setOpenChat } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Gift className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-extrabold text-lg text-primary-c">GiftGenie</div>
            <div className="text-[10px] text-muted-c font-bold tracking-[0.2em] -mt-0.5">AI</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-secondary-c">
          <a href="#how" className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-primary-c transition">How it works</a>
          <a href="#trending" className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-primary-c transition">Trending</a>
          <a href="#testimonials" className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-primary-c transition">Reviews</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenChat(true)}
            className="w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c hover:text-primary-c transition"
            aria-label="AI Assistant"
          >
            <MessageCircle className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setOpenWishlist(true)}
            className="relative w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c hover:text-rose-500 transition"
            aria-label="Saved Gifts"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 gradient-rose text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {wishlist.length}
              </span>
            )}
          </button>
          <button
            onClick={onStart}
            className="hidden sm:flex items-center gap-1.5 gradient-primary text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" /> Find My Gift
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass rounded-2xl mx-0 mt-2 px-5 py-4 flex flex-col gap-2 max-w-6xl mx-auto animate-fade-in md:hidden">
          <a href="#how" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-white/5 text-secondary-c text-sm font-medium transition">How it works</a>
          <a href="#trending" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-white/5 text-secondary-c text-sm font-medium transition">Trending</a>
          <a href="#testimonials" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-white/5 text-secondary-c text-sm font-medium transition">Reviews</a>
          <button onClick={() => { onStart(); setMobileOpen(false); }} className="flex items-center justify-center gap-2 gradient-primary text-white font-bold py-3 rounded-xl mt-1 shadow-lg shadow-primary-500/25">
            <Sparkles className="w-4 h-4" /> Find My Gift
          </button>
        </div>
      )}
    </header>
  );
}
