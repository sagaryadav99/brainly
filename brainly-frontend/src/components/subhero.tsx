import { BrainIconAnimated } from "../icons/brainIconAnimated";
import FlowIcon from "../icons/flowicon";
import IdeaIcon from "../icons/ideaicon";
import KnowIcon from "../icons/knowGraphicon";
import { SubheroCard } from "./subherocard";

export function SubHero() {
  return (
    <div className="max-w-[95%] text-4xl font-hero text-bold text-center flex flex-col mx-auto">
      <div className="text-4xl font-hero font-medium text-center">
        Your AI That Turns Links Into Knowledge
      </div>
      <div className="flex justify-center items-center mt-3 gap-4">
        <div className="p-4 flex flex-col max-w-[50%] divide-y-1 gap-2 divide-neutral-800 ">
          <SubheroCard
            icon={<IdeaIcon />}
            heading="Your Knowledge, deserves clarity."
            subheading="Mindraw turns videos, tweets and notes into clean, powerful summaries so you understand more in less time."
          />
          <SubheroCard
            icon={<KnowIcon />}
            heading="Your thinking should be amplified."
            subheading="Ask a question and Mindraw scans your entire knowledge base, finds what matters most, and answers using Groq AI."
          />
          <SubheroCard
            icon={<FlowIcon />}
            heading="Your ideas should work together."
            subheading="Every link you save, every video you watch, every thought you capture becomes part of a connected second brain that grows with you."
          />
        </div>
        <div className="px-12 py-8 rounded-4xl hover:scale-110 cursor-pointer transition-all duration-500 min-w-[25%] min-h-[100%]">
          <BrainIconAnimated size={"size-70"} />
        </div>
      </div>
    </div>
  );
}
