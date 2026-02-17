"use client";

import React from "react";
import { ContainerScroll, CardSticky } from "@/components/blocks/cards-stack";

export default function PillarsSection() {
    const cards = [
        {
            title: "Experience",
            subtitle: "Skip the theory.",
            description:
                "We focus on professional, hands-on experience through hackathons and workshops designed to bridge the gap between university and the real world.",
            // Subtle glass gradient (Purple/Indigo)
            bg: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30",
            border: "border-purple-500/20"
        },
        {
            title: "Insight",
            subtitle: "Discover your path.",
            description:
                "Through founder spotlights and student journeys, we make careers in startups and VC tangible and attainable.",
            // Subtle glass gradient (Blue/Cyan)
            bg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30",
            border: "border-blue-500/20"
        },
        {
            title: "Access",
            subtitle: "Stop searching for opportunities.",
            description:
                "We bring internships, mentorships, and exclusive events directly to our members.",
            // Subtle glass gradient (Cyan/Sky) - No Green
            bg: "bg-gradient-to-br from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30",
            border: "border-cyan-500/20"
        },
    ];

    return (
        <section className="py-24 container mx-auto px-6" id="pillars">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                    The Pillars
                </h2>
                <p className="text-xl text-muted-foreground">
                    Built on three core foundations.
                </p>
            </div>

            <ContainerScroll>
                <div className="flex flex-col items-center justify-center w-full relative">
                    {cards.map((card, index) => (
                        <CardSticky
                            key={index}
                            index={index}
                            // Restored mb-32 for significant spacing between cards before they stack
                            // Increased incrementY to 40 for more visible stacking offset
                            incrementY={40}
                            className={`w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 md:p-14 mb-16 backdrop-blur-2xl border shadow-xl ${card.bg} ${card.border} transition-all duration-500`}
                        >
                            <div className="flex flex-col h-full justify-center text-left">
                                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {card.title}
                                </h3>
                                {/* Sentence case, clear primary color */}
                                <h4 className="text-xl md:text-2xl font-semibold text-primary mb-6">
                                    {card.subtitle}
                                </h4>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                    {card.description}
                                </p>
                            </div>
                        </CardSticky>
                    ))}
                    {/* Spacer to allow scrolling past the last card properly */}
                    <div className="h-40"></div>
                </div>
            </ContainerScroll>
        </section>
    );
}
