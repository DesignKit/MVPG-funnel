import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";

export interface TestimonialData {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export function TestimonialCard({ quote, name, role, image }: TestimonialData) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-card bg-white p-8 text-center shadow-card">
      <StarRating />
      <p className="font-geist text-base leading-relaxed text-muted-secondary">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex flex-col items-center gap-3">
        <Image
          src={image}
          alt={name}
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-geist text-sm font-medium text-foreground">
            {name}
          </p>
          <p className="font-geist text-sm text-muted-secondary">{role}</p>
        </div>
      </div>
    </div>
  );
}
