'use client'

import type { Repo } from '@/lib/github'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  Shell: '#89e051',
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days < 30) return `${days} 天前`
  if (days < 365) return `${Math.floor(days / 30)} 个月前`
  return `${Math.floor(days / 365)} 年前`
}

export default function RepoCard({ repo, rank }: { repo: Repo; rank: number }) {
  const langColor = repo.language ? LANG_COLORS[repo.language] ?? '#8b949e' : '#8b949e'

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* 排名 */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          {rank}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {/* 头像 + 名称 */}
          <div className="flex items-center gap-2 mb-1">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-sm text-gray-500 truncate">{repo.owner.login}</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {repo.name}
            </span>
          </div>

          {/* 描述 */}
          {repo.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{repo.description}</p>
          )}

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {repo.topics.slice(0, 4).map((t) => (
                <span key={t} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* 底部统计 */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {/* Language */}
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: langColor }}
                />
                {repo.language}
              </span>
            )}

            {/* Stars */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              {formatNumber(repo.stargazers_count)}
            </span>

            {/* Forks */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
              {formatNumber(repo.forks_count)}
            </span>

            {/* 更新时间 */}
            <span>更新于 {timeAgo(repo.updated_at)}</span>
          </div>
        </div>

        {/* 外链箭头 */}
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}
