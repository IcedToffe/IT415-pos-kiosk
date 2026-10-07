# AI Usage Log

The exam requires documenting AI prompts, responses, how the output was evaluated, and what was
modified. Each member adds their own entries below. Keep entries honest and specific: what you
asked, what came back, how you checked it, and what you changed.

**Tool:** Claude (Anthropic), used through Claude Code.

---

## Entry 1: Next.js setup and landing page

- **Member:** Jay Salamanes
- **Branch / PR:** `nextjs-landing-page` → PR #1
- **Prompt (summary):** Replace the static HTML site with a Next.js app (Tailwind, shadcn/ui) and
  add a landing page.
- **AI output:** Next.js 16 scaffold, Tailwind v4 and shadcn/ui setup, landing page, rewritten README.
- **Evaluation:** Ran `npm run dev` and `npm run build`, then reviewed the page in the browser.
- **Modifications:** Merged after review. In Entry 2 the landing page moved to `/about` and its
  button now opens the kiosk.

## Entry 2: Kiosk port to Next.js, styled after the Sample UI

- **Member:** Jay Salamanes
- **Branch / PR:** `kiosk-nextjs`
- **Prompts (summary):**
  1. "Let's finish this project": the instructor's three files (Practical Exam, Sample UI,
     Acceptance Checklist) plus a frontend-replication prompt: recreate the existing frontend
     faithfully, then polish it without inventing new UI.
  2. "Check everything and tell me what each file is for."
- **AI output:**
  - Read the existing plain-JS kiosk on `feature-product-cart` (logic) and `CSS/UI` (styling).
  - Ported the logic to typed modules in `lib/pos/` (money in centavos, stock, TXN numbers, QR).
  - Built one React component per screen in `components/kiosk/`, following the 10 Sample UI
    screens: dark header with 4-step progress, product grid with categories, order panel, review
    table, payment method cards, cash keypad, QR, card, success and receipt.
- **Evaluation:**
  - Automated the instructor's 15 tests from exam pages 7–8 in a headless browser. Examples:
    Coffee ×2 + Sandwich + Soft Drink = ₱175; remove Soft Drink → ₱140; pay ₱100 → rejected with
    "Insufficient payment"; pay ₱200 → change ₱60; QR and card receipts show paid = total and
    ₱0.00 change; three transactions → three different TXN numbers. All passed.
  - Also checked: blank, letters, negative and zero amounts are rejected; stock is deducted only
    after a successful payment; double-tapping Process Payment creates one transaction; no
    horizontal scrolling on a 390 px phone screen.
  - Compared screenshots side by side with the Sample UI.
- **Modifications after review:**
  - The AI first planned to keep the purple theme from the `CSS/UI` branch. Once the Sample UI
    was available, it switched to the instructor's design (navy header, orange accent) so the
    reference screens are the source of truth.
  - Reduced the products from 8 to the exam's 6 examples so the categories (Drinks, Food,
    Snacks) fit and the instructor's test prices match exactly.
  - Fixed a bug found in testing: the toast wrapped into a tall bubble on phones.
  - Re-authored the commits to the member's GitHub email so they are attributed correctly.

## Entry 3: Independent verification and four bug fixes

- **Member:** Jay Salamanes
- **Branch / PR:** `kiosk-nextjs`
- **Prompts (summary):**
  1. A verification prompt: "You are verifying a finished IT415 practical exam project… Your job
     is to VERIFY and REPORT, not to rewrite." It told the AI not to change any file, to give
     evidence for every PASS, to run the build, the 15 instructor tests, the 26-item acceptance
     checklist and a list of known risks (duplicate references, receipt left on screen, fonts
     offline, refresh, responsive widths, accessibility), then stop and wait for approval.
  2. A fix prompt listing the approved fixes, one commit per fix, no push, then re-test.
- **AI output (verification):** lint, `tsc` and build were clean, and all 15 instructor tests and
  all 26 checklist items passed in a real browser (Playwright driving Chrome against the
  production build). It also found four bugs:
  1. Typing `-200` as the cash amount was accepted as ₱200, because the input removed the minus
     sign as it was typed. There was no upper limit either (₱99,999,999,999 was accepted).
     This corrects Entry 2, which said negative amounts were rejected: that was only true for
     the on-screen keypad, which has no minus key.
  2. Transaction numbers came only from a `localStorage` counter, so a new browser, a private
     window or `localStorage.clear()` issued `TXN-2026-00001` again.
  3. Two clicks in the same instant on Pay Now or Confirm Payment used up two reference numbers
     for one sale. Only the card screen had a guard. An ordinary double-tap was already safe.
  4. The receipt stayed on screen indefinitely, so the next customer could see the previous order.
- **Fixes applied (one commit each):**
  1. `lib/pos/money.ts`, `components/kiosk/cash-screen.tsx`: the minus sign is kept and rejected
     with "Amount cannot be negative."; amounts over `MAX_CASH` (₱100,000.00) are rejected.
  2. `lib/pos/storage.ts`: references are now `TXN-YYYYMMDD-HHMMSS-NNNN`; the QR screen shows its
     own `QR-YYYYMMDD-HHMMSS` reference.
  3. `components/kiosk/kiosk.tsx`: a `completing` flag makes `completeTransaction` run once per sale.
  4. `components/kiosk/kiosk.tsx`: a 60-second idle timer on the success and receipt screens
     returns the kiosk to Item Selection.
- **Evaluation (how each fix was re-tested, in Chrome via Playwright):**
  1. `-200`, `-0`, `99999999` and `100000.01` are rejected and stay on the Cash screen with no
     change to stock or the counter; `100000` is accepted; ₱200 on ₱140 still gives ₱60 change.
  2. Ten transactions gave ten different references; after `localStorage.clear()` and again in a
     fresh browser profile the counter restarted at `0001` but the reference was still new.
  3. Two clicks fired in the same tick on Pay Now, Confirm Payment and Process Payment each
     raised the counter by exactly 1 and deducted stock once. A rejected payment can be retried.
  4. With Playwright's clock: no reset at 55 s, a tap restarts the timer, reset at 60 s with an
     empty cart and the toast "Returned to start — previous order cleared". Three idle minutes
     on the ordering and cash screens did not reset anything.
  - The 15 instructor tests were re-run afterwards and all passed.
- **Modifications / limits:**
  - The AI's first suggestion for fix 1 only changed the input filter; the explicit negative
    check and the ₱100,000 limit were added in the fix prompt.
  - Known limit: two different browsers that each complete their first sale in the same second
    would still get the same reference. A single kiosk cannot do this.
  - On a 390 px phone the longer reference wraps onto two or three lines; nothing is clipped.

---

## Template for the next entry

- **Member:**
- **Branch / PR:**
- **Prompt:**
- **AI output:**
- **Evaluation (how you checked it):**
- **Modifications (what you changed and why):**
