import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const VIEWPORTS = [
  { name: '320px (iPhone SE/5)', width: 320, height: 667 },
  { name: '375px (iPhone mini/SE2/X)', width: 375, height: 812 },
  { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '414px (iPhone Plus/XR/Max)', width: 414, height: 896 },
  { name: '768px (iPad Mini/Air portrait)', width: 768, height: 1024 },
  { name: '1024px (iPad Pro/Desktop small)', width: 1024, height: 1366 }
];

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Product Detail', path: '/product/royal-heritage-kundan-bridal-necklace' },
  { name: 'Custom Sample', path: '/custom-sample' },
  { name: 'Gold Rates', path: '/gold-rates' },
  { name: 'Diwali Offers', path: '/diwali-offers' },
  { name: 'Admin Dashboard', path: '/admin' }
];

async function runAudit() {
  console.log('Starting Deep Mobile Responsiveness Audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const matrixReport = [];

  for (const p of PAGES) {
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 1024 });
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.warn(`Timeout for ${p.path}:`, e.message));
      await new Promise(r => setTimeout(r, 400));

      const res = await page.evaluate((vpWidth) => {
        const winWidth = window.innerWidth;
        const docScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasHorizontalOverflow = docScrollWidth > winWidth + 1 || bodyScrollWidth > winWidth + 1;

        // Check if any element sticks past viewport
        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          if (['SCRIPT', 'STYLE', 'path', 'svg'].includes(el.tagName)) return;
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1.5 && rect.width > 0 && rect.height > 0) {
            overflowing.push({
              tag: el.tagName,
              className: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
              right: Math.round(rect.right),
              text: el.innerText ? el.innerText.trim().slice(0, 20) : ''
            });
          }
        });

        // Form controls font-size < 16px on mobile viewports (< 640px)
        const smallInputs = [];
        if (winWidth < 640) {
          document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type === 'hidden' || el.classList.contains('hidden')) return;
            const style = window.getComputedStyle(el);
            if (parseFloat(style.fontSize) < 15.5) {
              smallInputs.push({
                tag: el.tagName,
                name: el.name || el.placeholder || el.id,
                fontSize: style.fontSize
              });
            }
          });
        }

        // Broken images
        const brokenImages = [];
        document.querySelectorAll('img').forEach(img => {
          if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
            brokenImages.push({ src: img.src.slice(0, 60) });
          }
        });

        // Text smaller than 10px
        const unreadableText = [];
        document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, label').forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          if (parseFloat(style.fontSize) < 9.5 && el.innerText && el.innerText.trim().length > 0) {
            unreadableText.push({
              tag: el.tagName,
              fontSize: style.fontSize,
              text: el.innerText.trim().slice(0, 25)
            });
          }
        });

        return {
          winWidth,
          docScrollWidth,
          hasHorizontalOverflow,
          overflowCount: overflowing.length,
          smallInputsCount: smallInputs.length,
          brokenImagesCount: brokenImages.length,
          unreadableTextCount: unreadableText.length,
          unreadableItems: unreadableText.slice(0, 3)
        };
      }, vp.width);

      matrixReport.push({
        page: p.name,
        viewport: vp.name,
        width: vp.width,
        ...res
      });

      console.log(`[${p.name.padEnd(16)}] @ ${vp.name.padEnd(30)} -> Overflow: ${res.hasHorizontalOverflow ? 'FAIL' : 'PASS'} | ZoomRisk: ${res.smallInputsCount} | BrokenImgs: ${res.brokenImagesCount} | Sub10pxText: ${res.unreadableTextCount}`);
    }
  }

  // Interactive tests:
  console.log('\n--- Running Interactive Tests ---');

  // 1. Mobile Menu test at 320px and 375px
  for (const w of [320, 375]) {
    await page.setViewport({ width: w, height: 667, isMobile: true });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const hamburger = await page.$('button[aria-label="Toggle navigation menu"]');
    if (hamburger) {
      await hamburger.click();
      await new Promise(r => setTimeout(r, 400));

      const menuAudit = await page.evaluate((vpW) => {
        const menu = document.querySelector('header .bg-ivory');
        if (!menu) return { success: false, reason: 'Menu drawer element not found' };
        const rect = menu.getBoundingClientRect();
        const overflow = rect.right > vpW + 1;
        const links = Array.from(menu.querySelectorAll('a, button')).map(a => ({
          text: a.innerText.trim().slice(0, 25),
          h: Math.round(a.getBoundingClientRect().height)
        }));
        return {
          success: true,
          width: Math.round(rect.width),
          overflow,
          linksCount: links.length,
          allLinksMeetTouchTarget: links.every(l => l.h >= 40),
          links
        };
      }, w);
      console.log(`Mobile Menu Toggle @ ${w}px:`, JSON.stringify(menuAudit, null, 2));
    }
  }

  // 2. Price Breakdown Modal test at 320px
  await page.setViewport({ width: 320, height: 600, isMobile: true });
  await page.goto(`${BASE_URL}/collections`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  const modalOpened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Breakdown') || b.title?.includes('Breakdown'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (modalOpened) {
    await new Promise(r => setTimeout(r, 400));
    const modalAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return { success: false, reason: 'Modal role="dialog" not found' };
      const rect = modal.getBoundingClientRect();
      const style = window.getComputedStyle(modal);
      const isScrollable = modal.scrollHeight >= modal.clientHeight;
      return {
        success: true,
        modalWidth: Math.round(rect.width),
        modalHeight: Math.round(rect.height),
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        fitsHorizontally: rect.width <= window.innerWidth,
        fitsVertically: rect.height <= window.innerHeight,
        isScrollable
      };
    });
    console.log('Price Breakdown Modal @ 320px:', JSON.stringify(modalAudit, null, 2));
  }

  // 3. Admin Dashboard Tab Navigation & Add Product Modal at 375px
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  // Perform login
  const usernameInput = await page.$('input[type="text"]');
  const passwordInput = await page.$('input[type="password"]');
  if (usernameInput && passwordInput) {
    await usernameInput.type('admin');
    await passwordInput.type('DiwaliGold2026!');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1000));
  }

  const adminAudit = await page.evaluate(() => {
    // Check if dashboard loaded
    const metricsCards = document.querySelectorAll('.grid.grid-cols-2');
    const mobileCards = document.querySelectorAll('.md\\:hidden .border.border-ivory-border');
    const desktopTable = document.querySelector('.hidden.md\\:block table');
    return {
      loggedIn: metricsCards.length > 0,
      metricsCount: metricsCards.length,
      mobileCardsCount: mobileCards.length,
      desktopTableHiddenOnMobile: desktopTable ? window.getComputedStyle(desktopTable.parentElement).display === 'none' : true
    };
  });
  console.log('Admin Dashboard Mobile View @ 375px:', JSON.stringify(adminAudit, null, 2));

  // Open Add Product Modal in Admin
  const addBtnClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Add New Jewellery Item'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (addBtnClicked) {
    await new Promise(r => setTimeout(r, 400));
    const addModalAudit = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0 .bg-white.rounded-2xl');
      if (!modal) return { success: false };
      const rect = modal.getBoundingClientRect();
      const formBody = modal.querySelector('.overflow-y-auto');
      return {
        success: true,
        modalWidth: Math.round(rect.width),
        modalHeight: Math.round(rect.height),
        windowHeight: window.innerHeight,
        fitsVertically: rect.height <= window.innerHeight,
        hasInnerScroll: !!formBody
      };
    });
    console.log('Admin Add Product Modal @ 375px:', JSON.stringify(addModalAudit, null, 2));
  }

  fs.writeFileSync('audit-matrix-report.json', JSON.stringify({ matrixReport, timestamp: new Date().toISOString() }, null, 2));
  console.log('\nAudit complete! Saved to frontend/audit-matrix-report.json');
  await browser.close();
}

runAudit().catch(err => {
  console.error('Audit script error:', err);
  process.exit(1);
});
