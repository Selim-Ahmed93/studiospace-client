import Link from "next/link";

export default function LegalPage({ eyebrow, title, updated, sections }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {section.heading}
            </h2>

            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-7 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
        Questions about this page?{" "}
        <a
          href="mailto:mdselimahmed6467@gmail.com"
          className="font-medium text-primary hover:underline"
        >
          Contact StudioSpace
        </a>{" "}
        or review our{" "}
        <Link href="/privacy" className="font-medium text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </div>
    </main>
  );
}
