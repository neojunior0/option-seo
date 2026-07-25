'use client';

import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

        <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-muted-foreground">
          <p>
            By using OptionSEO, you agree to the following terms. OptionSEO is
            a free, client-side SEO toolkit provided as-is, with no warranty
            and no liability.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground">1. No Warranty</h2>
            <p>
              OptionSEO is provided &quot;as is&quot; and &quot;as available,&quot;
              without any warranty of any kind — express or implied. We do not
              guarantee that the tool will be available, accurate, reliable, or
              error-free at any time. You use OptionSEO entirely at your own
              risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. No Liability</h2>
            <p>
              To the fullest extent permitted by law, OptionSEO and its authors
              accept no liability for any damages, losses, or costs arising
              from your use of or inability to use the tool. This includes but
              is not limited to direct damages, indirect damages, consequential
              damages, loss of data, loss of profits, or any other harm. You
              are solely responsible for any decisions you make based on data
              obtained through OptionSEO.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Data Is Local Only</h2>
            <p>
              OptionSEO stores all account information, API keys, and saved data
              in your browser&apos;s local storage. There is no OptionSEO
              server-side database. We cannot recover, reset, or access your
              data if it is lost. You are responsible for backing up any data
              you wish to preserve.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Your API Accounts</h2>
            <p>
              OptionSEO requires you to provide your own DataForSEO and
              OpenRouter API credentials. You are solely responsible for:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Obtaining and maintaining your own accounts with these providers</li>
              <li>All costs, charges, and quota usage incurred through your API keys</li>
              <li>Keeping your API keys secure and confidential</li>
              <li>Complying with the terms of service of each provider</li>
            </ul>
            <p>
              OptionSEO has no access to your provider accounts and cannot
              issue refunds, adjust quotas, or resolve billing disputes with
              third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Free to Use</h2>
            <p>
              OptionSEO is free to use. There are no subscriptions, no paid
              plans, no credit requirements, and no billing. The only costs you
              may incur are from your own usage of the DataForSEO and OpenRouter
              APIs, which are billed by those providers directly to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Acceptable Use</h2>
            <p>
              You agree not to use OptionSEO for any unlawful purpose, to
              violate the rights of others, or to abuse the third-party API
              services it connects to. You agree to comply with all applicable
              laws and the terms of service of DataForSEO and OpenRouter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Third-Party Services</h2>
            <p>
              OptionSEO relies on DataForSEO and OpenRouter as third-party data
              providers. We have no control over the availability, accuracy, or
              pricing of these services. Any issues with data quality, API
              outages, or billing must be resolved directly with the respective
              provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. No Account Recovery</h2>
            <p>
              Because accounts are stored only in your browser and there is no
              server-side database or email system, there is no password reset
              or account recovery mechanism. If you forget your password, you
              will need to create a new account. If you clear your browser
              data, your account and all saved data will be permanently lost.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Changes to These Terms</h2>
            <p>
              These terms may be updated at any time. Continued use of
              OptionSEO after changes constitutes acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Governing Law</h2>
            <p>
              These terms are provided without any specific governing law
              jurisdiction. No party is obligated to provide support,
              maintenance, or updates for OptionSEO.
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
