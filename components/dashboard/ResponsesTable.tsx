import { FormSchema } from "@/convex/types";
import { useState } from "react";

interface Response {
    _id: string;
    submittedAt: number;
    answers: Record<string, string | number | string[]>;
}

interface ResponsesTableProps {
    responses: Response[];
    schema: FormSchema;
}

export function ResponsesTable({ responses, schema }: ResponsesTableProps) {
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

    if (!responses || responses.length === 0) {
        return (
            <div className="text-center p-12 bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5">
                <p className="text-muted-foreground">No responses yet.</p>
            </div>
        );
    }

    // Get first 3 fields for table columns
    const columns = schema.fields.slice(0, 3);

    const handleExportCSV = () => {
        if (!responses.length) return;

        // Headers
        const headers = ["Timestamp", ...schema.fields.map(f => f.label)];

        // Rows
        const rows = responses.map(r => {
            const date = new Date(r.submittedAt).toLocaleString();
            const answers = schema.fields.map(f => {
                const val = r.answers[f.id];
                return Array.isArray(val) ? val.join(", ") : val || "";
            });
            return [date, ...answers];
        });

        // Combine
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        // Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${schema.title.replace(/\s+/g, "_")}_responses.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                    <h3 className="font-heading font-bold text-lg">Recent Responses</h3>
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 dark:bg-black/20 text-muted-foreground font-medium">
                            <tr>
                                <th className="p-4">Timestamp</th>
                                {columns.map(field => (
                                    <th key={field.id} className="p-4">{field.label}</th>
                                ))}
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {responses.map((response) => (
                                <tr key={response._id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-muted-foreground">
                                        {new Date(response.submittedAt).toLocaleString()}
                                    </td>
                                    {columns.map(field => {
                                        const val = response.answers[field.id];
                                        return (
                                            <td key={field.id} className="p-4 max-w-[200px] truncate">
                                                {Array.isArray(val) ? val.join(", ") : val}
                                            </td>
                                        );
                                    })}
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedResponse(response)}
                                            className="text-primary hover:underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            {selectedResponse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                            <div>
                                <h2 className="font-heading text-xl font-bold">Response Details</h2>
                                <p className="text-sm text-muted-foreground">
                                    Submitted {new Date(selectedResponse.submittedAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedResponse(null)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                            {schema.fields.map((field) => {
                                const val = selectedResponse.answers[field.id];
                                return (
                                    <div key={field.id} className="space-y-1">
                                        <h4 className="font-medium text-sm text-muted-foreground">{field.label}</h4>
                                        <div className="p-3 bg-neutral-50 dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/5 text-base">
                                            {Array.isArray(val) ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {val.map((v, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-black/5 dark:border-white/5 text-sm">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                val || <span className="text-muted-foreground italic">No answer</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t border-black/5 dark:border-white/5 flex justify-end">
                            <button
                                onClick={() => setSelectedResponse(null)}
                                className="px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
