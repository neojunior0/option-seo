'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">OptionSEO</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free, client-side SEO tools. Your keys, your data, your browser.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features/keyword-research" className="hover:text-foreground">Keyword Research</Link></li>
              <li><Link href="/features/domain-overview" className="hover:text-foreground">Domain Overview</Link></li>
              <li><Link href="/features/backlink-checker" className="hover:text-foreground">Backlink Checker</Link></li>
              <li><Link href="/features/rank-tracking" className="hover:text-foreground">Rank Tracking</Link></li>
              <li><Link href="/features/site-audit" className="hover:text-foreground">Site Audit</Link></li>
              <li><Link href="/features/ai-brand-visibility" className="hover:text-foreground">AI Brand Visibility</Link></li>
              <li><Link href="/features/ai-search-prompts" className="hover:text-foreground">AI Search Prompts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground">All Features</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms &amp; Conditions</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Sign Up</Link></li>
              <li>
                <a
                  href="https://github.com/neojunior0/option-seo-w"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            OptionSEO is a free, local-first SEO toolkit. All data is stored in
            your browser — nothing is sent to any OptionSEO server.
          </p>
        </div>
      </div>
    </footer>
  );
}
