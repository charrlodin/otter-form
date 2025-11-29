interface AnalyticsCardsProps {
    stats: {
        viewCount: number;
        submissionCount: number;
        completionRate: number;
    };
}

export function AnalyticsCards({ stats }: AnalyticsCardsProps) {
    const dropOffRate = 100 - stats.completionRate;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Views</div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-heading font-bold">{stats.viewCount}</div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-muted-foreground">Submissions</div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-heading font-bold">{stats.submissionCount}</div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-heading font-bold mb-2">{stats.completionRate}%</div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-muted-foreground">Drop-off Rate</div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-heading font-bold mb-2">{dropOffRate.toFixed(1)}%</div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${dropOffRate}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
