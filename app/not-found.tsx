import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <Image
        src="/images/404-illustration.png"
        alt="404"
        width={280}
        height={261}
        className="mb-6"
        priority
      />
      <h1 className="font-inter-tight text-4xl font-semibold italic md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-muted-secondary">
        Sorry about that — the link may be broken or the page might have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-pill bg-gradient-to-r from-primary to-[#FFB853] px-8 py-3 font-medium text-white shadow-button"
      >
        Go to Homepage
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1l14 14M15 1v14H1" />
        </svg>
      </Link>
    </main>
  );
}
