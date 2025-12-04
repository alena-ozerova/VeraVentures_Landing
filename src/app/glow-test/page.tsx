"use client";

import GlowingEffect from "@/components/ui/glowing-effect";
import { SimpleGlow } from "@/components/ui/simple-glow/component";
import { DirectGlow } from "@/components/ui/direct-glow/component";

export default function GlowTestPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-4xl font-bold mb-8">Glowing Effect Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Test Card 1 */}
        <div className="relative h-64 rounded-xl bg-gray-900 overflow-hidden">
          <GlowingEffect />
          <div className="relative z-10 p-6 flex flex-col justify-center h-full">
            <h2 className="text-white text-xl font-semibold mb-2">Default Glow</h2>
            <p className="text-gray-300">Move your mouse over this card to see the purple/blue glowing effect</p>
          </div>
        </div>

        {/* Test Card 2 */}
        <div className="relative h-64 rounded-xl bg-gray-900 overflow-hidden">
          <GlowingEffect />
          <div className="relative z-10 p-6 flex flex-col justify-center h-full">
            <h2 className="text-white text-xl font-semibold mb-2">White Glow</h2>
            <p className="text-gray-300">Move your mouse over this card to see the white glowing effect</p>
          </div>
        </div>

        {/* Test Card 3 - Disabled */}
        <div className="relative h-64 rounded-xl bg-gray-900 overflow-hidden">
          <GlowingEffect />
          <div className="relative z-10 p-6 flex flex-col justify-center h-full">
            <h2 className="text-white text-xl font-semibold mb-2">No Glow</h2>
            <p className="text-gray-300">This card has the glowing effect disabled</p>
          </div>
        </div>

        {/* Test Card 4 - Larger Blur */}
        <div className="relative h-64 rounded-xl bg-gray-900 overflow-hidden">
          <GlowingEffect />
          <div className="relative z-10 p-6 flex flex-col justify-center h-full">
            <h2 className="text-white text-xl font-semibold mb-2">Large Blur</h2>
            <p className="text-gray-300">This card has a larger blur radius for a more diffused glow</p>
          </div>
        </div>

        {/* Simple Glow Test Card */}
        <div className="col-span-full md:col-span-1">
          <div className="relative h-64 rounded-xl bg-gray-900 overflow-hidden">
            <SimpleGlow />
            <div className="relative z-10 p-6 flex flex-col justify-center h-full">
              <h2 className="text-white text-xl font-semibold mb-2">Simple Glow</h2>
              <p className="text-gray-300">A simplified version of the glow effect</p>
            </div>
          </div>
        </div>

        {/* Direct Glow Test Card */}
        <div className="col-span-full md:col-span-1">
          <div className="relative h-64 rounded-xl bg-gray-900 overflow-hidden">
            <DirectGlow />
            <div className="relative z-10 p-6 flex flex-col justify-center h-full">
              <h2 className="text-white text-xl font-semibold mb-2">Direct Glow</h2>
              <p className="text-gray-300">A new implementation using direct styles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
