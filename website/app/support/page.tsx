import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Support" };

const FAQ = [
  [
    "Why won’t my item confirm?",
    "Every item needs a photo, a quantity of at least one, and one of the three categories: Paper & Writing, Books & Learning or STEM & Tech. The confirmation screen names what is missing. If it warns about a possible duplicate, check the existing listing before confirming.",
  ],
  [
    "Why does my need say “No match”?",
    "A match has to be a confirmed item from a different school, in the same category, with enough units left and at least the condition you asked for. The reason under “No match” tells you which rule nothing met. ResourceWise never suggests an item that breaks one.",
  ],
  [
    "Why hasn’t the quantity gone down after a claim?",
    "A claim holds the units so nobody else can take them, but the listing’s quantity only drops once both schools have verified the handoff on the My school tab.",
  ],
  [
    "Can I claim my own school’s item?",
    "No. A school can’t claim its own listing, and a claim can’t be larger than what is still available.",
  ],
  [
    "Where is my data?",
    "On your device. There are no accounts, so nothing syncs between phones. See the privacy policy for details.",
  ],
];

export default function Support() {
  return (
    <main>
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 pb-10 pt-10">
        <h1 className="font-display text-5xl font-semibold tracking-tight">Support</h1>
        <p className="mt-4 text-lg text-muted-foreground">Answers to the questions schools ask most.</p>

        {SITE.supportEmail ? (
          <div className="mt-10 rounded-2xl border border-border bg-card/80 p-6">
            <p className="font-display text-xl font-semibold">Still stuck?</p>
            <p className="mt-2 text-muted-foreground">
              Email{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-primary underline underline-offset-4">
                {SITE.supportEmail}
              </a>{" "}
              and we’ll get back to you.
            </p>
          </div>
        ) : null}

        <dl className="mt-12 divide-y divide-border/60 border-y border-border/60">
          {FAQ.map(([q, a]) => (
            <div key={q} className="py-6">
              <dt className="font-display text-xl font-semibold">{q}</dt>
              <dd className="mt-2 leading-relaxed text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </article>
      <SiteFooter />
    </main>
  );
}
