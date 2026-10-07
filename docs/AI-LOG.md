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

---

## Template for the next entry

- **Member:**
- **Branch / PR:**
- **Prompt:**
- **AI output:**
- **Evaluation (how you checked it):**
- **Modifications (what you changed and why):**
