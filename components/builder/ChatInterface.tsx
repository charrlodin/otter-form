"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { FormSchema } from "@/convex/types";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
    formId: Id<"forms">;
    currentSchema?: FormSchema | null;
    apiKey?: string;
    model?: string;
    onConfigClick: () => void;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatInterface({ formId, currentSchema, apiKey, model, onConfigClick, initialMessages }: ChatInterfaceProps & { initialMessages?: Message[] }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>(initialMessages || [
        { role: "assistant", content: "Hi! Describe the form you want to build." },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const generateForm = useAction(api.ai.generateFormSchema);
    const updateForm = useMutation(api.forms.updateForm);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Save chat history whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            const saveHistory = async () => {
                try {
                    await updateForm({
                        formId,
                        updates: {
                            chatHistory: messages
                        }
                    });
                } catch (error) {
                    console.error("Failed to save chat history:", error);
                }
            };

            // Debounce or just save
            const timer = setTimeout(saveHistory, 1000);
            return () => clearTimeout(timer);
        }
    }, [messages, formId, updateForm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!apiKey) {
            onConfigClick();
            return;
        }

        const userMsg = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await generateForm({
                formId,
                prompt: userMsg,
                currentSchema,
                apiKey,
                model,
            });

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.message },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong. Please check your API key and try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-foreground text-background rounded-br-none"
                                : "bg-neutral-100 dark:bg-neutral-800 rounded-bl-none"
                                }`}
                        >
                            {msg.role === "assistant" ? (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 overflow-hidden flex-shrink-0 relative">
                                        <Image src="/otter-logo.png" alt="Otter" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <ReactMarkdown
                                            components={{
                                                ul: ({ ...props }) => <ul className="list-disc pl-4 my-2" {...props} />,
                                                ol: ({ ...props }) => <ol className="list-decimal pl-4 my-2" {...props} />,
                                                li: ({ ...props }) => <li className="my-1" {...props} />,
                                                p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-neutral-900">
                <form onSubmit={handleSubmit} className="relative flex gap-2">
                    <button
                        type="button"
                        onClick={onConfigClick}
                        className="p-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground"
                        title="AI Settings"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder={apiKey ? "e.g. Add a phone number field..." : "Set API Key to start..."}
                        rows={1}
                        className="flex-1 pl-4 pr-12 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none min-h-[48px] max-h-[120px]"
                        style={{ height: "auto", minHeight: "48px" }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-foreground hover:opacity-70 disabled:opacity-30 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
