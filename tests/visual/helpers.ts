export const FRAMER_BASE_URL = "https://mvpgurus.framer.website";

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 810, height: 1080 },
  mobile: { width: 390, height: 844 },
} as const;

export const PAGES = [
  { name: "landing", path: "/" },
  { name: "chat-room", path: "/chat-room" },
  { name: "register", path: "/register" },
  { name: "schedule", path: "/schedule" },
  { name: "project-outline", path: "/project-outline-2" },
  { name: "booked", path: "/booked" },
  { name: "404", path: "/404" },
] as const;
