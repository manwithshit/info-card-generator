/**
 * Card Screenshot Utility
 * 
 * Converts HTML information cards to PNG images using Playwright.
 * 
 * Usage: node capture_card.js <html-file> [output-png]
 * 
 * Examples:
 *   node capture_card.js card.html
 *   node capture_card.js ./cards/my_card.html ./output/my_card.png
 * 
 * Requirements:
 *   npm install playwright
 *   npx playwright install chromium
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureCard(htmlPath, outputPath) {
    // Resolve paths
    const absoluteHtmlPath = path.isAbsolute(htmlPath)
        ? htmlPath
        : path.resolve(process.cwd(), htmlPath);

    // Check if HTML file exists
    if (!fs.existsSync(absoluteHtmlPath)) {
        console.error(`❌ Error: File not found - ${absoluteHtmlPath}`);
        process.exit(1);
    }

    // Default output path: same directory, same name, .png extension
    const defaultOutputPath = absoluteHtmlPath.replace(/\.html?$/i, '.png');
    const absoluteOutputPath = outputPath
        ? (path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath))
        : defaultOutputPath;

    console.log(`📄 HTML file: ${absoluteHtmlPath}`);
    console.log(`🖼️  Output: ${absoluteOutputPath}`);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport large enough to contain cards
    await page.setViewportSize({ width: 1400, height: 2000 });

    // Open HTML file
    await page.goto(`file://${absoluteHtmlPath}`);

    // Wait for fonts and styles to load
    await page.waitForTimeout(2500);

    // Try to find card container element
    const cardSelectors = [
        '.card-container',
        '.card',
        '.info-card',
        '[data-card]',
        'main',
        'article',
        'body'
    ];

    let card = null;

    for (const selector of cardSelectors) {
        card = await page.$(selector);
        if (card) {
            console.log(`🎯 Found card element: ${selector}`);
            break;
        }
    }

    if (card) {
        // Get element bounds and add padding
        const box = await card.boundingBox();
        if (box) {
            const padding = 40;
            await page.screenshot({
                path: absoluteOutputPath,
                clip: {
                    x: Math.max(0, box.x - padding),
                    y: Math.max(0, box.y - padding),
                    width: box.width + padding * 2,
                    height: box.height + padding * 2
                }
            });
        } else {
            await card.screenshot({ path: absoluteOutputPath });
        }
    } else {
        // Fallback: capture full page
        console.log('⚠️  No card element found, capturing full page');
        await page.screenshot({
            path: absoluteOutputPath,
            fullPage: true
        });
    }

    console.log(`\n✅ Screenshot complete!`);
    console.log(`📁 Saved to: ${absoluteOutputPath}`);

    // Report file size
    const stats = fs.statSync(absoluteOutputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(1);
    console.log(`📊 File size: ${fileSizeKB} KB`);

    await browser.close();
}

// Main entry point
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
📸 Card Screenshot Utility
────────────────────────────────────
Usage: node capture_card.js <html-file> [output-png]

Examples:
  node capture_card.js card.html
  node capture_card.js ./cards/my_card.html ./output/my_card.png

Supported card selectors:
  .card-container, .card, .info-card, [data-card], main, article

Requirements:
  npm install playwright
  npx playwright install chromium
`);
    process.exit(0);
}

const htmlFile = args[0];
const outputFile = args[1];

captureCard(htmlFile, outputFile).catch(err => {
    console.error('❌ Screenshot failed:', err.message);
    process.exit(1);
});
