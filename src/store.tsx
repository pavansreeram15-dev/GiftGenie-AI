import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Recommendation, WizardForm } from './types';

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  wishlist: Recommendation[];
  toggleWishlist: (g: Recommendation) => void;
  inWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  openWishlist: boolean;
  setOpenWishlist: (v: boolean) => void;
  openChat: boolean;
  setOpenChat: (v: boolean) => void;
  form: WizardForm;
  setForm: React.Dispatch<React.SetStateAction<WizardForm>>;
}

const defaultForm: WizardForm = {
  relationship: '',
  occasion: '',
  gender: '',
  age: 25,
  budget: 3000,
  interests: [],
  personality: [],
  store: 'Any',
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [wishlist, setWishlist] = useState<Recommendation[]>([]);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [form, setForm] = useState<WizardForm>(defaultForm);

  useEffect(() => {
    const saved = localStorage.getItem('gg-theme') as Theme | null;
    if (saved) setTheme(saved);
    const savedWish = localStorage.getItem('gg-wishlist');
    if (savedWish) try { setWishlist(JSON.parse(savedWish)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('gg-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gg-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);
  const toggleWishlist = useCallback((g: Recommendation) => {
    setWishlist((w) => (w.some((x) => x.id === g.id) ? w.filter((x) => x.id !== g.id) : [...w, g]));
  }, []);
  const inWishlist = useCallback((id: string) => wishlist.some((x) => x.id === id), [wishlist]);
  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, wishlist, toggleWishlist, inWishlist, clearWishlist, openWishlist, setOpenWishlist, openChat, setOpenChat, form, setForm }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
