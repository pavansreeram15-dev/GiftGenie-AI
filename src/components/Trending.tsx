import { useState } from 'react';
import { Flame, Star, Diamond, Eye, IndianRupee, Crown, ExternalLink } from 'lucide-react';
import { giftCatalog } from '@/data';
import { getBestPrice, searchUrl } from '@/engine';
import { Stars, Badge } from '@/ui';
import type { GiftProduct } from '@/types';
import { trendingCategories } from '@/data';

const ICONS: Record<string, React.ReactNode> = {
  daily:   <Flame className="w-4 h-4 text-rose-500" />,
  weekly:  <Star className="w-4 h-4 text-warm-500" />,
  festival:<Crown className="w-4 h-4 text-primary-500" />,
  birthday:<Star className="w-4 h-4 text-accent-500" />,
  luxury:  <Diamond className="w-4 h-4 text-primary-500" />,
  budget:  <IndianRupee className="w-4 h-4 text-accent-500" />,
  gems:    <Eye className="w-4 h-4 text-rose-500" />,
};

function filterTrending(cat: string): GiftProduct[] {
  const sorted = [...giftCatalog];
  switch (cat) {
    case 'daily':    return sorted.sort((a, b) => b.trendScore - a.trendScore).slice(0, 8);
    case 'weekly':   return sorted.sort((a, b) => b.popularity - a.popularity).slice(0, 8);
    case 'festival': return sorted.filter((g) => g.occasions.some((o) => ['Diwali','Eid','Pongal','Christmas','New Year','Raksha Bandhan','Festival'].includes(o))).slice(0, 8);
    case 'birthday': return sorted.filter((g) => g.occasions.includes('Birthday')).slice(0, 8);
    case 'luxury':   return sorted.sort((a, b) => getBestPrice(b).price - getBestPrice(a).price).slice(0, 8);
    case 'budget':   return sorted.sort((a, b) => getBestPrice(a).price - getBestPrice(b).price).slice(0, 8);
    case 'gems':     return sorted.sort((a, b) => b.uniqueness - a.uniqueness).slice(0, 8);
    default:         return sorted.slice(0, 8);
  }
}

export function Trending() {
  const [active, setActive] = useState('daily');
  const gifts = filterTrending(active);

  return (
    <section id="trending" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 glass-soft rounded-full px-4 py-1.5 mb-5 text-xs font-bold text-muted-c tracking-widest uppercase">
          <Flame className="w-3.5 h-3.5 text-rose-500" /> Updated daily
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-primary-c mb-3 leading-tight">Trending Gifts</h2>
        <p className="text-secondary-c max-w-sm mx-auto">Curated by what's popular right now across every store.</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2 justify-start sm:justify-center">
        {trendingCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${
              active === c.id ? 'gradient-primary text-white shadow-lg shadow-primary-500/25' : 'glass-soft text-secondary-c hover:text-primary-c'
            }`}
          >
            {ICONS[c.id]} {c.label}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-muted-c mb-7">
        {trendingCategories.find((c) => c.id === active)?.desc}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gifts.map((g, i) => {
          const best = getBestPrice(g);
          return (
            <div
              key={g.id}
              className="glass-card rounded-2xl overflow-hidden animate-fade-up card-lift group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={g.image}
                  alt={g.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 left-2">
                  <Badge color="rose"><Flame className="w-3 h-3" /> {g.trendScore}</Badge>
                </div>
                {g.giftWrapping && (
                  <div className="absolute top-2 right-2">
                    <Badge color="warm">🎁</Badge>
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <h3 className="font-semibold text-sm text-primary-c leading-tight line-clamp-2 mb-2 h-9">{g.name}</h3>
                <Stars rating={g.rating} />
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-display font-extrabold text-primary-c text-sm">₹{best.price.toLocaleString('en-IN')}</span>
                  <a
                    href={searchUrl(best.store, g.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-primary-500 hover:text-primary-c inline-flex items-center gap-0.5 transition"
                    aria-label={`View ${g.name} on ${best.store}`}
                  >
                    {best.store} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
