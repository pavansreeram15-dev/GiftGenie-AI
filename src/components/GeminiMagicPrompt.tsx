import { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, RefreshCw, Check, SlidersHorizontal, Lightbulb, Zap } from 'lucide-react';
import { parseRecipientPromptWithGemini, type ParsedRecipient, hasGeminiKey } from '@/gemini';
import { useApp } from '@/store';
import { recommend } from '@/engine';
import type { Recommendation, WizardForm } from '@/types';
import { fireConfetti } from '@/ui';

const SAMPLE_PROMPTS = [
  '☕ Dad who loves South Indian filter coffee & biographies, budget ₹2500',
  '🎮 Techie boyfriend into mechanical keyboards & anime, budget ₹4500',
  '✨ Sister getting married, loves luxury skincare & indie music, ₹5000',
  '🪴 Creative bestie into indoor monstera plants & sketching, ₹2000',
];

interface GeminiMagicPromptProps {
  onDirectComplete?: (recs: Recommendation[]) => void;
  onOpenWizard?: () => void;
  compact?: boolean;
}

export function GeminiMagicPrompt({ onDirectComplete, onOpenWizard, compact = false }: GeminiMagicPromptProps) {
  const { setForm } = useApp();
  const [prompt, setPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ParsedRecipient | null>(null);

  const handleAnalyze = async (overrideText?: string) => {
    const text = overrideText ?? prompt;
    if (!text.trim()) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const parsed = await parseRecipientPromptWithGemini(text);
      setResult(parsed);
      // Auto-update app form store with the parsed recipient
      setForm((prev) => ({
        ...prev,
        relationship: parsed.relationship,
        occasion: parsed.occasion,
        gender: parsed.gender,
        age: parsed.age,
        budget: parsed.budget,
        interests: parsed.interests,
        personality: parsed.personality,
        store: parsed.store,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLaunchDirect = () => {
    if (!result) return;
    fireConfetti(60);
    const formToRun: WizardForm = {
      relationship: result.relationship,
      occasion: result.occasion,
      gender: result.gender,
      age: result.age,
      budget: result.budget,
      interests: result.interests,
      personality: result.personality,
      store: result.store,
    };
    const recs = recommend(formToRun);
    if (onDirectComplete) {
      onDirectComplete(recs);
    }
  };

  const handleLaunchWizard = () => {
    if (onOpenWizard) {
      onOpenWizard();
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${compact ? 'my-4' : 'my-8'} text-left relative z-20`}>
      {/* Outer futuristic frame */}
      <div
        className="glass-card rounded-3xl p-5 sm:p-7 border border-primary-500/30 relative overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 16, 40, 0.88) 0%, rgba(8, 8, 20, 0.94) 100%)',
          boxShadow: '0 16px 48px rgba(124, 77, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-36 bg-gradient-to-l from-primary-500/20 via-accent-400/10 to-transparent blur-3xl pointer-events-none" />

        {/* Top bar with Gemini Pill */}
        <div className="flex items-center justify-between gap-3 mb-3.5 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary-500/30">
              <Wand2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-extrabold text-sm text-primary-c tracking-wide">
              Gemini Magic Prompt
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-400/15 text-accent-400 border border-accent-400/25">
              AI Freeform
            </span>
          </div>

          <div className="text-[11px] text-secondary-c flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {hasGeminiKey() ? 'Gemini 2.5 Flash Connected' : 'Smart Gemini Parser'}
          </div>
        </div>

        <p className="text-xs text-secondary-c mb-3 leading-relaxed">
          Skip the 7 steps! Describe your recipient naturally—Gemini extracts their personality, passions, and budget instantly.
        </p>

        {/* Input & Action */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze();
              }}
              placeholder="e.g. My 24yo sister who loves anime, matcha, and cozy bedroom aesthetics, budget ₹3000..."
              className="w-full px-4 py-3.5 rounded-2xl glass-soft text-sm text-primary-c placeholder:text-muted-c border border-white/10 focus:border-primary-500/60 focus:ring-2 ring-primary-500/20 outline-none transition"
              aria-label="Describe your gift recipient"
            />
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing || !prompt.trim()}
            className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm shrink-0"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>Parse with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-muted-c font-bold uppercase tracking-wider mr-1">
            Try:
          </span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleAnalyze(p);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg glass-soft text-secondary-c hover:text-primary-c hover:bg-white/10 transition border border-white/5 cursor-pointer truncate max-w-[280px]"
              title={p}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Gemini Parsed Result Card */}
        {result && (
          <div className="mt-5 pt-5 border-t border-white/10 animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/25 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-warm-400" />
                <span className="font-bold text-xs text-primary-c">Gemini Recipient Breakdown</span>
              </div>
              <p className="text-xs text-secondary-c italic leading-relaxed mb-3">
                "{result.aiInsight}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="glass-soft p-2.5 rounded-xl">
                  <div className="text-[10px] text-muted-c font-semibold uppercase">Recipient</div>
                  <div className="font-bold text-primary-c mt-0.5">{result.relationship} ({result.age}y)</div>
                </div>
                <div className="glass-soft p-2.5 rounded-xl">
                  <div className="text-[10px] text-muted-c font-semibold uppercase">Occasion</div>
                  <div className="font-bold text-primary-c mt-0.5">{result.occasion}</div>
                </div>
                <div className="glass-soft p-2.5 rounded-xl">
                  <div className="text-[10px] text-muted-c font-semibold uppercase">Budget</div>
                  <div className="font-bold text-emerald-400 mt-0.5">₹{result.budget.toLocaleString('en-IN')}</div>
                </div>
                <div className="glass-soft p-2.5 rounded-xl">
                  <div className="text-[10px] text-muted-c font-semibold uppercase">Passions</div>
                  <div className="font-bold text-accent-400 mt-0.5 truncate">{result.interests.join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 flex-wrap">
              {onOpenWizard && (
                <button
                  onClick={handleLaunchWizard}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-soft text-xs font-bold text-secondary-c hover:text-primary-c transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Customize in 7 Steps
                </button>
              )}
              {onDirectComplete && (
                <button
                  onClick={handleLaunchDirect}
                  className="inline-flex items-center gap-2 gradient-accent text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-accent-400/20 hover:scale-[1.03] active:scale-95 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  Generate Matching Gifts Instantly
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
