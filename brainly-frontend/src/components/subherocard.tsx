export function SubheroCard({
  icon,
  heading,
  subheading,
}: {
  icon: React.ReactNode;
  heading: string;
  subheading: string;
}) {
  return (
    <div className="px-4 py-2 max-h-[25%] max-w-full text-left">
      <div>{icon}</div>
      <div className="text-2xl text-neutral-300 tracking-tight font-medium">
        {heading}
      </div>
      <div className="text-lg text-neutral-400 leading-6 font-medium">
        {subheading}
      </div>
    </div>
  );
}
