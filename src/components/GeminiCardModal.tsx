import { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, RefreshCw, Printer, Heart, Laugh, Feather, Zap, Briefcase } from 'lucide-react';
import { geminiGenerateCardNote, type CardTone, type CardNoteResult } from '@/gemini';
import { useApp } from '@/store';
import type { GiftProduct } from '@/types';

interface GeminiCardModalProps {
  product: GiftProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const TONES: { id: CardTone; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'heartfelt', label: 'Heartfelt', icon: <Heart className="w-3.5 h-3.5 text-rose-400" />, desc: 'Emotional & deeply loving' },
  { id: 'witty', label: 'Witty', icon: <Laugh className="w-3.5 h-3.5 text-amber-400" />, desc: 'Playful banter & laughing' },
  { id: 'poetic', label: 'Poetic', icon: <Feather className="w-3.5 h-3.5 text-indigo-400" />, desc: 'Rhyming lyrical rhythm' },
  { id: 'short', label: 'Punchy', icon: <Zap className="w-3.5 h-3.5 text-accent-400" />, desc: 'Short & memorable' },
  { id: 'professional', label: 'Polite', icon: <Briefcase className="w-3.5 h-3.5 text-blue-400" />, desc: 'Dignified & respectful' },
];

export function GeminiCardModal({ product, isOpen, onClose }: GeminiCardModalProps) {
  const { form } = useApp();
  const [tone, setTone] = useState<CardTone>('heartfelt');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState<CardNoteResult | null>(null);

  const recipient = form.relationship || 'Someone Special';
  const occasion = form.occasion || 'This Milestone';

  const generate = async (selectedTone: CardTone) => {
    if (!product) return;
    setLoading(true);
    setCopied(false);
    try {
      const result = await geminiGenerateCardNote(
        product.name,
        recipient,
        occasion,
        selectedTone,
        form.relationship
      );
      setCard(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      generate(tone);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleCopy = () => {
    if (!card) return;
    const fullText = `${card.headline}\n\n${card.body}\n\n${card.signatureLine}\n${senderName || '— With love'}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
      <div
        className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-in print:shadow-none print:border-none print:bg-white print:text-black"
        style={{
          background: 'linear-gradient(135deg, rgba(18, 14, 32, 0.96) 0%, rgba(10, 8, 20, 0.98) 100%)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full print:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-rose flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-primary-c">
                Gemini AI Greeting Card
              </h2>
              <p className="text-xs text-secondary-c truncate max-w-xs sm:max-w-md">
                Personalized gift note for <span className="text-primary-c font-semibold">{product.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c hover:text-primary-c hover:bg-white/10 transition"
            aria-label="Close card modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="py-4 border-b border-white/10 shrink-0 print:hidden">
          <div className="text-[11px] font-bold text-muted-c uppercase tracking-wider mb-2">
            Select Card Tone:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTone(t.id);
                  generate(t.id);
                }}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  tone === t.id
                    ? 'gradient-primary text-white shadow-md shadow-primary-500/30'
                    : 'glass-soft text-secondary-c hover:text-primary-c hover:bg-white/10'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Digital Greeting Card Preview */}
        <div className="overflow-y-auto py-5 flex-1 pr-1">
          <div
            className="relative rounded-3xl p-6 sm:p-8 border border-amber-400/20 shadow-2xl text-center select-text transition-all"
            style={{
              background: 'linear-gradient(145deg, rgba(28, 22, 45, 0.9) 0%, rgba(16, 14, 28, 0.95) 100%)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.5), inset 0 0 40px rgba(255, 184, 77, 0.04)',
            }}
          >
            {/* Decorative Card Stamp / Ribbon */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-black tracking-widest text-amber-300 uppercase mb-5">
              <span>FOR {recipient.toUpperCase()}</span>
              <span>•</span>
              <span>{occasion.toUpperCase()}</span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-primary-400 animate-spin" />
                <p className="text-xs text-secondary-c font-medium animate-pulse">
                  Gemini is crafting a {tone} greeting message...
                </p>
              </div>
            ) : card ? (
              <>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-primary-c mb-4 leading-tight">
                  {card.headline}
                </h3>

                <p className="text-sm sm:text-base text-secondary-c leading-relaxed italic max-w-md mx-auto mb-6 whitespace-pre-line font-serif">
                  "{card.body}"
                </p>

                <div className="pt-4 border-t border-white/10 flex flex-col items-center">
                  <div className="text-xs text-muted-c font-semibold tracking-wider">
                    {card.signatureLine}
                  </div>
                  <div className="font-display font-bold text-base text-primary-c mt-1">
                    {senderName.trim() ? senderName : 'Your Gifter'}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Sender Customization */}
          <div className="mt-4 flex items-center gap-2 print:hidden">
            <span className="text-xs text-muted-c font-medium whitespace-nowrap">Your Signature:</span>
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Rahul, Your Bestie, Mom..."
              className="flex-1 px-3 py-1.5 rounded-xl glass-soft text-xs text-primary-c placeholder:text-muted-c border border-white/10 outline-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <button
            onClick={() => generate(tone)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-soft text-xs font-semibold text-secondary-c hover:text-primary-c transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-soft text-xs font-semibold text-secondary-c hover:text-primary-c transition"
              title="Print card or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-5 py-2 rounded-xl text-xs shadow-lg shadow-primary-500/30 hover:scale-[1.02] active:scale-95 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
