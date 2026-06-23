'use client'

import { useEffect, useRef, useState } from 'react'
import kitsData from '@/data/kits.json'

export interface Kit {
  title: string
  step1: string
  mvpSteps: string[]
  fileStructure: string[]
  prompt: string
  skills?: Array<{ name: string; reason: string }>
}

type KitsMap = Record<string, Kit>
const kits = kitsData as KitsMap

export function hasKit(fullName: string): boolean {
  return fullName in kits
}

export default function KitModal({
  fullName,
  onClose,
}: {
  fullName: string
  onClose: () => void
}) {
  const kit = kits[fullName]
  const [copied, setCopied] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleCopy = () => {
    if (!kit) return
    navigator.clipboard.writeText(kit.prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!kit) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 顶部标题栏 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-5 pb-4 rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">动手做</p>
              <h2 className="text-xl font-black text-gray-900">{kit.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{fullName}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 第一步 */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-600 mb-2">第一步</p>
            <p className="text-sm text-gray-700 leading-relaxed">{kit.step1}</p>
          </div>

          {/* MVP 步骤 */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{kit.mvpSteps.length} 步 MVP</p>
            <div className="space-y-2">
              {kit.mvpSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 文件结构 */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">建议文件结构</p>
            <div className="bg-gray-900 rounded-xl px-4 py-3">
              {kit.fileStructure.map((f, i) => (
                <p key={i} className="text-xs text-green-400 font-mono leading-6">
                  {i === 0 ? '📁 ' : '   '}
                  {f}
                </p>
              ))}
            </div>
          </div>

          {/* 推荐工具 */}
          {kit.skills && kit.skills.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">推荐工具</p>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {kit.skills.map((s) => (
                  <div key={s.name} className="flex gap-3 px-4 py-3">
                    <span className="shrink-0 font-semibold text-sm text-gray-900 w-28">{s.name}</span>
                    <span className="text-sm text-gray-600 leading-relaxed">{s.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 复制提示词 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">复制给 Claude Code</p>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已复制！
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    复制 Prompt
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl px-4 py-4">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">{kit.prompt}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
