'use client';

import { useState } from 'react';
import { Menu, Search, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRequireAuth } from '@/lib/use-require-auth';
import { Sidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import Link from 'next/link';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();
  const { logOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="h-5 w-5 animate-pulse" />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-muted/20">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b bg-background px-4 py-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <SheetClose asChild>
                <Link href="/app">
                  <Sidebar />
                </Link>
              </SheetClose>
            </SheetContent>
          </Sheet>
          <Link href="/app" className="flex items-center gap-2 font-semibold">
            <Search className="h-5 w-5" />
            OptionSEO
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
