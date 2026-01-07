/**
 * 通用卡片截图脚本
 * 用法: node capture_card.js <html文件路径> [输出png路径]
 * 
 * 示例:
 *   node capture_card.js ../cards/my_card.html
 *   node capture_card.js /absolute/path/to/card.html /output/path/card.png
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureCard(htmlPath, outputPath) {
    // 解析路径
    const absoluteHtmlPath = path.isAbsolute(htmlPath)
        ? htmlPath
        : path.resolve(process.cwd(), htmlPath);

    // 检查文件是否存在
    if (!fs.existsSync(absoluteHtmlPath)) {
        console.error(`❌ 错误: 找不到文件 ${absoluteHtmlPath}`);
        process.exit(1);
    }

    // 默认输出路径：与HTML同目录，同名但扩展名为.png
    const defaultOutputPath = absoluteHtmlPath.replace(/\.html?$/i, '.png');
    const absoluteOutputPath = outputPath
        ? (path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath))
        : defaultOutputPath;

    console.log(`📄 HTML文件: ${absoluteHtmlPath}`);
    console.log(`🖼️  输出路径: ${absoluteOutputPath}`);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // 设置较大的视口以容纳卡片（支持最大 1200px 宽度 + padding）
    await page.setViewportSize({ width: 1500, height: 1500 });

    // 打开HTML文件
    await page.goto(`file://${absoluteHtmlPath}`);

    // 等待字体和样式加载
    await page.waitForTimeout(2500);

    // 尝试获取卡片容器元素
    const cardSelectors = ['.card-container', '.card', '.info-card', 'main', 'article'];
    let cardSelector = null;

    for (const selector of cardSelectors) {
        const card = await page.$(selector);
        if (card) {
            cardSelector = selector;
            console.log(`🎯 找到卡片元素: ${selector}`);
            break;
        }
    }

    const padding = 40;

    if (cardSelector) {
        // 1. 注入样式：移除所有外边距和 padding，确保 body 紧贴卡片
        await page.addStyleTag({
            content: `
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: transparent !important; /* 背景透明 */
                    width: auto !important;
                    height: auto !important;
                    overflow: hidden !important;
                }
                body {
                    display: inline-block !important; /* 紧贴内容 */
                }
                ${cardSelector} {
                    margin: 0 !important;
                    box-shadow: none !important; /* 移除可能存在的阴影，避免被截断或留白 */
                }
            `
        });

        // 等待样式应用
        await page.waitForTimeout(100);

        // 2. 直接截取卡片元素
        const card = await page.$(cardSelector);
        
        if (card) {
            await card.screenshot({ 
                path: absoluteOutputPath,
                omitBackground: true // 确保背景透明（如果卡片有圆角）
            });
        } else {
            // 降级：全页截图
            await page.screenshot({
                path: absoluteOutputPath,
                fullPage: true,
                omitBackground: true
            });
        }
    } else {
        // 如果找不到特定元素，截取整个页面
        console.log('⚠️  使用全页面截图');
        await page.screenshot({
            path: absoluteOutputPath,
            fullPage: true
        });
    }

    console.log(`\n✅ 截图完成!`);
    console.log(`📁 图片保存至: ${absoluteOutputPath}`);

    // 获取文件大小
    const stats = fs.statSync(absoluteOutputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(1);
    console.log(`📊 文件大小: ${fileSizeKB} KB`);

    await browser.close();
}

// 主程序
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
📸 卡片截图工具
────────────────────────────────────
用法: node capture_card.js <html文件> [输出png文件]

示例:
  node capture_card.js card.html
  node capture_card.js ./cards/my_card.html ./output/my_card.png

支持的卡片容器选择器:
  .card-container, .card, .info-card, main, article
`);
    process.exit(0);
}

const htmlFile = args[0];
const outputFile = args[1];

captureCard(htmlFile, outputFile).catch(err => {
    console.error('❌ 截图失败:', err.message);
    process.exit(1);
});
