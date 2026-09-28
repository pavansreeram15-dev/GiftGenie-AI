import { X, Heart, Share2, GitCompare, FileText, Mail, Trash2, ExternalLink, Check } from 'lucide-react';
import { useApp } from '@/store';
import { getBestPrice, searchUrl } from '@/engine';
import { MatchRing, Badge } from '@/ui';
import { useState } from 'react';

export function WishlistDrawer() {
  const { openWishlist, setOpenWishlist, wishlist, toggleWishlist, clearWishlist } = useApp();
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');

  if (!openWishlist) return null;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleShare = async () => {
    const text = wishlist.map((w) => `${w.name} — ₹${getBestPrice(w).price.toLocaleString('en-IN')}`).join('\n');
    if (navigator.share) {
      try { await navigator.share({ title: 'My GiftGenius Wishlist', text }); showToast('Shared!'); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Wishlist copied to clipboard');
    }
  };

  const handleExport = () => {
    const rows = [['Name','Price','Store','Match %','Rating']];
    wishlist.forEach((w) => rows.push([w.name, String(getBestPrice(w).price), getBestPrice(w).store, `${w.matchScore}%`, String(w.rating)]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'giftgenius-wishlist.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('Exported as CSV');
  };

  const handleEmail = () => {
    const subject = 'My GiftGenius Wishlist';
    const body = wishlist.map((w) => `${w.name} — ₹${getBestPrice(w).price.toLocaleString('en-IN')} (${getBestPrice(w).store})`).join('%0D%0A');
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const toggleCompareSelect = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s);
  };

  const compareItems = wishlist.filter((w) => selected.includes(w.id));

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpenWishlist(false)} />
      <div className="relative w-full max-w-md h-full glass border-l border-soft overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 glass border-b border-soft p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-display font-extrabold text-lg text-primary-c">Wishlist</h2>
            <Badge color="rose">{wishlist.length}</Badge>
          </div>
          <button onClick={() => setOpenWishlist(false)} className="w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c hover:text-primary-c transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {wishlist.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-c mx-auto mb-3" />
              <p className="text-secondary-c text-sm">Your wishlist is empty.</p>
              <p className="text-xs text-muted-c mt-1">Tap the heart on any gift to save it here.</p>
            </div>
          )}

          {wishlist.map((w) => {
            const best = getBestPrice(w);
            const isSel = selected.includes(w.id);
            return (
              <div key={w.id} className={`glass-soft rounded-2xl p-3 flex gap-3 ${compareMode ? (isSel ? 'ring-2 ring-primary-500' : '') : ''}`}>
                {compareMode && (
                  <button onClick={() => toggleCompareSelect(w.id)} className={`w-5 h-5 rounded-md shrink-0 mt-1 flex items-center justify-center transition ${isSel ? 'gradient-primary text-white' : 'bg-track'}`}>
                    {isSel && <Check className="w-3 h-3" />}
                  </button>
                )}
                <img src={w.image} alt={w.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-primary-c leading-tight line-clamp-2">{w.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-bold text-sm text-primary-c">₹{best.price.toLocaleString('en-IN')}</span>
                    <MatchRing score={w.matchScore} size={32} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a href={searchUrl(best.store, w.name)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-primary-c inline-flex items-center gap-1">View <ExternalLink className="w-3 h-3" /></a>
                    <button onClick={() => toggleWishlist(w)} className="text-[11px] font-semibold text-rose-500 inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* compare view */}
          {compareMode && compareItems.length >= 2 && (
            <div className="glass rounded-2xl p-4 animate-fade-in">
              <h3 className="font-bold text-sm text-primary-c mb-3">Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-muted-c"><th className="text-left py-1.5">Metric</th>{compareItems.map((c) => <th key={c.id} className="text-center py-1.5 font-semibold text-primary-c max-w-[90px]">{c.name.slice(0, 18)}…</th>)}</tr></thead>
                  <tbody className="text-secondary-c">
                    <tr className="border-t border-soft"><td className="py-1.5">Price</td>{compareItems.map((c) => <td key={c.id} className="text-center">₹{getBestPrice(c).price.toLocaleString('en-IN')}</td>)}</tr>
                    <tr className="border-t border-soft"><td className="py-1.5">Match</td>{compareItems.map((c) => <td key={c.id} className="text-center font-bold text-accent-600">{c.matchScore}%</td>)}</tr>
                    <tr className="border-t border-soft"><td className="py-1.5">Rating</td>{compareItems.map((c) => <td key={c.id} className="text-center">{c.rating}★</td>)}</tr>
                    <tr className="border-t border-soft"><td className="py-1.5">Uniqueness</td>{compareItems.map((c) => <td key={c.id} className="text-center">{c.uniqueness}</td>)}</tr>
                    <tr className="border-t border-soft"><td className="py-1.5">Delivery</td>{compareItems.map((c) => <td key={c.id} className="text-center">{getBestPrice(c).deliveryDays}d</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* footer actions */}
        {wishlist.length > 0 && (
          <div className="sticky bottom-0 glass border-t border-soft p-4 grid grid-cols-2 gap-2">
            <button onClick={() => { setCompareMode((v) => !v); setSelected([]); }} className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition ${compareMode ? 'gradient-primary text-white' : 'glass-soft text-secondary-c'}`}>
              <GitCompare className="w-4 h-4" /> Compare
            </button>
            <button onClick={handleShare} className="flex items-center justify-center gap-1.5 glass-soft text-secondary-c text-xs font-semibold py-2.5 rounded-xl hover:text-primary-c transition">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={handleExport} className="flex items-center justify-center gap-1.5 glass-soft text-secondary-c text-xs font-semibold py-2.5 rounded-xl hover:text-primary-c transition">
              <FileText className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={handleEmail} className="flex items-center justify-center gap-1.5 glass-soft text-secondary-c text-xs font-semibold py-2.5 rounded-xl hover:text-primary-c transition">
              <Mail className="w-4 h-4" /> Email
            </button>
            <button onClick={clearWishlist} className="col-span-2 flex items-center justify-center gap-1.5 text-rose-500 text-xs font-semibold py-2.5 rounded-xl hover:bg-rose-500/10 transition">
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 gradient-primary text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl animate-scale-in z-[101]">
          {toast}
        </div>
      )}
    </div>
  );
}
