# 这个目录用于存放生成的卡片

每个卡片会有自己的子目录，包含：
- `{card_name}.html` - HTML 源文件
- `{card_name}.png` - 截图图片

## 目录结构示例

```
output/
└── cards/
    ├── agencize_ai_interview/
    │   ├── agencize_ai_interview.html
    │   └── agencize_ai_interview.png
    └── note_taking_trends_2026/
        ├── note_taking_trends_2026.html
        └── note_taking_trends_2026.png
```

## 手动截图

如果需要重新截图，进入卡片目录运行：

```bash
cd output/cards/{card_name}
node ../../../scripts/capture_card.js {card_name}.html
```
