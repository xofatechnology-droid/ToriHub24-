'use client';

import { useState, useTransition } from 'react';
import { saveSiteSettings } from '@/lib/actions';
import type { SiteSettings } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveSiteSettings(form);
      setSaved(true);
    });
  }

  const Field = ({ label, k, placeholder }: { label: string; k: keyof SiteSettings; placeholder?: string }) => (
    <div>
      <label className="text-xs font-mono uppercase tracking-wide text-ink/60">{label}</label>
      <input
        value={(form[k] as string) || ''}
        onChange={(e) => set(k, e.target.value as any)}
        placeholder={placeholder}
        className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
      <div className="space-y-4 bg-paper border border-rule p-5 h-fit">
        <h3 className="font-display font-bold mb-1">Identity</h3>
        <Field label="Site Name" k="site_name" />
        <Field label="Tagline" k="tagline" />
        <ImageUploader label="Logo" value={form.logo_url || ''} onChange={(v) => set('logo_url', v)} />
        <ImageUploader label="Favicon" value={form.favicon_url || ''} onChange={(v) => set('favicon_url', v)} />
        <Field label="Footer Text" k="footer_text" />
      </div>

      <div className="space-y-4">
        <div className="bg-paper border border-rule p-5 space-y-4">
          <h3 className="font-display font-bold mb-1">Google AdSense</h3>
          <Field label="AdSense Client ID" k="adsense_client_id" placeholder="ca-pub-0000000000000000" />
          <Field label="Header Ad Slot ID" k="adsense_header_slot" />
          <Field label="Sidebar Ad Slot ID" k="adsense_sidebar_slot" />
          <Field label="In-Article Ad Slot ID" k="adsense_in_article_slot" />
          <p className="text-xs text-ink/50">
            Also update <code>public/ads.txt</code> with the line AdSense gives you, then redeploy.
          </p>
        </div>

        <div className="bg-paper border border-rule p-5 space-y-4">
          <h3 className="font-display font-bold mb-1">Social Links</h3>
          <Field label="Twitter / X" k="social_twitter" placeholder="https://twitter.com/…" />
          <Field label="Facebook" k="social_facebook" placeholder="https://facebook.com/…" />
          <Field label="Instagram" k="social_instagram" placeholder="https://instagram.com/…" />
          <Field label="YouTube" k="social_youtube" placeholder="https://youtube.com/@…" />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-wire text-paper px-4 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-wiredark transition-colors disabled:opacity-60"
        >
          {pending ? 'Saving…' : saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
