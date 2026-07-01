import type { Repo } from './github'

// ── 精确屏蔽仓库 ──────────────────────────────────────────────
const BLOCKED_REPOS = new Set([
  'cirosantilli/china-dictatorship',
  'cirosantilli/china-dictatroship-7',
  'fighting41love/funNLP',
])

// ── 仓库名关键词（英文，匹配 full_name 小写） ─────────────────
const BLOCKED_NAME_KEYWORDS = [
  // 政治敏感
  'dictatorship', 'propaganda', 'tiananmen', 'falun', 'falungong',
  'xinjiang', 'uyghur', 'taiwan-independence', 'hongkong-protest',
  'ccp-', '-ccp', 'anti-china', 'free-tibet', 'free-hongkong',
  // 翻墙工具（仓库名层面）
  'gfw-', '-gfw', 'shadowsocks', 'v2ray', 'xray-core', 'trojan-go',
  'clash-', 'sing-box', 'hysteria', 'naiveproxy',
  // 黑灰产 / 网络攻击
  'phishing', 'ransomware', 'botnet', 'rootkit', 'keylogger',
  'credential-stealer', 'rat-tool', 'darkweb', 'dark-web',
  'carding', 'spambot', 'ddos-tool', 'stresser',
  // 色情
  'nsfw-', '-nsfw', 'porn', 'xxx-', 'onlyfans-scraper',
]

// ── Topics 标签关键词 ──────────────────────────────────────────
const BLOCKED_TOPIC_KEYWORDS = new Set([
  'dictatorship', 'propaganda', 'censorship', 'censorship-circumvention',
  'anti-censorship', 'gfw', 'anti-gfw',
  'phishing', 'ransomware', 'botnet', 'rootkit', 'malware',
  'ddos', 'stresser', 'credential-stuffing',
  'nsfw', 'porn', 'adult-content',
])

// ── 描述文字关键词（中英文，匹配 description 小写） ──────────
const BLOCKED_DESC_KEYWORDS = [
  // 政治
  '反动', '颠覆', '境外势力', '推翻政府', '法轮功', '天安门事件',
  '台独', '藏独', '港独',
  // 黑灰产
  '网络攻击', '钓鱼网站', '勒索病毒', '木马', '僵尸网络',
  'credit card dump', 'carding', 'phishing kit', 'stealer',
  'rat tool', 'keylogger', 'botnet', 'ddos tool', 'stresser',
  // 色情
  'adult content', 'pornograph', 'onlyfans leak',
]

export function isBlocked(repo: Repo): boolean {
  if (BLOCKED_REPOS.has(repo.full_name)) return true

  const name = repo.full_name.toLowerCase()
  if (BLOCKED_NAME_KEYWORDS.some((kw) => name.includes(kw))) return true

  if (repo.topics?.some((t) => BLOCKED_TOPIC_KEYWORDS.has(t))) return true

  const desc = (repo.description ?? '').toLowerCase()
  if (BLOCKED_DESC_KEYWORDS.some((kw) => desc.includes(kw.toLowerCase()))) return true

  return false
}
