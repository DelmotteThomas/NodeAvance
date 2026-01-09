import { exportProducts, importProducts } from "../services/product.service.js";

export async function importProductsController(req, res, next) {
  try {
    // 1. Vérification basique du Content-Type (Sécurité)
    // On veut du binaire brut ou du csv
    const contentType = req.headers["content-type"];
    if (
      !contentType ||
      (!contentType.includes("text/csv") &&
        !contentType.includes("application/octet-stream"))
    ) {
      // Note: Pour ce TP on accepte large, mais en prod soyez stricts
      console.warn("⚠️ Content-Type inhabituel pour import CSV:", contentType);
      
    }
    // 2. Délégation au service 
    // On passe 'req' directement car c'est un Readable Stream !
    await importProducts(req);
    // 3. Réponse au client réussie
      res.status(201).json({ message: "Produits importés avec succès" });
  } catch (e) {
    next(e);
  }
}

export async function exportProductsController(req, res, next) {
  try {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");

    await exportProducts(res);
  } catch (e) {
    next(e);
  }
}
