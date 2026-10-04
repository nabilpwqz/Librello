"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PopularCategories() {
  const categories = [
    {
      name: "Literary Fiction",
      count: "4,250 Volumes",
      slug: "Fiction",
      description: "Celebrated prose, novelistic realism, and classic world literature",
    },
    {
      name: "Philosophy & Ethics",
      count: "1,890 Volumes",
      slug: "Philosophy",
      description: "Classical treatises, moral philosophy, and dialectical inquiries",
    },
    {
      name: "Archival & History",
      count: "3,120 Volumes",
      slug: "History",
      description: "Firsthand accounts, historiography, and cultural documentation",
    },
    {
      name: "Poetry & Essays",
      count: "1,450 Volumes",
      slug: "Poetry",
      description: "Lyrical anthologies, critical essays, and translation editions",
    },
  ];

  return (
    <section className="py-20 bg-card-soft text-foreground border-y border-border select-none">
      <div className="container-custom space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70">
          <div className="space-y-2">
            <span className="editorial-badge">
              Curated Classifications
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-foreground">
              Explore by <span className="italic text-primary">Genre &amp; Epoch</span>
            </h2>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Categorized under standard bibliographic classifications
          </p>
        </div>

        {/* 4-Column Grid */}
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
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/books?category=${cat.slug}`}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between h-48 group shadow-xs"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest block">
                    {cat.count}
                  </span>
                  <h3 className="text-base font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Browse Index</span>
                  <svg
                    width="12"
                    height="12"
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
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
