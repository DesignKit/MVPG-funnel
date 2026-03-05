const FAQ_ITEMS = [
  {
    question: "What services does MVP Gurus provide?",
    answer:
      "We provide end-to-end MVP development — from requirements gathering and UX design to full-stack development and deployment. We turn your idea into a launch-ready product in just 5 days.",
  },
  {
    question: "Who is MVP Gurus best suited for?",
    answer:
      "We work with startup founders, entrepreneurs, and businesses who want to validate an idea quickly without spending months and tens of thousands on traditional development.",
  },
  {
    question: "How long does it take to develop an MVP?",
    answer:
      "Most MVPs are delivered within 5 working days. Complex projects may take up to 10 days. We'll give you a clear timeline during the requirements call.",
  },
  {
    question: "How does the collaboration process work?",
    answer:
      "It starts with a 60-90 minute requirements call, then we handle design and development while keeping you updated. You'll have real users on your product within days.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing depends on the scope and complexity of your MVP. We offer three workshop tiers, and the Comprehensive Workshop fee is deducted from the MVP build cost if you proceed.",
  },
];

export function FaqAccordion() {
  return (
    <div className="flex flex-col gap-4">
      {FAQ_ITEMS.map((item) => (
        <details
          key={item.question}
          className="group rounded-card border border-border bg-white p-6"
        >
          <summary className="flex cursor-pointer items-center justify-between font-medium">
            {item.question}
            <span className="ml-4 text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-secondary">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
