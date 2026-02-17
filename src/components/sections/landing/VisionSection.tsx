"use client";

import React from "react";
import { motion } from "framer-motion";

export default function VisionSection() {
    const milestones = [
        { value: 0, label: "Start", color: "text-purple-500" },
        {
            value: 200,
            label: "200 Members",
            description: "Professional workshops and hands-on student experience.",
            color: "text-blue-500",
        },
        {
            value: 500,
            label: "500 Members",
            description:
                "Direct product validation and feedback loops for emerging startups.",
            color: "text-indigo-500",
        },
        {
            value: 1000,
            label: "1,000 Members",
            description: "A self-sustaining ecosystem of Italy’s most ambitious talent.",
            isGoal: true,
            color: "text-cyan-400",
        },
    ];

    return (
        <section className="py-24 container mx-auto px-6 relative overflow-hidden">
            <div className="text-center mb-16 md:mb-20 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
                    The Vision
                </h2>
                <h3 className="text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6 md:mb-8">
                    1,000 Members
                </h3>
                <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed">
                    We are building a native Italian community from the ground up. As we
                    grow, the scale of our impact multiplies.
                </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* Progress Bar Background */}
                <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 md:w-full md:h-1 bg-white/10 md:-translate-x-1/2 rounded-full" />

                {/* Milestones */}
                <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-4 relative h-full">
                    {milestones.map((milestone, index) => {
                        const isLast = index === milestones.length - 1;

                        return (
                            <div
                                key={index}
                                className={`relative flex md:flex-col items-start md:items-center group ${isLast ? "md:col-span-1" : ""
                                    }`}
                            >
                                {/* Visual Node */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center bg-black transition-colors duration-500
                    ${isLast ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]' : 'border-purple-500/50 group-hover:border-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'}
                  `}>
                                        <span className="text-xs font-bold text-white">
                                            {milestone.value}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="ml-8 md:ml-0 md:mt-8 md:text-center pt-2 md:pt-0">
                                    <h4 className={`text-xl font-bold mb-2 ${milestone.color}`}>
                                        {milestone.label}
                                    </h4>
                                    {milestone.description && (
                                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                                            {milestone.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Animated Progress Pulse (Decorative) */}
                <motion.div
                    className="absolute left-[28px] md:left-0 top-0 w-1 h-20 md:w-40 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-sm"
                    animate={{
                        top: ["0%", "100%"],
                        left: ["0%", "100%"]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        // Adjust animation direction based on screen size via CSS if needed, 
                        // but simpler to hide on mobile or just have generic glow
                    }}
                />

            </div>
        </section>
    );
}
