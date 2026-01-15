🧪 Tester un backend Node / Express (MVC)

Ce document décrit **comment tester un backend** sans frontend, en utilisant **curl**  
→ méthode recommandée pour valider les routes, les statuts HTTP et la configuration serveur.

+ Ajout des commandes et aides pour les projets backend.

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

Tester si le serveur est UP avec le bon port définis dans le .env
```bash
curl.exe -I http://localhost:3000

```

## 📌 Commandes bash
```bash
chmod +x init-mvc.sh --> Donné les droits d'acces au fichier
./init-mvc.sh --> executer le int-mvc pour qu'il crée la structure MVC automatiquement avec les fichiers de base
```


```bash
npm audit
npm audit fix
```
### 📌 Aide - CMD utile 

```bash

docker compose config
docker compose logs -f app
docker compose ps
docker compose restart app

```
Principe de docker si on ne change pas .env / yml 
un simple restart sur le service modifié suffit.
Ex: redemarrer que le service app les autres continue de tourner. Gain de temps

De plus si nodemon est en script DEV et le fichier DockerFile contient le tableau de CMD
['npm','run', 'dev'] --> Reload automatique a chaque sauvegarde

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

Puppeteer :
https://pptr.dev/

AUDIT pour tester les librairies :

https://docs.npmjs.com/cli/v9/commands/npm-audit
