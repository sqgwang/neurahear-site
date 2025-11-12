import React from 'react'
import Link from 'next/link'
import { members, slugify, initials } from '@/data/team'

export default function TeamsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="mb-4">Our Team</h1>
      <p className="text-xl text-gray-600 mb-12">Meet the researchers advancing hearing science</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
        {members.map((m) => {
          const content = (
            <>
              {m.photo ? (
                <div className="relative overflow-hidden rounded-xl mb-4 group">
                  <img
                    src={`/images/teams/${m.photo}`}
                    alt={`${m.name} photo`}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
                  {initials(m.name)}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{m.name}</h3>
              {m.title && <div className="text-sm text-gray-600 mb-1">{m.title}</div>}
              {m.affiliation && <div className="text-sm text-gray-500 italic">{m.affiliation}</div>}
            </>
          )

          return (
            <li key={m.name} className="text-center">
              {m.externalLink ? (
                <a
                  href={m.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300"
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={`/teams/${slugify(m.name)}`}
                  className="block p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300"
                >
                  {content}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
