"use client";

import { useState } from "react";

interface AIConfigModalProps {
    isOpen: boolean;
    onSave: (config: { apiKey: string; model: string }) => void;
    onClose: () => void;
    initialConfig?: { apiKey: string; model: string };
}

const POPULAR_MODELS = [
    { id: "openai/gpt-4o", name: "GPT-4o (OpenAI)" },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Anthropic)" },
    { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5 (Google)" },
    { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B (Meta)" },
];

export function AIConfigModal({ isOpen, onSave, onClose, initialConfig }: AIConfigModalProps) {
    const [apiKey, setApiKey] = useState(initialConfig?.apiKey || "");
    const [model, setModel] = useState(initialConfig?.model || POPULAR_MODELS[0].id);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey && model) {
            onSave({ apiKey, model });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-6 animate-in fade-in zoom-in duration-200">
                <h2 className="font-heading text-2xl font-bold mb-4">AI Configuration</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Enter your OpenRouter API key to start building. We don&apos;t store this on our servers; it&apos;s sent directly to the AI provider.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">OpenRouter API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-or-..."
                            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Get one at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">openrouter.ai</a>
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        >
                            {POPULAR_MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!apiKey}
                            className="px-4 py-2 text-sm font-medium text-white bg-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            Save & Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
