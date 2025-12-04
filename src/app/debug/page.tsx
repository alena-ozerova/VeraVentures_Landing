"use client";

import { useState } from "react";

export default function DebugPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-white text-3xl font-bold mb-8">Debug Page</h1>

        <div className="mb-8">
          <h2 className="text-white text-xl mb-4">Basic Hover Test</h2>
          <div
            className="relative h-48 rounded-xl bg-gray-900 overflow-hidden"
            onMouseEnter={() => {
              console.log("Mouse entered");
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              console.log("Mouse left");
              setIsHovered(false);
            }}
          >
            <div className="relative p-6 h-full">
              <h3 className="text-white text-xl mb-2">Hover over me</h3>
              <p className="text-gray-300">This should change color when hovered</p>
              <div className={`mt-4 p-2 rounded text-xs ${
                isHovered ? "bg-purple-600" : "bg-gray-600"
              }`}>
                Status: {isHovered ? "HOVERING" : "NOT HOVERING"}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-white text-xl mb-4">CSS Hover Test</h2>
          <div className="group relative h-48 rounded-xl bg-gray-900 overflow-hidden hover:border hover:border-purple-500 transition-all">
            <div className="relative p-6 h-full">
              <h3 className="text-white text-xl mb-2">Group hover test</h3>
              <p className="text-gray-300">This should get a purple border on hover using Tailwind group class</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-white text-xl mb-4">Glow Test</h2>
          <div className="relative h-48 rounded-xl bg-gray-900 overflow-hidden">
            <div
              className={`absolute -inset-2 rounded-xl transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: "linear-gradient(to right, rgba(147, 51, 234, 0.8), rgba(59, 130, 246, 0.8))",
                filter: "blur(10px)",
                boxShadow: "0 0 25px rgba(147, 51, 234, 0.4), inset 0 0 15px rgba(147, 51, 234, 0.2)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            <div className="relative p-6 h-full z-10">
              <h3 className="text-white text-xl mb-2">Glow border test</h3>
              <p className="text-gray-300">This should get a glowing border on hover</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
