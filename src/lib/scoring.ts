
import { Job } from "./data";

export interface Preferences {
    roleKeywords: string[];
    preferredLocations: string[];
    preferredMode: string[];
    experienceLevel: string;
    skills: string[];
    minMatchScore: number;
}

export interface MatchResult {
    score: number;
    color: "green" | "amber" | "neutral" | "grey";
}

export function calculateMatchScore(job: Job, prefs: Preferences): MatchResult {
    if (!prefs) {
        return { score: 0, color: "grey" };
    }

    let score = 0;

    // Rule 1: +25 if any roleKeyword appears in job.title (case-insensitive)
    const titleLower = job.title.toLowerCase();
    const hasRoleInTitle = prefs.roleKeywords.some(
        (kw) => kw.trim() && titleLower.includes(kw.trim().toLowerCase())
    );
    if (hasRoleInTitle) score += 25;

    // Rule 2: +15 if any roleKeyword appears in job.description
    const descLower = job.description.toLowerCase();
    const hasRoleInDesc = prefs.roleKeywords.some(
        (kw) => kw.trim() && descLower.includes(kw.trim().toLowerCase())
    );
    if (hasRoleInDesc) score += 15;

    // Rule 3: +15 if job.location matches preferredLocations
    // Simple substring/inclusion check. "Bangalore, India" vs "Bangalore"
    const locationMatch = prefs.preferredLocations.some(
        (loc) => loc.trim() && job.location.toLowerCase().includes(loc.trim().toLowerCase())
    );
    if (locationMatch) score += 15;

    // Rule 4: +10 if job.mode matches preferredMode
    if (prefs.preferredMode.includes(job.mode)) score += 10;

    // Rule 5: +10 if job.experience matches experienceLevel
    // Exact string match for simplicity as per requirement, or mapping if needed. 
    // Requirement says: "+10 if job.experience matches experienceLevel"
    // Assuming dropdown values match job.experience values.
    if (job.experience === prefs.experienceLevel) score += 10;

    // Rule 6: +15 if overlap between job.skills and user.skills (any match)
    const jobSkillsLower = job.skills.map(s => s.toLowerCase());
    const userSkillsLower = prefs.skills.map(s => s.trim().toLowerCase());
    const hasSkillOverlap = userSkillsLower.some(us => jobSkillsLower.includes(us));
    if (hasSkillOverlap) score += 15;

    // Rule 7: +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) score += 5;

    // Rule 8: +5 if source is LinkedIn
    if (job.source === "LinkedIn") score += 5;

    // Cap at 100
    if (score > 100) score = 100;

    // Determine color
    let color: MatchResult["color"] = "grey";
    if (score >= 80) color = "green";
    else if (score >= 60) color = "amber";
    else if (score >= 40) color = "neutral";

    return { score, color };
}
