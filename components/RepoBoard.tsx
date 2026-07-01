'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { formatNum, type RepoWithNote } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'
import KitModal, { hasKit } from '@/components/KitModal'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', Shell: '#89e051',
}

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return '今天'
  if (days < 30) return `${days}天前`
  if (days < 365) return `${Math.floor(days / 30)}月前`
  return `${Math.floor(days / 365)}年前`
}

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ccr-bookmarks') || '[]')
      setBookmarks(new Set(saved))
    } catch {}
  }, [])

  const toggle = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('ccr-bookmarks', JSON.stringify([...next]))
      return next
    })
  }, [])

  return { bookmarks, toggle }
}

function RepoCard({ repo, bookmarked, onBookmark, onKitClick }: {
  repo: RepoWithNote
  bookmarked: boolean
  onBookmark: (id: number) => void
  onKitClick: (fullName: string) => void
}) {
  const langColor = repo.language ? LANG_COLORS[repo.language] ?? '#8b949e' : '#8b949e'
  const showKit = hasKit(repo.full_name)

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 min-w-0">
          <img src={repo.owner.avatar_url} alt="" className="w-5 h-5 rounded-full shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-gray-400 truncate block">{repo.owner.login}</span>
            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight block truncate">
              {repo.name}
            </span>
          </div>
        </a>
        <div className="flex items-center gap-1 shrink-0">
          {showKit && (
            <button
              onClick={() => onKitClick(repo.full_name)}
              className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              动手做
            </button>
          )}
          <button
            onClick={() => onBookmark(repo.id)}
            className={`p-1 rounded transition-colors ${bookmarked ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
            aria-label="收藏"
          >
            <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 mb-3">
        {repo.note ? (
          <p className="text-sm text-gray-800 leading-relaxed">{repo.note}</p>
        ) : (
          <p className="text-xs text-gray-400 italic">解读生成中…</p>
        )}
      </div>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {repo.topics.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {formatNum(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
          {formatNum(repo.forks_count)}
        </span>
        <span className="ml-auto">{timeAgo(repo.updated_at)}</span>
      </div>
    </div>
  )
}

export default function RepoBoard() {
  const getInitialCat = () => {
    if (typeof window === 'undefined') return 'claude-code'
    return new URLSearchParams(window.location.search).get('cat') ?? 'claude-code'
  }
  const [activeCategory, setActiveCategory] = useState(getInitialCat)
  const [repos, setRepos] = useState<RepoWithNote[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [kitFullName, setKitFullName] = useState<string | null>(null)
  const { bookmarks, toggle } = useBookmarks()

  // 监听新手选择器发出的分类切换事件
  useEffect(() => {
    const handler = (e: Event) => {
      const cat = (e as CustomEvent<string>).detail
      setActiveCategory(cat)
      setSearch('')
    }
    window.addEventListener('ccr-cat-change', handler)
    return () => window.removeEventListener('ccr-cat-change', handler)
  }, [])

  const fetchRepos = useCallback(async (categoryId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/repos?category=${categoryId}`)
      const data = await res.json()
      setRepos(data.repos ?? [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchRepos(activeCategory) }, [activeCategory, fetchRepos])

  const filtered = useMemo(() => {
    let list = repos
    if (showBookmarksOnly) list = list.filter((r) => bookmarks.has(r.id))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.full_name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.note?.toLowerCase().includes(q) ||
          r.topics.some((t) => t.includes(q))
      )
    }
    return list
  }, [repos, search, showBookmarksOnly, bookmarks])

  const category = CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <>
    <section id="board" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-black text-gray-900">项目榜单</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="搜索项目..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 w-48"
              />
            </div>
            <button
              onClick={() => setShowBookmarksOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
                showBookmarksOnly
                  ? 'bg-yellow-400 border-yellow-400 text-black font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-400'
              }`}
            >
              <svg className="w-4 h-4" fill={showBookmarksOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              收藏 {bookmarks.size > 0 && `(${bookmarks.size})`}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {CATEGORIES.filter(c => c.id !== 'trending').map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch('') }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {category && !showBookmarksOnly && (
          <p className="text-sm text-gray-500 mb-6">{category.description}</p>
        )}
        {showBookmarksOnly && (
          <p className="text-sm text-gray-500 mb-6">你收藏的 {bookmarks.size} 个项目</p>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-52 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>{search ? `没有找到"${search}"相关项目` : '暂无数据'}</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                bookmarked={bookmarks.has(repo.id)}
                onBookmark={toggle}
                onKitClick={setKitFullName}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            共 {filtered.length} 个项目 · 数据来自 GitHub · 每天更新
          </p>
        )}
      </div>
    </section>

    {kitFullName && (
      <KitModal fullName={kitFullName} onClose={() => setKitFullName(null)} />
    )}
  </>
  )
}
