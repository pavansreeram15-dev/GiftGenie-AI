import type { GiftProduct, Recommendation, WizardForm } from './types';
import { giftCatalog } from './data';

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function getBestPrice(g: GiftProduct) {
  return g.prices.reduce((min, p) => (p.price < min.price ? p : min), g.prices[0]);
}

export function getStorePrice(g: GiftProduct, store: string) {
  return g.prices.find((p) => p.store === store) ?? g.prices[0];
}

const STORE_SEARCH: Record<string, (q: string) => string> = {
  'Amazon': (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  'Flipkart': (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  'Myntra': (q) => `https://www.myntra.com/${encodeURIComponent(q).replace(/%20/g, '-')}`,
  'Nykaa': (q) => `https://www.nykaa.com/search/result?q=${encodeURIComponent(q)}`,
  'Ajio': (q) => `https://www.ajio.com/search/?text=${encodeURIComponent(q)}`,
  'Croma': (q) => `https://www.croma.com/search/?text=${encodeURIComponent(q)}`,
  'Reliance Digital': (q) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}`,
  'Meesho': (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
  'Any': (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
};

export function searchUrl(store: string, productName: string): string {
  return (STORE_SEARCH[store] ?? STORE_SEARCH['Any'])(productName);
}

export function recommend(form: WizardForm): Recommendation[] {
  const userInterests = form.interests;
  const hasInterests = userInterests.length > 0;

  const scored = giftCatalog.map((g) => {
    const interestMatches = userInterests.filter((i) => g.interests.includes(i));
    const matchCount = interestMatches.length;

    let score = 0;
    const reasons: string[] = [];

    if (hasInterests) {
      if (matchCount > 0) {
        // High base score for relevant matches
        score = 75;
        // Depth bonus: matching more selected interests
        const matchRatio = matchCount / userInterests.length;
        score += Math.round(matchRatio * 14 + Math.min(matchCount, 3) * 3);
        reasons.push(`Direct match for their interest in ${interestMatches.join(' & ')}`);
      } else {
        // Zero-match items when user specified interests
        score = 25;
        reasons.push('Popular universal pick (outside selected interests)');
      }
    } else {
      // No specific interests chosen: baseline 60
      score = 60;
    }

    // ── AGE MATCH ──
    if (form.age >= g.ageRange[0] && form.age <= g.ageRange[1]) {
      score += 6;
      reasons.push(`Ideal for age ${form.age}`);
    } else {
      score -= 6;
    }

    // ── OCCASION MATCH ──
    if (form.occasion && g.occasions.includes(form.occasion)) {
      score += 6;
      reasons.push(`Perfect for ${form.occasion}`);
    }

    // ── PERSONALITY MATCH ──
    const personalityMatches = form.personality.filter((p) => g.personality.includes(p));
    if (personalityMatches.length > 0) {
      score += 3 * personalityMatches.length;
      reasons.push(`Suits a ${personalityMatches.join(' & ')} personality`);
    }

    // ── BUDGET MATCH ──
    const best = getBestPrice(g);
    if (best.price <= form.budget) {
      score += 8;
      const margin = (form.budget - best.price) / form.budget;
      if (margin < 0.25) score += 4; // near budget feels thoughtful
    } else {
      const over = (best.price - form.budget) / form.budget;
      // Controlled penalty: maximum 10 deduction so a good item still ranks high
      score -= clamp(Math.round(over * 10), 2, 10);
    }

    // ── STORE PREFERENCE ──
    if (form.store === 'Any' || g.prices.some((p) => p.store === form.store)) {
      score += 4;
      if (form.store !== 'Any') reasons.push(`Available on ${form.store}`);
    }

    // ── GENDER MATCH (hard filter for gendered items) ──
    const isGenderNeutral = g.genders.length >= 3;
    if (!isGenderNeutral && form.gender && form.gender !== 'Prefer not to say') {
      if (g.genders.includes(form.gender)) {
        score += 3;
      } else {
        score -= 20; // Strong penalty for gender mismatch
      }
    }

    // ── QUALITY SIGNALS (small, not dominant) ──
    score += (g.rating - 3.5) * 3;
    score += g.uniqueness * 0.03;
    score += g.trendScore * 0.03;

    if (hasInterests) {
      if (matchCount > 0) {
        score = clamp(Math.round(score), 70, 99);
      } else {
        score = clamp(Math.round(score), 20, 48); // hard cap below 50
      }
    } else {
      score = clamp(Math.round(score), 40, 95);
    }

    // Build rich output
    const explanation = buildExplanation(form, g, reasons, interestMatches);
    const emotionPrediction = predictEmotion(g, form);
    const happinessMeter = clamp(Math.round(score * 0.95 + (g.giftWrapping ? 3 : 0) + matchCount * 2), 20, 99);
    const compatibilityScore = clamp(
      Math.round(
        (matchCount > 0 ? 50 : 20) +
        personalityMatches.length * 10 +
        (form.occasion && g.occasions.includes(form.occasion) ? 15 : 0) +
        g.uniqueness * 0.15
      ),
      20, 99,
    );

    return {
      ...g,
      matchScore: score,
      reasons,
      explanation,
      emotionPrediction,
      happinessMeter,
      compatibilityScore,
    };
  });

  // Strict sorting: matching products ALWAYS rank before non-matching products
  return scored.sort((a, b) => {
    if (hasInterests) {
      const aMatches = userInterests.filter((i) => a.interests.includes(i)).length;
      const bMatches = userInterests.filter((i) => b.interests.includes(i)).length;
      if ((bMatches > 0) !== (aMatches > 0)) {
        return bMatches > 0 ? 1 : -1;
      }
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return bMatches - aMatches;
    }
    return b.matchScore - a.matchScore;
  });
}

function relationshipTone(form: WizardForm): string {
  const map: Record<string, string> = {
    'Girlfriend': 'your girlfriend', 'Boyfriend': 'your boyfriend', 'Wife': 'your wife', 'Husband': 'your husband',
    'Mother': 'your mother', 'Father': 'your father', 'Sister': 'your sister', 'Brother': 'your brother',
    'Best Friend': 'your best friend', 'Friend': 'your friend', 'Teacher': 'your teacher',
    'Colleague': 'your colleague', 'Kids': 'the little one', 'Pets': 'your furry friend', 'Others': 'them',
  };
  return map[form.relationship ?? ''] ?? 'them';
}

function buildExplanation(form: WizardForm, g: GiftProduct, reasons: string[], interestMatches: string[]): string {
  const who = relationshipTone(form);
  const interestPart = interestMatches.length > 0
    ? `Since ${who} loves ${interestMatches.slice(0, 3).join(' & ')}`
    : form.interests.length > 0
      ? `As a crowd-pleasing pick to pair with ${who}'s style`
      : `Based on what you shared`;
  const occasionPart = form.occasion ? ` and you are celebrating ${form.occasion}` : '';
  const personalityPart = form.personality.length
    ? `, their ${form.personality.slice(0, 2).join(' & ').toLowerCase()} personality makes this an effortless match`
    : '';
  const budgetPart = (() => {
    const best = getBestPrice(g);
    if (best.price <= form.budget) return ` At ₹${best.price.toLocaleString('en-IN')}, it sits comfortably within your ₹${form.budget.toLocaleString('en-IN')} budget.`;
    return ` At ₹${best.price.toLocaleString('en-IN')}, it stretches your budget slightly, but the quality and thought justify every rupee.`;
  })();
  return `${interestPart}${occasionPart}${personalityPart}, the ${g.name} stands out. ${reasons.slice(0, 2).join('. ')}.${budgetPart} Rated ${g.rating}★ with an impressive uniqueness score of ${g.uniqueness}.`;
}

function predictEmotion(g: GiftProduct, _form: WizardForm): string {
  const emotions = ['Delighted surprise', 'Warm gratitude', 'Pure joy', 'Thoughtful appreciation', 'Excited wonder'];
  const idx = (g.uniqueness + g.popularity) % emotions.length;
  return emotions[idx];
}

export function surpriseMe(count = 6): Recommendation[] {
  const shuffled = [...giftCatalog].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((g) => ({
    ...g,
    matchScore: 78 + Math.floor(Math.random() * 20),
    reasons: ['A wildcard pick for the adventurous gift-giver'],
    explanation: `Sometimes the best gifts are the ones nobody expects. The ${g.name} is a delightful surprise that shows you thought outside the box.`,
    emotionPrediction: 'Delighted surprise',
    happinessMeter: 80 + Math.floor(Math.random() * 18),
    compatibilityScore: 70 + Math.floor(Math.random() * 25),
  }));
}

export function sortRecommendations(recs: Recommendation[], sort: string): Recommendation[] {
  const matching = recs.filter((r) => r.matchScore >= 60);
  const others = recs.filter((r) => r.matchScore < 60);

  const applySort = (list: Recommendation[]) => {
    const copy = [...list];
    switch (sort) {
      case 'Highest Match': return copy.sort((a, b) => b.matchScore - a.matchScore);
      case 'Lowest Price': return copy.sort((a, b) => getBestPrice(a).price - getBestPrice(b).price);
      case 'Trending': return copy.sort((a, b) => b.trendScore - a.trendScore);
      case 'Luxury': return copy.sort((a, b) => getBestPrice(b).price - getBestPrice(a).price);
      case 'Most Unique': return copy.sort((a, b) => b.uniqueness - a.uniqueness);
      case 'Fast Delivery': return copy.sort((a, b) => getBestPrice(a).deliveryDays - getBestPrice(b).deliveryDays);
      case 'Highest Rated': return copy.sort((a, b) => b.rating - a.rating);
      case 'Best Value': return copy.sort((a, b) => (b.rating + b.matchScore / 25) - (a.rating + a.matchScore / 25));
      default: return copy;
    }
  };

  if (matching.length > 0) {
    return [...applySort(matching), ...applySort(others)];
  }
  return applySort(recs);
}

export function chatAssistant(message: string): { text: string; gifts: Recommendation[] } {
  const lower = message.toLowerCase();
  const interestKeywords: Record<string, string[]> = {
    'anime': ['Anime'], 'manga': ['Anime'], 'one piece': ['Anime'], 'naruto': ['Anime'], 'demon slayer': ['Anime'],
    'read': ['Books'], 'book': ['Books'], 'kindle': ['Books', 'Technology'],
    'gaming': ['Gaming'], 'game': ['Gaming'], 'playstation': ['Gaming'], 'ps5': ['Gaming'], 'controller': ['Gaming'],
    'fitness': ['Fitness'], 'gym': ['Gym', 'Fitness'], 'workout': ['Gym', 'Fitness'], 'yoga': ['Fitness'],
    'music': ['Music'], 'guitar': ['Music'], 'speaker': ['Music', 'Technology'], 'marshall': ['Music'], 'vinyl': ['Music'],
    'photo': ['Photography'], 'camera': ['Photography'], 'gimbal': ['Photography'],
    'tech': ['Technology'], 'technolog': ['Technology'], 'gadget': ['Technology'], 'charger': ['Technology'],
    'fashion': ['Fashion'], 'watch': ['Fashion', 'Luxury'], 'bag': ['Fashion'], 'wallet': ['Fashion'],
    'cook': ['Cooking'], 'kitchen': ['Cooking'], 'chef': ['Cooking'], 'knife': ['Cooking'], 'coffee': ['Cooking'], 'espresso': ['Cooking'],
    'plant': ['Plants'], 'garden': ['Plants'], 'bonsai': ['Plants'], 'monstera': ['Plants'],
    'skin': ['Skincare'], 'serum': ['Skincare'], 'cream': ['Skincare'],
    'luxury': ['Luxury'], 'perfume': ['Luxury', 'Skincare'],
    'travel': ['Travel'], 'luggage': ['Travel'], 'suitcase': ['Travel'],
    'coding': ['Coding'], 'code': ['Coding'], 'developer': ['Coding'], 'keyboard': ['Coding', 'Gaming', 'Technology'], 'mouse': ['Coding', 'Technology'],
    'ai': ['AI'], 'artificial intelligence': ['AI'], 'robot': ['Robotics'],
    'cricket': ['Cricket'], 'bat': ['Cricket'],
    'football': ['Football'], 'soccer': ['Football'],
    'bike': ['Bike'], 'motorcycle': ['Bike'], 'helmet': ['Bike'], 'riding': ['Bike'],
    'car': ['Cars'], 'dashcam': ['Cars'], 'automotive': ['Cars'],
    'cycle': ['Cycling'], 'cycling': ['Cycling'], 'bicycle': ['Cycling'],
    'art': ['Art'], 'paint': ['Art'], 'draw': ['Drawing'], 'sketch': ['Drawing'],
    'collectible': ['Collectibles'], 'figure': ['Collectibles', 'Anime'], 'statue': ['Collectibles', 'Anime'],
    'pet': ['Pets'], 'dog': ['Pets'], 'cat': ['Pets'], 'puppy': ['Pets'],
  };
  const budgetMatch = lower.match(/₹?\s*(\d{2,6})/);
  const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : 5000;
  const matchedInterests: string[] = [];
  for (const [kw, interests] of Object.entries(interestKeywords)) {
    if (lower.includes(kw)) matchedInterests.push(...interests);
  }
  const uniqueInterests = [...new Set(matchedInterests)];

  const matched = uniqueInterests.length
    ? giftCatalog
        .filter((g) => g.interests.some((i) => uniqueInterests.includes(i)) && getBestPrice(g).price <= budget * 1.25)
        .sort((a, b) => {
          const aM = uniqueInterests.filter((i) => a.interests.includes(i)).length;
          const bM = uniqueInterests.filter((i) => b.interests.includes(i)).length;
          if (bM !== aM) return bM - aM;
          return b.rating - a.rating;
        })
    : giftCatalog.filter((g) => getBestPrice(g).price <= budget * 1.25);

  const picks = (matched.length ? matched : giftCatalog).slice(0, 3).map((g) => ({
    ...g,
    matchScore: 80 + Math.floor(Math.random() * 18),
    reasons: ['Directly matches what you described'],
    explanation: `Based on your request, the ${g.name} is a stellar choice at ₹${getBestPrice(g).price.toLocaleString('en-IN')}.`,
    emotionPrediction: 'Pure joy',
    happinessMeter: 88,
    compatibilityScore: 85,
  }));

  let text = '';
  if (uniqueInterests.length) {
    text = `I found wonderful gifts for someone into ${uniqueInterests.slice(0, 3).join(', ')}${budgetMatch ? ` within your ₹${budget.toLocaleString('en-IN')} budget` : ''}. Here are my top recommendations:`;
  } else if (budgetMatch) {
    text = `Got it — around ₹${budget.toLocaleString('en-IN')}. Here are top-rated crowd-pleasers in that range:`;
  } else {
    text = `Here are a few gifts people love. Tell me more about who it is for and I can tailor it perfectly!`;
  }
  return { text, gifts: picks };
}
