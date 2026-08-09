'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import { savePost } from '@/lib/actions';
import type { Post, Category } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function PostForm({ post, categories }: { post?: Post; categories: Category[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverImage, setCoverImage] = useState(post?.cover_image_url || '');
  const [youtubeUrl, setYoutubeUrl] = useState(post?.youtube_url || '');
  const [audioUrl, setAudioUrl] = useState(post?.audio_url || '');
  const [categoryId, setCategoryId] = useState(post?.category_id || '');
  const [tags, setTags] = useState((post?.tags || []).map((t) => t.name).join(', '));
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false);
  const [isBreaking, setIsBreaking] = useState(post?.is_breaking || false);
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(post?.seo_description || '');
  const [ogImage, setOgImage] = useState(post?.og_image || '');

  function submit(nextStatus: 'draft' | 'published') {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await savePost({
        id: post?.id,
        title,
        slug,
        excerpt,
        content,
        cover_image_url: coverImage,
        youtube_url: youtubeUrl,
        audio_url: audioUrl,
        category_id: categoryId,
        status: nextStatus,
        is_featured: isFeatured,
        is_breaking: isBreaking,
        seo_title: seoTitle,
        seo_description: seoDescription,
        og_image: ogImage,
        tag_names: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push('/admin/posts');
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-6">
        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline"
            className="w-full mt-1 border border-rule px-3 py-2.5 text-lg font-display bg-white focus-visible:outline-wire"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
            URL slug <span className="text-ink/40">(auto-generated from title if left blank)</span>
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
            className="w-full mt-1 border border-rule px-3 py-2 text-sm font-mono bg-white focus-visible:outline-wire"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Excerpt / Dek</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Short summary shown on cards and search results (auto-generated if left blank)"
            className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60 mb-1 block">
            Story Body (Markdown) — use <code>[youtube:VIDEO_ID_OR_URL]</code> or <code>[audio:URL]</code> to embed media inline
          </label>
          <div data-color-mode="light">
            <MDEditor value={content} onChange={(v) => setContent(v || '')} height={480} />
          </div>
        </div>

        <div className="bg-paper border border-rule p-5">
          <h3 className="font-display font-bold mb-4">SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">SEO Title</label>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || 'Falls back to headline'}
                className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder={excerpt || 'Falls back to excerpt'}
                className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
              />
            </div>
            <ImageUploader label="Social Share Image (OG Image)" value={ogImage} onChange={setOgImage} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-paper border border-rule p-5">
          <h3 className="font-display font-bold mb-4">Publish</h3>
          {error && <p className="text-sm text-wire mb-3">{error}</p>}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => submit('draft')}
              disabled={pending}
              className="border border-ink px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-paperdim transition-colors disabled:opacity-60"
            >
              Save Draft
            </button>
            <button
              onClick={() => submit('published')}
              disabled={pending}
              className="bg-wire text-paper px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-wiredark transition-colors disabled:opacity-60"
            >
              {pending ? 'Saving…' : status === 'published' ? 'Update & Publish' : 'Publish'}
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              Featured (hero slider)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} />
              Breaking (developing ticker)
            </label>
          </div>
        </div>

        <div className="bg-paper border border-rule p-5">
          <h3 className="font-display font-bold mb-4">Organize</h3>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mt-1 mb-4 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Tags (comma-separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="politics, elections, 2026"
            className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
          />
        </div>

        <div className="bg-paper border border-rule p-5 space-y-4">
          <h3 className="font-display font-bold">Media</h3>
          <ImageUploader label="Cover Image" value={coverImage} onChange={setCoverImage} />
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/60">YouTube URL</label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
              className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Audio URL</label>
            <input
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://…/story.mp3"
              className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
