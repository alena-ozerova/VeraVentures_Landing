"use client";

import React from "react";
import Image from "next/image";

export default function PartnersSection() {
    return (
        <section className="py-12 container mx-auto px-6 border-t border-white/5" id="partners">
            <div className="flex flex-col items-center justify-center gap-8">
                <p className="text-base font-bold text-muted-foreground uppercase tracking-widest">
                    In Collaboration With
                </p>

                <div className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 transition-all duration-500">
                        <Image
                            src="/unibo-logo.svg"
                            alt="University of Bologna"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
