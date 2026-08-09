'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Copy, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { recordMedia, deleteMedia } from '@/lib/actions';
import type { Media } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function MediaLibrary({ initialMedia }: { initialMedia: Media[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleUpload(files: FileList) {
    setUploading(true);
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path);
        await recordMedia({ url: data.publicUrl, filename: file.name, file_type: file.type });
      }
    }
    setUploading(false);
    router.refresh();
  }

  function copy(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function remove(id: string, url: string) {
    if (!confirm('Delete this file?')) return;
    startTransition(async () => {
      await deleteMedia(id, url);
      router.refresh();
    });
  }

  return (
    <div>
      <label className="flex items-center justify-center gap-2 border border-dashed border-rule bg-white p-8 cursor-pointer hover:border-wire transition-colors mb-8">
        {uploading ? <Loader2 size={18} className="animate-spin text-wire" /> : <Upload size={18} className="text-ink/40" />}
        <span className="text-sm text-ink/60">{uploading ? 'Uploading…' : 'Click to upload images'}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {initialMedia.map((m) => (
          <div key={m.id} className="bg-paper border border-rule">
            <div className="relative aspect-square bg-paperdim">
              <Image src={m.url} alt={m.filename} fill sizes="200px" className="object-cover" />
            </div>
            <div className="p-2 flex items-center justify-between">
              <button onClick={() => copy(m.id, m.url)} className="p-1 text-ink/50 hover:text-wire transition-colors" aria-label="Copy URL">
                {copiedId === m.id ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button onClick={() => remove(m.id, m.url)} className="p-1 text-ink/50 hover:text-wire transition-colors" aria-label="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {initialMedia.length === 0 && <p className="text-sm text-ink/50">No media uploaded yet.</p>}
    </div>
  );
}
