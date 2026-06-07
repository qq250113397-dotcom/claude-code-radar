'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Repo } from '@/lib/github'

type RepoWithNote = Repo & { note?: string | null }
import RepoCard from './RepoCard'
import CategoryTabs from './CategoryTabs'
import { CATEGORIES } from '@/lib/categories'

export default function RepoList() {
  const [activeCategory, setActiveCategory] = useState('claude-code')
  const [repos, setRepos] = useState<RepoWithNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchRepos = useCallback(async (categoryId: string) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/repos?category=${categoryId}`)
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setRepos(data.repos ?? [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRepos(activeCategory)
  }, [activeCategory, fetchRepos])

  const category = CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <div>
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      {/* 分类描述 */}
      {category && (
        <p className="mt-3 text-sm text-gray-500">{category.description}</p>
      )}

      {/* 内容区 */}
      <div className="mt-5">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">😢</div>
            <p>加载失败，请稍后重试</p>
            <button
              onClick={() => fetchRepos(activeCategory)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>暂无数据</p>
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="space-y-3">
            {repos.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
