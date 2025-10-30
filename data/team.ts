export type Publication = {
  title: string
  authors?: string
  venue?: string
  year?: number
  url?: string
}

export type Project = { name: string; url?: string; description?: string }

export type Social = { github?: string; linkedin?: string; twitter?: string }

export type Member = {
  name: string
  slug?: string
  title?: string
  affiliation?: string
  photo?: string
  email?: string
  website?: string
  orcid?: string
  googleScholar?: string
  bio?: string
  research_interests?: string[]
  publications?: Publication[]
  projects?: Project[]
  cv?: string
  social?: Social
}

// Load members from JSON to make editing easier for non-developers
import teamData from './team.json'

export const members: Member[] = teamData as Member[]

export function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function slugify(name: string) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
