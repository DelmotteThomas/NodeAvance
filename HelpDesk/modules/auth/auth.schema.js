const { z } = require("zod");

// Schéma pour l'inscription (Register)
const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6)
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
      
  })
  .strict(); // ⬅️ supprime les champs inconnus (bonus)

// Schéma pour la connexion (Login)
const loginSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();
// Pas de restriction de longueur sur le LOGIN pour ne pas aider un attaquant

module.exports = { registerSchema, loginSchema };
