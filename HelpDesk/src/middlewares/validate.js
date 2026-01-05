const { ZodError } = require('zod');

const validate = (schema) => {
  // Retourne un middleware Express standard (req, res, next)
  return (req, res, next) => {
    try {
      // 1. Parsing et Validation
      // La méthode .parse() lance une exception si les données sont invalides.
      // Elle retourne également les données "nettoyées" (sans champs inconnus).
      req.body = schema.parse(req.body);
      // 2. Succès : Passage au middleware suivant
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || error.errors || [];
        const formattedErrors = issues.map(issue  => ({
          field: issue .path.join('.') || 'Clé inconnuee',
          message: issue .message,
        }));

        return res.status(400).json({
          status: 'error',
          message: formattedErrors[0]?.message || 'Données invalides',
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Erreur du serveur',
      });
    }
  };
};
        
module.exports = validate;