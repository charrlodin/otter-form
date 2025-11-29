"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateFormButton } from "@/components/dashboard/CreateFormButton";
import { FormCard } from "@/components/dashboard/FormCard";

export default function DashboardPage() {
    const forms = useQuery(api.forms.getMyForms);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your forms and view responses.</p>
                </div>
                <CreateFormButton />
            </div>

            {forms === undefined ? (
                // Loading State
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : forms.length === 0 ? (
                // Empty State
                <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02]">
                    <h3 className="font-heading text-xl font-semibold mb-2">No forms yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Create your first AI-powered form to start collecting responses.
                    </p>
                    <CreateFormButton />
                </div>
            ) : (
                // Grid of Forms
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form) => (
                        <FormCard key={form._id} form={form} />
                    ))}
                </div>
            )}
        </div>
    );
}
