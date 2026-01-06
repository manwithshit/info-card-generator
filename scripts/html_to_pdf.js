/**
 * HTML to PDF Converter
 * 
 * Converts HTML files to PDF using Playwright.
 * 
 * Usage: node html_to_pdf.js <html-file> [output-pdf]
 * 
 * Requirements:
 *   npm install playwright
 *   npx playwright install chromium
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function htmlToPdf(htmlPath, outputPath) {
    const absoluteHtmlPath = path.isAbsolute(htmlPath)
        ? htmlPath
        : path.resolve(process.cwd(), htmlPath);

    if (!fs.existsSync(absoluteHtmlPath)) {
        console.error(`❌ Error: File not found - ${absoluteHtmlPath}`);
        process.exit(1);
    }

    const defaultOutputPath = absoluteHtmlPath.replace(/\.html?$/i, '.pdf');
    const absoluteOutputPath = outputPath
        ? (path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath))
        : defaultOutputPath;

    console.log(`📄 HTML file: ${absoluteHtmlPath}`);
    console.log(`📑 Output: ${absoluteOutputPath}`);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(`file://${absoluteHtmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.pdf({
        path: absoluteOutputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '15mm',
            right: '15mm',
            bottom: '15mm',
            left: '15mm'
        }
    });

    console.log(`\n✅ PDF generated!`);
    console.log(`📁 Saved to: ${absoluteOutputPath}`);

    const stats = fs.statSync(absoluteOutputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(1);
    console.log(`📊 File size: ${fileSizeKB} KB`);

    await browser.close();
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
📑 HTML to PDF Converter
────────────────────────────────────
Usage: node html_to_pdf.js <html-file> [output-pdf]

Examples:
  node html_to_pdf.js document.html
  node html_to_pdf.js ./docs/report.html ./output/report.pdf
`);
    process.exit(0);
}

htmlToPdf(args[0], args[1]).catch(err => {
    console.error('❌ PDF generation failed:', err.message);
    process.exit(1);
});
