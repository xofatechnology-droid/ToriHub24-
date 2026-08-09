'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/lib/actions';

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    startTransition(() => {
      deletePost(id);
    });
  }

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      aria-label={`Delete ${title}`}
      className="p-1.5 text-ink/40 hover:text-wire transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}
