🧪 Tester un backend Node / Express (MVC)

Ce document décrit **comment tester un backend** sans frontend, en utilisant **curl**  
→ méthode recommandée pour valider les routes, les statuts HTTP et la configuration serveur.

---

## 🔧 Outil utilisé : `curl - PostMan` , `nodemon` , `dotenv`,  `dotreflect-metadatanv`, `typeorm`, 
`sqlite3`, `helmet`,`cors`,`passport`


> ⚠️ **Sous Windows (PowerShell / VS Code)**  
> Utiliser **`curl.exe`** (et non `curl`).

---

## 📌 Commandes `curl` essentielles

```bash
curl URL                     # GET simple
curl -I URL                  # Headers + status HTTP
curl -v URL                  # Debug complet (verbose)
curl -X POST URL             # Requête POST
curl -H "Content-Type: application/json" URL

```
example : 

Tester si le serveur est UP 
```bash
curl.exe -I http://localhost:8080

```

## 📌 Commandes bash
```bash
chmod +x init-mvc.sh --> Donné les droits d'acces au fichier
./init-mvc.sh --> executer le int-mvc pour qu'il crée la structure MVC automatiquement avec les fichiers de base
```

### 📌 Lien utile 

TypeORM :
https://typeorm.io/docs/guides/usage-with-javascript/

PassPort : 
https://www.passportjs.org/packages/passport-jwt/

dotenv : 
https://www.npmjs.com/package/dotenv

zod : 
https://www.npmjs.com/package/zod
https://zod.dev/

