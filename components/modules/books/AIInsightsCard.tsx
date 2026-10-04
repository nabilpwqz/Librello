"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { fetchBookInsights } from "@/lib/api/ai";

export default function AIInsightsCard({ book }) {
  const [insights, setInsights] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerate = async () => {
    if (insights) {
      setIsExpanded((prev) => !prev);
      return;
    }

    setLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      const res = await fetchBookInsights({
        title: book?.title,
        author: book?.author,
        category: book?.category,
        description: book?.description,
      });

      if (res?.success && res?.insights) {
        setInsights(res.insights);
        setProvider(res.provider || "Librello Intelligence");
      } else {
        throw new Error("Could not parse AI insights");
      }
    } catch (err) {
      console.error("AI Insights Error:", err);
      setError(err.message || "Failed to analyze volume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-4 font-sans">
      {/* Trigger Button with clean editorial border */}
      <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full relative overflow-hidden group rounded-2xl border border-primary/40 hover:border-primary bg-card/90 dark:bg-card-soft/90 p-4 focus:outline-none cursor-pointer transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-serif font-bold text-foreground">
                    Should I Read This?
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                    Curator Insights
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {insights
                    ? "Review themes, reader audience alignment, and estimated time commitment"
                    : "Generate spoiler-free synopsis, audience compatibility, and vibe analysis"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              {loading ? (
                <svg className="w-4 h-4 animate-spin text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : isExpanded ? (
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>
        </button>
      </motion.div>

      {/* Expandable Insights Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 sm:p-7 rounded-2xl border border-border bg-card-soft/60 backdrop-blur-md shadow-sm space-y-6">
              {/* Header Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Librello Editorial Evaluation</span>
                </div>
                {provider && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
                    Analysis Engine: {provider}
                  </span>
                )}
              </div>

              {/* Loading Skeleton State */}
              {loading && (
                <div className="py-8 space-y-5">
                  <div className="flex items-center justify-center gap-3 text-sm font-bold text-muted-foreground">
                    <svg className="w-5 h-5 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Synthesizing narrative themes, audience fit, and reading complexity...</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-28 rounded-2xl bg-card animate-pulse border border-border/40" />
                    <div className="h-28 rounded-2xl bg-card animate-pulse border border-border/40" />
                  </div>
                  <div className="h-20 rounded-2xl bg-card animate-pulse border border-border/40" />
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-between gap-4">
                  <span className="text-sm font-bold">{error}</span>
                  <Button
                    size="sm"
                    onClick={handleGenerate}
                    className="bg-primary text-primary-foreground rounded-lg text-xs font-bold"
                  >
                    Retry Analysis
                  </Button>
                </div>
              )}

              {/* Insights Results */}
              {!loading && insights && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* 1. In 3 Bullets (Spoiler-Free Key Themes) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Core Thematic Pillars
                    </h4>
                    <div className="space-y-2.5">
                      {insights?.bullets?.map((bullet, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/60"
                        >
                          <div className="w-5 h-5 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-serif font-bold">
                            {["I", "II", "III"][idx] || idx + 1}
                          </div>
                          <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                            {bullet}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Target Audience (Perfect For vs Skip If) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Perfect For */}
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Recommended For You If</span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/85 font-medium leading-relaxed">
                        {insights?.targetAudience?.perfectFor || "Readers who appreciate compelling storytelling."}
                      </p>
                    </div>

                    {/* Skip If */}
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        <span>Consider Alternates If</span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/85 font-medium leading-relaxed">
                        {insights?.targetAudience?.skipIf || "You are in search of a contrasting literary genre."}
                      </p>
                    </div>
                  </div>

                  {/* 3. Reading Vibe & Pace Metrics */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Literary Pace and Complexity
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Pace
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground block">
                          {insights?.readingVibe?.pace || "Moderate"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Complexity
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground block">
                          {insights?.readingVibe?.difficulty || "Accessible"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Estimated Time
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground block">
                          {insights?.readingVibe?.estimatedDays || "3-5 days"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Atmospheric Tone
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                          {insights?.readingVibe?.tone || "Reflective"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Bottom Line Verdict */}
                  {insights?.verdict && (
                    <div className="p-4 sm:p-5 rounded-xl bg-card border-l-4 border-primary border-t border-r border-b border-border">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                        Curator Summary
                      </span>
                      <p className="text-sm font-serif text-foreground leading-relaxed italic">
                        &ldquo;{insights.verdict}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Refresh Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Re-evaluate Volume
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
