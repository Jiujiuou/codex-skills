# Codex Skills

个人可复用技能集合。

## miniapp-wireframe

根据产品用途、核心功能和主要流程设计小程序 UI，交付细线、留白风格的完整 HTML 交互线稿。默认一个独立文件，自动适配横竖屏，并提供手动方向预览；编辑内容共用一份状态。

- 技能入口：[SKILL.md](skills/miniapp-wireframe/SKILL.md)
- 可直接打开的单文件案例：[reference.html](skills/miniapp-wireframe/assets/reference.html)
- 案例为包装纸工具，业务与价格仅作示意，不包含真实支付、后台或用户照片。
- 将 `skills/miniapp-wireframe` 复制到 `~/.codex/skills/miniapp-wireframe`，或使用 skill-installer 指定本仓库及路径 `skills/miniapp-wireframe`。私有仓库需要读取权限。

### 使用示例

> 使用 $miniapp-wireframe，为家庭记账小程序设计完整 HTML 交互线稿。用户主要是夫妻，核心功能是快速记账、月度统计、家庭共享；MVP 暂不做预算和银行同步。默认竖屏，具体页面和布局由你设计。

提供产品用途和核心功能即可开始；已确定的流程、收费规则、布局偏好及排除项也可补充。无需提前指定每个按钮的位置。

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
