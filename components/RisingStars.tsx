'use client'

import { useEffect, useState } from 'react'
import type { Repo } from '@/lib/github'

type RepoWithNote = Repo & { note?: string | null }

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function BigCard({ repo, rank }: { repo: RepoWithNote; rank: number }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[#e8f4ff] border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded">#{rank}</span>
        <span className="text-blue-600 font-bold text-xl">⭐ {formatNum(repo.stargazers_count)}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <img src={repo.owner.avatar_url} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-sm text-gray-500">{repo.owner.login}</span>
      </div>
      <h2 className="text-3xl font-black mb-4 leading-tight group-hover:text-blue-600 transition-colors break-all">
        {repo.name}
      </h2>
      {repo.note ? (
        <p className="text-gray-700 text-base leading-relaxed mb-6">{repo.note}</p>
      ) : (
        repo.description && (
          <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">{repo.description}</p>
        )
      )}
      <div className="flex flex-wrap gap-2 mt-auto">
        {repo.topics.slice(0, 4).map((t) => (
          <span key={t} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}

function SmallCard({ repo, rank }: { repo: RepoWithNote; rank: number }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[#111] text-white border border-white/10 rounded-xl p-5 hover:border-yellow-400 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="bg-white/10 text-white text-xs font-bold px-2 py-0.5 rounded">#{rank}</span>
        <span className="text-yellow-400 font-bold text-sm">⭐ {formatNum(repo.stargazers_count)}</span>
      </div>
      <h3 className="font-bold text-base mb-2 group-hover:text-yellow-400 transition-colors leading-tight break-all">
        {repo.owner.login}/{repo.name}
      </h3>
      {repo.note ? (
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{repo.note}</p>
      ) : (
        repo.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{repo.description}</p>
        )
      )}
      <div className="flex flex-wrap gap-1">
        {repo.topics.slice(0, 3).map((t) => (
          <span key={t} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded-full">
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}

export default function RisingStars() {
  const [repos, setRepos] = useState<RepoWithNote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/repos?category=trending')
      .then((r) => r.json())
      .then((d) => setRepos(d.repos ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="rising" className="bg-[#0a0a0a] py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <div className="mb-12">
          <div className="text-xs font-bold tracking-[0.2em] text-yellow-400 uppercase mb-3">
            Rising This Week
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-white text-4xl font-black">明星项目</h2>
            <p className="text-gray-500 text-sm max-w-sm">
              本周活跃度最高的开源项目，来自 GitHub，按 Star 数自动排序
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="h-80 bg-white/5 rounded-2xl animate-pulse lg:row-span-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && repos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 大卡片 #1 */}
            <div className="lg:row-span-2">
              <BigCard repo={repos[0]} rank={1} />
            </div>
            {/* 小卡片 #2-5 */}
            {repos.slice(1, 5).map((repo, i) => (
              <SmallCard key={repo.id} repo={repo} rank={i + 2} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
