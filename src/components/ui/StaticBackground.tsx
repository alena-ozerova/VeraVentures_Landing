"use client";

import React from "react";

export default function StaticBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Simple gradient background without animations */}
      <div
        className="w-full h-full bg-gradient-to-br from-black via-purple-900/20 to-blue-900/20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
        }}
      />
    </div>
  );
}
