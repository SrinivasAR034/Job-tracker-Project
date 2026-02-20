import { cn } from "@/lib/utils";

interface PrimaryWorkspaceProps {
    children: React.ReactNode;
    className?: string;
}

export function PrimaryWorkspace({ children, className }: PrimaryWorkspaceProps) {
    return (
        <main
            className={cn(
                "flex-1 overflow-y-auto bg-white p-8 border-r border-gray-200 min-h-[calc(100vh-140px)]", // accounting for topbar/footer/header
                className
            )}
        >
            <div className="mx-auto max-w-4xl space-y-8">
                {children}
            </div>
        </main>
    );
}
