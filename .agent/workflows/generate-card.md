---
description: 将文案或链接内容转换为精美的HTML信息卡片图片
---

# 文案/链接 转 精美信息卡片图片

当用户发送一段文案、一个Markdown文件、或一个URL链接时，自动生成精美的HTML信息卡片并截图保存为PNG图片。

## 触发方式

用户可能会说：
- `/generate-card <URL或内容>`
- "帮我生成信息卡片"
- "把这个链接做成卡片"
- "帮我把这段文字做成信息图"

## 工作流步骤

### 1. 判断内容来源类型及获取优先级

根据用户输入判断内容来源并按优先级获取：

**情况 A：纯文本或 Markdown 文件**
- 直接使用内容，保存到 `input/` 目录。

**情况 B：URL 链接**

按以下优先级尝试获取内容：
1. **视频类链接**（YouTube, B站等）：使用 NotebookLM 或视频摘要工具。
2. **普通网页**：优先使用 `read_url_content` 快速抓取。
3. **反爬网页**：如上述失败，使用 `browser_subagent` 模拟浏览器访问。
4. **最终兜底**：如都无法获取，请求用户手动提供内容或使用 NotebookLM。

### 2. 保存原始内容

将获取的内容保存为 Markdown 文件到 `input/` 目录：
- 文件名格式：`主题名_简短描述.md`
- 包含：标题、来源 URL、提取时间、正文内容

### 3. 提炼核心信息

从内容中提炼：
- **标题**：简洁有力的主题
- **标签**：2-4 个关键词
- **执行摘要**：2-3 句话概括核心观点
- **核心要点**：4-6 个主要观点（每个带标题和描述）
- **金句语录**：如有精彩引用
- **数据/统计**：如有关键数字
- **来源信息**：原文出处

**重要原则**：保留信息密度，不要过度精简！用视觉层次区分主次。

### 4. 设计卡片风格

根据内容主题选择合适的视觉风格：

| 内容类型 | 推荐风格 |
|----------|----------|
| 技术教程 | Cyberpunk / Terminal / Neon |
| 商业分析 | Editorial / Financial / Dark Gold |
| 系统架构 | Blueprint / Schematic / Grid |
| 知识管理 | Minimalist / Typography |
| 产品发布 | Material Design 3 / Vibrant |
| 创业案例 | Growth Hacker / Dark Tech |

**设计规范**：
- 宽度：900px
- 高度：根据内容自然延伸
- 避免：Arial, Inter, Roboto 等通用字体
- 避免：紫色渐变等 AI 烂大街配色
- 确保：有 `.card-container` 类名包裹整个卡片

### 5. 生成 HTML 卡片

创建输出目录并生成 HTML 文件：

```bash
mkdir -p output/cards/{card_name}
```

将 HTML 保存到：`output/cards/{card_name}/{card_name}.html`

### 6. 截图生成 PNG

运行截图脚本：

```bash
cd output/cards/{card_name}
node ../../../scripts/capture_card.js {card_name}.html
```

输出：`output/cards/{card_name}/{card_name}.png`

### 7. 完成报告

向用户报告：
- Markdown 文件位置
- HTML 文件位置
- PNG 图片位置
- 文件大小

## 卡片 HTML 结构参考

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>卡片标题</title>
    <style>
        .card-container {
            width: 900px;
            /* 其他样式 */
        }
    </style>
</head>
<body>
    <div class="card-container">
        <!-- 头部：标签、标题、副标题 -->
        <!-- 摘要区 -->
        <!-- 核心要点区 -->
        <!-- 引用区 -->
        <!-- 数据区 -->
        <!-- 页脚：来源信息 -->
    </div>
</body>
</html>
```

## 注意事项

1. **信息密度**：宁可内容多一些，也不要过度精简
2. **视觉层次**：用字号、颜色、间距区分信息优先级
3. **独特设计**：每张卡片的风格应该与内容匹配，避免千篇一律
4. **中文适配**：使用 Noto Sans SC 等中文友好字体
