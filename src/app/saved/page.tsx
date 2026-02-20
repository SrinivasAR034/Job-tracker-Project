
"use client";

import { useState, useEffect } from "react";
import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { JobCard, JobStatus } from "@/components/ui/job-card";
import { jobs } from "@/lib/data";
import { Bookmark } from "lucide-react";
import { useJobStatus } from "@/hooks/use-job-status";
import { Toast } from "@/components/ui/toast";

export default function SavedPage() {
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const { jobStatuses, updateStatus } = useJobStatus();
    const [toast, setToast] = useState({ message: "", isVisible: false });

    useEffect(() => {
        const saved = localStorage.getItem("savedJobs");
        if (saved) {
            setSavedJobs(JSON.parse(saved));
        }
        setMounted(true);
    }, []);

    const toggleSave = (id: string) => {
        const newSaved = savedJobs.filter((jobId) => jobId !== id);
        setSavedJobs(newSaved);
        localStorage.setItem("savedJobs", JSON.stringify(newSaved));
    };

    const showToast = (message: string) => {
        setToast({ message, isVisible: true });
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    };

    const handleStatusChange = (id: string, newStatus: JobStatus) => {
        updateStatus(id, newStatus);
        showToast(`Status updated: ${newStatus}`);
    };

    const savedJobData = jobs.filter((job) => savedJobs.includes(job.id));

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader
                title="Saved Jobs"
                description="Your curated list of potential opportunities."
            />

            <div className="flex flex-1">
                <PrimaryWorkspace>
                    {savedJobData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                            {savedJobData.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    isSaved={true}
                                    onToggleSave={toggleSave}
                                    status={jobStatuses[job.id]?.status || "Not Applied"}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 border-2 border-dashed border-gray-200 rounded-lg p-12">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <Bookmark className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-serif font-semibold text-[#111111]">No saved jobs</h3>
                            <p className="text-gray-500 max-w-sm">
                                Jobs you bookmark from your dashboard will appear here for easy access.
                            </p>
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
