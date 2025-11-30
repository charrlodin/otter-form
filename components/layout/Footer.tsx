"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 border-t border-black/5 dark:border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-lg">OtterForm</span>
                    <span className="text-muted-foreground text-sm">
                        - AI-Powered Form Builder
                    </span>
                </div>
                
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <Link href="/features" className="hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="/pricing" className="hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                    <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                    >
                        GitHub
                    </a>
                </div>

                <div className="text-sm text-muted-foreground">
                    {new Date().getFullYear()} OtterForm. Open Source.
                </div>
            </div>
        </footer>
    );
}
