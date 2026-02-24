export default function LandingPage() {
  return (
    <main>
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-inter-tight text-5xl font-semibold italic">
            MVP Gurus
          </h1>
          <p className="mt-4 text-muted-secondary">
            Give Us 5 Days And We&apos;ll Deliver Your Launch-Ready MVP Or You
            Don&apos;t Pay!
          </p>
          <a
            href="/chat-room"
            className="mt-8 inline-block rounded-pill bg-black px-8 py-3 text-white shadow-button"
          >
            Get Started
          </a>
        </div>
      </section>
    </main>
  );
}
