import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIReport = async (data: AnalysisResult): Promise<string> => {
  const topContributors = data.stats.slice(0, 10).map(s => ({
    name: s.author,
    commits: s.totalCommits,
    additions: s.totalAdditions,
    deletions: s.totalDeletions,
    prs: s.totalPrs
  }));

  const prompt = `
    Analyze the following GitHub repository statistics for ${data.owner}/${data.repoName}.
    
    Total Commits: ${data.totalCommits}
    Total Lines Changed (approx): ${data.totalLinesChanged}
    Recent Merged PRs Analyzed: ${data.prCount}
    
    Top 10 Contributors Data:
    ${JSON.stringify(topContributors, null, 2)}
    
    Please provide a concise, professional, and insightful summary of the team's development dynamics.
    1. Identify the "Heavy Lifters" (most lines of code).
    2. Identify the "Maintainers" (high commit counts and PR activity).
    3. Comment on the balance of the team (is it a one-person show or well-distributed?).
    4. Provide a fun "Team Award" for the top contributor based on their stats.
    
    Format the output in Markdown. Keep it under 300 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Unable to generate report.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI report. Please try again later.";
  }
};