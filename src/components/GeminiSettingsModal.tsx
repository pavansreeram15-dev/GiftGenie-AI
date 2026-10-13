import { useState, useEffect } from 'react';
import { X, Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink, Cpu, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  getGeminiModel,
  setGeminiModel,
  testGeminiConnection,
  GEMINI_MODELS,
  type GeminiModel,
  hasGeminiKey,
} from '@/gemini';

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GeminiSettingsModal({ isOpen, onClose }: GeminiSettingsModalProps) {
  const [apiKey, setKey] = useState('');
  const [model, setModel] = useState<GeminiModel>('gemini-2.5-flash');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    model?: string;
    error?: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKey(getGeminiApiKey());
      setModel(getGeminiModel());
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(apiKey);
    setGeminiModel(model);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testGeminiConnection(apiKey, model);
    setTestResult(res);
    setTesting(false);
  };

  const handleClear = () => {
    setKey('');
    setGeminiApiKey('');
    setTestResult(null);
  };

  const isConfigured = hasGeminiKey() || apiKey.trim().length > 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 16, 38, 0.95) 0%, rgba(8, 8, 18, 0.98) 100%)',
        }}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/15 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-primary-500 to-accent-400 p-[1px] shadow-lg shadow-primary-500/30">
              <div className="w-full h-full bg-[#0d0d1a] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg text-primary-c">Google Gemini AI</h2>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-warm-500/20 text-warm-400 border border-warm-500/30'
                  }`}
                >
                  {isConfigured ? 'Live AI Enabled' : 'Demo Fallback Mode'}
                </span>
              </div>
              <p className="text-xs text-secondary-c">
                Configure your Gemini API key to unlock real-time generative intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass-soft flex items-center justify-center text-secondary-c hover:text-primary-c hover:bg-white/10 transition"
            aria-label="Close Gemini settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-primary-c flex items-center gap-1.5 uppercase tracking-wider">
                <Key className="w-3.5 h-3.5 text-accent-400" />
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-accent-400 hover:text-accent-300 flex items-center gap-1 transition"
              >
                <span>Get Free Key at Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-2xl glass-soft text-sm font-mono text-primary-c placeholder:text-muted-c border border-white/10 focus:border-primary-500/50 outline-none pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[11px] font-semibold text-muted-c hover:text-rose-400 px-2 py-1 transition"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] font-semibold text-secondary-c hover:text-primary-c px-2 py-1 rounded-lg glass-soft transition"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-muted-c mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Your key is saved locally in your browser storage and never sent to any third-party backend.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-xs font-bold text-primary-c flex items-center gap-1.5 uppercase tracking-wider mb-2.5">
              <Cpu className="w-3.5 h-3.5 text-primary-400" />
              Gemini Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GEMINI_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`p-3 rounded-2xl text-left border transition cursor-pointer ${
                    model === m.id
                      ? 'bg-primary-500/15 border-primary-500/50 shadow-md shadow-primary-500/10'
                      : 'glass-soft border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-primary-c">{m.name}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        m.tag === 'Recommended'
                          ? 'bg-accent-500/20 text-accent-400'
                          : 'bg-white/10 text-secondary-c'
                      }`}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-c leading-relaxed">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Connection Test Status */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold">
                  {testResult.success ? 'Gemini Connection Verified!' : 'Connection Check Failed'}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {testResult.success
                    ? `Successfully pinged ${testResult.model} in ${testResult.latencyMs}ms. Ready for live inference!`
                    : testResult.error}
                </div>
              </div>
            </div>
          )}

          {/* Active Features Info Card */}
          <div className="glass-soft rounded-2xl p-4 border border-white/5">
            <div className="text-xs font-bold text-secondary-c uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-warm-400" />
              Supercharged Gemini Features
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-secondary-c">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span>Natural Language Recipient Parser</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span>Personalized Greeting Card Generator</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span>Conversational AI Gift Concierge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span>Deep Psychological Gift Breakdown</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span>Gift Basket Vibe Check & Roast/Toast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span>Bespoke Unboxing & Delivery Rituals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !apiKey.trim()}
            className="inline-flex items-center gap-2 glass-soft text-secondary-c hover:text-primary-c font-semibold px-4 py-2.5 rounded-xl text-xs transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl glass-soft text-xs font-semibold text-secondary-c hover:text-primary-c transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-primary-500/30 hover:scale-[1.02] active:scale-95 transition"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  Saved!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  Save & Apply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
