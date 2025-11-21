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
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg border border-slate-600">
                  {initials(m.name)}
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{m.name}</h3>
              {m.title && <div className="text-sm text-slate-600 mb-1 font-medium">{m.title}</div>}
              {m.affiliation && <div className="text-sm text-slate-500 italic">{m.affiliation}</div>}
            </>
          )

          return (
            <li key={m.name} className="text-center group">
              {m.externalLink ? (
                <a
                  href={m.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 h-full"
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={`/teams/${slugify(m.name)}`}
                  className="block p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 h-full"
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
