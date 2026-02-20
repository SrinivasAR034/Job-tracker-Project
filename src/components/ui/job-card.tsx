
"use client";

import { useState } from "react";
import { Job } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobModal } from "@/components/ui/job-modal";
import { Bookmark, Clock, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";


export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

interface JobCardProps {
    job: Job;
    isSaved?: boolean;
    onToggleSave: (id: string) => void;
    matchScore?: number;
    matchColor?: "green" | "amber" | "neutral" | "grey";
    status?: JobStatus;
    onStatusChange?: (id: string, status: JobStatus) => void;
}

export function JobCard({
    job,
    isSaved = false,
    onToggleSave,
    matchScore,
    matchColor = "grey",
    status = "Not Applied",
    onStatusChange
}: JobCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const colorStyles = {
        green: "bg-green-100 text-green-800 border-green-200",
        amber: "bg-amber-100 text-amber-800 border-amber-200",
        neutral: "bg-gray-100 text-gray-800 border-gray-200",
        grey: "bg-gray-50 text-gray-400 border-gray-100",
    };

    const statusStyles = {
        "Not Applied": "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100",
        "Applied": "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
        "Rejected": "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
        "Selected": "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
    };

    const handleStatusClick = (newStatus: JobStatus) => {
        if (onStatusChange) {
            onStatusChange(job.id, newStatus);
        }
    };

    return (
        <>
            <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold text-[#111111] group-hover:text-[#8B0000] transition-colors pr-8">
                            {job.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-700">{job.company}</p>
                    </div>
                    <button
                        onClick={() => onToggleSave(job.id)}
                        className="text-gray-400 hover:text-[#8B0000] transition-colors"
                    >
                        <Bookmark className={cn("h-5 w-5", isSaved && "fill-[#8B0000] text-[#8B0000]")} />
                    </button>
                </div>

                {/* Match Score Badge */}
                {matchScore !== undefined && matchScore > 0 && (
                    <div className={cn("absolute top-6 right-14 text-xs font-bold px-2 py-1 rounded-full border", colorStyles[matchColor])}>
                        {matchScore}% Match
                    </div>
                )}

                <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <MapPin className="h-3 w-3" /> {job.location} ({job.mode})
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Briefcase className="h-3 w-3" /> {job.experience}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Clock className="h-3 w-3" /> {job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo}d ago`}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{job.salaryRange}</span>
                        <span className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                            {job.source}
                        </span>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mb-4 bg-gray-50/50 p-2 rounded-lg border border-gray-100 flex gap-1 justify-between">
                    {(["Not Applied", "Applied", "Rejected", "Selected"] as JobStatus[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusClick(s)}
                            className={cn(
                                "flex-1 text-[10px] py-1.5 rounded-md transition-all font-medium border",
                                status === s
                                    ? statusStyles[s] + " shadow-sm transform scale-105"
                                    : "bg-transparent border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full text-gray-700 hover:text-[#8B0000] hover:border-[#8B0000] hover:bg-white h-8 text-xs"
                    >
                        View Details
                    </Button>
                </div>
            </div>

            <JobModal
                job={job}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
