"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from(contentRef.current, {
                y: 60,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                },
            });
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="py-24 md:py-32 border-t border-black/5 dark:border-white/5">
            <div
                ref={contentRef}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 p-12 md:p-20 text-center"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
                
                <div className="relative z-10">
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white dark:text-black">
                        Ready to build smarter forms?
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 dark:text-black/70 max-w-2xl mx-auto mb-10">
                        Join thousands of creators using AI to build beautiful, intelligent forms in seconds.
                    </p>
                    <Link
                        href="/dashboard"
                        className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-white dark:bg-black text-black dark:text-white rounded-full hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-black"
                    >
                        Get Started Free
                        <svg
                            className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
