"use client";

import dynamic from "next/dynamic";
import type { GooeyNavItem } from "./GooeyNav/GooeyNav";

const GooeyNav = dynamic(() => import("./GooeyNav/GooeyNav"), { ssr: false });

const items: GooeyNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Citizen", href: "/citizen" },
  { label: "Official", href: "/official" },
  { label: "Impact", href: "#impact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 text-xs">
            स
          </span>
          Sahayak
        </a>
        <div className="hidden sm:block">
          <GooeyNav items={items} particleCount={12} />
        </div>
        <nav className="flex gap-4 text-sm font-medium sm:hidden">
          {items.map((item) => (
            <a key={item.label} href={item.href} className="text-white/80 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
