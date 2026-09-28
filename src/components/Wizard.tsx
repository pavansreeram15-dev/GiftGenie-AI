import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Sparkles,
  Dice5,
  Brain,
  X,
  Zap,
  ShoppingBag,
  Gift,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/store';
import { recommend, surpriseMe } from '@/engine';
import { giftCatalog } from '@/data';
import type { Recommendation, WizardForm, Relationship, Occasion, Gender, Store } from '@/types';
import { fireConfetti } from '@/ui';
import { CinematicBackground, resolveCinematicTheme } from './CinematicBackground';

/* ─── Real Brand Logos ───────────────────────────────────────────── */

function AmazonLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 30" width="70" height="22" aria-label="Amazon" className={className}>
      <text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#FF9900" letterSpacing="-1">amazon</text>
      <path d="M4 28 Q35 36 66 28" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="64,25 68,28 64,31" fill="#FF9900" />
    </svg>
  );
}

function FlipkartLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 36" width="76" height="23" aria-label="Flipkart" className={className}>
      <rect x="0" y="6" width="24" height="22" rx="3" fill="#FFE500" />
      <path d="M5 6 Q5 0 12 0 Q19 0 19 6" stroke="#2874F0" strokeWidth="2.5" fill="none" />
      <circle cx="7.5" cy="6" r="1.5" fill="#E0A800" />
      <circle cx="16.5" cy="6" r="1.5" fill="#E0A800" />
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
    <svg viewBox="0 0 115 30" width="74" height="20" aria-label="Nykaa" className={className}>
      <text x="2" y="23" fontFamily="Georgia, serif" fontWeight="900" fontSize="23" fill="#FC2779" fontStyle="italic" letterSpacing="0.5">NYKAA</text>
    </svg>
  );
}

function AjioLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 30" width="54" height="22" aria-label="AJIO" className={className}>
      <text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="24" fill="#F4D000" letterSpacing="2">AJIO</text>
    </svg>
  );
}

function CromaLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 30" width="64" height="23" aria-label="Croma" className={className}>
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

function MeeshoLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 30" width="76" height="23" aria-label="Meesho" className={className}>
      <text x="0" y="23" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="22" fill="#F43397" letterSpacing="0.5">meesho</text>
    </svg>
  );
}

/* ─── Rich Option Definitions ────────────────────────────────────── */

interface RelationshipCard {
  id: Relationship;
  emoji: string;
  tagline: string;
}

const RELATIONSHIP_OPTIONS: RelationshipCard[] = [
  { id: 'Best Friend', emoji: '🤝', tagline: 'Your ride or die through everything' },
  { id: 'Girlfriend', emoji: '💖', tagline: 'Romantic, sweet & deeply thoughtful' },
  { id: 'Boyfriend', emoji: '💙', tagline: 'Fun, cherished & personalized surprises' },
  { id: 'Wife', emoji: '💍', tagline: 'Treasured, elegant & unforgettable' },
  { id: 'Husband', emoji: '🎩', tagline: 'Meaningful, sleek & stylish' },
  { id: 'Mother', emoji: '🌸', tagline: 'Pure love, warmth & heartfelt care' },
  { id: 'Father', emoji: '👔', tagline: 'Strength, respect & timeless utility' },
  { id: 'Sister', emoji: '🎀', tagline: 'Playful, trendy & vibrant treats' },
  { id: 'Brother', emoji: '⚡', tagline: 'Action, cool gadgets & epic adventures' },
  { id: 'Friend', emoji: '✨', tagline: 'Great laughs & good times together' },
  { id: 'Colleague', emoji: '💼', tagline: 'Polite, smart & workspace essentials' },
  { id: 'Teacher', emoji: '📚', tagline: 'Gratitude, mentorship & honored gifts' },
  { id: 'Kids', emoji: '🧸', tagline: 'Imagination, wonder, toys & playtime' },
  { id: 'Pets', emoji: '🐾', tagline: 'Pawsome joy, treats & cozy comfort' },
  { id: 'Others', emoji: '🎁', tagline: 'Any special human in your life' },
];

interface OccasionCard {
  id: Occasion;
  emoji: string;
  tagline: string;
}

const OCCASION_OPTIONS: OccasionCard[] = [
  { id: 'Birthday', emoji: '🎂', tagline: 'Celebrating another trip around the sun' },
  { id: 'Wedding', emoji: '💍', tagline: 'A lifetime of love, joy & union' },
  { id: 'Anniversary', emoji: '🥂', tagline: 'Cherished relationship milestone' },
  { id: 'Valentine', emoji: '💝', tagline: 'Romantic gestures & sweet surprises' },
  { id: 'Diwali', emoji: '🪔', tagline: 'Festival of lights, prosperity & warmth' },
  { id: 'Christmas', emoji: '🎄', tagline: 'Holiday warmth & winter magic' },
  { id: 'New Year', emoji: '✨', tagline: 'Fresh beginnings & bold ambitions' },
  { id: 'Housewarming', emoji: '🏡', tagline: 'Warm blessings for a new sanctuary' },
  { id: 'Baby Shower', emoji: '👶', tagline: 'Welcoming precious new life' },
  { id: 'Graduation', emoji: '🎓', tagline: 'Celebrating hard-earned triumph' },
  { id: 'Promotion', emoji: '🚀', tagline: 'Leveling up the career journey' },
  { id: 'Farewell', emoji: '✈️', tagline: 'Cherished memories & warm goodbyes' },
  { id: 'Raksha Bandhan', emoji: '🧵', tagline: 'The sacred brother-sister bond' },
  { id: 'Festival', emoji: '🎆', tagline: 'Cultural celebrations & sweet treats' },
  { id: 'Eid', emoji: '🌙', tagline: 'Blessings, gratitude & sweet feasts' },
  { id: 'Pongal', emoji: '🌾', tagline: 'Harvest abundance & new beginnings' },
  { id: "Mother's Day", emoji: '🌸', tagline: 'Honoring unconditional love' },
  { id: "Father's Day", emoji: '👔', tagline: 'Honoring our everyday hero' },
  { id: 'Friendship Day', emoji: '🤝', tagline: 'Cheers to unbreakable bonds' },
  { id: 'Custom', emoji: '🌟', tagline: 'Any unique personal celebration' },
];

interface GenderCard {
  id: Gender;
  emoji: string;
  label: string;
  tagline: string;
  gradient: string;
  borderGlow: string;
}

const GENDER_OPTIONS: GenderCard[] = [
  {
    id: 'Male',
    emoji: '🕺',
    label: 'Male',
    tagline: 'Curated masculine, universal & tech favorites',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
    borderGlow: 'border-cyan-400/60 shadow-cyan-500/25',
  },
  {
    id: 'Female',
    emoji: '💃',
    label: 'Female',
    tagline: 'Curated feminine, elevated style, beauty & luxury picks',
    gradient: 'from-pink-500/20 via-rose-500/10 to-purple-500/20',
    borderGlow: 'border-pink-400/60 shadow-pink-500/25',
  },
  {
    id: 'Non-binary',
    emoji: '🌈',
    label: 'Non-binary',
    tagline: 'Fluid, modern, expressive & boundary-free favorites',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-teal-500/20',
    borderGlow: 'border-purple-400/60 shadow-purple-500/25',
  },
  {
    id: 'Prefer not to say',
    emoji: '✨',
    label: 'Prefer not to say',
    tagline: 'Pure passion & hobby-driven matching with zero assumptions',
    gradient: 'from-slate-500/20 via-zinc-500/10 to-purple-500/20',
    borderGlow: 'border-indigo-400/60 shadow-indigo-500/25',
  },
];

const INTERESTS = [
  'Gaming','Anime','Books','Fitness','Cooking','Music','Photography','Technology',
  'Fashion','Travel','Cars','Bike','Sports','Movies','Plants','Pets','Art','Drawing',
  'Coding','AI','Robotics','Cricket','Football','Cycling','Gym','Skincare','Luxury','Collectibles',
];

const INTEREST_EMOJIS: Record<string, string> = {
  Gaming:'🎮', Anime:'🎌', Books:'📚', Fitness:'💪', Cooking:'👨‍🍳', Music:'🎵',
  Photography:'📸', Technology:'💻', Fashion:'👗', Travel:'✈️', Cars:'🚗',
  Bike:'🏍️', Sports:'⚽', Movies:'🎬', Plants:'🪴', Pets:'🐾', Art:'🎨',
  Drawing:'✏️', Coding:'👨‍💻', AI:'🤖', Robotics:'⚙️', Cricket:'🏏', Football:'🏈',
  Cycling:'🚴', Gym:'🏋️', Skincare:'✨', Luxury:'💎', Collectibles:'🗿',
};

const INTEREST_CATEGORIES = [
  { id: 'all', label: 'All Passions (28)', icon: '⚡' },
  { id: 'popular', label: 'Trending', icon: '🔥' },
  { id: 'tech', label: 'Tech & Gaming', icon: '💻' },
  { id: 'creative', label: 'Creative & Arts', icon: '🎨' },
  { id: 'fitness', label: 'Fitness & Sports', icon: '🏃' },
  { id: 'lifestyle', label: 'Style & Living', icon: '👗' },
];

function getCategoryInterests(catId: string): string[] {
  switch (catId) {
    case 'popular':
      return ['Technology', 'Music', 'Fitness', 'Travel', 'Fashion', 'Gaming', 'Books', 'Skincare'];
    case 'tech':
      return ['Technology', 'Gaming', 'Coding', 'AI', 'Robotics'];
    case 'creative':
      return ['Art', 'Drawing', 'Photography', 'Music', 'Books', 'Movies', 'Anime', 'Collectibles'];
    case 'fitness':
      return ['Fitness', 'Gym', 'Sports', 'Cricket', 'Football', 'Cycling', 'Travel'];
    case 'lifestyle':
      return ['Fashion', 'Skincare', 'Luxury', 'Cooking', 'Plants', 'Pets', 'Cars', 'Bike'];
    default:
      return INTERESTS;
  }
}

interface StoreOption {
  id: Store;
  name: string;
  tagline: string;
  perk: string;
  accentColor: string;
  borderGlow: string;
  logo: React.ReactNode;
}

const STORE_OPTIONS: StoreOption[] = [
  {
    id: 'Amazon',
    name: 'Amazon India',
    tagline: 'Endless variety, prime speed & trusted reviews',
    perk: '⚡ Prime 1-Day Delivery',
    accentColor: '#FF9900',
    borderGlow: 'border-amber-400/70 shadow-amber-500/25',
    logo: <AmazonLogo />,
  },
  {
    id: 'Flipkart',
    name: 'Flipkart',
    tagline: 'Electronics, Indian favorites & assured value',
    perk: '🛡️ Assured Quality & Deals',
    accentColor: '#2874F0',
    borderGlow: 'border-blue-400/70 shadow-blue-500/25',
    logo: <FlipkartLogo />,
  },
  {
    id: 'Myntra',
    name: 'Myntra',
    tagline: 'Trendsetting fashion, footwear & premium lifestyle',
    perk: '👗 Top Fashion Brands',
    accentColor: '#FF3F6C',
    borderGlow: 'border-pink-400/70 shadow-pink-500/25',
    logo: <MyntraLogo />,
  },
  {
    id: 'Nykaa',
    name: 'Nykaa',
    tagline: '100% authentic luxury beauty, fragrances & self-care',
    perk: '💄 Luxury Beauty Verified',
    accentColor: '#FC2779',
    borderGlow: 'border-rose-400/70 shadow-rose-500/25',
    logo: <NykaaLogo />,
  },
  {
    id: 'Ajio',
    name: 'AJIO',
    tagline: 'Exclusive global street trends & indie aesthetics',
    perk: '✨ Global Label Exclusives',
    accentColor: '#F4D000',
    borderGlow: 'border-yellow-400/70 shadow-yellow-500/25',
    logo: <AjioLogo />,
  },
  {
    id: 'Croma',
    name: 'Croma',
    tagline: 'High-end consumer electronics, sound & gadgets',
    perk: '🔌 Trusted Electronics Hub',
    accentColor: '#5CB85C',
    borderGlow: 'border-emerald-400/70 shadow-emerald-500/25',
    logo: <CromaLogo />,
  },
  {
    id: 'Reliance Digital',
    name: 'Reliance Digital',
    tagline: 'Official gadget specialists with brand warranty',
    perk: '📱 Brand Direct Warranty',
    accentColor: '#0074D9',
    borderGlow: 'border-cyan-400/70 shadow-cyan-500/25',
    logo: <RelianceDigitalLogo />,
  },
  {
    id: 'Meesho',
    name: 'Meesho',
    tagline: 'Direct-from-manufacturer budget surprises & crafts',
    perk: '🎁 High-Value Pocket Deals',
    accentColor: '#F43397',
    borderGlow: 'border-fuchsia-400/70 shadow-fuchsia-500/25',
    logo: <MeeshoLogo />,
  },
  {
    id: 'Any',
    name: 'Search All Stores',
    tagline: 'Compare prices across all platforms & find the best deal',
    perk: '🌐 Highest Recommendation Depth',
    accentColor: '#c084fc',
    borderGlow: 'border-purple-400/70 shadow-purple-500/35',
    logo: (
      <div className="flex items-center gap-1.5 font-display font-black text-sm tracking-wide gradient-text">
        <Sparkles className="w-4 h-4 text-purple-400" /> All Marketplaces
      </div>
    ),
  },
];

const TOTAL_STEPS = 7;

const STEP_METADATA = [
  { label: 'Recipient', badge: 'Step 01 / 07', icon: '👤', title: 'Who is the gift for?', sub: 'Every connection has a story. Select who you are surprising today.' },
  { label: 'Occasion', badge: 'Step 02 / 07', icon: '🎉', title: 'What is the celebration?', sub: 'A celebration turns a gift into a cherished memory. Choose the occasion.' },
  { label: 'Persona', badge: 'Step 03 / 07', icon: '✨', title: 'Their style & persona', sub: 'Helps our AI calibrate styling, aesthetics, and personalized fit.' },
  { label: 'Age', badge: 'Step 04 / 07', icon: '⏳', title: 'How old are they?', sub: 'Age unlocks the generational wavelength — from sensory toys to Gen Z tech.' },
  { label: 'Budget', badge: 'Step 05 / 07', icon: '💎', title: 'What is your budget?', sub: 'Our AI scans real-time price drops across top Indian stores to maximize value.' },
  { label: 'Passions', badge: 'Step 06 / 07', icon: '🎯', title: 'What makes their eyes light up?', sub: 'Pick all their passions & hobbies. The more you pick, the smarter the match.' },
  { label: 'Store', badge: 'Step 07 / 07', icon: '🛍️', title: 'Preferred shopping store', sub: 'Select your preferred marketplace or let GiftGenie search across all stores.' },
];

function getLifeStage(age: number) {
  if (age <= 4) {
    return {
      stage: 'Toddler & Infant',
      icon: '👶',
      description: 'Sensory toys, gentle baby care, soft apparel & keepsake gifts',
      vibe: 'Wonder & Nurturing',
    };
  }
  if (age <= 12) {
    return {
      stage: 'Curious Kid',
      icon: '🧒',
      description: 'LEGO sets, interactive STEM kits, drawing, comics & active toys',
      vibe: 'Play & Discovery',
    };
  }
  if (age <= 17) {
    return {
      stage: 'Teenager / High School',
      icon: '🛹',
      description: 'Gaming gear, wireless audio, pop culture merch & trending fashion',
      vibe: 'Trends & Expression',
    };
  }
  if (age <= 24) {
    return {
      stage: 'Gen Z & College',
      icon: '🎓',
      description: 'Aesthetic desk setups, Bluetooth audio, viral skincare & lifestyle tech',
      vibe: 'Energy & Creativity',
    };
  }
  if (age <= 34) {
    return {
      stage: 'Young Professional',
      icon: '💼',
      description: 'Productivity gear, artisanal coffee, smart fitness & elevated styling',
      vibe: 'Ambition & Style',
    };
  }
  if (age <= 54) {
    return {
      stage: 'Prime & Established',
      icon: '🌟',
      description: 'Smart home luxury, premium wellness, watches, kitchen & gourmet',
      vibe: 'Quality & Sophistication',
    };
  }
  return {
    stage: 'Golden & Wise',
    icon: '👑',
    description: 'Ergonomic comfort, health wellness, timeless literature & heirloom pieces',
    vibe: 'Timeless Warmth',
  };
}

function getBudgetTier(budget: number) {
  if (budget < 1000) {
    return {
      tier: 'Pocket-Friendly & Thoughtful',
      icon: '🏷️',
      description: 'High-sentiment desk tokens, cute plants, books & sweet personal items',
      badge: 'Under ₹1,000',
      gradient: 'from-amber-500/20 to-orange-500/10',
    };
  }
  if (budget < 3500) {
    return {
      tier: 'The Sweet Spot (Most Popular)',
      icon: '✨',
      description: 'Noise-canceling earphones, skincare gift hampers & designer accessories',
      badge: '₹1,000 – ₹3,500',
      gradient: 'from-cyan-500/20 to-blue-500/10',
    };
  }
  if (budget < 8000) {
    return {
      tier: 'Premium Quality & Style',
      icon: '💎',
      description: 'Smartwatches, luxury fragrances, leather bags & mechanical keyboards',
      badge: '₹3,500 – ₹8,000',
      gradient: 'from-purple-500/20 to-pink-500/10',
    };
  }
  return {
    tier: 'Luxury Elite & Flagship Tier',
    icon: '👑',
    description: 'Flagship Apple/Sony audio, smart tablets, gold jewelry & fine timepieces',
    badge: '₹8,000+',
    gradient: 'from-emerald-500/20 to-teal-500/10',
  };
}

/* ─── Main Wizard Component ──────────────────────────────────────── */

export function Wizard({
  onComplete,
  onBack,
}: {
  onComplete: (recs: Recommendation[]) => void;
  onBack: () => void;
}) {
  const { form, setForm } = useApp();
  const [step, setStep] = useState(0);
  const [interestCategory, setInterestCategory] = useState('all');
  const [customInterest, setCustomInterest] = useState('');

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Live match radar counter
  const liveMatchCount = useMemo(() => {
    if (form.interests.length === 0) return giftCatalog.length;
    return giftCatalog.filter((g) =>
      form.interests.some((i) => g.interests.includes(i))
    ).length;
  }, [form.interests]);

  const toggleInterest = (val: string) => {
    setForm((f) => {
      const arr = f.interests;
      const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
      return { ...f, interests: next };
    });
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!form.interests.includes(trimmed)) {
      setForm((f) => ({ ...f, interests: [...f.interests, trimmed] }));
    }
    setCustomInterest('');
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!form.relationship;
      case 1: return !!form.occasion;
      case 2: return !!form.gender;
      case 3: return true;
      case 4: return true;
      case 5: return form.interests.length > 0;
      case 6: return !!form.store;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      const recs = recommend(form);
      fireConfetti();
      onComplete(recs);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  };

  const currentMeta = STEP_METADATA[step];
  const lifeStage = getLifeStage(form.age);
  const budgetTier = getBudgetTier(form.budget);
  const displayedInterests = getCategoryInterests(interestCategory);
  const activeTheme = useMemo(() => resolveCinematicTheme(step, form), [step, form]);

  return (
    <div className="wizard-stage-viewport min-h-screen pt-12 pb-20 px-4 sm:px-6 flex flex-col items-center justify-start relative">
      {/* ─── Real-Time GPU-Accelerated Particles, Volumetric Light & Specular Reflections ─── */}
      <CinematicBackground step={step} form={form} />

      {/* Floating celestial orbit rings */}
      <div className="wizard-ring-1" />
      <div className="wizard-ring-2" />

      {/* Drifting background glow particle orbs */}
      <div className="absolute top-24 left-1/4 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl pointer-events-none pf-1" />
      <div className="absolute bottom-32 right-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none pf-3" />

      <div className="w-full max-w-4xl relative z-10">
        {/* ─── Top Cinematic Navigation & Progress Bar ─── */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-soft text-xs font-bold text-secondary-c hover:text-primary-c hover:border-white/20 transition group"
              aria-label="Back"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>{step === 0 ? 'Home' : 'Previous'}</span>
            </button>

            {/* Stepper Dots (Clickable for visited steps) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              {STEP_METADATA.map((s, idx) => {
                const isCurrent = idx === step;
                const isPast = idx < step;
                return (
                  <button
                    key={s.label}
                    onClick={() => {
                      if (isPast) setStep(idx);
                    }}
                    disabled={!isPast}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'gradient-primary text-white shadow-md shadow-primary-500/30 scale-105'
                        : isPast
                        ? 'text-primary-400 hover:text-white cursor-pointer'
                        : 'text-muted-c opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="hidden md:inline">{s.label}</span>
                    {isPast && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Surprise Button */}
            <button
              onClick={() => {
                fireConfetti(60);
                onComplete(surpriseMe());
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs font-bold text-secondary-c hover:text-white transition group border border-rose-500/20 hover:border-rose-500/50"
              title="Let AI pick everything instantly!"
            >
              <Dice5 className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden xs:inline">Surprise Me</span>
            </button>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-secondary-c mb-1.5 px-1 gap-2">
              <span className="tracking-wide uppercase text-primary-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                {currentMeta.badge} · {currentMeta.label}
              </span>

              {/* Live Atmosphere Vibe Badge (Reacts directly to user choices) */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-secondary-c backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                <span className="text-secondary-c font-normal">Living Vibe:</span>
                <span className="gradient-text font-bold tracking-wide">{activeTheme.name}</span>
              </div>

              <span className="text-muted-c font-mono">
                {Math.round(((step + 1) / TOTAL_STEPS) * 100)}% Complete
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-track/60 overflow-hidden relative p-[1px]">
              <div
                className="h-full gradient-hero rounded-full transition-all duration-500 relative"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/40 blur-xs rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Glassmorphic Chamber Card ─── */}
        <div
          key={step}
          className="glass-card rounded-3xl p-6 sm:p-9 border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl relative animate-scale-in min-h-[480px] flex flex-col justify-between"
        >
          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary-300 mb-3">
              <span className="text-base">{currentMeta.icon}</span>
              <span>{currentMeta.label.toUpperCase()} CONFIGURATION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary-c tracking-tight mb-2">
              {currentMeta.title}
            </h2>
            <p className="text-sm sm:text-base text-secondary-c max-w-2xl">
              {currentMeta.sub}
            </p>
          </div>

          {/* ─── STEP 0: RELATIONSHIP ─── */}
          {step === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-1">
              {RELATIONSHIP_OPTIONS.map((opt) => {
                const isSelected = form.relationship === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setForm((f) => ({ ...f, relationship: opt.id }))
                    }
                    className={`wizard-card-interactive flex flex-col text-left p-3.5 sm:p-4 rounded-2xl relative overflow-hidden transition-all ${
                      isSelected
                        ? 'gradient-primary-glow border border-primary-400 text-white shadow-xl shadow-primary-500/25 ring-2 ring-primary-400/40'
                        : 'glass-soft border border-white/6 hover:border-white/20 text-primary-c hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className="text-2xl">{opt.emoji}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-white text-primary-600 flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                      )}
                    </div>
                    <span className="font-bold text-sm sm:text-base leading-snug">
                      {opt.id}
                    </span>
                    <span
                      className={`text-[11px] line-clamp-1 mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-secondary-c'
                      }`}
                    >
                      {opt.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── STEP 1: OCCASION ─── */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 flex-1">
              {OCCASION_OPTIONS.map((opt) => {
                const isSelected = form.occasion === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setForm((f) => ({ ...f, occasion: opt.id }))}
                    className={`wizard-card-interactive flex flex-col text-left p-3 sm:p-3.5 rounded-2xl relative overflow-hidden transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/40 via-purple-600/30 to-rose-500/40 border border-amber-400 text-white shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : 'glass-soft border border-white/6 hover:border-white/20 text-primary-c hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xl sm:text-2xl">{opt.emoji}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-xs sm:text-sm leading-snug">
                      {opt.id}
                    </span>
                    <span
                      className={`text-[10px] line-clamp-1 mt-0.5 ${
                        isSelected ? 'text-amber-100' : 'text-secondary-c'
                      }`}
                    >
                      {opt.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── STEP 2: GENDER ─── */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 flex-1 my-auto">
              {GENDER_OPTIONS.map((opt) => {
                const isSelected = form.gender === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setForm((f) => ({ ...f, gender: opt.id }))}
                    className={`wizard-card-interactive flex items-start gap-4 p-5 rounded-2xl relative overflow-hidden text-left transition-all ${
                      isSelected
                        ? `bg-gradient-to-r ${opt.gradient} ${opt.borderGlow} border-2 text-white shadow-xl ring-2 ring-white/20`
                        : 'glass-soft border border-white/6 hover:border-white/20 text-primary-c hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform ${
                        isSelected ? 'scale-110 rotate-3 shadow-lg' : 'bg-white/5'
                      }`}
                    >
                      {opt.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-extrabold text-lg text-primary-c">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-secondary-c leading-relaxed">
                        {opt.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── STEP 3: AGE ─── */}
          {step === 3 && (
            <div className="flex-1 flex flex-col justify-center py-4">
              {/* Dynamic Life Stage Spotlight Card */}
              <div className="glass-card rounded-2xl p-5 mb-8 border border-white/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shrink-0 shadow-inner">
                  {lifeStage.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-primary-500/20 text-primary-300 mb-1">
                    {lifeStage.vibe}
                  </div>
                  <h3 className="font-display text-xl font-black text-primary-c">
                    {lifeStage.stage}
                  </h3>
                  <p className="text-xs text-secondary-c mt-0.5">
                    {lifeStage.description}
                  </p>
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <div className="font-display text-5xl font-black gradient-text tracking-tight">
                    {form.age}
                  </div>
                  <div className="text-[11px] font-bold text-secondary-c uppercase tracking-wider">
                    Years Old
                  </div>
                </div>
              </div>

              {/* Slider Track */}
              <div className="px-2 mb-6">
                <input
                  type="range"
                  min={0}
                  max={90}
                  value={form.age}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, age: parseInt(e.target.value) }))
                  }
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#7c4dff' }}
                />
                <div className="flex justify-between text-xs text-muted-c font-bold mt-2">
                  <span>👶 Newborn (0)</span>
                  <span>🎓 College (20)</span>
                  <span>💼 Career (35)</span>
                  <span>👑 Golden (90+)</span>
                </div>
              </div>

              {/* Quick Jump Milestone Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {[
                  { age: 5, label: '🧒 5 (Kid)' },
                  { age: 13, label: '🛹 13 (Teen)' },
                  { age: 18, label: '🎓 18 (College)' },
                  { age: 25, label: '⚡ 25 (Gen Z)' },
                  { age: 30, label: '💼 30 (Pro)' },
                  { age: 45, label: '🌟 45 (Prime)' },
                  { age: 60, label: '👑 60 (Golden)' },
                ].map((m) => (
                  <button
                    key={m.age}
                    onClick={() => setForm((f) => ({ ...f, age: m.age }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      form.age === m.age
                        ? 'gradient-primary text-white shadow-lg shadow-primary-500/25 scale-105'
                        : 'glass-soft text-secondary-c hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 4: BUDGET ─── */}
          {step === 4 && (
            <div className="flex-1 flex flex-col justify-center py-4">
              {/* Dynamic Value Tier Showcase */}
              <div
                className={`glass-card rounded-2xl p-5 mb-8 border border-white/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left bg-gradient-to-r ${budgetTier.gradient}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shrink-0 shadow-inner">
                  {budgetTier.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 mb-1">
                    {budgetTier.badge}
                  </div>
                  <h3 className="font-display text-xl font-black text-primary-c">
                    {budgetTier.tier}
                  </h3>
                  <p className="text-xs text-secondary-c mt-0.5">
                    {budgetTier.description}
                  </p>
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <div className="font-display text-4xl sm:text-5xl font-black gradient-text-gold tracking-tight">
                    ₹{form.budget.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] font-bold text-secondary-c uppercase tracking-wider">
                    Max Spend Range
                  </div>
                </div>
              </div>

              {/* Slider Track */}
              <div className="px-2 mb-6">
                <input
                  type="range"
                  min={300}
                  max={50000}
                  step={form.budget < 5000 ? 100 : 500}
                  value={form.budget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budget: parseInt(e.target.value) }))
                  }
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#fbbf24' }}
                />
                <div className="flex justify-between text-xs text-muted-c font-bold mt-2">
                  <span>₹300</span>
                  <span>₹10,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000+</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {[500, 1500, 3000, 5000, 10000, 25000, 50000].map((b) => (
                  <button
                    key={b}
                    onClick={() => setForm((f) => ({ ...f, budget: b }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      form.budget === b
                        ? 'gradient-gold text-black shadow-lg shadow-amber-500/25 scale-105'
                        : 'glass-soft text-secondary-c hover:text-white hover:bg-white/5'
                    }`}
                  >
                    ₹{b.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 5: INTERESTS ─── */}
          {step === 5 && (
            <div className="flex-1 flex flex-col">
              {/* Live AI Match Radar Banner */}
              <div className="flex items-center justify-between bg-primary-500/10 border border-primary-500/20 rounded-2xl px-4 py-2.5 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-400 animate-pulse" />
                  <span className="text-xs font-bold text-primary-300">
                    AI Gift Match Radar:
                  </span>
                  <span className="text-xs text-secondary-c font-medium">
                    {form.interests.length === 0
                      ? 'Select at least 1 interest to focus the engine'
                      : `${form.interests.length} passions selected`}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-xs font-extrabold text-white">
                  <span>⚡</span>
                  <span>{liveMatchCount} Curated Matches</span>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                {INTEREST_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setInterestCategory(cat.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      interestCategory === cat.id
                        ? 'gradient-primary text-white shadow-md shadow-primary-500/25'
                        : 'glass-soft text-secondary-c hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Passions Grid */}
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1 py-1">
                {displayedInterests.map((item) => {
                  const isSel = form.interests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        isSel
                          ? 'gradient-primary text-white shadow-md shadow-primary-500/30 ring-1 ring-white/30 scale-105'
                          : 'glass-soft text-primary-c hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <span>{INTEREST_EMOJIS[item] ?? '✨'}</span>
                      <span>{item}</span>
                      {isSel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Interest Input */}
              <div className="mt-4 pt-3 border-t border-white/6 flex gap-2">
                <input
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Have something specific? (e.g. Mechanical Keyboards, Pottery, Drone...)"
                  className="flex-1 px-4 py-2 rounded-xl glass-soft text-xs sm:text-sm text-primary-c placeholder:text-muted-c outline-none focus:ring-2 ring-primary-500/40"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addCustomInterest();
                  }}
                />
                <button
                  onClick={addCustomInterest}
                  disabled={!customInterest.trim()}
                  className="px-4 py-2 rounded-xl gradient-primary text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-primary-500/25 disabled:opacity-40 transition"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Display user's custom added interests if any */}
              {form.interests.some((i) => !INTERESTS.includes(i)) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.interests
                    .filter((i) => !INTERESTS.includes(i))
                    .map((ci) => (
                      <span
                        key={ci}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-500/20 text-primary-300 text-xs font-bold"
                      >
                        <span>✨ {ci}</span>
                        <button
                          onClick={() => toggleInterest(ci)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 6: STORE ─── */}
          {step === 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 my-auto">
              {STORE_OPTIONS.map((opt) => {
                const isSelected = form.store === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setForm((f) => ({ ...f, store: opt.id }))}
                    className={`wizard-card-interactive flex flex-col p-4 rounded-2xl relative text-left transition-all ${
                      isSelected
                        ? `glass border-2 ${opt.borderGlow} text-white shadow-xl ring-2 ring-white/10`
                        : 'glass-soft border border-white/6 hover:border-white/20 text-primary-c hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-6 flex items-center">{opt.logo}</div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                      )}
                    </div>
                    <span className="font-bold text-xs text-primary-c">
                      {opt.name}
                    </span>
                    <p className="text-[11px] text-secondary-c line-clamp-1 mt-0.5">
                      {opt.tagline}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-white/6">
                      <span className="text-[10px] font-extrabold text-primary-300 tracking-wide">
                        {opt.perk}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── Card Footer Navigation ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
            {/* Live Status Pill */}
            <div className="text-xs text-secondary-c font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {step === 0 && (form.relationship ? `Selected: ${form.relationship}` : 'Select a recipient')}
                {step === 1 && (form.occasion ? `Celebrating: ${form.occasion}` : 'Select an occasion')}
                {step === 2 && (form.gender ? `Persona: ${form.gender}` : 'Select persona style')}
                {step === 3 && `Target Age: ${form.age} years (${lifeStage.stage})`}
                {step === 4 && `Budget: Up to ₹${form.budget.toLocaleString('en-IN')} (${budgetTier.tier})`}
                {step === 5 && `${form.interests.length} passions selected · ${liveMatchCount} gifts match`}
                {step === 6 && `Shopping Store: ${form.store}`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-2xl glass-soft text-secondary-c hover:text-white font-bold text-xs sm:text-sm transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-bold px-7 py-3 rounded-2xl shadow-xl shadow-primary-500/30 hover:scale-[1.03] active:scale-95 transition disabled:opacity-35 disabled:scale-100 disabled:shadow-none text-xs sm:text-sm flex-1 sm:flex-none cursor-pointer"
              >
                {step === TOTAL_STEPS - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4 text-accent-400 animate-spin-slow" />
                    <span>Reveal {liveMatchCount} Perfect Gifts</span>
                  </>
                ) : (
                  <>
                    <span>Next: {STEP_METADATA[step + 1].label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Processing Loading Screen ──────────────────────────────────── */

export function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const { form } = useApp();
  const messages = [
    'Synthesizing recipient personality blueprint...',
    'Cross-referencing 75+ verified products across Indian marketplaces...',
    'Scoring emotional sentiment, uniqueness & practicality...',
    'Scanning live prices on Amazon, Flipkart, Myntra, Nykaa & Croma...',
    'Calibrating happiness index & match scores...',
    'Curating your personalized gift showcase...',
  ];
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 400);
          return 100;
        }
        return p + 1.8;
      });
    }, 60);

    const msgInterval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 900);

    return () => {
      clearInterval(interval);
      clearInterval(msgInterval);
    };
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* ─── Real-Time Cinematic Particles, Volumetric Light & Specular Reflections ─── */}
      <CinematicBackground step={5} form={form} />
      <div className="wizard-ring-1" />
      <div className="wizard-ring-2" />

      <div className="text-center max-w-lg relative z-10 glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl backdrop-blur-3xl animate-scale-in">
        {/* Orbital Centerpiece */}
        <div className="relative w-44 h-44 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full gradient-hero opacity-20"
            style={{ animation: 'pulse-ring 2s ease-out infinite' }}
          />
          <div
            className="absolute inset-0 rounded-full gradient-hero opacity-20"
            style={{ animation: 'pulse-ring 2s ease-out infinite 0.7s' }}
          />
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin-slow" />
          <div className="absolute inset-2.5 rounded-full border border-rose-500/20 border-b-rose-400 animate-spin-reverse" />
          <div className="absolute inset-6 rounded-3xl gradient-hero flex items-center justify-center animate-brain-pulse shadow-2xl">
            <Brain className="w-14 h-14 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-xs font-extrabold text-primary-300 uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span>GiftGenie AI Engine</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-c mb-2 glow-text">
          Personalizing Your Gift Universe
        </h2>
        <p className="text-secondary-c text-xs sm:text-sm mb-8 h-8 font-medium transition-all">
          {messages[msgIdx]}
        </p>

        {/* Progress meter */}
        <div className="h-2.5 rounded-full bg-track/80 overflow-hidden max-w-sm mx-auto mb-2 border border-white/10 p-[1px]">
          <div
            className="h-full gradient-hero rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs font-mono font-bold text-primary-300">
          {Math.round(progress)}% Complete
        </div>

        {/* Brand ticker */}
        <div className="flex items-center justify-center gap-5 mt-8 pt-6 border-t border-white/6">
          {['Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'AJIO', 'Croma'].map((store, i) => (
            <div
              key={store}
              className="text-[11px] text-muted-c font-extrabold tracking-wider animate-glow-pulse"
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              {store}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SurpriseButton({
  onSurprise,
}: {
  onSurprise: (recs: Recommendation[]) => void;
}) {
  return (
    <button
      onClick={() => {
        fireConfetti(50);
        onSurprise(surpriseMe());
      }}
      className="inline-flex items-center gap-2 glass text-primary-c font-bold px-5 py-3 rounded-2xl hover:scale-[1.03] active:scale-95 transition"
    >
      <Dice5 className="w-5 h-5 text-rose-500" /> Surprise Me
    </button>
  );
}

export { X };
