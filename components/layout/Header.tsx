"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export function Header() {
    const { isSignedIn } = useUser();

    return (
        <header className="fixed top-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full px-6 py-3 shadow-sm pointer-events-auto flex items-center gap-8 transition-all hover:shadow-md hover:scale-[1.01]">

                {/* Typographic Logo */}
                <Link href="/" className="font-heading font-bold text-xl tracking-tight hover:opacity-70 transition-opacity">
                    OtterForm<span className="text-accent-foreground">.</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
                    <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                    {isSignedIn && (
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                    )}
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    <div className="h-4 w-[1px] bg-border hidden md:block" />
                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium hover:text-foreground transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    )}
                </div>
            </nav>
        </header>
    );
}
