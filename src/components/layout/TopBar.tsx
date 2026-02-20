"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
    step?: number;
    totalSteps?: number;
    status?: "Not Started" | "In Progress" | "Shipped";
}

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Saved", href: "/saved" },
    { name: "Digest", href: "/digest" },
    { name: "Settings", href: "/settings" },
    { name: "Proof", href: "/proof" },
];

export function TopBar({ step = 1, totalSteps = 5, status = "In Progress" }: TopBarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-[#F7F6F3] px-8">
            {/* Left: Project Name */}
            <div className="flex items-center gap-2">
                <Link href="/" className="font-serif text-lg font-bold text-[#111111]">
                    KodNest Premium Build
                </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-[#8B0000]",
                                isActive
                                    ? "text-[#8B0000] border-b-2 border-[#8B0000]"
                                    : "text-gray-600"
                            )}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Right: Status & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                    <span>Step {step}</span>
                    <span className="text-gray-300">/</span>
                    <span>{totalSteps}</span>
                </div>

                <div
                    className={cn(
                        "hidden md:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border",
                        status === "Not Started" && "bg-gray-100 text-gray-600 border-gray-200",
                        status === "In Progress" && "bg-amber-50 text-amber-700 border-amber-200",
                        status === "Shipped" && "bg-green-50 text-green-700 border-green-200"
                    )}
                >
                    {status === "Not Started" && <Circle className="h-3.5 w-3.5" />}
                    {status === "In Progress" && <Clock className="h-3.5 w-3.5" />}
                    {status === "Shipped" && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {status}
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 border-b border-gray-200 bg-[#F7F6F3] p-4 md:hidden shadow-lg">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium py-2 transition-colors",
                                        isActive ? "text-[#8B0000] font-bold" : "text-gray-600"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
