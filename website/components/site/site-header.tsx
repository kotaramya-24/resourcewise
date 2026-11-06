import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app-icon.png" alt="" width={36} height={36} className="rounded-lg shadow-lg shadow-black/30" />
        <span className="font-display text-xl font-semibold tracking-tight">ResourceWise</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm text-muted-foreground">
        <Link href="/#how" className="hidden transition-colors hover:text-foreground sm:inline">
          How it works
        </Link>
        <Link href="/support" className="transition-colors hover:text-foreground">
          Support
        </Link>
        <Link href="/privacy" className="transition-colors hover:text-foreground">
          Privacy
        </Link>
      </nav>
    </header>
  );
}
