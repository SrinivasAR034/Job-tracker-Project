"use client";

import { useEffect, useState } from "react";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Copy, Mail, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { jobs, Job } from "@/lib/data";
import { calculateMatchScore, Preferences, MatchResult } from "@/lib/scoring";
import { cn } from "@/lib/utils";

interface DigestJob extends Job {
    matchResult: MatchResult;
}

export default function DigestPage() {
    const [preferences, setPreferences] = useState<Preferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [digest, setDigest] = useState<DigestJob[] | null>(null);
    const [digestDate, setDigestDate] = useState<string>("");
    const [recentUpdates, setRecentUpdates] = useState<{ job: Job, status: string, date: string }[]>([]);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDigestDate(today);

        const prefsStr = localStorage.getItem("jobTrackerPreferences");
        if (prefsStr) {
            setPreferences(JSON.parse(prefsStr));
        }

        const savedDigest = localStorage.getItem(`jobTrackerDigest_${today}`);
        if (savedDigest) {
            setDigest(JSON.parse(savedDigest));
        }

        // Load Status Updates
        const statusStr = localStorage.getItem("jobTrackerStatus");
        if (statusStr) {
            const statusMap = JSON.parse(statusStr);
            const updates = Object.keys(statusMap).map(jobId => {
                const job = jobs.find(j => j.id === jobId);
                if (job) {
                    return {
                        job,
                        status: statusMap[jobId].status,
                        date: statusMap[jobId].date
                    };
                }
                return null;
            }).filter(Boolean) as { job: Job, status: string, date: string }[];

            // Sort by date desc
            updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Take recent 5
            setRecentUpdates(updates.slice(0, 5));
        }

        setLoading(false);
    }, []);

    const generateDigest = () => {
        if (!preferences) return;

        setLoading(true);

        setTimeout(() => {
            // 1. Scoring
            let scoredJobs = jobs.map(job => {
                const match = calculateMatchScore(job, preferences);
                return { ...job, matchResult: match };
            });

            // 2. Filter
            const threshold = preferences.minMatchScore || 1;
            let candidates = scoredJobs.filter(j => j.matchResult.score >= threshold);

            // 3. Sort
            candidates.sort((a, b) => {
                if (b.matchResult.score !== a.matchResult.score) {
                    return b.matchResult.score - a.matchResult.score;
                }
                return a.postedDaysAgo - b.postedDaysAgo;
            });

            // 4. Top 10
            const top10 = candidates.slice(0, 10);

            // 5. Save
            setDigest(top10);
            localStorage.setItem(`jobTrackerDigest_${digestDate}`, JSON.stringify(top10));
            setLoading(false);
        }, 800);
    };

    const copyToClipboard = () => {
        if (!digest) return;
        const text = digest.map(d =>
            `Role: ${d.title}\nCompany: ${d.company}\nMatch: ${d.matchResult.score}%\nLink: ${d.applyUrl}`
        ).join("\n\n");
        const header = `My 9AM Job Digest - ${digestDate}\n-----------------------------\n\n`;
        navigator.clipboard.writeText(header + text);
        alert("Digest copied to clipboard!");
    };

    const createDraft = () => {
        if (!digest) return;
        const subject = `My 9AM Job Digest - ${digestDate}`;
        const body = digest.map(d =>
            `${d.title} @ ${d.company} (${d.matchResult.score}% Match)%0D%0A${d.location} | ${d.experience}%0D%0A`
        ).join("%0D%0A");
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    if (loading && !digest && !preferences) {
        return (
            <div className="min-h-screen bg-[#F7F6F3] p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!loading && !preferences) {
        return (
            <div className="min-h-screen bg-[#F7F6F3]">
                <ContextHeader title="Daily Digest" description="Your curated daily job feed." />
                <div className="flex flex-1 p-8 justify-center">
                    <div className="max-w-md w-full bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
                        <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-amber-900">Preferences Required</h2>
                        <p className="text-amber-800">
                            We can't generate your personalized digest without knowing what you're looking for.
                        </p>
                        <Link href="/settings">
                            <Button className="mt-2 bg-amber-700 hover:bg-amber-800 text-white border-none">
                                Set Preferences
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader title="Daily Digest" description="Your curated daily job feed." />

            <div className="flex flex-1 justify-center p-4 md:p-8">
                <PrimaryWorkspace className="max-w-3xl w-full flex flex-col items-center">

                    {recentUpdates.length > 0 && (
                        <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
                            <h3 className="text-lg font-serif font-bold text-[#111111] mb-4 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                Recent Status Updates
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                {recentUpdates.map((update, idx) => (
                                    <div key={idx} className="p-4 border-b border-gray-100 last:border-0 flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="font-semibold text-gray-900">{update.job.title}</p>
                                            <p className="text-xs text-gray-500">{update.job.company}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-1 rounded inline-block mb-1",
                                                update.status === "Applied" && "bg-blue-50 text-blue-700",
                                                update.status === "Rejected" && "bg-red-50 text-red-700",
                                                update.status === "Selected" && "bg-green-50 text-green-700",
                                                update.status === "Not Applied" && "bg-gray-50 text-gray-500"
                                            )}>
                                                {update.status}
                                            </span>
                                            <p className="text-[10px] text-gray-400">
                                                {new Date(update.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Demo System
                        </div>
                        {!digest && (
                            <Button onClick={generateDigest} disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Generate Today's 9AM Digest (Simulated)
                            </Button>
                        )}
                    </div>

                    {digest ? (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-end gap-2 mb-4">
                                <Button onClick={copyToClipboard} className="gap-2 text-gray-600 h-8 text-xs px-3 bg-white border border-gray-200 hover:bg-gray-50 text-black">
                                    <Copy className="h-4 w-4" /> Copy Text
                                </Button>
                                <Button onClick={createDraft} className="gap-2 text-gray-600 h-8 text-xs px-3 bg-white border border-gray-200 hover:bg-gray-50 text-black">
                                    <Mail className="h-4 w-4" /> Email Draft
                                </Button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-gray-50 border-b border-gray-100 p-8 text-center space-y-2">
                                    <div className="inline-flex items-center justify-center p-3 bg-white border border-gray-100 rounded-full mb-2 shadow-sm">
                                        <FileText className="h-6 w-6 text-[#8B0000]" />
                                    </div>
                                    <h1 className="text-2xl font-serif font-bold text-[#111111]">Top 10 Jobs For You</h1>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                                        9AM Digest • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {digest.length === 0 ? (
                                        <div className="p-12 text-center text-gray-500">
                                            No matching roles found today based on your criteria.
                                        </div>
                                    ) : (
                                        digest.map((job, i) => (
                                            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                                                        <h3 className="font-bold text-[#111111] text-lg group-hover:text-[#8B0000] transition-colors">{job.title}</h3>
                                                    </div>
                                                    <div className="text-sm text-gray-600 pl-6">
                                                        <span className="font-semibold">{job.company}</span> • {job.location} • {job.experience}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 pl-6 sm:pl-0 w-full sm:w-auto justify-between sm:justify-end">
                                                    <div className={cn(
                                                        "px-2 py-1 rounded text-xs font-bold border",
                                                        job.matchResult.score >= 80 ? "bg-green-50 text-green-700 border-green-200" :
                                                            job.matchResult.score >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                "bg-gray-50 text-gray-600 border-gray-200"
                                                    )}>
                                                        {job.matchResult.score}% Match
                                                    </div>

                                                    <Button className="h-8 text-xs px-3">
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="bg-gray-50 border-t border-gray-100 p-6 text-center">
                                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                        This digest was generated based on your preferences. To adjust what you see here, visit your settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 w-full">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <RefreshCw className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Ready to Digest?</h3>
                            <p className="text-gray-500 mb-6 text-center max-w-sm">
                                Trigger the manual simulation to generate today's personalized job list. By default, this runs automatically at 9AM.
                            </p>
                            <Button onClick={generateDigest} disabled={loading} className="gap-2 shadow-lg hover:shadow-xl transition-all">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Generate Digest
                            </Button>
                        </div>
                    )}
                </PrimaryWorkspace>
            </div>
        </div>
    );
}
