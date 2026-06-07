import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Code 雷达 · AI 编程工具榜单",
  description: "追踪 GitHub 上 Claude Code、MCP、AI Agent 等领域的热门开源项目，每小时自动更新。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
