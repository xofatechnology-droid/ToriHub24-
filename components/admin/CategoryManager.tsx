'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { saveCategory, deleteCategory } from '@/lib/actions';
import type { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await saveCategory({ name, description });
      if (res?.error) setError(res.error);
      else {
        setName('');
        setDescription('');
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm('Delete this category? Posts in it will become uncategorized.')) return;
    startTransition(async () => {
      await deleteCategory(id);
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <div className="bg-paper border border-rule divide-y divide-rule">
        {initialCategories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-ink/50 font-mono">/{c.slug}</p>
            </div>
            <button onClick={() => remove(c.id)} className="p-1.5 text-ink/40 hover:text-wire transition-colors" aria-label={`Delete ${c.name}`}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {initialCategories.length === 0 && <p className="px-5 py-8 text-sm text-ink/50">No categories yet.</p>}
      </div>

      <form onSubmit={add} className="bg-paper border border-rule p-5 h-fit space-y-4">
        <h3 className="font-display font-bold">Add Category</h3>
        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/60">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full mt-1 border border-rule px-3 py-2 text-sm bg-white focus-visible:outline-wire" />
        </div>
        {error && <p className="text-sm text-wire">{error}</p>}
        <button type="submit" disabled={pending} className="bg-wire text-paper px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-wiredark transition-colors disabled:opacity-60">
          Add
        </button>
      </form>
    </div>
  );
}
