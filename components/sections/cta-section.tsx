import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-white py-20">
      <Container className="text-center">
        <h2 className="font-inter-tight text-4xl font-semibold">
          Let&apos;s Build Your Startup In The Next 5 Days!
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-secondary">
          Complete the form below to book a consultation and discover how we can
          help elevate and scale your business.
        </p>
        <Button href="/register" variant="primary" size="lg" className="mt-8">
          Get Started Today
        </Button>
      </Container>
    </section>
  );
}
