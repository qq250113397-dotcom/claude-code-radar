export interface Repo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  created_at: string
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
}

export interface SearchResult {
  repos: Repo[]
  total: number
  cached: boolean
}

const GITHUB_API = 'https://api.github.com'
const TOKEN = process.env.GITHUB_TOKEN

function headers() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (TOKEN) h['Authorization'] = `Bearer ${TOKEN}`
  return h
}

export async function searchRepos(query: string, sort: 'stars' | 'updated' = 'stars', perPage = 10): Promise<Repo[]> {
  const params = new URLSearchParams({
    q: query,
    sort,
    order: 'desc',
    per_page: String(perPage),
  })
  const res = await fetch(`${GITHUB_API}/search/repositories?${params}`, {
    headers: headers(),
  })
  if (!res.ok) {
    console.error(`GitHub API error: ${res.status} ${res.statusText}`)
    return []
  }
  const data = await res.json()
  return data.items ?? []
}

export async function getRepo(fullName: string): Promise<Repo | null> {
  const res = await fetch(`${GITHUB_API}/repos/${fullName}`, {
    headers: headers(),
  })
  if (!res.ok) return null
  return res.json()
}

// 计算"本周新星"：按 pushed_at 近7天 + stars 综合排序
export async function getTrendingRepos(queries: string[]): Promise<Repo[]> {
  const since = new Date()
  since.setDate(since.getDate() - 7)
  const sinceStr = since.toISOString().split('T')[0]

  const query = `(${queries.join(' OR ')}) pushed:>${sinceStr} stars:>10`
  const repos = await searchRepos(query, 'stars', 20)
  return repos
}
