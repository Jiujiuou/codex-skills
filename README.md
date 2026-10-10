# Codex Skills

个人可复用技能集合。

## scroll-report

用于 HTML + GSAP 汇报页的滚动叙事技能，提供五种讲解模式及通用代码示例。

- 技能入口：[SKILL.md](skills/scroll-report/SKILL.md)
- 演示：[starter.html](skills/scroll-report/assets/starter.html)（与同目录 JS 一起使用；GSAP 从 CDN 加载）
- 不包含原始业务汇报、凭据或 Wahda Logo 文件；品牌色只是可选配置。

### 安装

将 `skills/scroll-report` 整个目录复制到 `~/.codex/skills/scroll-report`。重新打开 Codex 后可使用 `$scroll-report`。

也可在 Codex 中使用 skill-installer，指定本仓库地址和路径 `skills/scroll-report`。私有仓库安装者需要对应读取权限。

### 使用示例

> 使用 $scroll-report，把我提供的项目方案整理成 HTML 汇报页。摘要每次滚动切换一个重点，架构先总览再逐层聚焦，小屏保留平铺。

> 使用 $scroll-report，改进现有汇报页的六宫格：滚动展开当前卡片覆盖完整网格，再收回并切换下一项。沿用当前品牌配色。
