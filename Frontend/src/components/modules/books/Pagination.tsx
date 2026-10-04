"use client";

import React from "react";

export default function Pagination({
  page = 1,
  total = 1,
  onChange,
  isCompact = true,
  showControls = true,
  showShadow = true,
}) {
  // Generate smart page numbers with ellipsis (...) for clean navigation
  const getPageNumbers = () => {
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");

      const start = Math.max(2, page - 1);
      const end = Math.min(total - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < total - 2) pages.push("ellipsis");
      pages.push(total);
    }
    return pages;
  };

  if (total <= 1) return null;

  return (
    <div className="w-full flex items-center justify-center gap-2 select-none font-sans mt-12 mb-10">
      {/* Previous Page Button */}
      {showControls && (
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous Page"
          className={`flex items-center justify-center rounded-xl border border-border bg-card-soft text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer active:scale-95 ${
            isCompact ? "w-9 h-9" : "w-11 h-11"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Dynamic Page Number Buttons Mapping */}
      {getPageNumbers().map((p, i) => {
        if (p === "ellipsis") {
          return (
            <span
              key={`ellipsis-node-${i}`}
              className="flex items-center justify-center text-muted-foreground/50 text-lg sm:text-base tracking-widest w-9 h-9"
            >
              ...
            </span>
          );
        }

        const isActive = p === page;

        return (
          <button
            key={`page-btn-${p}-${i}`}
            type="button"
            onClick={() => onChange(p)}
            className={`text-base sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
              isCompact ? "w-9 h-9" : "w-11 h-11"
            } ${
              isActive
                ? `bg-primary border border-primary text-primary-foreground font-bold ${
                    showShadow ? "shadow-md shadow-primary/20" : ""
                  }`
                : "border border-border bg-card text-muted-foreground hover:bg-card-soft hover:text-primary hover:border-primary"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Page Button */}
      {showControls && (
        <button
          type="button"
          disabled={page === total}
          onClick={() => onChange(page + 1)}
          aria-label="Next Page"
          className={`flex items-center justify-center rounded-xl border border-border bg-card-soft text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer active:scale-95 ${
            isCompact ? "w-9 h-9" : "w-11 h-11"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
