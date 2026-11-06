import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = { title: "Privacy & terms" };

const UPDATED = "November 6, 2026";

export default function Privacy() {
  return (
    <main>
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 pb-10 pt-10">
        <h1 className="font-display text-5xl font-semibold tracking-tight">Privacy &amp; terms</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {UPDATED}</p>

        <div className="mt-12 space-y-10 leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground">
          <section>
            <h2>The short version</h2>
            <p>
              ResourceWise has no accounts, no ads and no server of its own. Everything you enter stays in the app on your device.
              The only thing that leaves the device is basic usage information described below.
            </p>
          </section>

          <section>
            <h2>What stays on your device</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Schools, supply listings, needs, claims and handoff records.</li>
              <li>
                Photos you attach to a listing. The app asks for access to your photo library, and only the photos you pick are
                copied into the app’s own storage on the device. ResourceWise does not use the camera.
              </li>
            </ul>
            <p className="mt-3">This data is not uploaded or shared. Deleting the app deletes it.</p>
          </section>

          <section>
            <h2>Usage analytics</h2>
            <p>
              The app sends usage events, such as which screens are opened, to Newly, the platform the app is built on, so its
              developer can see how the app is used and keep it working. Like any internet request, this reveals your device’s IP
              address to Newly’s servers. These events do not include your listings, needs, photos or school details, and they
              are not used for advertising or sold.
            </p>
          </section>

          <section>
            <h2>Children</h2>
            <p>ResourceWise is meant for school staff who manage supplies. It is not directed at children.</p>
          </section>

          <section>
            <h2>Terms of use</h2>
            <p>
              ResourceWise is provided as is, to help schools coordinate supplies among themselves. Schools are responsible for
              what they list and for arranging each handoff. Don’t list items you don’t have the right to give away. The app is
              free and has no purchases or subscriptions.
            </p>
          </section>

          <section>
            <h2>Changes and questions</h2>
            <p>
              If this policy changes, the date above changes with it. Questions are welcome through the{" "}
              <a href="/support" className="text-primary underline underline-offset-4">
                support page
              </a>
              .
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
