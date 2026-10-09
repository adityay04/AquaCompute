"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/calculator", label: "Calculator" },
  { href: "/compare", label: "Compare" },
  { href: "/scale", label: "Scale" },
  { href: "/whatif", label: "WhatIf" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-3 items-center w-full py-6 px-8 border-b border-border backdrop-blur-sm bg-background/40">
      <Link
        href="/"
        className="font-serif text-2xl tracking-tight text-foreground justify-self-start"
      >
        AquaCompute
      </Link>

      <div className="hidden md:flex items-center gap-8 justify-self-center">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-sans transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
                isActive
                  ? "text-accent after:scale-x-100"
                  : "text-foreground/80 hover:text-accent after:scale-x-0 hover:after:scale-x-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 justify-self-end">
        <span className="hidden lg:block border border-accent text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Beta
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
