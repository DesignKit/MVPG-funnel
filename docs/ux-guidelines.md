# UX Guidelines

Reference this file when building or modifying UI components and pages.

## Accessibility (WCAG 2.1 AA)

- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (18px+ bold or 24px+). Test against our surfaces (`#f6f3fe`, `#fff3ef`, `#f6f7f9`).
- **Focus states**: Every interactive element must have a visible focus ring. Use `ring-ring` (maps to `#9563ff`).
- **Alt text**: All images need descriptive alt text. Decorative images use `alt=""`.
- **Keyboard navigation**: All flows must be completable via keyboard alone. Tab order must follow visual order.
- **ARIA labels**: Icon-only buttons need `aria-label`. Form inputs need associated `<label>` elements.
- **Error announcements**: Form errors should use `aria-live="polite"` or `role="alert"` so screen readers announce them.

## Touch & Interaction

- **Minimum touch target**: 44x44px for all interactive elements (buttons, links, form controls).
- **Loading states**: Every async action (form submit, API call, navigation) must show a loading indicator. Never leave the user wondering if their click registered.
- **Error feedback**: Show inline errors next to the field that caused them, not just a toast. Use `text-destructive` for error text.
- **Success feedback**: Confirm successful actions visually (checkmark, success message, or navigation).
- **Disabled states**: Use `disabled:opacity-40` and `cursor-not-allowed`. Never silently ignore clicks.

## Forms

- **Labels above inputs**: Always use visible labels, not just placeholders (placeholders disappear on focus).
- **Validation timing**: Validate on blur for individual fields, on submit for the full form.
- **Required fields**: Mark required fields. Don't mark optional fields — assume required by default.
- **Autofocus**: Set autofocus on the first input of single-purpose forms (OTP, search). Don't autofocus on multi-section pages.

## Layout & Spacing

- **Content width**: Max `max-w-2xl` (672px) for text-heavy content. Max `max-w-5xl` for dashboards/tables.
- **Section spacing**: Use `py-16` between major page sections. Use `py-12` for tighter sections.
- **Card spacing**: Use `p-6` for card padding. Use `gap-6` between cards in a grid.
- **Responsive**: Mobile-first. Stack columns on mobile, expand to grid on `tablet:` (810px+).

## Typography

- **Headings**: Use `font-inter-tight` + `font-semibold`. Scale: `text-3xl` mobile → `tablet:text-4xl` → `desktop:text-5xl`.
- **Body**: Use `font-inter` (inherited from body). Default size is `text-base` (16px).
- **Small text**: Use `text-sm` (14px) for supporting text, metadata, labels.
- **Muted text**: Use `text-muted-secondary` (#696969) for secondary information.
- **Section labels**: Uppercase, tracking-widest, `text-sm`, `text-accent-purple` for section category labels.

## Animation

- **Scroll-triggered**: Use `.animate-title-entrance`, `.animate-spring-pop`, `.animate-rise-up` for scroll-linked reveals.
- **Hero entrances**: Use `.hero-animate-title`, `.hero-animate-pop`, `.hero-animate-rise` for one-shot page load animations.
- **Reduced motion**: All animations must be disabled when `prefers-reduced-motion: reduce` is active (already handled in `globals.css`).
- **Transition timing**: Use `transition-opacity` or `transition-shadow` for hover effects. Keep durations under 300ms for UI feedback.

## Component Conventions

- **Buttons**: Use the `Button` component with CVA variants (`orange`, `dark`, `outline`). Don't create raw `<button>` elements with inline styles.
- **shadcn/ui**: Use shadcn components for admin/dashboard pages (Table, Card, Dialog, Badge, Tabs, etc.). Customize via your `@theme` tokens.
- **Magic UI**: Use for animated elements (NumberTicker for stats, BlurFade for reveals, AnimatedList for feeds).
- **Icons**: Use `lucide-react`. Standard size is `h-4 w-4` inline, `h-5 w-5` for standalone.
