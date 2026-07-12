const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });
  
  await page.setExtraHTTPHeaders({
      'Referer': 'https://www.fullhdfilmizlesene.life/'
  });

  console.log("Navigating to rapidvid...");
  await page.goto('https://rapidvid.net/vod/v1xec243c91', { waitUntil: 'networkidle' });
  
  const content = await page.content();
  console.log("Length:", content.length);
  
  const fs = require('fs');
  fs.writeFileSync('rapidvid.html', content);
  console.log("Saved rapidvid.html");
  
  await browser.close();
})();
