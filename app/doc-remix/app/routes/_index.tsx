import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQSection } from "@/components/FAQSection";

export const meta: MetaFunction = () => {
  return withPageMeta("/", [
    { title: "Uplofile — Composable React File Upload UI Primitives" },
    {
      name: "description",
      content:
        "Composable file upload components for React. Accessible UI primitives that are easy to integrate and style.",
    },
  ]);
};

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Uplofile",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Composable file upload components for React. Accessible UI primitives that are easy to integrate and style.",
  url: "https://uplofile.kristofajosh.dev/",
  programmingLanguage: "TypeScript",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <PhilosophySection />
        <FeaturesSection />
        <FAQSection />
      </main>
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Composable file upload for React</p>
        </div>
      </footer>
    </div>
  );
}
