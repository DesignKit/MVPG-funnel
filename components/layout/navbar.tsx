"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Our Project", href: "/#our-project" },
  { label: "How it work", href: "/#howitwork" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white">
      <Container className="flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="MVP Gurus"
            width={89}
            height={52}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 tablet:flex desktop:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/register" variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 tablet:hidden desktop:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "h-0.5 w-6 bg-foreground transition-transform",
              mobileOpen && "translate-y-2 rotate-45"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-foreground transition-opacity",
              mobileOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-foreground transition-transform",
              mobileOpen && "-translate-y-2 -rotate-45"
            )}
          />
        </button>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-6 pb-6 pt-4 tablet:hidden desktop:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button href="/register" variant="primary" className="mt-2 w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
