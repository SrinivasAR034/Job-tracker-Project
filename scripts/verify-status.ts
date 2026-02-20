
import { Job, jobs } from "../src/lib/data";

// Mock Data
const mockJobStatuses: Record<string, { status: string; date: string }> = {
    "1": { status: "Applied", date: "2023-10-27T10:00:00Z" },
    "2": { status: "Rejected", date: "2023-10-26T10:00:00Z" },
    "3": { status: "Selected", date: "2023-10-28T10:00:00Z" }
};

console.log("---------------------------------------------------");
console.log("VERIFYING JOB STATUS LOGIC");
console.log("---------------------------------------------------");

// 1. Verify Status Retrieval
console.log("\n1. Verifying Status Retrieval:");
const job1Status = mockJobStatuses["1"]?.status || "Not Applied";
console.log(`Job 1 Status: ${job1Status} (Expected: Applied)`);
const job4Status = mockJobStatuses["4"]?.status || "Not Applied";
console.log(`Job 4 Status: ${job4Status} (Expected: Not Applied)`);

if (job1Status === "Applied" && job4Status === "Not Applied") {
    console.log("✅ Status Retrieval Passed");
} else {
    console.error("❌ Status Retrieval Failed");
}

// 2. Verify Filtering
console.log("\n2. Verifying Filter Logic (Filter by 'Applied'):");
const statusFilter = "Applied";
const filteredJobs = jobs.filter(job => {
    const currentStatus = mockJobStatuses[job.id]?.status || "Not Applied";
    return currentStatus === statusFilter;
});

const isJob1InFiltered = filteredJobs.some(j => j.id === "1");
const isJob2InFiltered = filteredJobs.some(j => j.id === "2");

console.log(`Job 1 (Applied) in results: ${isJob1InFiltered}`);
console.log(`Job 2 (Rejected) in results: ${isJob2InFiltered}`);

if (isJob1InFiltered && !isJob2InFiltered) {
    console.log("✅ Filter Logic Passed");
} else {
    console.error("❌ Filter Logic Failed");
}

// 3. Verify Recent Updates Logic (Digest)
console.log("\n3. Verifying Digest Recent Updates Logic:");
const updates = Object.keys(mockJobStatuses).map(jobId => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        return {
            job,
            status: mockJobStatuses[jobId].status,
            date: mockJobStatuses[jobId].date
        };
    }
    return null;
}).filter((item): item is { job: Job, status: string, date: string } => item !== null);

// Sort by date desc
updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log("Recent Updates (Sorted):");
updates.forEach(u => console.log(`- ${u.job.id}: ${u.status} (${u.date})`));

// Expect Order: 3 (Selected), 1 (Applied), 2 (Rejected)
const orderCorrect = updates[0].job.id === "3" && updates[1].job.id === "1" && updates[2].job.id === "2";

if (orderCorrect) {
    console.log("✅ Recent Updates Sorting Passed");
} else {
    console.error("❌ Recent Updates Sorting Failed");
}

console.log("---------------------------------------------------");
