
"use client";

import { useState, useEffect } from "react";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const TEST_ITEMS = [
    { id: "prefs-persist", label: "Preferences persist after refresh", tip: "Reload page and check settings" },
    { id: "match-score", label: "Match score calculates correctly", tip: "Check job card match %" },
    { id: "matches-only", label: "\"Show only matches\" toggle works", tip: "Toggle filter on dashboard" },
    { id: "save-persist", label: "Save job persists after refresh", tip: "Bookmark a job and reload" },
    { id: "apply-new-tab", label: "Apply opens in new tab", tip: "Click apply button" },
    { id: "status-persist", label: "Status update persists after refresh", tip: "Change status and reload" },
    { id: "status-filter", label: "Status filter works correctly", tip: "Filter by Applied/Rejected" },
    { id: "digest-gen", label: "Digest generates top 10 by score", tip: "Check digest count" },
    { id: "digest-persist", label: "Digest persists for the day", tip: "Reload digest page" },
    { id: "no-errors", label: "No console errors on main pages", tip: "Check F12 console" },
];

export default function TestPage() {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("jobTrackerTestStatus");
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
        setMounted(true);
    }, []);

    const toggleItem = (id: string) => {
        setCheckedItems(prev => {
            const newItems = prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id];
            localStorage.setItem("jobTrackerTestStatus", JSON.stringify(newItems));
            return newItems;
        });
    };

    const resetTests = () => {
        if (confirm("Reset all test progress?")) {
            setCheckedItems([]);
            localStorage.setItem("jobTrackerTestStatus", JSON.stringify([]));
        }
    };

    const progress = checkedItems.length;
    const total = TEST_ITEMS.length;
    const isComplete = progress === total;

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader
                title="System Verification"
                description="Run through the final checklist before shipping."
            />

            <div className="flex flex-1 justify-center p-8">
                <PrimaryWorkspace className="max-w-2xl w-full">
                    <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-serif font-bold text-[#111111] flex items-center gap-2">
                                {isComplete ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                ) : (
                                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                                )}
                                Test Progress: {progress} / {total}
                            </h2>
                            <Button variant="ghost" size="sm" onClick={resetTests} className="text-gray-400 hover:text-red-600">
                                <RotateCcw className="h-4 w-4 mr-1" /> Reset
                            </Button>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                            <div
                                className={cn("h-2.5 rounded-full transition-all duration-500", isComplete ? "bg-green-600" : "bg-amber-500")}
                                style={{ width: `${(progress / total) * 100}%` }}
                            ></div>
                        </div>

                        {!isComplete && (
                            <p className="text-sm text-amber-700 font-medium">
                                Resolve all issues before shipping.
                            </p>
                        )}
                        {isComplete && (
                            <p className="text-sm text-green-700 font-medium">
                                All systems go. Ready to ship.
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        {TEST_ITEMS.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm",
                                    checkedItems.includes(item.id)
                                        ? "bg-green-50 border-green-200"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                )}
                                onClick={() => toggleItem(item.id)}
                            >
                                <div className={cn(
                                    "mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                    checkedItems.includes(item.id)
                                        ? "bg-green-600 border-green-600"
                                        : "border-gray-300 bg-white"
                                )}>
                                    {checkedItems.includes(item.id) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                </div>
                                <div>
                                    <h4 className={cn("font-medium text-sm", checkedItems.includes(item.id) ? "text-green-900" : "text-gray-900")}>
                                        {item.label}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tip: {item.tip}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </PrimaryWorkspace>
            </div>
        </div>
    );
}
