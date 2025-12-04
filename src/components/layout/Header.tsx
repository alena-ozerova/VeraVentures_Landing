"use client";

export default function Header() {
  return (
    <header className="w-full p-6 backdrop-blur-sm bg-black/30 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
            Vera Ventures
          </span>
        </div>

        {/* Authentication Removed */}
        <div></div>
      </div>
    </header>
  );
}
