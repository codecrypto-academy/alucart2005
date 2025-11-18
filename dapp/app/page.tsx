"use client";

import WalletSelector from "@/components/WalletSelector";
import FileUpload from "@/components/FileUpload";
import DocumentVerifier from "@/components/DocumentVerifier";
import DocumentList from "@/components/DocumentList";
import HelpButton from "@/components/HelpButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-mindaro-900 dark:bg-indigo-dye-100 py-8 px-4">
      <HelpButton />
      <div className="max-w-7xl mx-auto">
        {/* Header - Single-line compact design */}
        <header className="mb-8">
          <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500/10 via-keppel-500/10 to-verdigris-500/10 dark:from-emerald-500/20 dark:via-keppel-500/20 dark:to-verdigris-500/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛓️</span>
              <span className="text-xl">🔒</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-keppel-600 to-verdigris-600 dark:from-emerald-400 dark:via-keppel-400 dark:to-verdigris-400 bg-clip-text text-transparent tracking-tight">
              FileHashStorage
            </h1>
            <span className="text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-700">
              dApp
            </span>
            <div className="hidden sm:flex items-center gap-1 text-xs text-keppel-600 dark:text-keppel-400 ml-2">
              <span>•</span>
              <span>Secure</span>
              <span>•</span>
              <span>Blockchain</span>
              <span>•</span>
            </div>
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <WalletSelector />
          </div>
          <div>
            <FileUpload />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <DocumentVerifier />
          </div>
          <div>
            <DocumentList />
          </div>
        </div>

        {/* Footer - Compact and always visible */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 py-2 px-4 bg-white/95 dark:bg-lapis-lazuli-900/95 backdrop-blur-sm border-t border-emerald-200 dark:border-lapis-lazuli-700 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-indigo-dye-600 dark:text-keppel-300 text-center">
              Conectado a Anvil en{" "}
              <span className="font-mono bg-emerald-100 dark:bg-lapis-lazuli-800 px-2 py-0.5 rounded text-emerald-700 dark:text-keppel-200">
                http://localhost:8545
              </span>
            </p>
          </div>
        </footer>

        {/* Spacer to prevent content from being hidden behind fixed footer */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}
