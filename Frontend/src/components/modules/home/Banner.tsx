"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Banner() {
  const slides = [
    {
      badge: "Curated Circulation",
      titleStart: "Where Every Book",
      titleAccent: "Finds Its Place.",
      description:
        "Connecting discerning readers with private archives, rare collections, and distinguished libraries through seamless physical circulation.",
      ctaPrimary: "Explore the Archive",
      ctaSecondary: "The Librello Vision",
      bgImage: "/images/slider1.png",
      tagline: "Discover. Read. Share.",
    },
    {
      badge: "The Art of Reading",
      titleStart: "Turn Pages.",
      titleAccent: "Find More.",
      description:
        "Step beyond digital distraction into physical literature. Hand-curated volumes delivered with white-glove care directly to your reading sanctuary.",
      ctaPrimary: "Browse Editions",
      ctaSecondary: "Circulation Process",
      bgImage: "/images/slider2.png",
      tagline: "Books, Curated for You.",
    },
    {
      badge: "Global Literary Network",
      titleStart: "Where Stories",
      titleAccent: "Connect.",
      description:
        "An exclusive sanctuary uniting independent bibliophiles, preservationists, and historical collections into a living literary commonwealth.",
      ctaPrimary: "Join the Collective",
      ctaSecondary: "Meet Curators",
      bgImage: "/images/slider3.png",
      tagline: "Your Books. Your World.",
    },
  ];

  return (
    <section className="relative h-[88vh] min-h-[580px] max-h-[820px] overflow-hidden bg-background text-foreground select-none">
      <Swiper
        spaceBetween={0}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "inline-block w-8 h-[2px] bg-foreground/20 rounded-full mx-1.5 transition-all duration-300 cursor-pointer",
          bulletActiveClass: "!bg-primary !w-12",
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="h-full w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative h-full w-full bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url('${slide.bgImage}')` }}
            >
              {/* Subtle Warm Tonal Scrim - No Harsh Gradients, No Orbs */}
              <div className="absolute inset-0 bg-background/88 dark:bg-background/92 transition-colors" />

              <div className="container-custom relative z-10 py-12">
                <div className="max-w-2xl space-y-6">
                  {/* Category Pill */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="editorial-badge">
                      {slide.badge}
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground leading-[1.12]"
                  >
                    {slide.titleStart} <br />
                    <span className="italic text-primary font-normal">
                      {slide.titleAccent}
                    </span>
                  </motion.h1>

                  {/* Editorial Summary */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Action Group */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="pt-2 flex flex-wrap items-center gap-3"
                  >
                    <Link href="/books">
                      <button className="btn-primary !px-6 !py-3 text-sm">
                        {slide.ctaPrimary}
                      </button>
                    </Link>
                    <Link href="/books">
                      <button className="btn-secondary !px-6 !py-3 text-sm">
                        {slide.ctaSecondary}
                      </button>
                    </Link>
                  </motion.div>

                  {/* Subtitle Accent */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="pt-4 border-t border-border/60"
                  >
                    <span className="text-xs font-serif italic text-muted-foreground">
                      {slide.tagline}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
