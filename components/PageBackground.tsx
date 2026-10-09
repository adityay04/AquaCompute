"use client";

import { motion } from "motion/react";

export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[90vw] h-[110vh] opacity-[0.3] dark:opacity-[0.4]"
      >
        <motion.img
          src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2400&auto=format&fit=crop"
          alt=""
          animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="object-cover w-full h-full mix-blend-multiply invert grayscale dark:mix-blend-screen dark:invert-0"
          style={{ filter: "blur(6px)" }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
    </div>
  );
}
