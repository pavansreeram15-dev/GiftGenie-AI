import { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, ExternalLink, Zap, Gift, Brain, Star } from 'lucide-react';
import { searchUrl } from '@/engine';
import { partnerBrands, testimonials } from '@/data';

/* ─── Real SVG brand logos ───────────────────────────── */

function AmazonLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 30" width="64" height="20" aria-label="Amazon" className={className}>
      <text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#FF9900" letterSpacing="-1">amazon</text>
      <path d="M4 28 Q35 36 66 28" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <polygon points="64,25 68,28 64,31" fill="#FF9900"/>
    </svg>
  );
}

function FlipkartLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 36" width="76" height="23" aria-label="Flipkart" className={className}>
      <rect x="0" y="6" width="24" height="22" rx="3" fill="#FFE500"/>
      <path d="M5 6 Q5 0 12 0 Q19 0 19 6" stroke="#2874F0" strokeWidth="2.5" fill="none"/>
      <circle cx="7.5" cy="6" r="1.5" fill="#E0A800"/>
      <circle cx="16.5" cy="6" r="1.5" fill="#E0A800"/>
      <text x="2" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="#2874F0">f</text>
      <text x="30" y="26" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="18" fill="#2874F0">Flipkart</text>
    </svg>
  );
}

function MyntraLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 30" width="70" height="23" aria-label="Myntra" className={className}>
      <text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="22" fill="#FF3F6C" letterSpacing="0.5">myntra</text>
    </svg>
  );
}

function NykaaLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 115 30" width="72" height="19" aria-label="Nykaa" className={className}>
      <text x="2" y="23" fontFamily="Georgia, serif" fontWeight="900" fontSize="23" fill="#FC2779" fontStyle="italic" letterSpacing="0.5">NYKAA</text>
    </svg>
  );
}

function AjioLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 30" width="52" height="22" aria-label="AJIO" className={className}>
      <text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="24" fill="#F4D000" letterSpacing="2">AJIO</text>
    </svg>
  );
}

function CromaLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 30" width="62" height="23" aria-label="Croma" className={className}>
      <text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="23" fill="#5CB85C" letterSpacing="0.5">Croma</text>
    </svg>
  );
}

function RelianceDigitalLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 30" width="94" height="21" aria-label="Reliance Digital" className={className}>
      <text x="0" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="#FFFFFF" letterSpacing="0.3">Reliance</text>
      <text x="76" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="#0074D9" letterSpacing="0.3">Digital</text>
    </svg>
  );
}

function getStoreLogo(store: string) {
  switch (store) {
    case 'Amazon': return <AmazonLogo />;
    case 'Flipkart': return <FlipkartLogo />;
    case 'Myntra': return <MyntraLogo />;
    case 'Nykaa': return <NykaaLogo />;
    case 'Ajio': return <AjioLogo />;
    case 'Croma': return <CromaLogo />;
    case 'Reliance Digital': return <RelianceDigitalLogo />;
    default: return <AmazonLogo />;
  }
}

const a = 'https://images.pexels.com/photos';

/* ─── Hero Card Types ────────────────────────────────── */

interface HeroProductCardData {
  type: 'product';
  name: string;
  store: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  badge?: string;
  category: string;
  tilt: string;
}

interface HeroAiCardData {
  type: 'ai';
  badge: string;
  quote: string;
  vibe: string;
  match: string;
  tilt: string;
}

type HeroCardData = HeroProductCardData | HeroAiCardData;

/* ─── 5 Curated Streams for Seamless Infinite Drift ─── */

const STREAM_1: HeroCardData[] = [
  {
    type: 'product',
    name: 'AuraSound Pro ANC Headphones',
    store: 'Amazon',
    price: 8999,
    originalPrice: 12999,
    image: `${a}/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.8,
    badge: '35h Battery',
    category: 'Audio • Tech',
    tilt: 'rotate(-2.5deg)',
  },
  {
    type: 'ai',
    badge: 'GIFTGENIE AI',
    quote: 'Perfect for your best friend',
    vibe: 'Gaming • Tech • Under ₹3,000',
    match: '99% Match',
    tilt: 'rotate(2deg)',
  },
  {
    type: 'product',
    name: 'Strider Pro Running Sneakers',
    store: 'Myntra',
    price: 2499,
    originalPrice: 3999,
    image: `${a}/19845610/pexels-photo-19845610.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.6,
    badge: '38% OFF',
    category: 'Footwear • Fashion',
    tilt: 'rotate(-1.5deg)',
  },
  {
    type: 'product',
    name: '70mai Pro Plus+ Ultra HD Dash Cam',
    store: 'Flipkart',
    price: 4799,
    originalPrice: 6999,
    image: `${a}/248747/pexels-photo-248747.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.7,
    badge: 'Sony Sensor',
    category: 'Cars • Tech',
    tilt: 'rotate(3deg)',
  },
];

const STREAM_2: HeroCardData[] = [
  {
    type: 'product',
    name: 'PulseFit Smartwatch Series 7',
    store: 'Flipkart',
    price: 10999,
    originalPrice: 15999,
    image: `${a}/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.7,
    badge: 'AMOLED GPS',
    category: 'Fitness • Tech',
    tilt: 'rotate(3deg)',
  },
  {
    type: 'product',
    name: 'MagFlow 3-in-1 Fast Wireless Charger',
    store: 'Amazon',
    price: 1699,
    originalPrice: 2999,
    image: `${a}/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.6,
    badge: 'Foldable MagSafe',
    category: 'Desk • Gadget',
    tilt: 'rotate(-3deg)',
  },
  {
    type: 'ai',
    badge: 'BIRTHDAY SPECIAL',
    quote: "Something they'll cherish forever",
    vibe: 'Handpicked with sentiment',
    match: 'Top Pick',
    tilt: 'rotate(1.5deg)',
  },
  {
    type: 'product',
    name: 'Glow Ritual Korean Glass Skin Set',
    store: 'Nykaa',
    price: 1799,
    originalPrice: 2499,
    image: `${a}/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.7,
    badge: '5-Step Care',
    category: 'Skincare • Beauty',
    tilt: 'rotate(-2deg)',
  },
];

const STREAM_3: HeroCardData[] = [
  {
    type: 'product',
    name: 'Mi Smart LED Desk Lamp',
    store: 'Croma',
    price: 1899,
    originalPrice: 2499,
    image: `${a}/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.6,
    badge: 'Eye Care Light',
    category: 'Lighting • Tech',
    tilt: 'rotate(-2deg)',
  },
  {
    type: 'ai',
    badge: 'ZERO GUESSWORK',
    quote: 'Curated across 8+ verified Indian stores',
    vibe: 'Real-time price comparison',
    match: 'Best Price',
    tilt: 'rotate(2.5deg)',
  },
  {
    type: 'product',
    name: 'Kindle Paperwhite 16GB Warm Light',
    store: 'Amazon',
    price: 14999,
    image: `${a}/8207315/pexels-photo-8207315.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.9,
    badge: '300 PPI Waterproof',
    category: 'Books • Tech',
    tilt: 'rotate(-3deg)',
  },
  {
    type: 'product',
    name: 'Élixir Noir Luxury Unisex EDP',
    store: 'Nykaa',
    price: 4999,
    originalPrice: 6500,
    image: `${a}/11482458/pexels-photo-11482458.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.8,
    badge: '14h Long Lasting',
    category: 'Luxury • Fragrance',
    tilt: 'rotate(1.8deg)',
  },
];

const STREAM_4: HeroCardData[] = [
  {
    type: 'product',
    name: 'KeyForge RGB Mechanical Keyboard',
    store: 'Amazon',
    price: 5499,
    originalPrice: 7999,
    image: `${a}/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.7,
    badge: 'Hot-Swap Switches',
    category: 'Gaming • Coding',
    tilt: 'rotate(2.8deg)',
  },
  {
    type: 'ai',
    badge: 'BUDGET INTELLIGENCE',
    quote: "Thoughtful doesn't have to be expensive",
    vibe: 'Hidden gems under ₹2,000',
    match: 'High Value',
    tilt: 'rotate(-2deg)',
  },
  {
    type: 'product',
    name: 'Steelbird SBA-2 Racing Helmet',
    store: 'Amazon',
    price: 2199,
    originalPrice: 2999,
    image: `${a}/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.6,
    badge: 'Anti-Fog Visor',
    category: 'Bike • Rider',
    tilt: 'rotate(2deg)',
  },
  {
    type: 'product',
    name: 'Smart Hydroponic Indoor Herb Garden',
    store: 'Amazon',
    price: 2999,
    originalPrice: 4500,
    image: `${a}/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.8,
    badge: 'LED Grow Lights',
    category: 'Plants • Kitchen',
    tilt: 'rotate(-3deg)',
  },
];

const STREAM_5: HeroCardData[] = [
  {
    type: 'product',
    name: 'Apple AirTag 4-Pack Smart Trackers',
    store: 'Amazon',
    price: 10490,
    originalPrice: 11900,
    image: `${a}/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.8,
    badge: 'Precision Finding',
    category: 'Gadgets • Travel',
    tilt: 'rotate(-2deg)',
  },
  {
    type: 'product',
    name: 'SS Ton Kashmir Willow Cricket Bat',
    store: 'Amazon',
    price: 3999,
    originalPrice: 5500,
    image: `${a}/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.7,
    badge: 'Match Ready',
    category: 'Sports • Cricket',
    tilt: 'rotate(3deg)',
  },
  {
    type: 'ai',
    badge: 'SENTIMENT ANALYSIS',
    quote: 'Matches their personality & creative vibe',
    vibe: 'Taste profile mapped in 10s',
    match: 'Instant Fit',
    tilt: 'rotate(-1.5deg)',
  },
  {
    type: 'product',
    name: 'Marshall Emberton II Bluetooth Speaker',
    store: 'Amazon',
    price: 14999,
    originalPrice: 17999,
    image: `${a}/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    rating: 4.9,
    badge: '30h Iconic Sound',
    category: 'Music • Luxury',
    tilt: 'rotate(2.2deg)',
  },
];

/* ─── Hero Card Item Component ───────────────────────── */

function HeroCardItem({ card }: { card: HeroCardData }) {
  if (card.type === 'ai') {
    return (
      <div
        className="hero-card-hover rounded-2xl p-4 sm:p-5 select-none"
        style={{
          transform: card.tilt,
          background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.16) 0%, rgba(14, 14, 28, 0.92) 55%, rgba(77, 255, 212, 0.1) 100%)',
          border: '1px solid rgba(124, 77, 255, 0.35)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/20 border border-primary-500/35">
            <Sparkles className="w-3 h-3 text-accent-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-wider uppercase text-accent-400">{card.badge}</span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md gradient-primary text-white shadow-sm">
            {card.match}
          </span>
        </div>
        <p className="font-display font-extrabold text-sm sm:text-base text-white leading-snug mt-1">
          "{card.quote}"
        </p>
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-secondary-c font-medium">
          <span>{card.vibe}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-ping" />
        </div>
      </div>
    );
  }

  const directUrl = searchUrl(card.store, card.name);

  return (
    <div
      className="hero-card-hover rounded-2xl p-3 sm:p-3.5 flex flex-col group select-none relative overflow-hidden"
      style={{
        transform: card.tilt,
        background: 'linear-gradient(145deg, rgba(16, 16, 28, 0.88) 0%, rgba(8, 8, 16, 0.94) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 14px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top store badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
          {getStoreLogo(card.store)}
        </div>
        {card.badge && (
          <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-warm-500/15 text-warm-400 border border-warm-500/25">
            {card.badge}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-black/40">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="font-display text-sm font-extrabold text-white">
            ₹{card.price.toLocaleString('en-IN')}
          </span>
          {card.originalPrice && (
            <span className="text-[10px] text-muted-c line-through">
              ₹{card.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Info & Direct Store Link */}
      <div>
        <h4 className="font-display text-xs font-bold text-white line-clamp-1 group-hover:text-primary-300 transition-colors">
          {card.name}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-muted-c mt-0.5 mb-2">
          <span>{card.category}</span>
          <span className="flex items-center gap-0.5 text-warm-400 font-bold">
            <Star className="w-2.5 h-2.5 fill-warm-400 text-warm-400" />
            {card.rating}
          </span>
        </div>

        {/* Direct Product Link Button */}
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-primary-500/20 text-[11px] font-bold text-accent-400 hover:text-white transition-all border border-white/10 hover:border-primary-500/40 cursor-pointer shadow-sm"
          title={`Open direct search for ${card.name} on ${card.store}`}
        >
          <span>Shop on {card.store}</span>
          <ExternalLink className="w-3 h-3 text-accent-400 ml-1 shrink-0" />
        </a>
      </div>
    </div>
  );
}

/* ─── Hero Main Component ────────────────────────────── */

export function Hero({ onStart, onTrending }: { onStart: () => void; onTrending: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 6, ry: -2 });

  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        setParallax({
          x: Math.round(dx * 20),
          y: Math.round(dy * 14),
        });

        setTilt({
          rx: Number((6 - dy * 5).toFixed(2)),
          ry: Number((-2 + dx * 5).toFixed(2)),
        });
      });
    };

    const handleMouseLeave = () => {
      setParallax({ x: 0, y: 0 });
      setTilt({ rx: 6, ry: -2 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-16 bg-[#03030a]">

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-1/4 left-1/4 w-[750px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(124, 77, 255, 0.16) 0%, transparent 65%)',
            filter: 'blur(90px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute top-2/3 right-1/4 w-[600px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255, 77, 141, 0.12) 0%, transparent 65%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute bottom-10 left-1/2 w-[700px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(77, 255, 212, 0.08) 0%, transparent 65%)',
            filter: 'blur(75px)',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* ─── 3D ANIMATED CARD WALL (Continuously moving field) ─── */}
      <div
        ref={stageRef}
        className="hero-stage-container absolute inset-0 pointer-events-auto overflow-hidden z-1"
      >
        <div
          className="hero-card-wall absolute inset-0 flex justify-between gap-4 sm:gap-6 pointer-events-auto"
          style={{
            width: '124%',
            left: '-12%',
            top: '-25%',
            height: '160%',
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) rotateZ(-1.2deg) translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Stream 1 */}
          <div className="hero-stream-col animate-stream-up-1 flex-1">
            {[...STREAM_1, ...STREAM_1, ...STREAM_1].map((card, idx) => (
              <HeroCardItem key={`s1-${idx}`} card={card} />
            ))}
          </div>

          {/* Stream 2 */}
          <div className="hero-stream-col animate-stream-down-2 flex-1">
            {[...STREAM_2, ...STREAM_2, ...STREAM_2].map((card, idx) => (
              <HeroCardItem key={`s2-${idx}`} card={card} />
            ))}
          </div>

          {/* Stream 3 */}
          <div className="hero-stream-col animate-stream-up-3 flex-1 hidden sm:flex">
            {[...STREAM_3, ...STREAM_3, ...STREAM_3].map((card, idx) => (
              <HeroCardItem key={`s3-${idx}`} card={card} />
            ))}
          </div>

          {/* Stream 4 */}
          <div className="hero-stream-col animate-stream-down-4 flex-1 hidden md:flex">
            {[...STREAM_4, ...STREAM_4, ...STREAM_4].map((card, idx) => (
              <HeroCardItem key={`s4-${idx}`} card={card} />
            ))}
          </div>

          {/* Stream 5 */}
          <div className="hero-stream-col animate-stream-up-5 flex-1 hidden lg:flex">
            {[...STREAM_5, ...STREAM_5, ...STREAM_5].map((card, idx) => (
              <HeroCardItem key={`s5-${idx}`} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* ─── CENTRAL VIGNETTE MASK (Ensures headline is 100% readable while cards flow behind) ─── */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div
          className="w-[950px] max-w-full h-[640px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(3, 3, 10, 0.94) 0%, rgba(3, 3, 10, 0.82) 48%, rgba(3, 3, 10, 0.3) 76%, transparent 100%)',
            filter: 'blur(32px)',
          }}
        />
      </div>

      {/* ─── FOREGROUND EDITORIAL HEADLINE LAYER ─── */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto px-5 py-6">

        {/* Top AI Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 glass-soft border border-primary-500/35 shadow-xl shadow-primary-500/10 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-secondary-c">
            GIFTGENIE AI · INTELLIGENT GIFT ENGINE
          </span>
        </div>

        {/* Oversized Editorial Heading */}
        <div className="overflow-hidden mb-2">
          <h1
            className="font-display font-black tracking-tight text-white hero-word"
            style={{
              fontSize: 'clamp(2.75rem, 7.2vw, 6.4rem)',
              lineHeight: 0.93,
              animationDelay: '60ms',
            }}
          >
            FIND A GIFT
          </h1>
        </div>

        <div className="overflow-hidden mb-2">
          <h1
            className="font-display font-black tracking-tight hero-word"
            style={{
              fontSize: 'clamp(2.75rem, 7.2vw, 6.4rem)',
              lineHeight: 0.93,
              background: 'linear-gradient(110deg, #ffffff 0%, #d4c5ff 35%, #c084fc 60%, #4dffd4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animationDelay: '140ms',
            }}
          >
            THEY'LL ACTUALLY
          </h1>
        </div>

        <div className="overflow-hidden mb-7">
          <h1
            className="font-display font-black tracking-tight text-white hero-word"
            style={{
              fontSize: 'clamp(2.75rem, 7.2vw, 6.4rem)',
              lineHeight: 0.93,
              animationDelay: '220ms',
            }}
          >
            LOVE.
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl text-secondary-c max-w-xl mx-auto mb-10 leading-relaxed font-normal animate-fade-up"
          style={{ animationDelay: '340ms' }}
        >
          Tell us who you're shopping for, what they love, and your budget.
          We'll find thoughtful gifts across stores you already trust.
        </p>

        {/* Action CTAs */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '460ms' }}
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 gradient-primary text-white font-extrabold px-9 py-4 rounded-2xl shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/65 hover:scale-[1.04] active:scale-95 transition-all text-base sm:text-lg cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-accent-400" />
            Find Their Gift
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={onTrending}
            className="inline-flex items-center gap-2 glass-soft text-primary-c font-bold px-7 py-4 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-sm sm:text-base cursor-pointer border border-white/10"
          >
            <TrendingUp className="w-4 h-4 text-accent-400" />
            Explore Trending Ideas
          </button>
        </div>

        {/* Store Trust / Comparison Bar */}
        <div
          className="flex items-center justify-center gap-4 sm:gap-6 mt-12 flex-wrap text-xs text-muted-c font-medium animate-fade-up"
          style={{ animationDelay: '580ms' }}
        >
          <span>Real-time price checks across:</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">Amazon</span>
          <span>•</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">Flipkart</span>
          <span>•</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">Myntra</span>
          <span>•</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">Nykaa</span>
          <span>•</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">AJIO</span>
          <span>•</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">Croma</span>
          <span>•</span>
          <span className="text-secondary-c font-bold hover:text-white transition-colors">Reliance Digital</span>
        </div>

      </div>

    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────── */
export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
          ★★★★★ Reviews
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-primary-c mb-3 leading-tight">Loved by gift-givers</h2>
        <p className="max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Real stories from people who found the perfect present.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="card-lift animate-fade-up"
            style={{
              animationDelay: `${i * 80}ms`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 24,
              padding: '28px',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="text-base mb-4" style={{ color: '#FF9900' }}>★★★★★</div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{ background: 'linear-gradient(135deg, #7c4dff 0%, #c084fc 38%, #ff4d8d 72%, #ffb84d 100%)' }}>
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm text-primary-c">{t.name}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── How it works ───────────────────────────────────── */
export function HowItWorks({ onStart }: { onStart: () => void }) {
  const steps = [
    { icon: <Gift className="w-6 h-6 text-white" />, grad: 'gradient-primary', n: '01', title: 'Tell us about them', desc: 'Relationship, occasion, age, budget. Fill in details about who you\'re gifting.' },
    { icon: <Brain className="w-6 h-6 text-white" />, grad: 'gradient-rose', n: '02', title: 'AI understands them', desc: 'Our engine builds a personality profile and generates gift intent in seconds.' },
    { icon: <Zap className="w-6 h-6 text-white" />, grad: 'gradient-accent', n: '03', title: 'Search real products', desc: 'Searches Amazon, Flipkart, Myntra, Nykaa, AJIO, Croma and more simultaneously.' },
    { icon: <TrendingUp className="w-6 h-6 text-white" />, grad: 'gradient-warm', n: '04', title: 'Compare across stores', desc: 'See the same gift on multiple platforms. Pick the best price or fastest delivery.' },
    { icon: <Sparkles className="w-6 h-6 text-white" />, grad: 'gradient-hero', n: '05', title: 'Choose the perfect gift', desc: 'Every recommendation has AI match scores, pros, cons, and direct store links.' },
  ];

  return (
    <section id="how" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
          Simple &amp; Powerful
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-primary-c mb-3 leading-tight">How it works</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Five steps to a gift they will genuinely love.</p>
      </div>
      <div className="grid md:grid-cols-5 gap-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className="card-lift animate-fade-up relative text-center"
            style={{
              animationDelay: `${i * 100}ms`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 24,
              padding: '28px 20px',
            }}
          >
            <div className="absolute top-4 right-4 font-display text-4xl font-extrabold" style={{ color: 'rgba(255,255,255,0.04)' }}>{s.n}</div>
            <div className={`w-12 h-12 rounded-2xl ${s.grad} flex items-center justify-center mx-auto mb-4 shadow-lg`}>{s.icon}</div>
            <h3 className="font-display font-bold text-sm text-primary-c mb-2 leading-snug">{s.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-[1.03] active:scale-95 transition cursor-pointer"
          style={{ boxShadow: '0 20px 60px rgba(124,77,255,0.3)' }}
        >
          <Sparkles className="w-5 h-5 text-accent-400" /> Find Their Gift Now →
        </button>
      </div>
    </section>
  );
}
