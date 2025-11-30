"use client";

const features = [
    {
        icon: "chat",
        title: "AI-Powered Generation",
        description: "Describe your form in plain English. Our AI understands context, validates inputs, and builds complete forms instantly.",
    },
    {
        icon: "link",
        title: "Instant Share Links",
        description: "Every form gets a unique, clean URL. Share it anywhere - social media, email, or embed it directly on your site.",
    },
    {
        icon: "chart",
        title: "Real-Time Analytics",
        description: "Track views, starts, and completions. Understand your conversion funnel and optimize your forms for better results.",
    },
    {
        icon: "lock",
        title: "Password Protection",
        description: "Secure sensitive forms with password protection. Control who can access and submit responses to your forms.",
    },
    {
        icon: "upload",
        title: "File Uploads",
        description: "Accept file uploads seamlessly. Support for documents, images, and more with automatic cloud storage.",
    },
    {
        icon: "key",
        title: "BYOK AI",
        description: "Bring Your Own Key. Use your preferred AI provider - OpenAI, Anthropic, or others. Full control over your AI costs.",
    },
];

function FeatureIcon({ type }: { type: string }) {
    const iconClass = "w-6 h-6";
    
    switch (type) {
        case "chat":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            );
        case "link":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            );
        case "chart":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case "lock":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            );
        case "upload":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            );
        case "key":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            );
        default:
            return null;
    }
}

export function Features() {
    return (
        <section className="py-24 md:py-32 border-t border-black/5 dark:border-white/5">
            <div className="text-center mb-16">
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                    Everything you need
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Powerful features to create, share, and analyze forms without the complexity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FeatureIcon type={feature.icon} />
                        </div>
                        <h3 className="font-heading text-xl font-semibold mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
