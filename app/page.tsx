import Hero from '@/components/Hero'
import RisingStars from '@/components/RisingStars'
import RepoBoard from '@/components/RepoBoard'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      {/* 引流 Banner */}
      <div className="bg-[#0a0a0a] px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <a
            href="https://claude.lbenben.cc.cd/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 p-4 bg-white/5 border border-orange-500/30 rounded-xl hover:border-orange-400 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full">推荐</span>
                  <span className="font-semibold text-white text-sm">国内稳定使用 Claude Code</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  <span className="text-xs text-gray-400">⚡ CF 优选订阅</span>
                  <span className="text-xs text-gray-400">🏠 住宅 IP 仅 $4.8</span>
                  <span className="text-xs text-gray-400">🔒 不封号</span>
                  <span className="text-xs text-gray-400">💰 封号退 75%</span>
                </div>
              </div>
            </div>
            <svg className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <RisingStars />
      <RepoBoard />

      <footer className="bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400 py-8">
        数据来自 GitHub · 每小时自动更新 · <a href="https://radar.lbenben.cc.cd" className="hover:text-gray-600">radar.lbenben.cc.cd</a>
      </footer>
    </div>
  )
}
