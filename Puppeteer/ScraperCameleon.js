const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// --- CONFIG ---
const START_URL = process.env.URL || "http://books.toscrape.com/";
const OUTPUT_BASE_DIR = path.join(__dirname, "output");

function slugify(url) {
  return url.replace(/^https?:\/\//, "").replace(/[\/:?<>|*"\\]/g, "_");
}

function prepareOutputDirectory(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  console.log(`🚀 Scraper Caméléon v2.0 sur : ${START_URL}`);

  // Met headless: false pour voir les cadres rouges en direct !
  const browser = await puppeteer.launch({
    headless: false, 
    args: ["--window-size=1280,1000"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  const siteDir = path.join(OUTPUT_BASE_DIR, slugify(START_URL));
  prepareOutputDirectory(siteDir);

  await page.goto(START_URL, { waitUntil: "networkidle2" });

  let toutesLesDonnees = [];
  let hasNextPage = true;
  let pageCount = 1;

  while (hasNextPage) {
    console.log(`🔍 Analyse de la page ${pageCount}...`);

    const pageData = await page.evaluate(() => {
      // Regex universelle pour les prix (ex: £25.00, 25.00€, 25€99, 25.00)
      const priceRegex = /([£$€]\s?\d+[.,]\d{0,2})|(\d+[.,]\d{0,2}\s?[£$€])|(\d+[€$£]\d{2})/;
      
      // On cible les conteneurs qui ont souvent des produits
      const selectors = 'article, li, .product, [class*="product"], [class*="item"], div[style*="display: block"]';
      let candidates = Array.from(document.querySelectorAll(selectors));
      
      // Si rien n'est trouvé, on se rabat sur toutes les div
      if (candidates.length < 5) candidates = Array.from(document.querySelectorAll('div'));

      const results = [];

      candidates.forEach((el) => {
        const text = el.innerText || "";
        const rect = el.getBoundingClientRect();
        
        // Critères d'ADN d'un produit
        const hasPrice = priceRegex.test(text);
        const hasLink = el.querySelector("a");
        const isVisible = rect.height > 50 && rect.width > 50;

        if (hasPrice && hasLink && isVisible) {
          // Visual Feedback : On marque ce qu'on a trouvé
          el.style.border = "3px solid red";
          el.style.position = "relative";

          const img = el.querySelector("img");
          const links = Array.from(el.querySelectorAll("a"));
          
          // On cherche le lien qui contient probablement le titre
          const titleLink = links.reduce((a, b) => 
            a.innerText.trim().length > b.innerText.trim().length ? a : b, { innerText: "" });

          const foundPrice = text.match(priceRegex);

          results.push({
            title: titleLink.innerText.trim().split('\n')[0] || "Inconnu",
            price: foundPrice ? foundPrice[0] : "N/A",
            image: img ? img.src : null,
            url: titleLink.href || null,
          });
        }
      });

      // Nettoyage : supprimer les doublons (même titre et même prix au même endroit)
      return results.filter((item, index, self) =>
        index === self.findIndex((t) => t.title === item.title && t.price === item.price)
      );
    });

    toutesLesDonnees.push(...pageData);
    console.log(`✅ ${pageData.length} produits trouvés sur cette page.`);

    // PAGINATION
    const nextButton = await page.evaluateHandle(() => {
      const btnSelectors = ['a', 'button', 'span'];
      return Array.from(document.querySelectorAll(btnSelectors.join(','))).find(el => {
        const t = el.innerText.toLowerCase();
        return (t.includes("next") || t.includes("suivant") || t.includes("›") || t.includes("»")) 
               && el.getBoundingClientRect().height > 0;
      });
    });

    if (nextButton && (await nextButton.asElement())) {
      console.log("➡️ Passage à la page suivante...");
      pageCount++;
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 8000 }).catch(() => {}),
        nextButton.asElement().click(),
      ]);
      await new Promise((r) => setTimeout(r, 1500)); // Pause pour laisser le rendu se faire
    } else {
      console.log("🏁 Fin de la pagination.");
      hasNextPage = false;
    }
  }

  const outputFile = path.join(siteDir, "data.json");
  fs.writeFileSync(outputFile, JSON.stringify({
    site: START_URL,
    total: toutesLesDonnees.length,
    date: new Date().toLocaleString(),
    results: toutesLesDonnees
  }, null, 2));

  console.log(`\n📦 Terminé ! ${toutesLesDonnees.length} produits dans ${outputFile}`);
  
  // On laisse le navigateur ouvert 5 secondes pour voir le résultat visuel final
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();