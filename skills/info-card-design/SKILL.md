---
name: info-card-design
description: Design and generate visually striking information cards from articles, notes, or URLs. Use this skill when users want to: (1) create shareable visual summaries of articles, (2) turn web content into infographics, (3) make knowledge cards from text, (4) generate PNG images from written content, (5) visualize key points from long-form content. Triggers on phrases like "make a card", "create infographic", "visualize this article", "信息卡片", "做成卡片", "生成信息图".
---

# Information Card Design Skill

Transform text, articles, or URLs into beautiful, high-information-density visual cards.

## When to Use This Skill

Use this skill when the user wants to:
- Create a visual summary of an article or document
- Turn notes into a shareable image
- Generate an infographic from text content
- Make a "knowledge card" or "info card"
- Visualize key points from long-form content

## Design Principles

### 1. Content Density (Critical)

**Preserve information richness.** Do NOT over-simplify:
- If the source has 7 key points, keep all 7
- Include sub-points and detailed descriptions
- Use visual hierarchy to differentiate, not deletion

### 2. Visual Hierarchy

| Level | Treatment |
|-------|-----------|
| Primary | Large font (20-36px), bold weight, prominent position |
| Secondary | Medium font (14-16px), regular weight, supporting position |
| Details | Small font (11-13px), muted color, list format |

### 3. Card Structure

```
┌────────────────────────────────────────┐
│  Tags + Title + Subtitle               │
├────────────────────────────────────────┤
│  Executive Summary (2-3 sentences)     │
├────────────────────────────────────────┤
│  Key Points × 4-6 (with descriptions)  │
├────────────────────────────────────────┤
│  Featured Quote (if applicable)        │
├────────────────────────────────────────┤
│  Stats / Data Points                   │
├────────────────────────────────────────┤
│  Source Information                    │
└────────────────────────────────────────┘
```

### 4. Technical Specifications

- **Width**: 900px (fixed)
- **Height**: Auto (extends with content)
- **Container class**: `.card-container` (required for screenshot)
- **Output format**: HTML → PNG

### 5. Style Selection

Match design style to content theme:

| Content Type | Recommended Style |
|--------------|-------------------|
| Tech / Programming | Cyberpunk, Terminal, Neon grid |
| Business / Finance | Editorial, Dark gold, Corporate |
| Architecture / System | Blueprint, Schematic |
| Knowledge / Notes | Minimalist, Typography-focused |
| Products / Launches | Material Design 3, Vibrant |
| Startups / Growth | Growth Hacker, Dark tech |

### 6. Aesthetics to AVOID

❌ Overused fonts: Inter, Roboto, Arial, system fonts
❌ Cliché colors: Purple gradients on white backgrounds
❌ Generic layouts: Cookie-cutter patterns
❌ Low information density: Too much white space, too few details

### 7. Aesthetics to EMBRACE

✅ Distinctive typography (Outfit, Space Mono, Crimson Pro)
✅ Bold, intentional color palettes
✅ Atmospheric backgrounds (grids, textures, gradients)
✅ Rich content with clear visual separation

## Workflow Integration

This skill works with `.agent/workflows/generate-card.md` which defines:
1. Content acquisition (URL fetch, browser automation, manual input)
2. Content extraction and structuring
3. HTML card generation
4. PNG screenshot via Playwright

## Output Locations

- Markdown source: `input/{card_name}.md`
- HTML card: `output/cards/{card_name}/{card_name}.html`
- PNG image: `output/cards/{card_name}/{card_name}.png`

## Screenshot Script

Use `scripts/capture_card.js` to convert HTML to PNG:

```bash
node scripts/capture_card.js path/to/card.html
```
