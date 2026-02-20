
"use client";

import { useState, useEffect } from "react";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { Button } from "@/components/ui/button";
import { Lock, Rocket, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ShipPage() {
    const [isLocked, setIsLocked] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("jobTrackerTestStatus");
        if (saved) {
            const checkedItems = JSON.parse(saved);
            // 10 items required
            if (checkedItems.length >= 10) {
                setIsLocked(false);
            }
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader
                title="Ship It"
                description="Final deployment and release status."
            />

            <div className="flex flex-1 justify-center items-center p-8 min-h-[60vh]">
                <PrimaryWorkspace className="max-w-md w-full">
                    {isLocked ? (
                        <div className="text-center space-y-6">
                            <div className="relative inline-block">
                                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Lock className="h-10 w-10 text-gray-400" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full border border-red-200">
                                    LOCKED
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">Access Denied</h2>
                                <p className="text-gray-500">
                                    You cannot ship this product until all system verification tests have been passed.
                                </p>
                            </div>

                            <Link href="/jt/07-test" className="block">
                                <Button className="w-full gap-2 bg-[#111111] hover:bg-black text-white">
                                    Go to Verification Checklist <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
                                <Rocket className="h-10 w-10 text-green-600 ml-1" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-serif font-bold text-green-900 mb-2">Ready to Ship!</h2>
                                <p className="text-green-800 font-medium">
                                    All systems verified. You are clear for launch.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-green-200 text-left space-y-2 shadow-sm">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Matches generating correctly
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Persistence layer active
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> UI/UX polished
                                </div>
                            </div>

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                                onClick={() => alert("🚀 Shipped! (Simulation)")}
                            >
                                Trigger Deployment
                            </Button>
                        </div>
                    )}
                </PrimaryWorkspace>
            </div>
        </div>
    );
}
