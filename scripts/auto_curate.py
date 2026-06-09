#!/usr/bin/env python3
"""
自动精选脚本：从 GitHub 发现热门 repo，用 Cloudflare Workers AI 生成中文解读，更新 curated.json
"""

import json
import os
import time
import urllib.request
import urllib.error
import urllib.parse

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
CF_API_TOKEN = os.environ["CF_API_TOKEN"]
CF_ACCOUNT_ID = os.environ["CF_ACCOUNT_ID"]

GITHUB_HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "claude-code-radar/1.0",
}
if GITHUB_TOKEN:
    GITHUB_HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"

# 各分类的搜索配置
CATEGORY_CONFIGS = {
    "claude-code": {
        "queries": [
            "claude-code",
            "claude code extension",
            "claude code hook",
            "mcp server",
            "model-context-protocol",
            "ai agent llm",
            "ai coding assistant",
            "vibe coding",
        ],
        "max_new": 30,
        "min_stars": 100,
    },
    "ecommerce": {
        "queries": [
            "ecommerce ai agent",
            "shopify ai",
            "ai shopping assistant",
            "ecommerce llm automation",
            "product recommendation ai",
        ],
        "max_new": 5,
        "min_stars": 50,
    },
    "design": {
        "queries": [
            "ai design tool",
            "figma ai plugin",
            "ui generation ai",
            "design to code ai",
            "ai wireframe generator",
        ],
        "max_new": 5,
        "min_stars": 50,
    },
    "agent-boost": {
        "queries": [
            "agent memory llm",
            "llm agent optimization",
            "agent evaluation framework",
            "prompt engineering tool",
            "ai agent enhancement",
        ],
        "max_new": 5,
        "min_stars": 100,
    },
    "education": {
        "queries": [
            "ai english learning",
            "ai math tutor",
            "ai education student",
            "ai language learning",
            "ai homework helper",
        ],
        "max_new": 5,
        "min_stars": 50,
    },
}


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
    """用 Cloudflare Workers AI Llama 3.1 生成中文解读（免费 10000次/天，不封 GitHub Actions IP）"""
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
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200,
    }).encode()

    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct"
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {CF_API_TOKEN}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
        return result["result"]["response"].strip()
    except urllib.error.HTTPError as e:
        err_body = e.read().decode(errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {err_body[:300]}")


def process_category(category_id: str, config: dict, curated: dict) -> int:
    """处理单个分类，返回新增数量"""
    cat_data = curated.setdefault(category_id, {"repos": [], "notes": {}})
    existing_notes: dict = cat_data.get("notes", {})
    existing_repos: list = cat_data.get("repos", [])

    print(f"\n=== 分类: {category_id} ===")

    # 搜索候选
    candidates = {}
    for query in config["queries"]:
        print(f"  搜索: {query}")
        try:
            items = github_search(query, per_page=10)
            for item in items:
                full_name = item["full_name"]
                if full_name not in candidates:
                    candidates[full_name] = item
        except Exception as e:
            print(f"    搜索失败: {e}")
        time.sleep(1)

    # 过滤未收录且达到 star 门槛的
    new_repos = [
        repo for full_name, repo in candidates.items()
        if full_name not in existing_notes
        and repo["stargazers_count"] >= config["min_stars"]
    ]
    new_repos.sort(key=lambda r: r["stargazers_count"], reverse=True)
    new_repos = new_repos[:config["max_new"]]

    if not new_repos:
        print(f"  没有新 repo")
        return 0

    print(f"  发现 {len(new_repos)} 个新 repo，开始生成解读...")
    added = 0
    for repo in new_repos:
        full_name = repo["full_name"]
        print(f"  生成: {full_name} (⭐{repo['stargazers_count']})")
        try:
            note = codex_describe(repo)
            print(f"    → {note}")
            existing_notes[full_name] = note
            if full_name not in existing_repos:
                existing_repos.append(full_name)
            added += 1
        except Exception as e:
            print(f"    生成失败: {e}")
        time.sleep(3)

    cat_data["repos"] = existing_repos
    cat_data["notes"] = existing_notes
    return added


def main():
    curated_path = os.path.join(os.path.dirname(__file__), "..", "data", "curated.json")
    with open(curated_path, encoding="utf-8") as f:
        curated = json.load(f)

    total_added = 0
    for category_id, config in CATEGORY_CONFIGS.items():
        added = process_category(category_id, config, curated)
        total_added += added

    with open(curated_path, "w", encoding="utf-8") as f:
        json.dump(curated, f, ensure_ascii=False, indent=2)

    print(f"\n完成！共新增 {total_added} 个 repo，已写入 data/curated.json")


if __name__ == "__main__":
    main()
