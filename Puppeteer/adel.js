const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // On commence par la première page
    await page.goto('http://books.toscrape.com/');

    let toutesLesDonnees = [];
    let hasNextPage = true;

    while (hasNextPage) {
        // Extraction des données de la page actuelle (Étape 3 du TP)
        const pageData = await page.evaluate(() => {
            const books = Array.from(document.querySelectorAll('.product_pod'));
            return books.map(book => ({
                title: book.querySelector('h3 a').getAttribute('title'),
                price: book.querySelector('.price_color').innerText
            }));
        });

        tousLesDonnees.push(...pageData);
        console.log(`Page scrapée. Total cumulé : ${tousLesDonnees.length} livres.`);

        // AUTOMATISATION : On cherche le bouton "Next"
        const nextButton = await page.$('.next a');

        if (nextButton) {
            // S'il existe, on clique et on attend que la navigation soit finie
            await Promise.all([
                page.waitForNavigation(), 
                nextButton.click()
            ]);
        } else {
            // S'il n'y a plus de bouton Next, on sort de la boucle
            hasNextPage = false;
        }
    }

    console.log("Scan terminé ! Nombre total de livres récupérés :", tousLesDonnees.length);
    
    // On pourrait ici enregistrer toutesLesDonnees dans un fichier JSON
    await browser.close();
})();