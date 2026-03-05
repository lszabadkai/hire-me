# Hire Me! Implementation Plan

## 1. Delivery Strategy
Build in vertical slices so every milestone is both:
- Playable: a user can complete at least one full hiring loop in browser.
- Testable: automated tests exist for new game logic and key UI flows.

Guiding principle: ship a working game early, then layer complexity (levels, interview mode, bias dilemma, polish).

## 2. Suggested Timeline (3 weeks)
- Week 1: Foundation + MVP core loop (Levels 1-3)
- Week 2: Levels 4-5 + bonus ethics level + localization completion
- Week 3: Polish, balancing, accessibility, content expansion, playtest fixes

## 3. Technical Plan
### Stack
- React + TypeScript + Vite
- CSS Modules (or Tailwind if team prefers utility-first)
- Framer Motion for slide/stamp animation
- Vitest + Testing Library for unit/component tests
- Playwright for end-to-end gameplay checks

### Project Setup Tasks
1. Initialize app with strict TypeScript settings.
2. Add linting/formatting (`eslint`, `prettier`) and pre-commit checks.
3. Add testing stack (`vitest`, `@testing-library/react`, `playwright`).
4. Configure CI to run lint + unit + e2e smoke.

Exit criteria:
- `npm run dev` starts game shell.
- `npm test` and `npm run test:e2e` have at least one passing smoke test.

## 4. Incremental Playable Milestones

## Milestone A - Game Shell (Day 1-2)
Scope:
- Start screen
- Basic layout: Job panel, CV card area, decision buttons, score/timer placeholders
- Load one hardcoded CV and one hardcoded job

Playable definition:
- User can open app, press Start, view a CV, click Hire/Reject, see result text.

Testing:
- Unit: decision action updates score state.
- Component: Start button transitions to game screen.
- E2E smoke: open app -> start -> make one decision.

## Milestone B - Real Rules Engine (Day 3-4)
Scope:
- Implement `cvValidator` for required skills/languages/experience
- Implement red flag disqualifiers
- Move content to JSON (`cvs.json`, `jobs.json`, `rules.json`)

Playable definition:
- Level 1-2 logic works with multiple CVs from JSON.

Testing:
- Unit table tests for validator combinations (`AND`, `OR`, minimum years, disqualifiers).
- Regression tests for known edge cases from PRD (impossible dates, claims all languages).

## Milestone C - MVP Loop Complete (Day 5-7)
Scope:
- Queue of CVs per level
- Timer (90 sec/level)
- Score system with bonuses/penalties
- Level progression 1 -> 3
- Game-over screen with rating tiers
- Language toggle shell (HU default, EN fallback)

Playable definition:
- Full MVP round: play Levels 1-3 end-to-end and see final rating.

Testing:
- Unit: scoring matrix matches PRD values.
- Component: timer expiry triggers next level/game over correctly.
- E2E: complete Levels 1-3 with deterministic fixture data.

Release checkpoint:
- Internal demo build shared for first playtest.

## Milestone D - Advanced Gameplay (Week 2)
Scope:
- Level 4 soft skill checks
- Level 5 interview popup with question evaluation
- Bonus bias dilemma screen and branching score impact

Playable definition:
- Player can complete all levels including interview and ethics branch.

Testing:
- Unit: interview scoring and bias decision scoring.
- E2E: branch tests for both bias choices and expected score deltas.
- Content validation tests: each level has minimum required CV count and valid references.

## Milestone E - Polish + Event Readiness (Week 3)
Scope:
- Animation polish (card slide, stamp thud feedback)
- Local high-score board (localStorage)
- Tablet responsiveness and accessibility pass
- Expand content to 30+ CVs, 5-6 jobs, 4-5 interview questions
- Gameplay balancing (timers, score thresholds)

Playable definition:
- Stable, bilingual, responsive game suitable for 20-30 minute event sessions.

Testing:
- E2E cross-viewport checks (desktop + tablet).
- Accessibility checks (keyboard navigation, focus order, contrast, labels).
- Manual facilitator playtest with non-technical users.

## 5. Test Plan (Continuous)
### Unit Tests (high priority)
- `utils/scoring.ts`: all point rules and boundaries
- `utils/cvValidator.ts`: pass/fail and red-flag detection
- `utils/levelProgression.ts`: level transitions and end conditions

### Component Tests
- `DecisionButtons`: disabled states, click behavior, animation state toggles
- `InterviewPopup`: option selection and evaluation feedback
- `BiasAlert`: both choices invoke correct handlers

### E2E Tests (Playwright)
1. Happy path: complete game with mostly correct decisions.
2. Failure path: repeated wrong decisions, still reaches valid game over.
3. Timer path: timeout behavior per level.
4. Localization path: toggle HU/EN updates key UI text.

### Test Data Strategy
- Keep deterministic fixture packs for tests (`data/test-fixtures/*.json`).
- Add a schema check so content JSON cannot break runtime.

## 6. Asset Plan (Generate First, Replace Later)

## 6.1 Feasible Generated Placeholder Assets
Generate during implementation to keep progress unblocked:
- Avatars: procedural SVG avatars (different skin tones, hair styles, accessories).
- Icons/stamps: SVG assets generated in-code (HIRE/REJECT, warning, timer).
- Background textures: lightweight CSS/SVG patterns.
- Sound placeholders: short synthesized WAV/MP3 beeps/thuds (script-generated).

Why this works:
- Keeps game fully playable without waiting for design/audio dependencies.
- Avoids licensing issues from third-party media.

## 6.2 Stub Strategy
If any asset category is blocked, use stubs:
- Missing avatar -> fallback initials badge
- Missing sound -> silent no-op audio adapter
- Missing music -> disabled BGM toggle with placeholder label

Engineering rule:
- All media loaded behind an `AssetRegistry` so swapping placeholders with final assets is one file change, not many.

## 6.3 Final Asset Request List (ask at end if needed)
If custom branded assets are required beyond generated placeholders, request:
1. GoTo-approved color and logo usage guide.
2. Final avatar illustration pack (or approval to keep generated SVG style).
3. 3-5 short SFX files (paper shuffle, hire stamp, reject stamp, error, level-up).
4. Optional 1 low-volume loopable ambient track.

## 7. Content Production Plan
- Start with 15 CVs for MVP, then expand to 30+.
- Maintain content in spreadsheet-like source, export to JSON.
- Add automated content checks:
  - required fields present
  - no duplicate IDs
  - language fields valid (`hu`, `en`, `mixed`)
  - red flags use allowed enum values

Ownership split:
- Engineering: schema, tooling, integration
- HR + engineers: authenticity review and bias-safe wording
- Facilitators: age-appropriate tone check

## 8. Definition of Done
A release is done when:
- All levels (1-5 + bonus) are completable in browser.
- Tests pass in CI (lint, unit, e2e smoke).
- At least one full playtest with target audience profile completed.
- No blocker bugs in core loop (decision, score, level progression, timer).
- Offline fallback works (no backend dependency).

## 9. Risks and Mitigations
- Risk: content arrives late.
  Mitigation: generated/stub content pipeline from day 1.
- Risk: logic regressions while adding new levels.
  Mitigation: lock scoring/validator with table-driven tests before polish.
- Risk: event hardware variability.
  Mitigation: test on low-resolution laptop/tablet and provide performance mode.
- Risk: bilingual text overflow in UI.
  Mitigation: localization snapshot checks and responsive text containers.

## 10. Immediate Next Actions
1. Scaffold project and testing stack.
2. Implement Milestone A playable shell in first PR.
3. Add validator + scoring unit tests before expanding content.
4. Generate first placeholder asset pack (SVG + SFX stubs).
5. Run first internal playtest by end of Week 1.
