import type { GiftProduct, WizardForm, Recommendation, Relationship, Occasion, Gender, Store, Personality } from './types';
import { giftCatalog } from './data';
import { getBestPrice, searchUrl } from './engine';

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'gemini-1.5-pro';

export const GEMINI_MODELS: { id: GeminiModel; name: string; tag: string; desc: string }[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'Recommended', desc: 'Fastest, state-of-the-art multimodal reasoning' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tag: 'Fast', desc: 'High speed and balanced efficiency' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tag: 'Next-Gen', desc: 'Next-generation low-latency inference' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tag: 'Deep Thinking', desc: 'Deepest reasoning for complex emotional profiles' },
];

const STORAGE_KEY = 'gg-gemini-key';
const STORAGE_MODEL = 'gg-gemini-model';

export function getGeminiApiKey(): string {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local && local.trim()) return local.trim();
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) return envKey.trim();
  return '';
}

export function setGeminiApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getGeminiModel(): GeminiModel {
  const local = localStorage.getItem(STORAGE_MODEL) as GeminiModel | null;
  if (local && GEMINI_MODELS.some((m) => m.id === local)) return local;
  return 'gemini-2.5-flash';
}

export function setGeminiModel(model: GeminiModel): void {
  localStorage.setItem(STORAGE_MODEL, model);
}

export function hasGeminiKey(): boolean {
  return getGeminiApiKey().length > 5;
}

/* ─── Raw Gemini API Call ─── */
export async function callGemini(
  prompt: string,
  options?: {
    systemInstruction?: string;
    temperature?: number;
    jsonMode?: boolean;
    model?: GeminiModel;
  }
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('MISSING_KEY: No Gemini API Key configured.');
  }

  const model = options?.model || getGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, any> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: 2048,
    },
  };

  if (options?.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  if (options?.jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(`Gemini API Error: ${message}`);
  }

  const data = await res.json();
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('Gemini returned an empty response.');
  }
  return candidateText;
}

/* ─── Live Connection Test ─── */
export async function testGeminiConnection(
  apiKeyCandidate?: string,
  modelCandidate?: GeminiModel
): Promise<{ success: boolean; latencyMs: number; model: string; error?: string }> {
  const start = performance.now();
  const key = (apiKeyCandidate ?? getGeminiApiKey()).trim();
  const model = modelCandidate ?? getGeminiModel();

  if (!key) {
    return { success: false, latencyMs: 0, model, error: 'Please enter a Gemini API Key.' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Respond with the single word: "READY"' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });

    const elapsed = Math.round(performance.now() - start);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        latencyMs: elapsed,
        model,
        error: err?.error?.message || `HTTP ${res.status} error`,
      };
    }

    return { success: true, latencyMs: elapsed, model };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Math.round(performance.now() - start),
      model,
      error: err.message || 'Network connection failed.',
    };
  }
}

/* ─── Feature 1: Freeform Natural Language Recipient Parser ─── */
export interface ParsedRecipient {
  relationship: Relationship;
  occasion: Occasion;
  gender: Gender;
  age: number;
  budget: number;
  interests: string[];
  personality: Personality[];
  store: Store;
  aiInsight: string;
}

export async function parseRecipientPromptWithGemini(promptText: string): Promise<ParsedRecipient> {
  const prompt = `Analyze this description of a gift recipient and extract structured parameters for our gift recommendation platform.

User prompt: "${promptText}"

Available Relationships: ['Best Friend', 'Girlfriend', 'Boyfriend', 'Wife', 'Husband', 'Mother', 'Father', 'Sister', 'Brother', 'Friend', 'Colleague', 'Teacher', 'Kids', 'Pets', 'Others']
Available Occasions: ['Birthday', 'Wedding', 'Anniversary', 'Valentine', 'Diwali', 'Christmas', 'New Year', 'Housewarming', 'Baby Shower', 'Graduation', 'Promotion', 'Farewell', 'Raksha Bandhan', 'Festival', 'Eid', 'Pongal', "Mother's Day", "Father's Day", 'Friendship Day', 'Custom']
Available Genders: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
Available Passions/Interests: ['Gaming', 'Anime', 'Books', 'Fitness', 'Cooking', 'Music', 'Photography', 'Technology', 'Fashion', 'Travel', 'Cars', 'Bike', 'Sports', 'Movies', 'Plants', 'Pets', 'Art', 'Drawing', 'Coding', 'AI', 'Robotics', 'Cricket', 'Football', 'Cycling', 'Gym', 'Skincare', 'Luxury', 'Collectibles']
Available Personalities: ['Funny', 'Introvert', 'Extrovert', 'Creative', 'Minimalist', 'Luxury Lover', 'Practical', 'Geek', 'Adventure', 'Romantic', 'Professional']
Available Stores: ['Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Ajio', 'Croma', 'Reliance Digital', 'Meesho', 'Any']

Return JSON strictly matching this schema:
{
  "relationship": string,
  "occasion": string,
  "gender": string,
  "age": number (between 5 and 90, sensible guess if not specified),
  "budget": number (in Indian Rupees INR, e.g. 2000, 3500, 5000),
  "interests": string[] (1 to 4 items from the available interests list),
  "personality": string[] (1 to 3 items from available personalities),
  "store": string (e.g. "Amazon" or "Any"),
  "aiInsight": string (1-2 empathetic sentences explaining what makes this recipient unique and what feeling the gift should inspire)
}`;

  if (hasGeminiKey()) {
    try {
      const raw = await callGemini(prompt, { jsonMode: true, temperature: 0.2 });
      const parsed = JSON.parse(raw);
      return {
        relationship: parsed.relationship || 'Friend',
        occasion: parsed.occasion || 'Birthday',
        gender: parsed.gender || 'Prefer not to say',
        age: Number(parsed.age) || 25,
        budget: Number(parsed.budget) || 3000,
        interests: Array.isArray(parsed.interests) ? parsed.interests : ['Technology'],
        personality: Array.isArray(parsed.personality) ? parsed.personality : ['Creative'],
        store: parsed.store || 'Any',
        aiInsight: parsed.aiInsight || 'A personalized selection calibrated for maximum thoughtfulness.',
      };
    } catch (err) {
      console.warn('Gemini parser fallback activated:', err);
    }
  }

  // Graceful local heuristic fallback
  return fallbackParsePrompt(promptText);
}

function fallbackParsePrompt(text: string): ParsedRecipient {
  const lower = text.toLowerCase();
  let relationship: Relationship = 'Friend';
  if (lower.includes('girlfriend') || lower.includes('gf')) relationship = 'Girlfriend';
  else if (lower.includes('boyfriend') || lower.includes('bf')) relationship = 'Boyfriend';
  else if (lower.includes('wife')) relationship = 'Wife';
  else if (lower.includes('husband')) relationship = 'Husband';
  else if (lower.includes('mom') || lower.includes('mother')) relationship = 'Mother';
  else if (lower.includes('dad') || lower.includes('father')) relationship = 'Father';
  else if (lower.includes('sister')) relationship = 'Sister';
  else if (lower.includes('brother')) relationship = 'Brother';
  else if (lower.includes('colleague') || lower.includes('boss') || lower.includes('coworker')) relationship = 'Colleague';
  else if (lower.includes('best friend') || lower.includes('bestie')) relationship = 'Best Friend';

  let occasion: Occasion = 'Birthday';
  if (lower.includes('wedding') || lower.includes('marriage')) occasion = 'Wedding';
  else if (lower.includes('anniversary')) occasion = 'Anniversary';
  else if (lower.includes('valentine')) occasion = 'Valentine';
  else if (lower.includes('diwali')) occasion = 'Diwali';
  else if (lower.includes('christmas')) occasion = 'Christmas';
  else if (lower.includes('housewarming')) occasion = 'Housewarming';
  else if (lower.includes('graduation')) occasion = 'Graduation';
  else if (lower.includes('promotion')) occasion = 'Promotion';

  let gender: Gender = 'Prefer not to say';
  if (lower.includes('sister') || lower.includes('girlfriend') || lower.includes('mom') || lower.includes('wife') || lower.includes('her') || lower.includes('female')) {
    gender = 'Female';
  } else if (lower.includes('brother') || lower.includes('boyfriend') || lower.includes('dad') || lower.includes('husband') || lower.includes('him') || lower.includes('male')) {
    gender = 'Male';
  }

  const ageMatch = lower.match(/(\d{1,2})\s*(?:yo|yr|years|year old)/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : 26;

  const budgetMatch = lower.match(/(?:₹|rs\.?|inr|budget)?\s*(\d{3,6})/);
  const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : 3500;

  const interests: string[] = [];
  if (lower.includes('game') || lower.includes('gaming')) interests.push('Gaming');
  if (lower.includes('anime') || lower.includes('manga')) interests.push('Anime');
  if (lower.includes('book') || lower.includes('read')) interests.push('Books');
  if (lower.includes('coffee') || lower.includes('cook') || lower.includes('baking')) interests.push('Cooking');
  if (lower.includes('tech') || lower.includes('gadget') || lower.includes('keyboard')) interests.push('Technology');
  if (lower.includes('skin') || lower.includes('beauty') || lower.includes('makeup')) interests.push('Skincare');
  if (lower.includes('music') || lower.includes('song') || lower.includes('guitar')) interests.push('Music');
  if (lower.includes('photo') || lower.includes('camera')) interests.push('Photography');
  if (lower.includes('fashion') || lower.includes('style') || lower.includes('dress')) interests.push('Fashion');
  if (lower.includes('fit') || lower.includes('gym') || lower.includes('workout')) interests.push('Fitness');
  if (lower.includes('plant') || lower.includes('garden')) interests.push('Plants');
  if (interests.length === 0) interests.push('Technology', 'Books');

  return {
    relationship,
    occasion,
    gender,
    age,
    budget,
    interests: interests.slice(0, 3),
    personality: ['Creative', 'Practical'],
    store: 'Any',
    aiInsight: `We mapped ${relationship}'s persona for their ${occasion}. Focus is on thoughtful quality that elevates their daily rituals.`,
  };
}

/* ─── Feature 2: Gemini Live Conversational Chat ─── */
export async function geminiChatWithAssistant(
  userMessage: string,
  history: Array<{ role: 'user' | 'ai'; text: string }>,
  currentForm?: WizardForm
): Promise<{ text: string; gifts: Recommendation[]; isLiveAi: boolean }> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const catalogSummary = giftCatalog.slice(0, 35).map((g) => ({
        id: g.id,
        name: g.name,
        price: getBestPrice(g).price,
        store: getBestPrice(g).store,
        interests: g.interests.join(', '),
      }));

      const contextPrompt = `You are GiftGenie AI, a warm, witty, and deeply empathetic gift shopping consultant for Indian shoppers.
The user is asking you for gift advice.
Our catalog includes products across Amazon, Flipkart, Myntra, Nykaa, Croma, and AJIO with prices in INR (₹).

Catalog sample:
${JSON.stringify(catalogSummary, null, 2)}

Recipient context (if known):
${currentForm ? `Relationship: ${currentForm.relationship}, Occasion: ${currentForm.occasion}, Age: ${currentForm.age}, Budget: ₹${currentForm.budget}, Interests: ${currentForm.interests.join(', ')}` : 'None yet.'}

Chat history:
${history.slice(-4).map((h) => `${h.role.toUpperCase()}: ${h.text}`).join('\n')}

USER MESSAGE: "${userMessage}"

Respond in JSON format:
{
  "message": "Your conversational, helpful response in 2-4 sentences with formatting, advice, and personality",
  "recommendedProductIds": ["id1", "id2", "id3"] // Choose 1-3 best matching IDs from our catalog sample that fit the request, or empty if none fit
}`;

      const raw = await callGemini(contextPrompt, { jsonMode: true, temperature: 0.6 });
      const parsed = JSON.parse(raw);

      const matchedProducts = (parsed.recommendedProductIds || [])
        .map((id: string) => giftCatalog.find((g) => g.id === id))
        .filter(Boolean) as GiftProduct[];

      const recs: Recommendation[] = matchedProducts.map((g) => ({
        ...g,
        matchScore: 88 + Math.floor(Math.random() * 10),
        reasons: ['Selected specifically by Gemini AI for your conversation'],
        explanation: `Gemini AI picked the ${g.name} (₹${getBestPrice(g).price.toLocaleString('en-IN')}) as a direct match for this conversation.`,
        emotionPrediction: 'Pure delight',
        happinessMeter: 92,
        compatibilityScore: 90,
      }));

      return {
        text: parsed.message || 'Here are some thoughtful ideas based on what you shared!',
        gifts: recs.length > 0 ? recs : getKeywordFallbackGifts(userMessage),
        isLiveAi: true,
      };
    } catch (err) {
      console.warn('Gemini chat failed, falling back to local engine:', err);
    }
  }

  // Fallback to local intelligent search
  const fallback = getKeywordFallbackGifts(userMessage);
  return {
    text: `I've found some thoughtful gift ideas tailored to your budget and interests. (Tip: Connect your free Gemini API Key in the top bar to unlock live conversational LLM reasoning!)`,
    gifts: fallback,
    isLiveAi: false,
  };
}

function getKeywordFallbackGifts(message: string): Recommendation[] {
  const lower = message.toLowerCase();
  const matched = giftCatalog
    .filter((g) => {
      const matchName = g.name.toLowerCase().includes(lower);
      const matchInterest = g.interests.some((i) => lower.includes(i.toLowerCase()));
      const matchTag = g.tags.some((t) => lower.includes(t.toLowerCase()));
      return matchName || matchInterest || matchTag;
    })
    .slice(0, 3);

  const pool = matched.length > 0 ? matched : giftCatalog.slice(0, 3);
  return pool.map((g) => ({
    ...g,
    matchScore: 85,
    reasons: ['Matches your keyword query'],
    explanation: `The ${g.name} is a versatile, high-rated option at ₹${getBestPrice(g).price.toLocaleString('en-IN')}.`,
    emotionPrediction: 'Warm gratitude',
    happinessMeter: 86,
    compatibilityScore: 84,
  }));
}

/* ─── Feature 3: Personalized Greeting Card / Gift Note Generator ─── */
export type CardTone = 'heartfelt' | 'witty' | 'poetic' | 'short' | 'professional';

export interface CardNoteResult {
  headline: string;
  body: string;
  signatureLine: string;
  tone: CardTone;
}

export async function geminiGenerateCardNote(
  productName: string,
  recipient: string,
  occasion: string,
  tone: CardTone,
  relationship?: string
): Promise<CardNoteResult> {
  const who = recipient || relationship || 'someone special';
  const occ = occasion || 'this special day';

  const toneGuidelines: Record<CardTone, string> = {
    heartfelt: 'deeply emotional, warm, tearjerker, expressing profound gratitude and love',
    witty: 'hilarious, witty, playful teasing, joyful and lighthearted',
    poetic: 'lyrical, rhyming or poetic cadence, evocative, memorable',
    short: 'punchy, modern, elegant, 1-2 impactful sentences',
    professional: 'respectful, elegant, warm yet dignified for a colleague or mentor',
  };

  const prompt = `Write a personalized greeting card note to attach with a gift.

Gift: "${productName}"
Recipient: "${who}"
Occasion: "${occ}"
Tone requested: ${toneGuidelines[tone]}

Return JSON:
{
  "headline": "A short 2-5 word greeting title (e.g. 'To My Favorite Human' or 'Happy Milestone')",
  "body": "The main message body (2-4 sentences, beautifully written without clichés, acknowledging their bond and the gift)",
  "signatureLine": "A closing sign-off (e.g. 'With all my love,' or 'Cheers to you,')"
}`;

  if (hasGeminiKey()) {
    try {
      const raw = await callGemini(prompt, { jsonMode: true, temperature: 0.8 });
      const parsed = JSON.parse(raw);
      return {
        headline: parsed.headline || `For ${who}`,
        body: parsed.body || `Wishing you the happiest ${occ}. May this ${productName} bring a smile to your days.`,
        signatureLine: parsed.signatureLine || 'Warmest wishes,',
        tone,
      };
    } catch (err) {
      console.warn('Gemini card note generation fallback:', err);
    }
  }

  // High quality curated local fallback templates
  const fallbacks: Record<CardTone, CardNoteResult> = {
    heartfelt: {
      headline: `To My Wonderful ${who}`,
      body: `Happy ${occ}! When I saw this ${productName}, I immediately thought of you and the joy you bring into my world. Thank you for simply being you.`,
      signatureLine: 'With all my love & warmest hugs,',
      tone,
    },
    witty: {
      headline: `Alert: Epic Human Celebration`,
      body: `Happy ${occ}! I spent at least three minutes deliberating before deciding you deserved something as awesome as this ${productName}. You're welcome!`,
      signatureLine: 'From your favorite accomplice,',
      tone,
    },
    poetic: {
      headline: `Moments That Glow`,
      body: `To celebrate you and the path you tread,\nWith dreams in your eyes and love ahead.\nMay this ${productName} mark your day,\nIn every bright and joyful way.`,
      signatureLine: 'Forever cheering you on,',
      tone,
    },
    short: {
      headline: `Cheers to You!`,
      body: `Happy ${occ}! Hope this ${productName} adds a little extra spark to your celebrations today.`,
      signatureLine: 'Always,',
      tone,
    },
    professional: {
      headline: `Warmest Congratulations`,
      body: `Wishing you a wonderful ${occ}. May this ${productName} serve as a token of genuine appreciation for all your dedication and brilliance.`,
      signatureLine: 'Warm regards & best wishes,',
      tone,
    },
  };

  return fallbacks[tone];
}

/* ─── Feature 4: Gemini Deep Psychological Breakdown & Unboxing Ritual ─── */
export interface DeepBreakdownResult {
  psychologicalHook: string;
  idealHandoverMoment: string;
  unboxingRitual: string;
  firstFiveSecondsReaction: string;
  dopamineTriggerScore: number;
}

export async function geminiDeepBreakdown(
  product: GiftProduct,
  form: WizardForm
): Promise<DeepBreakdownResult> {
  const prompt = `Perform a deep psychological gifting analysis for this product and recipient.

Product: ${product.name} (Tags: ${product.tags.join(', ')}, Interests: ${product.interests.join(', ')})
Recipient: ${form.relationship || 'Friend'}, Age: ${form.age}, Occasion: ${form.occasion || 'Special celebration'}
Personality: ${form.personality.join(', ') || 'Dynamic'}

Return JSON:
{
  "psychologicalHook": "Explain in 2 insightful sentences why this exact item triggers emotional satisfaction and dopamine for someone with their personality traits.",
  "idealHandoverMoment": "Describe the ideal physical setting and timing to hand them this gift (e.g. over morning espresso, right after dinner, in a quiet moment).",
  "unboxingRitual": "Suggest a creative unboxing or wrapping presentation idea to make receiving this an unforgettable experiential event.",
  "firstFiveSecondsReaction": "Predict their exact facial expression and what words they will blurt out in the first 5 seconds.",
  "dopamineTriggerScore": 94 // integer between 85 and 99
}`;

  if (hasGeminiKey()) {
    try {
      const raw = await callGemini(prompt, { jsonMode: true, temperature: 0.7 });
      const parsed = JSON.parse(raw);
      return {
        psychologicalHook: parsed.psychologicalHook || product.story,
        idealHandoverMoment: parsed.idealHandoverMoment || 'Present it during a quiet, unhurried moment.',
        unboxingRitual: parsed.unboxingRitual || 'Wrap it with textured craft paper and a handwritten note.',
        firstFiveSecondsReaction: parsed.firstFiveSecondsReaction || '"Wait, how did you know I needed this?!"',
        dopamineTriggerScore: Number(parsed.dopamineTriggerScore) || 92,
      };
    } catch (err) {
      console.warn('Gemini breakdown fallback:', err);
    }
  }

  return {
    psychologicalHook: `The ${product.name} satisfies their natural appreciation for craftsmanship and ${product.interests[0] || 'quality design'}, creating an instant feeling of being truly seen and understood.`,
    idealHandoverMoment: `Hand it to them when the celebrations wind down into a cozy, intimate conversation so they can take in the details without being rushed.`,
    unboxingRitual: `Pair it with a minimalist ribbon and tuck a handwritten note under the knot containing a shared inside joke.`,
    firstFiveSecondsReaction: `"Wait, you actually remembered?! I've been eyeing something like this for so long!"`,
    dopamineTriggerScore: 94,
  };
}

/* ─── Feature 5: Gemini Gift Basket Vibe Check & Roast / Toast ─── */
export interface VibeCheckResult {
  score: number;
  verdictTitle: string;
  roast: string;
  toast: string;
  proGifterTip: string;
}

export async function geminiVibeCheck(
  products: GiftProduct[],
  form: WizardForm
): Promise<VibeCheckResult> {
  const titles = products.slice(0, 5).map((p) => p.name).join(', ');
  const prompt = `Act as an expert gift curator doing an entertaining "Vibe Check" on a user's gift choices.

Recipient: ${form.relationship || 'Loved one'}, Occasion: ${form.occasion || 'Celebration'}, Budget: ₹${form.budget}
Selected Gifts: ${titles}

Return JSON:
{
  "score": 96, // Thoughtfulness score between 75 and 99
  "verdictTitle": "A witty 3-word verdict title (e.g. 'Tactical Elegance Masterclass' or 'Unapologetic Crowd Pleaser')",
  "roast": "A playful, affectionate 1-2 sentence roast of the giver's style (funny teasing)",
  "toast": "A genuine, heartfelt 2 sentence toast praising why this selection will create lasting memories",
  "proGifterTip": "One unconventional pro-level tip for wrapping or delivering these gifts"
}`;

  if (hasGeminiKey()) {
    try {
      const raw = await callGemini(prompt, { jsonMode: true, temperature: 0.7 });
      const parsed = JSON.parse(raw);
      return {
        score: Number(parsed.score) || 94,
        verdictTitle: parsed.verdictTitle || 'Pure Thoughtfulness Engine',
        roast: parsed.roast || 'You clearly did your homework—almost like you hired a private investigator!',
        toast: parsed.toast || 'These gifts strike the sweet spot between daily utility and emotional resonance. They are going to brag about you to their friends.',
        proGifterTip: parsed.proGifterTip || 'Never reveal where you got the inspiration—let them believe you have telepathic radar.',
      };
    } catch (err) {
      console.warn('Gemini vibe check fallback:', err);
    }
  }

  return {
    score: 95,
    verdictTitle: 'Effortless Thoughtfulness',
    roast: `You definitely take gifting more seriously than 99% of humanity—admit it, you spent hours thinking about this!`,
    toast: `This combination strikes the golden balance: high utility, aesthetic appeal, and deep personalization for their ${form.occasion || 'celebration'}.`,
    proGifterTip: `Include a custom playlist QR code inside the box to accompany the unboxing experience.`,
  };
}
