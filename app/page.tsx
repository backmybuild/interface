import { HowItWorks } from "@components/howitworks";
import { Hero } from "@components/hero";
import { OurStory } from "@components/story";
import { Footer } from "@components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <OurStory />
      <HowItWorks />
      <Footer />
    </div>
  );
}
