
# 🎮 PRD: "Hire Me!" — A Papers, Please-Style Tech Hiring Game
### Lányok Napja 2026 @ GoTo Engineering

---

## 1. Overview

| Field | Detail |
|---|---|
| **Product Name** | *Hire Me!* (working title) |
| **Inspired By** | Papers, Please (Lucas Pope, 2013) |
| **Purpose** | Interactive activity for Lányok Napja 2026 — a STEM event where high-school girls visit GoTo's engineering office |
| **Target Audience** | Girls aged 14–18 (no coding experience assumed) |
| **Session Length** | ~20–30 min of gameplay within the 90 min event |
| **Platform** | Web-based (browser, runs on any laptop/tablet) |
| **Team Size** | Individual play at stations, or pairs |

---

## 2. Concept

> *"You are the new Engineering Hiring Manager at GoTo. Your inbox is overflowing with applications. Review CVs, spot red flags, check requirements, and make the right hiring decisions — before time runs out!"*

The player sits at a virtual desk. Candidate CVs slide onto the screen. The player must **review each CV** against the **current job requirements**, then stamp **HIRE** ✅ or **REJECT** ❌. As the game progresses, the rules get more complex, edge cases appear, and the pressure mounts.

### Core Loop (per round):
```
1. Read the Job Description (pinned on screen)
2. CV slides onto desk
3. Review CV fields against requirements
4. Make a decision: HIRE ✅ or REJECT ❌
5. Get instant feedback (correct / mistake)
6. Repeat — clock is ticking!
```

---

## 3. Game Mechanics

### 3.1 The CV Card

Each CV is a stylized card showing some/all of these fields:

| Field | Example |
|---|---|
| **Name** | "Alex Kovács" |
| **Photo** | Illustrated avatar (diverse, inclusive) |
| **Education** | "BSc Computer Science — BME" |
| **Skills** | Python, JavaScript, Teamwork, Public Speaking |
| **Experience** | "2 years at TechCorp — Built a chat app" |
| **Languages** | Hungarian 🇭🇺, English 🇬🇧 |
| **Fun Fact** | "Once debugged code while skydiving" |
| **Red Flag?** | e.g., "Skills: Everything" / dates don't add up / no relevant experience |

### 3.2 The Job Description Board

A pinned panel on screen showing current requirements. **Changes each level.**

Example — Level 1:
```
📋 OPEN POSITION: Junior Frontend Developer
Required:
  ✓ Knows JavaScript
  ✓ Has at least 1 year experience
  ✓ Speaks English
```

Example — Level 3:
```
📋 OPEN POSITION: Senior Backend Engineer
Required:
  ✓ Knows Python OR Go
  ✓ Has 3+ years experience
  ✓ Speaks English
  ✓ Has worked on a team of 5+
Bonus (extra points):
  ⭐ Open source contributor
  ⭐ Mentoring experience
Disqualifiers:
  🚫 Claims to know "all programming languages"
  🚫 Experience dates overlap impossibly
```

### 3.3 Escalating Complexity (Levels)

| Level | New Mechanic | Real-World Lesson |
|---|---|---|
| **1 — The Basics** | Simple skill matching (has skill Y/N) | "We check if you have the right skills for the role" |
| **2 — Reading Deeper** | Check experience years, education relevance | "Experience matters, but context matters more" |
| **3 — Red Flags** | Spot suspicious claims (knows 25 languages, impossible timelines, plagiarized bios) | "Critical thinking — not everything on a CV is true" |
| **4 — Culture & Soft Skills** | Must also match team needs: teamwork, communication, mentoring | "Tech skills alone aren't enough — we value collaboration" |
| **5 — The Interview** | After approving a CV, a quick 1-question interview pops up. Evaluate the answer. | "Talking to people is part of the job!" |
| **BONUS — The Plot Twist** | The CEO sends biased instructions ("don't hire anyone from university X"). Player must decide: follow or refuse. | "Ethics matter. Bias in hiring is real and must be fought." |

### 3.4 Scoring

| Action | Points |
|---|---|
| Correct HIRE | +10 |
| Correct REJECT | +10 |
| Wrong decision | -5 |
| Speed bonus (< 15 sec) | +3 |
| Spotted a red flag detail | +5 (bonus) |
| Refused biased instruction (Level Bonus) | +20 |
| Followed biased instruction | -15 |

**End-of-game rating:**
- ⭐ "Intern" (0–50)
- ⭐⭐ "Recruiter" (51–100)
- ⭐⭐⭐ "Hiring Manager" (101–150)
- ⭐⭐⭐⭐ "VP of Engineering" (151–200)
- ⭐⭐⭐⭐⭐ "Chief People Officer" (200+)

---

## 4. Educational Goals

This isn't just a game — each level teaches something real:

| Level | Lesson for the Girls |
|---|---|
| 1–2 | What tech companies actually look for in candidates |
| 3 | Critical thinking: question what you read |
| 4 | Soft skills matter as much as hard skills in engineering |
| 5 | Communication is a core engineering skill |
| Bonus | Ethics in tech: diversity, fairness, standing up to bias |

**Post-game debrief (facilitated by GoTo engineers):**
- "What surprised you about what we look for?"
- "Did anyone refuse the CEO's biased instruction? Why?"
- "What skills do YOU already have that are valuable in tech?"

---

## 5. Content Requirements

### 5.1 CV Pool
- **Minimum 30 unique CV cards** (to ensure replayability across stations)
- Mix of clearly qualified, clearly unqualified, and edge-case candidates
- **Diverse representation**: Hungarian and international names, varied backgrounds, gender-balanced
- **Humorous fun facts** to keep it light ("Built a robot that feeds the cat")
- **Some deliberately absurd CVs** for comic relief ("Experience: Time traveler, 2025–2019")

### 5.2 Job Descriptions
- **5–6 unique job descriptions** corresponding to levels
- Based on real GoTo roles (simplified): Frontend Dev, Backend Engineer, QA, Data Analyst, Product Manager, DevOps
- Written in plain, accessible language (no jargon overload)

### 5.3 Interview Questions (Level 5)
- 4–5 one-question mini-interviews with multiple-choice candidate responses
- Player evaluates: Good answer ✅ / Red flag answer ❌
- Example:
  > **Q: "Tell me about a time you disagreed with a teammate."**
  > - Candidate A: "I listened to their perspective and we found a compromise." ✅
  > - Candidate B: "I was right so I just did it my way." ❌

### 5.4 Localization
- Primary language: **Hungarian** 🇭🇺
- Secondary: **English** 🇬🇧 (toggle)
- CVs can mix languages naturally (as they do in real life in Budapest tech)

---

## 6. UI/UX Design

### 6.1 Layout (Desktop/Tablet)

```
┌──────────────────────────────────────────────────┐
│  ┌─────────────┐   ┌──────────────────────────┐  │
│  │ JOB DESC    │   │                          │  │
│  │ (pinned)    │   │    CV CARD               │  │
│  │             │   │    (slides in from right) │  │
│  │ Required:   │   │                          │  │
│  │ • Skill A   │   │    Name: ...             │  │
│  │ • Exp: 2yr+ │   │    Skills: ...           │  │
│  │ • English   │   │    Exp: ...              │  │
│  │             │   │    Education: ...         │  │
│  │ Red flags:  │   │    Fun fact: ...         │  │
│  │ • "knows    │   │                          │  │
│  │   all langs"│   │                          │  │
│  └─────────────┘   └──────────────────────────┘  │
│                                                    │
│  ┌──────────┐          ┌──────────┐               │
│  │ ❌ REJECT │          │ ✅ HIRE  │   ⏱️ 0:42    │
│  └──────────┘          └──────────┘               │
│                                                    │
│  Score: 85  │  Level: 3/5  │  CVs: 12/20         │
└──────────────────────────────────────────────────┘
```

### 6.2 Visual Style
- Clean, modern, slightly playful (think: flat design + subtle animations)
- CV cards feel like physical paper (slight shadow, slide-in animation)
- Stamp animation on HIRE/REJECT (satisfying thud + ink splatter)
- Color palette: GoTo brand colors + warm accents
- Illustrated avatars (not photos) — inclusive, diverse, fun

### 6.3 Sound Design (optional but recommended)
- Paper shuffle sounds
- Stamp thud (HIRE = cheerful, REJECT = somber)
- Ticking clock ambient
- Level-up fanfare
- Error buzzer (wrong decision)

---

## 7. Technical Spec

### 7.1 Stack (Recommended)

| Layer | Tech | Rationale |
|---|---|---|
| **Frontend** | React + TypeScript | GoTo's stack, team familiarity |
| **Styling** | Tailwind CSS or CSS Modules | Rapid UI dev, responsive |
| **Animations** | Framer Motion | Smooth card slides, stamp effects |
| **State Management** | React useState/useReducer | Simple enough, no need for Redux |
| **Game Data** | JSON files | CVs, job descriptions, interview Qs — all static content |
| **Hosting** | Static deploy (Vercel / Netlify / GH Pages) | Zero backend needed |
| **Analytics (optional)** | Simple localStorage scoreboard | Show high scores across stations |

### 7.2 Architecture

```
src/
├── components/
│   ├── CVCard.tsx              # Renders a candidate CV
│   ├── JobDescription.tsx      # Pinned job requirements panel
│   ├── DecisionButtons.tsx     # Hire / Reject buttons + stamp animation
│   ├── InterviewPopup.tsx      # Level 5 interview Q&A modal
│   ├── ScoreBoard.tsx          # Running score + level indicator
│   ├── Timer.tsx               # Countdown timer
│   ├── BiasAlert.tsx           # Bonus level: CEO bias instruction
│   ├── GameOver.tsx            # Final score + rating screen
│   └── StartScreen.tsx         # Welcome + instructions
├── data/
│   ├── cvs.json                # Pool of 30+ CV objects
│   ├── jobs.json               # Job descriptions per level
│   ├── interviews.json         # Interview Q&A pairs
│   └── rules.json              # Level-specific rules & red flags
├── hooks/
│   ├── useGameState.ts         # Core game loop state machine
│   └── useTimer.ts             # Countdown logic
├── utils/
│   ├── scoring.ts              # Score calculation logic
│   ├── cvValidator.ts          # Checks CV against current job rules
│   └── levelProgression.ts     # Level advancement logic
├── App.tsx
└── index.tsx
```

### 7.3 Data Model

```typescript
// CV Candidate
interface Candidate {
  id: string;
  name: string;
  avatar: string;                   // illustrated avatar asset ID
  education: string;
  skills: string[];
  experienceYears: number;
  experienceDescription: string;
  languages: string[];
  teamSize?: number;
  funFact: string;
  isOpenSource?: boolean;
  hasMentoringExperience?: boolean;
  redFlags?: RedFlag[];            // e.g., "claims_all_languages", "impossible_dates"
}

// Red Flag types
type RedFlag =
  | "claims_all_languages"
  | "impossible_dates"
  | "plagiarized_bio"
  | "no_relevant_experience"
  | "buzzword_overload"
  | "fake_credentials";

// Job Description
interface JobDescription {
  level: number;
  title: string;
  requiredSkills: string[];
  minExperienceYears: number;
  requiredLanguages: string[];
  minTeamSize?: number;
  bonusCriteria?: string[];
  disqualifiers?: RedFlag[];
}

// Interview Question
interface InterviewQuestion {
  question: string;
  answers: {
    text: string;
    isGoodAnswer: boolean;
  }[];
}

// Game State
interface GameState {
  currentLevel: number;
  score: number;
  cvQueue: Candidate[];
  currentCV: Candidate | null;
  currentJob: JobDescription;
  decisionsLog: Decision[];
  timeRemaining: number;
  biasInstructionShown: boolean;
  biasInstructionFollowed: boolean | null;
}
```

---

## 8. MVP Scope & Milestones

### Phase 1 — MVP (Target: 2 weeks)
- [ ] Start screen with instructions (HU + EN toggle)
- [ ] CV card component with all fields
- [ ] Job description panel
- [ ] HIRE / REJECT buttons with basic animation
- [ ] Level 1–3 gameplay (skill matching, experience, red flags)
- [ ] Scoring system
- [ ] Timer (90 sec per level)
- [ ] Game over screen with rating
- [ ] 15 unique CV cards
- [ ] 3 job descriptions

### Phase 2 — Polish (Target: +1 week)
- [ ] Level 4 (soft skills / culture fit)
- [ ] Level 5 (interview popup)
- [ ] Bonus level (bias dilemma)
- [ ] Stamp animation (Framer Motion)
- [ ] Sound effects
- [ ] 30+ CV cards
- [ ] 5–6 job descriptions
- [ ] Local high score board
- [ ] Responsive layout (tablet friendly)

### Phase 3 — Nice to Have
- [ ] Leaderboard across all stations (WebSocket or polling)
- [ ] "Create your own CV" mini-feature at the end
- [ ] Print-your-score certificate
- [ ] Accessibility (screen reader, high contrast mode)

---

## 9. Content Examples

### Sample CV — Clear HIRE (Level 1: Junior Frontend Dev)

```
┌─────────────────────────────────────┐
│  👩‍💻 Nóra Szabó                      │
│                                     │
│  🎓 BSc Computer Science — ELTE     │
│  💼 1.5 years at WebStudio          │
│     "Built responsive dashboards"   │
│  🛠️ JavaScript, React, CSS, Git    │
│  🌍 Hungarian, English              │
│  ⚡ Fun fact: Makes pixel art of    │
│     her cat every weekend           │
└─────────────────────────────────────┘
→ HIRE ✅ (matches all requirements)
```

### Sample CV — Clear REJECT (Level 1: Junior Frontend Dev)

```
┌─────────────────────────────────────┐
│  🧑‍💻 Bence Tóth                      │
│                                     │
│  🎓 BA Art History — Corvinus       │
│  💼 No tech experience              │
│     "Interned at a museum"          │
│  🛠️ Photoshop, PowerPoint          │
│  🌍 Hungarian                       │
│  ⚡ Fun fact: Can name every        │
│     painting in the Louvre          │
└─────────────────────────────────────┘
→ REJECT ❌ (no JavaScript, no experience, no English)
```

### Sample CV — Red Flag (Level 3)

```
┌─────────────────────────────────────┐
│  🧑‍💻 "The Legend" László             │
│                                     │
│  🎓 PhD Everything — Harvard,       │
│     MIT, and Oxford (all at once)   │
│  💼 47 years experience (age: 22)   │
│     "Invented the internet"         │
│  🛠️ All Programming Languages Ever │
│  🌍 Speaks 14 languages fluently    │
│  ⚡ Fun fact: "I have no flaws"     │
└─────────────────────────────────────┘
→ REJECT ❌ (multiple red flags: impossible claims)
```

### Sample Bias Dilemma (Bonus Level)

```
┌─────────────────────────────────────────────┐
│  📩 MESSAGE FROM THE CEO:                    │
│                                              │
│  "Hey, between us — don't hire anyone       │
│   who went to [University X]. They never    │
│   work out. Just reject them automatically. │
│   Thanks! 😉"                                │
│                                              │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ 🚫 Follow   │  │ ✊ Refuse & Report   │  │
│  │   the order  │  │   to HR              │  │
│  └─────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| Girls who complete at least 3 levels | >80% |
| Average engagement time | 15–25 min |
| Post-game "I learned something new" (survey) | >70% agree |
| "I'd consider a tech career" (survey) | >50% agree |
| Fun rating (1–5 scale) | >4.0 |

---

## 11. Open Questions

1. **Do we want multiplayer/competitive mode?** (e.g., two players race side-by-side)
2. **Should we tie in real GoTo job descriptions?** (could be a nice authentic touch)
3. **Do we want a physical component too?** (printed CV cards as backup / icebreaker)
4. **What GoTo branding guidelines apply?** (logo usage, color palette)
5. **How many game stations will we have?** (affects leaderboard scope)
6. **Who writes the CV content?** (engineering + HR collab recommended for authenticity + humor)
7. **Hungarian-only or bilingual?** (recommendation: bilingual toggle, HU default)

---

## 12. Team & Ownership

| Role | Who | Responsibility |
|---|---|---|
| **Product Owner** | TBD | Scope decisions, content sign-off |
| **Lead Dev** | TBD | Architecture, core game loop |
| **Frontend Dev(s)** | TBD (1–2 people) | UI components, animations |
| **Content Creator** | TBD (eng + HR collab) | CV cards, job descriptions, interview Qs |
| **Designer** | TBD | Visual design, avatar illustrations, UX |
| **QA / Playtester** | TBD | Test with non-tech users before event |

---

*Estimated total effort: ~3–4 person-weeks for MVP+Polish*
*Recommended kickoff: 6 weeks before event date*

---
