
"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    locationFilter: string;
    onLocationChange: (value: string) => void;
    experienceFilter: string;
    onExperienceChange: (value: string) => void;
    modeFilter: string;
    onModeChange: (value: string) => void;
    sourceFilter: string;
    onSourceChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    showMatchesOnly: boolean;
    onShowMatchesToggle: (value: boolean) => void;
    minMatchScore: number;
    statusFilter?: string;
    onStatusChangeStatus?: (value: string) => void;
}

export function FilterBar({
    searchTerm,
    onSearchChange,
    locationFilter,
    onLocationChange,
    experienceFilter,
    onExperienceChange,
    modeFilter,
    onModeChange,
    sourceFilter,
    onSourceChange,
    sortBy,
    onSortChange,
    showMatchesOnly,
    onShowMatchesToggle,
    minMatchScore,
    statusFilter = "all",
    onStatusChangeStatus = () => { },
}: FilterBarProps) {
    return (
        <div className="space-y-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by role or company..."
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2 mr-4">
                        <Switch
                            id="matches-only"
                            checked={showMatchesOnly}
                            onCheckedChange={onShowMatchesToggle}
                        />
                        <label htmlFor="matches-only" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Show only matches ({'>'}{minMatchScore}%)
                        </label>
                    </div>

                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
                            <SortAsc className="mr-2 h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest</SelectItem>
                            <SelectItem value="match">Match Score</SelectItem>
                            <SelectItem value="salary">Salary (High-Low)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 pt-2 border-t border-gray-100">
                <Select value={locationFilter} onValueChange={onLocationChange}>
                    <SelectTrigger className="w-[140px] border-dashed border-gray-300">
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi/NCR</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="chennai">Chennai</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={experienceFilter} onValueChange={onExperienceChange}>
                    <SelectTrigger className="w-[140px] border-dashed border-gray-300">
                        <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Fresher">Fresher</SelectItem>
                        <SelectItem value="0-1 Years">0-1 Years</SelectItem>
                        <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                        <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={modeFilter} onValueChange={onModeChange}>
                    <SelectTrigger className="w-[140px] border-dashed border-gray-300">
                        <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={onSourceChange}>
                    <SelectTrigger className="w-[140px] border-dashed border-gray-300">
                        <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Naukri">Naukri</SelectItem>
                        <SelectItem value="Indeed">Indeed</SelectItem>
                        <SelectItem value="Company Career Page">Career Page</SelectItem>
                        <SelectItem value="Internshala">Internshala</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={onStatusChangeStatus}>
                    <SelectTrigger className="w-[140px] border-dashed border-gray-300">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Not Applied">Not Applied</SelectItem>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Selected">Selected</SelectItem>
                    </SelectContent>
                </Select>

                {(locationFilter !== "all" || experienceFilter !== "all" || modeFilter !== "all" || sourceFilter !== "all" || statusFilter !== "all" || searchTerm) && (
                    <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 text-xs px-3"
                        onClick={() => {
                            onSearchChange("");
                            onLocationChange("all");
                            onExperienceChange("all");
                            onModeChange("all");
                            onSourceChange("all");
                            onStatusChangeStatus("all");
                        }}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
