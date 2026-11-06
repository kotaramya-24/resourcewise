import Link from "next/link";

import { NewlyAttribution } from "@/components/ui/newly-attribution";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-foreground">ResourceWise</span> · a supply exchange for schools
        </p>
        <div className="flex items-center gap-6">
          <Link href="/support" className="hover:text-foreground">
            Support
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy &amp; terms
          </Link>
          <NewlyAttribution />
        </div>
      </div>
    </footer>
  );
}
