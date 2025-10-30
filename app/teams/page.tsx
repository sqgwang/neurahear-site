import React from 'react'
import Link from 'next/link'
import { members, slugify, initials } from '@/data/team'

export default function TeamsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-6">Team</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none p-0 m-0">
        {members.map((m) => (
          <li
            key={m.name}
            className="flex items-start space-x-6 bg-white/5 p-4 rounded-lg"
          >
            {m.photo ? (
              <img
                src={`/images/teams/${m.photo}`}
                alt={`${m.name} photo`}
                className="w-40 h-40 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-slate-600 text-white flex items-center justify-center text-2xl font-semibold flex-shrink-0">
                {initials(m.name)}
              </div>
            )}

            <div className="flex-1">
              <div className="text-lg font-semibold text-black">
                <Link href={`/teams/${slugify(m.name)}`} className="no-underline hover:underline">
                  {m.name}
                </Link>
              </div>
              {m.affiliation && (
                <div className="text-sm text-black italic">{m.affiliation}</div>
              )}
              {m.bio && <p className="mt-2 text-sm text-black">{m.bio}</p>}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-slate-500">
        Put images in <code>public/images/teams/</code>, e.g. <code>public/images/teams/shang_wang.jpg</code>.
        Recommended size: square (e.g. 400×400 or 512×512) for best results.
      </p>
    </div>
  )
}
