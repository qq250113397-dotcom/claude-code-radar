#!/usr/bin/env python3
"""屏蔽名单自检：python3 scripts/check_blocklist.py，全部通过会打印 OK"""

import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from auto_curate import DATA_DIR, is_blocked  # noqa: E402

CASES = [
    ({"full_name": "cirosantilli/china-dictatorship", "topics": ["996", "censorship"]}, True),
    ({"full_name": "someone/new-repo", "topics": ["censorship-circumvention"]}, True),
    ({"full_name": "a/b", "description": "Free Tibet now"}, True),
    ({"full_name": "a/hong-kong-protest-archive"}, True),
    ({"full_name": "a/b", "description": "CCP watch"}, True),
    ({"full_name": "a/b"}, True, "反中共政治宣传库。"),
    ({"full_name": "2dust/v2rayN", "topics": ["proxy"]}, True),
    ({"full_name": "a/b", "description": "A Telegram stealer and keylogger"}, True),
    ({"full_name": "a/b", "topics": ["nsfw"]}, True),
    ({"full_name": "a/b"}, True, "免费节点，一键科学上网"),
    ({"full_name": "a/b", "description": "Clash of code: a coding game"}, False),
    ({"full_name": "anthropics/claude-code", "description": "agentic coding tool", "topics": ["ai"]}, False),
    ({"full_name": "a/b", "description": "build 19960 times, accept"}, False),
    ({"full_name": "a/b"}, False, "一款代码审查工具"),
]

for repo, want, *note in CASES:
    assert is_blocked(repo, note[0] if note else "") == want, (repo, want)

# 已收录数据里不能再有命中的
curated = json.load(open(os.path.join(DATA_DIR, "curated.json"), encoding="utf-8"))
for cat in curated.values():
    for r in cat["repos"]:
        assert not is_blocked({"full_name": r}, cat["notes"].get(r, "")), r

# 网站实际用的 TS 版本跑同一批用例
js = f"""
import {{ isBlocked }} from './lib/blocklist.ts'
for (const [repo, want, note] of {json.dumps(CASES, ensure_ascii=False)}) {{
  if (isBlocked({{ topics: [], ...repo }}, note) !== want) throw new Error(JSON.stringify(repo))
}}
"""
root = os.path.join(os.path.dirname(__file__), "..")
subprocess.run(["node", "--no-warnings", "--input-type=module", "-e", js], cwd=root, check=True)
print("OK")
