"use client";

import { ReactNode } from "react";

interface BuilderLayoutProps {
    children: ReactNode;
    chatPanel: ReactNode;
    previewPanel: ReactNode;
}

export function BuilderLayout({ chatPanel, previewPanel }: BuilderLayoutProps) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Chat Panel (Left) */}
            <div className="w-full md:w-[400px] lg:w-[450px] border-r border-black/5 dark:border-white/5 bg-white dark:bg-neutral-900 flex flex-col z-10 shadow-xl">
                {chatPanel}
            </div>

            {/* Preview Panel (Right) */}
            <div className="flex-1 bg-neutral-50 dark:bg-black/50 overflow-y-auto relative">
                <div className="absolute inset-0 p-8 flex justify-center">
                    {previewPanel}
                </div>
            </div>
        </div>
    );
}
