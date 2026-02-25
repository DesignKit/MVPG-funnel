const CARD_BG = [
  "bg-surface-purple",       // #fef2ff — pink/purple (Homely Place)
  "bg-surface-warm",         // #fff3ef — peach (Med Clear)
  "bg-surface-light-purple", // #f6f3fe — lavender (Method Loop)
];

export interface CaseStudyData {
  title: string;
  description: string;
  vimeoId: string;
  href: string;
  deliveryTime?: string;
  index?: number;
}

export function CaseStudyCard({
  title,
  description,
  vimeoId,
  href,
  deliveryTime,
  index = 0,
}: CaseStudyData) {
  const bg = CARD_BG[index % CARD_BG.length];
  const reversed = index % 2 !== 0;

  return (
    <div className={`overflow-hidden rounded-card ${bg} shadow-lg`}>
      <div
        className={`flex flex-col gap-8 p-6 tablet:items-center tablet:p-10 ${
          reversed ? "tablet:flex-row-reverse" : "tablet:flex-row"
        }`}
      >
        {/* Text content */}
        <div className="flex flex-1 flex-col gap-4">
          {deliveryTime && (
            <span className="w-fit rounded-pill border border-border bg-white px-4 py-1.5 text-xs font-medium text-muted">
              Delivered in {deliveryTime}
            </span>
          )}
          <h3 className="font-inter-tight text-2xl font-semibold">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-secondary">
            {description}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 inline-flex w-fit items-center gap-2 rounded-pill border border-accent-pink/40 px-8 py-3 font-medium text-foreground transition-colors hover:bg-white/60"
          >
            View Our Work
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Vimeo video */}
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-[25px]">
            <div className="relative w-full" style={{ paddingTop: "52.29%" }}>
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?autopause=0&app_id=122963`}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title={title}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
