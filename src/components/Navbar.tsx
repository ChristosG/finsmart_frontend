// components/Navbar.tsx
"use client";

import Link from "next/link";
import React from "react";

export function Navbar() {
  return (
    <nav className="bg-brandDark text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Smart Fin
        </Link>
        <div className="space-x-4">
          <Link href="/sources" className="hover:underline">
            Sources
          </Link>
        </div>
      </div>
    </nav>
  );
}
