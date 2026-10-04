"use client";

import Link from "next/link";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card text-foreground select-none transition-colors">
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        {/* Column 1: Brand & Literary Vision */}
        <div className="lg:col-span-4 space-y-4">
          <LibrelloLogo />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            An editorial sanctuary for literature, rare volumes, and thoughtful
            reading. Connecting curious minds with physical archives and curated
            collections.
          </p>
          <div className="pt-1">
            <p className="text-xs font-serif italic text-primary">
              Discover. Read. Share.
            </p>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">
            Platform
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>
              <Link href="/books" className="hover:text-primary transition-colors">
                Curated Catalog
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-primary transition-colors">
                Browse Editions
              </Link>
            </li>
            <li>
              <Link href="/signin" className="hover:text-primary transition-colors">
                Reader Portal
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-primary transition-colors">
                Membership
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Institutional Contact (Completely Replaced) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">
            Archive Offices
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="leading-relaxed">
              742 Editorial Row, Bloomsbury District, London, WC1B 3DG
            </li>
            <li>
              <a
                href="tel:+18005427355"
                className="hover:text-primary transition-colors"
              >
                +1 (800) 542 7355
              </a>
            </li>
            <li>
              <a
                href="mailto:concierge@librello.com"
                className="hover:text-primary transition-colors"
              >
                concierge@librello.com
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Curated Dispatch Newsletter */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">
            The Librello Gazette
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Receive monthly literary dispatches, newly restored catalogs, and
            curator essays.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field !h-9 !text-xs !rounded-md flex-1"
              required
            />
            <button
              type="submit"
              className="btn-primary !py-2 !px-3 !h-9 !text-xs !rounded-md whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full border-t border-border py-5 bg-card-soft text-xs text-muted-foreground">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {currentYear} Librello Publishing and Library Collective. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy Standard
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms of Circulation
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Archival Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
