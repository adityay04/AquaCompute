"use client";

import { motion } from "motion/react";
import Link from "next/link";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/adityay04",
    handle: "@adityay04",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-yadav2005",
    handle: "aditya-yadav2005",
  },
  {
    label: "X",
    href: "https://x.com/AdityaYada76111",
    handle: "@AdityaYada76111",
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto w-full px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <h3 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
              Built to make AI <br />
              <span className="italic text-accent">accountable.</span>
            </h3>
            <p className="text-foreground/50 text-sm max-w-md font-sans leading-relaxed">
              AquaCompute is an open project exploring the environmental cost of
              AI inference. Transparent assumptions, no fake precision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="flex flex-col gap-4 md:items-end"
          >
            <span className="text-xs tracking-[0.2em] text-foreground/40 uppercase font-sans mb-2">
              Find me online
            </span>
            {SOCIALS.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                whileHover={{ x: -6 }}
                className="group flex items-center gap-4 font-sans"
              >
                <span className="text-xs text-foreground/40 uppercase tracking-wider">
                  {social.label}
                </span>
                <span className="text-sm text-foreground group-hover:text-accent transition-colors border-b border-foreground/20 group-hover:border-accent pb-0.5">
                  {social.handle}
                </span>
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  ↗
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-border">
          <span className="text-xs text-foreground/40 font-sans">
            © {new Date().getFullYear()} AquaCompute
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/methodology"
              className="text-xs text-foreground/40 hover:text-accent transition-colors font-sans"
            >
              Methodology
            </Link>
            <Link
              href="/calculator"
              className="text-xs text-foreground/40 hover:text-accent transition-colors font-sans"
            >
              Calculator
            </Link>
            <span className="text-xs text-foreground/30 tracking-widest uppercase font-sans">
              Measure / Understand / Build
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
