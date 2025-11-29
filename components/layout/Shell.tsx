import React from "react";

interface ShellProps {
    children: React.ReactNode;
    className?: string;
}

export function Shell({ children, className = "" }: ShellProps) {
    return (
        <div className={`min-h-screen flex flex-col relative ${className}`}>
            {/* Background Elements if needed */}
            <main className="flex-1 flex flex-col w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
