🧪 Tester un backend Node / Express (MVC)

Ce document décrit **comment tester un backend** sans frontend, en utilisant **curl**  
→ méthode recommandée pour valider les routes, les statuts HTTP et la configuration serveur.

---

## 🔧 Outil utilisé : `curl`

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


example : 

Test si boostrap est UP

curl.exe -I http://localhost:8080/bootstrap/css/bootstrap.min.css

```

## 📌 Commandes

Lancer le script  pour initier la structure du projet

chmod +x init-mvc.sh
./init-mvc.sh