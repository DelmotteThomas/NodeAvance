const { ZodError } = require('zod');
const { ValidationError } = require('../errors/api-error');

/**
 * Middleware de validation Zod
 * @param {ZodSchema} schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validation + nettoyage
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || error.errors || [];

        const formattedErrors = issues.map(issue => ({
          field: issue.path.join('.') || 'unknown',
          message: issue.message,
        }));

        return next(
          new ValidationError(
            formattedErrors[0]?.message || 'Données invalides'
          )
        );
      }

      next(error);
    }
  };
};

module.exports = validate;
