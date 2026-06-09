// 翻译缓存：按 repo full_name 存储，worker 实例生命周期内永久有效
const cache = new Map<string, string>()

const CF_API_TOKEN = process.env.CF_API_TOKEN
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID

export async function translateToZh(text: string, cacheKey: string): Promise<string | null> {
  if (!text) return null
  if (cache.has(cacheKey)) return cache.get(cacheKey)!
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) return null

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `将以下英文翻译成中文，只输出译文，不要任何解释：${text}` }],
          max_tokens: 150,
        }),
        signal: controller.signal,
      }
    )
    clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    const translated: string = data?.result?.response?.trim() || ''
    if (translated) cache.set(cacheKey, translated)
    return translated || null
  } catch {
    return null
  }
}
