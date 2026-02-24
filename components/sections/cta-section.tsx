import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-surface-warm py-20">
      <Container className="text-center">
        <h2 className="font-inter-tight text-4xl font-semibold">
          Ready to Build Your MVP?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-secondary">
          Join 1,000+ founders who launched their MVP in just 5 days.
        </p>
        <Button href="/register" variant="primary" size="lg" className="mt-8">
          Get Started Today
        </Button>
      </Container>
    </section>
  );
}
