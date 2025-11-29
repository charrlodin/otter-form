"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const blobRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Blob floating animation
            gsap.to(blobRef.current, {
                y: "-=50",
                x: "+=30",
                rotation: 10,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Staggered Reveal
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(badgeRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8,
            })
                .from(
                    titleRef.current,
                    {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                        skewY: 2,
                    },
                    "-=0.4"
                )
                .from(
                    descRef.current,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                    },
                    "-=0.6"
                )
                .from(
                    buttonsRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.8,
                    },
                    "-=0.6"
                );
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] flex flex-col justify-end pb-20 pt-32 overflow-hidden"
        >
            {/* Abstract Visual / Gradient Blob */}
            <div
                ref={blobRef}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
            />

            <div className="relative z-10 max-w-5xl">
                {/* Badge */}
                <div
                    ref={badgeRef}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                        AI-Powered Form Builder
                    </span>
                </div>

                {/* Massive Typography */}
                <h1
                    ref={titleRef}
                    className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 text-balance"
                >
                    Forms that <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
                        feel alive.
                    </span>
                </h1>

                <p
                    ref={descRef}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light"
                >
                    Describe your form in plain English. We build the logic, validation,
                    and design instantly. No drag-and-drop required.
                </p>

                <div ref={buttonsRef} className="flex flex-wrap gap-4">
                    <Link
                        href="/dashboard"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-[#1a1a1a] dark:bg-[#ededed] dark:text-black rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground"
                    >
                        Start Building
                        <svg
                            className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            ></path>
                        </svg>
                    </Link>

                    <Link
                        href="/demo"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-all duration-200 bg-transparent border border-black/10 dark:border-white/10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
                    >
                        View Demo
                    </Link>
                </div>
            </div>
        </section>
    );
}
