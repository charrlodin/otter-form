"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { ChatInterface } from "@/components/builder/ChatInterface";
import { FormPreview } from "@/components/builder/FormPreview";
import { AIConfigModal } from "@/components/builder/AIConfigModal";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function BuilderPage() {
    const params = useParams();
    const formId = params.formId as Id<"forms">;

    const form = useQuery(api.forms.getForm, { formId });
    const updateForm = useMutation(api.forms.updateForm);

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [aiConfig, setAiConfig] = useState<{ apiKey: string; model: string } | null>(null);

    // Load config from local storage or form settings on mount
    useEffect(() => {
        if (form?.generationSettings) {
            setAiConfig(form.generationSettings);
        } else {
            const saved = localStorage.getItem("otter_ai_config");
            if (saved) {
                setAiConfig(JSON.parse(saved));
            } else {
                // If no config found, open modal
                setIsConfigOpen(true);
            }
        }
    }, [form?.generationSettings]);

    const handleSaveConfig = async (config: { apiKey: string; model: string }) => {
        setAiConfig(config);
        localStorage.setItem("otter_ai_config", JSON.stringify(config));

        // Optionally save to form settings if you want it persisted per form
        if (form) {
            await updateForm({
                formId,
                updates: {
                    generationSettings: config
                }
            });
        }

        setIsConfigOpen(false);
    };

    const [isShareOpen, setIsShareOpen] = useState(false);

    const handlePublish = async () => {
        await updateForm({
            formId,
            updates: { isActive: true }
        });
        setIsShareOpen(true);
    };

    if (form === undefined) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (form === null) {
        return <div>Form not found</div>;
    }

    return (
        <>
            <div className="h-14 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 bg-white dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                    <a href="/dashboard" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                    <span className="font-medium truncate max-w-[200px]">{form.title}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-muted-foreground">
                        {form.isActive ? "Published" : "Draft"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsConfigOpen(true)}
                        className="p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        AI Settings
                    </button>
                    <button
                        onClick={handlePublish}
                        className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {form.isActive ? "Share" : "Publish"}
                    </button>
                </div>
            </div>

            <div className="h-[calc(100vh-3.5rem)]">
                <BuilderLayout
                    chatPanel={
                        <ChatInterface
                            formId={formId}
                            currentSchema={form.schema}
                            apiKey={aiConfig?.apiKey}
                            model={aiConfig?.model}
                            onConfigClick={() => setIsConfigOpen(true)}
                            initialMessages={form.chatHistory}
                        />
                    }
                    previewPanel={<FormPreview schema={form.schema} />}
                >
                    null
                </BuilderLayout>
            </div>

            <AIConfigModal
                isOpen={isConfigOpen}
                onSave={handleSaveConfig}
                onClose={() => setIsConfigOpen(false)}
                initialConfig={aiConfig || undefined}
            />

            {isShareOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="font-heading text-2xl font-bold mb-4">Form Published!</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Your form is now live. Share this link with your audience.
                        </p>

                        <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/5 mb-6">
                            <code className="flex-1 text-sm truncate">
                                {window.location.origin}/f/{form.slug}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`);
                                    alert("Copied!");
                                }}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z"></path></svg>
                            </button>
                            <a
                                href={`/f/${form.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsShareOpen(false)}
                                className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
