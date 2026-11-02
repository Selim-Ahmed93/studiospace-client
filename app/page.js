import CategoryGrid from "@/components/home/category-grid";
import FeaturedStudios from "@/components/home/featured-studios";
import Hero from "@/components/home/hero";
import HostCta from "@/components/home/host-cta";
import HowItWorks from "@/components/home/how-it-works";
import WhyStudioSpace from "@/components/home/why-studiospace";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <FeaturedStudios />
      <HowItWorks />
      <WhyStudioSpace />
      <HostCta />
    </main>
  );
}
