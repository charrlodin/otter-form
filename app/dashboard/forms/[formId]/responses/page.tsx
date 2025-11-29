"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { ResponsesTable } from "@/components/dashboard/ResponsesTable";

export default function ResponsesPage() {
    const params = useParams();
    const formId = params.formId as Id<"forms">;

    const form = useQuery(api.forms.getForm, { formId });
    const stats = useQuery(api.responses.getFormStats, { formId });
    const responses = useQuery(api.responses.getFormResponses, { formId });

    if (!form || !stats || !responses) {
        return <div className="p-8 text-center">Loading analytics...</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold mb-2">Responses & Analytics</h1>
                <p className="text-muted-foreground">Track performance and view submissions for {form.title}.</p>
            </div>

            <AnalyticsCards stats={stats} />

            <ResponsesTable responses={responses} schema={form.schema} />
        </div>
    );
}
