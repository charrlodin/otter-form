"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: "01",
        title: "Describe Your Form",
        description: "Tell us what you need in plain English. \"I need a customer feedback form with rating, comments, and email.\"",
    },
    {
        number: "02",
        title: "AI Generates It",
        description: "Our AI builds the complete form structure - questions, validation, and logic - in seconds.",
    },
    {
        number: "03",
        title: "Customize & Share",
        description: "Fine-tune with natural language commands, then share your unique link. Start collecting responses immediately.",
    },
];

export function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from(headingRef.current, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 80%",
                },
            });

            gsap.from(".step-item", {
                x: -60,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: stepsRef.current,
                    start: "top 75%",
                },
            });
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="py-24 md:py-32 border-t border-black/5 dark:border-white/5">
            <div ref={headingRef} className="mb-16">
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                    How it works
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    From idea to live form in under a minute. No templates, no drag-and-drop.
                </p>
            </div>

            <div ref={stepsRef} className="space-y-8">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="step-item group flex flex-col md:flex-row gap-6 md:gap-12 p-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-300"
                    >
                        <div className="flex-shrink-0">
                            <span className="font-heading text-5xl md:text-6xl font-bold text-black/10 dark:text-white/10 group-hover:text-black/20 dark:group-hover:text-white/20 transition-colors">
                                {step.number}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
                                {step.title}
                            </h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
