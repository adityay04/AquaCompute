"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const images = [
  "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=2000&auto=format&fit=crop",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 py-20 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        <motion.span
          variants={itemVariants}
          className="text-xs tracking-[0.2em] text-muted uppercase font-sans"
        >
          AI Environmental Impact Estimator
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-foreground"
        >
          Every token <br />
          has a <br />
          <span className="italic text-accent">footprint.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-muted text-lg max-w-md font-sans"
        >
          AquaCompute helps you estimate the energy, water, and carbon impact of
          AI workloads — with transparent assumptions and real-world context.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-6 mt-4"
        >
          <Link
            href="/calculator"
            className="border border-foreground/30 hover:border-accent hover:text-accent transition-colors px-8 py-4 rounded-full text-sm font-medium"
          >
            Try the Calculator →
          </Link>

          <Link
            href="/methodology"
            className="text-sm font-medium border-b border-foreground/30 hover:border-accent hover:text-accent transition-colors pb-1"
          >
            Learn More
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          delay: 0.4,
        }}
        className="relative w-full h-[500px] lg:h-[600px] rounded-sm overflow-hidden bg-foreground/5"
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Ocean waves"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 object-cover w-full h-full opacity-80"
          />
        </AnimatePresence>

        <div className="absolute top-8 left-8 text-xs tracking-widest text-white uppercase font-sans flex flex-col gap-2 z-10 mix-blend-difference">
          <span>Smaller</span>
          <span>Footprints.</span>
          <span>Bigger</span>
          <span>Possibilities.</span>
        </div>

        <div className="absolute top-8 right-8 text-xs tracking-widest text-white uppercase font-sans flex flex-col gap-2 text-right z-10 mix-blend-difference">
          <span>Energy</span>
          <span>Water</span>
          <span>Carbon</span>
        </div>

        <div className="absolute bottom-8 right-8 text-xs tracking-widest text-white uppercase font-sans z-10 mix-blend-difference">
          // 0{currentIndex + 1}
        </div>
      </motion.div>
    </section>
  );
}
