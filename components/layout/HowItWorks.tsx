"use client";

const steps = [
    {
        number: "01",
        title: "Describe Your Form",
        description: "Tell us what you need in plain English. \"I need a customer feedback form with rating, comments, and email.\"",
    },
    {
        number: "02",
        title: "AI Generates It",
        description: "Our AI builds the complete form structure - questions, validation, and logic - in seconds.",
    },
    {
        number: "03",
        title: "Customize & Share",
        description: "Fine-tune with natural language commands, then share your unique link. Start collecting responses immediately.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 md:py-32 border-t border-black/5 dark:border-white/5">
            <div className="mb-16">
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                    How it works
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    From idea to live form in under a minute. No templates, no drag-and-drop.
                </p>
            </div>

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="group flex flex-col md:flex-row gap-6 md:gap-12 p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex-shrink-0">
                            <span className="font-heading text-5xl md:text-6xl font-bold text-black/20 dark:text-white/20 group-hover:text-black/40 dark:group-hover:text-white/40 transition-colors">
                                {step.number}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
                                {step.title}
                            </h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
