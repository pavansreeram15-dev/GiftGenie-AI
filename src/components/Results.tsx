import { useState } from 'react';
import {
  ArrowLeft, RotateCcw, SlidersHorizontal, Dice5, TrendingUp, Heart, ExternalLink,
  ThumbsUp, ThumbsDown, Sparkles, MessageSquareHeart, Lightbulb, Truck, Gift,
  Check, ChevronDown, Zap, Star, Crown, Gem
} from 'lucide-react';
import type { Recommendation, SortOption } from '@/types';
import { useApp } from '@/store';
import { sortRecommendations, getBestPrice, getStorePrice, surpriseMe, searchUrl } from '@/engine';
import { MatchRing, Meter, Stars, Badge, fireConfetti } from '@/ui';

const SORTS: SortOption[] = [
  'Highest Match','Lowest Price','Trending','Luxury','Most Unique','Fast Delivery','Highest Rated','Best Value',
];

const SORT_ICONS: Record<string, React.ReactNode> = {
  'Highest Match':  <Sparkles className="w-3 h-3" />,
  'Lowest Price':   <Zap className="w-3 h-3" />,
  'Trending':       <TrendingUp className="w-3 h-3" />,
  'Luxury':         <Crown className="w-3 h-3" />,
  'Most Unique':    <Gem className="w-3 h-3" />,
  'Fast Delivery':  <Truck className="w-3 h-3" />,
  'Highest Rated':  <Star className="w-3 h-3" />,
  'Best Value':     <ThumbsUp className="w-3 h-3" />,
};

export function Results({ recs, onRestart, onBack }: { recs: Recommendation[]; onRestart: () => void; onBack: () => void }) {
  const { form } = useApp();
  const [sort, setSort] = useState<SortOption>('Highest Match');
  const [visible, setVisible] = useState<Recommendation[]>(sortRecommendations(recs, sort));
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSort = (s: SortOption) => {
    setSort(s);
    setVisible(sortRecommendations(recs, s));
    setExpanded(null);
  };

  const handleSurprise = () => {
    fireConfetti(50);
    setVisible(surpriseMe());
    setExpanded(null);
  };

  // Direct interest matching segregation
  const hasUserInterests = form.interests.length > 0;
  const matchingGifts = hasUserInterests ? visible.filter((r) => r.matchScore >= 60) : visible;
  const nonMatchingGifts = hasUserInterests ? visible.filter((r) => r.matchScore < 60) : [];

  // Split into sections from true matches
  const perfectMatches = matchingGifts.slice(0, 3);
  const smartAlternatives = matchingGifts.slice(3, 6);
  const moreOptions = matchingGifts.slice(6);

  const budgetStr = `₹${form.budget.toLocaleString('en-IN')}`;
  const forWhom = form.relationship || 'them';
  const occasion = form.occasion ? ` · ${form.occasion}` : '';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
      {/* ─── Cinematic Neural Noise Video Background ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-72 scale-105"
          style={{ filter: 'brightness(0.75) contrast(1.2) saturate(1.25)' }}
        >
          <source src="/backgrounds/neural-noise.mp4" type="video/mp4" />
          <source src="https://cloud.motion.page/downloads/backgrounds/neural-noise.mp4" type="video/mp4" />
        </video>

        {/* Ambient Darkened Gradient Masks for Pristine Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03030a]/75 via-[#03030a]/42 to-[#03030a]/85" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 25%, transparent 28%, rgba(3,3,10,0.58) 70%, rgba(3,3,10,0.92) 100%)',
          }}
        />

        {/* Subtle ethereal light rays & purple nebula glow complementing neural noise */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary-500/18 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 glass-soft rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary-c hover:text-primary-c transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center flex-1 min-w-[200px]">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-c mb-1">
              Here are some gifts we'd pick for{' '}
              <span className="gradient-text">{forWhom}</span>.
            </h1>
            <p className="text-xs text-secondary-c">
              Based on their interests, your occasion, and your {budgetStr} budget{occasion}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSurprise}
              className="inline-flex items-center gap-1.5 glass-soft rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary-c hover:text-rose-500 transition"
            >
              <Dice5 className="w-4 h-4" /> Surprise
            </button>
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 gradient-primary text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.03] active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" /> New Search
            </button>
          </div>
        </div>

        {/* ── Sort bar ── */}
        <div className="glass rounded-2xl p-3 mb-10 flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal className="w-4 h-4 text-muted-c shrink-0 ml-1" />
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => handleSort(s)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                sort === s ? 'gradient-primary text-white shadow-md' : 'text-secondary-c hover:bg-white/5'
              }`}
            >
              {SORT_ICONS[s]} {s}
            </button>
          ))}
        </div>

        {/* ── Perfect Matches ── */}
        {perfectMatches.length > 0 && (
          <ResultSection label="PERFECT MATCHES" icon={<Sparkles className="w-4 h-4 text-warm-500" />} color="from-warm-500/10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {perfectMatches.map((rec, i) => (
                <RecCard key={rec.id} rec={rec} delay={i * 60} expanded={expanded === rec.id} onExpand={() => setExpanded(expanded === rec.id ? null : rec.id)} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* ── Smart Alternatives ── */}
        {smartAlternatives.length > 0 && (
          <ResultSection label="SMART ALTERNATIVES" icon={<Zap className="w-4 h-4 text-accent-500" />} color="from-accent-500/10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {smartAlternatives.map((rec, i) => (
                <RecCard key={rec.id} rec={rec} delay={i * 60} expanded={expanded === rec.id} onExpand={() => setExpanded(expanded === rec.id ? null : rec.id)} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* ── More Options ── */}
        {moreOptions.length > 0 && (
          <ResultSection label="MORE OPTIONS" icon={<TrendingUp className="w-4 h-4 text-primary-500" />} color="from-primary-500/10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {moreOptions.map((rec, i) => (
                <RecCard key={rec.id} rec={rec} delay={i * 60} expanded={expanded === rec.id} onExpand={() => setExpanded(expanded === rec.id ? null : rec.id)} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* ── Universal Alternatives (only if few direct matches) ── */}
        {hasUserInterests && matchingGifts.length < 6 && nonMatchingGifts.length > 0 && (
          <ResultSection label="POPULAR UNIVERSAL PICKS" icon={<Gift className="w-4 h-4 text-secondary-c" />} color="from-white/10">
            <p className="text-xs text-secondary-c mb-4">Thoughtful alternatives based on their age and occasion:</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nonMatchingGifts.slice(0, 3).map((rec, i) => (
                <RecCard key={rec.id} rec={rec} delay={i * 60} expanded={expanded === rec.id} onExpand={() => setExpanded(expanded === rec.id ? null : rec.id)} />
              ))}
            </div>
          </ResultSection>
        )}

        {matchingGifts.length === 0 && nonMatchingGifts.length === 0 && (
          <div className="glass rounded-3xl p-14 text-center">
            <Gift className="w-14 h-14 text-muted-c mx-auto mb-4" />
            <p className="text-secondary-c text-lg font-semibold mb-2">No gifts matched your criteria.</p>
            <p className="text-muted-c text-sm">Try adjusting your budget, interests, or click Surprise Me!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultSection({ label, icon, color, children }: {
  label: string; icon: React.ReactNode; color: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-14">
      <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-gradient-to-r ${color} to-transparent border border-white/5`}>
        {icon}
        <span className="text-xs font-black tracking-widest text-secondary-c">{label}</span>
      </div>
      {children}
    </div>
  );
}

function RecCard({ rec, delay, expanded, onExpand }: {
  rec: Recommendation; delay: number; expanded: boolean; onExpand: () => void;
}) {
  const { inWishlist, toggleWishlist } = useApp();
  const saved = inWishlist(rec.id);
  const best = getBestPrice(rec);
  const maxPrice = Math.max(...rec.prices.map((p) => p.price));
  const discount = maxPrice > best.price ? Math.round(((maxPrice - best.price) / maxPrice) * 100) : 0;
  const [showCompare, setShowCompare] = useState(false);

  return (
    <div
      className="glass-card rounded-3xl overflow-hidden flex flex-col card-lift animate-fade-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={rec.image}
          alt={rec.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {discount > 0 && (
            <span className="gradient-rose text-white text-[10px] font-black px-2.5 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
          {best.prime && (
            <span className="bg-warm-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
              Prime
            </span>
          )}
          {rec.giftWrapping && (
            <span className="bg-white/90 text-primary-700 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
              <Gift className="w-3 h-3" /> Gift Wrap
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(rec)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 ${
            saved ? 'gradient-rose text-white shadow-lg' : 'bg-black/40 backdrop-blur-md text-white/70 hover:text-rose-400'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4.5 h-4.5 ${saved ? 'fill-white' : ''}`} />
        </button>

        {/* Match ring */}
        <div className="absolute bottom-3 right-3">
          <MatchRing score={rec.matchScore} size={56} />
        </div>

        {/* Store + trend */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <Badge color="neutral"><TrendingUp className="w-3 h-3" /> {rec.trendScore}</Badge>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Store badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black tracking-widest text-muted-c uppercase">{best.store}</span>
          <span className="text-muted-c">·</span>
          <Stars rating={rec.rating} />
          <span className="text-xs text-secondary-c">{rec.rating}</span>
          <span className="text-xs text-muted-c">({rec.reviews.toLocaleString('en-IN')})</span>
        </div>

        <h3 className="font-display font-bold text-base text-primary-c leading-snug mb-3">{rec.name}</h3>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="font-display text-2xl font-extrabold text-primary-c">₹{best.price.toLocaleString('en-IN')}</span>
          {discount > 0 && (
            <span className="text-sm text-muted-c line-through mb-0.5">₹{maxPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Meters */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <Meter value={rec.happinessMeter} label="Happiness" color="rose" />
          <Meter value={rec.compatibilityScore} label="Compatibility" color="accent" />
          <Meter value={rec.uniqueness} label="Uniqueness" color="warm" />
          <Meter value={rec.socialPopularity} label="Popularity" color="primary" />
        </div>

        {/* AI explanation */}
        <div className="glass-soft rounded-2xl p-3.5 mb-4 flex gap-2.5">
          <Sparkles className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
          <p className="text-xs text-secondary-c leading-relaxed">{rec.explanation}</p>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-black text-accent-500 mb-1.5">
              <ThumbsUp className="w-3 h-3" /> Pros
            </div>
            <ul className="space-y-1">
              {rec.pros.map((p) => (
                <li key={p} className="text-[10px] text-secondary-c flex gap-1">
                  <Check className="w-3 h-3 text-accent-500 shrink-0 mt-0.5" />{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10px] font-black text-rose-500 mb-1.5">
              <ThumbsDown className="w-3 h-3" /> Cons
            </div>
            <ul className="space-y-1">
              {rec.cons.map((c) => (
                <li key={c} className="text-[10px] text-secondary-c flex gap-1">
                  <span className="text-rose-500 shrink-0">✕</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <Badge color="neutral">Age: {rec.suitableAges}</Badge>
          <Badge color="primary"><Truck className="w-3 h-3" /> {best.deliveryDays}d delivery</Badge>
          <Badge color="accent">😊 {rec.emotionPrediction}</Badge>
        </div>

        {/* Expandable */}
        {expanded && (
          <div className="space-y-3 mb-5 animate-fade-in">
            <div className="glass-soft rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-c mb-2">
                <MessageSquareHeart className="w-3.5 h-3.5" /> Conversation Starter
              </div>
              <p className="text-xs text-secondary-c italic">"{rec.conversationStarter}"</p>
            </div>
            <div className="glass-soft rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-c mb-2">
                <Lightbulb className="w-3.5 h-3.5" /> Gift Story
              </div>
              <p className="text-xs text-secondary-c italic">{rec.story}</p>
            </div>

            {/* Price comparison */}
            <div className="glass-soft rounded-2xl p-4">
              <button
                onClick={() => setShowCompare((v) => !v)}
                className="w-full flex items-center justify-between text-xs font-bold text-primary-c"
              >
                <span>Compare prices across stores</span>
                <ChevronDown className={`w-4 h-4 transition ${showCompare ? 'rotate-180' : ''}`} />
              </button>
              {showCompare && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {rec.prices.map((p) => {
                    const isBest = p.store === best.store;
                    return (
                      <div
                        key={p.store}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                          isBest ? 'bg-accent-500/10 border border-accent-500/25' : 'bg-white/4'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary-c">{p.store}</span>
                          {p.prime && <span className="text-[9px] bg-warm-500 text-white px-1.5 py-0.5 rounded-full font-black">Prime</span>}
                          {isBest && <span className="text-[9px] gradient-accent text-white px-1.5 py-0.5 rounded-full font-black">Best Deal</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-primary-c">₹{p.price.toLocaleString('en-IN')}</span>
                          <a
                            href={searchUrl(p.store, rec.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-c hover:text-primary-c transition"
                            aria-label={`View on ${p.store}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                  <PriceHistory basePrice={best.price} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onExpand}
            className="text-xs font-bold text-primary-c px-3 py-2.5 rounded-xl glass-soft hover:scale-[1.02] transition flex items-center gap-1"
          >
            {expanded ? 'Less' : 'Details'}
            <ChevronDown className={`w-3.5 h-3.5 transition ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <a
            href={searchUrl(best.store, rec.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 gradient-primary text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-95 transition"
          >
            View Product <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function PriceHistory({ basePrice }: { basePrice: number }) {
  const points = [0.95, 0.9, 0.97, 1.0, 0.87, 0.92, 0.85].map((f) => Math.round(basePrice * f));
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 220; const h = 48;
  const stepX = w / (points.length - 1);
  const coords = points.map((p, i) => `${i * stepX},${h - ((p - min) / (max - min || 1)) * h}`);
  const poly = coords.join(' ');
  const area = `0,${h} ${poly} ${w},${h}`;
  return (
    <div className="pt-2">
      <div className="flex justify-between text-[10px] text-muted-c mb-1.5">
        <span>Price trend (7d)</span>
        <span className="text-accent-500 font-bold">↓ {Math.round(((max - min) / max) * 100)}% low</span>
      </div>
      <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polygon points={area} fill="rgba(0,212,170,0.12)" />
        <polyline points={poly} fill="none" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
