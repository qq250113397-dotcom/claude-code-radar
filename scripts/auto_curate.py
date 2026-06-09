#!/usr/bin/env python3
"""
自动精选脚本：从 GitHub 发现热门 repo，用 Claude API 生成中文解读，更新 curated.json
"""

import json
import os
import time
import urllib.request
import urllib.parse

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

GITHUB_HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "claude-code-radar/1.0",
}
if GITHUB_TOKEN:
    GITHUB_HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"

# 每个分类最多发现多少个新 repo（控制 Claude API 费用）
MAX_NEW_PER_RUN = 30

# 各分类的搜索关键词（与 lib/categories.ts 保持一致）
CATEGORY_QUERIES = [
    "claude-code",
    "claude code extension",
    "claude code hook",
    "mcp server",
    "model-context-protocol",
    "ai agent llm",
    "ai coding assistant",
    "vibe coding",
]


def github_search(query: str, per_page: int = 10) -> list:
    params = urllib.parse.urlencode({
        "q": query,
        "sort": "stars",
        "order": "desc",
        "per_page": per_page,
    })
    url = f"https://api.github.com/search/repositories?{params}"
    req = urllib.request.Request(url, headers=GITHUB_HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())
    return data.get("items", [])


def codex_describe(repo: dict) -> str:
    """用 Google Gemini 2.0 Flash 生成中文解读（免费额度 1500次/天，无需绑卡）"""
    prompt = f"""为以下 GitHub 项目生成一句中文介绍，供 AI 编程工具榜单展示。

项目名：{repo["full_name"]}
英文描述：{repo.get("description") or "无"}
Stars：{repo["stargazers_count"]}
主题标签：{", ".join(repo.get("topics", [])[:5])}
主要语言：{repo.get("language") or "未知"}

要求：
- 一句话，50-80 个中文字符
- 先说这个工具/项目是什么，再说它最核心的价值
- 面向 Claude Code / AI 编程用户，语气直接、务实
- 不要翻译项目名，保留英文原名
- 不要加任何标点符号之外的格式

只输出这一句介绍，不要任何解释。"""

    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": 200},
    }).encode()

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
            return result["candidates"][0]["content"]["parts"][0]["text"].strip()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                print(f"    限速，等待 65 秒后重试（第 {attempt + 1} 次）...")
                time.sleep(65)
            else:
                raise


def main():
    curated_path = os.path.join(os.path.dirname(__file__), "..", "data", "curated.json")
    with open(curated_path, encoding="utf-8") as f:
        curated = json.load(f)

    existing_repos: set = set(curated.get("repos", []))
    existing_notes: dict = curated.get("notes", {})

    print(f"现有精选数量: {len(existing_repos)}")

    # 发现所有候选 repo
    candidates = {}
    for query in CATEGORY_QUERIES:
        print(f"搜索: {query}")
        try:
            items = github_search(query, per_page=15)
            for item in items:
                full_name = item["full_name"]
                if full_name not in candidates:
                    candidates[full_name] = item
        except Exception as e:
            print(f"  搜索失败: {e}")
        time.sleep(1)  # 避免触发 GitHub API 速率限制

    # 过滤出还没有解读的 repo
    new_repos = [
        repo for full_name, repo in candidates.items()
        if full_name not in existing_notes
        and repo["stargazers_count"] >= 100  # 至少 100 stars
    ]

    # 按 star 数降序，取前 N 个
    new_repos.sort(key=lambda r: r["stargazers_count"], reverse=True)
    new_repos = new_repos[:MAX_NEW_PER_RUN]

    if not new_repos:
        print("没有发现需要新增的 repo，退出。")
        return

    print(f"\n发现 {len(new_repos)} 个新 repo，开始生成解读...")

    added_count = 0
    for repo in new_repos:
        full_name = repo["full_name"]
        print(f"  生成: {full_name} (⭐{repo['stargazers_count']})")
        try:
            note = codex_describe(repo)
            print(f"    → {note}")
            existing_notes[full_name] = note
            if full_name not in existing_repos:
                existing_repos.add(full_name)
            added_count += 1
        except Exception as e:
            print(f"    生成失败: {e}")
        time.sleep(5)  # Gemini 免费版限速 15次/分钟，5秒间隔安全

    # 更新 curated.json，repos 列表按原顺序保留，新的追加到末尾
    original_repos = curated.get("repos", [])
    for full_name in existing_repos:
        if full_name not in original_repos:
            original_repos.append(full_name)

    curated["repos"] = original_repos
    curated["notes"] = existing_notes
    curated["comment"] = "自动精选：每日由 Claude Haiku 自动发现并生成解读，也可在 GitHub 网页手动编辑。"

    with open(curated_path, "w", encoding="utf-8") as f:
        json.dump(curated, f, ensure_ascii=False, indent=2)

    print(f"\n完成！新增 {added_count} 个 repo，已写入 data/curated.json")


if __name__ == "__main__":
    main()
