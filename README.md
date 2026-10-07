# Campus Store POS Kiosk

IT415 – Application Development and Emerging Technologies · Practical Examination

A touchscreen self-service Point of Sale kiosk. Customers tap products, review the order, pay by
Cash, QR Payment or Credit/Debit Card (simulated), and get a digital receipt with a unique
transaction number.

## Run it

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/IcedToffe/IT415-pos-kiosk.git
cd IT415-pos-kiosk
npm install
npm run dev
```

Open <http://localhost:3000>. The kiosk is the home page; `/about` is the project landing page.

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Create a production build        |
| `npm run start` | Serve the production build       |
| `npm run lint`  | Run ESLint                       |

**Reset demo data** (stock and transaction counter): open the browser console, run
`localStorage.clear()`, then reload.

## Transaction flow

Select Items → Review Order → Payment Method → Pay (Cash / QR / Card) → Payment Successful →
Receipt → New Transaction

## Technology and storage choices

| Choice | Why |
| --- | --- |
| **Next.js 16 + React 19 + TypeScript** | Component-based screens, typed data, and one command to build and deploy as a web app that runs on any touchscreen browser. |
| **Tailwind CSS v4** | Consistent spacing, colours and large touch targets without a separate stylesheet per screen. |
| **lucide-react icons** | Clear, consistent icons for products and payment methods. |
| **Hard-coded product list** (`lib/pos/products.ts`) | Six products is a small, fixed menu; a server or database adds nothing for the exam. |
| **Browser `localStorage`** | Keeps the transaction counter and the remaining stock between reloads, with no backend. A TXN number is the sale's date and time plus that counter (`TXN-20261007-184512-0001`), so it stays unique even in a new browser or after storage is cleared. |
| **Money in integer centavos** | Avoids floating-point errors such as `0.1 + 0.2 = 0.30000000000000004`; `₱45.00` is stored as `4500`. |
| **Receipt is a snapshot** | The completed order is copied into the receipt, so clearing the cart for the next customer cannot change it. |

## Features (mapped to the exam's 20 required items)

| # | Requirement | Where |
| --- | --- | --- |
| 1–2 | Six tappable product cards with name and price | `components/kiosk/select-screen.tsx` |
| 3–4 | `−` / `+` / remove controls; quantity never goes negative | `changeQty`, `removeItem` in `components/kiosk/kiosk.tsx` |
| 5–6 | Automatic subtotals and total | `cartLines`, `linesTotal` in `lib/pos/products.ts` |
| 7–8 | Order Summary; Back keeps the cart | `components/kiosk/review-screen.tsx` |
| 9 | Cash, QR Payment and Credit/Debit Card buttons | `components/kiosk/method-screen.tsx` |
| 10–12 | Cash: rejects blank, invalid, zero and insufficient amounts; change = paid − total | `checkCashPayment` in `lib/pos/money.ts`, `components/kiosk/cash-screen.tsx` |
| 13 | Simulated QR (generated code + Confirm Payment) | `lib/pos/qr.ts`, `components/kiosk/qr-screen.tsx` |
| 14 | Simulated card ("Processing payment…") | `components/kiosk/card-screen.tsx` |
| 15–17 | Payment Successful, unique TXN number, digital receipt | `completeTransaction`, `lib/pos/storage.ts`, `components/kiosk/result-screens.tsx` |
| 18–19 | New Transaction clears cart, payment and receipt | `newTransaction` in `components/kiosk/kiosk.tsx` |
| 20 | Toast feedback for every action and error | `components/kiosk/toast.tsx` |

**Optional extras:** product categories, inventory with stock validation (stock is deducted only
after a *successful* payment), on-screen keypad and quick amounts, print receipt.

## Project structure

```
app/page.tsx            Kiosk (home page)
app/about/page.tsx      Project landing page
components/kiosk/       One file per kiosk screen, plus shared kiosk UI
components/ui/          shadcn/ui components used by the landing page
lib/pos/                Kiosk logic: products, money, storage, QR generation
docs/AI-LOG.md          AI prompts, responses, evaluation and changes
```

## Group contributions

| Member | GitHub | Branch(es) | Contribution |
| --- | --- | --- | --- |
| _(name)_ | [IcedToffe](https://github.com/IcedToffe) | `feature-product-cart` | Repository setup; original plain-JS kiosk: cart, stock, cash/QR/card payment, receipt and transaction logic |
| _(name)_ | [Khirty](https://github.com/Khirty) | `CSS/UI` | Kiosk UI styling for the plain-HTML version |
| Jay Salamanes | [itismeJay](https://github.com/itismeJay) | `nextjs-landing-page`, `kiosk-nextjs` | Next.js migration and landing page; port of the kiosk to React components styled after the Sample UI |

## AI usage

AI assistance is documented in [`docs/AI-LOG.md`](docs/AI-LOG.md): the prompts, what the AI
produced, how each output was checked, and what was changed afterwards.
