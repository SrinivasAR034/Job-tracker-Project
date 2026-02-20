
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/lib/data";
import { Building2, MapPin, Briefcase, ExternalLink } from "lucide-react";

interface JobModalProps {
    job: Job | null;
    isOpen: boolean;
    onClose: () => void;
}

export function JobModal({ job, isOpen, onClose }: JobModalProps) {
    if (!job) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <DialogTitle className="text-2xl font-serif text-[#111111] mb-2">{job.title}</DialogTitle>
                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {job.company}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {job.location} ({job.mode})
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    {job.experience}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-medium">Salary Range</p>
                                <p className="text-sm font-semibold text-gray-900">{job.salaryRange}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-medium">Source</p>
                                <p className="text-sm font-semibold text-gray-900">{job.source}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between items-center border-t pt-4">
                    <div className="text-xs text-gray-400">
                        Posted {job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo} days ago`}
                    </div>
                    <Button
                        onClick={() => window.open(job.applyUrl, "_blank")}
                        className="bg-[#8B0000] hover:bg-[#8B0000]/90 text-white gap-2"
                    >
                        Apply Now <ExternalLink className="h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
