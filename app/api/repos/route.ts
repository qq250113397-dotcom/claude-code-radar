import { NextRequest, NextResponse } from 'next/server'
import { searchRepos, getRepo, getTrendingRepos } from '@/lib/github'
import { CATEGORIES, getCuratedForCategory } from '@/lib/categories'
import { isBlocked } from '@/lib/blocklist'
import { translateToZh } from '@/lib/translate'
import type { Repo } from '@/lib/github'

export const runtime = 'nodejs'

const CACHE_TTL = 60 * 60 * 1000
const apiCache = new Map<string, { repos: Repo[]; label: string; expiresAt: number }>()

async function fetchRepos(
  categoryId: string
): Promise<{ repos: Repo[]; label: string; notes: Record<string, string> }> {
  const category = CATEGORIES.find((c) => c.id === categoryId)!
  let notes: Record<string, string> = {}
  let repos: Repo[]

  if (categoryId === 'trending') {
    repos = (await getTrendingRepos(category.queries)).filter((r) => !isBlocked(r))
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
    repos = repos.filter((r) => !isBlocked(r)).slice(0, 20)
  }

  if (category.hasCurated) {
    const curated = getCuratedForCategory(categoryId)
    notes = curated.notes
    const fetched = await Promise.all(curated.repos.slice(0, 20).map((r) => getRepo(r)))
    const curatedValid = fetched.filter(Boolean) as Repo[]
    const existingIds = new Set(repos.map((r) => r.id))
    repos = [...curatedValid.filter((r) => !existingIds.has(r.id)), ...repos]
  }

  return { repos, label: category.label, notes }
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

    const { repos, label, notes } = await fetchRepos(categoryId)

    const reposWithNotes = await Promise.all(
      repos.map(async (r) => {
        const note = notes[r.full_name] ?? await translateToZh(r.description ?? '', r.full_name)
        return { ...r, note }
      })
    )

    apiCache.set(categoryId, { repos: reposWithNotes, label, expiresAt: Date.now() + CACHE_TTL })

    return NextResponse.json({ repos: reposWithNotes, category: label, cached: false })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
