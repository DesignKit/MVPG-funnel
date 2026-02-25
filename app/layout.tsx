import type { Metadata } from "next";
import { geist, inter, interTight } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVP Gurus – Rapid MVP Software Development",
  description:
    "Give us 5 days and we'll deliver your launch-ready MVP or you don't pay. AI may get you started but we're here for step 2 and beyond.",
  openGraph: {
    title: "MVP Gurus – Rapid MVP Software Development",
    description:
      "Give us 5 days and we'll deliver your launch-ready MVP or you don't pay.",
    siteName: "MVP Gurus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${interTight.variable}`}
    >
      <body>
        <SmoothScroll>
          <Navbar />
          <main className="pt-[72px]">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
