'use client';

import { useState, useTransition } from 'react';
import { signIn } from '@/lib/actions';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await signIn(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="max-w-sm w-full bg-paper p-8">
        <span className="eyebrow">Newsroom</span>
        <h1 className="font-display font-bold text-2xl mt-2 mb-6">Staff Sign In</h1>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Email</label>
            <input name="email" type="email" required className="w-full mt-1 border border-rule px-3 py-2 bg-white focus-visible:outline-wire" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Password</label>
            <input name="password" type="password" required className="w-full mt-1 border border-rule px-3 py-2 bg-white focus-visible:outline-wire" />
          </div>
          {error && <p className="text-sm text-wire">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-ink text-paper py-2.5 font-semibold uppercase text-sm tracking-wide hover:bg-wire transition-colors disabled:opacity-60"
          >
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-xs text-ink/50 mt-6">
          Admin accounts are created in Supabase Auth. See README for setup.
        </p>
      </div>
    </div>
  );
}
