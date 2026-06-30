'use client'

const OPTIONS = [
  {
    emoji: '🎮',
    title: '想做个好玩的游戏',
    desc: '浏览器小游戏、互动应用',
    cat: 'ai-game',
  },
  {
    emoji: '🛠️',
    title: '想做个实用工具',
    desc: '提升效率、解决真实问题',
    cat: 'ai-coding',
  },
  {
    emoji: '🤖',
    title: '想用 Claude Code 开发',
    desc: '插件、工作流、MCP 扩展',
    cat: 'claude-code',
  },
  {
    emoji: '✨',
    title: '想做个创意生成器',
    desc: '艺术、音乐、表情包生成',
    cat: 'creative-generator',
  },
]

export default function StarterGuide() {
  const handleClick = (cat: string) => {
    // 更新 URL 参数后跳到榜单区域
    const url = new URL(window.location.href)
    url.searchParams.set('cat', cat)
    window.history.pushState({}, '', url)
    window.dispatchEvent(new CustomEvent('ccr-cat-change', { detail: cat }))
    document.getElementById('board')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="text-xs font-bold tracking-[0.2em] text-green-400 uppercase mb-2">新手选择器</div>
          <h2 className="text-white text-2xl font-black">不知道做什么？选一个方向</h2>
          <p className="text-gray-500 text-sm mt-1">点一下，直接跳到对应分类</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.cat}
              onClick={() => handleClick(opt.cat)}
              className="group text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-green-400/50 hover:bg-white/10 transition-all"
            >
              <div className="text-2xl mb-3">{opt.emoji}</div>
              <div className="font-bold text-white text-sm mb-1 group-hover:text-green-400 transition-colors">
                {opt.title}
              </div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
