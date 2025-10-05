"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-brandDark text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Smart Fin
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/sources" className="hover:underline">
            Sources
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-brandAccent px-3 py-1 rounded hover:bg-red-700 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}
