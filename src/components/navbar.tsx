"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Bot, Menu, X } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = React.useState(false);

  // Floating pill styles based on scroll
  const background = useTransform(
    scrollY,
    [0, 50],
    ["rgba(var(--background), 0.0)", "rgba(var(--background), 0.7)"]
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(16px)"]
  );
  const border = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(255,255,255,0.0)", "1px solid rgba(148, 163, 184, 0.2)"]
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 20px 40px -20px rgba(0,0,0,0.15)"]
  );
  const width = useTransform(
    scrollY,
    [0, 50],
    ["100%", "min(100% - 2rem, 1200px)"]
  );
  const y = useTransform(
    scrollY,
    [0, 50],
    ["0px", "16px"]
  );
  const borderRadius = useTransform(
    scrollY,
    [0, 50],
    ["0px", "9999px"]
  );

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "AI Intelligence", href: "/#showcase" },
    { name: "How It Works", href: "/#how-it-works" },
  ];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.header
        style={{
          background: background as unknown as string,
          backdropFilter: backdropFilter as unknown as string,
          border: border as unknown as string,
          boxShadow: boxShadow as unknown as string,
          width: width as unknown as string,
          y: y as unknown as string,
          borderRadius: borderRadius as unknown as string,
        }}
        className="pointer-events-auto transition-colors duration-300 overflow-hidden"
      >
        <div className="px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent-blue/10 p-2 rounded-lg group-hover:bg-accent-blue/20 transition-colors">
            <Bot className="w-6 h-6 text-accent-blue" />
          </div>
          <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            HireReady
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
            className="px-5 py-2 text-sm font-semibold text-foreground hover:text-accent-blue transition-colors rounded-full hover:bg-foreground/5"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="relative group px-6 py-2.5 rounded-full text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white blur-md transition-opacity duration-300" />
            <span className="relative text-white flex items-center gap-2">
              Get Started
            </span>
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
          className="md:hidden absolute top-[80px] left-4 right-4 bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
        >
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-foreground/80 hover:text-accent-blue font-semibold p-3 rounded-xl hover:bg-foreground/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-3 rounded-xl font-semibold text-foreground hover:bg-foreground/5 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      </motion.header>
    </div>
  );
}
