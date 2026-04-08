import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { ImageGenerator } from "./components/ImageGenerator";
import { Gallery } from "./components/Gallery";
import { AuthForm } from "./components/AuthForm";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0b0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-amber-200/60 font-medieval tracking-widest text-sm">PREPARING THE STABLES...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-amber-50 relative overflow-hidden">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative border pattern */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />

      {/* Header */}
      <header className="relative z-10 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl md:text-4xl">🐴</div>
            <div>
              <h1 className="font-medieval text-xl md:text-2xl tracking-wider text-amber-100">
                DESTRIER FORGE
              </h1>
              <p className="text-[10px] md:text-xs text-amber-600/80 tracking-[0.2em] uppercase">
                Medieval Horse Illuminations
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="flex bg-amber-950/30 rounded-lg p-1 border border-amber-900/30">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium tracking-wide transition-all rounded-md ${
                    activeTab === "create"
                      ? "bg-amber-800/50 text-amber-100 shadow-inner"
                      : "text-amber-500/70 hover:text-amber-300"
                  }`}
                >
                  CREATE
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium tracking-wide transition-all rounded-md ${
                    activeTab === "gallery"
                      ? "bg-amber-800/50 text-amber-100 shadow-inner"
                      : "text-amber-500/70 hover:text-amber-300"
                  }`}
                >
                  GALLERY
                </button>
              </nav>
              <button
                onClick={() => signOut()}
                className="px-3 md:px-4 py-2 text-xs text-amber-600/70 hover:text-amber-400 transition-colors border border-amber-900/30 rounded-lg hover:border-amber-700/50"
              >
                DEPART
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-12 pb-24">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <div className="text-6xl md:text-8xl mb-4 md:mb-6">🐎</div>
              <h2 className="font-medieval text-2xl md:text-3xl text-amber-200 mb-3 md:mb-4">
                Enter the Royal Stables
              </h2>
              <p className="text-amber-500/70 text-sm md:text-base leading-relaxed">
                Conjure magnificent steeds of the medieval realm through the arcane arts of artificial intelligence.
              </p>
            </div>

            <AuthForm />

            <div className="mt-6 md:mt-8 text-center">
              <button
                onClick={() => signIn("anonymous")}
                className="text-amber-600/60 hover:text-amber-400 text-sm transition-colors underline underline-offset-4 decoration-amber-800/50"
              >
                Continue as wandering traveler
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "create" && <ImageGenerator />}
            {activeTab === "gallery" && <Gallery />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 py-3 md:py-4 text-center bg-gradient-to-t from-[#0d0b0a] via-[#0d0b0a]/95 to-transparent">
        <p className="text-[10px] md:text-xs text-amber-700/40 tracking-wide">
          Requested by <span className="text-amber-600/50">@web-user</span> · Built by <span className="text-amber-600/50">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}
