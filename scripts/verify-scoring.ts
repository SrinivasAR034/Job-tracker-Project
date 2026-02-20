
import { calculateMatchScore, Preferences } from "../src/lib/scoring";
import { Job } from "../src/lib/data";

const mockPreferences: Preferences = {
    roleKeywords: ["Frontend", "React"],
    preferredLocations: ["Remote", "Bangalore"],
    preferredMode: ["Remote", "Hybrid"],
    experienceLevel: "1-3 Years",
    skills: ["React", "TypeScript", "Tailwind"],
    minMatchScore: 0
};

const mockJobs: Job[] = [
    {
        id: "1",
        title: "Senior Frontend Engineer",
        company: "TechCorp",
        location: "Bangalore",
        mode: "Hybrid",
        experience: "1-3 Years",
        skills: ["React", "Redux"],
        source: "LinkedIn",
        postedDaysAgo: 1,
        salaryRange: "20LPA",
        applyUrl: "",
        description: "We fit your React skills perfectly."
    },
    {
        id: "2",
        title: "Backend Java Developer",
        company: "OldSchool",
        location: "Mumbai",
        mode: "Onsite",
        experience: "3-5 Years",
        skills: ["Java", "Spring"],
        source: "Naukri",
        postedDaysAgo: 10,
        salaryRange: "15LPA",
        applyUrl: "",
        description: "Java backend role."
    }
];

console.log("---------------------------------------------------");
console.log("VERIFYING MATCHING LOGIC");
console.log("---------------------------------------------------");
console.log("Preferences:", JSON.stringify(mockPreferences, null, 2));
console.log("---------------------------------------------------");

mockJobs.forEach(job => {
    const result = calculateMatchScore(job, mockPreferences);
    console.log(`Job: ${job.title} (${job.company})`);
    console.log(`Score: ${result.score}/100`);
    console.log(`Badge Color: ${result.color}`);

    console.log("---------------------------------------------------");
});
