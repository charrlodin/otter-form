"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateFormButton() {
    const router = useRouter();
    const createForm = useMutation(api.forms.createForm);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            // Create a new empty form to start with
            const { formId } = await createForm({
                title: "Untitled Form",
                description: "",
                schema: { fields: [] },
            });
            router.push(`/dashboard/forms/${formId}`);
        } catch (error) {
            console.error("Failed to create form:", error);
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreate}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-foreground rounded-full hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Creating...
                </span>
            ) : (
                <>
                    <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Create New Form
                </>
            )}
        </button>
    );
}
