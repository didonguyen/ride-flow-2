import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingTopDestinations } from "@/components/landing/landing-top-destinations";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-slate-950">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingTopDestinations />
        <LandingFeatures />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
