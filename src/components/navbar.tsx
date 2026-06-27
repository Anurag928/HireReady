"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Intelligence", href: "/#showcase" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ease-out flex justify-center py-4 px-4 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`w-full max-w-6xl mx-auto flex items-center justify-between px-6 h-14 rounded-2xl transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-md border border-border shadow-sm"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
             <div className="w-3 h-3 rounded-sm bg-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            HireReady
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="md:hidden absolute top-[72px] left-4 right-4 bg-background border border-border shadow-xl rounded-2xl overflow-hidden z-[51]"
        >
          <div className="flex flex-col p-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-foreground font-medium p-4 rounded-xl hover:bg-muted transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border p-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center p-3 rounded-xl font-medium text-foreground hover:bg-muted transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center p-3 rounded-xl font-medium bg-primary text-primary-foreground transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}