'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/app', label: 'Dashboard', icon: Search }],
  },
  {
    label: 'Research',
    items: [
      { href: '/app/keywords', label: 'Keyword Research', icon: Search },
      { href: '/app/domain', label: 'Domain Overview', icon: Search },
      { href: '/app/backlinks', label: 'Backlinks', icon: Search },
      { href: '/app/brand-lookup', label: 'Brand Lookup', icon: Search },
      { href: '/app/prompt-explorer', label: 'Prompt Explorer', icon: Search },
    ],
  },
  {
    label: 'My Site',
    items: [
      { href: '/app/rank-tracking', label: 'Rank Tracking', icon: Search },
      { href: '/app/saved', label: 'Saved Keywords', icon: Search },
      { href: '/app/ai-insights', label: 'AI Insight Agent', icon: Bot },
      { href: '/app/audit', label: 'Site Audit', icon: Search },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-[100dvh] w-60 flex-col border-r bg-muted/20">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Search className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight">OptionSEO</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  item.href === '/app'
                    ? pathname === '/app'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t px-3 py-3">
        <Link
          href="/app/profile"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            pathname === '/app/profile'
              ? 'bg-primary text-primary-foreground font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          Profile & API Keys
        </Link>
      </div>
    </aside>
  );
}
