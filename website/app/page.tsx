import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const STEPS = [
  {
    n: "1",
    title: "List what you have spare",
    body: "Add an item with a photo, a category, a quantity and its condition. Before it goes live, a confirmation step blocks a missing photo, a quantity below one or a category outside Paper & Writing, Books & Learning and STEM & Tech. It also flags anything that looks like a duplicate.",
    color: "text-primary",
  },
  {
    n: "2",
    title: "Post what you need",
    body: "A school posts a need with the category, how many it wants and the lowest condition it will accept. ResourceWise suggests the best confirmed item from a different school that meets every rule, and never forces a match. If nothing fits, the need says “No match” and explains why: too few left, condition too low, or nothing in that category.",
    color: "text-accent",
  },
  {
    n: "3",
    title: "Hand it over, verified twice",
    body: "Claiming an item holds that stock so two schools can’t take the same box. After approval, each school confirms its side of the handoff. Only when both have verified does the quantity drop, and a listing turns “transferred” when the last unit is gone. A school can’t claim its own listing or more than is available.",
    color: "text-foreground",
  },
];

const DASHBOARD = [
  ["Inventory accuracy", "Items passing every check, out of all items."],
  ["Confirmed vs submitted", "How much of the inventory is ready to share."],
  ["Matched vs unmatched", "Which open needs have a supply waiting."],
  ["Surplus vs need", "Units on offer against units wanted, per category."],
  ["Data quality", "Every item missing a photo or flagged as a duplicate."],
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
        <div className="rise">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-primary">A supply exchange for schools</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            One school’s spare box is another’s <span className="chalk-underline italic">whole term</span>.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ResourceWise lets a group of schools list surplus supplies, post what they’re short of, and pass items along, with
            both schools signing off on every handoff.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#how"
              className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5"
            >
              See how it works
            </a>
            <a href="/support" className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary">
              Get help
            </a>
          </div>
        </div>

        <div className="rise relative mx-auto w-full max-w-sm [animation-delay:150ms]">
          <div className="absolute -inset-6 -rotate-3 rounded-[2rem] bg-accent/15 blur-2xl" aria-hidden />
          <div className="relative rotate-2 rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app-icon.png" alt="ResourceWise app icon" width={56} height={56} className="rounded-2xl" />
              <div>
                <p className="font-display text-lg font-semibold">Copy paper, A4</p>
                <p className="text-sm text-muted-foreground">Paper &amp; Writing · Good</p>
              </div>
            </div>
            <div className="ruled mt-6 space-y-3 rounded-xl bg-background/60 p-4 font-mono text-sm leading-8">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Claimed</span>
                <span>2 reams</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Giving school</span>
                <span className="text-primary">✓ verified</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Receiving school</span>
                <span className="text-primary">✓ verified</span>
              </p>
            </div>
            <p className="mt-5 rounded-full bg-accent/20 px-4 py-2 text-center text-sm font-semibold text-accent">Transferred</p>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">An illustration of a completed handoff</p>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-10 px-6 py-16">
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">How it works</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 md:grid-cols-3">
          {STEPS.map((s) => (
            <article key={s.n} className="bg-card/80 p-8">
              <p className={`font-display text-6xl font-semibold italic ${s.color}`}>{s.n}</p>
              <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Dashboard</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">Know your inventory is right before you share it.</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            One screen shows how healthy the exchange is and what to fix first.
          </p>
        </div>
        <ul className="divide-y divide-border/60 border-y border-border/60">
          {DASHBOARD.map(([title, body]) => (
            <li key={title} className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <span className="font-display text-xl font-semibold">{title}</span>
              <span className="text-muted-foreground">{body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-dashed border-border p-10 text-center sm:p-14">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Your data stays on the device.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            No accounts, no ads. Listings, needs, claims and photos are stored in the app on the phone or tablet that uses it.
          </p>
          <a href="/privacy" className="mt-6 inline-block font-semibold text-primary underline-offset-4 hover:underline">
            Read the privacy policy
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
