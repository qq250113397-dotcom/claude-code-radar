import curatedData from '@/data/curated.json'

export interface Category {
  id: string
  label: string
  emoji: string
  queries: string[]
  description: string
  hasCurated?: boolean
}

export const CATEGORIES: Category[] = [
  {
    id: 'claude-code',
    label: 'Claude Code 工具',
    emoji: '🤖',
    queries: ['claude-code', 'claude code extension', 'claude code hook', 'claude code mcp'],
    description: '专为 Claude Code 打造的工具、插件、工作流',
    hasCurated: true,
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
    id: 'ecommerce',
    label: '电商应用',
    emoji: '🛒',
    queries: ['ecommerce ai agent', 'shopify ai', 'ai shopping assistant', 'ecommerce llm'],
    description: 'AI 驱动的电商工具，覆盖选品、客服、营销全链路',
    hasCurated: true,
  },
  {
    id: 'design',
    label: '设计应用',
    emoji: '🎨',
    queries: ['ai design tool', 'figma ai', 'ui generation ai', 'design to code ai'],
    description: 'AI 设计工具，让设计与前端开发更高效',
    hasCurated: true,
  },
  {
    id: 'agent-boost',
    label: 'Agent 增强',
    emoji: '⚡',
    queries: ['agent memory llm', 'llm agent optimization', 'agent evaluation framework'],
    description: '让 AI Agent 更聪明、更高效的增强与优化工具',
    hasCurated: true,
  },
  {
    id: 'education',
    label: '学习辅助',
    emoji: '📚',
    queries: ['ai english learning', 'ai math tutor', 'ai education student', 'ai language learning'],
    description: 'AI 驱动的学习工具，覆盖英语、数学、编程等各类学科',
    hasCurated: true,
  },
  {
    id: 'trending',
    label: '本周新星',
    emoji: '🚀',
    queries: ['claude', 'mcp', 'ai agent'],
    description: '最近 7 天 star 增长最快的项目',
  },
]

type CuratedCategory = { repos: string[]; notes: Record<string, string> }

export function getCuratedForCategory(categoryId: string): CuratedCategory {
  const data = (curatedData as Record<string, CuratedCategory>)[categoryId]
  return { repos: data?.repos ?? [], notes: data?.notes ?? {} }
}
