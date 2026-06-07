import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const hasToken = !!token

  // 直接调用 GitHub API 看原始返回
  const res = await fetch('https://api.github.com/search/repositories?q=claude-code&per_page=2', {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const body = await res.text()

  return NextResponse.json({
    hasToken,
    githubStatus: res.status,
    githubBody: body.slice(0, 500),
  })
}
