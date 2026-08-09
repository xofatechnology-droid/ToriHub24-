'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import type { Category } from '@/lib/types';

export default function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2">
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-ink text-paper h-full p-6 flex flex-col">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="self-end p-2 mb-6">
              <X size={22} />
            </button>
            <ul className="space-y-4 text-lg font-display">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} onClick={() => setOpen(false)}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
