"use client";

import React, { useState, useEffect } from "react";
import HelpModal from "./HelpModal";

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  // F1 key handler
  useEffect(() => {
    const handleF1 = (e: KeyboardEvent) => {
      // Prevent default browser help
      if (e.key === "F1") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleF1);
    return () => {
      window.removeEventListener("keydown", handleF1);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-keppel-500 hover:from-emerald-600 hover:to-keppel-600 dark:from-emerald-600 dark:to-keppel-600 dark:hover:from-emerald-700 dark:hover:to-keppel-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900"
        aria-label="Abrir ayuda (Presiona F1)"
        title="Ayuda (F1)"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
        {/* Pulse animation indicator */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
      </button>

      <HelpModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
