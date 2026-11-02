// 过滤政治敏感等不适合展示的 repo。名单在 data/blocklist.json，改名单不用动这里
// scripts/auto_curate.py 里有同样规则的 Python 版，改匹配逻辑要两边一起改
import rules from '../data/blocklist.json' with { type: 'json' }
import type { Repo } from './github'

const owners = new Set(rules.owners.map((o) => o.toLowerCase()))
const repos = new Set(rules.repos.map((r) => r.toLowerCase()))

// 符号都换成空格、前后补空格，英文词就能按整词比；中文词直接按包含比
const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ').trim()} `
const words = rules.words.map((w) => (/^[\x00-\x7f]+$/.test(w) ? norm(w) : w))

export function isBlocked(repo: Repo, note?: string | null): boolean {
  const name = repo.full_name.toLowerCase()
  if (repos.has(name) || owners.has(name.split('/')[0])) return true
  const text = norm([repo.full_name, repo.description ?? '', ...(repo.topics ?? []), note ?? ''].join(' '))
  return words.some((w) => text.includes(w))
}
