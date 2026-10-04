"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import BookCard from "../shared/BookCard";
import { getAllPublishedBooks } from "@/lib/api/books";
import { isBookDeleted } from "@/lib/storage/sanctuaryStorage";
import Link from "next/link";

export default function FeaturedBooks() {
  const [booksData, setBooksData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllPublishedBooks();
        setBooksData(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);

  const finalBooksList = useMemo(() => {
    if (!booksData) return [];
    const list = Array.isArray(booksData) ? booksData : booksData?.books || [];
    return list.filter((b: any) => !isBookDeleted(b._id || b.id));
  }, [booksData]);

  return (
    <section className="bg-background text-foreground py-16 sm:py-20 select-none">
      {/* Section Header */}
      <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 pb-6 border-b border-border/70">
        <div className="space-y-2">
          <span className="editorial-badge">
            Curated Acquisitions
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-foreground">
            Featured Volumes &amp; <span className="italic text-primary">Archival Editions</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Hand-curated physical editions currently available for reservation,
            scholarly study, and doorstep circulation.
          </p>
        </div>

        <Link
          href="/books"
          className="text-xs font-semibold tracking-wider uppercase text-primary hover:text-foreground flex items-center gap-1.5 transition-colors pb-1"
        >
          <span>View Complete Catalog</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Book Grid - 4 Column Layout (Avoiding 3 in a row) */}
      {loading ? (
        <div className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse bg-card-soft border border-border rounded-xl h-80 w-full"
            />
          ))}
        </div>
      ) : (
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {finalBooksList.slice(0, 8).map((book, index) => (
              <motion.div
                key={book._id || `featured-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Link href="/books">
              <button className="btn-secondary !px-8 !py-3 text-xs tracking-wider uppercase font-semibold">
                Explore All Archival Works
              </button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
