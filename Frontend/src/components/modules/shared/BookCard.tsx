"use client";

import Link from "next/link";

export default function BookCard({ book }) {
  const isAvailable = book?.status === "Published";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 flex flex-col justify-between h-full">
      {/* Upper Cover & Header */}
      <div className="p-4 space-y-3">
        {/* Book Jacket Frame */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-card-soft border border-border/60">
          <img
            src={book?.cover || book?.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"}
            alt={book?.title || "Book Edition"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
          />

          {/* Minimalist Status Badge */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${
                isAvailable
                  ? "bg-card/90 text-foreground border border-border"
                  : "bg-card/90 text-muted-foreground border border-border"
              }`}
            >
              {isAvailable ? "Available" : "In Circulation"}
            </span>
          </div>
        </div>

        {/* Book Information */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="uppercase tracking-wider text-[10px] font-medium">
              {book?.category || "Literature"}
            </span>
            <span className="font-mono text-xs font-semibold text-primary">
              ${book?.fee || 0}
            </span>
          </div>

          <h3
            className="text-base font-serif font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors"
            title={book?.title}
          >
            {book?.title || "Untitled Volume"}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-1">
            by {book?.author || "Anonymous Author"}
          </p>
        </div>

        {/* Curated AI / Match Tag if present */}
        {book?.matchReason && (
          <div className="p-2 rounded bg-card-soft border border-border/60 text-[11px] text-muted-foreground leading-snug line-clamp-2">
            <span className="font-semibold text-primary block text-[9px] uppercase tracking-wider mb-0.5">
              Curator Insight
            </span>
            {book.matchReason}
          </div>
        )}
      </div>

      {/* Card Action Link */}
      <div className="p-4 pt-0">
        <Link
          href={`/books/${book?._id}`}
          className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-medium rounded-lg border border-border bg-card-soft text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors"
        >
          View Archive Details
        </Link>
      </div>
    </div>
  );
}
