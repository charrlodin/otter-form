"use client";

import { FormField } from "@/convex/types";
import { useRef, useEffect } from "react";

interface QuestionCardProps {
    field: FormField;
    value: string | number | string[] | undefined;
    onChange: (value: string | number | string[]) => void;
    onEnter: (value?: string | number | string[]) => void;
    isActive: boolean;
}

export function QuestionCard({ field, value, onChange, onEnter, isActive }: QuestionCardProps) {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isActive && inputRef.current) {
            // Small delay to ensure animation is done or DOM is ready
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isActive]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter();
        }
    };

    return (
        <div className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-50 blur-sm pointer-events-none"}`}>
            <div className="mb-6">
                <label className="block font-heading text-2xl md:text-3xl font-bold mb-2 text-foreground">
                    {field.label}
                    {field.required && <span className="text-primary ml-1">*</span>}
                </label>
                {field.helpText && (
                    <p className="text-lg text-muted-foreground">{field.helpText}</p>
                )}
            </div>

            <div className="max-w-xl">
                {field.type === "short_text" && (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={field.placeholder || "Type your answer here..."}
                        className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-foreground py-3 text-2xl md:text-3xl outline-none transition-colors placeholder:text-muted-foreground/50"
                    />
                )}

                {field.type === "long_text" && (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            // Allow Shift+Enter for newlines
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onEnter();
                            }
                        }}
                        placeholder={field.placeholder || "Type your answer here..."}
                        rows={3}
                        className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-foreground py-3 text-xl md:text-2xl outline-none transition-colors placeholder:text-muted-foreground/50 resize-none"
                    />
                )}

                {field.type === "email" && (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="email"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={field.placeholder || "name@example.com"}
                        className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-foreground py-3 text-2xl md:text-3xl outline-none transition-colors placeholder:text-muted-foreground/50"
                    />
                )}

                {field.type === "number" && (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="number"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={field.placeholder || "0"}
                        className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-foreground py-3 text-2xl md:text-3xl outline-none transition-colors placeholder:text-muted-foreground/50"
                    />
                )}

                {(field.type === "multiple_choice" || field.type === "dropdown") && (
                    <div className="space-y-3">
                        {field.options?.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    onChange(option);
                                    // Auto-advance for single choice
                                    setTimeout(() => onEnter(option), 300);
                                }}
                                className={`flex items-center w-full p-4 text-left border rounded-xl transition-all duration-200 group ${value === option
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                                    }`}
                            >
                                <span className={`flex items-center justify-center w-8 h-8 mr-4 text-sm font-medium border rounded-md transition-colors ${value === option
                                    ? "border-background text-background bg-white dark:bg-black"
                                    : "border-black/20 dark:border-white/20 text-muted-foreground group-hover:border-foreground"
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-lg font-medium">{option}</span>
                                {value === option && (
                                    <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {field.type === "rating" && (
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: field.maxRating || 10 }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => {
                                    onChange(num);
                                    setTimeout(() => onEnter(num), 300);
                                }}
                                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-xl font-medium rounded-xl border transition-all duration-200 ${value === num
                                    ? "border-foreground bg-foreground text-background scale-110"
                                    : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 hover:border-foreground/50"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                )}
                {field.type === "checkbox" && (
                    <div className="space-y-3">
                        {field.options?.map((option, index) => {
                            const currentValues = (value as string[]) || [];
                            const isSelected = currentValues.includes(option);
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const newValues = isSelected
                                            ? currentValues.filter((v) => v !== option)
                                            : [...currentValues, option];
                                        onChange(newValues);
                                    }}
                                    className={`flex items-center w-full p-4 text-left border rounded-xl transition-all duration-200 group ${isSelected
                                        ? "border-foreground bg-foreground/5"
                                        : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-6 h-6 mr-4 border rounded transition-colors ${isSelected
                                        ? "bg-foreground border-foreground text-background"
                                        : "border-black/20 dark:border-white/20 group-hover:border-foreground"
                                        }`}>
                                        {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <span className="text-lg font-medium">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
                {field.type === "file_upload" && (
                    <div className="p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl text-center">
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        </div>
                        <p className="text-muted-foreground mb-2">File upload is coming soon.</p>
                        <button
                            onClick={() => onEnter("skipped_file_upload")}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Skip this question
                        </button>
                    </div>
                )}
            </div>

            {isActive && (
                <div className="mt-8 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    <button
                        onClick={() => onEnter(value)}
                        className="px-8 py-3 bg-foreground text-background font-medium rounded-full hover:opacity-90 transition-opacity"
                    >
                        OK
                        <span className="ml-2 text-xs opacity-70">↵</span>
                    </button>
                    <span className="text-sm text-muted-foreground hidden md:inline-block">
                        press <strong className="text-foreground">Enter</strong>
                    </span>
                </div>
            )}
        </div>
    );
}
