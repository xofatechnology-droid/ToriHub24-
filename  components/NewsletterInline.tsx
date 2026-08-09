'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NewsletterInline() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const supabase = createClient();
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    setStatus(error ? 'error' : 'done');
  }

  return (
    <div className="bg-ink text-paper p-6">
      <h3 className="font-display font-bold text-lg">The Morning Wire</h3>
      <p className="text-sm text-paper/70 mt-1">One email, every morning. The stories that matter.</p>
      {status === 'done' ? (
        <p className="text-sm mt-4 text-wire font-medium">You're subscribed. Watch your inbox.</p>
      ) : (
        <form onSubmit={subscribe} className="mt-4 flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="bg-paper text-ink px-3 py-2 text-sm focus-visible:outline-wire"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-wire hover:bg-wiredark transition-colors px-3 py-2 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-paper/60">Something went wrong. Try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
