"use client";

import { motion } from "framer-motion";

export default function HeroMarquee() {
  const items = [
    { title: "First Editions", category: "Archival Series", number: "01" },
    { title: "Literary Theory", category: "Academic Press", number: "02" },
    { title: "Rare Manuscripts", category: "Private Collection", number: "03" },
    { title: "Contemporary Fiction", category: "Featured Curations", number: "04" },
    { title: "Librello Editions", category: "Signature Bindings", number: "05" },
    { title: "Philosophy and Essays", category: "Historical Texts", number: "06" },
    { title: "Poetry Anthologies", category: "Small Press", number: "07" },
    { title: "Restored Catalogs", category: "White Glove Care", number: "08" },
  ];

  const doubleItems = [...items, ...items];

  return (
    <div className="w-full border-y border-border bg-card-soft/60 overflow-hidden py-4 select-none">
      <div className="flex w-max">
        <motion.div
          animate={{ x: [0, -1400] }}
          transition={{
            ease: "linear",
            duration: 32,
            repeat: Infinity,
          }}
          className="flex items-center gap-10 whitespace-nowrap"
        >
          {doubleItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-3 py-1 group cursor-default"
            >
              <span className="text-[10px] font-mono text-primary font-medium tracking-wider">
                {item.number}
              </span>
              <span className="text-sm font-serif font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </span>
              <span className="text-[10px] tracking-wider uppercase text-muted-foreground">
                / {item.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-border ml-6" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
