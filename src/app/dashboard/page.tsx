"use client";

import { useState, useEffect, useMemo } from "react";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { JobCard, JobStatus } from "@/components/ui/job-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { useJobStatus } from "@/hooks/use-job-status";
import { jobs, Job } from "@/lib/data";
import { calculateMatchScore, Preferences, MatchResult } from "@/lib/scoring";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Toast } from "@/components/ui/toast";

interface JobWithMatch extends Job {
    matchResult: MatchResult;
}

export default function DashboardPage() {
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [preferences, setPreferences] = useState<Preferences | null>(null);
    const { jobStatuses, updateStatus } = useJobStatus();

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [experienceFilter, setExperienceFilter] = useState("all");
    const [modeFilter, setModeFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("latest");
    const [showMatchesOnly, setShowMatchesOnly] = useState(false);

    // Toast State
    const [toast, setToast] = useState({ message: "", isVisible: false });

    useEffect(() => {
        const saved = localStorage.getItem("savedJobs");
        if (saved) {
            setSavedJobs(JSON.parse(saved));
        }
        const prefs = localStorage.getItem("jobTrackerPreferences");
        if (prefs) {
            setPreferences(JSON.parse(prefs));
        }
    }, []);

    const showToast = (message: string) => {
        setToast({ message, isVisible: true });
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    };

    const toggleSave = (id: string) => {
        let newSaved;
        if (savedJobs.includes(id)) {
            newSaved = savedJobs.filter((jobId) => jobId !== id);
        } else {
            newSaved = [...savedJobs, id];
        }
        setSavedJobs(newSaved);
        localStorage.setItem("savedJobs", JSON.stringify(newSaved));
    };

    const handleStatusChange = (id: string, newStatus: JobStatus) => {
        updateStatus(id, newStatus);
        showToast(`Status updated: ${newStatus}`);
    };

    // Compute scores and filter
    const processedJobs = useMemo(() => {
        if (!preferences) return jobs;

        let result = jobs.map(job => {
            const match = calculateMatchScore(job, preferences);
            return { ...job, matchResult: match };
        });

        // 1. Filter by "Show only matches"
        if (showMatchesOnly) {
            result = result.filter(job => job.matchResult.score >= preferences.minMatchScore);
        }

        // 2. Filter by Search Term
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(lower) ||
                job.company.toLowerCase().includes(lower)
            );
        }

        // 3. Filter by Dropdowns
        if (locationFilter !== "all") {
            result = result.filter(job => job.location.toLowerCase().includes(locationFilter));
        }
        if (experienceFilter !== "all") {
            result = result.filter(job => job.experience === experienceFilter);
        }
        if (modeFilter !== "all") {
            result = result.filter(job => job.mode === modeFilter);
        }
        if (sourceFilter !== "all") {
            result = result.filter(job => job.source === sourceFilter);
        }
        if (statusFilter !== "all") {
            result = result.filter(job => {
                const currentStatus = jobStatuses[job.id]?.status || "Not Applied";
                return currentStatus === statusFilter;
            });
        }

        // 4. Sort
        result.sort((a, b) => {
            if (sortBy === "match") {
                return b.matchResult.score - a.matchResult.score;
            } else if (sortBy === "salary") {
                // Rough heuristic for salary sorting
                const getMaxSalary = (s: string) => {
                    const match = s.match(/(\d+)/g);
                    if (match) {
                        return Math.max(...match.map(Number));
                    }
                    return 0;
                };
                return getMaxSalary(b.salaryRange) - getMaxSalary(a.salaryRange);
            } else {
                // Latest (postedDaysAgo ascending)
                return a.postedDaysAgo - b.postedDaysAgo;
            }
        });

        return result;
    }, [jobs, preferences, searchTerm, locationFilter, experienceFilter, modeFilter, sourceFilter, statusFilter, sortBy, showMatchesOnly, jobStatuses]);


    // Derive empty states
    const showSetPrefsBanner = !preferences;
    const showNoMatches = preferences && processedJobs.length === 0;

    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader
                title="Dashboard"
                description="Browse and track the latest job opportunities matched for you."
            />

            <div className="flex flex-1">
                <PrimaryWorkspace>
                    {showSetPrefsBanner && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-4">
                            <div>
                                <h4 className="font-semibold text-amber-900">Personalize your feed</h4>
                                <p className="text-sm text-amber-800">Set your preferences to activate intelligent matching and finding the right jobs.</p>
                            </div>
                            <Link href="/settings">
                                <Button variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 h-8 text-xs px-3">
                                    Set Preferences
                                </Button>
                            </Link>
                        </div>
                    )}

                    <FilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        locationFilter={locationFilter}
                        onLocationChange={setLocationFilter}
                        experienceFilter={experienceFilter}
                        onExperienceChange={setExperienceFilter}
                        modeFilter={modeFilter}
                        onModeChange={setModeFilter}
                        sourceFilter={sourceFilter}
                        onSourceChange={setSourceFilter}
                        statusFilter={statusFilter}
                        onStatusChangeStatus={setStatusFilter}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        showMatchesOnly={showMatchesOnly}
                        onShowMatchesToggle={/* Only allow toggle if prefs exist */ preferences ? setShowMatchesOnly : () => alert("Please set preferences first.")}
                        minMatchScore={preferences?.minMatchScore || 0}
                    />

                    {showNoMatches ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4 border-2 border-dashed border-gray-200 rounded-lg p-12">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <Filter className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-serif font-semibold text-[#111111]">No matches found</h3>
                            <p className="text-gray-500 max-w-sm">
                                No roles match your current criteria. Adjust your filters or lower your match threshold.
                            </p>
                            <Button variant="outline" onClick={() => {
                                setSearchTerm("");
                                setLocationFilter("all");
                                setExperienceFilter("all");
                                setModeFilter("all");
                                setSourceFilter("all");
                                setStatusFilter("all");
                                setShowMatchesOnly(false);
                            }}>
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                            {processedJobs.map((job) => {
                                const jobWithMatch = job as JobWithMatch;
                                return (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        isSaved={savedJobs.includes(job.id)}
                                        onToggleSave={toggleSave}
                                        matchScore={jobWithMatch.matchResult?.score}
                                        matchColor={jobWithMatch.matchResult?.color}
                                        status={jobStatuses[job.id]?.status || "Not Applied"}
                                        onStatusChange={handleStatusChange}
                                    />
                                )
                            })}
                        </div>
                    )}
                </PrimaryWorkspace>
            </div>

            <Toast
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}

