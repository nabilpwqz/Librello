import React from "react";
import Link from "next/link";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export const metadata = {
  title: "Restricted Clearance | Librello",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-6 text-foreground select-none">
      <div className="max-w-md w-full border border-border bg-card p-8 sm:p-10 rounded-2xl shadow-sm text-center space-y-6">
        <div className="flex justify-center">
          <LibrelloLogo />
        </div>

        <div className="space-y-2">
          <span className="editorial-badge">
            Access Restricted
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-foreground">
            Clearance Required
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Your current account credentials do not possess the archival
            privileges required to view this institutional section.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-secondary w-full !py-2.5 !text-xs tracking-wider uppercase font-semibold text-center"
          >
            Return Home
          </Link>

          <Link
            href="/signin"
            className="btn-primary w-full !py-2.5 !text-xs tracking-wider uppercase font-semibold text-center"
          >
            Sign In with Clearance
          </Link>
        </div>
      </div>
    </div>
  );
}
