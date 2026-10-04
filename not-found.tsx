import React from "react";
import Link from "next/link";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export const metadata = {
  title: "Folio Not Found | Librello",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6 text-foreground select-none">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 sm:p-12 rounded-2xl shadow-sm">
        <div className="flex justify-center">
          <LibrelloLogo />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            404
          </h1>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Folio Not Located
          </h2>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          The catalog index or archival volume you requested is not currently
          shelved or has been relocated within the Librello library system.
        </p>

        <div className="pt-2 flex justify-center">
          <Link
            href="/"
            className="btn-primary !px-5 !py-2.5 !text-xs uppercase tracking-wider font-semibold"
          >
            Return to Reading Hall
          </Link>
        </div>
      </div>
    </div>
  );
}
