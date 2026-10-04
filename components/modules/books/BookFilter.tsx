"use client";

import React, { useState } from "react";
import { TextField, Select, ListBox, Button } from "@heroui/react";
import { Magnifier, ChevronDown } from "@gravity-ui/icons";

const AnyButton = Button as any;

export default function BooksFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  minFee,
  setMinFee,
  maxFee,
  setMaxFee,
  availability,
  setAvailability,
  // AI Mood Search props
  isAiMode = false,
  setIsAiMode,
  aiQuery = "",
  setAiQuery,
  onAiSearch,
  isAiSearching = false,
  activeMoodQuery = "",
  onClearAiSearch,
}) {
  // Mobile Filter Toggle dropdown
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const moodChips = [
    { label: "Atmospheric & Noir", query: "late night atmospheric thriller with intense twists" },
    { label: "Intellectual & Growth", query: "life changing habits, self discipline and personal growth" },
    { label: "Cosmic & Speculative", query: "space exploration, sci fi adventure and survival" },
    { label: "Meditative & Serene", query: "calm, peaceful, mind relaxing and mindfulness" },
    { label: "Statecraft & Strategy", query: "business strategy, wealth creation and finance" },
  ];

  const handleAiSubmit = (e) => {
    if (e) e.preventDefault();
    if (aiQuery && aiQuery.trim() && onAiSearch) {
      onAiSearch(aiQuery.trim());
    }
  };

  return (
    <div className="dashboard-card max-w-7xl mx-auto mb-7 space-y-4">
      {/* Search Mode Toggle (Standard vs AI Mood Search) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-card-soft/60 border border-border/60">
            <button
              type="button"
              onClick={() => {
                if (setIsAiMode) setIsAiMode(false);
                if (onClearAiSearch) onClearAiSearch();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isAiMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Standard Catalog Filter
            </button>
            <button
              type="button"
              onClick={() => {
                if (setIsAiMode) setIsAiMode(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isAiMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>AI Literary Vibe Search</span>
            </button>
          </div>
        </div>

        {activeMoodQuery && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Active Vibe: <span className="font-bold text-primary italic">&ldquo;{activeMoodQuery}&rdquo;</span>
            </span>
            <button
              type="button"
              onClick={onClearAiSearch}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card-soft text-[11px] font-bold text-muted-foreground hover:text-primary border border-border/50 cursor-pointer transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* AI MOOD SEARCH INPUT BAR (When AI Mode is Active) */}
      {isAiMode ? (
        <div className="space-y-3">
          <form onSubmit={handleAiSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-primary z-10">
                <svg className={`w-4 h-4 ${isAiSearching ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by mood, theme, or topic (e.g. 'late night thriller', 'self discipline', 'deep space survival')..."
                value={aiQuery}
                onChange={(e) => setAiQuery && setAiQuery(e.target.value)}
                className="input-field pl-10 pr-4 py-3.5 w-full text-base sm:text-sm rounded-2xl border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-card/60 backdrop-blur-md font-sans"
              />
            </div>

            <AnyButton
              type="submit"
              isDisabled={isAiSearching || !aiQuery.trim()}
              className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
              startContent={
                isAiSearching ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              }
            >
              {isAiSearching ? "Searching Vibe..." : "Match Books"}
            </AnyButton>
          </form>

          {/* Quick Mood Inspiration Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mr-1">
              Curated Vibes:
            </span>
            {moodChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (setAiQuery) setAiQuery(chip.query);
                  if (onAiSearch) onAiSearch(chip.query);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeMoodQuery === chip.query
                    ? "bg-primary/20 text-primary border-primary font-bold shadow-sm"
                    : "bg-card-soft/40 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* STANDARD SEARCH & FILTER CONTROLS */
        <>
          {/* MOBILE VIEW HEADER */}
          <div className="flex md:hidden items-center gap-3 w-full">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground z-10">
                  <Magnifier className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search title, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 w-full text-base sm:text-sm font-sans"
                />
              </div>
            </div>

            <Button
              onClick={() => setIsOpenMobile(!isOpenMobile)}
              className={`p-5 py-5.5 rounded-xl border transition-all text-base sm:text-sm font-bold flex items-center gap-2 ${
                isOpenMobile
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-foreground"
              }`}
            >
              <span className="w-4 h-9 flex items-center justify-center">
                <ChevronDown className="w-4 h-4" />
              </span>
              <span>Filters</span>
            </Button>
          </div>

          {/* CORE FILTER GRID PANEL */}
          <div
            className={`${isOpenMobile ? "grid mt-4 pt-4 border-t border-border/40" : "hidden"} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end`}
          >
            {/* Search input (Desktop Only) */}
            <div className="lg:col-span-4 hidden md:block">
              <TextField
                aria-label="Search Books"
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                className="w-full"
              >
                <span className="text-base sm:text-xs font-bold font-sans text-foreground uppercase tracking-wider block mb-1.5">
                  Search Catalog
                </span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground z-10">
                    <Magnifier className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search title, author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-9 w-full text-base sm:text-sm font-sans"
                  />
                </div>
              </TextField>
            </div>

            {/* Category filter dropdown */}
            <div className="lg:col-span-3 sm:col-span-1">
              <span className="text-base sm:text-xs font-bold font-sans text-foreground uppercase tracking-wider block mb-1.5">
                Classification
              </span>
              <Select
                aria-label="Filter books by category"
                selectedKey={selectedCategory}
                onSelectionChange={(key) => setSelectedCategory(key)}
              >
                <Select.Trigger className="w-full flex items-center justify-between input-field px-3 text-base sm:text-sm font-medium transition-all font-sans">
                  <Select.Value>
                    {selectedCategory === "all" ? "All Classifications" : selectedCategory}
                  </Select.Value>
                  <Select.Indicator>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Select.Indicator>
                </Select.Trigger>

                <Select.Popover className="bg-card border border-border rounded-2xl shadow-xl mt-1 overflow-hidden z-50">
                  <ListBox
                    className="p-1 font-sans text-foreground"
                    aria-label="Category list options"
                  >
                    <ListBox.Item
                      id="all"
                      textValue="All Classifications"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer capitalize font-sans"
                    >
                      <span>All Classifications</span>
                    </ListBox.Item>
                    <ListBox.Item
                      id="Fiction"
                      textValue="Fiction"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer capitalize font-sans"
                    >
                      <span>Fiction</span>
                    </ListBox.Item>
                    <ListBox.Item
                      id="Tech"
                      textValue="Tech"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer capitalize font-sans"
                    >
                      <span>Tech</span>
                    </ListBox.Item>
                    <ListBox.Item
                      id="History"
                      textValue="History"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer capitalize font-sans"
                    >
                      <span>History</span>
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Delivery fee min / max filter */}
            <div className="lg:col-span-3 sm:col-span-1 grid grid-cols-2 gap-2">
              <div>
                <span className="text-base sm:text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider block mb-1.5 truncate">
                  Min ($)
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  className="input-field w-full text-base sm:text-sm font-sans"
                />
              </div>
              <div>
                <span className="text-base sm:text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider block mb-1.5 truncate">
                  Max ($)
                </span>
                <input
                  type="number"
                  placeholder="500"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  className="input-field w-full text-base sm:text-sm font-sans"
                />
              </div>
            </div>

            {/* Status filter dropdown */}
            <div className="lg:col-span-2 sm:col-span-2">
              <span className="text-base sm:text-xs font-bold font-sans text-foreground uppercase tracking-wider block mb-1.5">
                Availability
              </span>
              <Select
                aria-label="Filter books by availability status"
                selectedKey={availability}
                onSelectionChange={(key) => setAvailability(key)}
              >
                <Select.Trigger className="w-full flex items-center justify-between input-field px-3 text-base sm:text-sm font-medium transition-all font-sans">
                  <Select.Value>
                    {availability === "all" ? "All Availability" : availability}
                  </Select.Value>
                  <Select.Indicator>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Select.Indicator>
                </Select.Trigger>

                <Select.Popover className="bg-card border border-border rounded-2xl shadow-xl mt-1 overflow-hidden z-50">
                  <ListBox
                    className="p-1 font-sans text-foreground"
                    aria-label="Availability status options"
                  >
                    <ListBox.Item
                      id="all"
                      textValue="All Availability"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer font-sans"
                    >
                      <span>All Availability</span>
                    </ListBox.Item>
                    <ListBox.Item
                      id="Available"
                      textValue="Available"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer font-sans"
                    >
                      <span>Available</span>
                    </ListBox.Item>
                    <ListBox.Item
                      id="Unavailable"
                      textValue="Checked Out"
                      className="flex items-center justify-between text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-3 py-2 text-base sm:text-sm cursor-pointer font-sans"
                    >
                      <span>Checked Out</span>
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
