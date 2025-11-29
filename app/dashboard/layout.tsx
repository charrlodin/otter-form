import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Shell>
            <Header />
            <main className="flex-1 pt-32 pb-12">
                {children}
            </main>
        </Shell>
    );
}
