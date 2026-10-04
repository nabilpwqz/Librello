import React from "react";
import Link from "next/link";
import { getUserSession } from "@/lib/core/session";

const LibrarianHomePage = async () => {
  const librarian = await getUserSession();

  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center p-4 md:p-6 font-sans text-foreground bg-background">
      <div className="max-w-2xl w-full border border-border bg-card/60 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 backdrop-blur-md">
        {/* Left Side: Identity */}
        <div className="space-y-5 flex-1 pt-2 md:pt-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary relative shrink-0">
              {librarian?.image ? (
                <img
                  src={librarian.image}
                  alt="librarian avatar"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}

              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background z-10" />
            </div>

            <div className="space-y-0.5 pl-1">
              <p className="text-2xl md:text-3xl font-semibold tracking-tight leading-none italic font-serif text-foreground mb-1">
                Welcome back, <br />
                <span className="text-primary italic font-serif">
                  {librarian?.name || "Curator"}
                </span>
              </p>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                Archive Catalog Controller
              </p>
            </div>
          </div>

          {/* Email badge */}
          <div className="inline-flex items-center gap-2 bg-card-soft border border-border rounded-full px-4 py-1.5 max-w-full">
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-muted-foreground font-medium truncate max-w-[220px]">
              {librarian?.email || "curator@librello.com"}
            </span>
          </div>

          {/* Quotation */}
          <div className="bg-card-soft/50 border border-border rounded-xl p-3.5 max-w-md">
            <p className="text-xs italic font-serif text-muted-foreground leading-relaxed">
              &ldquo;Libraries store the energy that fuels the imagination.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Links */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <Link
            href="/dashboard/librarian/inventory"
            className="btn-primary text-center text-xs uppercase tracking-wider py-3 px-5 rounded-xl font-bold"
          >
            Manage Inventory
          </Link>
          <Link
            href="/dashboard/librarian/add-book"
            className="btn-secondary text-center text-xs uppercase tracking-wider py-3 px-5 rounded-xl font-bold"
          >
            Catalog New Volume
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LibrarianHomePage;
