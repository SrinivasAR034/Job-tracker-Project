
import { calculateMatchScore, Preferences } from "../src/lib/scoring";
import { Job, jobs } from "../src/lib/data";

// 1. Mock Preferences
const mockPreferences: Preferences = {
    roleKeywords: ["Frontend", "React", "Developer"],
    preferredLocations: ["Remote", "Bangalore"],
    preferredMode: ["Remote", "Hybrid"],
    experienceLevel: "1-3 Years",
    skills: ["React", "TypeScript", "Tailwind", "Next.js"],
    minMatchScore: 50 // Only reasonable matches
};

console.log("---------------------------------------------------");
console.log("VERIFYING DAILY DIGEST GENERATION LOGIC");
console.log("---------------------------------------------------");
console.log("Preferences:", JSON.stringify(mockPreferences, null, 2));
console.log("---------------------------------------------------");

// 2. Simulate Digest Generation
// Step A: Scoring
console.log(`\n1. Scoring ${jobs.length} jobs...`);
let scoredJobs = jobs.map(job => {
    const match = calculateMatchScore(job, mockPreferences);
    return { ...job, matchResult: match };
});

// Step B: Filter
const threshold = mockPreferences.minMatchScore;
let candidates = scoredJobs.filter(j => j.matchResult.score >= threshold);
console.log(`2. Filtering (Score >= ${threshold}): ${candidates.length} candidates found.`);

// Step C: Sort
candidates.sort((a, b) => {
    // Primary: Match Score Descending
    if (b.matchResult.score !== a.matchResult.score) {
        return b.matchResult.score - a.matchResult.score;
    }
    // Secondary: Posted Days Ago Ascending (fresher jobs first)
    return a.postedDaysAgo - b.postedDaysAgo;
});
console.log(`3. Sorting: Done.`);

// Step D: Top 10
const top10 = candidates.slice(0, 10);
console.log(`4. Slicing Top 10: Done.`);

console.log("\n---------------------------------------------------");
console.log("GENERATED DIGEST (Top 10)");
console.log("---------------------------------------------------");

if (top10.length === 0) {
    console.log("No jobs made it into the digest.");
} else {
    top10.forEach((job, index) => {
        console.log(`#${index + 1}: [${job.matchResult.score}%] ${job.title} @ ${job.company}`);
        console.log(`    Loc: ${job.location} | Exp: ${job.experience} | ${job.postedDaysAgo}d ago`);
        console.log(`    Source: ${job.source}`);
    });
}
console.log("---------------------------------------------------");
