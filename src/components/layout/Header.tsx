"use client";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 p-6 transition-all duration-300">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm" />
      <div className="relative container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-foreground font-bold text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Vera Ventures
          </span>
        </div>

        {/* Authentication Removed */}
        <div></div>
      </div>
    </header>
  );
}
