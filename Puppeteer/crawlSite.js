/**
 * Refactored Crawler - Google Inc. (Original Author: Eric Bidelman)
 * Updated for Node.js 14+ (No 'del' dependency needed)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

// Configuration via variables d'environnement ou arguments
const URL_START = process.env.URL || 'http://books.toscrape.com/';
const SCREENSHOTS = process.argv.includes('--screenshots');
const DEPTH = parseInt(process.env.DEPTH) || 2;
const OUT_DIR = process.env.OUTDIR || path.join('output', slugify(URL_START));

const crawledPages = new Map();

/**
 * Nettoie une URL pour en faire un nom de dossier/fichier valide
 */
function slugify(str) {
  return str.replace(/[\/:]/g, '_');
}

/**
 * Crée récursivement un dossier et le nettoie s'il existe déjà
 */
function prepareOutputDirectory(dir) {
  if (fs.existsSync(dir)) {
    // Utilisation du mode natif Node.js pour supprimer
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Script injecté dans la page pour trouver tous les liens (Shadow DOM inclus)
 */
function collectAllSameOriginAnchorsDeep(sameOrigin = true) {
  const allElements = [];
  const findAllElements = (nodes) => {
    for (let i = 0, el; (el = nodes[i]); ++i) {
      allElements.push(el);
      if (el.shadowRoot) {
        findAllElements(el.shadowRoot.querySelectorAll('*'));
      }
    }
  };

  findAllElements(document.querySelectorAll('*'));

  const filtered = allElements
    .filter(el => el.localName === 'a' && el.href)
    .filter(el => el.href !== location.href)
    .filter(el => {
      if (sameOrigin) {
        return new URL(location).origin === new URL(el.href).origin;
      }
      return true;
    })
    .map(a => a.href);

  return Array.from(new Set(filtered));
}

/**
 * Fonction de crawl récursive
 */
async function crawl(browser, pageData, depth = 0) {
  if (depth > DEPTH) return;

  if (crawledPages.has(pageData.url)) {
    console.log(`[Cache] Réutilisation : ${pageData.url}`);
    const cached = crawledPages.get(pageData.url);
    Object.assign(pageData, cached);
    return;
  }

  console.log(`[${depth}] Chargement : ${pageData.url}`);
  const page = await browser.newPage();
  
  try {
    // Configuration du viewport si screenshots activés
    if (SCREENSHOTS) {
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    }

    await page.goto(pageData.url, { waitUntil: 'networkidle2', timeout: 30000 });

    const anchors = await page.evaluate(collectAllSameOriginAnchorsDeep);
    pageData.title = await page.evaluate('document.title');
    pageData.children = anchors
        .filter(url => url !== URL_START)
        .map(url => ({ url }));

    if (SCREENSHOTS) {
      const fileName = `${slugify(pageData.url)}.png`;
      const filePath = path.join(OUT_DIR, fileName);
      
      let imgBuff = await page.screenshot({ fullPage: false });
      // Redimensionnement haute performance avec Sharp
      imgBuff = await sharp(imgBuff).resize({ height: 150 }).toBuffer();
      
      await fs.promises.writeFile(filePath, imgBuff);
      pageData.img = `data:image/png;base64,${imgBuff.toString('base64')}`;
    }

    crawledPages.set(pageData.url, pageData);

    // Crawl des pages enfants en parallèle
    for (const child of pageData.children) {
      await crawl(browser, child, depth + 1);
    }

  } catch (err) {
    console.error(`Erreur sur ${pageData.url}: ${err.message}`);
  } finally {
    await page.close();
  }
}

// --- Point d'entrée principal ---
(async () => {
  console.log(`Démarrage du crawl sur : ${URL_START}`);
  
  prepareOutputDirectory(OUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new" // Utilise le nouveau mode headless de Puppeteer
  });

  try {
    const root = { url: URL_START };
    await crawl(browser, root);

    const resultPath = path.join(OUT_DIR, 'crawl.json');
    await fs.promises.writeFile(resultPath, JSON.stringify(root, null, 2));
    
    console.log(`\nCrawl terminé !`);
    console.log(`Résultats sauvegardés dans : ${resultPath}`);
  } catch (err) {
    console.error(`Erreur fatale : ${err.message}`);
  } finally {
    await browser.close();
  }
})();