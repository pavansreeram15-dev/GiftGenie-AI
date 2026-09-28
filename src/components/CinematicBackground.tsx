import { useEffect, useRef, useMemo } from 'react';
import type { WizardForm } from '@/types';

/* ─── Color & Theme Structures ───────────────────────────────────── */

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseHex(hex: string, a = 1): RGBA {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a,
  };
}

function rgbaStr(c: RGBA): string {
  return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${c.a.toFixed(3)})`;
}

function lerpRGBA(curr: RGBA, target: RGBA, factor: number): RGBA {
  return {
    r: curr.r + (target.r - curr.r) * factor,
    g: curr.g + (target.g - curr.g) * factor,
    b: curr.b + (target.b - curr.b) * factor,
    a: curr.a + (target.a - curr.a) * factor,
  };
}

export interface CinematicThemeConfig {
  id: string;
  name: string;
  // Deep space base gradients
  bgCenter: RGBA;
  bgMid: RGBA;
  bgOuter: RGBA;
  // Volumetric sweeping rays
  ray1: RGBA;
  ray2: RGBA;
  // Bokeh circles (soft, blurred depth discs)
  bokehColors: RGBA[];
  // Sharp sparkling specular particles
  sparkleColors: RGBA[];
  // Star cross glint reflection color
  glintColor: RGBA;
  // Energy & motion speed
  speed: number;
}

/* ─── Scenario Theme Palette Catalog ─────────────────────────────── */

function createTheme(
  id: string,
  name: string,
  centerHex: string,
  midHex: string,
  outerHex: string,
  ray1Hex: string,
  ray2Hex: string,
  bokehHexes: string[],
  sparkleHexes: string[],
  glintHex: string,
  speed = 1.0
): CinematicThemeConfig {
  return {
    id,
    name,
    bgCenter: parseHex(centerHex, 0.28),
    bgMid: parseHex(midHex, 0.16),
    bgOuter: parseHex(outerHex, 0.98),
    ray1: parseHex(ray1Hex, 0.18),
    ray2: parseHex(ray2Hex, 0.14),
    bokehColors: bokehHexes.map((h) => parseHex(h, 0.35)),
    sparkleColors: sparkleHexes.map((h) => parseHex(h, 0.85)),
    glintColor: parseHex(glintHex, 0.95),
    speed,
  };
}

// ── Step 0: Recipient Themes ──
const THEME_GIRLFRIEND = createTheme(
  'gf', 'Romantic Ruby & Rose Quartz',
  '#f43f5e', '#ec4899', '#080108',
  '#fb7185', '#fda4af',
  ['#fda4af', '#f43f5e', '#fbcfe8', '#e11d48'],
  ['#ffffff', '#ffe4e6', '#f43f5e', '#fecdd3'],
  '#ffffff', 0.85
);

const THEME_WIFE = createTheme(
  'wife', 'Treasured Platinum Rose & Champagne',
  '#fb7185', '#e879f9', '#08010b',
  '#f59e0b', '#f43f5e',
  ['#fef08a', '#f472b6', '#fed7aa', '#e879f9'],
  ['#ffffff', '#fef9c3', '#fbcfe8', '#fde047'],
  '#ffffff', 0.9
);

const THEME_BOYFRIEND = createTheme(
  'bf', 'Cyber Midnight & Electric Sapphire',
  '#3b82f6', '#1d4ed8', '#020512',
  '#60a5fa', '#06b6d4',
  ['#38bdf8', '#2563eb', '#818cf8', '#0284c7'],
  ['#ffffff', '#93c5fd', '#67e8f9', '#c7d2fe'],
  '#93c5fd', 1.0
);

const THEME_HUSBAND = createTheme(
  'husband', 'Polished Obsidian & Warm Titanium Amber',
  '#d97706', '#4f46e5', '#06050b',
  '#f59e0b', '#6366f1',
  ['#fbbf24', '#818cf8', '#fed7aa', '#4f46e5'],
  ['#ffffff', '#fef08a', '#c7d2fe', '#fde68a'],
  '#ffffff', 0.85
);

const THEME_BEST_FRIEND = createTheme(
  'best-friend', 'Electric Amethyst & Golden Sparklers',
  '#8b5cf6', '#f59e0b', '#070212',
  '#a855f7', '#fbbf24',
  ['#c084fc', '#fde047', '#e879f9', '#38bdf8'],
  ['#ffffff', '#fef08a', '#f5d0fe', '#a7f3d0'],
  '#fef08a', 1.15
);

const THEME_MOTHER = createTheme(
  'mother', 'Warm Sunbeam & Tender Apricot Rose',
  '#fb923c', '#f43f5e', '#090306',
  '#fed7aa', '#fda4af',
  ['#fecdd3', '#fed7aa', '#f472b6', '#fef08a'],
  ['#ffffff', '#fff1f2', '#fef3c7', '#fda4af'],
  '#ffffff', 0.8
);

const THEME_FATHER = createTheme(
  'father', 'Noble Forest Emerald & Stately Bronze',
  '#059669', '#d97706', '#020906',
  '#10b981', '#f59e0b',
  ['#34d399', '#fbbf24', '#059669', '#d97706'],
  ['#ffffff', '#a7f3d0', '#fde68a', '#6ee7b7'],
  '#fef08a', 0.85
);

const THEME_SISTER = createTheme(
  'sister', 'Playful Lavender & Radiant Magenta',
  '#d946ef', '#ec4899', '#0b0212',
  '#f472b6', '#c084fc',
  ['#f0abfc', '#f472b6', '#a78bfa', '#fda4af'],
  ['#ffffff', '#fae8ff', '#fce7f3', '#ddd6fe'],
  '#ffffff', 1.05
);

const THEME_BROTHER = createTheme(
  'brother', 'Kinetic Cyan & Action Blue Streaks',
  '#06b6d4', '#2563eb', '#020814',
  '#22d3ee', '#3b82f6',
  ['#38bdf8', '#06b6d4', '#60a5fa', '#818cf8'],
  ['#ffffff', '#a5f3fc', '#bae6fd', '#bfdbfe'],
  '#a5f3fc', 1.2
);

const THEME_KIDS = createTheme(
  'kids', 'Enchanted Rainbow & Magic Fairy Dust',
  '#ec4899', '#eab308', '#080210',
  '#06b6d4', '#f43f5e',
  ['#f43f5e', '#eab308', '#06b6d4', '#10b981', '#a855f7'],
  ['#ffffff', '#fef08a', '#a5f3fc', '#fbcfe8', '#bbf7d0'],
  '#ffffff', 1.3
);

const THEME_PETS = createTheme(
  'pets', 'Joyful Golden Retriever Amber & Embers',
  '#f59e0b', '#ea580c', '#0c0501',
  '#fbbf24', '#f97316',
  ['#fbbf24', '#f97316', '#fde047', '#fed7aa'],
  ['#ffffff', '#fef08a', '#fed7aa', '#ffedd5'],
  '#fef08a', 0.95
);

const THEME_COLLEAGUE = createTheme(
  'colleague', 'Modern Slate & Corporate Indigo',
  '#6366f1', '#475569', '#030510',
  '#818cf8', '#94a3b8',
  ['#818cf8', '#94a3b8', '#a5b4fc', '#cbd5e1'],
  ['#ffffff', '#e0e7ff', '#f1f5f9', '#c7d2fe'],
  '#ffffff', 0.9
);

const THEME_TEACHER = createTheme(
  'teacher', 'Wisdom Sapphire & Antique Gold',
  '#1d4ed8', '#d97706', '#03040e',
  '#3b82f6', '#f59e0b',
  ['#60a5fa', '#fbbf24', '#93c5fd', '#fde68a'],
  ['#ffffff', '#bfdbfe', '#fef08a', '#dbeafe'],
  '#fef08a', 0.85
);

const THEME_DEFAULT_RECIPIENT = createTheme(
  'default-recipient', 'Cosmic Velvet & Starlight Reflections',
  '#8b5cf6', '#6366f1', '#05020f',
  '#c084fc', '#818cf8',
  ['#c084fc', '#818cf8', '#e879f9', '#a5b4fc'],
  ['#ffffff', '#f5d0fe', '#e0e7ff', '#ddd6fe'],
  '#ffffff', 0.9
);

// ── Step 1: Occasion Themes ──
const THEME_WEDDING = createTheme(
  'wedding', 'Champagne Gala & Pristine Diamond Glints',
  '#f59e0b', '#fbbf24', '#0a0601',
  '#fef08a', '#fbbf24',
  ['#fde047', '#fef08a', '#fed7aa', '#fef9c3', '#fbcfe8'],
  ['#ffffff', '#fef9c3', '#fffbeb', '#fef08a'],
  '#ffffff', 0.8
);

const THEME_BIRTHDAY = createTheme(
  'birthday', 'Festive Celebration Sparks & Confetti Glow',
  '#ec4899', '#f59e0b', '#090211',
  '#06b6d4', '#e11d48',
  ['#f43f5e', '#fbbf24', '#06b6d4', '#a855f7', '#34d399'],
  ['#ffffff', '#fef08a', '#a5f3fc', '#fbcfe8', '#ddd6fe'],
  '#ffffff', 1.25
);

const THEME_ANNIVERSARY = createTheme(
  'anniversary', 'Deep Crimson Velvet & 24K Vintage Gold',
  '#e11d48', '#d97706', '#090105',
  '#f43f5e', '#fbbf24',
  ['#fb7185', '#fbbf24', '#fda4af', '#fde68a'],
  ['#ffffff', '#ffe4e6', '#fef08a', '#fbcfe8'],
  '#ffffff', 0.85
);

const THEME_VALENTINE = createTheme(
  'valentine', 'Passionate Ruby & Floating Rose Petals',
  '#f43f5e', '#be123c', '#0a0104',
  '#fb7185', '#f43f5e',
  ['#fda4af', '#f43f5e', '#fecdd3', '#e11d48'],
  ['#ffffff', '#ffe4e6', '#fecdd3', '#fda4af'],
  '#ffffff', 0.85
);

const THEME_DIWALI = createTheme(
  'diwali', 'Auspicious Diya Embers & Saffron Radiant Sparks',
  '#ea580c', '#eab308', '#0c0301',
  '#f97316', '#fbbf24',
  ['#f97316', '#fde047', '#fbbf24', '#ef4444', '#fed7aa'],
  ['#ffffff', '#fef08a', '#fed7aa', '#ffedd5'],
  '#fef08a', 1.15
);

const THEME_CHRISTMAS = createTheme(
  'christmas', 'Winter Pine Emerald & Frosty Snowflake Starlight',
  '#059669', '#dc2626', '#020904',
  '#10b981', '#ef4444',
  ['#34d399', '#f87171', '#a7f3d0', '#fca5a5', '#ffffff'],
  ['#ffffff', '#a7f3d0', '#fecaca', '#f0fdf4'],
  '#ffffff', 0.95
);

const THEME_NEW_YEAR = createTheme(
  'newyear', 'Midnight Sky & Platinum Gold Sparklers',
  '#f59e0b', '#6366f1', '#040210',
  '#fbbf24', '#c084fc',
  ['#fde047', '#c084fc', '#fef08a', '#818cf8', '#ffffff'],
  ['#ffffff', '#fef9c3', '#f5d0fe', '#e0e7ff'],
  '#ffffff', 1.35
);

const THEME_GRADUATION = createTheme(
  'graduation', 'Triumphant Royal Blue & Academic Gold',
  '#1d4ed8', '#eab308', '#020512',
  '#3b82f6', '#fbbf24',
  ['#60a5fa', '#fde047', '#93c5fd', '#fef08a'],
  ['#ffffff', '#bfdbfe', '#fef9c3', '#dbeafe'],
  '#fef08a', 1.1
);

const THEME_DEFAULT_OCCASION = createTheme(
  'default-occasion', 'Champagne Gala Dust & Festive Glow',
  '#f59e0b', '#d97706', '#0a0601',
  '#fbbf24', '#f59e0b',
  ['#fbbf24', '#fde047', '#fed7aa', '#fef08a'],
  ['#ffffff', '#fef9c3', '#fffbeb', '#fde68a'],
  '#fef08a', 0.9
);

// ── Step 2: Gender / Persona Themes ──
const THEME_GENDER_FEMALE = createTheme(
  'g-female', 'Luminous Rose Quartz & Silky Magenta',
  '#ec4899', '#d946ef', '#0a010d',
  '#f472b6', '#e879f9',
  ['#f472b6', '#e879f9', '#fda4af', '#f0abfc'],
  ['#ffffff', '#fce7f3', '#fae8ff', '#fbcfe8'],
  '#ffffff', 0.9
);

const THEME_GENDER_MALE = createTheme(
  'g-male', 'Cyber Cyan & Deep Oceanic Cobalt',
  '#06b6d4', '#1d4ed8', '#010814',
  '#22d3ee', '#3b82f6',
  ['#38bdf8', '#06b6d4', '#60a5fa', '#2563eb'],
  ['#ffffff', '#a5f3fc', '#bae6fd', '#bfdbfe'],
  '#a5f3fc', 1.05
);

const THEME_GENDER_NONBINARY = createTheme(
  'g-nonbinary', 'Prismatic Aurora Borealis Spectrum',
  '#8b5cf6', '#06b6d4', '#050311',
  '#ec4899', '#10b981',
  ['#c084fc', '#38bdf8', '#f472b6', '#34d399'],
  ['#ffffff', '#f5d0fe', '#a5f3fc', '#fbcfe8'],
  '#ffffff', 1.1
);

const THEME_GENDER_PREFER_NOT = createTheme(
  'g-prefernot', 'Deep Obsidian Void & Diamond Glints',
  '#475569', '#6366f1', '#03040b',
  '#94a3b8', '#818cf8',
  ['#cbd5e1', '#818cf8', '#94a3b8', '#a5b4fc'],
  ['#ffffff', '#f8fafc', '#e2e8f0', '#e0e7ff'],
  '#ffffff', 0.8
);

// ── Step 3: Age Themes ──
const THEME_AGE_KID = THEME_KIDS;
const THEME_AGE_TEEN = createTheme(
  'age-teen', 'Synthwave Ultraviolet & Cyber Pink',
  '#a855f7', '#ec4899', '#080112',
  '#c084fc', '#f472b6',
  ['#c084fc', '#f472b6', '#e879f9', '#38bdf8'],
  ['#ffffff', '#f5d0fe', '#fce7f3', '#a5f3fc'],
  '#ffffff', 1.2
);
const THEME_AGE_GENZ = createTheme(
  'age-genz', 'Vaporwave Sunset & Soft Mint Aesthetics',
  '#6366f1', '#ec4899', '#050212',
  '#a855f7', '#06b6d4',
  ['#818cf8', '#f472b6', '#38bdf8', '#2dd4bf'],
  ['#ffffff', '#e0e7ff', '#fce7f3', '#99f6e4'],
  '#ffffff', 1.05
);
const THEME_AGE_PRO = THEME_COLLEAGUE;
const THEME_AGE_PRIME = createTheme(
  'age-prime', 'Cognac Amber & Luxury Salon Gold',
  '#d97706', '#b45309', '#0a0401',
  '#f59e0b', '#fbbf24',
  ['#fbbf24', '#f59e0b', '#fde68a', '#fed7aa'],
  ['#ffffff', '#fef9c3', '#fef08a', '#ffedd5'],
  '#fef08a', 0.85
);
const THEME_AGE_GOLDEN = createTheme(
  'age-golden', 'Serene Celestial Gold & Peaceful Embers',
  '#d97706', '#78350f', '#090401',
  '#fbbf24', '#f59e0b',
  ['#fde047', '#fbbf24', '#fef08a', '#fde68a'],
  ['#ffffff', '#fef9c3', '#fffbeb', '#fef08a'],
  '#ffffff', 0.75
);

// ── Step 4: Budget Themes ──
const THEME_BUDGET_LOW = createTheme(
  'b-low', 'Fresh Mint & Cheerful Turquoise',
  '#0d9488', '#06b6d4', '#010809',
  '#14b8a6', '#22d3ee',
  ['#2dd4bf', '#38bdf8', '#5eead4', '#67e8f9'],
  ['#ffffff', '#ccfbf1', '#cffafe', '#a5f3fc'],
  '#ffffff', 1.0
);
const THEME_BUDGET_MID = createTheme(
  'b-mid', 'Royal Electric Purple & Modern Cyan',
  '#7c4dff', '#06b6d4', '#050211',
  '#a855f7', '#38bdf8',
  ['#c084fc', '#38bdf8', '#818cf8', '#67e8f9'],
  ['#ffffff', '#f5d0fe', '#a5f3fc', '#e0e7ff'],
  '#ffffff', 1.0
);
const THEME_BUDGET_PREMIUM = createTheme(
  'b-premium', 'Sapphire Elegance & 24K Gold Glints',
  '#2563eb', '#d97706', '#020412',
  '#3b82f6', '#f59e0b',
  ['#60a5fa', '#fbbf24', '#818cf8', '#fde047'],
  ['#ffffff', '#bfdbfe', '#fef08a', '#fef9c3'],
  '#fef08a', 0.95
);
const THEME_BUDGET_LUXURY = createTheme(
  'b-luxury', 'Opulent 24K Liquid Gold & Emerald Vault',
  '#eab308', '#059669', '#0a0701',
  '#fde047', '#10b981',
  ['#fef08a', '#34d399', '#fde047', '#6ee7b7', '#fef9c3'],
  ['#ffffff', '#fef9c3', '#a7f3d0', '#fef08a'],
  '#ffffff', 1.1
);

// ── Step 5: Interests Themes ──
const THEME_INTERESTS_TECH = createTheme(
  'i-tech', 'Matrix Neon Green & Cyber Hologram Cyan',
  '#06b6d4', '#10b981', '#010a08',
  '#22d3ee', '#34d399',
  ['#38bdf8', '#34d399', '#67e8f9', '#6ee7b7'],
  ['#ffffff', '#a5f3fc', '#a7f3d0', '#cffafe'],
  '#a5f3fc', 1.2
);
const THEME_INTERESTS_GAMING = createTheme(
  'i-gaming', 'RGB Chroma Lights & Laser Glow',
  '#8b5cf6', '#ec4899', '#06010e',
  '#06b6d4', '#e11d48',
  ['#c084fc', '#f43f5e', '#38bdf8', '#a855f7'],
  ['#ffffff', '#f5d0fe', '#fce7f3', '#a5f3fc'],
  '#ffffff', 1.3
);
const THEME_INTERESTS_FASHION = createTheme(
  'i-fashion', 'Runway Flashbulbs & Rose Champagne Sparkle',
  '#ec4899', '#f59e0b', '#0a0209',
  '#f472b6', '#fbbf24',
  ['#f472b6', '#fbbf24', '#fbcfe8', '#fde047'],
  ['#ffffff', '#fce7f3', '#fef9c3', '#fbcfe8'],
  '#ffffff', 1.05
);
const THEME_INTERESTS_FITNESS = createTheme(
  'i-fitness', 'Kinetic Flame Orange & Adrenaline Sparks',
  '#ea580c', '#e11d48', '#0c0301',
  '#f97316', '#f43f5e',
  ['#f97316', '#f43f5e', '#fb923c', '#fb7185'],
  ['#ffffff', '#fed7aa', '#ffe4e6', '#ffedd5'],
  '#ffffff', 1.35
);
const THEME_INTERESTS_ART = createTheme(
  'i-art', 'Sunset Chromatic Watercolor & Violet Rays',
  '#a855f7', '#f43f5e', '#09010f',
  '#c084fc', '#fb7185',
  ['#c084fc', '#fb7185', '#e879f9', '#fda4af'],
  ['#ffffff', '#f5d0fe', '#ffe4e6', '#fce7f3'],
  '#ffffff', 0.95
);
const THEME_DEFAULT_INTERESTS = createTheme(
  'i-default', 'Synaptic Passion Galaxy & Laser Magenta',
  '#a855f7', '#ec4899', '#070211',
  '#c084fc', '#38bdf8',
  ['#c084fc', '#f472b6', '#38bdf8', '#818cf8'],
  ['#ffffff', '#f5d0fe', '#a5f3fc', '#fce7f3'],
  '#ffffff', 1.15
);

// ── Step 6: Store Themes ──
const THEME_STORE_AMAZON = createTheme(
  'st-amazon', 'Amazon Warm Gold & Charcoal Glow',
  '#f59e0b', '#ea580c', '#0c0501',
  '#fbbf24', '#f97316',
  ['#fbbf24', '#f97316', '#fde047', '#fed7aa'],
  ['#ffffff', '#fef08a', '#fed7aa', '#ffedd5'],
  '#fef08a', 1.05
);
const THEME_STORE_FLIPKART = createTheme(
  'st-flipkart', 'Flipkart Electric Blue & Sunshine Yellow',
  '#2563eb', '#eab308', '#020614',
  '#3b82f6', '#fde047',
  ['#60a5fa', '#fde047', '#93c5fd', '#fef08a'],
  ['#ffffff', '#bfdbfe', '#fef9c3', '#dbeafe'],
  '#fef08a', 1.1
);
const THEME_STORE_MYNTRA = createTheme(
  'st-myntra', 'Myntra Runway Hot Pink & Magenta Bokeh',
  '#ff3f6c', '#d946ef', '#0c0107',
  '#f43f5e', '#ec4899',
  ['#f43f5e', '#ec4899', '#fda4af', '#f0abfc'],
  ['#ffffff', '#ffe4e6', '#fae8ff', '#fbcfe8'],
  '#ffffff', 1.1
);
const THEME_STORE_NYKAA = createTheme(
  'st-nykaa', 'Nykaa Luxury Beauty Magenta & Crimson Radiance',
  '#fc2779', '#be123c', '#0d0107',
  '#f43f5e', '#fda4af',
  ['#fc2779', '#fda4af', '#fb7185', '#fecdd3'],
  ['#ffffff', '#ffe4e6', '#fecdd3', '#fda4af'],
  '#ffffff', 1.0
);
const THEME_STORE_AJIO = createTheme(
  'st-ajio', 'AJIO Sleek Violet & Lemon Yellow Runway Beams',
  '#7c4dff', '#eab308', '#070211',
  '#a855f7', '#fde047',
  ['#c084fc', '#fde047', '#818cf8', '#fef08a'],
  ['#ffffff', '#f5d0fe', '#fef9c3', '#e0e7ff'],
  '#fef08a', 1.05
);
const THEME_STORE_CROMA = createTheme(
  'st-croma', 'Croma Tech Emerald & Cyan Circuit Dust',
  '#059669', '#06b6d4', '#010906',
  '#10b981', '#22d3ee',
  ['#34d399', '#38bdf8', '#6ee7b7', '#a5f3fc'],
  ['#ffffff', '#a7f3d0', '#cffafe', '#67e8f9'],
  '#a7f3d0', 1.0
);
const THEME_STORE_RELIANCE = createTheme(
  'st-reliance', 'Reliance Tech Crimson & Azure Blue Laser Glow',
  '#0074D9', '#dc2626', '#020512',
  '#38bdf8', '#ef4444',
  ['#60a5fa', '#f87171', '#93c5fd', '#fca5a5'],
  ['#ffffff', '#bfdbfe', '#fecaca', '#dbeafe'],
  '#ffffff', 1.05
);
const THEME_STORE_MEESHO = createTheme(
  'st-meesho', 'Meesho Warm Fuchsia & Sunny Orange Sparks',
  '#f43397', '#ea580c', '#0d0108',
  '#ec4899', '#f97316',
  ['#f472b6', '#fb923c', '#fbcfe8', '#fed7aa'],
  ['#ffffff', '#fce7f3', '#ffedd5', '#fecdd3'],
  '#ffffff', 1.05
);
const THEME_STORE_ANY = createTheme(
  'st-any', 'All Marketplaces Cosmic Rainbow Prism',
  '#8b5cf6', '#f59e0b', '#060210',
  '#06b6d4', '#ec4899',
  ['#c084fc', '#fde047', '#38bdf8', '#f43f5e', '#34d399'],
  ['#ffffff', '#fef08a', '#a5f3fc', '#fbcfe8', '#bbf7d0'],
  '#ffffff', 1.2
);

/* ─── Real-Time Theme Resolver ───────────────────────────────────── */

export function resolveCinematicTheme(step: number, form: WizardForm): CinematicThemeConfig {
  switch (step) {
    case 0: {
      // Step 0: Recipient
      switch (form.relationship) {
        case 'Girlfriend': return THEME_GIRLFRIEND;
        case 'Wife': return THEME_WIFE;
        case 'Boyfriend': return THEME_BOYFRIEND;
        case 'Husband': return THEME_HUSBAND;
        case 'Best Friend': return THEME_BEST_FRIEND;
        case 'Mother': return THEME_MOTHER;
        case 'Father': return THEME_FATHER;
        case 'Sister': return THEME_SISTER;
        case 'Brother': return THEME_BROTHER;
        case 'Kids': return THEME_KIDS;
        case 'Pets': return THEME_PETS;
        case 'Colleague': return THEME_COLLEAGUE;
        case 'Teacher': return THEME_TEACHER;
        default: return THEME_DEFAULT_RECIPIENT;
      }
    }
    case 1: {
      // Step 1: Occasion
      switch (form.occasion) {
        case 'Wedding': return THEME_WEDDING;
        case 'Birthday': return THEME_BIRTHDAY;
        case 'Anniversary': return THEME_ANNIVERSARY;
        case 'Valentine': return THEME_VALENTINE;
        case 'Diwali': return THEME_DIWALI;
        case 'Christmas': return THEME_CHRISTMAS;
        case 'New Year': return THEME_NEW_YEAR;
        case 'Graduation': return THEME_GRADUATION;
        case 'Promotion': return THEME_INTERESTS_FITNESS;
        case 'Housewarming': return THEME_PETS;
        case 'Baby Shower': return THEME_KIDS;
        default: return THEME_DEFAULT_OCCASION;
      }
    }
    case 2: {
      // Step 2: Gender / Persona
      switch (form.gender) {
        case 'Female': return THEME_GENDER_FEMALE;
        case 'Male': return THEME_GENDER_MALE;
        case 'Non-binary': return THEME_GENDER_NONBINARY;
        case 'Prefer not to say': return THEME_GENDER_PREFER_NOT;
        default: return THEME_GENDER_NONBINARY;
      }
    }
    case 3: {
      // Step 3: Age
      if (form.age <= 12) return THEME_AGE_KID;
      if (form.age <= 17) return THEME_AGE_TEEN;
      if (form.age <= 24) return THEME_AGE_GENZ;
      if (form.age <= 34) return THEME_AGE_PRO;
      if (form.age <= 54) return THEME_AGE_PRIME;
      return THEME_AGE_GOLDEN;
    }
    case 4: {
      // Step 4: Budget
      if (form.budget < 1000) return THEME_BUDGET_LOW;
      if (form.budget < 3500) return THEME_BUDGET_MID;
      if (form.budget < 8000) return THEME_BUDGET_PREMIUM;
      return THEME_BUDGET_LUXURY;
    }
    case 5: {
      // Step 5: Interests
      const has = (arr: string[]) => form.interests.some((i) => arr.includes(i));
      if (has(['Technology', 'Coding', 'AI', 'Robotics'])) return THEME_INTERESTS_TECH;
      if (has(['Gaming', 'Anime'])) return THEME_INTERESTS_GAMING;
      if (has(['Fashion', 'Luxury', 'Skincare'])) return THEME_INTERESTS_FASHION;
      if (has(['Fitness', 'Gym', 'Sports', 'Cricket', 'Football', 'Cycling'])) return THEME_INTERESTS_FITNESS;
      if (has(['Art', 'Drawing', 'Photography', 'Music', 'Movies', 'Books'])) return THEME_INTERESTS_ART;
      return THEME_DEFAULT_INTERESTS;
    }
    case 6: {
      // Step 6: Store
      switch (form.store) {
        case 'Amazon': return THEME_STORE_AMAZON;
        case 'Flipkart': return THEME_STORE_FLIPKART;
        case 'Myntra': return THEME_STORE_MYNTRA;
        case 'Nykaa': return THEME_STORE_NYKAA;
        case 'Ajio': return THEME_STORE_AJIO;
        case 'Croma': return THEME_STORE_CROMA;
        case 'Reliance Digital': return THEME_STORE_RELIANCE;
        case 'Meesho': return THEME_STORE_MEESHO;
        default: return THEME_STORE_ANY;
      }
    }
    default:
      return THEME_DEFAULT_RECIPIENT;
  }
}

/* ─── Particle Entities ──────────────────────────────────────────── */

interface BokehOrb {
  x: number;
  y: number;
  r: number;
  baseR: number;
  vx: number;
  vy: number;
  colorIdx: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface SpecularSparkle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  colorIdx: number;
  twinklePhase: number;
  twinkleSpeed: number;
  isGlint: boolean;
}

interface VolumetricRay {
  originXRatio: number;
  originYRatio: number;
  angle: number;
  angularSpeed: number;
  width: number;
  lengthRatio: number;
  alpha: number;
  colorType: 1 | 2;
}

/* ─── Canvas Component ───────────────────────────────────────────── */

export function CinematicBackground({
  step,
  form,
}: {
  step: number;
  form: WizardForm;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Target theme based on current step and active choice
  const targetTheme = useMemo(() => resolveCinematicTheme(step, form), [step, form]);

  // Current interpolated theme state
  const currentThemeRef = useRef<CinematicThemeConfig>({ ...targetTheme });
  useEffect(() => {
    // When target changes, the animation loop will lerp currentThemeRef towards targetTheme
  }, [targetTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse parallax tracking
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ── Create Bokeh Orbs (Soft out-of-focus background discs) ──
    const BOKEH_COUNT = 24;
    const bokehOrbs: BokehOrb[] = [];
    for (let i = 0; i < BOKEH_COUNT; i++) {
      const baseR = 30 + Math.random() * 80;
      bokehOrbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: baseR,
        baseR,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.45, // slow upward drift
        colorIdx: i % 4,
        alpha: 0.15 + Math.random() * 0.25,
        baseAlpha: 0.15 + Math.random() * 0.25,
        pulseSpeed: 0.008 + Math.random() * 0.012,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // ── Create Specular Twinkling Sparkles & Cross-Glints ──
    const SPARKLE_COUNT = 75;
    const sparkles: SpecularSparkle[] = [];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2.8,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.3 - Math.random() * 0.65,
        colorIdx: i % 4,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        isGlint: Math.random() > 0.4,
      });
    }

    // ── Create Volumetric Caustic Sweeping Rays ──
    const rays: VolumetricRay[] = [
      {
        originXRatio: 0.15,
        originYRatio: -0.05,
        angle: Math.PI / 4,
        angularSpeed: 0.00035,
        width: 320,
        lengthRatio: 1.4,
        alpha: 0.8,
        colorType: 1,
      },
      {
        originXRatio: 0.85,
        originYRatio: -0.05,
        angle: (3 * Math.PI) / 4,
        angularSpeed: -0.00045,
        width: 380,
        lengthRatio: 1.5,
        alpha: 0.7,
        colorType: 2,
      },
      {
        originXRatio: 0.5,
        originYRatio: -0.1,
        angle: Math.PI / 2,
        angularSpeed: 0.00025,
        width: 440,
        lengthRatio: 1.3,
        alpha: 0.6,
        colorType: 1,
      },
    ];

    let time = 0;

    // ── Main 60FPS Render Loop ──
    const render = () => {
      time += 1;

      // Mouse smoothing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const pOffsetX = (mouseX - 0.5) * 35;
      const pOffsetY = (mouseY - 0.5) * 25;

      // Smoothly interpolate currentTheme towards targetTheme (lerp over ~40-60 frames)
      const cur = currentThemeRef.current;
      const tgt = targetTheme;
      const LERP_SPEED = 0.055;

      cur.bgCenter = lerpRGBA(cur.bgCenter, tgt.bgCenter, LERP_SPEED);
      cur.bgMid = lerpRGBA(cur.bgMid, tgt.bgMid, LERP_SPEED);
      cur.bgOuter = lerpRGBA(cur.bgOuter, tgt.bgOuter, LERP_SPEED);
      cur.ray1 = lerpRGBA(cur.ray1, tgt.ray1, LERP_SPEED);
      cur.ray2 = lerpRGBA(cur.ray2, tgt.ray2, LERP_SPEED);
      cur.glintColor = lerpRGBA(cur.glintColor, tgt.glintColor, LERP_SPEED);
      cur.speed += (tgt.speed - cur.speed) * LERP_SPEED;

      for (let i = 0; i < cur.bokehColors.length; i++) {
        const tgtColor = tgt.bokehColors[i % tgt.bokehColors.length];
        cur.bokehColors[i] = lerpRGBA(cur.bokehColors[i], tgtColor, LERP_SPEED);
      }
      for (let i = 0; i < cur.sparkleColors.length; i++) {
        const tgtColor = tgt.sparkleColors[i % tgt.sparkleColors.length];
        cur.sparkleColors[i] = lerpRGBA(cur.sparkleColors[i], tgtColor, LERP_SPEED);
      }

      // ── 1. Draw Deep Space Background Base Gradient ──
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = rgbaStr(cur.bgOuter);
      ctx.fillRect(0, 0, width, height);

      // Center radial glow
      const cx = width * 0.5 + pOffsetX * 0.3;
      const cy = height * 0.35 + pOffsetY * 0.3;
      const maxR = Math.max(width, height) * 0.85;

      const baseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      baseGrad.addColorStop(0, rgbaStr(cur.bgCenter));
      baseGrad.addColorStop(0.45, rgbaStr(cur.bgMid));
      baseGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 2. Draw Volumetric Sweeping Light Rays (Cinematic Reflections) ──
      ctx.globalCompositeOperation = 'screen';
      rays.forEach((ray) => {
        ray.angle += ray.angularSpeed * cur.speed;
        const ox = ray.originXRatio * width + pOffsetX * 0.2;
        const oy = ray.originYRatio * height;
        const rayLen = height * ray.lengthRatio;
        const endX = ox + Math.cos(ray.angle) * rayLen;
        const endY = oy + Math.sin(ray.angle) * rayLen;

        const rayGrad = ctx.createLinearGradient(ox, oy, endX, endY);
        const rayColor = ray.colorType === 1 ? cur.ray1 : cur.ray2;
        rayGrad.addColorStop(0, rgbaStr({ ...rayColor, a: rayColor.a * ray.alpha }));
        rayGrad.addColorStop(0.35, rgbaStr({ ...rayColor, a: rayColor.a * 0.6 * ray.alpha }));
        rayGrad.addColorStop(0.7, rgbaStr({ ...rayColor, a: rayColor.a * 0.2 * ray.alpha }));
        rayGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        // Fan-shaped volumetric light cone
        const spread = ray.width * 0.5;
        const perpX = -Math.sin(ray.angle);
        const perpY = Math.cos(ray.angle);

        ctx.moveTo(ox, oy);
        ctx.lineTo(endX + perpX * spread, endY + perpY * spread);
        ctx.lineTo(endX - perpX * spread, endY - perpY * spread);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // ── 3. Draw Floating Luminous Bokeh Orbs ──
      ctx.globalCompositeOperation = 'screen';
      bokehOrbs.forEach((orb) => {
        orb.pulsePhase += orb.pulseSpeed * cur.speed;
        const pulse = Math.sin(orb.pulsePhase);
        orb.r = orb.baseR * (1 + pulse * 0.18);
        const currentAlpha = Math.max(0, orb.baseAlpha * (1 + pulse * 0.3));

        // Movement with wrap-around
        orb.x += orb.vx * cur.speed;
        orb.y += orb.vy * cur.speed;

        if (orb.y < -orb.r) {
          orb.y = height + orb.r;
          orb.x = Math.random() * width;
        }
        if (orb.x < -orb.r) orb.x = width + orb.r;
        if (orb.x > width + orb.r) orb.x = -orb.r;

        const drawX = orb.x + pOffsetX * 0.5;
        const drawY = orb.y + pOffsetY * 0.5;

        const color = cur.bokehColors[orb.colorIdx % cur.bokehColors.length] ?? cur.bokehColors[0];
        const g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, orb.r);
        g.addColorStop(0, rgbaStr({ ...color, a: color.a * currentAlpha }));
        g.addColorStop(0.45, rgbaStr({ ...color, a: color.a * currentAlpha * 0.5 }));
        g.addColorStop(0.8, rgbaStr({ ...color, a: color.a * currentAlpha * 0.15 }));
        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(drawX, drawY, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── 4. Draw Specular Twinkling Sparkles & Cross-Glints ──
      ctx.globalCompositeOperation = 'lighter';
      sparkles.forEach((s) => {
        s.twinklePhase += s.twinkleSpeed * cur.speed;
        const tw = Math.sin(s.twinklePhase);
        const brightness = Math.max(0, (tw + 1) * 0.5);

        s.x += s.vx * cur.speed;
        s.y += s.vy * cur.speed;

        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;

        const drawX = s.x + pOffsetX * 0.9;
        const drawY = s.y + pOffsetY * 0.9;

        const spColor = cur.sparkleColors[s.colorIdx % cur.sparkleColors.length] ?? cur.sparkleColors[0];
        const currentAlpha = spColor.a * brightness;

        if (currentAlpha <= 0.02) return;

        // Core dot
        ctx.fillStyle = rgbaStr({ ...spColor, a: currentAlpha });
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size * (0.8 + brightness * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Specular Star Reflection (Cross-Glint when bright)
        if (s.isGlint && brightness > 0.65) {
          const glintAlpha = (brightness - 0.65) * 2.8 * cur.glintColor.a;
          ctx.strokeStyle = rgbaStr({ ...cur.glintColor, a: Math.min(1, glintAlpha) });
          ctx.lineWidth = 1;

          const glintLen = s.size * (5 + brightness * 8);

          ctx.beginPath();
          // Horizontal streak
          ctx.moveTo(drawX - glintLen, drawY);
          ctx.lineTo(drawX + glintLen, drawY);
          // Vertical streak
          ctx.moveTo(drawX, drawY - glintLen * 0.7);
          ctx.lineTo(drawX, drawY + glintLen * 0.7);
          ctx.stroke();

          // Diamond center glint
          ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.min(1, glintAlpha * 0.9) + ')';
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [targetTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
}
