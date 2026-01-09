import { Transform } from 'stream';

export default class ProductValidationTransform extends Transform {
  constructor(options = {}) {
    // objectMode = on manipule des objets JS (pas des buffers)
    super({ ...options, objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    try {
      //  1 Nettoyage
      const name = chunk.name ? chunk.name.trim() : '';
      const description = chunk.description ? chunk.description.trim() : '';

      //  2 Validation du prix (champ obligatoire)
      const price = parseFloat(chunk.price);
      // Vérifier si le prix existe et est un nombre valide
      if (chunk.price === undefined || chunk.price === null || isNaN(price) || price < 0) {
        // Ligne ignorée silencieusement
        return callback();
      }

      // 3 Validation du stock
      let stock = parseInt(chunk.stock, 10);
      if (isNaN(stock) || stock < 0) {
        stock = 0;
      }

      // 4 Reconstruction de l'objet propre
      const cleanProduct = {
        name,
        price,
        stock,
        description,
        isArchived: chunk.isArchived === 'true',
      };

      // Envoi au prochain stream
      this.push(cleanProduct);
      // On signale qu'on est prêt à recevoir la suite
      callback();

    } catch (error) {
      callback(error);
    }
  }
}
