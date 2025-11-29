import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface FormCardProps {
    form: Doc<"forms">;
}

export function FormCard({ form }: FormCardProps) {
    const deleteForm = useMutation(api.forms.deleteForm);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
            try {
                await deleteForm({ formId: form._id });
            } catch (error) {
                console.error("Failed to delete form:", error);
                alert("Failed to delete form.");
            }
        }
    };

    return (
        <Link
            href={`/dashboard/forms/${form._id}`}
            className="group block p-6 bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl transition-all hover:shadow-md hover:scale-[1.01] relative"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {form.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {form.description || "No description"}
                    </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${form.isActive ? "bg-green-500" : "bg-neutral-300"}`} />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <span>{form.submissionCount} responses</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(form.createdAt)} ago</span>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDelete}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-md transition-colors"
                        title="Delete Form"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <span className="text-primary font-medium">
                        Edit →
                    </span>
                </div>
            </div>
        </Link>
    );
}
