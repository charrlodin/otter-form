import { FormSchema } from "@/convex/types";
import { QuestionCard } from "@/components/runner/QuestionCard";

interface FormPreviewProps {
    schema?: FormSchema;
}

export function FormPreview({ schema }: FormPreviewProps) {
    if (!schema || !schema.fields || schema.fields.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <p className="text-lg font-medium mb-2">Your form is empty</p>
                <p className="text-sm">Start chatting with the AI to build your form.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-8 md:p-12 bg-neutral-50/50 dark:bg-black/20">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl font-bold mb-4">{schema.title}</h1>
                    {schema.description && (
                        <p className="text-xl text-muted-foreground">{schema.description}</p>
                    )}
                </div>

                <div className="space-y-8">
                    {schema.fields.map((field) => (
                        <div key={field.id} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                            <QuestionCard
                                field={field}
                                value={undefined}
                                onChange={() => { }}
                                onEnter={() => { }}
                                isActive={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
