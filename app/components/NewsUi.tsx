import Link from "next/link";
import type { ReactNode } from "react";
import type { NewsItem } from "../data/news";

export const newsTypeClasses = {
  Publication: "border-sky-200 bg-sky-50 text-sky-800",
  Tool: "border-teal-200 bg-teal-50 text-teal-800",
  Conference: "border-amber-200 bg-amber-50 text-amber-800",
  Seminar: "border-rose-200 bg-rose-50 text-rose-800",
  "Group update": "border-stone-200 bg-stone-50 text-neutral-700",
};

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export function NewsLink({ href, children, className }: { href: string; children: ReactNode; className: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function NewsMeta({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full border font-semibold ${compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} ${newsTypeClasses[item.type]}`}>
        {item.type}
      </span>
      <time className="text-xs font-semibold text-neutral-500" dateTime={item.date}>
        {item.dateLabel || formatNewsDate(item.date)}
      </time>
    </div>
  );
}
