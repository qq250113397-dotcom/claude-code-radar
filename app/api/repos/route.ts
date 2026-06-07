import { NextRequest, NextResponse } from 'next/server'
import { searchRepos, getRepo, getTrendingRepos } from '@/lib/github'
import { CATEGORIES, CURATED_REPOS, CURATED_NOTES } from '@/lib/categories'
import type { Repo } from '@/lib/github'

export const runtime = 'nodejs'

const CACHE_TTL = 60 * 60 * 1000
const apiCache = new Map<string, { repos: Repo[]; label: string; expiresAt: number }>()

async function fetchRepos(categoryId: string): Promise<{ repos: Repo[]; label: string }> {
  const category = CATEGORIES.find((c) => c.id === categoryId)!

  let repos: Repo[]

  if (categoryId === 'trending') {
    repos = await getTrendingRepos(category.queries)
  } else {
    const results = await Promise.all(
      category.queries.map((q) => searchRepos(q, 'stars', 8))
    )
    const seen = new Set<number>()
    repos = results.flat().filter((r) => {
      if (seen.has(r.id)) return false
      seen.add(r.id)
      return true
    })
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
    repos = repos.slice(0, 20)
  }

  if (category.hasCurated) {
    const curated = await Promise.all(CURATED_REPOS.map((r) => getRepo(r)))
    const curatedValid = curated.filter(Boolean) as Repo[]
    const existingIds = new Set(repos.map((r) => r.id))
    repos = [...curatedValid.filter((r) => !existingIds.has(r.id)), ...repos]
  }

  return { repos, label: category.label }
}

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get('category') ?? 'claude-code'

  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  try {
    const cached = apiCache.get(categoryId)
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json({ repos: cached.repos, category: cached.label, cached: true })
    }

    const { repos, label } = await fetchRepos(categoryId)

    const reposWithNotes = repos.map((r) => ({
      ...r,
      note: CURATED_NOTES[r.full_name] ?? null,
    }))

    apiCache.set(categoryId, { repos: reposWithNotes, label, expiresAt: Date.now() + CACHE_TTL })

    return NextResponse.json({ repos: reposWithNotes, category: label, cached: false })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
