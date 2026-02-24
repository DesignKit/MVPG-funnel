import Image from "next/image";

export interface CaseStudyData {
  title: string;
  description: string;
  image: string;
  href: string;
  deliveryTime?: string;
}

export function CaseStudyCard({
  title,
  description,
  image,
  href,
  deliveryTime,
}: CaseStudyData) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {deliveryTime && (
          <span className="absolute right-3 top-3 rounded-pill bg-black/80 px-3 py-1 text-xs text-white">
            {deliveryTime}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="font-inter-tight text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-secondary">{description}</p>
      </div>
    </a>
  );
}
