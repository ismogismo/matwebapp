# CLAUDE.md — matwebapp

AI assistant guidance for the **matwebapp** codebase.

---

## Project Overview

**matwebapp** is a client-side math practice web application. Users select math operations (+, -, *, /) and a difficulty level, then answer randomly generated problems. It tracks a running score with correct/total counts and percentage.

There is no backend, no database, and no external runtime dependencies.

---

## Repository Structure

```
matwebapp/
├── src/
│   └── app.ts          # All application logic (TypeScript source)
├── js/
│   └── app.js          # Compiled output — DO NOT edit directly
├── css/
│   └── style.css       # All styling (vanilla CSS)
├── index.html          # Single HTML entry point
├── package.json        # npm config + devDependencies
├── package-lock.json
└── tsconfig.json       # TypeScript compiler configuration
```

The application is intentionally minimal. All logic lives in a single TypeScript file (`src/app.ts`). Do not introduce additional source files unless the size of the codebase clearly warrants it.

---

## Technology Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Language    | TypeScript 6.x (strict)  |
| Output      | ES6 JavaScript modules   |
| Styling     | Vanilla CSS              |
| Markup      | Semantic HTML5           |
| Build tool  | TypeScript compiler only (`tsc`) |
| Runtime deps | None                  |

---

## Development Workflow

### Building

TypeScript must be compiled before any changes to `src/app.ts` are visible in the browser.

```bash
npx tsc
```

This reads `tsconfig.json` and compiles `src/app.ts` → `js/app.js`.

There is no watch mode or dev server configured. To iterate quickly, run `npx tsc --watch` manually or open `index.html` directly in a browser after each compilation.

### Running the App

Open `index.html` in a browser directly (file protocol is fine — there is no server-side requirement). The compiled `js/app.js` is loaded as an ES6 module via:

```html
<script type="module" src="js/app.js"></script>
```

### Testing

No test framework is configured. `npm test` will fail with a placeholder error. Do not add tests to `package.json`'s existing test script without also installing a test framework.

---

## Code Conventions

### TypeScript

- **Strict mode is enabled** (`"strict": true` in `tsconfig.json`). All code must pass strict type checks — no `any`, no implicit type widening.
- Use interfaces to model domain objects:
  ```typescript
  interface Problem { num1: number; num2: number; operator: string; answer: number; }
  interface Score { correct: number; total: number; }
  ```
- Cast DOM elements explicitly using `as HTMLInputElement`, `as HTMLButtonElement`, etc. Never leave them as `Element | null`.
- Module-level `let` variables hold the single mutable state (`currentProblem`, `score`). Keep state minimal.

### Functions

- Pure utility functions (no side effects) are defined at the top of `app.ts`: `randomInt`, `getSelectedOperators`, `getDifficultyRange`, `generateProblem`.
- Display/update functions that touch the DOM come next: `displayProblem`, `updateScoreDisplay`, `resetScore`.
- Answer checking and event wiring are at the bottom, inside the `DOMContentLoaded` listener.
- Maintain this order when adding new functionality.

### HTML Element IDs and CSS Classes

Follow the existing prefix conventions:

| Prefix   | Meaning               | Examples                         |
|----------|-----------------------|----------------------------------|
| `op-`    | Operation checkboxes  | `op-add`, `op-sub`, `op-mul`, `op-div` |
| `diff-`  | Difficulty radio buttons | `diff-easy`, `diff-medium`, `diff-hard` |
| (none)   | Core UI elements      | `answer-input`, `submit-btn`, `problem-display`, `feedback`, `score` |

CSS classes `correct` and `incorrect` are toggled on `#feedback` to color the result text green/red.

### CSS

- All styles live in `css/style.css`. No inline styles or `<style>` blocks in HTML.
- Colors: primary blue `#4a90d9`, correct green `#2ecc71`, incorrect red `#e74c3c`.
- Responsive breakpoint at `max-width: 480px` for mobile.

### Problem Generation Logic

- Subtraction (`-`) always generates `num2 <= num1` so the answer is non-negative.
- Division (`/`) always generates `num1 = num2 * multiplier` so the answer is always a whole number. `num2` is at least 1 to avoid division by zero.
- At least one operator checkbox must remain checked at all times — the change handler re-checks the last checkbox if the user tries to deselect all.
- Changing difficulty resets the score (`resetScore()`).

### Feedback Timing

After submitting an answer, feedback displays for **1500 ms**, then clears and a new problem is generated. This is hardcoded in `checkAnswer()` via `setTimeout`. If you change this value, keep the UX in mind — too short feels rushed, too long feels sluggish.

---

## Key DOM IDs Reference

| ID                | Element Type  | Purpose                              |
|-------------------|---------------|--------------------------------------|
| `problem-display` | `<p>`         | Shows the current math problem       |
| `answer-input`    | `<input>`     | Number input for the user's answer   |
| `submit-btn`      | `<button>`    | Submits the answer                   |
| `feedback`        | `<p>`         | Shows "Correct!" or "Incorrect. ..." |
| `score`           | `<p>`         | Shows running score                  |
| `op-add/sub/mul/div` | `<input[checkbox]>` | Operator selection          |
| `diff-easy/medium/hard` | `<input[radio]>` | Difficulty selection        |

---

## Things to Avoid

- **Do not edit `js/app.js` directly.** It is generated by `tsc` and will be overwritten.
- **Do not add runtime npm dependencies** without a clear reason. The zero-dependency stance is intentional.
- **Do not use `any` in TypeScript.** Strict mode will catch it, but avoid it by design.
- **Do not add a backend** unless the requirements change substantially — this is a static site.
- **Do not add CSS frameworks or JS frameworks** (React, Vue, Tailwind, etc.) without explicit direction from the project owner.
- **Do not persist score** to `localStorage` or a backend unless asked — the current in-memory design is intentional.

---

## Git

- Default development branch for AI-assisted work: `claude/add-claude-documentation-7BGsL`
- Main branch: `main`
- Commit messages should be concise and describe the change in the imperative mood (e.g., "Add hard difficulty range", "Fix division by zero edge case").
- Push with: `git push -u origin <branch-name>`
