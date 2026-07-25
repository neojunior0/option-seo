'use client';

import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

        <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-muted-foreground">
          <p>
            OptionSEO is a free, client-side SEO toolkit. This privacy policy
            explains how your data is handled — and the answer is simple:
            <strong className="text-foreground"> your data stays in your browser.</strong>
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Data We Collect</h2>
            <p>
              OptionSEO does not collect, store, or process any personal data on
              any server. There is no OptionSEO database. When you create an
              account, your username and a hashed password are stored in your
              browser&apos;s local storage. When you add API keys in your
              profile, those keys are also stored only in your browser&apos;s
              local storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Data Sent to Third Parties</h2>
            <p>
              When you perform a search or analysis, OptionSEO sends requests
              directly from your browser to the data providers you have
              configured:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-foreground">DataForSEO</strong> — for
                keyword research, domain overviews, backlinks, rank tracking,
                site audits, and AI visibility data. Your DataForSEO credentials
                are sent as an authentication header to the DataForSEO API via
                a lightweight proxy function. The proxy does not store, log, or
                retain your credentials or request data — it forwards the
                request and returns the response.
              </li>
              <li>
                <strong className="text-foreground">OpenRouter</strong> — for
                AI-powered features. Your OpenRouter API key is sent directly
                from your browser to the OpenRouter API.
              </li>
            </ul>
            <p>
              These providers have their own privacy policies and terms of
              service that govern how they handle your requests and data.
              OptionSEO has no access to or control over data processed by
              these third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Hosting &amp; Data Routing</h2>
            <p>
              OptionSEO is hosted as a standard web application. When you perform a
              DataForSEO lookup, your browser sends the request with your
              DataForSEO auth header to the DataForSEO API. No server-side
              proxy, relay, or intermediary stores, logs, or
              retains your credentials, request bodies, or response data. Your
              credentials exist only in your browser&apos;s local storage and
              are attached to each request at the moment it is sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Local Storage</h2>
            <p>
              All account information (username, hashed password), API keys, and
              saved data (tracked keywords, saved keywords, search history,
              audit results) are stored in your browser&apos;s local storage.
              This data never leaves your device except when explicitly sent to
              the third-party APIs described above. Clearing your browser data
              or using a different browser will remove all OptionSEO data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p>
              OptionSEO does not use cookies. Authentication and session state
              are managed entirely through browser local storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Analytics</h2>
            <p>
              OptionSEO does not run any analytics, tracking, or telemetry. We
              do not know who you are, when you use the tool, or what you search
              for.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Your Responsibility</h2>
            <p>
              You are responsible for keeping your browser and device secure.
              Because data is stored locally, anyone with access to your browser
              may be able to view your stored account and API keys. You are
              responsible for managing your own DataForSEO and OpenRouter
              accounts, quotas, and costs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p>
              If this privacy policy changes, the updated version will be
              posted on this page. Since OptionSEO does not collect contact
              information, we cannot notify you directly of changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p>
              OptionSEO is provided as-is without a dedicated support channel.
              The source code is available for review and self-hosting.
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
