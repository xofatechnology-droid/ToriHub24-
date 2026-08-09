'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex border border-ink">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search stories, topics, people…"
        className="flex-1 px-4 py-3 bg-white focus-visible:outline-none"
      />
      <button type="submit" className="bg-ink text-paper px-4 hover:bg-wire transition-colors" aria-label="Search">
        <Search size={18} />
      </button>
    </form>
  );
}
