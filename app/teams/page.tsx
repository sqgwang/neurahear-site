import Link from "next/link";
import Image from "next/image";
import { members, slugify, initials } from "@/data/team";
import { createPageMetadata } from "../data/site";

export const metadata = createPageMetadata({
  title: "Team",
  description: "Researchers and collaborators advancing hearing science, AI-enabled hearing care, and digital audiology at HK Audiology Group.",
  path: "/teams/",
});

export default function TeamsPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <div className="eyebrow">People</div>
        <h1>Our Team</h1>
        <p className="mt-5 text-lg text-neutral-700">Researchers and collaborators advancing hearing science and digital audiology.</p>
      </section>

      <ul className="grid grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
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
                <Link href={`/teams/${slugify(member.name)}`} className="card group block h-full p-4 text-center no-underline">
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
