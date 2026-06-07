export interface Category {
  id: string
  label: string
  emoji: string
  queries: string[]
  description: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'claude-code',
    label: 'Claude Code 工具',
    emoji: '🤖',
    queries: ['claude-code', 'claude code extension', 'claude code hook', 'claude code mcp'],
    description: '专为 Claude Code 打造的工具、插件、工作流',
  },
  {
    id: 'mcp',
    label: 'MCP 服务器',
    emoji: '🔌',
    queries: ['mcp server', 'model-context-protocol', 'mcp tool'],
    description: 'Model Context Protocol 服务器与集成',
  },
  {
    id: 'ai-agent',
    label: 'AI Agent',
    emoji: '🧠',
    queries: ['ai agent llm', 'autonomous agent', 'llm agent framework'],
    description: 'AI Agent 框架与自动化工具',
  },
  {
    id: 'ai-coding',
    label: 'AI 编程工具',
    emoji: '💻',
    queries: ['ai coding assistant', 'vibe coding', 'llm coding'],
    description: 'AI 辅助编程工具与效率提升',
  },
  {
    id: 'trending',
    label: '本周新星',
    emoji: '🚀',
    queries: ['claude', 'mcp', 'ai agent'],
    description: '最近 7 天 star 增长最快的项目',
  },
]

import curatedData from '@/data/curated.json'

export const CURATED_REPOS: string[] = curatedData.repos
