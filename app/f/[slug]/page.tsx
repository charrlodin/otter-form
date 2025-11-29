"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FormRunner } from "@/components/runner/FormRunner";
import { useParams } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useState, useEffect } from "react";


export default function PublicFormPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [password, setPassword] = useState("");
    const [submittedPassword, setSubmittedPassword] = useState<string | undefined>(undefined);

    const form = useQuery(api.forms.getFormBySlug, { slug, password: submittedPassword });
    const incrementViewCount = useMutation(api.forms.incrementViewCount);

    useEffect(() => {
        if (form) {
            incrementViewCount({ formId: form._id });
        }
    }, [form, incrementViewCount]);

    if (form === undefined) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (form === null) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="font-heading text-3xl font-bold mb-2">Form Not Found</h1>
                <p className="text-muted-foreground">The form you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    if (form.isLocked) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-xl">
                    <h1 className="font-heading text-2xl font-bold mb-4">Password Required</h1>
                    <p className="text-muted-foreground mb-6">This form is protected. Please enter the password to continue.</p>

                    <form onSubmit={(e) => { e.preventDefault(); setSubmittedPassword(password); }} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password..."
                            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Unlock Form
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!form.isActive) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="font-heading text-3xl font-bold mb-2">Form Closed</h1>
                <p className="text-muted-foreground">This form is no longer accepting responses.</p>
            </div>
        );
    }

    return (
        <Shell>
            <FormRunner formId={form._id} schema={form.schema} />
        </Shell>
    );
}
