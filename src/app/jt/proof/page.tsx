
"use client";

import { useState, useEffect } from "react";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Copy, ExternalLink, Clock, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Artifacts {
    lovableUrl: string;
    githubUrl: string;
    deployedUrl: string;
}

const STEPS = [
    { id: "01", title: "Project Setup", status: "completed" },
    { id: "02", title: "Design System", status: "completed" },
    { id: "03", title: "Routing", status: "completed" },
    { id: "04", title: "Data Layer", status: "completed" },
    { id: "05", title: "Core Features", status: "completed" },
    { id: "06", title: "Polish & Animations", status: "completed" },
    { id: "07", title: "System Verification", status: "pending" }, // Dynamic
    { id: "08", title: "Final Deployment", status: "pending" }, // Dynamic
];

export default function ProofPage() {
    const [artifacts, setArtifacts] = useState<Artifacts>({
        lovableUrl: "",
        githubUrl: "",
        deployedUrl: ""
    });
    const [testsPassed, setTestsPassed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedArtifacts = localStorage.getItem("jobTrackerArtifacts");
        if (savedArtifacts) {
            setArtifacts(JSON.parse(savedArtifacts));
        }

        const savedTests = localStorage.getItem("jobTrackerTestStatus");
        if (savedTests) {
            const checked = JSON.parse(savedTests);
            setTestsPassed(checked.length >= 10);
        }

        setMounted(true);
    }, []);

    const handleMsgChange = (key: keyof Artifacts, value: string) => {
        const newArtifacts = { ...artifacts, [key]: value };
        setArtifacts(newArtifacts);
        localStorage.setItem("jobTrackerArtifacts", JSON.stringify(newArtifacts));
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const allUrlsValid = isValidUrl(artifacts.lovableUrl) && isValidUrl(artifacts.githubUrl) && isValidUrl(artifacts.deployedUrl);
    const isShippable = testsPassed && allUrlsValid;

    // Update Steps Status dynamically
    const stepsStatus = STEPS.map(step => {
        if (step.id === "07") return { ...step, status: testsPassed ? "completed" : "pending" };
        if (step.id === "08") return { ...step, status: isShippable ? "completed" : "pending" };
        return step;
    });

    const generateSubmission = () => {
        const text = `
Job Notification Tracker — Final Submission

Lovable Project:
${artifacts.lovableUrl}

GitHub Repository:
${artifacts.githubUrl}

Live Deployment:
${artifacts.deployedUrl}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
`.trim();

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader
                title="Proof of Work"
                description="Validate your progress and submit evidence."
            />

            <div className="flex flex-1 justify-center p-8">
                <PrimaryWorkspace className="max-w-4xl w-full">

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#111111]">Project 1 Status</h2>
                            <p className="text-gray-500">Job Notification Tracker</p>
                        </div>
                        <div className={cn(
                            "px-4 py-2 rounded-full font-bold text-sm border flex items-center gap-2",
                            isShippable
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                        )}>
                            {isShippable ? <Package className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            {isShippable ? "Shipped" : "In Progress"}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Section A: Step Summary */}
                        <Card className="md:col-span-1 h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg">Step Completion</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {stepsStatus.map((step) => (
                                    <div key={step.id} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{step.id} {step.title}</span>
                                        {step.status === "completed" ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Section B: Artifacts */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Artifact Collection</CardTitle>
                                    <CardDescription>
                                        Provide the required links to validate your submission.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#111111]">Lovable Project Link</label>
                                        <Input
                                            placeholder="https://lovable.dev/..."
                                            value={artifacts.lovableUrl}
                                            onChange={(e) => handleMsgChange("lovableUrl", e.target.value)}
                                            className={cn(artifacts.lovableUrl && !isValidUrl(artifacts.lovableUrl) && "border-red-300 focus-visible:ring-red-300")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#111111]">GitHub Repository Link</label>
                                        <Input
                                            placeholder="https://github.com/..."
                                            value={artifacts.githubUrl}
                                            onChange={(e) => handleMsgChange("githubUrl", e.target.value)}
                                            className={cn(artifacts.githubUrl && !isValidUrl(artifacts.githubUrl) && "border-red-300 focus-visible:ring-red-300")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#111111]">Deployed URL</label>
                                        <Input
                                            placeholder="https://vercel.com/..."
                                            value={artifacts.deployedUrl}
                                            onChange={(e) => handleMsgChange("deployedUrl", e.target.value)}
                                            className={cn(artifacts.deployedUrl && !isValidUrl(artifacts.deployedUrl) && "border-red-300 focus-visible:ring-red-300")}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {isShippable ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
                                        <p className="text-green-800 font-medium">Project 1 Shipped Successfully.</p>
                                    </div>
                                    <Button
                                        onClick={generateSubmission}
                                        className="w-full bg-[#111111] hover:bg-black text-white h-12 text-base gap-2"
                                    >
                                        {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                        {copied ? "Copied to Clipboard" : "Copy Final Submission"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500">
                                    Complete all tests and provide valid links to unlock submission.
                                </div>
                            )}
                        </div>
                    </div>

                </PrimaryWorkspace>
            </div>
        </div>
    );
}
