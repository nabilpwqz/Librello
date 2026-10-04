"use client";

import { motion } from "framer-motion";

export default function TopLibrarians() {
  const curators = [
    {
      name: "Dr. Elena Rostova",
      title: "Senior Archivist",
      institution: "Bloomsbury Rare Manuscripts Guild",
      specialty: "18th & 19th Century Historical Texts",
      record: "1,420 Rare Editions Authenticated",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Marcus Vance",
      title: "Modern Collections Director",
      institution: "First Editions Society",
      specialty: "20th Century Fiction & Small Press",
      record: "980 Curated Circulations",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Amara Chen",
      title: "Specialist Conservator",
      institution: "Comparative Philosophy Archive",
      specialty: "Classical Treatises & Translations",
      record: "1,150 Restored Catalogs",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Julian Thorne",
      title: "Restoration Fellow",
      institution: "Guild of Book Conservation",
      specialty: "Hand Bookbinding & Archival Paper",
      record: "840 Conservation Audits",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-20 bg-background text-foreground select-none">
      <div className="container-custom space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70">
          <div className="space-y-2">
            <span className="editorial-badge">
              Scholarly Stewardship
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-foreground">
              Distinguished <span className="italic text-primary">Curators &amp; Archivists</span>
            </h2>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Preserving authenticity and condition across regional collections
          </p>
        </div>

        {/* 4-Column Curators Layout (Avoiding 3 in a row) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {curators.map((curator, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -3 }}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                {/* Curator Portrait */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-card-soft">
                  <img
                    src={curator.avatar}
                    alt={curator.name}
                    className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {curator.name}
                  </h3>
                  <p className="text-xs font-medium text-primary">
                    {curator.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {curator.institution}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-medium">
                    Specialization
                  </span>
                  <p className="text-xs text-foreground leading-snug">
                    {curator.specialty}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-primary font-medium block">
                  {curator.record}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
