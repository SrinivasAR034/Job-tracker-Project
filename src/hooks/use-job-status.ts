
import { useState, useEffect } from "react";

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export interface JobStatusRecord {
    status: JobStatus;
    date: string;
}

export function useJobStatus() {
    const [jobStatuses, setJobStatuses] = useState<Record<string, JobStatusRecord>>({});
    const [lastUpdate, setLastUpdate] = useState<{ id: string, status: JobStatus } | null>(null);

    useEffect(() => {
        const statuses = localStorage.getItem("jobTrackerStatus");
        if (statuses) {
            setJobStatuses(JSON.parse(statuses));
        }
    }, []);

    const updateStatus = (id: string, newStatus: JobStatus) => {
        setJobStatuses((prev) => {
            const updated = {
                ...prev,
                [id]: { status: newStatus, date: new Date().toISOString() }
            };
            localStorage.setItem("jobTrackerStatus", JSON.stringify(updated));
            return updated;
        });
        setLastUpdate({ id, status: newStatus });
    };

    return { jobStatuses, updateStatus, lastUpdate };
}
