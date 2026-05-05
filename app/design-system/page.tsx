import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type AppointmentStatus, StatusPill } from "@/components/ui/status-pill";
import { Wordmark } from "@/components/ui/wordmark";

const statuses: AppointmentStatus[] = [
  "registered",
  "doing",
  "finished",
  "waiting_payment",
  "cancelled",
];

const swatches = [
  ["bg", "var(--color-bg)"],
  ["bg-muted", "var(--color-bg-muted)"],
  ["surface", "var(--color-surface)"],
  ["sage", "var(--color-sage)"],
  ["sage-deep", "var(--color-sage-deep)"],
  ["sage-soft", "var(--color-sage-soft)"],
  ["success", "var(--color-success)"],
  ["warning", "var(--color-warning)"],
  ["danger", "var(--color-danger)"],
  ["info", "var(--color-info)"],
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-[1280px] p-12 space-y-12">
      <header className="flex items-center justify-between">
        <Wordmark size="lg" />
        <ThemeToggle />
      </header>

      <Card>
        <CardHeader>Color tokens</CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {swatches.map(([name, value]) => (
              <div key={name} className="flex flex-col gap-2">
                <div
                  className="h-16 rounded-[var(--radius)] border border-[var(--color-border)]"
                  style={{ background: value }}
                />
                <div className="text-[var(--text-2xs)] font-mono text-[var(--color-text-muted)]">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Typography</CardHeader>
        <CardContent className="space-y-3">
          <div style={{ fontSize: "var(--text-4xl)", lineHeight: "var(--leading-display)" }}>
            Display 4xl
          </div>
          <div style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display)" }}>
            Display 2xl
          </div>
          <div style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-body)" }}>
            Body — calm, precise, quietly confident.
          </div>
          <div className="font-mono text-[var(--text-sm)]">Mono 09:30 — INV-00421 — $1,240.00</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Buttons</CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="solid" size="sm">
            Solid sm
          </Button>
          <Button variant="solid">Solid md</Button>
          <Button variant="solid" size="lg">
            Solid lg
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Input</CardHeader>
        <CardContent className="max-w-sm">
          <Input placeholder="Search patients" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Status pills</CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <StatusPill key={s} status={s} />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
