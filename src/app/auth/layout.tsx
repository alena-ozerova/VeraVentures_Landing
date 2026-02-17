import React from "react";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 z-0 bg-black">
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen bg-black/60 flex items-center justify-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
