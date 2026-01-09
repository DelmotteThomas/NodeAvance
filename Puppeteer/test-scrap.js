const puppeteer = require('puppeteer');

(async () => {
    // 1. Lancement du navigateur
    // (headless: false permet de le voir s'ouvrir)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 2. Navigation
    await page.goto('http://books.toscrape.com/');

    // 3. Extraction des données (La Boîte Noire)
    // S'éxécute dans le contexte du navigateur
    const result = await page.evaluate(() => {
        // Ce log s'affiche dans la console du NAVIGATEUR (F12), pas dans ton terminal
        console.log('Je suis dans le navigateur'); 

        const titre = document.title;
        const nombreProduits = document.querySelectorAll('.product_pod').length;

        return {
            titrePage: titre,
            nbProduits: nombreProduits
        };
    });

    // Affichage du résultat dans ton terminal Node
    console.log(result);

    // 4. Fermeture
    await browser.close();
})();