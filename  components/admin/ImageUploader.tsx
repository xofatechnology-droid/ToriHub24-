'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { recordMedia } from '@/lib/actions';

export default function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(path);
      onChange(data.publicUrl);
      await recordMedia({ url: data.publicUrl, filename: file.name, file_type: file.type });
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wide text-ink/60 mb-1 block">{label}</label>
      {value ? (
        <div className="relative w-full aspect-video bg-paperdim mb-2">
          <Image src={value} alt="" fill sizes="400px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-ink/70 text-paper p-1 hover:bg-wire transition-colors"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 w-full aspect-video border border-dashed border-rule bg-white cursor-pointer hover:border-wire transition-colors">
          {uploading ? <Loader2 size={20} className="animate-spin text-wire" /> : <Upload size={20} className="text-ink/40" />}
          <span className="text-xs text-ink/50">{uploading ? 'Uploading…' : 'Click to upload'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
      {error && <p className="text-xs text-wire mt-1">{error}</p>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL"
        className="w-full mt-1 border border-rule px-2 py-1.5 text-xs font-mono bg-white focus-visible:outline-wire"
      />
    </div>
  );
}
