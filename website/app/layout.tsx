import type { Metadata } from "next";

import { pairFor } from "@/lib/fonts";
import { SITE } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pairFor("expressive")} dark`}>
      <body className="chalkboard min-h-screen font-body antialiased">{children}</body>
    </html>
  );
}
