"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatsSection() {
  const stats = [
    {
      start: 0,
      end: 14,
      suffix: "K+",
      decimals: 0,
      label: "Physical Editions in Circulation",
    },
    {
      start: 0,
      end: 5.2,
      suffix: "K+",
      decimals: 1,
      label: "Members & Scholars Worldwide",
    },
    {
      start: 0,
      end: 128,
      suffix: "",
      decimals: 0,
      label: "Partner Libraries & Private Archives",
    },
    {
      start: 0,
      end: 99.8,
      suffix: "%",
      decimals: 1,
      label: "Archival Condition Preservation Rate",
    },
  ];

  return (
    <section className="py-16 bg-card-soft text-foreground border-y border-border select-none">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 py-4"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 text-center sm:text-left">
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
                <CountUp
                  start={stat.start}
                  end={stat.end}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  duration={2.2}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
              </h3>

              <div className="w-6 h-[1.5px] bg-primary my-2 mx-auto sm:mx-0" />

              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
