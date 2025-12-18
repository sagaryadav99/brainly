import { Hero } from "../components/hero";
import { Navbar } from "../components/navbar";
import { SubHero } from "../components/subhero";

export function Landing() {
  return (
    <div className="min-h-screen bg-background w-full text-gray-300 justify-center relative selection:bg-neutral-200 selection:text-black pb-10">
      <Navbar />
      <Hero />
      <SubHero />
    </div>
  );
}
