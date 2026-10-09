"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COUNTRIES, CountryData } from "@/lib/countries";

interface CountrySelectorProps {
  selected: CountryData;
  onSelect: (country: CountryData) => void;
}

export default function CountrySelector({
  selected,
  onSelect,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative font-sans">
      <label className="text-sm text-foreground font-sans mb-3 block">
        Region
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-border p-4 rounded-md cursor-pointer hover:border-foreground/50 transition-colors flex items-center justify-between"
      >
        <span className="text-foreground text-sm flex items-center gap-3">
          <span className="text-lg">{selected.flag}</span>
          {selected.name}
        </span>
        <span className="text-muted text-xs">{isOpen ? "▲" : "▼"}</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md z-50 max-h-80 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-3 border-b border-border">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries..."
                autoFocus
                className="w-full bg-transparent text-foreground text-sm focus:outline-none font-sans placeholder:text-faint"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-muted text-xs font-sans">
                  No countries found.
                </div>
              ) : (
                filtered.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors border-b border-border last:border-0 flex items-center gap-3 ${
                      country.code === selected.code ? "bg-accent/5" : ""
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-foreground text-sm font-sans">
                      {country.name}
                    </span>
                    {country.code === selected.code && (
                      <span className="ml-auto text-accent text-xs">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
