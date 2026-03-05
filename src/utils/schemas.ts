import { z } from 'zod'

const RedFlagSchema = z.enum([
  'claims_all_languages',
  'impossible_dates',
  'plagiarized_bio',
  'no_relevant_experience',
  'buzzword_overload',
  'fake_credentials',
])

export const CandidateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatar: z.string().min(1),
  headline: z.string().optional(),
  headlineHu: z.string().optional(),
  education: z.string(),
  skills: z.array(z.string()).min(1),
  experienceYears: z.number().min(0),
  experienceDescription: z.string(),
  achievements: z.array(z.string()).optional(),
  achievementsHu: z.array(z.string()).optional(),
  languages: z.array(z.string()).min(1),
  teamSize: z.number().optional(),
  funFact: z.string(),
  isOpenSource: z.boolean().optional(),
  hasMentoringExperience: z.boolean().optional(),
  redFlags: z.array(RedFlagSchema).optional(),
  redFlagFields: z.array(z.string()).optional(),
  requiresInterview: z.boolean().optional(),
  levels: z.array(z.number().int().min(1)).min(1),
})

export const JobDescriptionSchema = z.object({
  level: z.number().int().min(1),
  title: z.string().min(1),
  titleHu: z.string().min(1),
  roleSummary: z.string().optional(),
  roleSummaryHu: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  responsibilitiesHu: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()),
  minExperienceYears: z.number().min(0),
  requiredLanguages: z.array(z.string()),
  minTeamSize: z.number().optional(),
  bonusCriteria: z.array(z.string()).optional(),
  disqualifiers: z.array(RedFlagSchema).optional(),
})

export const InterviewAnswerSchema = z.object({
  text: z.string().min(1),
  textHu: z.string().min(1),
  isGoodAnswer: z.boolean(),
})

export const InterviewQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  questionHu: z.string().min(1),
  answers: z.array(InterviewAnswerSchema).min(2),
})

export function validateCandidates(data: unknown) {
  return z.array(CandidateSchema).parse(data)
}

export function validateJobs(data: unknown) {
  return z.array(JobDescriptionSchema).parse(data)
}

export function validateInterviews(data: unknown) {
  return z.array(InterviewQuestionSchema).parse(data)
}
