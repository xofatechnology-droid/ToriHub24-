'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'newsletter-popup-dismissed-at';
const REPROMPT_DAYS = 7;

export default function PopupNewsletter({ siteName }: { siteName: string }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < REPROMPT_DAYS) return;
    }
    const timer = setTimeout(() => setVisible(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const supabase = createClient();
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    setStatus(error ? 'error' : 'done');
    if (!error) localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter signup"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink/60 p-4"
    >
      <div className="relative bg-paper max-w-md w-full p-8 border border-rule shadow-2xl">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 p-1 hover:text-wire transition-colors"
        >
          <X size={20} />
        </button>
        <span className="eyebrow">Stay informed</span>
        <h2 className="font-display font-bold text-2xl mt-2">
          Join {siteName}'s newsletter
        </h2>
        <p className="text-sm text-ink/70 mt-2">
          The day's essential stories, delivered before breakfast. No spam, unsubscribe anytime.
        </p>

        {status === 'done' ? (
          <p className="text-sm mt-5 text-wire font-medium">You're in. Check your inbox to confirm.</p>
        ) : (
          <form onSubmit={subscribe} className="mt-5 flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="border border-rule px-3 py-2.5 text-sm bg-white focus-visible:outline-wire"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-wire hover:bg-wiredark text-paper transition-colors px-3 py-2.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe free'}
            </button>
            {status === 'error' && (
              <p className="text-xs text-ink/50">Something went wrong. Try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
