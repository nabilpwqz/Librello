"use client";

import React from "react";
import { LibrelloIcon } from "./LibrelloLogo";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md w-screen h-screen text-foreground select-none">
      <div className="flex flex-col items-center text-center space-y-5">
        {/* Animated Open Book / Monogram */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Subtle outer frame */}
          <div className="absolute inset-0 rounded-2xl border border-border bg-card/60 shadow-sm" />

          {/* Book Monogram with gentle pulse */}
          <div className="relative z-10 librello-loader-monogram">
            <LibrelloIcon size={44} className="text-foreground" />
          </div>

          {/* Micro page corner indicator */}
          <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </div>

        {/* Editorial Text - No Emojis, No Em Dashes */}
        <div className="space-y-1">
          <p className="text-xs font-serif font-bold tracking-[0.3em] uppercase text-foreground">
            Librello
          </p>
          <p className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
            Curating Catalog
          </p>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-32 h-[2px] bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: "40%",
              animation: "librelloBar 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes librelloBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
}
