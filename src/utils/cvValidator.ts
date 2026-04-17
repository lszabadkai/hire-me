import type {
  Candidate,
  JobDescription,
  RedFlag,
  ValidationReason,
} from "@/types/game";

export interface ValidationResult {
  shouldHire: boolean;
  reasons: ValidationReason[];
  redFlagsDetected: RedFlag[];
}

/**
 * Determines the correct hiring decision for a candidate against a job description.
 * "required skills" for levels with multiple skills uses OR logic (any one matches).
 */
export function validateCV(
  candidate: Candidate,
  job: JobDescription,
): ValidationResult {
  const reasons: ValidationReason[] = [];
  const redFlagsDetected: RedFlag[] = candidate.redFlags ?? [];

  // ── 1. Disqualifiers (red flags) ──────────────────────────────────────────
  if (job.disqualifiers && job.disqualifiers.length > 0) {
    const triggered = redFlagsDetected.filter((flag) =>
      job.disqualifiers!.includes(flag),
    );
    if (triggered.length > 0) {
      triggered.forEach((f) =>
        reasons.push({ key: "disqualifier", params: { flag: f } }),
      );
      return { shouldHire: false, reasons, redFlagsDetected };
    }
  }

  // ── 2. Required skills ──────────────────────────────────────────────────────
  const skillsLower = candidate.skills.map((s) => s.toLowerCase());
  const requiredSkillsLower = job.requiredSkills.map((s) => s.toLowerCase());
  const missingSkills = requiredSkillsLower.filter((req) => {
    const options = req.split("|").map((o) => o.trim());
    return !options.some((opt) => skillsLower.includes(opt));
  });
  const hasRequiredSkill = missingSkills.length === 0;

  if (!hasRequiredSkill) {
    const display = missingSkills.map((s) => s.replace(/\|/g, "/")).join(", ");
    reasons.push({ key: "missing_skill", params: { skills: display } });
  }

  // ── 3. Experience years ───────────────────────────────────────────────────
  const hasExperience = candidate.experienceYears >= job.minExperienceYears;
  if (!hasExperience) {
    reasons.push({
      key: "insufficient_experience",
      params: {
        actual: candidate.experienceYears,
        required: job.minExperienceYears,
      },
    });
  }

  // ── 4. Required languages ─────────────────────────────────────────────────
  const langsLower = candidate.languages.map((l) => l.toLowerCase());
  const missingLangs = job.requiredLanguages
    .map((l) => l.toLowerCase())
    .filter((req) => !langsLower.includes(req));

  if (missingLangs.length > 0) {
    reasons.push({
      key: "missing_language",
      params: { languages: missingLangs.join(", ") },
    });
  }

  // ── 5. Minimum team size ──────────────────────────────────────────────────
  if (job.minTeamSize != null) {
    const teamSize = candidate.teamSize ?? 0;
    if (teamSize < job.minTeamSize) {
      reasons.push({
        key: "team_size_too_small",
        params: { actual: teamSize, required: job.minTeamSize },
      });
    }
  }

  const shouldHire =
    hasRequiredSkill &&
    hasExperience &&
    missingLangs.length === 0 &&
    (job.minTeamSize == null || (candidate.teamSize ?? 0) >= job.minTeamSize);

  if (shouldHire) {
    reasons.push({ key: "qualified" });
  }

  return { shouldHire, reasons, redFlagsDetected };
}
