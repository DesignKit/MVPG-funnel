import { cn } from "@/lib/utils";

export function PhoneFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[375px] rounded-[40px] border-[8px] border-black bg-white p-2 shadow-card",
        className
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />
      {/* Screen content */}
      <div className="overflow-hidden rounded-[32px] bg-white">{children}</div>
    </div>
  );
}
