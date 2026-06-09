// 过滤不适合展示的 repo：政治敏感、色情、无关内容等
const BLOCKED_NAME_KEYWORDS = [
  'dictatorship',
  'propaganda',
  'censorship',
  'tiananmen',
  'falun',
  'xinjiang',
  'uyghur',
  'taiwan-independence',
  'hongkong-protest',
]

const BLOCKED_TOPIC_KEYWORDS = [
  'dictatorship',
  'propaganda',
  'censorship',
  'censorship-circumvention',
  'anti-censorship',
]

const BLOCKED_REPOS = [
  'cirosantilli/china-dictatorship',
]

import type { Repo } from './github'

export function isBlocked(repo: Repo): boolean {
  const name = repo.full_name.toLowerCase()

  if (BLOCKED_REPOS.includes(repo.full_name)) return true

  if (BLOCKED_NAME_KEYWORDS.some((kw) => name.includes(kw))) return true

  if (repo.topics.some((t) => BLOCKED_TOPIC_KEYWORDS.includes(t))) return true

  return false
}
