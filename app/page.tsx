import {
  ArrowRight,
  BarChart3,
  CreditCard,
  LayoutGrid,
  Package,
  Receipt,
  ShoppingBag,
  Store,
  TabletSmartphone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: TabletSmartphone,
    title: "Self-service ordering",
    description:
      "A touch-first menu customers can browse and order from on their own, without waiting in line.",
  },
  {
    icon: LayoutGrid,
    title: "Menu and categories",
    description:
      "Organize items into categories with photos, prices, and options that are easy to scan.",
  },
  {
    icon: ShoppingBag,
    title: "Cart and checkout",
    description:
      "Add, remove, and adjust quantities, with totals that update as the order changes.",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    description:
      "Take payment at the kiosk or send the order to the counter to be settled.",
  },
  {
    icon: Receipt,
    title: "Order numbers and receipts",
    description:
      "Every order gets a number and a receipt so staff and customers stay in sync.",
  },
  {
    icon: BarChart3,
    title: "Sales overview",
    description:
      "See what sold and when, so the next shift starts with the full picture.",
  },
];

const steps = [
  {
    title: "Browse the menu",
    description: "Pick a category and tap the items you want.",
  },
  {
    title: "Review your order",
    description: "Check quantities and the total before you confirm.",
  },
  {
    title: "Pay and collect",
    description: "Pay, take your order number, and wait for it to be called.",
  },
];

const sampleOrder = [
  { name: "Chicken Sandwich", quantity: 1, price: 149 },
  { name: "Iced Coffee", quantity: 2, price: 180 },
  { name: "Fries", quantity: 1, price: 65 },
];

const sampleTotal = sampleOrder.reduce((sum, item) => sum + item.price, 0);

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="size-4" />
            </span>
            POS Kiosk
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
          </nav>
          <a href="#how-it-works" className={buttonVariants()}>
            Get started
          </a>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary">IT415 Project</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Ordering and checkout, on one screen.
            </h1>
            <p className="max-w-md text-lg text-pretty text-muted-foreground">
              A point-of-sale kiosk that lets customers order for themselves
              and gives staff a clear view of every sale.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#how-it-works"
                className={cn(buttonVariants({ size: "lg" }), "px-4")}
              >
                See how it works
                <ArrowRight />
              </a>
              <a
                href="#features"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "px-4",
                )}
              >
                Explore features
              </a>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-4" />
                Your order
              </CardTitle>
              <CardDescription>Sample preview</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3 text-sm">
                {sampleOrder.map((item) => (
                  <li key={item.name} className="flex justify-between gap-4">
                    <span>
                      <span className="text-muted-foreground">
                        {item.quantity}×
                      </span>{" "}
                      {item.name}
                    </span>
                    <span className="tabular-nums">₱{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t pt-4 font-medium">
                <span>Total</span>
                <span className="tabular-nums">₱{sampleTotal}</span>
              </div>
              <div
                aria-hidden
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Place order
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="features" className="scroll-mt-14 border-t bg-muted/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Everything a counter needs
              </h2>
              <p className="mt-3 text-muted-foreground">
                From the first tap on the menu to the end-of-day sales summary.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardHeader>
                    <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="size-4" />
                    </span>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-14 border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <h2 className="text-3xl font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="flex flex-col gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>POS Kiosk</span>
          <span>IT415 Project</span>
        </div>
      </footer>
    </div>
  );
}
