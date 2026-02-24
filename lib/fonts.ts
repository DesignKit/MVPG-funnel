import { Geist, Inter, Inter_Tight } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "900"],
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
  display: "swap",
});
