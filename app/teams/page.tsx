import Link from "next/link";
import Image from "next/image";
import { members, slugify, initials } from "@/data/team";
import { createPageMetadata, siteConfig } from "../data/site";

export const metadata = createPageMetadata({
  title: "Team",
  description: "Researchers and collaborators advancing hearing science, AI-enabled hearing care, and digital audiology at HK Audiology Group.",
  path: "/teams/",
});

const identitySignals = [
  "Scholar-linked publication record",
  "Digital assessment and PROM development",
  "AI-enabled hearing-care research focus",
] as const;

export default function TeamsPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
        <div className="max-w-3xl">
          <div className="eyebrow">People</div>
          <h1>Our Team</h1>
          <p className="mt-5 text-lg text-neutral-700">
            Researchers and collaborators advancing hearing science, AI-enabled hearing care, and digital audiology.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Research identity</p>
          <p className="mt-3 text-sm text-neutral-700">
            The platform is maintained as a research-facing site. Publication records, tool status labels, and contact routes are kept visible for traceability.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {identitySignals.map((signal) => (
              <span key={signal} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                {signal}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ul className="grid grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const hasDirectContact = Boolean(member.email);
          const content = (
            <>
              {member.photo ? (
                <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-stone-100">
                  <Image
                    src={`/images/teams/${member.photo}`}
                    alt={`${member.name} photo`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-lg bg-neutral-950 text-4xl font-semibold text-white">
                  {initials(member.name)}
                </div>
              )}
              <h3 className="text-xl transition-colors group-hover:text-brand-primary">{member.name}</h3>
              {member.title && <div className="mt-2 text-sm font-medium text-neutral-600">{member.title}</div>}
              {member.affiliation && <div className="mt-1 text-sm text-neutral-500">{member.affiliation}</div>}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {member.googleScholar ? (
                  <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">Scholar profile</span>
                ) : null}
                {hasDirectContact ? (
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">Direct contact</span>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={member.name} className="list-none">
              {member.externalLink ? (
                <a
                  href={member.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group block h-full p-4 text-center no-underline"
                >
                  {content}
                </a>
              ) : (
                <Link href={`/teams/${slugify(member.name)}/`} className="card group block h-full p-4 text-center no-underline">
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <p className="kicker">Platform responsibility</p>
          <h2 className="mt-3 text-2xl">Tools should stay connected to the people and publications behind them.</h2>
          <p className="mt-4 text-sm text-neutral-700">
            NeuraHear is growing as a digital hearing assessment platform, so each public tool needs clear ownership, validation status, data boundaries,
            and a route for research enquiries.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Contact</p>
          <p className="mt-3 text-sm text-neutral-700">
            For collaboration or study workflow questions, contact the group at {siteConfig.email}.
          </p>
          <Link href="/contact/" className="btn-secondary mt-5">
            Contact page
          </Link>
        </div>
      </section>
    </div>
  );
}
