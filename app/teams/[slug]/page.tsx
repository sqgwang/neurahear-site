import React from 'react'
import Link from 'next/link'
import { members, slugify, Member } from '@/data/team'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  const params = members.map((m) => ({ slug: m.slug ?? slugify(m.name) }))
  // server-side debug
  try {
    // eslint-disable-next-line no-console
    console.log('generateStaticParams ->', params)
  } catch (e) {}
  return params
}

function renderLink(url?: string, label?: string) {
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      {label ?? url}
    </a>
  )
}

export default async function MemberPage({ params }: Props) {
  // params is an async object in this Next.js route; unwrap it first
  const resolvedParams = await params
  try {
    // eslint-disable-next-line no-console
    console.log('MemberPage params ->', resolvedParams)
  } catch (e) {}
  // Normalize slugs to handle different dash characters (hyphen, en-dash, em-dash)
  const normalizeSlug = (s?: string) =>
    (s || '')
      .toLowerCase()
      .replace(/[–—−‒−]/g, '-') // replace various dash characters with ASCII hyphen
      .replace(/[^a-z0-9\-]/g, '')

  const requestedRaw = (resolvedParams.slug as string) ?? ''
  const requested = normalizeSlug(requestedRaw)

  const member: Member | undefined = members.find((m) => normalizeSlug(m.slug ?? slugify(m.name)) === requested)

  if (!member) {
    // Debug helper: show requested slug and available slugs/links to assist troubleshooting
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Member not found</h1>
        <div className="mb-2">Requested raw slug: <code>{requestedRaw}</code></div>
        <div className="mb-4">Requested normalized slug: <code>{requested}</code></div>
        <div className="mb-4">
          Available members:
          <ul className="list-disc pl-6 mt-2">
            {members.map((mm) => {
              const s = mm.slug ?? slugify(mm.name)
              const sn = normalizeSlug(s)
              return (
                <li key={mm.name}>
                  <Link href={`/teams/${s}`} className="text-blue-600 hover:underline">{mm.name} — <code>{s}</code> (normalized: <code>{sn}</code>)</Link>
                </li>
              )
            })}
          </ul>
        </div>
        <Link href="/teams" className="text-blue-600 hover:underline">Back to team</Link>

        {/* Client-side helper: if the browser requested a non-empty slug but server params were empty,
            try to extract the slug from the URL and redirect to the normalized member URL if it exists. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const path = location.pathname || '';
    const parts = path.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    if (!last) return;
    const normalize = s => (s || '').toLowerCase().replace(/[–—−‒−]/g, '-').replace(/[^a-z0-9-]/g, '');
    const requested = normalize(last);
    const avail = ${JSON.stringify(members.map(m => ({ s: m.slug ?? slugify(m.name), sn: (m.slug ?? slugify(m.name)).toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')})))};
    const match = avail.find(a => normalize(a.s) === requested || a.sn === requested);
    if (match) {
      const target = '/teams/' + match.s;
      if (location.pathname !== target) {
        location.replace(target + location.search + location.hash);
      }
    }
  } catch (e) { /* ignore */ }
})();`,
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-start gap-8">
        <div className="flex-shrink-0">
          {member.photo ? (
            <img
              src={`/images/teams/${member.photo}`}
              alt={`${member.name} photo`}
              className="w-64 h-64 rounded-lg object-cover"
            />
          ) : (
            <div className="w-64 h-64 rounded-lg bg-slate-600 text-white flex items-center justify-center text-4xl font-semibold">
              {member.name
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
          )}

          <div className="mt-4 space-y-2">
            {member.email && (
              <a href={`mailto:${member.email}`} className="block text-black">{member.email}</a>
            )}
            {member.website && (
              <div>{renderLink(member.website, 'Personal website')}</div>
            )}
            {member.cv && (
              <div>
                <a href={member.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View CV</a>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-black">{member.name}</h1>
          {member.title && <div className="text-xl text-black mt-1">{member.title}</div>}
          {member.affiliation && <div className="text-lg italic text-black mt-2">{member.affiliation}</div>}

          {member.bio && <p className="mt-4 text-base text-black leading-relaxed">{member.bio}</p>}

          {member.research_interests && member.research_interests.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-black">Research interests</h2>
              <ul className="list-disc pl-6 mt-2 text-black">
                {member.research_interests.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          )}

          {member.projects && member.projects.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-black">Projects</h2>
              <ul className="list-disc pl-6 mt-2 text-black">
                {member.projects.map((p, i) => (
                  <li key={i}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{p.name}</a>
                    ) : (
                      <span>{p.name}</span>
                    )}
                    {p.description && <div className="text-sm text-slate-600">{p.description}</div>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {member.publications && member.publications.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-black">Selected publications</h2>
              <ol className="list-decimal pl-6 mt-2 text-black">
                {member.publications.map((pub, i) => (
                  <li key={i} className="mb-2">
                    <div>
                      {pub.url ? (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{pub.title}</a>
                      ) : (
                        <span>{pub.title}</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">{pub.authors} {pub.venue ? `· ${pub.venue}` : ''} {pub.year ? `· ${pub.year}` : ''}</div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-8">
            <Link href="/teams" className="text-blue-600 hover:underline">← Back to team</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
