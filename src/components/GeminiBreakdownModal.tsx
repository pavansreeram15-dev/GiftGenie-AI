import { useState, useEffect } from 'react';
import { X, Sparkles, Brain, Clock, Gift, MessageCircleHeart, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { geminiDeepBreakdown, type DeepBreakdownResult } from '@/gemini';
import { useApp } from '@/store';
import { getBestPrice } from '@/engine';
import { MatchRing } from '@/ui';
import type { GiftProduct } from '@/types';

interface GeminiBreakdownModalProps {
  product: GiftProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GeminiBreakdownModal({ product, isOpen, onClose }: GeminiBreakdownModalProps) {
  const { form } = useApp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DeepBreakdownResult | null>(null);

  const fetchBreakdown = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const res = await geminiDeepBreakdown(product, form);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      fetchBreakdown();
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const best = getBestPrice(product);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 14, 30, 0.96) 0%, rgba(8, 8, 18, 0.98) 100%)',
        }}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-primary-c">
                  Gemini Psychological Dossier
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  AI Deep Dive
                </span>
              </div>
              <p className="text-xs text-secondary-c">
                Gifting psychology & unboxing strategy calibrated for {form.relationship || 'your recipient'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c hover:text-primary-c hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot bar */}
        <div className="py-3 px-4 rounded-2xl glass-soft my-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-display font-bold text-xs text-primary-c truncate">{product.name}</h4>
              <div className="flex items-center gap-2 text-[11px] text-muted-c mt-0.5">
                <span className="text-emerald-400 font-bold">₹{best.price.toLocaleString('en-IN')}</span>
                <span>•</span>
                <span>{best.store}</span>
                <span>•</span>
                <span>★ {product.rating}</span>
              </div>
            </div>
          </div>

          {data && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-muted-c font-semibold uppercase">Dopamine Resonance</div>
                <div className="text-xs font-bold text-accent-400">High Impact</div>
              </div>
              <MatchRing score={data.dopamineTriggerScore} size={44} />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-4 flex-1 pr-1 pb-2">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-primary-400 animate-spin" />
              <p className="text-xs text-secondary-c font-medium animate-pulse">
                Gemini is analyzing behavioral psychology & presentation dynamics...
              </p>
            </div>
          ) : data ? (
            <>
              {/* 1. Psychological Hook */}
              <div className="p-4 rounded-2xl glass-soft border border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>The Psychological Hook</span>
                </div>
                <p className="text-xs text-primary-c leading-relaxed">
                  {data.psychologicalHook}
                </p>
              </div>

              {/* 2. Ideal Handover Moment */}
              <div className="p-4 rounded-2xl glass-soft border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>The Ideal Handover Moment</span>
                </div>
                <p className="text-xs text-primary-c leading-relaxed">
                  {data.idealHandoverMoment}
                </p>
              </div>

              {/* 3. Unboxing Ritual */}
              <div className="p-4 rounded-2xl glass-soft border border-rose-500/20 bg-rose-500/5">
                <div className="flex items-center gap-2 mb-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-rose-400" />
                  <span>Experiential Unboxing Strategy</span>
                </div>
                <p className="text-xs text-primary-c leading-relaxed">
                  {data.unboxingRitual}
                </p>
              </div>

              {/* 4. First 5 Seconds Reaction Forecast */}
              <div className="p-4 rounded-2xl glass-soft border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <MessageCircleHeart className="w-4 h-4 text-emerald-400" />
                  <span>Predicted First 5-Seconds Reaction</span>
                </div>
                <p className="text-xs text-emerald-200 italic font-medium leading-relaxed">
                  "{data.firstFiveSecondsReaction}"
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={fetchBreakdown}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-soft text-xs font-semibold text-secondary-c hover:text-primary-c transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerate Analysis
          </button>
          <button
            onClick={onClose}
            className="gradient-primary text-white font-bold px-6 py-2 rounded-xl text-xs shadow-lg shadow-primary-500/30 hover:scale-[1.02] active:scale-95 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
