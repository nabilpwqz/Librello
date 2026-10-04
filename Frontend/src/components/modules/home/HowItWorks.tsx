"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      stepNumber: "01",
      title: "Archival Discovery",
      description:
        "Locate physical volumes across institutional archives, rare collections, and independent libraries with semantic guidance.",
    },
    {
      stepNumber: "02",
      title: "Condition Audit & Dispatch",
      description:
        "Archivists verify binding condition, apply protective packaging, and initiate insured white-glove transit to your door.",
    },
    {
      stepNumber: "03",
      title: "Tactile Reading Sanctuary",
      description:
        "Read at your own pace for standard 14 to 30 day intervals, with easy digital renewals and marginalia tracking.",
    },
    {
      stepNumber: "04",
      title: "Circulation & Exchange",
      description:
        "Return the volume through scheduled pickup or exchange directly within local verified reading salons.",
    },
  ];

  return (
    <section className="py-20 bg-background text-foreground select-none">
      <div className="container-custom space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70">
          <div className="space-y-2">
            <span className="editorial-badge">
              Circulation Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-foreground">
              How <span className="italic text-primary">Librello Works</span>
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm uppercase tracking-wider font-medium">
            A dignified, zero-friction exchange mechanism for physical literature
          </p>
        </div>

        {/* 4-Step Editorial Flow (Avoiding 3 cards in a row) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <span className="text-2xl font-serif font-light text-primary/70 block">
                  {step.stepNumber}
                </span>
                <h3 className="text-base font-serif font-semibold text-foreground tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="w-8 h-[1.5px] bg-border group-hover:bg-primary transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
