"use client";

import Link from "next/link";
import Image from "next/image";

import { FormSchema } from "@/convex/types";

import { useState, useRef, useEffect, useCallback } from "react";
import { QuestionCard } from "./QuestionCard";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollToPlugin);

interface FormRunnerProps {
    formId: Id<"forms">;
    schema: FormSchema;
}

export function FormRunner({ formId, schema }: FormRunnerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const submitResponse = useMutation(api.submissions.submitResponse);

    const currentField = schema.fields[currentIndex];
    const progress = ((currentIndex + 1) / schema.fields.length) * 100;

    // Scroll to current question
    useGSAP(() => {
        gsap.to(window, {
            duration: 0.8,
            scrollTo: { y: `#question-${currentIndex}`, offsetY: 100 },
            ease: "power3.out"
        });
    }, [currentIndex]);

    const handleSubmit = useCallback(async () => {
        try {
            await submitResponse({
                formId,
                answers,
                metadata: {
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                }
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit form. Please try again.");
        }
    }, [formId, answers, submitResponse]);

    const handleNext = useCallback(async (overrideValue?: string | number | string[]) => {
        const answerToCheck = overrideValue !== undefined ? overrideValue : answers[currentField.id];

        // Basic validation
        if (currentField.required && !answerToCheck && answerToCheck !== 0) {
            // Shake animation or error toast could go here
            const card = document.getElementById(`question-${currentIndex}`);
            if (card) {
                gsap.to(card, { keyframes: { x: [-10, 10, -10, 10, 0] }, duration: 0.4, ease: "power2.inOut" });
            }
            return;
        }

        if (currentIndex < schema.fields.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            await handleSubmit();
        }
    }, [currentIndex, schema.fields.length, answers, currentField, handleSubmit]);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
            if (!currentField) return;

            // Only handle shortcuts if we're not typing in an input
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

            if (currentField.type === "multiple_choice" || currentField.type === "dropdown") {
                const options = currentField.options || [];
                const key = e.key.toUpperCase();

                // A, B, C selection
                if (key.length === 1 && key >= "A" && key <= "Z") {
                    const index = key.charCodeAt(0) - 65; // A=0, B=1...
                    if (index >= 0 && index < options.length) {
                        const value = options[index];
                        setAnswers(prev => ({ ...prev, [currentField.id]: value }));
                        setTimeout(handleNext, 300);
                    }
                }
            }

            // Global Enter to advance
            if (e.key === "Enter") {
                // If it's a textarea, allow newlines (unless Shift+Enter? standard is usually Enter=Submit for single line, Enter=Newline for area)
                // But here we are in global listener. If target is textarea, we returned early above.
                // So this only runs if NOT in input/textarea.
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, currentField, handleNext]);



    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-xl relative">
                    <Image src="/otter-logo.png" alt="Otter" fill className="object-cover" />
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Thank You!</h1>
                <p className="text-xl text-muted-foreground max-w-md">
                    Your response has been recorded.
                </p>
                <Link
                    href="/"
                    className="mt-8 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform"
                >
                    Build your form today →
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-black/5 dark:bg-white/5 z-50">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Questions Container */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-32 flex flex-col gap-[80vh]">
                {schema.fields.map((field, index) => (
                    <div
                        key={field.id}
                        id={`question-${index}`}
                        className={`min-h-[40vh] flex flex-col justify-center transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-30"
                            }`}
                    >
                        <QuestionCard
                            field={field}
                            value={answers[field.id]}
                            onChange={(val) => {
                                setAnswers(prev => ({ ...prev, [field.id]: val }));
                            }}
                            onEnter={(val?: string | number | string[]) => {
                                void handleNext(val);
                            }}
                            isActive={index === currentIndex}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 right-0 p-6 flex gap-2 z-40">
                <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                </button>
                <button
                    onClick={() => handleNext()}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </div>
        </div>
    );
}
