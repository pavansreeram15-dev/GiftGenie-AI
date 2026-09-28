import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Gift, ExternalLink } from 'lucide-react';
import { useApp } from '@/store';
import { chatAssistant } from '@/engine';
import { getBestPrice, searchUrl } from '@/engine';
import { MatchRing } from '@/ui';
import type { ChatMessage } from '@/types';

const QUICK_PROMPTS = [
  'Gift for my girlfriend under ₹2000',
  'Something for a tech lover, ₹5000',
  'Birthday gift for mom, she loves cooking',
  'Surprise me with something unique!',
];

export function Chatbot() {
  const { openChat, setOpenChat, toggleWishlist, inWishlist } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: "Hi! I'm your AI Gift Assistant 🎁\n\nTell me about who you're shopping for — their interests, your budget, the occasion. I'll find the perfect gift instantly!",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  if (!openChat) {
    return (
      <button
        onClick={() => setOpenChat(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl gradient-primary text-white shadow-2xl shadow-primary-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition animate-float"
        aria-label="Open AI Gift Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-500 rounded-full border-2 border-bg-base" />
      </button>
    );
  }

  const send = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: msg };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = chatAssistant(userMsg.text);
      setMessages((m) => [...m, { role: 'ai', text: res.text, gifts: res.gifts }]);
      setTyping(false);
    }, 900 + Math.random() * 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[640px] max-h-[85vh] glass rounded-3xl flex flex-col overflow-hidden animate-scale-in shadow-2xl shadow-black/60">

      {/* Header */}
      <div className="gradient-primary p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-extrabold text-white text-sm tracking-wide">GiftGenie Assistant</div>
            <div className="text-[10px] text-white/75 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 bg-accent-400 rounded-full" /> AI Online
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpenChat(false)}
          className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            {m.role === 'ai' && (
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mr-2 mt-0.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] ${m.role === 'user' ? 'gradient-primary text-white' : 'glass-soft text-primary-c'} rounded-2xl px-3.5 py-3 text-sm leading-relaxed`}>
              {m.text.split('\n').map((line, j) => (
                <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
              ))}

              {m.gifts && m.gifts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {m.gifts.map((g) => {
                    const best = getBestPrice(g);
                    const saved = inWishlist(g.id);
                    return (
                      <div key={g.id} className="bg-white/8 rounded-2xl p-2.5 flex gap-2.5 group">
                        <img
                          src={g.image}
                          alt={g.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-primary-c line-clamp-1 mb-1">{g.name}</div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-extrabold text-sm text-primary-c">₹{best.price.toLocaleString('en-IN')}</span>
                            <MatchRing score={g.matchScore} size={28} />
                          </div>
                          <div className="flex gap-2.5">
                            <a
                              href={searchUrl(best.store, g.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-accent-400 hover:text-accent-500 inline-flex items-center gap-0.5 transition"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> View
                            </a>
                            <button
                              onClick={() => toggleWishlist(g)}
                              className={`text-[10px] font-bold transition ${saved ? 'text-rose-400' : 'text-secondary-c hover:text-rose-400'}`}
                            >
                              {saved ? '♥ Saved' : '♡ Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mr-2 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="glass-soft rounded-2xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-primary-500/60 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-3.5 pb-2">
          <p className="text-[10px] text-muted-c font-semibold mb-2 tracking-widest uppercase">Quick start</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[10px] font-semibold glass-soft text-secondary-c px-3 py-1.5 rounded-lg hover:text-primary-c hover:bg-white/8 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3.5 border-t border-soft flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="e.g. She loves skincare, budget ₹2000..."
          className="flex-1 px-3.5 py-2.5 rounded-xl glass-soft text-sm text-primary-c placeholder:text-muted-c outline-none focus:ring-2 ring-primary-500/30"
          aria-label="Message the AI assistant"
        />
        <button
          onClick={() => send()}
          className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0 shadow-lg shadow-primary-500/30"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
