'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderTree, Image as ImageIcon, Settings, LogOut, ExternalLink } from 'lucide-react';
import { signOut } from '@/lib/actions';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 md:min-h-screen bg-ink text-paper flex-shrink-0">
      <div className="p-5 border-b border-paper/10">
        <span className="eyebrow">Newsroom</span>
        <h2 className="font-display font-bold text-lg">Admin</h2>
      </div>
      <nav className="p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                active ? 'bg-wire text-paper' : 'hover:bg-paper/10'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-paper/10 mt-2 space-y-1">
        <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-paper/10 transition-colors">
          <ExternalLink size={16} />
          View site
        </Link>
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-paper/10 transition-colors">
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
