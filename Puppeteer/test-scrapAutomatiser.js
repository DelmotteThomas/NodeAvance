const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// --- CONFIG ---
const START_URL = "http://books.toscrape.com/";
const OUTPUT_BASE_DIR = path.join(__dirname, "output");

// --- UTILS ---
function slugify(url) {
  return url.replace(/^https?:\/\//, "").replace(/[\/:?<>|*"\\]/g, "_");
}

function prepareOutputDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/120.0.0.0 Safari/537.36"
  );
  function delay(min = 800, max = 2500) {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // 📁 Préparation du dossier output/<site>
  const siteDir = path.join(OUTPUT_BASE_DIR, slugify(START_URL));
  prepareOutputDirectory(siteDir);

  // On commence par la première page
  await page.goto(START_URL);
  await delay();
  let toutesLesDonnees = [];
  let hasNextPage = true;

  while (hasNextPage) {
    // Extraction des données de la page actuelle
    const pageData = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight / 2);
      const books = Array.from(document.querySelectorAll(".product_pod"));

      return books.map((book) => {
        const title = book
            .querySelector("h3 a")
            ?.getAttribute("title")
            ?.trim();

        const price = book
          .querySelector(".price_color")
          ?.innerText?.replace("£", "")
          .trim();

        const stock = book
          .querySelector(".instock.availability")
          ?.innerText.replace(/\s+/g, " ")
          .trim();
          
        const imgSrc = book.querySelector("img")?.getAttribute("src");
        return {
          title,
          price,
          stock,
          image: imgSrc,
        };
      });
    });
    await delay(500, 1200);

    toutesLesDonnees.push(...pageData);
    console.log(
      `📄 Page scrapée. Total cumulé : ${toutesLesDonnees.length} livres.`
    );

    // AUTOMATISATION : bouton "Next"
    const nextButton = await page.$(".next a");

    if (nextButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        nextButton.click(),
      ]);
    } else {
      hasNextPage = false;
    }
  }
  const BASE_URL = "http://books.toscrape.com/";

  toutesLesDonnees.forEach((book) => {
    if (book.image) {
      book.image = BASE_URL + book.image.replace("../", "");
    }
  });

  console.log(
    "✅ Scan terminé ! Nombre total de livres récupérés :",
    toutesLesDonnees.length
  );

  // 💾 Sauvegarde JSON dans output/<site>/books.json
  const outputFile = path.join(siteDir, "books.json");
  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      {
        site: START_URL,
        scrapedAt: new Date().toISOString(),
        scrapedAtLocal: new Date().toLocaleString("fr-BE"),
        total: toutesLesDonnees.length,
        books: toutesLesDonnees,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`📁 Fichier JSON généré : ${outputFile}`);

  await browser.close();
})();
