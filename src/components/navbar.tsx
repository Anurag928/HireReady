"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Bot, Menu, X } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = React.useState(false);

  // Background blur and opacity changes based on scroll
  const background = useTransform(
    scrollY,
    [0, 50],
    ["rgba(var(--background), 0)", "rgba(var(--background), 0.7)"]
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid transparent", "1px solid var(--border)"]
  );

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <motion.header
      style={{
        background: background as unknown as string,
        backdropFilter: backdropFilter as unknown as string,
        borderBottom: borderBottom as unknown as string,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent-blue/10 p-2 rounded-lg group-hover:bg-accent-blue/20 transition-colors">
            <Bot className="w-6 h-6 text-accent-blue" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            CareerPilot <span className="text-accent-blue">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground hover:text-accent-blue transition-colors"
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
            className="px-4 py-2 rounded-full text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg"
        >
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-foreground/80 hover:text-accent-blue font-medium p-2 rounded-md hover:bg-foreground/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-center px-4 py-3 rounded-md font-medium text-primary-foreground bg-primary"
            >
              Login
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
