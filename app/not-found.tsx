import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-inter-tight text-6xl font-semibold">404</h1>
        <p className="mt-4 text-muted-secondary">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-pill bg-black px-8 py-3 text-white shadow-button"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
