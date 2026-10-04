"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  LayoutGrid,
  Grid3X3,
  RotateCcw,
  SlidersHorizontal,
  ArrowLeft,
  Shield,
  Truck,
  Layers,
} from "lucide-react";

import BookCard from "../shared/BookCard";
import BooksFilter from "./BookFilter";
import Pagination from "./Pagination";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { searchBooksByMood } from "@/lib/api/ai";
import { getDeletedBookIds } from "@/lib/storage/sanctuaryStorage";

interface AllBooksProps {
  allBooks?: any;
  filters?: any;
}

export default function AllBooks({ allBooks = [], filters }: AllBooksProps) {
  const router = useRouter();

  // Filter out any permanently erased books
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  useEffect(() => {
    setDeletedIds(getDeletedBookIds());
    const handleUpdate = () => setDeletedIds(getDeletedBookIds());
    window.addEventListener("sanctuary_storage_updated", handleUpdate);
    return () => window.removeEventListener("sanctuary_storage_updated", handleUpdate);
  }, []);

  // Extract database books array and server-side metadata safely
  const rawBooks = Array.isArray(allBooks) ? allBooks : allBooks?.books || [];
  const books = useMemo(() => {
    return rawBooks.filter((b: any) => !deletedIds.includes(b._id) && !deletedIds.includes(b.id));
  }, [rawBooks, deletedIds]);
  const serverMeta = !Array.isArray(allBooks) ? allBooks?.meta : null;

  // Synchronization core filter states
  const [searchQuery, setSearchQuery] = useState(filters?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters?.category || "all"
  );
  const [minFee, setMinFee] = useState(filters?.minFee || "");
  const [maxFee, setMaxFee] = useState(filters?.maxFee || "");
  const [availability, setAvailability] = useState(filters?.status || "all");
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  // AI Mood Search states
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiMoodResults, setAiMoodResults] = useState<any[] | null>(null);
  const [detectedMood, setDetectedMood] = useState("");
  const [activeMoodQuery, setActiveMoodQuery] = useState("");

  const popularCategories = [
    { label: "All Editions", value: "all" },
    { label: "Literature", value: "Literature" },
    { label: "Philosophy", value: "Philosophy" },
    { label: "History", value: "History" },
    { label: "Science", value: "Science" },
    { label: "Biography", value: "Biography" },
    { label: "Essays", value: "Essays" },
  ];

  const handleAiMoodSearch = async (queryToSearch?: string) => {
    const q = queryToSearch || aiQuery;
    if (!q || !q.trim()) return;

    setIsAiSearching(true);
    try {
      const res = await searchBooksByMood(q.trim());
      if (res?.success && Array.isArray(res.books)) {
        setAiMoodResults(res.books);
        setDetectedMood(res.moodDetected || "Discovered Vibe");
        setActiveMoodQuery(q.trim());
      } else {
        setAiMoodResults([]);
      }
    } catch (err) {
      console.error("AI Mood Search error:", err);
      setAiMoodResults([]);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleClearAiSearch = () => {
    setAiMoodResults(null);
    setDetectedMood("");
    setActiveMoodQuery("");
    setAiQuery("");
  };

  const [page, setPage] = useState(Number(filters?.page) || 1);
  const itemsPerPage = 8;

  useEffect(() => {
    setPage(Number(filters?.page) || 1);
  }, [filters?.page]);

  // Dynamic URL query string synchronization pipeline
  useEffect(() => {
    const sp = new URLSearchParams();

    if (searchQuery) sp.set("search", searchQuery);
    if (selectedCategory !== "all") sp.set("category", selectedCategory);
    if (availability !== "all") sp.set("status", availability);
    if (minFee && minFee.trim() !== "") sp.set("minFee", minFee);
    if (maxFee && maxFee.trim() !== "") sp.set("maxFee", maxFee);

    if (page > 1) sp.set("page", page.toString());
    sp.set("perPage", itemsPerPage.toString());

    const path = `?${sp.toString()}`;
    router.push(path, { scroll: false });
  }, [
    selectedCategory,
    router,
    searchQuery,
    availability,
    minFee,
    maxFee,
    page,
  ]);

  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMinFee("");
    setMaxFee("");
    setAvailability("all");
    setPage(1);
    handleClearAiSearch();
  };

  const totalPages = serverMeta
    ? serverMeta.totalPages
    : Math.ceil(books.length / itemsPerPage);

  const paginatedBooks = useMemo(() => {
    if (serverMeta) return books;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return books.slice(start, end);
  }, [books, page, serverMeta]);

  const isAiSearchActive = aiMoodResults !== null;
  const displayBooks = isAiSearchActive ? aiMoodResults : paginatedBooks;
  const totalVolumeCount = serverMeta ? serverMeta.totalItems : books.length;

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== "all" ||
    availability !== "all" ||
    Boolean(minFee) ||
    Boolean(maxFee) ||
    isAiSearchActive;

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 130, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none">
      {/* 1. EDITORIAL ARCHIVE HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-card/60 p-8 sm:p-10 backdrop-blur-xl shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 space-y-5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-badge inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />
              Living Preservation Archive
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {totalVolumeCount} Curated Physical Volumes
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-foreground leading-[1.15]">
            Browse the Rare Catalog & <br />
            <span className="italic text-primary font-normal">
              Archival Circulation.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Step beyond digital distraction into physical literature. Hand-curated
            editions, historical treatises, and preserved volumes dispatched with
            white-glove courier care directly to your reading sanctuary.
          </p>

          {/* Curatorial Trust Pillars */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-500" />
              <span>Preservation Insured</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-primary" />
              <span>White-Glove Courier Transit</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-blue-500" />
              <span>Curator-Verified Editions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. POPULAR CATEGORIES DISCOVERY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-serif font-semibold text-muted-foreground mr-1 shrink-0">
          Curated Circles:
        </span>
        {popularCategories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleFilterChange(setSelectedCategory, cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                  : "bg-card/70 hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & ADVANCED FILTER PANEL */}
      <BooksFilter
        searchQuery={searchQuery}
        setSearchQuery={(v) => handleFilterChange(setSearchQuery, v)}
        selectedCategory={selectedCategory}
        setSelectedCategory={(v) => handleFilterChange(setSelectedCategory, v)}
        minFee={minFee}
        setMinFee={(v) => handleFilterChange(setMinFee, v)}
        maxFee={maxFee}
        setMaxFee={(v) => handleFilterChange(setMaxFee, v)}
        availability={availability}
        setAvailability={(v) => handleFilterChange(setAvailability, v)}
        isAiMode={isAiMode}
        setIsAiMode={setIsAiMode}
        aiQuery={aiQuery}
        setAiQuery={setAiQuery}
        onAiSearch={handleAiMoodSearch}
        isAiSearching={isAiSearching}
        activeMoodQuery={activeMoodQuery}
        onClearAiSearch={handleClearAiSearch}
      />

      {/* 4. ACTIVE AI SEARCH BANNER */}
      {isAiSearching && (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
            <svg
              className="w-7 h-7 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-serif font-bold text-foreground">
              Consulting Librello Literary Intelligence...
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Scanning archival synopses to match your reading sentiment.
            </p>
          </div>
        </div>
      )}

      {isAiSearchActive && !isAiSearching && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-primary/10 border border-primary/25 backdrop-blur-md flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-primary">
                  AI Sentiment Curated
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  {detectedMood || "Discovered"}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                Showing {displayBooks.length} editions matched to: &ldquo;
                <span className="italic font-bold text-primary">
                  {activeMoodQuery}
                </span>
                &rdquo;
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleClearAiSearch}
            className="bg-card/80 hover:bg-card text-foreground border border-border/60 text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer transition-all"
          >
            Clear AI Filter
          </Button>
        </motion.div>
      )}

      {/* 5. CONTROLS BAR: RESULTS COUNT, ACTIVE FILTER TAGS & GRID TOGGLE */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-border/50 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-xs font-semibold text-foreground">
            Displaying {displayBooks.length} archival editions
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-semibold hover:bg-destructive/20 transition-colors"
            >
              <RotateCcw size={11} /> Reset Filters
            </button>
          )}
        </div>

        {/* Grid Column Layout Switcher */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-card border border-border/60">
          <button
            onClick={() => setGridColumns(4)}
            className={`p-1.5 rounded-lg transition-colors ${
              gridColumns === 4
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Compact 4-column grid"
          >
            <Grid3X3 size={15} />
          </button>
          <button
            onClick={() => setGridColumns(3)}
            className={`p-1.5 rounded-lg transition-colors ${
              gridColumns === 3
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Expanded 3-column grid"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* 6. BOOK RESULTS GRID */}
      {!isAiSearching && (
        <AnimatePresence mode="popLayout">
          {displayBooks.length > 0 ? (
            <motion.div
              key={`books-grid-${gridColumns}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridColumns === 3
                  ? "lg:grid-cols-3 gap-7"
                  : "md:grid-cols-3 lg:grid-cols-4 gap-6"
              } mb-10 mt-4 items-start`}
            >
              {displayBooks.map((bookItem, index) => (
                <motion.div
                  key={
                    bookItem?._id ||
                    bookItem?.id ||
                    `book-fallback-key-${index}`
                  }
                  variants={cardVariants}
                  layout
                  className="h-full"
                >
                  <BookCard book={bookItem} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="books-empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center py-20 px-6 border border-dashed border-border/80 rounded-3xl bg-card/30 space-y-4 max-w-2xl mx-auto my-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BookOpen size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-foreground">
                  No Archival Editions Found
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  No preserved volumes currently match your active search terms or
                  selected filters. Try broadening your criteria or reset filters.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="btn-primary !px-5 !py-2.5 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <RotateCcw size={12} /> Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 7. PAGINATION */}
      {!isAiSearchActive && paginatedBooks.length > 0 && totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination
            page={serverMeta ? serverMeta.currentPage : page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
            showShadow={true}
            isCompact={true}
          />
        </div>
      )}
    </div>
  );
}

