"use client";

import Link from "next/link";

export default function AboutSection() {
  const principles = [
    {
      numeral: "I",
      title: "Scholarly Curation",
      description:
        "Every edition in our catalog is cataloged by experienced librarians, preservationists, and specialist bibliophiles.",
    },
    {
      numeral: "II",
      title: "Physical Preservation",
      description:
        "We treat books as cultural artifacts. All shipments use archival-grade packaging to protect historic bindings and paper stock.",
    },
    {
      numeral: "III",
      title: "Peer Lending Circles",
      description:
        "Readers can annotate, share marginalia, and participate in curated reading salons with fellow collectors worldwide.",
    },
    {
      numeral: "IV",
      title: "Democratized Circulation",
      description:
        "Connecting regional archives and private shelves directly to your reading sanctuary without geographical friction.",
    },
  ];

  return (
    <section className="py-20 bg-card-soft text-foreground border-y border-border select-none">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Manifesto */}
          <div className="lg:col-span-6 space-y-6">
            <span className="editorial-badge">
              The Librello Manifesto
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-foreground leading-tight">
              Preserving the Tactile Joy of Reading in an Accelerated World.
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              Libraries are not merely repositories of paper; they are sanctuaries
              of memory and reflection. In an era dominated by transient digital
              feeds, Librello bridges physical library shelves and modern readers.
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
              We empower local bibliophiles, institutional collections, and
              curators to circulate celebrated editions, forgotten classics, and
              academic treatises with reverence and speed.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link href="/books">
                <button className="btn-primary !px-6 !py-2.5 text-xs tracking-wider uppercase font-semibold">
                  Explore The Collection
                </button>
              </Link>
              <Link href="/signup">
                <button className="btn-secondary !px-6 !py-2.5 text-xs tracking-wider uppercase font-semibold">
                  Archival Principles
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Principles (Roman Numerals - No Checkmarks) */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-border bg-card p-8 space-y-6">
              <div className="border-b border-border pb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-primary block mb-1">
                  Standards of Practice
                </span>
                <h3 className="text-xl font-serif font-semibold text-foreground">
                  The Four Tenets of Librello
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {principles.map((p, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-xs font-serif font-bold text-primary block">
                      {p.numeral}.
                    </span>
                    <h4 className="text-sm font-semibold text-foreground tracking-tight">
                      {p.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/80">
                <p className="text-xs font-serif italic text-muted-foreground">
                  "A room without books is like a body without a soul." (Cicero)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
