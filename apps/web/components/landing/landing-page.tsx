import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingDiscoverVietnam } from "@/components/landing/landing-discover-vietnam";
import { LandingEditorialFeatures } from "@/components/landing/landing-editorial-features";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper-50 text-ink-950">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingDiscoverVietnam />
        <LandingEditorialFeatures />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
