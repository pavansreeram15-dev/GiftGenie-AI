import { useState } from 'react';
import { Sparkles, RefreshCw, Flame, Wine, Lightbulb, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { geminiVibeCheck, type VibeCheckResult } from '@/gemini';
import { useApp } from '@/store';
import { MatchRing, fireConfetti } from '@/ui';
import type { GiftProduct } from '@/types';

interface GeminiVibeCheckProps {
  products: GiftProduct[];
  compact?: boolean;
}

export function GeminiVibeCheck({ products, compact = false }: GeminiVibeCheckProps) {
  const { form } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VibeCheckResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (products.length === 0) return null;

  const handleRunVibeCheck = async () => {
    setLoading(true);
    setExpanded(true);
    try {
      const data = await geminiVibeCheck(products, form);
      setResult(data);
      fireConfetti(40);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full my-6 select-none ${compact ? 'text-xs' : ''}`}>
      <div
        className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10 relative overflow-hidden transition-all shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(22, 16, 42, 0.9) 0%, rgba(10, 8, 22, 0.95) 100%)',
        }}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-accent-400/10 blur-[80px] pointer-events-none rounded-full" />

        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-primary-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-sm sm:text-base text-primary-c">
                  Gemini Gift Vibe Check & Roast/Toast
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/25">
                  AI Roast
                </span>
              </div>
              <p className="text-xs text-secondary-c">
                Let Gemini critique your gift collection's thoughtfulness, humor & sentiment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!result ? (
              <button
                onClick={handleRunVibeCheck}
                disabled={loading}
                className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-primary-500/30 hover:scale-[1.03] active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Vibe...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-accent-400" />
                    <span>Run Vibe Check</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1.5 glass-soft px-3.5 py-2 rounded-xl text-xs font-semibold text-secondary-c hover:text-primary-c transition cursor-pointer"
              >
                <span>{expanded ? 'Collapse' : 'View Breakdown'}</span>
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Result Area */}
        {result && expanded && (
          <div className="mt-5 pt-5 border-t border-white/10 animate-fade-in space-y-4">
            {/* Top Score Banner */}
            <div className="p-4 rounded-2xl glass-soft flex items-center justify-between gap-4 flex-wrap bg-white/4">
              <div>
                <span className="text-[10px] font-extrabold text-muted-c uppercase tracking-wider">
                  Gemini Verdict
                </span>
                <div className="font-display font-extrabold text-base sm:text-lg text-primary-c">
                  "{result.verdictTitle}"
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-muted-c font-semibold uppercase">Thoughtfulness Score</div>
                  <div className="text-xs font-bold text-emerald-400">Top Tier</div>
                </div>
                <MatchRing score={result.score} size={48} />
              </div>
            </div>

            {/* Roast & Toast Grid */}
            <div className="grid md:grid-cols-2 gap-3.5">
              {/* The Roast */}
              <div className="p-4 rounded-2xl border border-rose-500/25 bg-rose-500/5 glass-soft">
                <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>The Roast (With Love)</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed italic">
                  "{result.roast}"
                </p>
              </div>

              {/* The Toast */}
              <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 glass-soft">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Wine className="w-4 h-4 text-amber-400" />
                  <span>The Toast (Why It Rocks)</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  "{result.toast}"
                </p>
              </div>
            </div>

            {/* Pro Gifter Secret */}
            <div className="p-3.5 rounded-2xl border border-accent-400/25 bg-accent-400/5 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-accent-300">Pro-Gifter Secret: </span>
                <span className="text-secondary-c">{result.proGifterTip}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
