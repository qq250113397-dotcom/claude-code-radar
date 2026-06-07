'use client'

export default function Hero() {
  return (
    <div className="relative bg-[#111] text-white overflow-hidden">
      {/* 点阵背景 */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 导航 */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="font-bold tracking-tight">Claude Code 雷达</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="#rising" className="hover:text-yellow-400 transition-colors">明星项目</a>
          <a href="#board" className="hover:text-yellow-400 transition-colors">项目榜单</a>
          <a
            href="https://github.com/topics/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero 内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        <div className="flex-1">
          <div className="text-xs font-bold tracking-[0.2em] text-blue-400 mb-5 uppercase">
            AI Coding Tools Radar · 每小时自动更新
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-none mb-6 tracking-tight">
            Claude Code<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">雷达</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg leading-relaxed mb-10">
            追踪 GitHub 上 Claude Code、MCP、AI Agent 等领域的热门开源项目，实时数据，自动更新。
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#board"
              className="px-7 py-3 bg-white text-black font-bold rounded hover:bg-yellow-300 transition-colors text-sm"
            >
              查看榜单
            </a>
            <a
              href="#rising"
              className="px-7 py-3 border border-white/30 font-bold rounded hover:border-white hover:bg-white/5 transition-colors text-sm"
            >
              本周明星项目
            </a>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur shrink-0">
          <div className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-1">SELECTION INDEX</div>
          <div className="text-7xl font-black mb-6 leading-none">200+</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">TRACKS</div>
              <div className="text-2xl font-black">5</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">RISING</div>
              <div className="text-2xl font-black text-yellow-400">20</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">UPDATE</div>
              <div className="text-2xl font-black">1h</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">SOURCE</div>
              <div className="text-2xl font-black">GH</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 bg-blue-500 rounded-full w-full" />
            <div className="h-1.5 bg-green-500 rounded-full w-4/5" />
            <div className="h-1.5 bg-yellow-500 rounded-full w-3/5" />
          </div>
        </div>
      </div>
    </div>
  )
}
