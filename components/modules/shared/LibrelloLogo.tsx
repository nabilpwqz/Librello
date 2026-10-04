"use client";

import Link from "next/link";

export function LibrelloIcon({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Librello Icon"
    >
      {/* Outer subtle boundary */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="8"
        className="stroke-border"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.03"
      />
      {/* Stylized L and Open Book Page */}
      {/* Left stem of the L */}
      <path
        d="M13 10V28H27"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Delicate open page fold intersecting with L */}
      <path
        d="M13 18C16.5 16.5 21 16.5 26 18V26C21 24.5 16.5 24.5 13 26"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 18C27.5 17.5 29 17.5 30 18V26C29 25.5 27.5 25.5 26 26"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.7"
      />
    </svg>
  );
}

export default function LibrelloLogo({ href = "/", size = "default", className = "" }) {
  const iconSize = size === "sm" ? 26 : size === "lg" ? 40 : 32;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <LibrelloIcon
        size={iconSize}
        className="text-foreground transition-transform duration-300 group-hover:scale-105"
      />
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif ${textSize} font-bold tracking-tight text-foreground group-hover:text-primary transition-colors`}
        >
          Librello
        </span>
        <span className="text-[9px] tracking-[0.22em] uppercase text-muted-foreground font-medium mt-0.5">
          Curated Archive
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
