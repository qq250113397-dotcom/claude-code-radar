import RepoList from '@/components/RepoList'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Claude Code 雷达</h1>
              <p className="text-xs text-gray-500">追踪 AI 编程工具生态</p>
            </div>
          </div>
          <a
            href="https://github.com/topics/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-6" id="board">
        {/* Hero */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white">
          <h2 className="text-xl font-bold mb-2">发现最好的 AI 编程工具</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            每小时自动从 GitHub 抓取最新数据，追踪 Claude Code、MCP、AI Agent 等领域的热门开源项目。
          </p>
          <div className="flex gap-4 mt-4 text-xs text-blue-200">
            <span>📦 实时数据</span>
            <span>🔄 每小时更新</span>
            <span>⭐ 按 Star 排序</span>
          </div>
        </div>

        {/* 引流 Banner */}
        <a
          href="https://claude.lbenben.cc.cd/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 mb-6 p-4 bg-white border border-orange-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">推荐</span>
                <span className="font-semibold text-gray-900 text-sm">稳定使用 Claude Code</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">无需翻墙 · 开箱即用 · 实时同步官方版本</p>
            </div>
          </div>
          <svg
            className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* Repo List */}
        <RepoList />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-8">
        数据来自 GitHub · 每小时自动更新
      </footer>
    </div>
  )
}
