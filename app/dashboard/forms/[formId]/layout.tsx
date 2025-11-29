"use client";

import { Shell } from "@/components/layout/Shell";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";

export default function FormDashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ formId: string }>;
}) {
    const pathname = usePathname();
    const resolvedParams = use(params);
    const baseUrl = `/dashboard/forms/${resolvedParams.formId}`;

    const tabs = [
        { name: "Editor", href: baseUrl, active: pathname === baseUrl },
        { name: "Responses", href: `${baseUrl}/responses`, active: pathname === `${baseUrl}/responses` },
        // { name: "Settings", href: `${baseUrl}/settings`, active: pathname === `${baseUrl}/settings` },
    ];

    return (
        <Shell>
            <div className="flex flex-col h-full">
                <div className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-neutral-900 px-4">
                    <div className="flex items-center gap-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab.active
                                        ? "border-foreground text-foreground"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-black/10 dark:hover:border-white/10"
                                    }`}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-black/20">
                    {children}
                </div>
            </div>
        </Shell>
    );
}
