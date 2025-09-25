import { Header } from "@components/header";
import { HeroSection } from "@components/hero";
import { FeaturesSection } from "@components/features";
import { CTASection } from "@components/cta";
import { Footer } from "@components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}