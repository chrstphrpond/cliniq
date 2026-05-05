import type { Route } from "next";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "var(--spacing-12)" }}>
      <h1 style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display)" }}>cliniq</h1>
      <p style={{ marginTop: "var(--spacing-4)", color: "var(--color-text-muted)" }}>
        Marketing landing lives in a later plan. See the{" "}
        <Link href={"/design-system" as Route} style={{ color: "var(--color-sage-deep)" }}>
          design system showcase
        </Link>
        .
      </p>
    </main>
  );
}
