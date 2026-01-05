const xss = require("xss");

// Fonction récursive pour nettoyer les objets imbriqués
const clean = (data) => {
  if (!data) return data;
  if (typeof data === "string") {
    return xss(data); // Transforme <script> en <script>
  }
  if (Array.isArray(data)) {
    return data.map((item) => clean(item));
  }
  if (typeof data === "object") {
    Object.keys(data).forEach((key) => {
      data[key] = clean(data[key]);
    });
  }
  return data;
};
const sanitizerMiddleware = (req, res, next) => {
  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);
  next();
};
module.exports = sanitizerMiddleware;
