import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarClock, MessageCircle, Target, Wallet } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/whatsapp")({
  head: () =>
    buildSeoHead({
      title: "WhatsApp Study Guidance - SA Learn",
      description:
        "Start SA Learn learner flows from WhatsApp with prepared messages for courses, funding, deadlines and study-path guidance.",
      path: "/whatsapp",
    }),
  component: WhatsAppPage,
});

const WHATSAPP_FLOWS = [
  {
    title: "Check my options",
    description: "Send your subjects, marks and interest so the match flow has useful context.",
    icon: Target,
    text: "Hi SA Learn, I want to check what I qualify for. My subjects and marks are:",
    to: "/match",
  },
  {
    title: "Find funding",
    description: "Start with NSFAS or bursary questions before comparing public funding paths.",
    icon: Wallet,
    text: "Hi SA Learn, I need help understanding funding options. I want to study:",
    to: "/funding",
  },
  {
    title: "Track deadlines",
    description: "Prepare a reminder request for applications, bursaries or learnerships.",
    icon: CalendarClock,
    text: "Hi SA Learn, please help me track an application or funding deadline for:",
    to: "/opportunities",
  },
  {
    title: "Search courses",
    description: "Ask for courses by city, NQF level, cost range or delivery mode.",
    icon: BookOpen,
    text: "Hi SA Learn, I am looking for courses in this field, city or delivery mode:",
    to: "/courses",
  },
] as const;

function whatsappUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// Codex: WhatsApp core-flow entry
// Status: Public WhatsApp compose links are live; automated conversational bot remains backend/platform work.
function WhatsAppPage() {
  return (
    <PageShell
      eyebrow="Mobile-first help"
      title="Start from WhatsApp"
      description="Use WhatsApp to prepare the question, then continue in SA Learn for verified details and safer comparisons."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {WHATSAPP_FLOWS.map(({ title, description, icon: Icon, text, to }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsappUrl(text)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp
              </a>
              <Link
                to={to}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-muted"
              >
                Continue here <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          What this does today
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          These links open WhatsApp with a prepared learner message. SA Learn does not collect chat
          history here, and the official site remains the place to confirm requirements, deadlines
          and funding rules.
        </p>
      </section>
    </PageShell>
  );
}
