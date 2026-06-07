import { NextRequest, NextResponse } from 'next/server'
import { searchRepos, getRepo, getTrendingRepos } from '@/lib/github'
import { CATEGORIES, CURATED_REPOS } from '@/lib/categories'
import curatedData from '@/data/curated.json'

const NOTES: Record<string, string> = curatedData.notes

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get('category') ?? 'claude-code'

  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  try {
    let repos

    if (categoryId === 'trending') {
      repos = await getTrendingRepos(category.queries)
    } else {
      const results = await Promise.all(
        category.queries.map((q) => searchRepos(q, 'stars', 8))
      )
      // 合并去重
      const seen = new Set<number>()
      repos = results.flat().filter((r) => {
        if (seen.has(r.id)) return false
        seen.add(r.id)
        return true
      })
      // 按 star 降序
      repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
      repos = repos.slice(0, 20)
    }

    // 如果是第一个 tab，追加手动精选
    if (categoryId === 'claude-code') {
      const curated = await Promise.all(CURATED_REPOS.map((r) => getRepo(r)))
      const curatedValid = curated.filter(Boolean) as typeof repos
      const existingIds = new Set(repos.map((r) => r.id))
      const newCurated = curatedValid.filter((r) => !existingIds.has(r.id))
      repos = [...newCurated, ...repos]
    }

    const reposWithNotes = repos.map((r) => ({
      ...r,
      note: NOTES[r.full_name] ?? null,
    }))

    return NextResponse.json({ repos: reposWithNotes, category: category.label })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 })
  }
}
